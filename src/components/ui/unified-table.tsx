import { cn } from '@/lib/utils';
import { getUnifiedStatusClass } from '@/utils/colorScheme';
import React from 'react';
import '../../styles/table-system.css';

// TypeScript Interfaces for Column Configuration
export interface ColumnConfig<T = unknown> {
  key: string;
  label: string;
  width?: string;
  minWidth?: string;
  cellType?: 'status' | 'priority' | 'ai-score' | 'lead-score' | 'regular';
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  render?: (value: unknown, row: T, index: number) => React.ReactNode;
  className?: string;
  getStatusValue?: (row: T) => string; // For status cells to get the status value
}

export interface UnifiedTableProps<T = unknown> {
  data: T[];
  columns: ColumnConfig<T>[];
  pagination?: boolean;
  stickyHeaders?: boolean;
  maxHeight?: string;
  className?: string;
  onRowClick?: (row: T, index: number) => void;
  loading?: boolean;
  emptyMessage?: string;
}

// Compound Component Pattern - Table Sub-components
export const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn(
      'transition-colors data-[state=selected]:bg-muted hover:bg-muted/50 border-b border-gray-200 bg-gray-50/50',
      className
    )}
    {...props}
  />
));

export const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn('', className)} {...props} />
));

export const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement> & {
    onClick?: () => void;
    index?: number;
  }
>(({ className, onClick, index, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      'data-[state=selected]:bg-muted border-b border-gray-200 hover:bg-gray-50/80 hover:shadow-sm hover:border-gray-300 transition-colors duration-200 group cursor-pointer relative min-h-[48px]',
      onClick && 'cursor-pointer',
      className
    )}
    role='row'
    tabIndex={0}
    aria-label={`Row ${(index || 0) + 1}`}
    onClick={onClick}
    {...props}
  />
));

export const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement> & {
    cellType?: ColumnConfig['cellType'];
    align?: ColumnConfig['align'];
    statusValue?: string; // For status cells to get unified colors
  }
>(({ className, cellType, align = 'left', statusValue, ...props }, ref) => {
  const dataAttributes = cellType ? { 'data-cell-type': cellType } : {};

  // Memoize status classes to prevent recalculation on every render
  const statusClasses = React.useMemo(() => {
    if (cellType === 'status' && statusValue) {
      return getUnifiedStatusClass(statusValue);
    }
    if (cellType === 'ai-score' && statusValue) {
      return getUnifiedStatusClass(statusValue);
    }
    return '';
  }, [cellType, statusValue]);

  return (
    <td
      ref={ref}
      className={cn(
        'align-middle [&:has([role=checkbox])]:pr-0 px-4 border-r border-gray-200 last:border-r-0 group-hover:border-r-gray-300 group-hover:last:border-r-0 min-h-[44px]',
        align === 'center' && 'text-center',
        align === 'right' && 'text-right',
        // Apply table-system CSS classes for cell types
        cellType && 'table-system-cell',
        // Apply unified status colors for full-cell backgrounds
        statusClasses,
        className
      )}
      {...dataAttributes}
      {...props}
    />
  );
});

export const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement> & {
    align?: ColumnConfig['align'];
  }
>(({ className, align = 'left', ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      'align-middle [&:has([role=checkbox])]:pr-0 text-sm font-semibold tracking-wide bg-gray-50/80 backdrop-blur-sm',
      align === 'center' && 'text-center',
      align === 'right' && 'text-right',
      className
    )}
    {...props}
  />
));

// Main UnifiedTable Component
export const UnifiedTable = React.memo(
  <T,>({
    data,
    columns,
    pagination = true,
    stickyHeaders = true,
    maxHeight = '500px',
    className,
    onRowClick,
    loading = false,
    emptyMessage = 'No data available',
  }: UnifiedTableProps<T>) => {
    // Memoize the table structure to prevent unnecessary re-renders
    const tableStructure = React.useMemo(() => {
      if (loading) {
        return (
          <div className='bg-white rounded-lg border border-gray-200 w-full overflow-hidden'>
            <div className='flex items-center justify-center h-32'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
            </div>
          </div>
        );
      }

      if (!data || data.length === 0) {
        return (
          <div className='bg-white rounded-lg border border-gray-200 w-full overflow-hidden'>
            <div className='flex items-center justify-center h-32 text-gray-500'>
              {emptyMessage}
            </div>
          </div>
        );
      }

      return (
        <div
          className={cn(
            'bg-white rounded-lg border border-gray-200 w-full overflow-x-auto',
            className
          )}
        >
          <table className='table-system w-full'>
            <TableHeader>
              <tr>
                {columns.map(column => (
                  <TableHead
                    key={column.key}
                    scope='col'
                    align={column.align}
                    className={
                      column.label === '' ? 'border-none bg-transparent' : ''
                    }
                    style={{
                      width: column.width,
                      minWidth: column.minWidth || column.width,
                    }}
                  >
                    <div
                      className={cn(
                        'flex items-center gap-2',
                        column.align === 'center' && 'justify-center',
                        column.align === 'right' && 'justify-end'
                      )}
                    >
                      <span>{column.label}</span>
                    </div>
                  </TableHead>
                ))}
              </tr>
            </TableHeader>

            <TableBody>
              {data.map((row, index) => (
                <TableRow
                  key={index}
                  index={index}
                  onClick={() => onRowClick?.(row, index)}
                >
                  {columns.map(column => {
                    const value = (row as Record<string, unknown>)[column.key];

                    // Get status value for status and ai-score cells
                    const statusValue =
                      (column.cellType === 'status' ||
                        column.cellType === 'ai-score') &&
                      column.getStatusValue
                        ? column.getStatusValue(row)
                        : undefined;

                    return (
                      <TableCell
                        key={column.key}
                        cellType={column.cellType}
                        align={column.align}
                        statusValue={statusValue}
                        style={{
                          width: column.width,
                          minWidth: column.minWidth || column.width,
                        }}
                      >
                        <div>
                          {column.render ? (
                            column.render(value, row, index)
                          ) : (
                            <span>{value || '-'}</span>
                          )}
                        </div>
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </table>
        </div>
      );
    }, [data, columns, loading, emptyMessage, className, onRowClick]);

    return tableStructure;
  }
) as <T>(props: UnifiedTableProps<T>) => JSX.Element;

// Export compound components for advanced usage
UnifiedTable.Header = TableHeader;
UnifiedTable.Body = TableBody;
UnifiedTable.Row = TableRow;
UnifiedTable.Cell = TableCell;
UnifiedTable.Head = TableHead;

export default UnifiedTable;
