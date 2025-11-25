type PerformanceMemoryInfo = {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
};

type PerformanceWithMemory = Performance & {
  memory?: PerformanceMemoryInfo;
};

export function getPerformanceMemory(): PerformanceMemoryInfo | undefined {
  if (typeof performance === 'undefined') {
    return undefined;
  }

  if ('memory' in performance) {
    return (performance as PerformanceWithMemory).memory;
  }

  return undefined;
}

