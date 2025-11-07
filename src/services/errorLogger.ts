/**
 * Comprehensive Error Logging Utility
 * Provides structured error logging with context and severity levels
 */

export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum ErrorCategory {
  AUTHENTICATION = 'authentication',
  DATABASE = 'database',
  NETWORK = 'network',
  VALIDATION = 'validation',
  UI = 'ui',
  BUSINESS_LOGIC = 'business_logic',
  UNKNOWN = 'unknown',
}

export interface ErrorContext {
  userId?: string;
  sessionId?: string;
  component?: string;
  action?: string;
  metadata?: Record<string, unknown>;
  timestamp?: string;
  userAgent?: string;
  url?: string;
}

export interface LoggedError {
  id: string;
  message: string;
  stack?: string;
  severity: ErrorSeverity;
  category: ErrorCategory;
  context: ErrorContext;
  timestamp: string;
  resolved?: boolean;
}

class ErrorLogger {
  private errors: LoggedError[] = [];
  private maxErrors = 1000; // Keep last 1000 errors in memory

  /**
   * Log an error with context and severity
   */
  logError(
    error: Error | string,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    category: ErrorCategory = ErrorCategory.UNKNOWN,
    context: ErrorContext = {}
  ): string {
    const errorId = this.generateErrorId();
    const timestamp = new Date().toISOString();

    const loggedError: LoggedError = {
      id: errorId,
      message: typeof error === 'string' ? error : error.message,
      stack: typeof error === 'object' && error.stack ? error.stack : undefined,
      severity,
      category,
      context: {
        ...context,
        timestamp,
        userAgent:
          typeof window !== 'undefined'
            ? window.navigator.userAgent
            : undefined,
        url: typeof window !== 'undefined' ? window.location.href : undefined,
      },
      timestamp,
      resolved: false,
    };

    this.errors.unshift(loggedError);

    // Keep only the most recent errors
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(0, this.maxErrors);
    }

    // Log to console in development
    // Skip console logging for handled HTTP 5xx errors (they're logged to tracking service)
    // These are expected server errors that the application handles gracefully
    const isHandledNetworkError =
      category === ErrorCategory.NETWORK &&
      (loggedError.message?.includes('HTTP 5') ||
        loggedError.message?.match(/HTTP\s+5\d{2}/));

    if (process.env.NODE_ENV === 'development' && !isHandledNetworkError) {
      console.group(`🚨 Error [${severity.toUpperCase()}] - ${category}`);
      console.error('Message:', loggedError.message);
      console.error('Context:', loggedError.context);
      if (loggedError.stack) {
        console.error('Stack:', loggedError.stack);
      }
      console.groupEnd();
    }

    // In production, you would send this to your error tracking service
    this.sendToErrorService(loggedError);

