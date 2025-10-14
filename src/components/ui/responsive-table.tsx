import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import React from 'react';

interface MobileTableRowProps<T = Record<string, unknown>> {
  data: T;
  columns: Array<{
    key: string;
    label: string;
    render?: (value: unknown, row: T) => React.ReactNode;
    priority?: 'high' | 'medium' | 'low';
    badge?: boolean;
  }>;
  onClick?: () => void;
  className?: string;
}

export const MobileTableRow = <T extends Record<string, unknown>>({
  data,
  columns,
  onClick,
  className,
}: MobileTableRowProps<T>) => {
  const highPriorityColumns = columns.filter(col => col.priority === 'high');
  const mediumPriorityColumns = columns.filter(col => col.priority === 'medium');
  const lowPriorityColumns = columns.filter(col => col.priority === 'low');

  return (
    <Card 
      className={cn(
        "p-4 space-y-3 hover:shadow-md transition-all duration-200",
        onClick && "cursor-pointer hover:scale-[1.01]",
        className
      )}
      onClick={onClick}
    >
      {/* High priority columns - always visible */}
      <div className="space-y-2">
        {highPriorityColumns.map((column) => (
          <div key={column.key} className="flex justify-between items-start">
            <span className="text-sm font-medium text-gray-500 min-w-0 flex-shrink-0 mr-2">
              {column.label}:
            </span>
            <div className="text-sm text-gray-900 text-right min-w-0 flex-1">
              {column.render ? column.render(data[column.key], data) : (
                <span className="truncate block">
                  {data[column.key] || "-"}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Medium priority columns - collapsible */}
      {mediumPriorityColumns.length > 0 && (
        <details className="group">
          <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-600 transition-colors">
            More details
          </summary>
          <div className="mt-2 space-y-2 pt-2 border-t border-gray-100">
            {mediumPriorityColumns.map((column) => (
              <div key={column.key} className="flex justify-between items-start">
                <span className="text-xs font-medium text-gray-500 min-w-0 flex-shrink-0 mr-2">
                  {column.label}:
                </span>
                <div className="text-xs text-gray-700 text-right min-w-0 flex-1">
                  {column.render ? column.render(data[column.key], data) : (
                    <span className="truncate block">
                      {data[column.key] || "-"}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </details>
      )}

      {/* Low priority columns - badges */}
      {lowPriorityColumns.length > 0 && (
        <div className="flex flex-wrap gap-1 pt-2 border-t border-gray-100">
          {lowPriorityColumns.map((column) => (
            <Badge 
              key={column.key} 
              variant="secondary" 
              className="text-xs"
            >
              {column.label}: {data[column.key] || "-"}
            </Badge>
          ))}
        </div>
      )}
    </Card>
  );
};

interface ResponsiveTableProps<T = Record<string, unknown>> {
  data: T[];
  columns: Array<{
    key: string;
    label: string;
    render?: (value: unknown, row: T) => React.ReactNode;
    priority?: 'high' | 'medium' | 'low';
    width?: string;
    minWidth?: string;
    align?: 'left' | 'center' | 'right';
  }>;
  loading?: boolean;
  onRowClick?: (row: T) => void;
  className?: string;
  mobileBreakpoint?: 'sm' | 'md' | 'lg';
}

export const ResponsiveTable = <T extends Record<string, unknown> & { id: string }>({
  data,
  columns,
  loading = false,
  onRowClick,
  className,
  mobileBreakpoint = 'md',
}: ResponsiveTableProps<T>) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Desktop table - hidden on mobile */}
      <div className={`hidden ${mobileBreakpoint}:block`}>
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="sticky top-0 z-10 bg-white shadow-sm">
                <tr className="border-b border-gray-200 bg-gray-50/50">
                  {columns.map((column) => (
                    <th 
                      key={column.key}
                      className={cn(
                        "h-12 px-4 text-left align-middle font-medium text-muted-foreground",
                        "text-sm font-semibold tracking-wide bg-gray-50/80",
                        column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : 'text-left'
                      )}
                      style={{
                        width: column.width || 'auto',
                        minWidth: column.minWidth || 'auto'
                      }}
                    >
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => (
                  <tr 
                    key={row.id || index} 
                    className={cn(
                      "border-b border-gray-100 hover:bg-gray-50/80 hover:shadow-sm hover:border-gray-200 transition-colors duration-200",
                      onRowClick ? "cursor-pointer" : ""
                    )}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                  >
                    {columns.map((column) => (
                      <td 
                        key={column.key} 
                        className={cn(
                          "p-4 align-middle text-sm font-normal leading-tight",
                          column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : 'text-left'
                        )}
                        style={{
                          width: column.width || 'auto',
                          minWidth: column.minWidth || 'auto'
                        }}
                      >
                        {column.render ? column.render(row[column.key], row) : (
                          <div className="min-w-0">
                            <div className="text-sm leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
                              {row[column.key] || "-"}
                            </div>
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Mobile cards - visible on mobile */}
      <div className={`${mobileBreakpoint}:hidden space-y-3`}>
        {data.map((row, index) => (
          <MobileTableRow
            key={row.id || index}
            data={row}
            columns={columns}
            onClick={onRowClick ? () => onRowClick(row) : undefined}
          />
        ))}
      </div>
    </div>
  );
};
