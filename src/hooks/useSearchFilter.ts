import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

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

  const location = useLocation();
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
      const urlParams = new URLSearchParams(location.search);
      const urlSearchTerm = urlParams.get('search') || '';
      const urlFilters: Record<string, string> = {};

      urlParams.forEach((value, key) => {
        if (key !== 'search') {
          urlFilters[key] = value;
        }
      });

      setSearchTerm(urlSearchTerm);
      setFilters({ ...initialFilters, ...urlFilters });
    } else {
      // Load from localStorage
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          setSearchTerm(parsed.searchTerm || '');
          setFilters({ ...initialFilters, ...parsed.filters });
        }
      } catch (error) {
        console.warn('Failed to load search filters from localStorage:', error);
      }
    }
  }, [location.search, persistInUrl, storageKey, initialFilters]);

  // Save state to URL or localStorage
  const saveState = useCallback(() => {
    if (persistInUrl) {
      const urlParams = new URLSearchParams();

      if (debouncedSearchTerm) {
        urlParams.set('search', debouncedSearchTerm);
      }

      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          urlParams.set(key, value);
        }
      });

      const newUrl = `${location.pathname}${urlParams.toString() ? `?${urlParams.toString()}` : ''}`;
      window.history.replaceState({}, '', newUrl);
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
    location.pathname,
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
