'use client';

import { useCallback } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

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

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const currentPage = parseInt(
    searchParams?.get(pageParam) || defaultPage.toString()
  );
  const pageSize = parseInt(
    searchParams?.get(pageSizeParam) || defaultPageSize.toString()
  );

  const updateUrl = useCallback(
    (page: number, size: number) => {
      const newParams = new URLSearchParams(searchParams?.toString() || '');
      newParams.set(pageParam, page.toString());
      newParams.set(pageSizeParam, size.toString());
      const queryString = newParams.toString();
      const newUrl = queryString
        ? `${pathname || ''}?${queryString}`
        : pathname || '';
      router.push(newUrl);
    },
    [searchParams, pathname, pageParam, pageSizeParam, router]
  );

  const updatePage = useCallback(
    (page: number) => {
      const newParams = new URLSearchParams(searchParams?.toString() || '');
      newParams.set(pageParam, page.toString());
      const queryString = newParams.toString();
      const newUrl = queryString
        ? `${pathname || ''}?${queryString}`
        : pathname || '';
      router.push(newUrl);
    },
    [searchParams, pathname, pageParam, router]
  );

  const updatePageSize = useCallback(
    (size: number) => {
      const newParams = new URLSearchParams(searchParams?.toString() || '');
      newParams.set(pageSizeParam, size.toString());
      newParams.set(pageParam, '1'); // Reset to first page when changing page size
      const queryString = newParams.toString();
      const newUrl = queryString
        ? `${pathname || ''}?${queryString}`
        : pathname || '';
      router.push(newUrl);
    },
    [searchParams, pathname, pageParam, pageSizeParam, router]
  );

  return {
    currentPage,
    pageSize,
    updateUrl,
    updatePage,
    updatePageSize,
  };
};
