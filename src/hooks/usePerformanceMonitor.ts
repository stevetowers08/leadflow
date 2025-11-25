import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getPerformanceMemory } from '@/utils/performanceMemory';

// Performance monitoring configuration
export const PERFORMANCE_CONFIG = {
  // Performance thresholds
  THRESHOLDS: {
    QUERY_TIME: 1000, // 1 second
    CACHE_HIT_RATIO: 0.8, // 80%
    MEMORY_USAGE: 50 * 1024 * 1024, // 50MB
    ERROR_RATE: 0.05, // 5%
  },

  // Monitoring intervals
  INTERVALS: {
    PERFORMANCE_CHECK: 30000, // 30 seconds
    CACHE_ANALYSIS: 60000, // 1 minute
    MEMORY_CHECK: 10000, // 10 seconds
  },

  // Optimization triggers
  OPTIMIZATION_TRIGGERS: {
    SLOW_QUERIES: 5, // Trigger optimization after 5 slow queries
    HIGH_ERROR_RATE: 0.1, // Trigger optimization if error rate > 10%
    LOW_CACHE_HIT: 0.6, // Trigger optimization if cache hit < 60%
  },
};

// Performance metrics interface
export interface PerformanceMetrics {
  queryTimes: number[];
  cacheHitRatio: number;
  memoryUsage: number;
  errorRate: number;
  slowQueries: number;
  totalQueries: number;
  lastOptimization: Date | null;
  optimizationCount: number;
}

