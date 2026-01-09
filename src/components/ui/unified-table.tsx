'use client';

import { cn } from '@/lib/utils';
import { getUnifiedStatusClass } from '@/utils/colorScheme';
import React from 'react';
import {
  ColumnOrderState,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table';
import {
  getUserTablePreferences,
  loadLocalTablePreferences,
  persistLocalTablePreferences,
  saveUserTablePreferences,
  type TablePreferences,
} from '@/services/userSettingsService';
import {
  TableHeader as ShadcnTableHeader,
  TableBody as ShadcnTableBody,
  TableRow as ShadcnTableRow,
  TableCell as ShadcnTableCell,
  TableHead as ShadcnTableHead,
} from '@/components/ui/table';

// TypeScript Interfaces for Column Configuration
export interface ColumnConfig<T = unknown> {
  key: string;
  label: string | React.ReactNode;
  width?: string;
  minWidth?: string;
  maxWidth?: string;
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
  tableId?: string; // used to persist per-table preferences
  getRowClassName?: (row: T, index: number) => string; // Custom row className
  getRowProps?: (
    row: T,
    index: number
  ) => { isEnriched?: boolean; className?: string }; // Row-specific props
}

// Compound Component Pattern - Table Sub-components
// Extend shadcn TableHeader with additional styling
export const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <ShadcnTableHeader ref={ref} className={className} {...props} />
));
TableHeader.displayName = 'TableHeader';

export const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <ShadcnTableBody
    ref={ref}
    className={cn('[&_tr_td]:border-b [&_tr_td]:border-border', className)}
    {...props}
  />
));
TableBody.displayName = 'TableBody';

export const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement> & {
    onClick?: () => void;
    index?: number;
    isEnriched?: boolean;
  }
