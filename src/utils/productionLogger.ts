/**
 * Production-safe logger utility
 * Guards console methods based on environment
 */

const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

/**
 * Production-safe console wrapper
 * - In development: All logs shown
 * - In production: Only errors/warnings shown
 */
export const logger = {
  /**
   * Debug logs - only in development
   */
  debug: (...args: unknown[]): void => {
    if (isDevelopment) {
      console.log('[DEBUG]', ...args);
    }
  },

  /**
   * Info logs - only in development
   */
  info: (...args: unknown[]): void => {
    if (isDevelopment) {
      console.info('[INFO]', ...args);
    }
  },

  /**
   * Warnings - shown in all environments
   */
  warn: (...args: unknown[]): void => {
    if (isDevelopment || isProduction) {
      console.warn('[WARN]', ...args);
    }
  },

  /**
   * Errors - shown in all environments
   */
  error: (...args: unknown[]): void => {
    if (isDevelopment || isProduction) {
      console.error('[ERROR]', ...args);
    }
  },

  /**
   * Log (legacy) - only in development
   * Use logger.info() or logger.debug() instead
   */
  log: (...args: unknown[]): void => {
    if (isDevelopment) {
      console.log(...args);
    }
  },
};

/**
 * Guard function to conditionally execute code only in development
 */
export function devOnly(fn: () => void): void {
  if (isDevelopment) {
    fn();
  }
}


