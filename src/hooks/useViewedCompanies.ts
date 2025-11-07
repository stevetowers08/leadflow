import { useEffect, useState, useCallback } from 'react';

const STORAGE_KEY = 'empowr_viewed_companies';

/**
 * Hook to track which companies have been viewed by the user
 */
export function useViewedCompanies() {
  const [viewedCompanies, setViewedCompanies] = useState<Set<string>>(
    new Set()
  );

  // Load viewed companies from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const viewed = JSON.parse(stored) as string[];
        setViewedCompanies(new Set(viewed));
      }
    } catch (error) {
      console.error('Failed to load viewed companies:', error);
    }
  }, []);

  // Mark a company as viewed
  const markAsViewed = useCallback((companyId: string) => {
    setViewedCompanies(prev => {
      const updated = new Set(prev);
      updated.add(companyId);

      // Persist to localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(updated)));
      } catch (error) {
        console.error('Failed to save viewed companies:', error);
      }

      return updated;
    });
  }, []);

  // Check if a company has been viewed
  const isViewed = useCallback(
    (companyId: string): boolean => {
      return viewedCompanies.has(companyId);
    },
    [viewedCompanies]
  );

  // Clear viewed companies (useful for testing or logout)
  const clearViewed = useCallback(() => {
    setViewedCompanies(new Set());
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear viewed companies:', error);
    }
  }, []);

  return {
    isViewed,
    markAsViewed,
    clearViewed,
  };
}

