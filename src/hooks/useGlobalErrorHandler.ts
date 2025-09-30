import { useEffect } from 'react';

interface ErrorReport {
  message: string;
  stack?: string;
  timestamp: string;
  userAgent: string;
  url: string;
  type: 'unhandled' | 'promise' | 'resource';
}

export const useGlobalErrorHandler = () => {
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      const errorReport: ErrorReport = {
        message: event.message,
        stack: event.error?.stack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        type: 'unhandled',
      };
      
      console.error('Unhandled Error:', errorReport);
      
      // In production, send to monitoring service
      if (process.env.NODE_ENV === 'production') {
        // fetch('/api/errors', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(errorReport)
        // }).catch(console.error);
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const errorReport: ErrorReport = {
        message: event.reason?.message || 'Unhandled Promise Rejection',
        stack: event.reason?.stack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        type: 'promise',
      };
      
      console.error('Unhandled Promise Rejection:', errorReport);
      
      // In production, send to monitoring service
      if (process.env.NODE_ENV === 'production') {
        // fetch('/api/errors', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(errorReport)
        // }).catch(console.error);
      }
    };

    const handleResourceError = (event: Event) => {
      const target = event.target as HTMLElement;
      if (target && (target.tagName === 'IMG' || target.tagName === 'SCRIPT' || target.tagName === 'LINK')) {
        const errorReport: ErrorReport = {
          message: `Failed to load resource: ${target.tagName}`,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href,
          type: 'resource',
        };
        
        console.warn('Resource Load Error:', errorReport);
      }
    };

    // Add event listeners
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleResourceError, true);

    // Cleanup
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleResourceError, true);
    };
  }, []);
};

// Hook for performance monitoring
export const usePerformanceMonitoring = () => {
  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming;
          console.log('Page Load Time:', navEntry.loadEventEnd - navEntry.loadEventStart);
          
          // Enhanced performance metrics
          const metrics = {
            loadTime: navEntry.loadEventEnd - navEntry.loadEventStart,
            domContentLoaded: navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart,
            firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
            firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0,
            largestContentfulPaint: performance.getEntriesByName('largest-contentful-paint')[0]?.startTime || 0,
          };
          
          console.log('Performance Metrics:', metrics);
          
          // Performance thresholds
          const thresholds = {
            loadTime: { good: 2000, poor: 5000 },
            firstContentfulPaint: { good: 1800, poor: 3000 },
            largestContentfulPaint: { good: 2500, poor: 4000 },
          };
          
          // Check performance against thresholds
          Object.entries(thresholds).forEach(([metric, threshold]) => {
            const value = metrics[metric as keyof typeof metrics];
            if (value > threshold.poor) {
              console.warn(`⚠️ Poor ${metric}: ${value}ms (threshold: ${threshold.poor}ms)`);
            } else if (value > threshold.good) {
              console.warn(`⚠️ Needs improvement ${metric}: ${value}ms (threshold: ${threshold.good}ms)`);
            } else {
              console.log(`✅ Good ${metric}: ${value}ms`);
            }
          });
          
        } else if (entry.entryType === 'measure') {
          console.log('Custom Measure:', entry.name, entry.duration);
        }
      });
    });
    
    observer.observe({ entryTypes: ['navigation', 'measure', 'paint', 'largest-contentful-paint'] });
    
    return () => observer.disconnect();
  }, []);
};

