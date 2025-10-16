import { TableCell, TableRow as UITableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import React from 'react';

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
}

export function TableRow<T extends Record<string, any> & { id: string }>({
  item,
  index,
  columns,
  onRowClick,
}: TableRowProps<T>) {
  return (
    <UITableRow
      key={item.id || index}
      className={cn(
        'border-b border-gray-100 hover:bg-gray-50/80 hover:shadow-sm hover:border-gray-200 transition-colors duration-200',
        'group cursor-pointer',
        'relative'
      )}
      onClick={() => onRowClick?.(item)}
      role='row'
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onRowClick?.(item);
        }
      }}
      aria-label={`Row ${index + 1}: ${columns.map(col => col.render(item)).join(', ')}`}
    >
      {columns.map(column => (
        <TableCell
          key={column.key}
          className={cn(
            'px-4 py-1 border-r border-gray-50 last:border-r-0',
            'group-hover:border-r-gray-100 group-hover:last:border-r-0',
            column.cellAlign === 'center' && 'text-center',
            column.cellAlign === 'right' && 'text-right'
          )}
          style={
            column.width
              ? { width: column.width, minWidth: column.width }
              : undefined
          }
        >
          {column.render(item)}
        </TableCell>
      ))}
    </UITableRow>
  );
}
