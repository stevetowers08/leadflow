/**
 * Centralized Logging Utility
 *
 * Replaces console.log/error/warn with a proper logging system.
 *
 * Features:
 * - Development-only info/debug logging
 * - Production error tracking (ready for Sentry)
 * - Consistent log formatting
 * - Performance tracking
 * - Environment-aware
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogOptions {
  context?: string;
  metadata?: Record<string, unknown>;
  timestamp?: boolean;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private isProduction = process.env.NODE_ENV === 'production';

  /**
   * Debug - Only shown in development
   * Use for detailed debugging information
   */
  debug(message: string, ...args: unknown[]): void {
    if (this.isDevelopment) {
      console.debug(`[DEBUG] ${this.formatMessage(message)}`, ...args);
    }
  }

  /**
   * Info - Only shown in development
   * Use for general information
   */
  info(message: string, ...args: unknown[]): void {
    if (this.isDevelopment) {
      console.log(`[INFO] ${this.formatMessage(message)}`, ...args);
    }
  }

  /**
   * Warning - Shown in all environments
   * Use for recoverable issues
   */
  warn(message: string, ...args: unknown[]): void {
    console.warn(`[WARN] ${this.formatMessage(message)}`, ...args);

    // TODO: Send to error tracking in production
    if (this.isProduction) {
      this.sendToErrorTracking('warning', message, args);
    }
  }

  /**
   * Error - Shown in all environments
   * Use for critical errors
   */
  error(message: string, error?: Error | unknown, ...args: unknown[]): void {
    console.error(`[ERROR] ${this.formatMessage(message)}`, error, ...args);

    // Send to error tracking in production
    if (this.isProduction) {
      this.sendToErrorTracking('error', message, [error, ...args]);
    }
  }

  /**
   * Performance - Track timing
   */
  time(label: string): void {
    if (this.isDevelopment) {
      console.time(`[PERF] ${label}`);
    }
  }

  timeEnd(label: string): void {
    if (this.isDevelopment) {
      console.timeEnd(`[PERF] ${label}`);
    }
  }

  /**
   * Group - Organize related logs
   */
  group(label: string): void {
    if (this.isDevelopment) {
      console.group(`[GROUP] ${label}`);
    }
  }

  groupEnd(): void {
    if (this.isDevelopment) {
      console.groupEnd();
    }
  }

  /**
   * Table - Display tabular data
   */
  table(data: unknown): void {
    if (this.isDevelopment) {
      console.table(data);
    }
  }

  /**
   * Context-aware logging
   */
  withContext(context: string) {
    return {
      debug: (message: string, ...args: unknown[]) =>
        this.debug(`[${context}] ${message}`, ...args),
      info: (message: string, ...args: unknown[]) =>
        this.info(`[${context}] ${message}`, ...args),
      warn: (message: string, ...args: unknown[]) =>
        this.warn(`[${context}] ${message}`, ...args),
      error: (message: string, error?: Error | unknown, ...args: unknown[]) =>
        this.error(`[${context}] ${message}`, error, ...args),
    };
  }

  private formatMessage(message: string): string {
    const timestamp = new Date().toISOString();
    return `${timestamp} - ${message}`;
  }

  private sendToErrorTracking(
    level: 'warning' | 'error',
    message: string,
    data: unknown[]
  ): void {
    // TODO: Integrate with Sentry or similar service
    // Example:
    // Sentry.captureMessage(message, {
    //   level,
    //   extra: { data },
    // });

    // For now, just ensure it's logged
    if (level === 'error') {
      // Could send to API endpoint for logging
      this.sendToBackend('error', message, data);
    }
  }

  private sendToBackend(level: string, message: string, data: unknown[]): void {
    // Optional: Send to backend logging service
    // This is a no-op for now, but ready for implementation
    try {
      // fetch('/api/logs', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ level, message, data, timestamp: new Date() }),
      // });
    } catch {
      // Silently fail - don't want logging to break the app
    }
  }
}

// Export singleton instance
export const logger = new Logger();

// Export named convenience functions
export const {
  debug,
  info,
  warn,
  error,
  time,
  timeEnd,
  group,
  groupEnd,
  table,
} = logger;

// Export context creator
export const createLogger = (context: string) => logger.withContext(context);