// Performance monitoring hook
export function usePerformanceMonitor() {
  const queryClient = useQueryClient();
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    queryTimes: [],
    cacheHitRatio: 0,
    memoryUsage: 0,
    errorRate: 0,
    slowQueries: 0,
    totalQueries: 0,
    lastOptimization: null,
    optimizationCount: 0,
  });

  const [isOptimizing, setIsOptimizing] = useState(false);
  const [alerts, setAlerts] = useState<string[]>([]);

  const queryTimesRef = useRef<number[]>([]);
  const errorCountRef = useRef(0);
  const totalQueriesRef = useRef(0);
  const slowQueriesRef = useRef(0);

  // Monitor query performance
  const trackQueryPerformance = useCallback(
    (queryTime: number, isError: boolean = false) => {
      queryTimesRef.current.push(queryTime);
      totalQueriesRef.current++;

      if (isError) {
        errorCountRef.current++;
      }

      if (queryTime > PERFORMANCE_CONFIG.THRESHOLDS.QUERY_TIME) {
        slowQueriesRef.current++;
      }

      // Keep only last 100 query times for rolling average
      if (queryTimesRef.current.length > 100) {
        queryTimesRef.current = queryTimesRef.current.slice(-100);
      }
    },
    []
  );

  // Calculate cache hit ratio
  const calculateCacheHitRatio = useCallback(() => {
    const cache = queryClient.getQueryCache();
    const queries = cache.getAll();

    let hits = 0;
    let misses = 0;

    queries.forEach(query => {
      if (query.state.dataUpdatedAt > 0) {
        hits++;
      } else {
        misses++;
      }
    });

    return hits + misses > 0 ? hits / (hits + misses) : 0;
  }, [queryClient]);

  // Monitor memory usage
  const getMemoryUsage = useCallback(() => {
    const memory = getPerformanceMemory();
    return memory?.usedJSHeapSize ?? 0;
  }, []);

  // Update metrics
  const updateMetrics = useCallback(() => {
    const cacheHitRatio = calculateCacheHitRatio();
    const memoryUsage = getMemoryUsage();
    const errorRate =
      totalQueriesRef.current > 0
        ? errorCountRef.current / totalQueriesRef.current
        : 0;
    const avgQueryTime =
      queryTimesRef.current.length > 0
        ? queryTimesRef.current.reduce((a, b) => a + b, 0) /
          queryTimesRef.current.length
        : 0;

    setMetrics(prev => ({
      ...prev,
      queryTimes: [...queryTimesRef.current],
      cacheHitRatio,
      memoryUsage,
      errorRate,
      slowQueries: slowQueriesRef.current,
      totalQueries: totalQueriesRef.current,
    }));

    // Check for performance alerts
    const newAlerts: string[] = [];

    if (avgQueryTime > PERFORMANCE_CONFIG.THRESHOLDS.QUERY_TIME) {
      newAlerts.push(
        `Average query time (${avgQueryTime.toFixed(0)}ms) exceeds threshold`
      );
    }

    if (cacheHitRatio < PERFORMANCE_CONFIG.THRESHOLDS.CACHE_HIT_RATIO) {
      newAlerts.push(
        `Cache hit ratio (${(cacheHitRatio * 100).toFixed(1)}%) below threshold`
      );
    }

    if (memoryUsage > PERFORMANCE_CONFIG.THRESHOLDS.MEMORY_USAGE) {
      newAlerts.push(
        `Memory usage (${(memoryUsage / 1024 / 1024).toFixed(1)}MB) exceeds threshold`
      );
    }

    if (errorRate > PERFORMANCE_CONFIG.THRESHOLDS.ERROR_RATE) {
      newAlerts.push(
        `Error rate (${(errorRate * 100).toFixed(1)}%) exceeds threshold`
      );
    }

    setAlerts(newAlerts);
  }, [calculateCacheHitRatio, getMemoryUsage]);

  // Performance optimization
  const optimizePerformance = useCallback(async () => {
    if (isOptimizing) return;

    setIsOptimizing(true);

    try {
      // Log optimization start in development only
      if (import.meta.env.MODE === 'development') {
        console.log('🚀 Starting performance optimization...');
      }

      // Clear expired cache entries
      const cache = queryClient.getQueryCache();
      const queries = cache.getAll();

      queries.forEach(query => {
        if (
          query.isStale() &&
          query.state.dataUpdatedAt < Date.now() - 5 * 60 * 1000
        ) {
          queryClient.removeQueries({ queryKey: query.queryKey });
        }
      });

      // Prefetch critical data
      const criticalQueries = [
        {
          key: ['people'],
          fn: () => supabase.from('people').select('id, name, stage').limit(50),
        },
        {
          key: ['companies'],
          fn: () =>
            supabase
              .from('companies')
              .select('id, name, pipeline_stage')
              .limit(50),
        },
        {
          key: ['jobs'],
          fn: () =>
            supabase.from('jobs').select('id, title, priority').limit(50),
        },
      ];

      await Promise.allSettled(
        criticalQueries.map(({ key, fn }) =>
          queryClient.prefetchQuery({
            queryKey: key,
            queryFn: fn,
            staleTime: 2 * 60 * 1000,
          })
        )
      );

      // Reset performance counters
      queryTimesRef.current = [];
      errorCountRef.current = 0;
      slowQueriesRef.current = 0;

      setMetrics(prev => ({
        ...prev,
        lastOptimization: new Date(),
        optimizationCount: prev.optimizationCount + 1,
      }));

      console.log('✅ Performance optimization completed');
    } catch (error) {
      console.error('❌ Performance optimization failed:', error);
    } finally {
      setIsOptimizing(false);
    }
  }, [queryClient, isOptimizing]);

  // Auto-optimization based on metrics
  useEffect(() => {
    const shouldOptimize =
      slowQueriesRef.current >=
        PERFORMANCE_CONFIG.OPTIMIZATION_TRIGGERS.SLOW_QUERIES ||
      metrics.errorRate >=
        PERFORMANCE_CONFIG.OPTIMIZATION_TRIGGERS.HIGH_ERROR_RATE ||
      metrics.cacheHitRatio <=
        PERFORMANCE_CONFIG.OPTIMIZATION_TRIGGERS.LOW_CACHE_HIT;

    if (shouldOptimize && !isOptimizing) {
      console.log('🔧 Auto-optimization triggered');
      optimizePerformance();
    }
  }, [metrics, optimizePerformance, isOptimizing]);

  // Periodic monitoring
  useEffect(() => {
    const interval = setInterval(
      updateMetrics,
      PERFORMANCE_CONFIG.INTERVALS.PERFORMANCE_CHECK
    );
    return () => clearInterval(interval);
  }, [updateMetrics]);

  // Memory monitoring
  useEffect(() => {
    const interval = setInterval(() => {
      const memoryUsage = getMemoryUsage();
      if (memoryUsage > PERFORMANCE_CONFIG.THRESHOLDS.MEMORY_USAGE) {
        console.warn('⚠️ High memory usage detected:', memoryUsage);
      }
    }, PERFORMANCE_CONFIG.INTERVALS.MEMORY_CHECK);

    return () => clearInterval(interval);
  }, [getMemoryUsage]);

  return {
    metrics,
    alerts,
    isOptimizing,
    trackQueryPerformance,
    optimizePerformance,
    updateMetrics,
  };
}

