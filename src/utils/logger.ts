/**
 * Production-safe logging utility
 * Automatically removes logs in production builds
 */

interface LogLevel {
  DEBUG: 'debug';
  INFO: 'info';
  WARN: 'warn';
  ERROR: 'error';
}

const LOG_LEVELS: LogLevel = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
};

class Logger {
  private isDevelopment = import.meta.env.DEV;
  private isProduction = import.meta.env.PROD;

  debug(message: string, ...args: any[]): void {
    if (this.isDevelopment) {
      console.log(`[DEBUG] ${message}`, ...args);
    }
  }

  info(message: string, ...args: any[]): void {
    if (this.isDevelopment) {
      console.info(`[INFO] ${message}`, ...args);
    }
  }

  warn(message: string, ...args: any[]): void {
    if (this.isDevelopment) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  }

  error(message: string, ...args: any[]): void {
    // Always log errors, even in production
    console.error(`[ERROR] ${message}`, ...args);
  }

  // Performance logging (only in development)
  performance(operation: string, duration: number): void {
    if (this.isDevelopment) {
      console.log(`[PERF] ${operation} took ${duration.toFixed(2)}ms`);
    }
  }

  // Security logging (always logged)
  security(event: string, details?: any): void {
    console.warn(`[SECURITY] ${event}`, details);
  }
}

export const logger = new Logger();
export default logger;
