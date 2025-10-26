/**
 * Performance Optimization Utilities
 *
 * This module provides utilities for optimizing React performance including:
 * - Memoization helpers
 * - Lazy loading utilities
 * - Performance monitoring
 * - Bundle optimization
 */

import React, {
    Suspense,
    lazy,
    memo,
    useCallback,
    useEffect,
    useRef,
} from 'react';

// Memoization utilities
export const createMemoizedComponent = <P extends object>(
  Component: React.ComponentType<P>,
  areEqual?: (prevProps: P, nextProps: P) => boolean
) => {
  return memo(Component, areEqual);
};

// Lazy loading utilities
export const createLazyComponent = <P extends object>(
  importFn: () => Promise<{ default: React.ComponentType<P> }>
) => {
  return lazy(importFn);
};

// Performance monitoring hook
export const usePerformanceMonitor = (componentName: string) => {
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    startTimeRef.current = performance.now();
  }, []);

  const logPerformance = useCallback(
    (action: string) => {
      if (!startTimeRef.current) return;

      const endTime = performance.now();
      const duration = endTime - startTimeRef.current;

      if (duration > 16) {
        // Log if slower than 60fps
        console.warn(
          `🐌 Performance warning: ${componentName} ${action} took ${duration.toFixed(2)}ms`
        );
      }
    },
    [componentName]
  );

  return { logPerformance };
};

// Optimized data fetching hook
export const useOptimizedData = <T,>(
  fetchFn: () => Promise<T>,
  deps: React.DependencyList,
  options: {
    staleTime?: number;
    cacheTime?: number;
    enabled?: boolean;
  } = {}
) => {
  const [data, setData] = React.useState<T | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!options.enabled) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [fetchFn, options.enabled]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
};

// Bundle optimization utilities
export const createCodeSplitComponent = <P extends object>(
  importFn: () => Promise<{ default: React.ComponentType<P> }>,
  fallback?: React.ReactNode
) => {
  const LazyComponent = lazy(importFn);

  return memo((props: P) => (
    <Suspense
      fallback={
        fallback || <div className='animate-pulse bg-gray-200 h-32 rounded' />
      }
    >
      <LazyComponent {...props} />
    </Suspense>
  ));
};

// Memory optimization utilities
export const useMemoryOptimizedState = <T,>(
  initialState: T,
  maxHistorySize: number = 10
) => {
  const [state, setState] = React.useState(initialState);
  const [history, setHistory] = React.useState<T[]>([]);

  const setOptimizedState = useCallback(
    (newState: T) => {
      setState(newState);
      setHistory(prev => {
        const newHistory = [newState, ...prev].slice(0, maxHistorySize);
        return newHistory;
      });
    },
    [maxHistorySize]
  );

  const undo = useCallback(() => {
    if (history.length > 1) {
      const previousState = history[1];
      setState(previousState);
      setHistory(prev => prev.slice(1));
    }
  }, [history]);

  return {
    state,
    setState: setOptimizedState,
    undo,
    canUndo: history.length > 1,
  };
};

// Virtual scrolling utilities
export const useVirtualScrolling = (
  itemCount: number,
  itemHeight: number,
  containerHeight: number
) => {
  const [scrollTop, setScrollTop] = React.useState(0);

  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / itemHeight) + 1,
    itemCount
  );

  const visibleItems = Array.from(
    { length: visibleEnd - visibleStart },
    (_, i) => visibleStart + i
  );

  const totalHeight = itemCount * itemHeight;
  const offsetY = visibleStart * itemHeight;

  return {
    visibleItems,
    totalHeight,
    offsetY,
    setScrollTop,
  };
};

// Debounced search hook
export const useDebouncedSearch = (searchTerm: string, delay: number = 300) => {
  const [debouncedTerm, setDebouncedTerm] = React.useState(searchTerm);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, delay);

    return () => clearTimeout(timer);
  }, [searchTerm, delay]);

  return debouncedTerm;
};

// Intersection observer hook for lazy loading
export const useIntersectionObserver = (
  ref: React.RefObject<HTMLElement>,
  options: IntersectionObserverInit = {}
) => {
  const [isIntersecting, setIsIntersecting] = React.useState(false);

  React.useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [ref, options]);

  return isIntersecting;
};

// Performance metrics collection
export const collectPerformanceMetrics = () => {
  const metrics = {
    renderTime: 0,
    memoryUsage: 0,
    bundleSize: 0,
    apiResponseTime: 0,
  };

  // Collect render time
  const observer = new PerformanceObserver(list => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'measure') {
        metrics.renderTime = entry.duration;
      }
    }
  });

  observer.observe({ entryTypes: ['measure'] });

  // Collect memory usage
  if ('memory' in performance) {
    metrics.memoryUsage = (
      performance as unknown as Record<string, unknown>
    ).memory.usedJSHeapSize;
  }

  return metrics;
};

export default {
  createMemoizedComponent,
  createLazyComponent,
  usePerformanceMonitor,
  useOptimizedData,
  createCodeSplitComponent,
  useMemoryOptimizedState,
  useVirtualScrolling,
  useDebouncedSearch,
  useIntersectionObserver,
  collectPerformanceMetrics,
};
