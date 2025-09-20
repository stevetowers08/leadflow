import { ReactNode, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";


interface Column<T> {
  key: string;
  label: string;
  render: (item: T) => ReactNode;
}

interface DataTableProps<T> {
  title?: string;
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  addButton?: ReactNode;
  onRowClick?: (item: T) => void;
  showSearch?: boolean;
}

export function DataTable<T extends Record<string, any>>({
  title,
  data,
  columns,
  loading = false,
  addButton,
  onRowClick,
  showSearch = true,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = data.filter((item) => {
    if (!searchTerm) return true;
    
    return Object.values(item).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (loading) {
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
          </div>
        )}
        <div className="bg-card border border-border rounded-lg shadow-sm p-12">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-3 text-muted-foreground">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
              <span>Loading {title?.toLowerCase() || 'data'}...</span>
            </div>
          </div>
        </div>
      </div>
    );
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
        </div>
      )}

      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b bg-muted/30">
              {columns.map((column) => (
                <TableHead 
                  key={column.key} 
                  className="h-12 px-6 text-sm font-semibold text-muted-foreground uppercase tracking-wider"
                >
                  {column.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
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
              filteredData.map((item, index) => (
                <TableRow 
                  key={item.id || index} 
                  className={cn(
                    "border-b border-border/50 hover:bg-muted/20 transition-colors duration-150",
                    "group cursor-pointer"
                  )}
                  onClick={() => onRowClick?.(item)}
                >
                  {columns.map((column) => (
                    <TableCell key={column.key} className="px-6 py-4">
                      {column.render(item)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {filteredData.length > 0 && (
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