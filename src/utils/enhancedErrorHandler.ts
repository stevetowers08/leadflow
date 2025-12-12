/**
 * Enhanced Error Handler
 * Integrates with existing error handling system while adding modern patterns
 */

import {
  AppError,
  ErrorType,
  ErrorSeverity,
  ErrorCategory,
  ErrorFactory,
  Result,
  ResultBuilder,
} from '@/types/errors';
import { enhancedErrorLogger } from '@/services/supabaseErrorService';

export class EnhancedErrorHandler {
  private static instance: EnhancedErrorHandler;

  static getInstance(): EnhancedErrorHandler {
    if (!EnhancedErrorHandler.instance) {
      EnhancedErrorHandler.instance = new EnhancedErrorHandler();
    }
    return EnhancedErrorHandler.instance;
  }

  /**
   * Classify and handle Supabase database errors
   */
  classifySupabaseError(
    error: unknown,
    context?: Record<string, unknown>
  ): AppError {
    const errorObj = error as Record<string, unknown>;
    if (!errorObj.code || typeof errorObj.code !== 'string') {
      const message =
        typeof errorObj.message === 'string'
          ? errorObj.message
          : 'Unknown database error occurred';
      return ErrorFactory.create(
        ErrorType.SYSTEM_ERROR,
        'UNKNOWN_DATABASE_ERROR',
        message,
        'A database error occurred. Please try again.',
        {
          severity: ErrorSeverity.MEDIUM,
          category: ErrorCategory.DATABASE,
          context,
          originalError: error as Error,
        }
      );
    }

    const errorMap: Record<string, AppError> = {
      '23505': ErrorFactory.create(
        ErrorType.BUSINESS_RULE_VIOLATION,
        'DUPLICATE_ENTRY',
        'Unique constraint violation',
        'This record already exists.',
        {
          recoverable: false,
          severity: ErrorSeverity.MEDIUM,
          category: ErrorCategory.DATABASE,
          context,
          originalError: error,
        }
      ),
      '23503': ErrorFactory.create(
        ErrorType.BUSINESS_RULE_VIOLATION,
        'FOREIGN_KEY_VIOLATION',
        'Foreign key constraint violation',
        'Cannot delete this record as it is referenced by other data.',
        {
          recoverable: false,
          severity: ErrorSeverity.MEDIUM,
          category: ErrorCategory.DATABASE,
          context,
          originalError: error,
        }
      ),
      '42501': ErrorFactory.create(
        ErrorType.PERMISSION_DENIED,
        'INSUFFICIENT_PRIVILEGE',
        'Insufficient privilege',
        'You do not have permission to perform this action.',
        {
          recoverable: false,
          severity: ErrorSeverity.HIGH,
          category: ErrorCategory.DATABASE,
          context,
          originalError: error,
        }
      ),
      PGRST116: ErrorFactory.create(
        ErrorType.PERMISSION_DENIED,
        'RLS_VIOLATION',
        'Row level security violation',
        'Access denied. You may not have permission to view this data.',
        {
          recoverable: false,
          severity: ErrorSeverity.HIGH,
          category: ErrorCategory.DATABASE,
          context,
          originalError: error,
        }
      ),
      '42P01': ErrorFactory.create(
        ErrorType.SYSTEM_ERROR,
        'UNDEFINED_TABLE',
        'Undefined table',
        'Database table not found. Please contact support.',
        {
          recoverable: false,
          severity: ErrorSeverity.CRITICAL,
          category: ErrorCategory.DATABASE,
          context,
          originalError: error,
        }
      ),
      '42703': ErrorFactory.create(
        ErrorType.SYSTEM_ERROR,
        'UNDEFINED_COLUMN',
        'Undefined column',
        'Database column not found. Please contact support.',
        {
          recoverable: false,
          severity: ErrorSeverity.CRITICAL,
          category: ErrorCategory.DATABASE,
          context,
          originalError: error,
        }
      ),
    };

    return (
      errorMap[error.code] ||
      ErrorFactory.create(
        ErrorType.DATABASE_ERROR,
        error.code,
        error.message || 'Database error occurred',
        'A database error occurred. Please try again.',
        {
          severity: ErrorSeverity.MEDIUM,
          category: ErrorCategory.DATABASE,
          context,
          originalError: error,
        }
      )
    );
  }

