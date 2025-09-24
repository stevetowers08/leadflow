import { ReactNode, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, MoreHorizontal, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { TableSkeleton } from "@/components/LoadingSkeletons";
import { PaginationControls } from "@/components/PaginationControls";
import { usePaginatedData } from "@/hooks/usePagination";
import { BulkActions, BulkAction, createBulkActions } from "@/components/BulkActions";
import { useToast } from "@/hooks/use-toast";
import { exportToCSV } from "@/utils/exportUtils";


interface Column<T> {
  key: string;
  label: string;
  render: (item: T) => ReactNode;
  headerAlign?: "left" | "center" | "right";
  cellAlign?: "left" | "center" | "right";
  sortable?: boolean;
}

interface DataTableProps<T> {
  title?: string;
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  addButton?: ReactNode;
  onRowClick?: (item: T) => void;
  showSearch?: boolean;
  pagination?: {
    enabled: boolean;
    pageSize?: number;
    pageSizeOptions?: number[];
    showPageSizeSelector?: boolean;
    showItemCount?: boolean;
  };
  bulkActions?: BulkAction<T>[];
  enableBulkActions?: boolean;
  itemName?: string;
  itemNamePlural?: string;
  enableExport?: boolean;
  exportFilename?: string;
}

export function DataTable<T extends Record<string, any>>({
  title,
  data,
  columns,
  loading = false,
  addButton,
  onRowClick,
  showSearch = true,
  pagination = { enabled: false },
  bulkActions = [],
  enableBulkActions = false,
  itemName = 'item',
  itemNamePlural = 'items',
  enableExport = false,
  exportFilename = 'export.csv',
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState<T[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const { toast } = useToast();

  const filteredData = data.filter((item) => {
    if (!searchTerm) return true;
    
    return Object.values(item).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Sorting logic
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig) return 0;
    
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    // Handle date sorting
    if (sortConfig.key === 'created_at' || sortConfig.key === 'updated_at') {
      const aDate = new Date(aValue || 0);
      const bDate = new Date(bValue || 0);
      return sortConfig.direction === 'asc' ? aDate.getTime() - bDate.getTime() : bDate.getTime() - aDate.getTime();
    }
    
    // Handle string sorting
    const aStr = String(aValue || '').toLowerCase();
    const bStr = String(bValue || '').toLowerCase();
    
    if (aStr < bStr) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aStr > bStr) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  // Use pagination if enabled
  const { paginatedData, pagination: paginationState } = usePaginatedData(
    sortedData,
    {
      pageSize: pagination.pageSize || 10,
    }
  );

  const displayData = pagination.enabled ? paginatedData : sortedData;

  // Sorting handler
  const handleSort = (key: string) => {
    setSortConfig(prevConfig => {
      if (prevConfig?.key === key) {
        // Toggle direction if same column
        return {
          key,
          direction: prevConfig.direction === 'asc' ? 'desc' : 'asc'
        };
      } else {
        // New column, default to ascending
        return { key, direction: 'asc' };
      }
    });
  };

  // Bulk actions handlers
  const handleSelectAll = () => {
    if (selectedItems.length === displayData.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems([...displayData]);
    }
  };

  const handleClearSelection = () => {
    setSelectedItems([]);
  };

  const handleItemSelect = (item: T, checked: boolean) => {
    if (checked) {
      setSelectedItems(prev => [...prev, item]);
    } else {
      setSelectedItems(prev => prev.filter(selected => selected.id !== item.id));
    }
  };


  // Create default bulk actions if none provided
  const allBulkActions = [...bulkActions];

  if (loading) {
    return <TableSkeleton rows={pagination.pageSize || 10} columns={columns.length} />;
  }

  return (
    <div className="space-y-6">
      {title && (
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Manage and track your {title.toLowerCase()} pipeline
            </p>
          </div>
          {addButton}
        </div>
      )}
      
      {showSearch && (
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={`Search ${title?.toLowerCase() || 'items'}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 bg-background border-input"
            />
          </div>
          <Button variant="outline" size="default" className="h-10 px-4">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          {enableExport && (
            <Button 
              variant="outline" 
              size="default" 
              className="h-10 px-4"
              onClick={() => {
                exportToCSV(filteredData, { filename: exportFilename });
                toast({
                  title: "Export successful",
                  description: `Data exported to ${exportFilename}`,
                });
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          )}
        </div>
      )}

      {/* Bulk Actions */}
      {enableBulkActions && (
        <BulkActions
          selectedItems={selectedItems}
          onSelectionChange={setSelectedItems}
          allItems={displayData}
          onSelectAll={handleSelectAll}
          onClearSelection={handleClearSelection}
          actions={allBulkActions}
          itemName={itemName}
          itemNamePlural={itemNamePlural}
        />
      )}

      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        <Table role="table" aria-label={title || "Data table"}>
          <TableHeader>
            <TableRow className="border-b bg-muted/30">
              {(enableBulkActions || enableExport) && (
                <TableHead className="h-12 px-6 text-sm font-semibold text-muted-foreground uppercase tracking-wider w-12">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === displayData.length && displayData.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-input"
                    aria-label="Select all items"
                  />
                </TableHead>
              )}
              {columns.map((column) => (
                <TableHead 
                  key={column.key} 
                  className={cn(
                    "h-12 px-6 text-sm font-semibold text-muted-foreground uppercase tracking-wider",
                    column.headerAlign === "center" && "text-center",
                    column.headerAlign === "right" && "text-right"
                  )}
                  scope="col"
                >
                  {column.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + ((enableBulkActions || enableExport) ? 1 : 0)}
                  className="text-center py-12 text-muted-foreground"
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="text-4xl opacity-20">📋</div>
                    <div className="font-medium">
                      {searchTerm
                        ? `No ${title?.toLowerCase() || 'items'} found matching "${searchTerm}"`
                        : `No ${title?.toLowerCase() || 'items'} found`}
                    </div>
                    <div className="text-sm text-muted-foreground/60">
                      {searchTerm ? "Try adjusting your search terms" : `Start by adding your first ${title?.toLowerCase().slice(0, -1) || 'item'}`}
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              displayData.map((item, index) => (
                <TableRow 
                  key={item.id || index} 
                  className={cn(
                    "border-b border-border/50 hover:bg-muted/20 transition-colors duration-150",
                    "group cursor-pointer",
                    selectedItems.some(selected => selected.id === item.id) && "bg-primary/5"
                  )}
                  onClick={() => onRowClick?.(item)}
                  role="row"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onRowClick?.(item);
                    }
                  }}
                  aria-label={`Row ${index + 1}: ${columns.map(col => col.render(item)).join(', ')}`}
                >
                  {(enableBulkActions || enableExport) && (
                    <TableCell 
                      className="px-6 py-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={selectedItems.some(selected => selected.id === item.id)}
                        onChange={(e) => handleItemSelect(item, e.target.checked)}
                        className="rounded border-input"
                        aria-label={`Select ${item.name || item.title || `item ${index + 1}`}`}
                      />
                    </TableCell>
                  )}
                  {columns.map((column) => (
                    <TableCell 
                      key={column.key} 
                      className={cn(
                        "px-6 py-4",
                        column.cellAlign === "center" && "text-center",
                        column.cellAlign === "right" && "text-right"
                      )}
                    >
                      {column.render(item)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {pagination.enabled && filteredData.length > 0 && (
        <PaginationControls
          currentPage={paginationState.currentPage}
          totalPages={paginationState.totalPages}
          pageSize={paginationState.pageSize}
          totalItems={filteredData.length}
          onPageChange={paginationState.goToPage}
          onPageSizeChange={paginationState.setPageSize}
          visiblePages={paginationState.visiblePages}
          showFirstEllipsis={paginationState.showFirstEllipsis}
          showLastEllipsis={paginationState.showLastEllipsis}
          hasNextPage={paginationState.hasNextPage}
          hasPreviousPage={paginationState.hasPreviousPage}
          pageSizeOptions={pagination.pageSizeOptions}
          showPageSizeSelector={pagination.showPageSizeSelector}
          showItemCount={pagination.showItemCount}
        />
      )}

      {/* Legacy item count for non-paginated tables */}
      {!pagination.enabled && filteredData.length > 0 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground bg-muted/20 px-4 py-2 rounded-md">
          <span>
            Showing {filteredData.length} of {data.length} {title?.toLowerCase() || 'items'}
          </span>
          <div className="text-xs">
            Updated {new Date().toLocaleDateString()}
          </div>
        </div>
      )}
    </div>
  );
}