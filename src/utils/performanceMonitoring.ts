/**
 * Comprehensive Performance Monitoring System
 * Tracks Core Web Vitals, bundle size, and runtime performance
 */

import React from 'react';
import { logger } from './productionLogger';

// Performance metrics interfaces
export interface PerformanceMetrics {
  // Core Web Vitals
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  fcp?: number; // First Contentful Paint
  ttfb?: number; // Time to First Byte

  // Custom metrics
  bundleSize?: number;
  loadTime?: number;
  renderTime?: number;
  memoryUsage?: number;

  // User experience metrics
  timeToInteractive?: number;
  firstMeaningfulPaint?: number;

  // Network metrics
  networkLatency?: number;
  downloadSpeed?: number;

  // Component metrics
  componentRenderTimes?: Record<string, number>;
  apiResponseTimes?: Record<string, number>;
}

// Performance observer types
type PerformanceObserverCallback = (entry: PerformanceEntry) => void;

// Performance monitoring class
class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetrics = {};
  private observers: PerformanceObserver[] = [];
  private isMonitoring = false;
  private startTime = typeof performance !== 'undefined' ? performance.now() : Date.now();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Initialize performance monitoring
  init(): void {
    // Only initialize on client-side
    if (typeof window === 'undefined' || typeof performance === 'undefined') {
      return;
    }

    if (this.isMonitoring) return;

    this.isMonitoring = true;
    this.startTime = performance.now();

    // Monitor Core Web Vitals
    this.observeLCP();
    this.observeFID();
    this.observeCLS();
    this.observeFCP();
    this.observeTTFB();

    // Monitor bundle size
    this.measureBundleSize();

    // Monitor memory usage
    this.observeMemoryUsage();

    // Monitor custom metrics
    this.observeCustomMetrics();

    // Performance monitoring initialized
  }

  // Stop monitoring
  stop(): void {
    this.isMonitoring = false;
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    logger.info('Performance monitoring stopped');
  }

  // Get current metrics
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  // Record custom metric
  recordMetric(name: string, value: number): void {
    this.metrics[name as keyof PerformanceMetrics] = value;
    logger.debug(`Performance metric recorded: ${name} = ${value}ms`);
  }

  // Record component render time
  recordComponentRender(componentName: string, renderTime: number): void {
    if (!this.metrics.componentRenderTimes) {
      this.metrics.componentRenderTimes = {};
    }
    this.metrics.componentRenderTimes[componentName] = renderTime;
  }

  // Record API response time
  recordApiResponse(endpoint: string, responseTime: number): void {
    if (!this.metrics.apiResponseTimes) {
      this.metrics.apiResponseTimes = {};
    }
    this.metrics.apiResponseTimes[endpoint] = responseTime;
  }

  // Observe Largest Contentful Paint
  private observeLCP(): void {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

    // Check if largest-contentful-paint is supported
    const supportedEntryTypes = PerformanceObserver.supportedEntryTypes;
    if (
      !supportedEntryTypes ||
      !supportedEntryTypes.includes('largest-contentful-paint')
    ) {
      logger.debug(
        'Largest contentful paint observation not supported in this browser'
      );
      return;
    }

    const observer = new PerformanceObserver(list => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.metrics.lcp = lastEntry.startTime;
      logger.debug(`LCP: ${lastEntry.startTime}ms`);
    });

    try {
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(observer);
    } catch (error) {
      logger.debug('LCP observation failed:', error);
    }
  }

  // Observe First Input Delay
  private observeFID(): void {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

    // Check if first-input is supported
    const supportedEntryTypes = PerformanceObserver.supportedEntryTypes;
    if (!supportedEntryTypes || !supportedEntryTypes.includes('first-input')) {
      logger.debug(
        'First input delay observation not supported in this browser'
      );
      return;
    }

    const observer = new PerformanceObserver(list => {
      const entries = list.getEntries();
      entries.forEach((entry: Record<string, unknown>) => {
        this.metrics.fid = entry.processingStart - entry.startTime;
        logger.debug(`FID: ${this.metrics.fid}ms`);
      });
    });

    try {
      observer.observe({ entryTypes: ['first-input'] });
      this.observers.push(observer);
    } catch (error) {
      logger.debug('FID observation failed:', error);
    }
  }

  // Observe Cumulative Layout Shift
  private observeCLS(): void {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

    // Check if layout-shift is supported
    const supportedEntryTypes = PerformanceObserver.supportedEntryTypes;
    if (!supportedEntryTypes || !supportedEntryTypes.includes('layout-shift')) {
      logger.debug('Layout shift observation not supported in this browser');
      return;
    }

    let clsValue = 0;
    const observer = new PerformanceObserver(list => {
      const entries = list.getEntries();
      entries.forEach((entry: Record<string, unknown>) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      this.metrics.cls = clsValue;
      logger.debug(`CLS: ${clsValue}`);
    });

    try {
      observer.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(observer);
    } catch (error) {
      logger.debug('Layout shift observation failed:', error);
    }
  }

  // Observe First Contentful Paint
  private observeFCP(): void {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver(list => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        if (entry.name === 'first-contentful-paint') {
          this.metrics.fcp = entry.startTime;
          logger.debug(`FCP: ${entry.startTime}ms`);
        }
      });
    });

    observer.observe({ entryTypes: ['paint'] });
    this.observers.push(observer);
  }

  // Observe Time to First Byte
  private observeTTFB(): void {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver(list => {
      const entries = list.getEntries();
      entries.forEach((entry: Record<string, unknown>) => {
        if (entry.entryType === 'navigation') {
          this.metrics.ttfb = entry.responseStart - entry.requestStart;
          logger.debug(`TTFB: ${this.metrics.ttfb}ms`);
        }
      });
    });

    observer.observe({ entryTypes: ['navigation'] });
    this.observers.push(observer);
  }

  // Measure bundle size
  private measureBundleSize(): void {
    if (typeof window === 'undefined' || typeof performance === 'undefined') return;
    if ('performance' in window && 'getEntriesByType' in performance) {
      const resources = performance.getEntriesByType('resource');
      let totalSize = 0;

      resources.forEach((resource: Record<string, unknown>) => {
        if (resource.transferSize) {
          totalSize += resource.transferSize;
        }
      });

      this.metrics.bundleSize = totalSize;
      logger.debug(`Bundle size: ${(totalSize / 1024).toFixed(2)}KB`);
    }
  }

  // Observe memory usage
  private observeMemoryUsage(): void {
    if (typeof performance === 'undefined') return;
    if ('memory' in performance) {
      const memory = (performance as unknown as Record<string, unknown>).memory;
      this.metrics.memoryUsage = memory.usedJSHeapSize;
      logger.debug(
        `Memory usage: ${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`
      );
    }
  }

  // Observe custom metrics
  private observeCustomMetrics(): void {
    if (typeof window === 'undefined' || typeof performance === 'undefined') return;

    // Measure page load time
    window.addEventListener('load', () => {
      this.metrics.loadTime = performance.now() - this.startTime;
      logger.debug(`Page load time: ${this.metrics.loadTime}ms`);
    });

    // Measure time to interactive
    this.measureTimeToInteractive();
  }

  // Measure Time to Interactive
  private measureTimeToInteractive(): void {
    let tti = 0;
    const observer = new PerformanceObserver(list => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        if (entry.entryType === 'measure' && entry.name === 'tti') {
          tti = entry.startTime;
          this.metrics.timeToInteractive = tti;
          logger.debug(`TTI: ${tti}ms`);
        }
      });
    });

    observer.observe({ entryTypes: ['measure'] });
    this.observers.push(observer);

    // Mark TTI when page becomes interactive
    setTimeout(() => {
      performance.mark('tti');
      performance.measure('tti', 'navigationStart', 'tti');
    }, 0);
  }

  // Generate performance report
  generateReport(): {
    score: number;
    metrics: PerformanceMetrics;
    recommendations: string[];
  } {
    const metrics = this.getMetrics();
    let score = 100;
    const recommendations: string[] = [];

    // LCP scoring (Good: <2.5s, Needs Improvement: 2.5-4s, Poor: >4s)
    if (metrics.lcp) {
      if (metrics.lcp > 4000) {
        score -= 20;
        recommendations.push(
          'LCP is poor (>4s). Optimize images and reduce server response time.'
        );
      } else if (metrics.lcp > 2500) {
        score -= 10;
        recommendations.push(
          'LCP needs improvement (2.5-4s). Consider image optimization.'
        );
      }
    }

    // FID scoring (Good: <100ms, Needs Improvement: 100-300ms, Poor: >300ms)
    if (metrics.fid) {
      if (metrics.fid > 300) {
        score -= 20;
        recommendations.push(
          'FID is poor (>300ms). Reduce JavaScript execution time.'
        );
      } else if (metrics.fid > 100) {
        score -= 10;
        recommendations.push(
          'FID needs improvement (100-300ms). Optimize JavaScript.'
        );
      }
    }

    // CLS scoring (Good: <0.1, Needs Improvement: 0.1-0.25, Poor: >0.25)
    if (metrics.cls) {
      if (metrics.cls > 0.25) {
        score -= 20;
        recommendations.push('CLS is poor (>0.25). Fix layout shifts.');
      } else if (metrics.cls > 0.1) {
        score -= 10;
        recommendations.push(
          'CLS needs improvement (0.1-0.25). Reduce layout shifts.'
        );
      }
    }

    // Bundle size scoring
    if (metrics.bundleSize) {
      const bundleSizeKB = metrics.bundleSize / 1024;
      if (bundleSizeKB > 1000) {
        score -= 15;
        recommendations.push(
          'Bundle size is large (>1MB). Consider code splitting.'
        );
      } else if (bundleSizeKB > 500) {
        score -= 10;
        recommendations.push('Bundle size could be optimized (>500KB).');
      }
    }

    // Memory usage scoring
    if (metrics.memoryUsage) {
      const memoryMB = metrics.memoryUsage / 1024 / 1024;
      if (memoryMB > 100) {
        score -= 10;
        recommendations.push(
          'High memory usage (>100MB). Check for memory leaks.'
        );
      }
    }

    return {
      score: Math.max(0, score),
      metrics,
      recommendations,
    };
  }

  // Send performance data to analytics
  async sendToAnalytics(): Promise<void> {
    if (typeof window === 'undefined') return;
    // Use Next.js compatible environment check
    const isProduction =
      typeof process !== 'undefined' && process.env.NODE_ENV === 'production';
    if (!isProduction) return;

    try {
      const report = this.generateReport();
      await fetch('/api/analytics/performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          url: window.location.href,
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
          ...report,
        }),
      });
    } catch (error) {
      logger.error('Failed to send performance data:', error);
    }
  }
}

