/**
 * Table View Preferences Hook
 * Manages table filtering and sorting preferences with localStorage persistence
 */

import { useState, useEffect, useCallback } from 'react';
import { TableViewPreferences } from '@/types/tableFilters';

const STORAGE_PREFIX = 'table-view-';

export function useTableViewPreferences(
  tableKey: string,
  defaults: TableViewPreferences
) {
  const storageKey = `${STORAGE_PREFIX}${tableKey}`;

  // Load initial preferences from localStorage or use defaults
  const [preferences, setPreferences] = useState<TableViewPreferences>(() => {
    if (typeof window === 'undefined') return defaults;

    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Merge with defaults to handle new filter keys
        return {
          sortBy: parsed.sortBy || defaults.sortBy,
          filters: { ...defaults.filters, ...parsed.filters },
        };
      }
    } catch (error) {
      console.error('Error loading table preferences:', error);
    }
    return defaults;
  });

  // Save preferences to localStorage whenever they change (debounced)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const timeoutId = setTimeout(() => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(preferences));
      } catch (error) {
        console.error('Error saving table preferences:', error);
      }
    }, 300); // Debounce 300ms

    return () => clearTimeout(timeoutId);
  }, [preferences, storageKey]);

  // Update preferences (partial update)
  const updatePreferences = useCallback(
    (updates: Partial<TableViewPreferences>) => {
      setPreferences(prev => ({
        ...prev,
        ...updates,
        filters: {
          ...prev.filters,
          ...(updates.filters || {}),
        },
      }));
    },
    []
  );

  // Update a single filter
  const updateFilter = useCallback((key: string, value: string | string[]) => {
    setPreferences(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        [key]: value,
      },
    }));
  }, []);

  // Update sort
  const updateSort = useCallback((sortBy: string) => {
    setPreferences(prev => ({
      ...prev,
      sortBy,
    }));
  }, []);

  // Reset to defaults
  const resetPreferences = useCallback(() => {
    setPreferences(defaults);
    try {
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.error('Error resetting table preferences:', error);
    }
  }, [defaults, storageKey]);

  // Check if any non-default filters are active
  const hasActiveFilters = useCallback(() => {
    return Object.entries(preferences.filters).some(([key, value]) => {
      const defaultValue = defaults.filters[key];
      if (Array.isArray(value)) {
        return value.length > 0 && value.some(v => v !== 'all');
      }
      return value !== defaultValue && value !== 'all';
    });
  }, [preferences.filters, defaults.filters]);

  return {
    preferences,
    updatePreferences,
    updateFilter,
    updateSort,
    resetPreferences,
    hasActiveFilters: hasActiveFilters(),
  };
}