  /**
   * Classify network errors
   */
  classifyNetworkError(
    error: unknown,
    context?: Record<string, unknown>
  ): AppError {
    const errorObj = error as Record<string, unknown>;
    if (
      errorObj.code === 'NETWORK_ERROR' ||
      (typeof navigator !== 'undefined' && !navigator.onLine)
    ) {
      return ErrorFactory.create(
        ErrorType.NETWORK_ERROR,
        'NO_INTERNET_CONNECTION',
        'No internet connection',
        'No internet connection. Please check your network and try again.',
        {
          severity: ErrorSeverity.HIGH,
          category: ErrorCategory.NETWORK,
          context,
          originalError: error,
        }
      );
    }

    const status = typeof errorObj.status === 'number' ? errorObj.status : 0;
    if (status >= 500) {
      return ErrorFactory.create(
        ErrorType.EXTERNAL_SERVICE_ERROR,
        'SERVER_ERROR',
        `Server error: ${status}`,
        'Server error. Please try again later.',
        {
          severity: ErrorSeverity.HIGH,
          category: ErrorCategory.NETWORK,
          context: { ...context, status },
          originalError: error as Error,
        }
      );
    }

    if (status === 404) {
      return ErrorFactory.create(
        ErrorType.EXTERNAL_SERVICE_ERROR,
        'NOT_FOUND',
        'Resource not found',
        'The requested resource was not found.',
        {
          severity: ErrorSeverity.MEDIUM,
          category: ErrorCategory.NETWORK,
          context: { ...context, status },
          originalError: error as Error,
        }
      );
    }

    if (status === 403) {
      return ErrorFactory.create(
        ErrorType.PERMISSION_DENIED,
        'FORBIDDEN',
        'Access forbidden',
        'Access denied. You may not have permission to perform this action.',
        {
          severity: ErrorSeverity.MEDIUM,
          category: ErrorCategory.NETWORK,
          context: { ...context, status },
          originalError: error as Error,
        }
      );
    }

    if (status === 401) {
      return ErrorFactory.create(
        ErrorType.AUTHENTICATION_ERROR,
        'UNAUTHORIZED',
        'Authentication required',
        'Authentication required. Please log in again.',
        {
          severity: ErrorSeverity.HIGH,
          category: ErrorCategory.AUTHENTICATION,
          context: { ...context, status },
          originalError: error as Error,
        }
      );
    }

    const message =
      typeof errorObj.message === 'string'
        ? errorObj.message
        : 'Network error occurred';
    return ErrorFactory.create(
      ErrorType.NETWORK_ERROR,
      'NETWORK_ERROR',
      message,
      'A network error occurred. Please try again.',
      {
        severity: ErrorSeverity.MEDIUM,
        category: ErrorCategory.NETWORK,
        context,
        originalError: error as Error,
      }
    );
  }

  /**
   * Classify validation errors
   */
  classifyValidationError(
    error: unknown,
    context?: Record<string, unknown>
  ): AppError {
    const errorObj = error as Record<string, unknown>;
    const message =
      typeof errorObj.message === 'string'
        ? errorObj.message
        : 'Validation failed';
    const userMessage =
      typeof errorObj.userMessage === 'string'
        ? errorObj.userMessage
        : 'Please check your input and try again.';
    return ErrorFactory.create(
      ErrorType.VALIDATION_ERROR,
      'VALIDATION_FAILED',
      message,
      userMessage,
      {
        recoverable: true,
        severity: ErrorSeverity.LOW,
        category: ErrorCategory.VALIDATION,
        context,
        originalError: error as Error,
      }
    );
  }

  /**
   * Classify authentication errors
   */
  classifyAuthError(
    error: unknown,
    context?: Record<string, unknown>
  ): AppError {
    const errorObj = error as Record<string, unknown>;
    const message =
      typeof errorObj.message === 'string'
        ? errorObj.message
        : 'Authentication failed';
    return ErrorFactory.create(
      ErrorType.AUTHENTICATION_ERROR,
      'AUTH_FAILED',
      message,
      'Authentication failed. Please log in again.',
      {
        recoverable: true,
        severity: ErrorSeverity.HIGH,
        category: ErrorCategory.AUTHENTICATION,
        context,
        originalError: error as Error,
      }
    );
  }

  /**
   * Handle and log error with enhanced classification
   */
  async handleError(
    error: unknown,
    context?: Record<string, unknown>
  ): Promise<AppError> {
    let appError: AppError;

    // If it's already an AppError, use it
    if (
      error &&
      typeof error === 'object' &&
      'type' in error &&
      'code' in error
    ) {
      appError = error as AppError;
    } else {
      const errorObj = error as Record<string, unknown>;
      // Classify the error based on its properties
      if (errorObj.code && typeof errorObj.code === 'string') {
        // Likely a Supabase error
        appError = this.classifySupabaseError(error, context);
      } else if (
        (errorObj.status && typeof errorObj.status === 'number') ||
        (typeof errorObj.message === 'string' &&
          errorObj.message.includes('fetch'))
      ) {
        // Likely a network error
        appError = this.classifyNetworkError(error, context);
      } else if (
        errorObj.name === 'ValidationError' ||
        (typeof errorObj.message === 'string' &&
          errorObj.message.includes('validation'))
      ) {
        // Validation error
        appError = this.classifyValidationError(error, context);
      } else if (
        typeof errorObj.message === 'string' &&
        (errorObj.message.includes('auth') ||
          errorObj.message.includes('login'))
      ) {
        // Authentication error
        appError = this.classifyAuthError(error, context);
      } else {
        // Generic system error
        appError = ErrorFactory.fromError(
          error as Error,
          ErrorType.SYSTEM_ERROR
        );
        if (context) {
          appError.context = { ...appError.context, ...context };
        }
      }
    }

    // Log the error using the existing enhanced logger
    try {
      await enhancedErrorLogger.logError(
        appError.message,
        appError.severity,
        appError.category,
        {
          component: appError.context?.component,
          action: appError.context?.action,
          metadata: {
            ...appError.context,
            errorType: appError.type,
            errorCode: appError.code,
            recoverable: appError.recoverable,
          },
        }
      );
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }

    return appError;
  }

  /**
   * Wrap an async operation with error handling
   */
  async wrapAsyncOperation<T>(
    operation: () => Promise<T>,
    context?: Record<string, unknown>
  ): Promise<Result<T, AppError>> {
    try {
      const result = await operation();
      return ResultBuilder.success(result);
    } catch (error) {
      const appError = await this.handleError(error, context);
      return ResultBuilder.failure(appError);
    }
  }
}

// Export singleton instance
export const enhancedErrorHandler = EnhancedErrorHandler.getInstance();
