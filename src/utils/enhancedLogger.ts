import React from 'react';

// Log levels
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  CRITICAL = 4,
}

// Log context interface
export interface LogContext {
  userId?: string;
  sessionId?: string;
  componentName?: string;
  action?: string;
  metadata?: Record<string, any>;
  timestamp?: Date;
  level?: LogLevel;
  category?: string;
}

// Log entry interface
export interface LogEntry {
  message: string;
  level: LogLevel;
  context: LogContext;
  timestamp: Date;
  stack?: string;
}

// Logging configuration
interface LoggingConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableRemote: boolean;
  enableStorage: boolean;
  maxStorageEntries: number;
  remoteEndpoint?: string;
  enablePerformance: boolean;
  enableUserTracking: boolean;
}

// Enhanced logger class
class EnhancedLogger {
  private static instance: EnhancedLogger;
  private config: LoggingConfig;
  private logs: LogEntry[] = [];
  private sessionId: string;
  private userId?: string;

  static getInstance(): EnhancedLogger {
    if (!EnhancedLogger.instance) {
      EnhancedLogger.instance = new EnhancedLogger();
    }
    return EnhancedLogger.instance;
  }

  private constructor() {
    this.sessionId = this.generateSessionId();
    this.config = {
      level: process.env.NODE_ENV === 'development' ? LogLevel.DEBUG : LogLevel.INFO,
      enableConsole: true,
      enableRemote: process.env.NODE_ENV === 'production',
      enableStorage: true,
      maxStorageEntries: 1000,
      remoteEndpoint: '/api/logs',
      enablePerformance: true,
      enableUserTracking: false,
    };

    this.setupGlobalErrorHandling();
    this.setupPerformanceLogging();
  }

  // Set user ID for tracking
  setUserId(userId: string): void {
    this.userId = userId;
  }

  // Update configuration
  updateConfig(config: Partial<LoggingConfig>): void {
    this.config = { ...this.config, ...config };
  }

  // Generate session ID
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Setup global error handling
  private setupGlobalErrorHandling(): void {
    // Only setup on client-side
    if (typeof window === 'undefined') {
      return;
    }

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', event => {
      this.error('Unhandled Promise Rejection', {
        componentName: 'Global',
        action: 'unhandledRejection',
        metadata: {
          reason: event.reason,
          promise: event.promise,
        },
      });
    });

    // Handle global errors
    window.addEventListener('error', event => {
      this.error('Global Error', {
        componentName: 'Global',
        action: 'globalError',
        metadata: {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          error: event.error,
        },
      });
    });
  }

  // Setup performance logging
  private setupPerformanceLogging(): void {
    // Only setup on client-side
    if (typeof window === 'undefined') {
      return;
    }

    if (!this.config.enablePerformance) return;

    // Log page load performance
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType(
        'navigation'
      )[0] as PerformanceNavigationTiming;

      this.info('Page Load Performance', {
        componentName: 'Performance',
        action: 'pageLoad',
        metadata: {
          loadTime: navigation.loadEventEnd - navigation.loadEventStart,
          domContentLoaded:
            navigation.domContentLoadedEventEnd -
            navigation.domContentLoadedEventStart,
          firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime,
          firstContentfulPaint: performance.getEntriesByName(
            'first-contentful-paint'
          )[0]?.startTime,
        },
      });
    });

    // Log memory usage periodically
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory;
        this.debug('Memory Usage', {
          componentName: 'Performance',
          action: 'memoryCheck',
          metadata: {
            used: memory.usedJSHeapSize,
            total: memory.totalJSHeapSize,
            limit: memory.jsHeapSizeLimit,
          },
        });
      }, 30000); // Every 30 seconds
    }
  }

  // Core logging method
  private log(
    level: LogLevel,
    message: string,
    context: LogContext = {}
  ): void {
    if (level < this.config.level) return;

    const logEntry: LogEntry = {
      message,
      level,
      context: {
        ...context,
        userId: this.userId,
        sessionId: this.sessionId,
        timestamp: new Date(),
        level,
      },
      timestamp: new Date(),
      stack: level >= LogLevel.ERROR ? new Error().stack : undefined,
    };

    // Add to logs array
    this.logs.push(logEntry);

    // Maintain max storage entries
    if (this.logs.length > this.config.maxStorageEntries) {
      this.logs = this.logs.slice(-this.config.maxStorageEntries);
    }

    // Console logging
    if (this.config.enableConsole) {
      this.logToConsole(logEntry);
    }

    // Remote logging
    if (this.config.enableRemote && level >= LogLevel.WARN) {
      this.logToRemote(logEntry);
    }

    // Storage logging
    if (this.config.enableStorage) {
      this.logToStorage(logEntry);
    }
  }

  // Console logging with colors and formatting
  private logToConsole(entry: LogEntry): void {
    const { message, level, context } = entry;
    const timestamp = entry.timestamp.toISOString();
    const levelName = LogLevel[level];

    const logData = {
      message,
      level: levelName,
      timestamp,
      ...context,
    };

    switch (level) {
      case LogLevel.DEBUG:
        console.debug(`🐛 [${levelName}] ${message}`, logData);
        break;
      case LogLevel.INFO:
        console.info(`ℹ️ [${levelName}] ${message}`, logData);
        break;
      case LogLevel.WARN:
        console.warn(`⚠️ [${levelName}] ${message}`, logData);
        break;
      case LogLevel.ERROR:
        console.error(`❌ [${levelName}] ${message}`, logData);
        break;
      case LogLevel.CRITICAL:
        console.error(`🚨 [${levelName}] ${message}`, logData);
        break;
    }
  }

  // Remote logging
  private async logToRemote(entry: LogEntry): Promise<void> {
    try {
      await fetch(this.config.remoteEndpoint!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      });
    } catch (error) {
      // Don't log remote logging errors to avoid infinite loops
      console.error('Failed to send log to remote:', error);
    }
  }

  // Storage logging
  private logToStorage(entry: LogEntry): void {
    // Only store on client-side
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const storageKey = `logs_${this.sessionId}`;
      const existingLogs = JSON.parse(localStorage.getItem(storageKey) || '[]');
      existingLogs.push(entry);

      // Keep only last 100 entries in localStorage
      const recentLogs = existingLogs.slice(-100);
      localStorage.setItem(storageKey, JSON.stringify(recentLogs));
    } catch (error) {
      console.error('Failed to store log:', error);
    }
  }

  // Public logging methods
  debug(message: string, context?: LogContext): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  info(message: string, context?: LogContext): void {
    this.log(LogLevel.INFO, message, context);
  }

  warn(message: string, context?: LogContext): void {
    this.log(LogLevel.WARN, message, context);
  }

  error(message: string, context?: LogContext): void {
    this.log(LogLevel.ERROR, message, context);
  }

  critical(message: string, context?: LogContext): void {
    this.log(LogLevel.CRITICAL, message, context);
  }

  // Get logs
  getLogs(level?: LogLevel, limit?: number): LogEntry[] {
    let filteredLogs = this.logs;

    if (level !== undefined) {
      filteredLogs = filteredLogs.filter(log => log.level >= level);
    }

    if (limit) {
      filteredLogs = filteredLogs.slice(-limit);
    }

    return filteredLogs;
  }

  // Clear logs
  clearLogs(): void {
    this.logs = [];
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`logs_${this.sessionId}`);
    }
  }

  // Export logs
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  // Performance timing
  time(label: string): void {
    console.time(label);
  }

  timeEnd(label: string): void {
    console.timeEnd(label);
  }

  // Group logging
  group(label: string): void {
    console.group(label);
  }

  groupEnd(): void {
    console.groupEnd();
  }

  // Table logging
  table(data: any): void {
    console.table(data);
  }

  // Trace logging
  trace(message: string, context?: LogContext): void {
    this.debug(message, { ...context, action: 'trace' });
    console.trace(message);
  }
}

