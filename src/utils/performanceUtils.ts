/**
 * Performance measurement utilities for tracking optimization improvements
 */

interface PerformanceMetrics {
  operation: string;
  duration: number;
  timestamp: number;
  dataSize?: number;
  metadata?: Record<string, any>;
}

class PerformanceTracker {
  private metrics: PerformanceMetrics[] = [];
  private isEnabled: boolean;

  constructor() {
    // Enable in development or when performance monitoring is needed
    this.isEnabled = process.env.NODE_ENV === 'development' || 
                    localStorage.getItem('enable-performance-tracking') === 'true';
  }

  /**
   * Measure the performance of a synchronous operation
   */
  measureSync<T>(operation: string, fn: () => T, dataSize?: number): T {
    if (!this.isEnabled) return fn();

    const startTime = performance.now();
    const result = fn();
    const duration = performance.now() - startTime;

    this.recordMetric({
      operation,
      duration,
      timestamp: Date.now(),
      dataSize,
      metadata: { type: 'sync' }
    });

    return result;
  }

  /**
   * Measure the performance of an asynchronous operation
   */
  async measureAsync<T>(
    operation: string, 
    fn: () => Promise<T>, 
    dataSize?: number
  ): Promise<T> {
    if (!this.isEnabled) return fn();

    const startTime = performance.now();
    const result = await fn();
    const duration = performance.now() - startTime;

    this.recordMetric({
      operation,
      duration,
      timestamp: Date.now(),
      dataSize,
      metadata: { type: 'async' }
    });

    return result;
  }

  /**
   * Record a custom performance metric
   */
  recordMetric(metric: PerformanceMetrics) {
    if (!this.isEnabled) return;

    this.metrics.push(metric);
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`⚡ Performance: ${metric.operation} took ${metric.duration.toFixed(2)}ms`);
    }

    // Keep only last 100 metrics to prevent memory leaks
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100);
    }
  }

  /**
   * Get performance metrics for a specific operation
   */
  getMetrics(operation?: string): PerformanceMetrics[] {
    if (operation) {
      return this.metrics.filter(m => m.operation === operation);
    }
    return [...this.metrics];
  }

  /**
   * Get average performance for an operation
   */
  getAveragePerformance(operation: string): number {
    const operationMetrics = this.getMetrics(operation);
    if (operationMetrics.length === 0) return 0;

    const totalDuration = operationMetrics.reduce((sum, m) => sum + m.duration, 0);
    return totalDuration / operationMetrics.length;
  }

  /**
   * Clear all metrics
   */
  clearMetrics() {
    this.metrics = [];
  }

  /**
   * Export metrics for analysis
   */
  exportMetrics(): string {
    return JSON.stringify(this.metrics, null, 2);
  }
}

// Global performance tracker instance
export const performanceTracker = new PerformanceTracker();

/**
 * Hook for measuring React component performance
 */
export function usePerformanceMeasurement(componentName: string) {
  const measureRender = (renderFn: () => React.ReactNode) => {
    return performanceTracker.measureSync(
      `${componentName}-render`,
      renderFn
    );
  };

  const measureAsyncOperation = async <T>(
    operationName: string,
    operation: () => Promise<T>
  ): Promise<T> => {
    return performanceTracker.measureAsync(
      `${componentName}-${operationName}`,
      operation
    );
  };

  return {
    measureRender,
    measureAsyncOperation,
    getMetrics: () => performanceTracker.getMetrics(componentName),
    getAveragePerformance: (operation: string) => 
      performanceTracker.getAveragePerformance(`${componentName}-${operation}`)
  };
}

/**
 * Utility for measuring filtering performance
 */
export function measureFilterPerformance<T>(
  items: T[],
  filterFn: (item: T) => boolean,
  operationName: string = 'filter'
): T[] {
  return performanceTracker.measureSync(
    operationName,
    () => items.filter(filterFn),
    items.length
  );
}

/**
 * Utility for measuring search performance
 */
export function measureSearchPerformance<T>(
  items: T[],
  searchTerm: string,
  searchFn: (item: T, term: string) => boolean,
  operationName: string = 'search'
): T[] {
  return performanceTracker.measureSync(
    operationName,
    () => items.filter(item => searchFn(item, searchTerm)),
    items.length
  );
}

/**
 * Performance comparison utility
 */
export function comparePerformance(
  baseline: number,
  optimized: number,
  operation: string
): void {
  const improvement = ((baseline - optimized) / baseline) * 100;
  const speedup = baseline / optimized;

  console.log(`🚀 Performance Comparison - ${operation}:`);
  console.log(`   Baseline: ${baseline.toFixed(2)}ms`);
  console.log(`   Optimized: ${optimized.toFixed(2)}ms`);
  console.log(`   Improvement: ${improvement.toFixed(1)}%`);
  console.log(`   Speedup: ${speedup.toFixed(2)}x`);
}
