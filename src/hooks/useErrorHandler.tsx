import { useCallback } from 'react';

interface ErrorHandlerOptions {
  onError?: (error: Error, context?: string) => void;
  logToConsole?: boolean;
}

export const useErrorHandler = (options: ErrorHandlerOptions = {}) => {
  const { onError, logToConsole = true } = options;

  const captureError = useCallback((error: Error, context?: string) => {
    if (logToConsole) {
      console.error(`Error captured${context ? ` in ${context}` : ''}:`, error);
    }

    if (onError) {
      onError(error, context);
    }

    // You can add additional error reporting here (e.g., Sentry, LogRocket, etc.)
  }, [onError, logToConsole]);

  return { captureError };
};

export const useErrorBoundary = () => {
  const { captureError } = useErrorHandler();
  
  const resetErrorBoundary = useCallback(() => {
    // This would be implemented with a state reset mechanism
    // For now, we'll use the class-based boundary
  }, []);

  return { captureError, resetErrorBoundary };
};
