/**
 * Custom useDebounce Hook - 2025 Best Practices
 * Optimized for performance with proper cleanup
 */

import { useEffect, useState } from 'react';

/**
 * Debounces a value with the specified delay
 * @param value - The value to debounce
 * @param delay - The delay in milliseconds
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up a timer to update the debounced value
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup function to clear the timer
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Debounces a callback function
 * @param callback - The callback function to debounce
 * @param delay - The delay in milliseconds
 * @param deps - Dependencies array for the callback
 * @returns The debounced callback
 */
export function useDebouncedCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number,
  deps: React.DependencyList = []
): T {
  const [debouncedCallback, setDebouncedCallback] = useState<T>(callback);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedCallback(() => callback);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [callback, delay, ...deps]);

  return debouncedCallback;
}
