import React from 'react';
import { TableRow as UITableRow, TableCell } from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface TableRowProps<T> {
  item: T;
  index: number;
  columns: Array<{ 
    key: string; 
    render: (item: T) => React.ReactNode;
    cellAlign?: 'left' | 'center' | 'right';
    width?: string;
  }>;
  onRowClick?: (item: T) => void;
  selectedItems: T[];
  onItemSelect: (item: T, checked: boolean) => void;
  enableBulkActions: boolean;
  enableExport: boolean;
}

export function TableRow<T extends Record<string, any> & { id: string }>({
  item,
  index,
  columns,
  onRowClick,
  selectedItems,
  onItemSelect,
  enableBulkActions,
  enableExport
}: TableRowProps<T>) {
  const isSelected = selectedItems.some(selected => selected.id === item.id);

  return (
    <UITableRow 
      key={item.id || index} 
      className={cn(
        "border-b border-gray-100 hover:bg-gray-50/80 hover:shadow-sm hover:border-gray-200 transition-colors duration-200",
        "group cursor-pointer",
        "relative",
        isSelected && "bg-primary/5"
      )}
      onClick={() => onRowClick?.(item)}
      role="row"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onRowClick?.(item);
        }
      }}
      aria-label={`Row ${index + 1}: ${columns.map(col => col.render(item)).join(', ')}`}
    >
      {(enableBulkActions || enableExport) && (
        <TableCell 
          className="px-6 py-3"
          onClick={(e) => e.stopPropagation()}
        >
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onItemSelect(item, e.target.checked)}
            className="rounded border-input"
            aria-label={`Select ${item.name || item.title || `item ${index + 1}`}`}
          />
        </TableCell>
      )}
      {columns.map((column) => (
        <TableCell 
          key={column.key} 
          className={cn(
            "px-6 py-3 border-r border-gray-50 last:border-r-0",
            "group-hover:border-r-gray-100 group-hover:last:border-r-0",
            column.cellAlign === 'center' && 'text-center',
            column.cellAlign === 'right' && 'text-right'
          )}
          style={column.width ? { width: column.width, minWidth: column.width } : undefined}
        >
          {column.render(item)}
        </TableCell>
      ))}
    </UITableRow>
  );
}
