import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

interface UrlPaginationOptions {
  defaultPageSize?: number;
  defaultPage?: number;
  pageParam?: string;
  pageSizeParam?: string;
}

export const useUrlPagination = (options: UrlPaginationOptions = {}) => {
  const {
    defaultPageSize = 25,
    defaultPage = 1,
    pageParam = 'page',
    pageSizeParam = 'pageSize',
  } = options;

  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = parseInt(
    searchParams.get(pageParam) || defaultPage.toString()
  );
  const pageSize = parseInt(
    searchParams.get(pageSizeParam) || defaultPageSize.toString()
  );

  const updateUrl = useCallback(
    (page: number, size: number) => {
      setSearchParams(prev => {
        const newParams = new URLSearchParams(prev);
        newParams.set(pageParam, page.toString());
        newParams.set(pageSizeParam, size.toString());
        return newParams;
      });
    },
    [setSearchParams, pageParam, pageSizeParam]
  );

  const updatePage = useCallback(
    (page: number) => {
      setSearchParams(prev => {
        const newParams = new URLSearchParams(prev);
        newParams.set(pageParam, page.toString());
        return newParams;
      });
    },
    [setSearchParams, pageParam]
  );

  const updatePageSize = useCallback(
    (size: number) => {
      setSearchParams(prev => {
        const newParams = new URLSearchParams(prev);
        newParams.set(pageSizeParam, size.toString());
        newParams.set(pageParam, '1'); // Reset to first page when changing page size
        return newParams;
      });
    },
    [setSearchParams, pageParam, pageSizeParam]
  );

  return {
    currentPage,
    pageSize,
    updateUrl,
    updatePage,
    updatePageSize,
  };
};
