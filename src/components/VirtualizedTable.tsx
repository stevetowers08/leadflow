import React, { useState, useEffect, useRef, useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface Column<T> {
  key: string;
  label: string;
  render: (item: T) => React.ReactNode;
  headerAlign?: "left" | "center" | "right";
  cellAlign?: "left" | "center" | "right";
  width?: number;
}

interface VirtualizedTableProps<T> {
  data: T[];
  columns: Column<T>[];
  height?: number;
  itemHeight?: number;
  className?: string;
  onRowClick?: (item: T) => void;
  selectedItems?: T[];
  onItemSelect?: (item: T, checked: boolean) => void;
  enableSelection?: boolean;
}

interface RowProps<T> {
  index: number;
  style: React.CSSProperties;
  data: {
    items: T[];
    columns: Column<T>[];
    onRowClick?: (item: T) => void;
    selectedItems?: T[];
    onItemSelect?: (item: T, checked: boolean) => void;
    enableSelection?: boolean;
  };
}

function VirtualizedRow<T extends { id: string }>({ index, style, data }: RowProps<T>) {
  const { items, columns, onRowClick, selectedItems, onItemSelect, enableSelection } = data;
  const item = items[index];
  const isSelected = selectedItems?.some(selected => selected.id === item.id) || false;

  const handleRowClick = () => {
    onRowClick?.(item);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    onItemSelect?.(item, e.target.checked);
  };

  return (
    <div style={style}>
      <TableRow 
        className={cn(
          "border-b border-border/50 hover:bg-muted/20 transition-colors duration-150",
          "group cursor-pointer",
          isSelected && "bg-primary/5"
        )}
        onClick={handleRowClick}
      >
        {enableSelection && (
          <TableCell className="px-6 py-4 w-12">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={handleCheckboxChange}
              className="rounded border-input"
              onClick={(e) => e.stopPropagation()}
            />
          </TableCell>
        )}
        {columns.map((column) => (
          <TableCell 
            key={column.key} 
            className={cn(
              "px-6 py-4",
              column.cellAlign === "center" && "text-center",
              column.cellAlign === "right" && "text-right"
            )}
            style={{ width: column.width }}
          >
            {column.render(item)}
          </TableCell>
        ))}
      </TableRow>
    </div>
  );
}

export function VirtualizedTable<T extends { id: string }>({
  data,
  columns,
  height = 400,
  itemHeight = 60,
  className = '',
  onRowClick,
  selectedItems = [],
  onItemSelect,
  enableSelection = false
}: VirtualizedTableProps<T>) {
  const [containerHeight, setContainerHeight] = useState(height);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate total width for horizontal scrolling
  const totalWidth = useMemo(() => {
    const baseWidth = enableSelection ? 50 : 0; // Checkbox column width
    return columns.reduce((total, column) => total + (column.width || 200), baseWidth);
  }, [columns, enableSelection]);

  // Update container height on resize
  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerHeight(Math.max(200, rect.height));
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  const itemData = {
    items: data,
    columns,
    onRowClick,
    selectedItems,
    onItemSelect,
    enableSelection
  };

  if (data.length === 0) {
    return (
      <div className={cn("border border-border rounded-lg", className)}>
        <Table>
          <TableHeader>
            <TableRow className="border-b bg-muted/30">
              {enableSelection && (
                <TableHead className="h-12 px-6 text-sm font-semibold text-muted-foreground uppercase tracking-wider w-12">
                  <input type="checkbox" className="rounded border-input" />
                </TableHead>
              )}
              {columns.map((column) => (
                <TableHead 
                  key={column.key} 
                  className={cn(
                    "h-12 px-6 text-sm font-semibold text-muted-foreground uppercase tracking-wider",
                    column.headerAlign === "center" && "text-center",
                    column.headerAlign === "right" && "text-right"
                  )}
                  style={{ width: column.width }}
                >
                  {column.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
        </Table>
        <div className="text-center py-12 text-muted-foreground">
          <div className="text-4xl opacity-20 mb-2">📋</div>
          <div className="font-medium">No data available</div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={cn("border border-border rounded-lg overflow-hidden", className)}
      style={{ height: containerHeight }}
    >
      <Table>
        <TableHeader>
          <TableRow className="border-b bg-muted/30">
            {enableSelection && (
              <TableHead className="h-12 px-6 text-sm font-semibold text-muted-foreground uppercase tracking-wider w-12">
                <input type="checkbox" className="rounded border-input" />
              </TableHead>
            )}
            {columns.map((column) => (
              <TableHead 
                key={column.key} 
                className={cn(
                  "h-12 px-6 text-sm font-semibold text-muted-foreground uppercase tracking-wider",
                  column.headerAlign === "center" && "text-center",
                  column.headerAlign === "right" && "text-right"
                )}
                style={{ width: column.width }}
              >
                {column.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
      </Table>
      
      <div style={{ height: containerHeight - 48 }}> {/* Subtract header height */}
        <List
          height={containerHeight - 48}
          itemCount={data.length}
          itemSize={itemHeight}
          itemData={itemData}
          width="100%"
          overscanCount={5} // Render 5 extra items for smooth scrolling
        >
          {VirtualizedRow}
        </List>
      </div>
    </div>
  );
}

// Hook for managing virtual scrolling state
export function useVirtualScrolling<T extends { id: string }>(
  data: T[],
  options: {
    pageSize?: number;
    enableVirtualization?: boolean;
    threshold?: number;
  } = {}
) {
  const { pageSize = 100, enableVirtualization = true, threshold = 1000 } = options;
  
  const shouldVirtualize = enableVirtualization && data.length > threshold;
  
  const virtualizedData = useMemo(() => {
    if (!shouldVirtualize) return data;
    
    // For virtual scrolling, we can return all data as the virtualization
    // library handles rendering only visible items
    return data;
  }, [data, shouldVirtualize]);

  return {
    data: virtualizedData,
    shouldVirtualize,
    totalItems: data.length,
    visibleItems: shouldVirtualize ? Math.min(pageSize, data.length) : data.length
  };
}

// Performance monitoring hook
export function usePerformanceMonitor() {
  const [metrics, setMetrics] = useState({
    renderTime: 0,
    memoryUsage: 0,
    itemCount: 0
  });

  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // Get memory usage if available
      const memoryUsage = (performance as any).memory?.usedJSHeapSize || 0;
      
      setMetrics(prev => ({
        ...prev,
        renderTime,
        memoryUsage,
        itemCount: prev.itemCount
      }));
    };
  });

  return metrics;
}
