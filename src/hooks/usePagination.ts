import { useCallback, useMemo, useState } from 'react';

export interface PaginationOptions {
  pageSize?: number;
  initialPage?: number;
  maxVisiblePages?: number;
  persistToUrl?: boolean;
  urlParams?: {
    pageParam?: string;
    pageSizeParam?: string;
  };
}

export interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginationActions {
  goToPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  setPageSize: (size: number) => void;
  reset: () => void;
}

export interface PaginationInfo {
  visiblePages: number[];
  showFirstEllipsis: boolean;
  showLastEllipsis: boolean;
}

export const usePagination = (
  totalItems: number,
  options: PaginationOptions = {}
): PaginationState & PaginationActions & PaginationInfo => {
  const {
    pageSize: initialPageSize = 10,
    initialPage = 1,
    maxVisiblePages = 5,
    persistToUrl = false,
    urlParams = {},
  } = options;

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const paginationState = useMemo((): PaginationState => {
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

    return {
      currentPage: Math.min(currentPage, totalPages),
      pageSize,
      totalItems,
      totalPages,
      startIndex,
      endIndex,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
    };
  }, [currentPage, pageSize, totalItems]);

  const paginationInfo = useMemo((): PaginationInfo => {
    const { totalPages } = paginationState;
    const { currentPage } = paginationState;

    if (totalPages <= maxVisiblePages) {
      return {
        visiblePages: Array.from({ length: totalPages }, (_, i) => i + 1),
        showFirstEllipsis: false,
        showLastEllipsis: false,
      };
    }

    const halfVisible = Math.floor(maxVisiblePages / 2);
    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    const visiblePages = Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );

    return {
      visiblePages,
      showFirstEllipsis: startPage > 1,
      showLastEllipsis: endPage < totalPages,
    };
  }, [paginationState, maxVisiblePages]);

  const actions: PaginationActions = {
    goToPage: useCallback(
      (page: number) => {
        const validPage = Math.max(
          1,
          Math.min(page, paginationState.totalPages)
        );
        setCurrentPage(validPage);
      },
      [paginationState.totalPages]
    ),

    nextPage: useCallback(() => {
      if (paginationState.hasNextPage) {
        setCurrentPage(prev => prev + 1);
      }
    }, [paginationState.hasNextPage]),

    previousPage: useCallback(() => {
      if (paginationState.hasPreviousPage) {
        setCurrentPage(prev => prev - 1);
      }
    }, [paginationState.hasPreviousPage]),

    setPageSize: useCallback((size: number) => {
      const validSize = Math.max(1, size);
      setPageSize(validSize);
      setCurrentPage(1); // Reset to first page when changing page size
    }, []),

    reset: useCallback(() => {
      setCurrentPage(initialPage);
      setPageSize(initialPageSize);
    }, [initialPage, initialPageSize]),
  };

  return {
    ...paginationState,
    ...paginationInfo,
    ...actions,
  };
};

// Hook for paginating data arrays
export const usePaginatedData = <T>(
  data: T[],
  options: PaginationOptions = {}
): {
  paginatedData: T[];
  pagination: ReturnType<typeof usePagination>;
} => {
  const pagination = usePagination(data.length, options);

  const paginatedData = useMemo(() => {
    return data.slice(pagination.startIndex, pagination.endIndex + 1);
  }, [data, pagination.startIndex, pagination.endIndex]);

  return {
    paginatedData,
    pagination,
  };
};
