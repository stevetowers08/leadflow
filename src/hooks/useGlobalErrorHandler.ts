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
          console.log('Page Load Time:', entry.duration);
        } else if (entry.entryType === 'measure') {
          console.log('Custom Measure:', entry.name, entry.duration);
        }
      });
    });
    
    observer.observe({ entryTypes: ['navigation', 'measure'] });
    
    return () => observer.disconnect();
  }, []);
};

