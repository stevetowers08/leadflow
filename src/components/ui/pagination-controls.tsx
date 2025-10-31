import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';

export interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  className?: string;
  pageSizeOptions?: number[];
  showPageSizeSelector?: boolean;
  showItemCount?: boolean;
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  className,
  pageSizeOptions = [10, 25, 50, 100],
  showPageSizeSelector = true,
  showItemCount = true,
}) => {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div
      className={cn(
        'flex items-center justify-between flex-shrink-0',
        className
      )}
    >
      <div className='flex items-center gap-4'>
        {showItemCount && (
          <div className='text-sm text-gray-500'>
            Showing {startItem} to {endItem} of {totalItems} results
          </div>
        )}
        {showPageSizeSelector && (
          <div className='flex items-center gap-2'>
            <span className='text-sm text-gray-500'>Rows per page:</span>
            <select
              value={pageSize}
              onChange={e => {
                onPageSizeChange(Number(e.target.value));
                onPageChange(1); // Reset to first page when changing page size
              }}
              className='px-2 py-1 text-sm border border-gray-300 rounded bg-white hover:border-gray-400'
            >
              {pageSizeOptions.map(size => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      <div className='flex items-center gap-2'>
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className='px-3 py-1 text-sm border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'
          aria-label='Go to previous page'
        >
          <ChevronLeft className='h-4 w-4' />
        </button>
        <span className='px-3 py-1 text-sm'>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className='px-3 py-1 text-sm border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'
          aria-label='Go to next page'
        >
          <ChevronRight className='h-4 w-4' />
        </button>
      </div>
    </div>
  );
};
