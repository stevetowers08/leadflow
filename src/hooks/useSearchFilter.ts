'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';

export interface FilterState {
  searchTerm: string;
  filters: Record<string, string>;
}

export interface UseSearchFilterOptions {
  persistInUrl?: boolean;
  debounceMs?: number;
  storageKey?: string;
}

export const useSearchFilter = (
  initialFilters: Record<string, string> = {},
  options: UseSearchFilterOptions = {}
) => {
  const {
    persistInUrl = true,
    debounceMs = 300,
    storageKey = 'search-filters',
  } = options;

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] =
    useState<Record<string, string>>(initialFilters);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchTerm, debounceMs]);

  // Load state from URL or localStorage
  useEffect(() => {
    if (persistInUrl) {
      const urlSearchTerm = searchParams.get('search') || '';
      const urlFilters: Record<string, string> = {};

      searchParams.forEach((value, key) => {
        if (key !== 'search') {
          urlFilters[key] = value;
        }
      });

      setSearchTerm(urlSearchTerm);
      setFilters({ ...initialFilters, ...urlFilters });
    } else {
      // Load from localStorage (only on client)
      if (typeof window !== 'undefined') {
        try {
          const saved = localStorage.getItem(storageKey);
          if (saved) {
            const parsed = JSON.parse(saved);
            setSearchTerm(parsed.searchTerm || '');
            setFilters({ ...initialFilters, ...parsed.filters });
          }
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.warn('Failed to load search filters from localStorage:', error);
          }
        }
      }
    }
  }, [searchParams, persistInUrl, storageKey, initialFilters]);

  // Save state to URL or localStorage
  const saveState = useCallback(() => {
    if (persistInUrl) {
      const urlParams = new URLSearchParams(searchParams.toString());

      if (debouncedSearchTerm) {
        urlParams.set('search', debouncedSearchTerm);
      } else {
        urlParams.delete('search');
      }

      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          urlParams.set(key, value);
        } else {
          urlParams.delete(key);
        }
      });

      const queryString = urlParams.toString();
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
      router.replace(newUrl);
    } else {
      // Save to localStorage
      try {
        const state = {
          searchTerm: debouncedSearchTerm,
          filters,
        };
        localStorage.setItem(storageKey, JSON.stringify(state));
      } catch (error) {
        console.warn('Failed to save search filters to localStorage:', error);
      }
    }
  }, [
    debouncedSearchTerm,
    filters,
    persistInUrl,
    storageKey,
    pathname,
    searchParams,
    router,
  ]);

  // Save state when it changes
  useEffect(() => {
    saveState();
  }, [saveState]);

  const updateFilter = useCallback((key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const clearFilter = useCallback((key: string) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  }, []);

  const clearAllFilters = useCallback(() => {
    setSearchTerm('');
    setFilters({});
  }, []);

  const hasActiveFilters =
    Object.values(filters).some(value => value !== '') || searchTerm !== '';

  return {
    searchTerm,
    setSearchTerm,
    debouncedSearchTerm,
    filters,
    updateFilter,
    clearFilter,
    clearAllFilters,
    hasActiveFilters,
  };
};

// Hook for URL-based search and filter persistence
export const useUrlSearchFilter = (
  initialFilters: Record<string, string> = {}
) => {
  return useSearchFilter(initialFilters, {
    persistInUrl: true,
    debounceMs: 300,
  });
};

// Hook for localStorage-based search and filter persistence
export const useLocalSearchFilter = (
  initialFilters: Record<string, string> = {},
  storageKey?: string
) => {
  return useSearchFilter(initialFilters, {
    persistInUrl: false,
    debounceMs: 300,
    storageKey,
  });
};
