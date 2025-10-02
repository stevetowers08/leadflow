import { useEffect, useRef, useCallback } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  memoryUsage?: number;
  timestamp: number;
  componentName: string;
}

interface PerformanceConfig {
  enabled: boolean;
  sampleRate: number; // 0-1, percentage of renders to measure
  logThreshold: number; // Log if render time exceeds this (ms)
  maxSamples: number; // Maximum number of samples to keep in memory
}

const defaultConfig: PerformanceConfig = {
  enabled: process.env.NODE_ENV === 'development',
  sampleRate: 0.1, // 10% of renders
  logThreshold: 16, // 16ms (60fps threshold)
  maxSamples: 100,
};

const performanceData: PerformanceMetrics[] = [];

export const usePerformanceMonitoring = (
  componentName: string,
  config: Partial<PerformanceConfig> = {}
) => {
  const startTimeRef = useRef<number>(0);
  const renderCountRef = useRef<number>(0);
  const mergedConfig = { ...defaultConfig, ...config };

  const logPerformance = useCallback((renderTime: number) => {
    if (!mergedConfig.enabled) return;

    const shouldSample = Math.random() < mergedConfig.sampleRate;
    if (!shouldSample) return;

    const metrics: PerformanceMetrics = {
      renderTime,
      timestamp: Date.now(),
      componentName,
      memoryUsage: (performance as any).memory?.usedJSHeapSize,
    };

    performanceData.push(metrics);

    // Keep only the most recent samples
    if (performanceData.length > mergedConfig.maxSamples) {
      performanceData.splice(0, performanceData.length - mergedConfig.maxSamples);
    }

    // Log slow renders
    if (renderTime > mergedConfig.logThreshold) {
      console.warn(
        `🐌 Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`
      );
    }

    // Log performance summary periodically
    if (renderCountRef.current % 50 === 0) {
      const recentMetrics = performanceData
        .filter(metric => metric.componentName === componentName)
        .slice(-10);
      
      if (recentMetrics.length > 0) {
        const avgRenderTime = recentMetrics.reduce((sum, metric) => sum + metric.renderTime, 0) / recentMetrics.length;
        console.log(
          `📊 ${componentName} performance (last 10 renders): avg ${avgRenderTime.toFixed(2)}ms`
        );
      }
    }
  }, [componentName, mergedConfig]);

  useEffect(() => {
    if (!mergedConfig.enabled) return;

    startTimeRef.current = performance.now();
    renderCountRef.current += 1;

    return () => {
      const renderTime = performance.now() - startTimeRef.current;
      logPerformance(renderTime);
    };
  });

  return {
    startTiming: () => {
      startTimeRef.current = performance.now();
    },
    endTiming: () => {
      const renderTime = performance.now() - startTimeRef.current;
      logPerformance(renderTime);
      return renderTime;
    },
    getPerformanceData: () => performanceData.filter(metric => metric.componentName === componentName),
    clearPerformanceData: () => {
      const index = performanceData.findIndex(metric => metric.componentName === componentName);
      if (index !== -1) {
        performanceData.splice(index, 1);
      }
    },
  };
};

// Hook for measuring specific operations
export const useOperationTiming = (operationName: string) => {
  const startTimeRef = useRef<number>(0);

  const startTiming = useCallback(() => {
    startTimeRef.current = performance.now();
  }, []);

  const endTiming = useCallback(() => {
    const duration = performance.now() - startTimeRef.current;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`⏱️ ${operationName}: ${duration.toFixed(2)}ms`);
    }

    return duration;
  }, [operationName]);

  return { startTiming, endTiming };
};

// Hook for monitoring assignment operations specifically
export const useAssignmentPerformance = () => {
  const { startTiming, endTiming } = useOperationTiming('Assignment Operation');

  const measureAssignment = useCallback(async <T>(
    operation: () => Promise<T>,
    operationName: string
  ): Promise<T> => {
    startTiming();
    try {
      const result = await operation();
      const duration = endTiming();
      
      // Log slow assignment operations
      if (duration > 1000) {
        console.warn(`🐌 Slow assignment operation: ${operationName} took ${duration.toFixed(2)}ms`);
      }
      
      return result;
    } catch (error) {
      endTiming();
      throw error;
    }
  }, [startTiming, endTiming]);

  return { measureAssignment };
};

// Utility to get overall performance summary
export const getPerformanceSummary = () => {
  if (performanceData.length === 0) {
    return { message: 'No performance data available' };
  }

  const avgRenderTime = performanceData.reduce((sum, metric) => sum + metric.renderTime, 0) / performanceData.length;
  const slowRenders = performanceData.filter(metric => metric.renderTime > 16).length;
  const componentStats = performanceData.reduce((acc, metric) => {
    if (!acc[metric.componentName]) {
      acc[metric.componentName] = { count: 0, totalTime: 0, avgTime: 0 };
    }
    acc[metric.componentName].count += 1;
    acc[metric.componentName].totalTime += metric.renderTime;
    acc[metric.componentName].avgTime = acc[metric.componentName].totalTime / acc[metric.componentName].count;
    return acc;
  }, {} as Record<string, { count: number; totalTime: number; avgTime: number }>);

  return {
    totalSamples: performanceData.length,
    avgRenderTime: avgRenderTime.toFixed(2),
    slowRenders,
    slowRenderPercentage: ((slowRenders / performanceData.length) * 100).toFixed(1),
    componentStats,
  };
};

export default usePerformanceMonitoring;
