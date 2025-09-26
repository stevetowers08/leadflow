/**
 * Debounced Fetch Utility
 * Prevents overlapping requests and provides request deduplication
 */

import { useCallback, useRef, useEffect } from 'react';

interface DebouncedFetchOptions {
  delay?: number;
  maxRetries?: number;
  retryDelay?: number;
}

interface RequestState {
  isLoading: boolean;
  error: Error | null;
  lastFetch: number;
}

export function useDebouncedFetch<T>(
  fetchFn: () => Promise<T>,
  options: DebouncedFetchOptions = {}
) {
  const {
    delay = 300,
    maxRetries = 3,
    retryDelay = 1000
  } = options;

  const timeoutRef = useRef<NodeJS.Timeout>();
  const abortControllerRef = useRef<AbortController>();
  const requestStateRef = useRef<RequestState>({
    isLoading: false,
    error: null,
    lastFetch: 0
  });

  const debouncedFetch = useCallback(async (): Promise<T | null> => {
    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    return new Promise((resolve, reject) => {
      timeoutRef.current = setTimeout(async () => {
        try {
          requestStateRef.current.isLoading = true;
          requestStateRef.current.error = null;
          requestStateRef.current.lastFetch = Date.now();

          const result = await fetchFn();
          requestStateRef.current.isLoading = false;
          resolve(result);
        } catch (error) {
          requestStateRef.current.isLoading = false;
          requestStateRef.current.error = error as Error;
          reject(error);
        }
      }, delay);
    });
  }, [fetchFn, delay]);

  const immediateFetch = useCallback(async (): Promise<T | null> => {
    // Cancel any pending debounced request
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    try {
      requestStateRef.current.isLoading = true;
      requestStateRef.current.error = null;
      requestStateRef.current.lastFetch = Date.now();

      const result = await fetchFn();
      requestStateRef.current.isLoading = false;
      return result;
    } catch (error) {
      requestStateRef.current.isLoading = false;
      requestStateRef.current.error = error as Error;
      throw error;
    }
  }, [fetchFn]);

  const retryFetch = useCallback(async (): Promise<T | null> => {
    let retries = 0;
    
    while (retries < maxRetries) {
      try {
        return await immediateFetch();
      } catch (error) {
        retries++;
        if (retries >= maxRetries) {
          throw error;
        }
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, retryDelay * retries));
      }
    }
    
    throw new Error('Max retries exceeded');
  }, [immediateFetch, maxRetries, retryDelay]);

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    requestStateRef.current.isLoading = false;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancel();
    };
  }, [cancel]);

  return {
    debouncedFetch,
    immediateFetch,
    retryFetch,
    cancel,
    isLoading: requestStateRef.current.isLoading,
    error: requestStateRef.current.error,
    lastFetch: requestStateRef.current.lastFetch
  };
}

/**
 * Request deduplication utility
 * Prevents multiple identical requests from running simultaneously
 */
class RequestDeduplicator {
  private pendingRequests = new Map<string, Promise<any>>();

  async deduplicate<T>(
    key: string,
    requestFn: () => Promise<T>
  ): Promise<T> {
    // If request is already pending, return the existing promise
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key);
    }

    // Create new request
    const promise = requestFn().finally(() => {
      // Clean up when request completes
      this.pendingRequests.delete(key);
    });

    this.pendingRequests.set(key, promise);
    return promise;
  }

  cancel(key: string): boolean {
    return this.pendingRequests.delete(key);
  }

  cancelAll(): void {
    this.pendingRequests.clear();
  }

  getPendingCount(): number {
    return this.pendingRequests.size;
  }
}

// Global request deduplicator
export const requestDeduplicator = new RequestDeduplicator();

/**
 * Hook for request deduplication
 */
export function useRequestDeduplication() {
  const deduplicate = useCallback(<T>(
    key: string,
    requestFn: () => Promise<T>
  ): Promise<T> => {
    return requestDeduplicator.deduplicate(key, requestFn);
  }, []);

  const cancel = useCallback((key: string) => {
    return requestDeduplicator.cancel(key);
  }, []);

  return {
    deduplicate,
    cancel,
    pendingCount: requestDeduplicator.getPendingCount()
  };
}
