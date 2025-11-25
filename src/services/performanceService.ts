// Safe performance monitor implementation without JSX
export class PerformanceMonitor {
  static getInstance() {
    return new PerformanceMonitor();
  }

  startTracking() {
    return performance.now();
  }

  endTracking() {}

  logError() {}

  setCache(_k?: string, _d?: unknown, _ttl?: number) {}

  getCache(_k?: string) {
    return null;
  }
}

export function usePerformanceMonitoring(_componentName: string) {
  return {
    logError: () => {},
    endTracking: () => {},
    setCache: () => {},
    getCache: () => null,
  };
}

// Stub error boundary - not used for JSX rendering
export class ErrorBoundary {
  constructor(_props: Record<string, unknown>) {}
  render(): null {
    return null;
  }
}

export async function safeAsync<T>(
  operation: () => Promise<T>,
  _context: { component: string; action: string },
  fallback?: T
): Promise<T | undefined> {
  try {
    return await operation();
  } catch {
    return fallback;
  }
}
