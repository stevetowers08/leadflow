import { cn } from '@/lib/utils';
import { getUnifiedStatusClass } from '@/utils/colorScheme';
import React from 'react';
import {
  ColumnOrderState,
  ColumnSizingState,
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
  tableId?: string; // used to persist per-table preferences
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
>(({ className, onClick, index, children, ...props }, ref) => (
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
  >
    {children}
  </tr>
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
        cellType === 'status' ? 'p-0 relative' : 'px-4 py-3',
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
        'px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide border-r border-gray-200 last:border-r-0 whitespace-nowrap',
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
export function UnifiedTable<T = unknown>({
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
}: UnifiedTableProps<T>) {
    // ----- Column sizing & order (TanStack Table headless) -----
    const initialSizing = React.useRef<ColumnSizingState>({});
    const initialOrder = React.useRef<ColumnOrderState>([]);

    const [columnSizing, setColumnSizing] = React.useState<ColumnSizingState>(
      () => initialSizing.current
    );
    const [columnOrder, setColumnOrder] = React.useState<ColumnOrderState>(
      () => initialOrder.current
    );

    // Build lightweight column defs for TanStack to manage sizing/order
    const tsColumns = React.useMemo<ColumnDef<T, unknown>[]>(
      () =>
        columns.map(col => ({
          id: col.key,
          header: col.label as React.ReactNode,
          // We render cells ourselves, so cell isn't needed here
          size: col.width ? Number.parseInt(col.width) : undefined,
          minSize: col.minWidth ? Number.parseInt(col.minWidth) : undefined,
          enableResizing: true,
        })),
      [columns]
    );

    const table = useReactTable({
      data, // provide real data (unused for rendering, but harmless)
      columns: tsColumns,
      getCoreRowModel: getCoreRowModel(),
      state: { columnSizing, columnOrder },
      onColumnSizingChange: updater => {
        setColumnSizing(prev => {
          const next = typeof updater === 'function' ? updater(prev) : updater;
          if (tableId)
            persistLocalTablePreferences(tableId, { columnSizing: next });
          return next;
        });
      },
      onColumnOrderChange: updater => {
        setColumnOrder(prev => {
          const next = typeof updater === 'function' ? updater(prev) : updater;
          if (tableId)
            persistLocalTablePreferences(tableId, { columnOrder: next });
          return next;
        });
      },
      columnResizeMode: 'onEnd',
    });

    // Improve UX while resizing (disable text selection)
    const [isResizing, setIsResizing] = React.useState(false);

    // Load preferences (local first, then Supabase)
    React.useEffect(() => {
      let active = true;
      if (!tableId) return;
      const local = loadLocalTablePreferences(tableId);
      if (local) {
        if (local.columnSizing && active) setColumnSizing(local.columnSizing);
        if (local.columnOrder && active) setColumnOrder(local.columnOrder);
      }
      getUserTablePreferences(tableId).then(remote => {
        if (!active || !remote) return;
        if (remote.columnSizing) setColumnSizing(remote.columnSizing);
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
      queueSave({ columnSizing });
    }, [columnSizing, queueSave, tableId]);

    React.useEffect(() => {
      if (!tableId) return;
      queueSave({ columnOrder });
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
          <div className='bg-card rounded-lg border shadow-sm w-full overflow-hidden'>
            <div className='flex items-center justify-center h-32'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
            </div>
          </div>
        );
      }

      // Debug logging
      if (process.env.NEXT_PUBLIC_VERBOSE_LOGS === 'true') {
        console.log('🔍 UnifiedTable render:', {
          hasData: !!data,
          dataLength: Array.isArray(data) ? data.length : 'not array',
          dataType: typeof data,
          dataSample: Array.isArray(data) && data.length > 0 ? data[0] : null,
          loading,
          columnsCount: columns.length,
        });
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
            'bg-card rounded-lg border shadow-sm w-full',
            scrollable && 'flex flex-col flex-1 min-h-0',
            !scrollable && 'overflow-hidden overflow-x-auto scrollbar-modern',
            className
          )}
        >
          <div
            ref={scrollContainerRef}
            className={cn(
              scrollable && 'flex-1 min-h-0 overflow-y-auto overflow-x-auto scrollbar-thin',
              !scrollable && 'w-full'
            )}
          >
            <table
              className={cn(
                'w-full border-separate border-spacing-0',
                isResizing && 'select-none'
              )}
              style={{
                tableLayout: 'fixed',
                width: '100%',
              }}
            >
              {/* Colgroup to enforce exact column widths across header and body */}
              <colgroup>
                {orderedColumns.map(column => {
                  const size = table.getColumn(column.key)?.getSize();
                  const widthPx = size ? `${size}px` : column.width;
                  return <col key={column.key} style={{ width: widthPx }} />;
                })}
              </colgroup>
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
                  {orderedColumns.map((column, index) => {
                    // Handle different label types
                    const labelContent = React.isValidElement(column.label)
                      ? column.label
                      : typeof column.label === 'string'
                        ? column.label
                        : '';

                    const tsCol = table.getColumn(column.key);
                    const widthPx =
                      tsCol && tsCol.getSize()
                        ? `${tsCol.getSize()}px`
                        : column.width;

                    return (
                      <TableHead
                        key={column.key}
                        scope='col'
                        align={column.align}
                        isFirst={index === 0}
                        isLast={index === orderedColumns.length - 1}
                        style={{ minWidth: column.minWidth || widthPx }}
                        className='relative'
                      >
                        <div
                          className={cn(
                            'relative w-full h-full select-none',
                            column.align === 'center' &&
                              'flex items-center justify-center',
                            column.align === 'right' &&
                              'flex items-center justify-end'
                          )}
                        >
                          <div
                            className={column.align === 'center' ? '' : 'pr-2'}
                          >
                            {labelContent}
                          </div>
                        </div>
                        {tsCol && index !== orderedColumns.length - 1 && (
                          <div
                            onMouseDown={e => {
                              e.preventDefault();
                              e.stopPropagation();
                              const handle = e.currentTarget;
                              handle.style.backgroundColor =
                                'rgba(59, 130, 246, 0.6)';
                              const startX = e.clientX;
                              const colId = column.key;
                              const startSize =
                                table.getColumn(colId)?.getSize() || 0;
                              const prevCursor = document.body.style.cursor;
                              const prevUserSelect =
                                document.body.style.userSelect;
                              document.body.style.cursor = 'col-resize';
                              document.body.style.userSelect = 'none';
                              try {
                                window.getSelection()?.removeAllRanges();
                              } catch {
                                // Ignore selection errors during resize
                              }
                              const onMove = (ev: MouseEvent) => {
                                ev.preventDefault();
                                const delta = ev.clientX - startX;
                                const next = Math.max(40, startSize + delta);
                                setColumnSizing(prev => ({
                                  ...prev,
                                  [colId]: next,
                                }));
                              };
                              const onUp = () => {
                                window.removeEventListener('mousemove', onMove);
                                window.removeEventListener('mouseup', onUp);
                                setIsResizing(false);
                                document.body.style.cursor = prevCursor;
                                document.body.style.userSelect = prevUserSelect;
                                handle.style.backgroundColor = 'transparent';
                              };
                              setIsResizing(true);
                              window.addEventListener('mousemove', onMove);
                              window.addEventListener('mouseup', onUp);
                            }}
                            onTouchStart={e => {
                              e.preventDefault();
                              const touch = e.touches[0];
                              if (!touch) return;
                              const startX = touch.clientX;
                              const colId = column.key;
                              const startSize =
                                table.getColumn(colId)?.getSize() || 0;
                              const onMove = (ev: TouchEvent) => {
                                ev.preventDefault();
                                const t = ev.touches[0];
                                if (!t) return;
                                const delta = t.clientX - startX;
                                const next = Math.max(40, startSize + delta);
                                setColumnSizing(prev => ({
                                  ...prev,
                                  [colId]: next,
                                }));
                              };
                              const onUp = () => {
                                window.removeEventListener('touchmove', onMove);
                                window.removeEventListener('touchend', onUp);
                                setIsResizing(false);
                              };
                              setIsResizing(true);
                              window.addEventListener('touchmove', onMove, {
                                passive: false,
                              });
                              window.addEventListener('touchend', onUp);
                            }}
                            role='separator'
                            aria-label={`Resize ${typeof column.label === 'string' ? column.label : 'column'}`}
                            aria-orientation='vertical'
                            className='absolute top-0 h-full cursor-col-resize z-20'
                            style={{
                              right: '-6px',
                              width: '12px',
                              backgroundColor: 'transparent',
                            }}
                            onMouseEnter={e => {
                              e.currentTarget.style.backgroundColor =
                                'rgba(59, 130, 246, 0.4)';
                            }}
                            onMouseLeave={e => {
                              if (!isResizing) {
                                e.currentTarget.style.backgroundColor =
                                  'transparent';
                              }
                            }}
                          />
                        )}
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
                          <div className='text-gray-500'>{emptyMessage}</div>
                        </TableCell>
                      </TableRow>
                    );
                  }

                  // Debug: Log what path we're taking
                  if (process.env.NEXT_PUBLIC_VERBOSE_LOGS === 'true') {
                    console.log('🔍 TableBody rendering path:', {
                      grouped,
                      hasGroups: !!groups && Array.isArray(groups),
                      groupsLength: groups && Array.isArray(groups) ? groups.length : 0,
                      dataIsArray: Array.isArray(data),
                      dataLength: Array.isArray(data) ? data.length : 'not array',
                    });
                  }

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

                                    return (
                                      <TableCell
                                        key={`${group.label}-${index}-${colIndex}`}
                                        cellType={column.cellType}
                                        align={column.align}
                                        statusValue={statusValue}
                                        style={{
                                          // Width driven by <colgroup>; optional minWidth for content
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
                          key={`row-${index}-${(row as Record<string, unknown>)?.id || index}`}
                          index={index}
                          onClick={() => onRowClick?.(row, index)}
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

                            return (
                              <TableCell
                                key={`${index}-${colIndex}`}
                                cellType={column.cellType}
                                align={column.align}
                                statusValue={statusValue}
                                style={{
                                  // Width driven by <colgroup>; optional minWidth for content
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
      columnOrder,
      table,
    ]);

    return tableStructure;
}

// Export compound components for advanced usage
UnifiedTable.Header = TableHeader;
UnifiedTable.Body = TableBody;
UnifiedTable.Row = TableRow;
UnifiedTable.Cell = TableCell;
UnifiedTable.Head = TableHead;

export default UnifiedTable;
