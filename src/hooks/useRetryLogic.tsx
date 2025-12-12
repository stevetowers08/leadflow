import { useToast } from '@/hooks/use-toast';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import React, { useCallback, useEffect, useRef, useState } from 'react';

export interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
  jitter: boolean;
  retryCondition?: (error: unknown) => boolean;
}

export interface RetryState {
  isRetrying: boolean;
  retryCount: number;
  lastError: Error | null;
  nextRetryAt: Date | null;
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 10000,
  backoffMultiplier: 2,
  jitter: true,
  retryCondition: error => {
    // Retry on network errors, timeouts, and 5xx server errors
    if (error.name === 'AbortError' || error.message?.includes('timeout'))
      return true;
    if (error.status >= 500) return true;
    if (error.code === 'NETWORK_ERROR') return true;
    return false;
  },
};

export function useRetryLogic(config: Partial<RetryConfig> = {}) {
  const retryConfig = { ...DEFAULT_RETRY_CONFIG, ...config };
  const [retryState, setRetryState] = useState<RetryState>({
    isRetrying: false,
    retryCount: 0,
    lastError: null,
    nextRetryAt: null,
  });

  const { toast } = useToast();
  const { logError } = useErrorHandler();
  const timeoutRef = useRef<NodeJS.Timeout>();

  const calculateDelay = useCallback(
    (attempt: number): number => {
      const exponentialDelay =
        retryConfig.baseDelay *
        Math.pow(retryConfig.backoffMultiplier, attempt - 1);
      const cappedDelay = Math.min(exponentialDelay, retryConfig.maxDelay);

      if (retryConfig.jitter) {
        // Add jitter to prevent thundering herd
        const jitterAmount = cappedDelay * 0.1;
        return cappedDelay + (Math.random() * jitterAmount * 2 - jitterAmount);
      }

      return cappedDelay;
    },
    [retryConfig]
  );

  const shouldRetry = useCallback(
    (error: unknown): boolean => {
      if (retryState.retryCount >= retryConfig.maxRetries) return false;
      return retryConfig.retryCondition
        ? retryConfig.retryCondition(error)
        : true;
    },
    [retryState.retryCount, retryConfig]
  );

  const executeWithRetry = useCallback(
    async <T,>(
      operation: () => Promise<T>,
      operationName?: string
    ): Promise<T> => {
      let lastError: Error | null = null;

      for (let attempt = 0; attempt <= retryConfig.maxRetries; attempt++) {
        try {
          setRetryState(prev => ({
            ...prev,
            isRetrying: attempt > 0,
            retryCount: attempt,
            lastError: null,
            nextRetryAt: null,
          }));

          const result = await operation();

          // Success - reset retry state
          setRetryState({
            isRetrying: false,
            retryCount: 0,
            lastError: null,
            nextRetryAt: null,
          });

          return result;
        } catch (error) {
          lastError = error as Error;

          if (attempt < retryConfig.maxRetries && shouldRetry(error)) {
            const delay = calculateDelay(attempt + 1);
            const nextRetryAt = new Date(Date.now() + delay);

            setRetryState(prev => ({
              ...prev,
              lastError,
              nextRetryAt,
            }));

            // Show retry notification
            toast({
              title: 'Retrying...',
              description: `${operationName || 'Operation'} failed. Retrying in ${Math.round(delay / 1000)}s (attempt ${attempt + 1}/${retryConfig.maxRetries})`,
              variant: 'destructive',
            });

            // Wait before retry
            await new Promise(resolve => {
              timeoutRef.current = setTimeout(resolve, delay);
            });
          } else {
            // Max retries reached or error not retryable
            setRetryState(prev => ({
              ...prev,
              isRetrying: false,
              retryCount: attempt,
              lastError,
              nextRetryAt: null,
            }));

            logError(
              lastError,
              {
                operation: operationName,
                retryCount: attempt,
                maxRetries: retryConfig.maxRetries,
              },
              'high'
            );

            throw lastError;
          }
        }
      }

      throw lastError;
    },
    [
      retryConfig,
      retryState.retryCount,
      shouldRetry,
      calculateDelay,
      toast,
      logError,
    ]
  );

  const cancelRetry = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setRetryState(prev => ({
      ...prev,
      isRetrying: false,
      nextRetryAt: null,
    }));
  }, []);

  const resetRetry = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setRetryState({
      isRetrying: false,
      retryCount: 0,
      lastError: null,
      nextRetryAt: null,
    });
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    ...retryState,
    executeWithRetry,
    cancelRetry,
    resetRetry,
    shouldRetry: (error: unknown) => shouldRetry(error),
    canRetry: retryState.retryCount < retryConfig.maxRetries,
  };
}

