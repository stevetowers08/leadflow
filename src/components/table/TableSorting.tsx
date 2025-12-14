import { cn } from '@/lib/utils';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import React, { useMemo, useState } from 'react';

interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  headerAlign?: 'left' | 'center' | 'right';
  width?: string;
}

interface TableSortingProps {
  columns: TableColumn[];
  onSort: (key: string) => void;
  sortConfig: SortConfig | null;
}

export const TableSorting: React.FC<TableSortingProps> = ({
  columns,
  onSort,
  sortConfig,
}) => {
  return (
    <>
      {columns.map(column => {
        const headerAlignClass =
          column.headerAlign === 'center'
            ? 'text-center'
            : column.headerAlign === 'right'
              ? 'text-right'
              : 'text-left';
        const justifyClass =
          column.headerAlign === 'center'
            ? 'justify-center'
            : column.headerAlign === 'right'
              ? 'justify-end'
              : 'justify-start';

        return (
          <th
            key={column.key}
            className={cn(
              'h-10 px-6 text-sm font-semibold text-foreground uppercase tracking-wider border-r border-b-2 border-border last:border-r-0 whitespace-nowrap',
              'transition-all duration-150 ease-out',
              column.sortable &&
                'cursor-pointer hover:bg-gray-100/60 hover:shadow-sm',
              headerAlignClass
            )}
            scope='col'
            onClick={column.sortable ? () => onSort(column.key) : undefined}
            style={
              column.width
                ? { width: column.width, minWidth: column.width }
                : undefined
            }
          >
            <div className={cn('flex items-center gap-2', justifyClass)}>
              <span>{column.label}</span>
              {column.sortable && (
                <div className='flex items-center'>
                  {sortConfig?.key === column.key ? (
                    sortConfig.direction === 'asc' ? (
                      <ArrowUp className='h-3 w-3' />
                    ) : (
                      <ArrowDown className='h-3 w-3' />
                    )
                  ) : (
                    <ArrowUpDown className='h-3 w-3 opacity-50' />
                  )}
                </div>
              )}
            </div>
          </th>
        );
      })}
    </>
  );
};

export const useTableSorting = (data: Record<string, unknown>[]) => {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      if (!sortConfig) return 0;

      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      // Handle date sorting
      const dateKeys = [
        'created_at',
        'updated_at',
        'last_interaction_at',
        'connected_at',
        'last_reply_at',
        'meeting_date',
        'connection_request_date',
        'connection_accepted_date',
        'response_date',
        'email_reply_date',
        'stage_updated',
      ];

      if (dateKeys.includes(sortConfig.key)) {
        const aDate = new Date(String(aValue || 0));
        const bDate = new Date(String(bValue || 0));
        return sortConfig.direction === 'asc'
          ? aDate.getTime() - bDate.getTime()
          : bDate.getTime() - aDate.getTime();
      }

      // Handle string sorting
      const aStr = String(aValue || '').toLowerCase();
      const bStr = String(bValue || '').toLowerCase();

      if (aStr < bStr) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aStr > bStr) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  const handleSort = (key: string) => {
    setSortConfig(prevConfig => {
      if (prevConfig?.key === key) {
        return {
          key,
          direction: prevConfig.direction === 'asc' ? 'desc' : 'asc',
        };
      } else {
        return { key, direction: 'asc' };
      }
    });
  };

  return {
    sortedData,
    sortConfig,
    handleSort,
  };
};
