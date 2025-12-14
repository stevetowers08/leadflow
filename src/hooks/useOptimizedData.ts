// Performance-optimized hook for data fetching with intelligent caching
import { useCallback, useEffect, useRef, useState } from 'react';
import { PerformanceMonitor } from '@/services/performanceService';
import {
  OptimizedDataService,
  OptimizedDashboardData,
} from '@/services/optimizedDataService';

interface UseOptimizedDataOptions {
  enablePreloading?: boolean;
  cacheKey?: string;
  refreshInterval?: number;
}

export function useOptimizedData(options: UseOptimizedDataOptions = {}) {
  const [data, setData] = useState<OptimizedDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const monitor = useRef(PerformanceMonitor.getInstance());
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      monitor.current.startTracking();
      const result = await OptimizedDataService.getDashboardData();
      monitor.current.endTracking();

      setData(result);
    } catch (err) {
      setError(err as Error);
      monitor.current.logError();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();

    if (options.refreshInterval) {
      refreshIntervalRef.current = setInterval(
        fetchData,
        options.refreshInterval
      );
    }

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [fetchData, options.refreshInterval]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}