// Specialized retry hooks for different scenarios
export function useNetworkRetry(config: Partial<RetryConfig> = {}) {
  return useRetryLogic({
    ...config,
    retryCondition: error => {
      // Network-specific retry conditions
      if (error.name === 'AbortError') return true;
      if (error.code === 'NETWORK_ERROR') return true;
      if (error.message?.includes('fetch')) return true;
      if (error.status >= 500) return true;
      if (error.status === 408) return true; // Request timeout
      return false;
    },
  });
}

export function useApiRetry(config: Partial<RetryConfig> = {}) {
  return useRetryLogic({
    ...config,
    retryCondition: error => {
      // API-specific retry conditions
      if (error.status >= 500) return true;
      if (error.status === 408) return true; // Request timeout
      if (error.status === 429) return true; // Rate limited
      if (error.code === 'NETWORK_ERROR') return true;
      return false;
    },
  });
}

export function useDatabaseRetry(config: Partial<RetryConfig> = {}) {
  return useRetryLogic({
    ...config,
    retryCondition: error => {
      // Database-specific retry conditions
      if (error.code === 'PGRST301') return true; // Connection timeout
      if (error.code === 'PGRST116') return true; // Row level security
      if (error.status >= 500) return true;
      return false;
    },
  });
}

// Retry component for UI feedback
export interface RetryIndicatorProps {
  retryState: RetryState;
  onRetry?: () => void;
  onCancel?: () => void;
  className?: string;
}

export const RetryIndicator: React.FC<RetryIndicatorProps> = ({
  retryState,
  onRetry,
  onCancel,
  className,
}) => {
  const { isRetrying, retryCount, lastError, nextRetryAt } = retryState;

  const getTimeUntilRetry = () => {
    if (!nextRetryAt) return null;
    const now = new Date();
    const diff = nextRetryAt.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diff / 1000));
  };

  // Hooks must be called unconditionally before any early returns
  const [timeLeft, setTimeLeft] = useState<number | null>(getTimeUntilRetry());

  useEffect(() => {
    if (!nextRetryAt) {
      setTimeLeft(null);
      return;
    }

    const interval = setInterval(() => {
      const remaining = getTimeUntilRetry();
      setTimeLeft(remaining);

      if (remaining === 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [nextRetryAt]);

  // Early return after all hooks are called
  if (!isRetrying && !lastError) return null;

  return (
    <div
      className={`p-4 bg-warning/10 border border-yellow-200 rounded-lg ${className}`}
    >
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-2'>
          <div className='w-2 h-2 bg-warning/100 rounded-full animate-pulse' />
          <span className='text-sm text-yellow-800'>
            {isRetrying
              ? `Retrying... (${retryCount}/3)${timeLeft ? ` in ${timeLeft}s` : ''}`
              : `Failed after ${retryCount} attempts`}
          </span>
        </div>

        <div className='flex space-x-2'>
          {onRetry && !isRetrying && (
            <button
              onClick={onRetry}
              className='px-3 py-1 text-xs bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors'
            >
              Retry Now
            </button>
          )}
          {onCancel && isRetrying && (
            <button
              onClick={onCancel}
              className='px-3 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors'
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {lastError && (
        <div className='mt-2 text-xs text-warning'>{lastError.message}</div>
      )}
    </div>
  );
};