    return errorId;
  }

  /**
   * Log authentication errors
   */
  logAuthError(error: Error | string, context: ErrorContext = {}): string {
    return this.logError(
      error,
      ErrorSeverity.HIGH,
      ErrorCategory.AUTHENTICATION,
      context
    );
  }

  /**
   * Log database errors
   */
  logDatabaseError(error: Error | string, context: ErrorContext = {}): string {
    return this.logError(
      error,
      ErrorSeverity.HIGH,
      ErrorCategory.DATABASE,
      context
    );
  }

  /**
   * Log network errors
   */
  logNetworkError(error: Error | string, context: ErrorContext = {}): string {
    return this.logError(
      error,
      ErrorSeverity.MEDIUM,
      ErrorCategory.NETWORK,
      context
    );
  }

  /**
   * Log validation errors
   */
  logValidationError(
    error: Error | string,
    context: ErrorContext = {}
  ): string {
    return this.logError(
      error,
      ErrorSeverity.LOW,
      ErrorCategory.VALIDATION,
      context
    );
  }

  /**
   * Log UI errors
   */
  logUIError(error: Error | string, context: ErrorContext = {}): string {
    return this.logError(error, ErrorSeverity.LOW, ErrorCategory.UI, context);
  }

  /**
   * Log business logic errors
   */
  logBusinessError(error: Error | string, context: ErrorContext = {}): string {
    return this.logError(
      error,
      ErrorSeverity.MEDIUM,
      ErrorCategory.BUSINESS_LOGIC,
      context
    );
  }

  /**
   * Get all logged errors
   */
  getErrors(): LoggedError[] {
    return [...this.errors];
  }

  /**
   * Get errors by severity
   */
  getErrorsBySeverity(severity: ErrorSeverity): LoggedError[] {
    return this.errors.filter(error => error.severity === severity);
  }

  /**
   * Get errors by category
   */
  getErrorsByCategory(category: ErrorCategory): LoggedError[] {
    return this.errors.filter(error => error.category === category);
  }

  /**
   * Get critical errors
   */
  getCriticalErrors(): LoggedError[] {
    return this.getErrorsBySeverity(ErrorSeverity.CRITICAL);
  }

  /**
   * Mark an error as resolved
   */
  resolveError(errorId: string): boolean {
    const error = this.errors.find(errorItem => errorItem.id === errorId);
    if (error) {
      error.resolved = true;
      return true;
    }
    return false;
  }

  /**
   * Clear resolved errors
   */
  clearResolvedErrors(): number {
    const initialCount = this.errors.length;
    this.errors = this.errors.filter(error => !error.resolved);
    return initialCount - this.errors.length;
  }

  /**
   * Clear all errors
   */
  clearAllErrors(): void {
    this.errors = [];
  }

  /**
   * Get error statistics
   */
  getErrorStats(): {
    total: number;
    bySeverity: Record<ErrorSeverity, number>;
    byCategory: Record<ErrorCategory, number>;
    unresolved: number;
    resolved: number;
  } {
    const stats = {
      total: this.errors.length,
      bySeverity: {
        [ErrorSeverity.LOW]: 0,
        [ErrorSeverity.MEDIUM]: 0,
        [ErrorSeverity.HIGH]: 0,
        [ErrorSeverity.CRITICAL]: 0,
      } as Record<ErrorSeverity, number>,
      byCategory: {
        [ErrorCategory.AUTHENTICATION]: 0,
        [ErrorCategory.DATABASE]: 0,
        [ErrorCategory.NETWORK]: 0,
        [ErrorCategory.VALIDATION]: 0,
        [ErrorCategory.UI]: 0,
        [ErrorCategory.BUSINESS_LOGIC]: 0,
        [ErrorCategory.UNKNOWN]: 0,
      } as Record<ErrorCategory, number>,
      unresolved: 0,
      resolved: 0,
    };

    this.errors.forEach(error => {
      stats.bySeverity[error.severity]++;
      stats.byCategory[error.category]++;
      if (error.resolved) {
        stats.resolved++;
      } else {
        stats.unresolved++;
      }
    });

    return stats;
  }

  private generateErrorId(): string {
    // Generate a proper UUID v4
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }

  private sendToErrorService(error: LoggedError): void {
    // In production, implement your error tracking service integration here
    // Examples: Sentry, LogRocket, Bugsnag, etc.

    if (process.env.NODE_ENV === 'production') {
      // Example: Send to external service
      // fetch('/api/errors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(error)
      // }).catch(console.error);

      // For now, just log to console in production
      console.error('Production Error:', error);
    }
  }
}

// Create singleton instance
export const errorLogger = new ErrorLogger();

// Global error handler for unhandled errors
if (typeof window !== 'undefined') {
  window.addEventListener('error', event => {
    errorLogger.logError(
      event.error || event.message,
      ErrorSeverity.HIGH,
      ErrorCategory.UNKNOWN,
      {
        component: 'global',
        action: 'unhandled_error',
        metadata: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        },
      }
    );
  });

  window.addEventListener('unhandledrejection', event => {
    errorLogger.logError(
      event.reason,
      ErrorSeverity.HIGH,
      ErrorCategory.UNKNOWN,
      {
        component: 'global',
        action: 'unhandled_promise_rejection',
        metadata: {
          promise: event.promise,
        },
      }
    );
  });
}

// React Error Boundary integration
export const logReactError = (error: Error, errorInfo: unknown) => {
  errorLogger.logError(error, ErrorSeverity.HIGH, ErrorCategory.UI, {
    component: 'react_error_boundary',
    action: 'component_error',
    metadata: {
      componentStack: errorInfo.componentStack,
    },
  });
};
