import { cn } from '@/lib/utils';
import { getUnifiedStatusClass } from '@/utils/colorScheme';
import React from 'react';

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
  scrollable?: boolean;
}

// Compound Component Pattern - Table Sub-components
export const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn('bg-gray-50', className)} {...props} />
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
      'hover:bg-gray-50 transition-colors duration-150 cursor-pointer',
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
        'px-4 py-2 text-sm',
        align === 'center' && 'text-center',
        align === 'right' && 'text-right',
        // Apply unified status colors for full-cell backgrounds
        statusClasses,
        className
      )}
      {...props}
    />
  );
});

export const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement> & {
    align?: ColumnConfig['align'];
    isFirst?: boolean;
    isLast?: boolean;
  }
>(
  (
    { className, align = 'left', isFirst = false, isLast = false, ...props },
    ref
  ) => (
    <th
      ref={ref}
      className={cn(
        'px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide',
        isFirst && 'rounded-tl-lg',
        isLast && 'rounded-tr-lg',
        align === 'center' && 'text-center',
        align === 'right' && 'text-right',
        className
      )}
      {...props}
    />
  )
);

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
    scrollable = false,
  }: UnifiedTableProps<T>) => {
    // State for scroll-based shadow
    const [isScrolled, setIsScrolled] = React.useState(false);
    const scrollContainerRef = React.useRef<HTMLDivElement>(null);

    // Handle scroll events to show/hide shadow
    const handleScroll = React.useCallback(() => {
      if (scrollContainerRef.current) {
        const scrollTop = scrollContainerRef.current.scrollTop;
        setIsScrolled(scrollTop > 0);
      }
    }, []);

    // Add scroll listener when scrollable
    React.useEffect(() => {
      const container = scrollContainerRef.current;
      if (scrollable && container) {
        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
      }
    }, [scrollable, handleScroll]);

    // Memoize the table structure to prevent unnecessary re-renders
    const tableStructure = React.useMemo(() => {
      if (loading) {
        return (
          <div className='bg-card rounded-lg border shadow-sm w-full overflow-hidden'>
            <div className='flex items-center justify-center h-32'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
            </div>
          </div>
        );
      }

      if (!data || data.length === 0) {
        return (
          <div className='bg-card rounded-lg border shadow-sm w-full overflow-hidden'>
            <div className='flex items-center justify-center h-32 text-gray-500'>
              {emptyMessage}
            </div>
          </div>
        );
      }

      return (
        <div
          className={cn(
            'bg-card rounded-lg border shadow-sm w-full overflow-hidden',
            scrollable ? 'flex-1 flex flex-col min-h-0' : 'overflow-x-auto'
          )}
        >
          <div
            ref={scrollContainerRef}
            className={cn(
              scrollable ? 'flex-1 overflow-auto min-h-0' : 'w-full'
            )}
            style={
              scrollable ? { maxHeight: 'calc(100vh - 200px)' } : undefined
            }
          >
            <table className='w-full'>
              <TableHeader
                className={
                  scrollable
                    ? `sticky top-0 z-20 ${isScrolled ? 'shadow-sm' : ''}`
                    : ''
                }
              >
                <tr>
                  {columns.map((column, index) => (
                    <TableHead
                      key={column.key}
                      scope='col'
                      align={column.align}
                      isFirst={index === 0}
                      isLast={index === columns.length - 1}
                      style={{
                        width: column.width,
                        minWidth: column.minWidth || column.width,
                      }}
                    >
                      {column.label}
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
                      const value = (row as Record<string, unknown>)[
                        column.key
                      ];

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
                          {column.render ? (
                            column.render(value, row, index)
                          ) : (
                            <span>{value || '-'}</span>
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </table>
          </div>
        </div>
      );
    }, [
      data,
      columns,
      loading,
      emptyMessage,
      className,
      onRowClick,
      scrollable,
      isScrolled,
    ]);

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