// Create singleton instance
export const logger = EnhancedLogger.getInstance();

// React hook for logging
export function useLogger(componentName?: string) {
  const logContext = React.useMemo(
    () => ({
      componentName: componentName || 'Unknown',
    }),
    [componentName]
  );

  return {
    debug: (message: string, context?: LogContext) =>
      logger.debug(message, { ...logContext, ...context }),
    info: (message: string, context?: LogContext) =>
      logger.info(message, { ...logContext, ...context }),
    warn: (message: string, context?: LogContext) =>
      logger.warn(message, { ...logContext, ...context }),
    error: (message: string, context?: LogContext) =>
      logger.error(message, { ...logContext, ...context }),
    critical: (message: string, context?: LogContext) =>
      logger.critical(message, { ...logContext, ...context }),
    time: logger.time.bind(logger),
    timeEnd: logger.timeEnd.bind(logger),
    group: logger.group.bind(logger),
    groupEnd: logger.groupEnd.bind(logger),
    table: logger.table.bind(logger),
    trace: (message: string, context?: LogContext) =>
      logger.trace(message, { ...logContext, ...context }),
  };
}

// Higher-order component for logging
export function withLogging<P extends object>(
  Component: React.ComponentType<P>,
  componentName?: string
) {
  return React.memo((props: P) => {
    const log = useLogger(componentName || Component.displayName || 'Unknown');

    React.useEffect(() => {
      log.info('Component mounted', { action: 'mount' });
      return () => log.info('Component unmounted', { action: 'unmount' });
    }, []);

    return React.createElement(Component, props);
  });
}

// Logging provider
export const LoggingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  React.useEffect(() => {
    // Only log on client-side
    if (typeof window !== 'undefined') {
      logger.info('Application started', {
        componentName: 'App',
        action: 'start',
        metadata: {
          userAgent: navigator.userAgent,
          url: window.location.href,
          timestamp: new Date().toISOString(),
        },
      });

      return () => {
        logger.info('Application stopped', {
          componentName: 'App',
          action: 'stop',
        });
      };
    }
  }, []);

  return React.createElement(React.Fragment, null, children);
};

// Export types and enums
export { type LogContext, type LogEntry };
