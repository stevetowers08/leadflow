import { useEffect, useRef } from 'react';

interface PerformanceMetrics {
  popupOpenTime: number;
  dataLoadTime: number;
  renderTime: number;
  memoryUsage: number;
  errorCount: number;
}

export const usePopupPerformance = () => {
  const metricsRef = useRef<PerformanceMetrics>({
    popupOpenTime: 0,
    dataLoadTime: 0,
    renderTime: 0,
    memoryUsage: 0,
    errorCount: 0,
  });

  const startTiming = (operation: string) => {
    const start = performance.now();
    return () => {
      const end = performance.now();
      const duration = end - start;
      
      switch (operation) {
        case 'popup-open':
          metricsRef.current.popupOpenTime = duration;
          break;
        case 'data-load':
          metricsRef.current.dataLoadTime = duration;
          break;
        case 'render':
          metricsRef.current.renderTime = duration;
          break;
      }
      
      console.log(`Popup ${operation} took ${duration.toFixed(2)}ms`);
    };
  };

  const measureMemoryUsage = () => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      metricsRef.current.memoryUsage = memory.usedJSHeapSize / 1024 / 1024; // MB
    }
  };

  const recordError = (error: Error) => {
    metricsRef.current.errorCount++;
    console.error('Popup error:', error);
  };

  const getMetrics = () => ({
    ...metricsRef.current,
    totalTime: metricsRef.current.popupOpenTime + metricsRef.current.dataLoadTime + metricsRef.current.renderTime,
  });

  const resetMetrics = () => {
    metricsRef.current = {
      popupOpenTime: 0,
      dataLoadTime: 0,
      renderTime: 0,
      memoryUsage: 0,
      errorCount: 0,
    };
  };

  // Monitor memory usage
  useEffect(() => {
    const interval = setInterval(measureMemoryUsage, 5000);
    return () => clearInterval(interval);
  }, []);

  return {
    startTiming,
    measureMemoryUsage,
    recordError,
    getMetrics,
    resetMetrics,
  };
};
