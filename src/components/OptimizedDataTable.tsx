/**
 * Optimized Data Table Component
 * 
 * This component provides high-performance data table functionality with:
 * - Virtual scrolling for large datasets
 * - Memoized rendering
 * - Optimized sorting and filtering
 * - Lazy loading of data
 */

import { DropdownSelect } from '@/components/ui/dropdown-select';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useDebouncedSearch, useVirtualScrolling } from '@/utils/performanceOptimization';
import { ArrowUpDown, ChevronDown, ChevronUp, Search } from 'lucide-react';
import React, { memo, useCallback, useMemo } from 'react';

interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  width?: number;
}

interface OptimizedDataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  searchable?: boolean;
  sortable?: boolean;
  filterable?: boolean;
  onRowClick?: (row: T) => void;
  className?: string;
  rowHeight?: number;
  maxHeight?: number;
}

const OptimizedDataTable = memo(<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  searchable = true,
  sortable = true,
  filterable = true,
  onRowClick,
  className,
  rowHeight = 48,
  maxHeight = 600
}: OptimizedDataTableProps<T>) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [sortColumn, setSortColumn] = React.useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = React.useState<Record<string, string>>({});

  const debouncedSearchTerm = useDebouncedSearch(searchTerm, 300);

  // Filter and search data
  const filteredData = useMemo(() => {
    let filtered = data;

    // Apply search
    if (debouncedSearchTerm) {
      filtered = filtered.filter(row =>
        columns.some(column => {
          const value = row[column.key];
          return value && value.toString().toLowerCase().includes(debouncedSearchTerm.toLowerCase());
        })
      );
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter(row => {
          const rowValue = row[key];
          return rowValue && rowValue.toString().toLowerCase().includes(value.toLowerCase());
        });
      }
    });

    return filtered;
  }, [data, debouncedSearchTerm, filters, columns]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortColumn) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (aValue === bValue) return 0;

      const comparison = aValue < bValue ? -1 : 1;
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredData, sortColumn, sortDirection]);

  // Virtual scrolling
  const {
    visibleItems,
    totalHeight,
    offsetY,
    setScrollTop
  } = useVirtualScrolling(sortedData.length, rowHeight, maxHeight);

  const handleSort = useCallback((column: keyof T) => {
    if (!sortable) return;

    if (sortColumn === column) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  }, [sortColumn, sortable]);

  const handleFilterChange = useCallback((columnKey: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [columnKey]: value
    }));
  }, []);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, [setScrollTop]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sidebar-primary"></div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search and Filters */}
      {(searchable || filterable) && (
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
          {searchable && (
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          )}
          
          {filterable && (
            <div className="flex items-center gap-2">
              {columns
                .filter(col => col.filterable)
                .map(column => (
                  <DropdownSelect
                    key={String(column.key)}
                    options={[
                      { value: '', label: `All ${column.label}` },
                      ...Array.from(new Set(data.map(row => row[column.key])))
                        .filter(Boolean)
                        .map(value => ({
                          value: String(value),
                          label: String(value)
                        }))
                    ]}
                    value={filters[String(column.key)] || ''}
                    onValueChange={(value) => handleFilterChange(String(column.key), value)}
                    placeholder={`Filter by ${column.label}`}
                    className="min-w-[150px]"
                  />
                ))}
            </div>
          )}
        </div>
      )}

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-auto" style={{ maxHeight }} onScroll={handleScroll}>
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                {columns.map(column => (
                  <th
                    key={String(column.key)}
                    className={cn(
                      "px-4 py-3 text-left text-sm font-medium text-gray-900",
                      "table-header-clear",
                      column.sortable && sortable && "cursor-pointer hover:bg-gray-100"
                    )}
                    style={{ width: column.width }}
                    onClick={() => column.sortable && handleSort(column.key)}
                  >
                    <div className="flex items-center gap-2">
                      <span>{column.label}</span>
                      {column.sortable && sortable && (
                        <div className="flex flex-col">
                          {sortColumn === column.key ? (
                            sortDirection === 'asc' ? (
                              <ChevronUp className="h-3 w-3 text-blue-500" />
                            ) : (
                              <ChevronDown className="h-3 w-3 text-blue-500" />
                            )
                          ) : (
                            <ArrowUpDown className="h-3 w-3 text-gray-400" />
                          )}
                        </div>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr style={{ height: offsetY }}>
                <td colSpan={columns.length} />
              </tr>
              {visibleItems.map(index => {
                const row = sortedData[index];
                return (
                  <tr
                    key={index}
                    className={cn(
                      "border-b hover:bg-gray-50",
                      onRowClick && "cursor-pointer"
                    )}
                    onClick={() => onRowClick?.(row)}
                  >
                    {columns.map(column => (
                      <td
                        key={String(column.key)}
                        className="px-4 py-3 text-sm text-gray-900 table-cell-clear"
                      >
                        {column.render
                          ? column.render(row[column.key], row)
                          : String(row[column.key] || '')}
                      </td>
                    ))}
                  </tr>
                );
              })}
              <tr style={{ height: totalHeight - offsetY - (visibleItems.length * rowHeight) }}>
                <td colSpan={columns.length} />
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Results Summary */}
      <div className="text-sm text-gray-500">
        Showing {sortedData.length} of {data.length} results
        {debouncedSearchTerm && ` for "${debouncedSearchTerm}"`}
      </div>
    </div>
  );
});

OptimizedDataTable.displayName = 'OptimizedDataTable';

export { OptimizedDataTable };
