import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  visiblePages: number[];
  showFirstEllipsis: boolean;
  showLastEllipsis: boolean;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  pageSizeOptions?: number[];
  showPageSizeSelector?: boolean;
  showItemCount?: boolean;
  showGoToPage?: boolean;
  className?: string;
  loading?: boolean;
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  visiblePages,
  showFirstEllipsis,
  showLastEllipsis,
  hasNextPage,
  hasPreviousPage,
  pageSizeOptions = [10, 20, 50, 100],
  showPageSizeSelector = true,
  showItemCount = true,
  showGoToPage = true,
  className,
  loading = false,
}) => {
  const [goToPage, setGoToPage] = useState('');
  const [isKeyboardMode, setIsKeyboardMode] = useState(false);

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLElement &&
        e.target.closest('[role="navigation"]')
      ) {
        switch (e.key) {
          case 'ArrowLeft':
            e.preventDefault();
            if (hasPreviousPage) onPageChange(currentPage - 1);
            break;
          case 'ArrowRight':
            e.preventDefault();
            if (hasNextPage) onPageChange(currentPage + 1);
            break;
          case 'Home':
            e.preventDefault();
            onPageChange(1);
            break;
          case 'End':
            e.preventDefault();
            onPageChange(totalPages);
            break;
        }
      }
    },
    [currentPage, totalPages, hasNextPage, hasPreviousPage, onPageChange]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleGoToPage = () => {
    const page = parseInt(goToPage);
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
      setGoToPage('');
    }
  };

  const handleGoToPageKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleGoToPage();
    }
  };

  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row items-center justify-between gap-4',
        className
      )}
      role='region'
      aria-label='Table pagination'
      aria-live='polite'
    >
      {/* Item count and page size selector */}
      <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4'>
        {showItemCount && (
          <div className='text-sm text-muted-foreground'>
            Showing <span className='font-medium'>{startItem}</span> to{' '}
            <span className='font-medium'>{endItem}</span> of{' '}
            <span className='font-medium'>{totalItems}</span> results
          </div>
        )}

        {showPageSizeSelector && (
          <div className='flex items-center gap-2'>
            <span className='text-sm text-muted-foreground'>Show:</span>
            <Select
              value={pageSize.toString()}
              onValueChange={value => onPageSizeChange(Number(value))}
              disabled={loading}
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
      </div>

      {/* Pagination controls */}
      <div className='flex items-center gap-2'>
        {/* Go to page input - only show on larger screens */}
        {showGoToPage && totalPages > 10 && (
          <div className='hidden md:flex items-center gap-2'>
            <span className='text-sm text-muted-foreground'>Go to:</span>
            <Input
              type='number'
              value={goToPage}
              onChange={e => setGoToPage(e.target.value)}
              onKeyDown={handleGoToPageKeyDown}
              placeholder='Page'
              className='w-16 h-8 text-sm'
              min='1'
              max={totalPages}
              disabled={loading}
            />
            <Button
              size='sm'
              onClick={handleGoToPage}
              disabled={
                !goToPage ||
                parseInt(goToPage) < 1 ||
                parseInt(goToPage) > totalPages ||
                loading
              }
              className='h-8 px-2'
            >
              Go
            </Button>
          </div>
        )}

        <nav role='navigation' aria-label='Pagination Navigation'>
          <Pagination className='mx-0'>
            <PaginationContent>
              {/* First page button */}
              <PaginationItem>
                <PaginationPrevious
                  onClick={
                    !hasPreviousPage || loading
                      ? undefined
                      : () => onPageChange(1)
                  }
                  className={cn(
                    'cursor-pointer transition-colors',
                    !hasPreviousPage || loading
                      ? 'pointer-events-none opacity-50'
                      : 'hover:bg-gray-100'
                  )}
                  aria-label='Go to first page'
                >
                  <ArrowLeft className='h-4 w-4' />
                </PaginationPrevious>
              </PaginationItem>

              {/* Previous button */}
              <PaginationItem>
                <PaginationPrevious
                  onClick={
                    !hasPreviousPage || loading
                      ? undefined
                      : () => onPageChange(currentPage - 1)
                  }
                  className={cn(
                    'cursor-pointer transition-colors',
                    !hasPreviousPage || loading
                      ? 'pointer-events-none opacity-50'
                      : 'hover:bg-gray-100'
                  )}
                  aria-label='Go to previous page'
                >
                  <ChevronLeft className='h-4 w-4' />
                </PaginationPrevious>
              </PaginationItem>

              {/* First page */}
              {showFirstEllipsis && (
                <>
                  <PaginationItem>
                    <PaginationLink
                      onClick={() => onPageChange(1)}
                      className='cursor-pointer hover:bg-gray-100 transition-colors'
                      aria-label='Go to page 1'
                    >
                      1
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                </>
              )}

              {/* Visible pages */}
              {visiblePages.map(page => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => onPageChange(page)}
                    isActive={page === currentPage}
                    className={cn(
                      'cursor-pointer transition-colors',
                      page === currentPage
                        ? 'bg-primary text-white hover:bg-primary/90'
                        : 'hover:bg-gray-100'
                    )}
                    aria-label={`Go to page ${page}`}
                    aria-current={page === currentPage ? 'page' : undefined}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

              {/* Last page */}
              {showLastEllipsis && (
                <>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink
                      onClick={() => onPageChange(totalPages)}
                      className='cursor-pointer hover:bg-gray-100 transition-colors'
                      aria-label={`Go to page ${totalPages}`}
                    >
                      {totalPages}
                    </PaginationLink>
                  </PaginationItem>
                </>
              )}

              {/* Next button */}
              <PaginationItem>
                <PaginationNext
                  onClick={() => hasNextPage && onPageChange(currentPage + 1)}
                  className={cn(
                    'cursor-pointer transition-colors',
                    !hasNextPage
                      ? 'pointer-events-none opacity-50'
                      : 'hover:bg-gray-100'
                  )}
                  aria-label='Go to next page'
                >
                  <ChevronRight className='h-4 w-4' />
                </PaginationNext>
              </PaginationItem>

              {/* Last page button */}
              <PaginationItem>
                <PaginationNext
                  onClick={() => hasNextPage && onPageChange(totalPages)}
                  className={cn(
                    'cursor-pointer transition-colors',
                    !hasNextPage
                      ? 'pointer-events-none opacity-50'
                      : 'hover:bg-gray-100'
                  )}
                  aria-label='Go to last page'
                >
                  <ArrowRight className='h-4 w-4' />
                </PaginationNext>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </nav>
      </div>
    </div>
  );
};

// Compact version for smaller spaces
export const CompactPaginationControls: React.FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  className?: string;
  loading?: boolean;
}> = ({
  currentPage,
  totalPages,
  onPageChange,
  hasNextPage,
  hasPreviousPage,
  className,
  loading = false,
}) => {
  return (
    <div className={cn('flex items-center justify-center gap-2', className)}>
      <Button
        variant='outline'
        size='sm'
        onClick={() => hasPreviousPage && onPageChange(currentPage - 1)}
        className='h-8 w-8 p-0'
        aria-label='Go to previous page'
      >
        <ChevronLeft className='h-4 w-4' />
      </Button>

      <span className='text-sm text-muted-foreground px-2 min-w-[80px] text-center'>
        {currentPage} of {totalPages}
      </span>

      <Button
        variant='outline'
        size='sm'
        onClick={() => hasNextPage && onPageChange(currentPage + 1)}
        className='h-8 w-8 p-0'
        aria-label='Go to next page'
      >
        <ChevronRight className='h-4 w-4' />
      </Button>
    </div>
  );
};
