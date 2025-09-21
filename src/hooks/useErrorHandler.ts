import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface ErrorInfo {
  id: string;
  message: string;
  stack?: string;
  timestamp: Date;
  context?: Record<string, any>;
  severity: 'low' | 'medium' | 'high' | 'critical';
  resolved?: boolean;
}

export interface RetryOptions {
  maxRetries: number;
  delay: number;
  backoffMultiplier: number;
  onRetry?: (attempt: number) => void;
  onMaxRetriesReached?: () => void;
}

export function useErrorHandler() {
  const [errors, setErrors] = useState<ErrorInfo[]>([]);
  const { toast } = useToast();

  const logError = useCallback((
    error: Error | string,
    context?: Record<string, any>,
    severity: ErrorInfo['severity'] = 'medium'
  ) => {
    const errorInfo: ErrorInfo = {
      id: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      message: typeof error === 'string' ? error : error.message,
      stack: typeof error === 'object' && error.stack ? error.stack : undefined,
      timestamp: new Date(),
      context,
      severity,
      resolved: false
    };

    setErrors(prev => [errorInfo, ...prev]);

    // Show toast notification based on severity
    if (severity === 'critical' || severity === 'high') {
      toast({
        title: "Error",
        description: errorInfo.message,
        variant: "destructive",
      });
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error logged:', errorInfo);
    }

    return errorInfo.id;
  }, [toast]);

  const resolveError = useCallback((errorId: string) => {
    setErrors(prev => prev.map(error => 
      error.id === errorId ? { ...error, resolved: true } : error
    ));
  }, []);

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  const clearResolvedErrors = useCallback(() => {
    setErrors(prev => prev.filter(error => !error.resolved));
  }, []);

  return {
    errors,
    logError,
    resolveError,
    clearErrors,
    clearResolvedErrors
  };
}

// Retry mechanism hook
export function useRetry<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: RetryOptions = {
    maxRetries: 3,
    delay: 1000,
    backoffMultiplier: 2
  }
) {
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const { logError } = useErrorHandler();

  const executeWithRetry = useCallback(async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt <= options.maxRetries; attempt++) {
      try {
        setIsRetrying(attempt > 0);
        setRetryCount(attempt);
        
        if (attempt > 0) {
          options.onRetry?.(attempt);
          const delay = options.delay * Math.pow(options.backoffMultiplier, attempt - 1);
          await new Promise(resolve => setTimeout(resolve, delay));
        }

        const result = await fn(...args);
        setIsRetrying(false);
        setRetryCount(0);
        return result;
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === options.maxRetries) {
          setIsRetrying(false);
          setRetryCount(0);
          options.onMaxRetriesReached?.();
          
          logError(
            `Operation failed after ${options.maxRetries} retries: ${lastError.message}`,
            { retryCount: attempt, function: fn.name },
            'high'
          );
          
          throw lastError;
        }
      }
    }
    
    throw lastError;
  }, [fn, options, logError]);

  return {
    executeWithRetry,
    isRetrying,
    retryCount
  };
}

// Network error handler
export function useNetworkErrorHandler() {
  const { logError } = useErrorHandler();

  const handleNetworkError = useCallback((error: any) => {
    let severity: ErrorInfo['severity'] = 'medium';
    let message = 'Network error occurred';

    if (error.code === 'NETWORK_ERROR' || !navigator.onLine) {
      severity = 'high';
      message = 'No internet connection. Please check your network and try again.';
    } else if (error.status >= 500) {
      severity = 'high';
      message = 'Server error. Please try again later.';
    } else if (error.status === 404) {
      severity = 'medium';
      message = 'Resource not found.';
    } else if (error.status === 403) {
      severity = 'medium';
      message = 'Access denied. You may not have permission to perform this action.';
    } else if (error.status === 401) {
      severity = 'high';
      message = 'Authentication required. Please log in again.';
    }

    logError(message, {
      status: error.status,
      code: error.code,
      url: error.url
    }, severity);

    return { message, severity };
  }, [logError]);

  return { handleNetworkError };
}

// API error handler
export function useApiErrorHandler() {
  const { logError } = useErrorHandler();
  const { handleNetworkError } = useNetworkErrorHandler();

  const handleApiError = useCallback((error: any, context?: Record<string, any>) => {
    // Handle network errors
    if (error.code === 'NETWORK_ERROR' || error.message?.includes('fetch')) {
      return handleNetworkError(error);
    }

    // Handle Supabase errors
    if (error.code) {
      let severity: ErrorInfo['severity'] = 'medium';
      let message = error.message || 'Database error occurred';

      switch (error.code) {
        case '23505': // Unique constraint violation
          severity = 'medium';
          message = 'This record already exists.';
          break;
        case '23503': // Foreign key constraint violation
          severity = 'medium';
          message = 'Cannot delete this record as it is referenced by other data.';
          break;
        case '42501': // Insufficient privilege
          severity = 'high';
          message = 'You do not have permission to perform this action.';
          break;
        case 'PGRST116': // Row level security violation
          severity = 'high';
          message = 'Access denied. You may not have permission to view this data.';
          break;
        default:
          severity = 'medium';
      }

      logError(message, {
        code: error.code,
        details: error.details,
        hint: error.hint,
        ...context
      }, severity);

      return { message, severity };
    }

    // Handle generic errors
    const severity = error.status >= 500 ? 'high' : 'medium';
    logError(error.message || 'An unexpected error occurred', {
      status: error.status,
      ...context
    }, severity);

    return { message: error.message || 'An unexpected error occurred', severity };
  }, [logError, handleNetworkError]);

  return { handleApiError };
}

// Error boundary hook for React components
export function useErrorBoundary() {
  const { logError } = useErrorHandler();

  const captureError = useCallback((error: Error, errorInfo?: any) => {
    logError(error, {
      componentStack: errorInfo?.componentStack,
      errorBoundary: true
    }, 'critical');
  }, [logError]);

  return { captureError };
}