>(({ className, onClick, index, isEnriched, children, ...props }, ref) => {
  const handleClick = (e: React.MouseEvent<HTMLTableRowElement>) => {
    const target = e.target as HTMLElement;
    if (
      target.closest('button') ||
      target.closest('[role="button"]') ||
      target.closest('[data-bulk-checkbox]')
    ) {
      return;
    }
    onClick?.();
  };

  return (
    <ShadcnTableRow
      ref={ref}
      className={cn(
        'group h-[40px]',
        onClick && 'cursor-pointer',
        'hover:bg-muted',
        className
      )}
      role='row'
      tabIndex={onClick ? 0 : undefined}
      aria-label={onClick ? `Row ${(index || 0) + 1}` : undefined}
      onClick={handleClick}
      onKeyDown={
        onClick
          ? e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      {...props}
    >
      {children}
    </ShadcnTableRow>
  );
});
TableRow.displayName = 'TableRow';

export const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement> & {
    cellType?: ColumnConfig['cellType'];
    align?: ColumnConfig['align'];
    statusValue?: string;
    isLast?: boolean;
  }
>(
  (
    {
      className,
      cellType,
      align = 'left',
      statusValue,
      isLast = false,
      ...props
    },
    ref
  ) => {
    const statusClasses = React.useMemo(() => {
      if ((cellType === 'status' || cellType === 'ai-score') && statusValue) {
        return getUnifiedStatusClass(statusValue);
      }
      return '';
    }, [cellType, statusValue]);

    return (
      <ShadcnTableCell
        ref={ref}
        className={cn(
          'px-4 py-1',
          'text-sm text-muted-foreground',
          'box-border relative',
          // Column borders: right border on all cells except last
          !isLast && 'border-r border-border',
          cellType !== 'status' && 'group-hover:text-muted-foreground',
          align === 'center' && 'text-center',
          align === 'right' && 'text-right',
          statusClasses,
          'overflow-hidden break-words',
          className
        )}
        style={props.style}
        {...props}
      />
    );
  }
);
TableCell.displayName = 'TableCell';

export const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement> & {
    align?: ColumnConfig['align'];
    isFirst?: boolean;
    isLast?: boolean;
    isSticky?: boolean;
  }
>(
  (
    {
      className,
      align = 'left',
      isFirst = false,
      isLast = false,
      isSticky = false,
      ...props
    },
    ref
  ) => {
    const baseStyle = {
      ...(isSticky && {
        position: 'sticky' as const,
        top: 0,
        zIndex: 30,
        backgroundColor: 'var(--muted)',
      }),
      ...props.style,
    };

    return (
      <ShadcnTableHead
        ref={ref}
        className={cn(
          'px-4 py-1 h-[40px]',
          'text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap',
          'border-b border-border',
          // Column borders: right border on all headers except last
          !isLast && 'border-r border-border',
          'box-border',
          isFirst && 'rounded-tl-md',
          isLast && 'rounded-tr-md',
          align === 'center' && 'text-center',
          align === 'right' && 'text-right',
          align === 'left' && 'text-left',
          className
        )}
        style={baseStyle}
        {...props}
      />
    );
  }
);
TableHead.displayName = 'TableHead';

// Helper function to calculate column width styles consistently
// This ensures colgroup, headers, and cells all use the same width logic
function getColumnWidthStyle(
  column: ColumnConfig,
  isSelectColumn: boolean
): React.CSSProperties {
  if (isSelectColumn) {
    return { width: '48px', minWidth: '48px', maxWidth: '48px' };
  }
  const width = column.width || column.minWidth;
  if (width) {
    return {
      width: width,
      minWidth: column.minWidth || width,
      maxWidth: column.maxWidth || undefined,
    };
  }
  return { width: 'auto', minWidth: '150px' };
}

// Main UnifiedTable Component
function UnifiedTableComponent<T = unknown>({
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
  tableId,
  getRowClassName,
  getRowProps,
}: UnifiedTableProps<T>) {
  // ----- Column order (TanStack Table headless) -----
  const initialOrder = React.useRef<ColumnOrderState>([]);

  const [columnOrder, setColumnOrder] = React.useState<ColumnOrderState>(
    () => initialOrder.current
  );

  // Build lightweight column defs for TanStack to manage order
  const tsColumns = React.useMemo<ColumnDef<T, unknown>[]>(
    () =>
      columns.map(col => ({
        id: col.key,
        header: () => (typeof col.label === 'string' ? col.label : col.label),
        accessorFn: (row: T) => (row as Record<string, unknown>)[col.key],
        // We render cells ourselves, so cell isn't needed here
        size: col.width ? parseInt(col.width, 10) : undefined,
        minSize: col.minWidth ? parseInt(col.minWidth, 10) : undefined,
      })),
    [columns]
  );

  const table = useReactTable({
    data, // provide real data (unused for rendering, but harmless)
    columns: tsColumns,
    getCoreRowModel: getCoreRowModel(),
    state: { columnOrder },
    onColumnOrderChange: updater => {
      setColumnOrder(prev => {
        const next = typeof updater === 'function' ? updater(prev) : updater;
        if (tableId)
          persistLocalTablePreferences(tableId, { columnOrder: next });
        return next;
      });
    },
  });

  // Load preferences (local first, then Supabase)
  React.useEffect(() => {
    let active = true;
    if (!tableId) return;
    const local = loadLocalTablePreferences(tableId);
    if (local) {
      if (local.columnOrder && active) setColumnOrder(local.columnOrder);
    }
    getUserTablePreferences(tableId).then(remote => {
      if (!active || !remote) return;
      if (remote.columnOrder)
        setColumnOrder(remote.columnOrder as ColumnOrderState);
    });
    return () => {
      active = false;
    };
  }, [tableId]);

  // Debounced remote save
  const saveDebounced = React.useRef<number | null>(null);
  const queueSave = React.useCallback(
    (prefs: TablePreferences) => {
      if (!tableId) return;
      if (saveDebounced.current) window.clearTimeout(saveDebounced.current);
      saveDebounced.current = window.setTimeout(() => {
        saveUserTablePreferences(tableId, prefs);
      }, 600);
    },
    [tableId]
  );

  React.useEffect(() => {
    if (!tableId) return;
    queueSave({ columnOrder });
    return () => {
      if (saveDebounced.current) {
        window.clearTimeout(saveDebounced.current);
      }
    };
  }, [columnOrder, queueSave, tableId]);
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
        <div className='bg-card rounded-md border shadow-sm w-full overflow-hidden'>
          <div className='border-b bg-muted/30 p-4'>
            <div className='flex gap-4'>
              {Array.from({ length: columns.length || 6 }).map((_, i) => (
                <div
                  key={i}
                  className='h-4 bg-muted rounded animate-pulse flex-1'
                />
              ))}
            </div>
          </div>
          <div className='divide-y'>
            {Array.from({ length: 5 }).map((_, rowIndex) => (
              <div key={rowIndex} className='p-4'>
                <div className='flex gap-4 items-center'>
                  {Array.from({ length: columns.length || 6 }).map(
                    (_, colIndex) => (
                      <div
                        key={colIndex}
                        className='h-4 bg-muted rounded animate-pulse flex-1'
                      />
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (!data || data.length === 0) {
      return (
        <div className='bg-card rounded-md border shadow-sm w-full overflow-hidden'>
          <div className='flex items-center justify-center h-32 text-muted-foreground'>
            {emptyMessage}
          </div>
        </div>
      );
    }

    // Apply column order if set
    const orderedColumns =
      columnOrder && columnOrder.length > 0
        ? [...columns].sort((a, b) => {
            const ai = columnOrder.indexOf(a.key);
            const bi = columnOrder.indexOf(b.key);
            if (ai === -1 && bi === -1) return 0;
            if (ai === -1) return 1;
            if (bi === -1) return -1;
            return ai - bi;
          })
        : columns;

    return (
      <div
        className={cn(
          'bg-card border shadow-sm rounded-md overflow-hidden',
          scrollable && 'flex flex-col h-full min-w-0',
          !scrollable && 'w-full',
          className
        )}
      >
        <div
          ref={scrollContainerRef}
          className={cn(
            scrollable && 'flex-1 min-h-0 min-w-0 overflow-auto',
            !scrollable && 'w-full overflow-x-auto'
          )}
        >
          <table
            role='table'
            aria-label={tableId ? `Table: ${tableId}` : 'Data table'}
            className='w-full caption-bottom text-sm'
            style={{
              tableLayout: 'fixed',
              borderCollapse: 'collapse',
            }}
          >
            <colgroup>
              {orderedColumns.map(column => {
                // Check if this is a select/checkbox column (typically first column with no label or very short)
                const isSelectColumn =
                  !column.label ||
                  (typeof column.label === 'string' &&
                    column.label.trim().length === 0) ||
                  column.key.toLowerCase().includes('select') ||
                  column.key.toLowerCase().includes('checkbox');

                // Select columns get a small fixed width (48px for checkbox)
                if (isSelectColumn) {
                  return (
                    <col
                      key={column.key}
                      style={{
                        width: '48px',
                        minWidth: '48px',
                        maxWidth: '48px',
                      }}
                    />
                  );
                }

                // Use consistent width calculation
                return (
                  <col
                    key={column.key}
                    style={getColumnWidthStyle(column, isSelectColumn)}
                  />
                );
              })}
            </colgroup>
            <TableHeader
              className={cn(
                'bg-muted',
                isScrolled &&
                  scrollable &&
                  'shadow-[0_1px_3px_rgba(0,0,0,0.08)]'
              )}
            >
              <tr className='border-b border-border'>
                {orderedColumns.map((column, index) => {
                  // Handle different label types
                  const labelContent = React.isValidElement(column.label)
                    ? column.label
                    : typeof column.label === 'string'
                      ? column.label
                      : '';

                  // Check if this is a select/checkbox column
                  const isSelectColumn =
                    !column.label ||
                    (typeof column.label === 'string' &&
                      column.label.trim().length === 0) ||
                    column.key.toLowerCase().includes('select') ||
                    column.key.toLowerCase().includes('checkbox');

                  // Use consistent width calculation (must match colgroup)
                  const headerWidthStyle = getColumnWidthStyle(
                    column,
                    isSelectColumn
                  );

                  return (
                    <TableHead
                      key={column.key}
                      scope='col'
                      align={column.align}
                      isFirst={index === 0}
                      isLast={index === orderedColumns.length - 1}
                      isSticky={scrollable && stickyHeaders}
                      className={column.className}
                      style={headerWidthStyle}
                    >
                      <div
                        className={cn(
                          'w-full h-full select-none',
                          'flex items-center',
                          column.align === 'center' && 'justify-center',
                          column.align === 'right' && 'justify-end',
                          column.align === 'left' && 'justify-start',
                          !column.align && 'justify-start'
                        )}
                      >
                        {labelContent}
                      </div>
                    </TableHead>
                  );
                })}
              </tr>
            </TableHeader>

            <TableBody>
              {(() => {
                // If grouped mode but no groups, show empty message
                if (
                  grouped &&
                  groups &&
                  Array.isArray(groups) &&
                  groups.length === 0
                ) {
                  return (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className='text-center py-8'
                      >
                        <div className='text-muted-foreground'>
                          {emptyMessage}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                }

                // TableBody rendering path (development only)

                return grouped &&
                  groups &&
                  Array.isArray(groups) &&
                  groups.length > 0
                  ? // Render grouped data
                    groups.map((group, groupIndex) => {
                      const isExpanded =
                        expandedGroups?.has(group.label) ?? true;
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
                            className='bg-muted hover:bg-muted/80 cursor-pointer'
                            onClick={() => onToggleGroup?.(group.label)}
                            aria-expanded={isExpanded}
                          >
                            <TableCell
                              colSpan={columns.length}
                              className='font-semibold text-sm text-foreground py-3'
                            >
                              <div className='flex items-center justify-between'>
                                <span>{group.label}</span>
                                <div className='flex items-center gap-3'>
                                  <span className='text-xs font-normal text-muted-foreground'>
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
                            group.data.map((row, index) => {
                              const rowProps = getRowProps?.(row, index) || {};
                              const customClassName = getRowClassName?.(
                                row,
                                index
                              );
                              return (
                                <TableRow
                                  key={`${group.label}-${index}`}
                                  index={index}
                                  onClick={() => onRowClick?.(row, index)}
                                  className={cn(
                                    'bg-white',
                                    rowProps.className,
                                    customClassName
                                  )}
                                  isEnriched={rowProps.isEnriched}
                                >
                                  {orderedColumns.map((column, colIndex) => {
                                    const statusValue =
                                      (column.cellType === 'status' ||
                                        column.cellType === 'ai-score') &&
                                      column.getStatusValue
                                        ? column.getStatusValue(row)
                                        : undefined;

                                    const value = (
                                      row as Record<string, unknown>
                                    )[column.key];

                                    // Check if this is a select/checkbox column
                                    const isSelectColumn =
                                      !column.label ||
                                      (typeof column.label === 'string' &&
                                        column.label.trim().length === 0) ||
                                      column.key
                                        .toLowerCase()
                                        .includes('select') ||
                                      column.key
                                        .toLowerCase()
                                        .includes('checkbox');

                                    // Use consistent width calculation (must match colgroup and header)
                                    const cellWidthStyle = getColumnWidthStyle(
                                      column,
                                      isSelectColumn
                                    );

                                    return (
                                      <TableCell
                                        key={`${group.label}-${index}-${colIndex}`}
                                        cellType={column.cellType}
                                        align={column.align}
                                        statusValue={statusValue}
                                        isLast={
                                          colIndex === orderedColumns.length - 1
                                        }
                                        className={column.className}
                                        style={cellWidthStyle}
                                      >
                                        {column.render ? (
                                          column.render(value, row, index)
                                        ) : (
                                          <span>{String(value ?? '-')}</span>
                                        )}
                                      </TableCell>
                                    );
                                  })}
                                </TableRow>
                              );
                            })}
                        </React.Fragment>
                      );
                    })
                  : // Render ungrouped data
                    data.map((row, index) => {
                      const rowProps = getRowProps?.(row, index) || {};
                      const customClassName = getRowClassName?.(row, index);
                      const rowId = (row as Record<string, unknown>)?.id as
                        | string
                        | undefined;
                      const handleRowClick = onRowClick
                        ? () => onRowClick(row, index)
                        : undefined;
                      return (
                        <TableRow
                          key={rowId ? `row-${rowId}` : `row-${index}`}
                          index={index}
                          onClick={handleRowClick}
                          className={cn(rowProps.className, customClassName)}
                          isEnriched={rowProps.isEnriched}
                        >
                          {orderedColumns.map((column, colIndex) => {
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

                            // Check if this is a select/checkbox column
                            const isSelectColumn =
                              !column.label ||
                              (typeof column.label === 'string' &&
                                column.label.trim().length === 0) ||
                              column.key.toLowerCase().includes('select') ||
                              column.key.toLowerCase().includes('checkbox');

                            // Use consistent width calculation (must match colgroup and header)
                            const cellWidthStyle = getColumnWidthStyle(
                              column,
                              isSelectColumn
                            );

                            return (
                              <TableCell
                                key={`${index}-${colIndex}`}
                                cellType={column.cellType}
                                align={column.align}
                                statusValue={statusValue}
                                isLast={colIndex === orderedColumns.length - 1}
                                className={column.className}
                                style={cellWidthStyle}
                              >
                                {column.render ? (
                                  column.render(value, row, index)
                                ) : (
                                  <span>{String(value ?? '-')}</span>
                                )}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      );
                    });
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
    columnOrder,
    getRowClassName,
    getRowProps,
  ]);

  return tableStructure;
}

// Memoize UnifiedTable to prevent unnecessary re-renders
const MemoizedUnifiedTable = React.memo(UnifiedTableComponent) as <T = unknown>(
  props: UnifiedTableProps<T>
) => React.ReactElement;

// Create typed export with compound components
export const UnifiedTable = Object.assign(MemoizedUnifiedTable, {
  Header: TableHeader,
  Body: TableBody,
  Row: TableRow,
  Cell: TableCell,
  Head: TableHead,
}) as typeof MemoizedUnifiedTable & {
  Header: typeof TableHeader;
  Body: typeof TableBody;
  Row: typeof TableRow;
  Cell: typeof TableCell;
  Head: typeof TableHead;
};

// Explicit exports
export default UnifiedTable;