// Database performance monitoring
export function useDatabasePerformanceMonitor() {
  const [dbMetrics, setDbMetrics] = useState({
    activeConnections: 0,
    slowQueries: 0,
    queryCount: 0,
    avgQueryTime: 0,
    lastCheck: new Date(),
  });

  const checkDatabasePerformance = useCallback(async () => {
    try {
      // Get database statistics
      const { data: stats, error } = await supabase
        .rpc('get_database_stats')
        .single();

      if (error) {
        console.error('Failed to get database stats:', error);
        return;
      }

      setDbMetrics({
        activeConnections: stats.active_connections || 0,
        slowQueries: stats.slow_queries || 0,
        queryCount: stats.query_count || 0,
        avgQueryTime: stats.avg_query_time || 0,
        lastCheck: new Date(),
      });
    } catch (error) {
      console.error('Database performance check failed:', error);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(checkDatabasePerformance, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [checkDatabasePerformance]);

  return {
    dbMetrics,
    checkDatabasePerformance,
  };
}

// Performance optimization recommendations
export function usePerformanceRecommendations(metrics: PerformanceMetrics) {
  const [recommendations, setRecommendations] = useState<string[]>([]);

  useEffect(() => {
    const newRecommendations: string[] = [];

    // Query performance recommendations
    if (metrics.slowQueries > 0) {
      newRecommendations.push(
        'Consider adding database indexes for frequently queried columns'
      );
      newRecommendations.push('Review and optimize complex queries');
    }

    // Cache recommendations
    if (metrics.cacheHitRatio < 0.7) {
      newRecommendations.push('Increase cache time for static data');
      newRecommendations.push('Implement more aggressive prefetching');
    }

    // Memory recommendations
    if (metrics.memoryUsage > PERFORMANCE_CONFIG.THRESHOLDS.MEMORY_USAGE) {
      newRecommendations.push('Clear unused cache entries more frequently');
      newRecommendations.push('Consider implementing data pagination');
    }

    // Error rate recommendations
    if (metrics.errorRate > 0.05) {
      newRecommendations.push('Review error handling and retry logic');
      newRecommendations.push('Implement better error boundaries');
    }

    setRecommendations(newRecommendations);
  }, [metrics]);

  return recommendations;
}

// Performance dashboard data
export function usePerformanceDashboard() {
  const { metrics, alerts, isOptimizing, optimizePerformance } =
    usePerformanceMonitor();
  const { dbMetrics } = useDatabasePerformanceMonitor();
  const recommendations = usePerformanceRecommendations(metrics);

  const performanceScore = useCallback(() => {
    let score = 100;

    // Deduct points for performance issues
    if (metrics.errorRate > 0.05) score -= 20;
    if (metrics.cacheHitRatio < 0.8) score -= 15;
    if (metrics.slowQueries > 5) score -= 25;
    if (metrics.memoryUsage > PERFORMANCE_CONFIG.THRESHOLDS.MEMORY_USAGE)
      score -= 10;

    return Math.max(0, score);
  }, [metrics]);

  return {
    metrics,
    dbMetrics,
    alerts,
    recommendations,
    isOptimizing,
    performanceScore: performanceScore(),
    optimizePerformance,
  };
}
