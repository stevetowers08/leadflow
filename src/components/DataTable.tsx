import { ReactNode, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter } from "lucide-react";


interface Column<T> {
  key: string;
  label: string;
  render: (item: T) => ReactNode;
}

interface DataTableProps<T> {
  title: string;
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  addButton?: ReactNode;
}

export function DataTable<T extends Record<string, any>>({
  title,
  data,
  columns,
  loading = false,
  addButton,
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
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">{title}</h2>
        <div className="flex items-center justify-center py-8">
          <div className="text-xs text-muted-foreground">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        {addButton}
      </div>
      
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-3.5 w-3.5" />
          <Input
            placeholder={`Search ${title.toLowerCase()}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 h-8 text-xs"
          />
        </div>
        <Button variant="outline" size="sm" className="h-8 text-xs px-2">
          <Filter className="h-3 w-3 mr-1" />
          Filter
        </Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow className="border-b">
              {columns.map((column) => (
                <TableHead key={column.key} className="h-8 text-xs font-medium text-muted-foreground px-3 py-2">
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
                  className="text-center py-6 text-xs text-muted-foreground"
                >
                  {searchTerm
                    ? `No ${title.toLowerCase()} found matching "${searchTerm}"`
                    : `No ${title.toLowerCase()} found`}
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((item, index) => (
                <TableRow key={item.id || index} className="border-b last:border-0 hover:bg-muted/50">
                  {columns.map((column) => (
                    <TableCell key={column.key} className="px-3 py-2 text-xs">
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
        <div className="text-xs text-muted-foreground">
          {filteredData.length} of {data.length} {title.toLowerCase()}
        </div>
      )}
    </div>
  );
}