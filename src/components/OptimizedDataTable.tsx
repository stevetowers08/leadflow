/**
 * Optimized data table with virtual scrolling and performance optimizations
 */

import React, { useMemo, useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';
import { DataTable } from './DataTable';
import { measureFilterPerformance } from '@/utils/performanceUtils';

interface OptimizedDataTableProps<T extends Record<string, any> & { id: string }> {
  title: string;
  data: T[];
  columns: any[];
  loading?: boolean;
  addButton?: React.ReactNode;
  onRowClick?: (item: T) => void;
  pagination?: { enabled: boolean };
  bulkActions?: any[];
  enableBulkActions?: boolean;
  searchTerm?: string;
  filters?: Record<string, any>;
  height?: number;
  itemHeight?: number;
  enableVirtualization?: boolean;
  virtualizationThreshold?: number;
}

export function OptimizedDataTable<T extends Record<string, any> & { id: string }>({
  title,
  data,
  columns,
  loading = false,
  addButton,
  onRowClick,
  pagination = { enabled: false },
  bulkActions = [],
  enableBulkActions = false,
  searchTerm = '',
  filters = {},
  height = 600,
  itemHeight = 60,
  enableVirtualization = true,
  virtualizationThreshold = 100
}: OptimizedDataTableProps<T>) {
  
  // Memoized filtered data with performance measurement
  const filteredData = useMemo(() => {
    if (!data.length) return [];
    
    return measureFilterPerformance(
      data,
      (item) => {
        // Search filter
        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase();
          const matchesSearch = Object.values(item).some(value => 
            value && value.toString().toLowerCase().includes(searchLower)
          );
          if (!matchesSearch) return false;
        }
        
        // Other filters
        return Object.entries(filters).every(([key, value]) => {
          if (!value) return true;
          return item[key] === value;
        });
      },
      `${title.toLowerCase()}-filtering`
    );
  }, [data, searchTerm, filters, title]);

  // Determine if virtualization should be used
  const shouldVirtualize = enableVirtualization && filteredData.length > virtualizationThreshold;

  // Memoized row renderer for virtual scrolling
  const Row = useCallback(({ index, style }: { index: number; style: React.CSSProperties }) => {
    const item = filteredData[index];
    if (!item) return null;

    return (
      <div style={style} className="flex items-center border-b border-gray-100 hover:bg-gray-50">
        {columns.map((column, colIndex) => (
          <div
            key={colIndex}
            className="px-4 py-3 flex-1"
            style={{ minWidth: column.minWidth || '150px' }}
            onClick={() => onRowClick?.(item)}
          >
            {column.render ? column.render(item) : item[column.key]}
          </div>
        ))}
      </div>
    );
  }, [filteredData, columns, onRowClick]);

  // If not virtualizing, use regular DataTable
  if (!shouldVirtualize) {
    return (
      <DataTable
        title={title}
        data={filteredData}
        columns={columns}
        loading={loading}
        addButton={addButton}
        onRowClick={onRowClick}
        pagination={pagination}
        bulkActions={bulkActions}
        enableBulkActions={enableBulkActions}
      />
    );
  }

  // Virtualized table
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        {addButton}
      </div>

      {/* Virtualized List */}
      <div className="border rounded-lg bg-white">
        {/* Column Headers */}
        <div className="flex items-center bg-gray-50 border-b border-gray-200 px-4 py-3 font-medium text-sm text-gray-700">
          {columns.map((column, index) => (
            <div
              key={index}
              className="flex-1"
              style={{ minWidth: column.minWidth || '150px' }}
            >
              {column.label}
            </div>
          ))}
        </div>

        {/* Virtualized Rows */}
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <List
            height={height}
            itemCount={filteredData.length}
            itemSize={itemHeight}
            width="100%"
          >
            {Row}
          </List>
        )}
      </div>

      {/* Footer with count */}
      <div className="text-sm text-gray-500 text-center">
        Showing {filteredData.length} of {data.length} items
        {shouldVirtualize && (
          <span className="ml-2 text-blue-600">
            (Virtualized for performance)
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * Hook for managing virtual scrolling state
 */
export function useVirtualScrolling<T>(
  data: T[],
  options: {
    pageSize?: number;
    enableVirtualization?: boolean;
    threshold?: number;
  } = {}
) {
  const {
    pageSize = 50,
    enableVirtualization = true,
    threshold = 100
  } = options;

  const shouldVirtualize = enableVirtualization && data.length > threshold;
  
  const virtualizedData = useMemo(() => {
    if (!shouldVirtualize) return data;
    return data.slice(0, pageSize);
  }, [data, shouldVirtualize, pageSize]);

  return {
    data: virtualizedData,
    shouldVirtualize,
    totalCount: data.length,
    hasMore: data.length > pageSize
  };
}

