import React, { useState, useCallback, useRef } from 'react';
import { toast } from '@/utils/toast';
import { useErrorHandler, useRetry } from '@/hooks/useErrorHandler';

export interface AsyncOperationState<T = unknown> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  isRetrying: boolean;
  retryCount: number;
  lastExecutedAt: Date | null;
}

export interface AsyncOperationOptions<T = unknown> {
  retryOptions?: {
    maxRetries: number;
    delay: number;
    backoffMultiplier: number;
  };
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
  successMessage?: string;
  errorMessage?: string;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  onRetry?: (attempt: number) => void;
}

export function useAsyncOperation<T = unknown>(
  asyncFn: (...args: unknown[]) => Promise<T>,
  options: AsyncOperationOptions<T> = {}
) {
  const {
    retryOptions = { maxRetries: 3, delay: 1000, backoffMultiplier: 2 },
    showSuccessToast = true,
    showErrorToast = true,
    successMessage = 'Operation completed successfully',
    errorMessage = 'Operation failed',
    onSuccess,
    onError,
    onRetry,
  } = options;

  const [state, setState] = useState<AsyncOperationState<T>>({
    data: null,
    isLoading: false,
    error: null,
    isRetrying: false,
    retryCount: 0,
    lastExecutedAt: null,
  });

  const { logError } = useErrorHandler();
  const { executeWithRetry, isRetrying, retryCount } = useRetry(asyncFn, {
    ...retryOptions,
    onRetry: attempt => {
      setState(prev => ({ ...prev, isRetrying: true, retryCount: attempt }));
      onRetry?.(attempt);
    },
    onMaxRetriesReached: () => {
      setState(prev => ({ ...prev, isRetrying: false, retryCount: 0 }));
    },
  });

  const execute = useCallback(
    async (...args: unknown[]) => {
      setState(prev => ({
        ...prev,
        isLoading: true,
        error: null,
        isRetrying: false,
        retryCount: 0,
      }));

      try {
        const result = await executeWithRetry(...args);

        setState(prev => ({
          ...prev,
          data: result,
          isLoading: false,
          error: null,
          lastExecutedAt: new Date(),
        }));

        if (showSuccessToast) {
          toast.success('Success', {
            description: successMessage,
          });
        }

        onSuccess?.(result);
        return result;
      } catch (error) {
        const errorObj = error as Error;

        setState(prev => ({
          ...prev,
          isLoading: false,
          error: errorObj.message,
          isRetrying: false,
          retryCount: 0,
        }));

        if (showErrorToast) {
          toast.error('Error', {
            description: errorMessage,
          });
        }

        logError(errorObj, { operation: asyncFn.name }, 'medium');
        onError?.(errorObj);

        throw errorObj;
      }
    },
    [
      asyncFn,
      executeWithRetry,
      showSuccessToast,
      showErrorToast,
      successMessage,
      errorMessage,
      onSuccess,
      onError,
      logError,
    ]
  );

  const reset = useCallback(() => {
    setState({
      data: null,
      isLoading: false,
      error: null,
      isRetrying: false,
      retryCount: 0,
      lastExecutedAt: null,
    });
  }, []);

  const retry = useCallback(
    async (...args: unknown[]) => {
      return execute(...args);
    },
    [execute]
  );

  return {
    ...state,
    execute,
    retry,
    reset,
    isRetrying: state.isRetrying || isRetrying,
    retryCount: state.retryCount || retryCount,
  };
}

// Specialized hook for data fetching operations
export function useAsyncData<T = unknown>(
  fetchFn: (...args: unknown[]) => Promise<T>,
  options: AsyncOperationOptions & {
    initialData?: T;
    autoExecute?: boolean;
    executeArgs?: unknown[];
  } = {}
) {
  const {
    initialData,
    autoExecute = false,
    executeArgs = [],
    ...operationOptions
  } = options;

  const operation = useAsyncOperation(fetchFn, operationOptions);

  const [hasExecuted, setHasExecuted] = useState(false);

  // Auto-execute on mount if enabled
  React.useEffect(() => {
    if (autoExecute && !hasExecuted) {
      operation.execute(...executeArgs);
      setHasExecuted(true);
    }
  }, [autoExecute, hasExecuted, executeArgs]);

  return {
    ...operation,
    data: operation.data || initialData,
    refetch: () => operation.execute(...executeArgs),
  };
}

// Hook for mutation operations (create, update, delete)
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

// Hook for batch operations
export function useAsyncBatchOperation<T = unknown>(
  batchFn: (items: T[]) => Promise<T[]>,
  options: AsyncOperationOptions & {
    batchSize?: number;
    onProgress?: (completed: number, total: number) => void;
  } = {}
) {
  const { batchSize = 10, onProgress, ...operationOptions } = options;

  const [progress, setProgress] = useState({ completed: 0, total: 0 });

  const operation = useAsyncOperation<T[]>(async (...args: unknown[]) => {
    const items = args[0] as T[];
    const results: T[] = [];
    const batches = [];

    // Split items into batches
    for (let i = 0; i < items.length; i += batchSize) {
      batches.push(items.slice(i, i + batchSize));
    }

    setProgress({ completed: 0, total: items.length });

    // Process each batch
    let completedCount = 0;
    for (const batch of batches) {
      const batchResults = await batchFn(batch);
      results.push(...batchResults);
      completedCount += batch.length;

      setProgress({
        completed: completedCount,
        total: items.length,
      });

      onProgress?.(completedCount, items.length);
    }

    return results;
  }, operationOptions);

  return {
    ...operation,
    progress,
    isComplete: progress.completed === progress.total && progress.total > 0,
  };
}
