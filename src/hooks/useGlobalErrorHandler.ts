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
      // Suppress source map errors from external sources
      if (
        event.message?.includes('source-map') ||
        event.message?.includes('installHook') ||
        event.message?.includes('JSON.parse: unexpected character')
      ) {
        return; // Silently ignore these errors
      }

      // Suppress Clearbit logo errors (service is down/unreachable)
      if (
        event.message?.includes('logo.clearbit.com') ||
        event.filename?.includes('logo.clearbit.com') ||
        event.error?.message?.includes('ERR_NAME_NOT_RESOLVED')
      ) {
        return; // Silently ignore Clearbit errors
      }

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
        fetch('/api/errors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(errorReport),
        }).catch(err => {
          // Silently fail - don't log error reporting failures
          if (process.env.NODE_ENV === 'development') {
            console.error('Failed to report error:', err);
          }
        });
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
        fetch('/api/errors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(errorReport),
        }).catch(err => {
          // Silently fail - don't log error reporting failures
          if (process.env.NODE_ENV === 'development') {
            console.error('Failed to report error:', err);
          }
        });
      }
    };

    const handleResourceError = (event: Event) => {
      const target = event.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'IMG' ||
          target.tagName === 'SCRIPT' ||
          target.tagName === 'LINK')
      ) {
        // Suppress Clearbit logo loading errors
        if (
          target.tagName === 'IMG' &&
          (target.getAttribute('src')?.includes('logo.clearbit.com') ||
            (event as ErrorEvent).message?.includes('logo.clearbit.com'))
        ) {
          return; // Silently ignore Clearbit image errors
        }

        const errorReport: ErrorReport = {
          message: `Failed to load resource: ${target.tagName}`,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href,
          type: 'resource',
        };

        console.warn(
          'Resource Load Error:',
          JSON.stringify(errorReport, null, 2)
        );
      }
    };

    // Add event listeners
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleResourceError, true);

    // Cleanup
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener(
        'unhandledrejection',
        handleUnhandledRejection
      );
      window.removeEventListener('error', handleResourceError, true);
    };
  }, []);
};

// Hook for performance monitoring
export const usePerformanceMonitoring = () => {
  useEffect(() => {
    if (!('PerformanceObserver' in window)) {
      console.log('PerformanceObserver not supported in this browser');
      return;
    }

    const observer = new PerformanceObserver(list => {
      list.getEntries().forEach(entry => {
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming;
          console.log(
            'Page Load Time:',
            navEntry.loadEventEnd - navEntry.loadEventStart
          );

          // Enhanced performance metrics
          const metrics = {
            loadTime: navEntry.loadEventEnd - navEntry.loadEventStart,
            domContentLoaded:
              navEntry.domContentLoadedEventEnd -
              navEntry.domContentLoadedEventStart,
            firstPaint:
              performance.getEntriesByName('first-paint')[0]?.startTime || 0,
            firstContentfulPaint:
              performance.getEntriesByName('first-contentful-paint')[0]
                ?.startTime || 0,
            largestContentfulPaint:
              performance.getEntriesByName('largest-contentful-paint')[0]
                ?.startTime || 0,
          };

          // Only log full metrics in verbose mode
          if (process.env.NEXT_PUBLIC_VERBOSE_LOGS === 'true') {
            console.log('Performance Metrics:', metrics);
          }

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
              console.warn(
                `⚠️ Poor ${metric}: ${value}ms (threshold: ${threshold.poor}ms)`
              );
            } else if (value > threshold.good) {
              console.warn(
                `⚠️ Needs improvement ${metric}: ${value}ms (threshold: ${threshold.good}ms)`
              );
            } else {
              // Only log good metrics if they're above threshold or in verbose mode
              if (process.env.NEXT_PUBLIC_VERBOSE_LOGS === 'true') {
                console.log(`✅ Good ${metric}: ${value}ms`);
              }
            }
          });
        } else if (entry.entryType === 'measure') {
          // Only log slow measures (>100ms) in verbose mode, or errors (>500ms) always
          // Custom measures (development only)
          if (process.env.NODE_ENV === 'development') {
            if (
              entry.duration > 100 ||
              entry.name.includes('Page') ||
              entry.name.includes('Load')
            ) {
              // Log slow measures in development only
            }
          } else if (entry.duration > 500) {
            console.warn(
              `⚠️ Slow operation: ${entry.name} took ${entry.duration.toFixed(2)}ms`
            );
          }
        }
      });
    });

    // Check supported entry types before observing
    const supportedEntryTypes = PerformanceObserver.supportedEntryTypes;
    const entryTypesToObserve = ['navigation', 'measure'];

    // Only add supported entry types
    if (supportedEntryTypes) {
      if (supportedEntryTypes.includes('paint')) {
        entryTypesToObserve.push('paint');
      }
      if (supportedEntryTypes.includes('largest-contentful-paint')) {
        entryTypesToObserve.push('largest-contentful-paint');
      }
    }

    try {
      observer.observe({ entryTypes: entryTypesToObserve });
    } catch (error) {
      console.warn('Performance observation failed:', error);
    }

    return () => observer.disconnect();
  }, []);
};