// React hook for performance monitoring
export function usePerformanceMonitor() {
  const monitor = PerformanceMonitor.getInstance();

  React.useEffect(() => {
    monitor.init();
    return () => monitor.stop();
  }, [monitor]);

  return {
    recordMetric: monitor.recordMetric.bind(monitor),
    recordComponentRender: monitor.recordComponentRender.bind(monitor),
    recordApiResponse: monitor.recordApiResponse.bind(monitor),
    getMetrics: monitor.getMetrics.bind(monitor),
    generateReport: monitor.generateReport.bind(monitor),
    sendToAnalytics: monitor.sendToAnalytics.bind(monitor),
  };
}

// Higher-order component for performance monitoring
export function withPerformanceMonitoring<P extends object>(
  Component: React.ComponentType<P>,
  componentName?: string
) {
  return React.memo((props: P) => {
    const { recordComponentRender } = usePerformanceMonitor();
    const startTimeRef = React.useRef<number | null>(null);

    React.useEffect(() => {
      startTimeRef.current = performance.now();
    }, []);

    React.useEffect(() => {
      if (!startTimeRef.current) return;

      const renderTime = performance.now() - startTimeRef.current;
      recordComponentRender(
        componentName || Component.displayName || 'Unknown',
        renderTime
      );
    });

    return React.createElement(Component, props);
  });
}

// Performance monitoring provider
export const PerformanceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const monitor = PerformanceMonitor.getInstance();

  React.useEffect(() => {
    monitor.init();

    // Send performance data periodically
    const interval = setInterval(() => {
      monitor.sendToAnalytics();
    }, 60000); // Every minute

    return () => {
      clearInterval(interval);
      monitor.stop();
    };
  }, [monitor]);

  return React.createElement(React.Fragment, null, children);
};

// Export singleton instance
export const performanceMonitor = PerformanceMonitor.getInstance();
