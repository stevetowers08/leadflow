import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useMemo } from 'react';

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

// Calculate visible pages with ellipsis
const calculateVisiblePages = (
  currentPage: number,
  totalPages: number,
  maxVisible: number = 5
): (number | 'ellipsis')[] => {
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | 'ellipsis')[] = [];
  const halfVisible = Math.floor(maxVisible / 2);

  // Always show first page
  pages.push(1);

  // Calculate start and end of visible range
  let startPage = Math.max(2, currentPage - halfVisible);
  let endPage = Math.min(totalPages - 1, currentPage + halfVisible);

  // Adjust if we're near the beginning
  if (currentPage <= halfVisible + 1) {
    endPage = Math.min(maxVisible, totalPages - 1);
  }

  // Adjust if we're near the end
  if (currentPage >= totalPages - halfVisible) {
    startPage = Math.max(2, totalPages - maxVisible + 1);
  }

  // Add ellipsis before visible range if needed
  if (startPage > 2) {
    pages.push('ellipsis');
  }

  // Add visible pages
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  // Add ellipsis after visible range if needed
  if (endPage < totalPages - 1) {
    pages.push('ellipsis');
  }

  // Always show last page if more than 1 page
  if (totalPages > 1) {
    pages.push(totalPages);
  }

  return pages;
};

export const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  className,
  pageSizeOptions = [10, 20, 25, 50, 100],
  showPageSizeSelector = true,
  showItemCount = false,
}) => {
  const visiblePages = useMemo(
    () => calculateVisiblePages(currentPage, totalPages),
    [currentPage, totalPages]
  );

  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  return (
    <div
      className={cn(
        'flex-shrink-0 px-4 py-2 border-t border-sidebar-border/30',
        'flex items-center justify-between',
        className
      )}
      role='navigation'
      aria-label='Pagination'
    >
      {/* Left side: Page size selector */}
      {showPageSizeSelector && (
        <div className='flex items-center gap-2'>
          <span className='text-sm text-muted-foreground'>View</span>
          <Select
            value={pageSize.toString()}
            onValueChange={value => {
              onPageSizeChange(Number(value));
              onPageChange(1);
            }}
          >
            <SelectTrigger className='h-7 w-[52px] px-2 border border-gray-300 bg-white shadow-sm hover:border-gray-400 hover:shadow-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all rounded-md text-sm'>
              <SelectValue className='font-medium text-gray-900 text-center' />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map(size => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className='text-sm text-muted-foreground'>per page</span>
        </div>
      )}

      {/* Right side: Page navigation */}
      <div className='flex items-center gap-1'>
        <Button
          variant='ghost'
          size='icon'
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={!hasPreviousPage}
          aria-label='Go to previous page'
          className='h-8 w-8'
        >
          <ChevronLeft className='h-4 w-4' />
        </Button>

        <div className='flex items-center gap-1'>
          {visiblePages.map((page, index) => {
            if (page === 'ellipsis') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className='px-2 text-sm text-muted-foreground'
                  aria-hidden='true'
                >
                  ...
                </span>
              );
            }

            const isActive = page === currentPage;
            return (
              <Button
                key={page}
                variant='ghost'
                size='sm'
                onClick={() => onPageChange(page)}
                aria-label={`Go to page ${page}`}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'h-8 min-w-[32px] px-3',
                  isActive && 'bg-gray-100 font-medium'
                )}
              >
                {page}
              </Button>
            );
          })}
        </div>

        <Button
          variant='ghost'
          size='icon'
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={!hasNextPage}
          aria-label='Go to next page'
          className='h-8 w-8'
        >
          <ChevronRight className='h-4 w-4' />
        </Button>
      </div>
    </div>
  );
};
