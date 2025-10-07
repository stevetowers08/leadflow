import { TableSkeleton } from "@/components/loading/LoadingSkeletons";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow as UITableRow } from "@/components/ui/table";
import { PaginationControls } from "@/components/utils/PaginationControls";
import { designTokens } from "@/design-system/tokens";
import { useToast } from "@/hooks/use-toast";
import { usePaginatedData } from "@/hooks/usePagination";
import { cn } from "@/lib/utils";
import { exportToCSV } from "@/utils/exportUtils";
import { Download } from "lucide-react";
import { ReactNode, useState } from "react";
import { TableBulkActions } from "../table/TableBulkActions";
import { TableRow } from "../table/TableRow";
import { TableSorting, useTableSorting } from "../table/TableSorting";


interface BulkAction<T> {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  action: (items: T[]) => Promise<void>;
  variant?: 'default' | 'destructive' | 'secondary';
  requiresConfirmation?: boolean;
  confirmationMessage?: string;
}

interface Column<T> {
  key: string;
  label: string;
  render: (item: T) => ReactNode;
  headerAlign?: "left" | "center" | "right";
  cellAlign?: "left" | "center" | "right";
  sortable?: boolean;
  width?: string;
}

interface DataTableProps<T> {
  title?: string;
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  addButton?: ReactNode;
  onRowClick?: (item: T) => void;
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
  enableVirtualization?: boolean;
  virtualizationThreshold?: number;
}

export function DataTable<T extends Record<string, any> & { id: string }>({
  title,
  data,
  columns,
  loading = false,
  addButton,
  onRowClick,
  pagination = { enabled: false },
  bulkActions = [],
  enableBulkActions = false,
  itemName = 'item',
  itemNamePlural = 'items',
  enableExport = false,
  exportFilename = 'export.csv',
}: DataTableProps<T>) {
  const [selectedItems, setSelectedItems] = useState<T[]>([]);
  const { toast } = useToast();

  // Use improved sorting hook
  const { sortedData, sortConfig, handleSort } = useTableSorting(data);

  // Use pagination if enabled
  const { paginatedData, pagination: paginationState } = usePaginatedData(
    sortedData,
    {
      pageSize: pagination.pageSize || 10,
    }
  );

  const displayData = pagination.enabled ? paginatedData : sortedData;

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
      
      {enableExport && (
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="default" 
            className="h-10 px-4"
            onClick={() => {
              exportToCSV(data, { filename: exportFilename });
              toast({
                title: "Export successful",
                description: `Data exported to ${exportFilename}`,
              });
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      )}

      <TableBulkActions
        selectedItems={selectedItems}
        onSelectionChange={setSelectedItems}
        allItems={displayData}
        onSelectAll={handleSelectAll}
        onClearSelection={handleClearSelection}
        actions={bulkActions}
        itemName={itemName}
        itemNamePlural={itemNamePlural}
        enableBulkActions={enableBulkActions}
      />

      <div className={cn("bg-white rounded-lg shadow-sm overflow-x-auto relative group", designTokens.borders.card)}>
        <div className="absolute top-0 right-0 bg-gradient-to-l from-background to-transparent w-6 h-full pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100 rounded-b-lg overflow-hidden">
          <div className="h-full bg-blue-500 opacity-0 group-hover:opacity-30 transition-opacity duration-200" style={{ width: '30%' }} />
        </div>
        <Table role="table" aria-label={title || "Data table"} className="min-w-full font-sans">
          <TableHeader>
            <UITableRow className="border-b border-gray-200 bg-gray-50/50">
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
              <TableSorting
                columns={columns}
                onSort={handleSort}
                sortConfig={sortConfig}
              />
            </UITableRow>
          </TableHeader>
          <TableBody>
            {displayData.length === 0 ? (
              <UITableRow>
                <TableCell
                  colSpan={columns.length + ((enableBulkActions || enableExport) ? 1 : 0)}
                  className="text-center py-12 text-muted-foreground"
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="text-4xl opacity-20">📋</div>
                    <div className="font-medium">
                      {`No ${title?.toLowerCase() || 'items'} found`}
                    </div>
                    <div className="text-sm text-muted-foreground/60">
                      {`Start by adding your first ${title?.toLowerCase().slice(0, -1) || 'item'}`}
                    </div>
                  </div>
                </TableCell>
              </UITableRow>
            ) : (
              displayData.map((item, index) => (
                <TableRow
                  key={item.id || index}
                  item={item}
                  index={index}
                  columns={columns}
                  onRowClick={onRowClick}
                  selectedItems={selectedItems}
                  onItemSelect={handleItemSelect}
                  enableBulkActions={enableBulkActions}
                  enableExport={enableExport}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {pagination.enabled && data.length > 0 && (
        <PaginationControls
          currentPage={paginationState.currentPage}
          totalPages={paginationState.totalPages}
          pageSize={paginationState.pageSize}
          totalItems={data.length}
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
      {!pagination.enabled && data.length > 0 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground bg-muted/20 px-4 py-2 rounded-md">
          <span>
            Showing {data.length} of {data.length} {title?.toLowerCase() || 'items'}
          </span>
          <div className="text-xs">
            Updated {new Date().toLocaleDateString()}
          </div>
        </div>
      )}
    </div>
  );
}