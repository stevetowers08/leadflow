import { cn } from '@/lib/utils';
import { getUnifiedStatusClass } from '@/utils/colorScheme';
import React from 'react';

// TypeScript Interfaces for Column Configuration
export interface ColumnConfig<T = unknown> {
  key: string;
  label: string | React.ReactNode;
  width?: string;
  minWidth?: string;
  cellType?: 'status' | 'priority' | 'ai-score' | 'lead-score' | 'regular';
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  render?: (value: unknown, row: T, index: number) => React.ReactNode;
  className?: string;
  getStatusValue?: (row: T) => string; // For status cells to get the status value
}

export interface TableGroup<T = unknown> {
  label: string;
  count: number;
  data: T[];
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
  grouped?: boolean;
  groups?: TableGroup<T>[];
  expandedGroups?: Set<string>;
  onToggleGroup?: (groupLabel: string) => void;
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
  <tbody
    ref={ref}
    className={cn('[&_tr_td]:border-b [&_tr_td]:border-gray-200', className)}
    {...props}
  />
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
      'cursor-pointer group h-[46px]',
      'hover:bg-gray-100 border-l-2 border-transparent hover:border-l-2 hover:border-primary-400',
      onClick && 'cursor-pointer',
      className
    )}
    role='row'
    tabIndex={onClick ? 0 : undefined}
    aria-label={onClick ? `Row ${(index || 0) + 1}` : undefined}
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
        // Status cells: no padding, relative positioning, apply background colors directly
        // Regular cells: standard padding
        cellType === 'status' ? 'p-0 relative' : 'px-4 py-2',
        'text-sm border-r border-gray-200 last:border-r-0 text-gray-700',
        // Don't apply hover text color change to status cells (they have colored backgrounds)
        cellType !== 'status' && 'group-hover:text-gray-600',
        align === 'center' && 'text-center',
        align === 'right' && 'text-right',
        // Apply unified status colors for full-cell backgrounds on the td
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
        'px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide border-r border-gray-200 last:border-r-0 whitespace-nowrap',
        'border-b border-gray-200',
        'transition-colors duration-150',
        isFirst && 'rounded-tl-lg',
        isLast && 'rounded-tr-lg',
        align === 'center' && 'text-center',
        align === 'right' && 'text-right',
        className
      )}
      style={props.style}
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
    grouped = false,
    groups,
    expandedGroups,
    onToggleGroup,
  }: UnifiedTableProps<T>) => {
    // State for scroll-based shadow - optimized for performance
    const [isScrolled, setIsScrolled] = React.useState(false);
    const scrollContainerRef = React.useRef<HTMLDivElement>(null);

    // Optimized scroll handler with requestAnimationFrame for smooth performance
    const handleScroll = React.useCallback(() => {
      if (!scrollContainerRef.current) return;

      requestAnimationFrame(() => {
        if (!scrollContainerRef.current) return;
        const scrollTop = scrollContainerRef.current.scrollTop;
        setIsScrolled(scrollTop > 0);
      });
    }, []);

    // Optimized scroll listener
    React.useEffect(() => {
      if (!scrollable || !scrollContainerRef.current) return;

      const container = scrollContainerRef.current;
      container.addEventListener('scroll', handleScroll, { passive: true });

      return () => container.removeEventListener('scroll', handleScroll);
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
            scrollable
              ? 'flex flex-col h-full'
              : 'overflow-x-auto scrollbar-modern'
          )}
        >
          <div
            ref={scrollContainerRef}
            className={cn(
              scrollable
                ? 'flex-1 min-h-0 overflow-auto table-scroll scrollbar-modern'
                : 'w-full'
            )}
            style={
              scrollable
                ? {
                    contain: 'strict',
                    contentVisibility: 'auto',
                  }
                : undefined
            }
          >
            <table
              className='w-full border-separate border-spacing-0'
              style={{
                tableLayout: 'fixed',
                width: '100%',
              }}
            >
              <TableHeader
                className={cn(
                  scrollable && 'sticky top-0 z-30 bg-gray-50',
                  !scrollable && 'bg-gray-50',
                  isScrolled &&
                    scrollable &&
                    'shadow-[0_1px_3px_rgba(0,0,0,0.08)]'
                )}
              >
                <tr>
                  {columns.map((column, index) => {
                    // Handle different label types
                    const labelContent = React.isValidElement(column.label)
                      ? column.label
                      : typeof column.label === 'string'
                        ? column.label
                        : '';

                    return (
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
                        {labelContent}
                      </TableHead>
                    );
                  })}
                </tr>
              </TableHeader>

              <TableBody>
                {(() => {
                  return grouped &&
                    groups &&
                    Array.isArray(groups) &&
                    groups.length > 0 &&
                    expandedGroups
                    ? // Render grouped data
                      groups.map((group, groupIndex) => {
                        const isExpanded = expandedGroups.has(group.label);
                        const shouldRender = group.data.length > 0;

                        if (!shouldRender) return null;

                        return (
                          <React.Fragment
                            key={`group-${group.label}-${groupIndex}`}
                          >
                            {/* Spacer between groups */}
                            {groupIndex > 0 && (
                              <TableRow className='h-4 bg-transparent pointer-events-none border-0'>
                                <TableCell
                                  colSpan={columns.length}
                                  className='p-0 border-0'
                                />
                              </TableRow>
                            )}

                            {/* Group Header Row */}
                            <TableRow
                              className='bg-gray-100 hover:bg-gray-200 border-l-4 border-l-primary cursor-pointer'
                              onClick={() => onToggleGroup?.(group.label)}
                            >
                              <TableCell
                                colSpan={columns.length}
                                className='font-semibold text-sm text-gray-900 py-3'
                              >
                                <div className='flex items-center justify-between'>
                                  <span>{group.label}</span>
                                  <div className='flex items-center gap-3'>
                                    <span className='text-xs font-normal text-gray-600'>
                                      {group.count}
                                    </span>
                                    <span className='text-xs'>
                                      {isExpanded ? '−' : '+'}
                                    </span>
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>

                            {/* Group Rows */}
                            {isExpanded &&
                              group.data.map((row, index) => (
                                <TableRow
                                  key={`${group.label}-${index}`}
                                  index={index}
                                  onClick={() => onRowClick?.(row, index)}
                                  className='bg-white'
                                >
                                  {columns.map((column, colIndex) => {
                                    const statusValue =
                                      (column.cellType === 'status' ||
                                        column.cellType === 'ai-score') &&
                                      column.getStatusValue
                                        ? column.getStatusValue(row)
                                        : undefined;

                                    const value = (
                                      row as Record<string, unknown>
                                    )[column.key];

                                    return (
                                      <TableCell
                                        key={`${group.label}-${index}-${colIndex}`}
                                        cellType={column.cellType}
                                        align={column.align}
                                        statusValue={statusValue}
                                        style={{
                                          width: column.width,
                                          minWidth:
                                            column.minWidth || column.width,
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
                          </React.Fragment>
                        );
                      })
                    : // Render ungrouped data
                      data.map((row, index) => (
                        <TableRow
                          key={index}
                          index={index}
                          onClick={() => onRowClick?.(row, index)}
                        >
                          {columns.map((column, colIndex) => {
                            // Get status value for status and ai-score cells
                            const statusValue =
                              (column.cellType === 'status' ||
                                column.cellType === 'ai-score') &&
                              column.getStatusValue
                                ? column.getStatusValue(row)
                                : undefined;

                            // Extract the value for this column
                            const value = (row as Record<string, unknown>)[
                              column.key
                            ];

                            return (
                              <TableCell
                                key={`${index}-${colIndex}`}
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
                      ));
                })()}
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
      onRowClick,
      scrollable,
      isScrolled,
      grouped,
      groups,
      expandedGroups,
      onToggleGroup,
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
