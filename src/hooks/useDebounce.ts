import { useState, useEffect } from 'react';

/**
 * Custom hook for debouncing values
 * Delays updating the debounced value until after the specified delay
 * Useful for search inputs to avoid excessive API calls or filtering operations
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set debouncedValue to value (passed in) after the specified delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cancel the timeout if value changes (also on component unmount)
    // This prevents debouncedValue from being updated if value is changed
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook for debouncing search terms with additional optimizations
 * Includes empty string handling and minimum character requirements
 */
export function useDebouncedSearch(
  searchTerm: string, 
  delay: number = 300,
  minLength: number = 0
): string {
  const debouncedValue = useDebounce(searchTerm, delay);
  
  // Only return debounced value if it meets minimum length requirement
  if (debouncedValue.length < minLength) {
    return '';
  }
  
  return debouncedValue;
}
