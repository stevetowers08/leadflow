/**
 * Enhanced Async Operation Hook with Result Pattern
 * Provides better error handling and type safety
 */

import { AppError, Result, ResultBuilder } from '@/types/errors';
import { enhancedErrorHandler } from '@/utils/enhancedErrorHandler';
import { useCallback, useEffect, useRef, useState } from 'react';

export interface AsyncOperationState<T> {
  data: T | null;
  error: AppError | null;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  result: Result<T, AppError> | null;
}

export interface AsyncOperationOptions {
  enableRetry?: boolean;
  maxRetries?: number;
  retryDelay?: number;
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: AppError) => void;
  onRetry?: (attempt: number) => void;
  onMaxRetriesReached?: () => void;
}

export function useAsyncOperation<T = unknown>(
  asyncFn: (...args: unknown[]) => Promise<T>,
  options: AsyncOperationOptions = {}
) {
  const {
    enableRetry = false,
    maxRetries = 3,
    retryDelay = 1000,
    showSuccessToast = false,
    showErrorToast = true,
    onSuccess,
    onError,
    onRetry,
    onMaxRetriesReached,
  } = options;

  const [state, setState] = useState<AsyncOperationState<T>>({
    data: null,
    error: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    result: null,
  });

  const retryCountRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const execute = useCallback(
    async (...args: unknown[]) => {
      setState(prev => ({
        ...prev,
        isLoading: true,
        error: null,
        isError: false,
        isSuccess: false,
      }));

      try {
        const result = await ResultBuilder.fromPromise(asyncFn(...args));

        if (result.success) {
          setState({
            data: result.data,
            error: null,
            isLoading: false,
            isSuccess: true,
            isError: false,
            result,
          });

          retryCountRef.current = 0;
          onSuccess?.(result.data);

          if (showSuccessToast) {
            // You can integrate with your toast system here
            console.log('Success:', result.data);
          }
        } else {
          const appError = await enhancedErrorHandler.handleError(
            result.error,
            {
              component: 'useAsyncOperation',
              action: 'execute',
              args: args.length > 0 ? args : undefined,
            }
          );

          setState({
            data: null,
            error: appError,
            isLoading: false,
            isSuccess: false,
            isError: true,
            result,
          });

          onError?.(appError);

          if (showErrorToast) {
            // You can integrate with your toast system here
            console.error('Error:', appError.userMessage);
          }
        }

        return result;
      } catch (error) {
        const appError = await enhancedErrorHandler.handleError(error, {
          component: 'useAsyncOperation',
          action: 'execute',
          args: args.length > 0 ? args : undefined,
        });

        setState({
          data: null,
          error: appError,
          isLoading: false,
          isSuccess: false,
          isError: true,
          result: ResultBuilder.failure(appError),
        });

        onError?.(appError);

        if (showErrorToast) {
          console.error('Error:', appError.userMessage);
        }

        return ResultBuilder.failure(appError);
      }
    },
    [asyncFn, onSuccess, onError, showSuccessToast, showErrorToast]
  );

  const retry = useCallback(
    async (...args: unknown[]) => {
      if (!enableRetry || retryCountRef.current >= maxRetries) {
        if (retryCountRef.current >= maxRetries) {
          onMaxRetriesReached?.();
        }
        return;
      }

      retryCountRef.current++;
      onRetry?.(retryCountRef.current);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        execute(...args);
      }, retryDelay * retryCountRef.current);
    },
    [execute, enableRetry, maxRetries, retryDelay, onRetry, onMaxRetriesReached]
  );

  const reset = useCallback(() => {
    setState({
      data: null,
      error: null,
      isLoading: false,
      isSuccess: false,
      isError: false,
      result: null,
    });
    retryCountRef.current = 0;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    setRetryCount(retryCountRef.current);
  }, [state.isLoading, state.isError]);

  return {
    ...state,
    execute,
    retry,
    reset,
    retryCount,
    canRetry: enableRetry && retryCount < maxRetries,
  };
}

// Specialized hook for data fetching
export function useAsyncData<T = unknown>(
  fetchFn: (...args: unknown[]) => Promise<T>,
  options: AsyncOperationOptions & {
    initialData?: T;
    autoExecute?: boolean;
    dependencies?: unknown[];
  } = {}
) {
  const {
    initialData,
    autoExecute = false,
    dependencies = [],
    ...operationOptions
  } = options;

  const operation = useAsyncOperation(fetchFn, operationOptions);

  useEffect(() => {
    if (autoExecute) {
      operation.execute();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoExecute, ...dependencies]);

  return {
    ...operation,
    data: operation.data ?? initialData ?? null,
  };
}

// Hook for mutations (create, update, delete operations)
export function useAsyncMutation<T = unknown>(
  mutationFn: (...args: unknown[]) => Promise<T>,
  options: AsyncOperationOptions = {}
) {
  return useAsyncOperation(mutationFn, {
    showSuccessToast: true,
    showErrorToast: true,
    ...options,
  });
}

// Hook for form submissions
export function useFormSubmission<T = unknown>(
  submitFn: (data: unknown) => Promise<T>,
  options: AsyncOperationOptions = {}
) {
  return useAsyncOperation(submitFn, {
    showSuccessToast: true,
    showErrorToast: true,
    enableRetry: false, // Usually don't retry form submissions
    ...options,
  });
}
