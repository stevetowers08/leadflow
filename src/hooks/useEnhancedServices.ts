import {
  useAsyncData,
  useAsyncMutation,
  useAsyncOperation,
} from '@/hooks/useAsyncOperation';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import {
  useApiRetry,
  useDatabaseRetry,
  useNetworkRetry,
} from '@/hooks/useRetryLogic';
import { useActionFeedback, useUserFeedback } from '@/hooks/useUserFeedback';
import { supabase } from '@/integrations/supabase/client';
import { insertCompany } from '@/utils/companyUtils';

export interface ServiceOptions {
  enableRetry?: boolean;
  retryConfig?: {
    maxRetries: number;
    baseDelay: number;
    maxDelay: number;
    backoffMultiplier: number;
  };
  enableFeedback?: boolean;
  enableErrorHandling?: boolean;
}

// Enhanced Supabase service wrapper
export function useSupabaseService<T = unknown>(
  tableName: string,
  options: ServiceOptions = {}
) {
  const {
    enableRetry = true,
    retryConfig = {
      maxRetries: 3,
      baseDelay: 1000,
      maxDelay: 10000,
      backoffMultiplier: 2,
    },
    enableFeedback = true,
    enableErrorHandling = true,
  } = options;

  // Always call hooks - conditionally use their return values
  const retryLogic = useDatabaseRetry(retryConfig);
  const actionFeedback = useActionFeedback();
  const errorHandler = useErrorHandler();

  const { handleSave, handleDelete, handleUpdate, handleCreate } =
    enableFeedback
      ? actionFeedback
      : {
          handleSave: undefined,
          handleDelete: undefined,
          handleUpdate: undefined,
          handleCreate: undefined,
        };
  const { logError } = enableErrorHandling
    ? errorHandler
    : { logError: () => {} };

  const executeWithRetry = async <R>(
    operation: () => Promise<R>,
    operationName: string
  ): Promise<R> => {
    if (retryLogic) {
      return retryLogic.executeWithRetry(operation, operationName);
    }
    return operation();
  };

  // Fetch data with retry and error handling
  const fetchData = useAsyncData(
    async (...args: unknown[]) => {
      const query = args[0] as string | undefined;
      return executeWithRetry(async () => {
        const { data, error } = await supabase
          .from(tableName as never)
          .select(query || '*');

        if (error) throw error;
        return data;
      }, `fetch-${tableName}`);
    },
    {
      showSuccessToast: false,
      showErrorToast: enableFeedback,
      onError: error =>
        logError(error, { table: tableName, operation: 'fetch' }),
    }
  );

  // Create record with retry and feedback
  const createRecord = useAsyncMutation(
    async (...args: unknown[]) => {
      const record = args[0] as Partial<T>;
      return executeWithRetry(async () => {
        // Special handling for companies to ensure owner_id is set
        if (tableName === 'companies') {
          const {
            data: { session },
          } = await supabase.auth.getSession();
          const companyData = {
            ...record,
            owner_id: session?.user?.id || null,
          };
          return await insertCompany(companyData);
        }

        const { data, error } = await supabase
          .from(tableName as never)
          .insert(record)
          .select()
          .single();

        if (error) throw error;
        return data;
      }, `create-${tableName}`);
    },
    {
      showSuccessToast: enableFeedback,
      showErrorToast: enableFeedback,
      successMessage: 'Record created successfully',
      errorMessage: 'Failed to create record',
      onSuccess: data => handleCreate?.(true, `Record created successfully`),
      onError: error => {
        logError(error, { table: tableName, operation: 'create' });
        handleCreate?.(false, error.message);
      },
    }
  );

  // Update record with retry and feedback
  const updateRecord = useAsyncMutation(
    async (...args: unknown[]) => {
      const { id, updates } = args[0] as { id: string; updates: Partial<T> };
      return executeWithRetry(async () => {
        const { data, error } = await supabase
          .from(tableName as never)
          .update(updates)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        return data;
      }, `update-${tableName}`);
    },
    {
      showSuccessToast: enableFeedback,
      showErrorToast: enableFeedback,
      successMessage: 'Record updated successfully',
      errorMessage: 'Failed to update record',
      onSuccess: data => handleUpdate?.(true, `Record updated successfully`),
      onError: error => {
        logError(error, { table: tableName, operation: 'update' });
        handleUpdate?.(false, error.message);
      },
    }
  );

  // Delete record with retry and feedback
  const deleteRecord = useAsyncMutation(
    async (...args: unknown[]) => {
      const id = args[0] as string;
      return executeWithRetry(async () => {
        const { error } = await supabase
          .from(tableName as never)
          .delete()
          .eq('id', id);

        if (error) throw error;
        return { id };
      }, `delete-${tableName}`);
    },
    {
      showSuccessToast: enableFeedback,
      showErrorToast: enableFeedback,
      successMessage: 'Record deleted successfully',
      errorMessage: 'Failed to delete record',
      onSuccess: data => handleDelete?.(true, `Record deleted successfully`),
      onError: error => {
        logError(error, { table: tableName, operation: 'delete' });
        handleDelete?.(false, error.message);
      },
    }
  );

  // Batch operations
  const batchCreate = useAsyncMutation(
    async (...args: unknown[]) => {
      const records = args[0] as Partial<T>[];
      return executeWithRetry(async () => {
        // Special handling for companies to ensure owner_id is set
        if (tableName === 'companies') {
          const {
            data: { session },
          } = await supabase.auth.getSession();
          const results = [];
          for (const record of records) {
            const companyData = {
              ...record,
              owner_id: session?.user?.id || null,
            };
            const result = await insertCompany(companyData);
            results.push(result?.[0] || result); // insertCompany returns an array or single object
          }
          return results;
        }

        const { data, error } = await supabase
          .from(tableName as never)
          .insert(records)
          .select();

        if (error) throw error;
        return data;
      }, `batch-create-${tableName}`);
    },
    {
      showSuccessToast: enableFeedback,
      showErrorToast: enableFeedback,
      successMessage: 'Records created successfully',
      errorMessage: 'Failed to create records',
      onError: error =>
        logError(error, { table: tableName, operation: 'batch-create' }),
    }
  );

  const batchUpdate = useAsyncMutation(
    async (...args: unknown[]) => {
      const updates = args[0] as Array<{ id: string; updates: Partial<T> }>;
      return executeWithRetry(async () => {
        const results = [];
        for (const { id, updates: recordUpdates } of updates) {
          const { data, error } = await supabase
            .from(tableName as never)
            .update(recordUpdates)
            .eq('id', id)
            .select()
            .single();

          if (error) throw error;
          results.push(data);
        }
        return results;
      }, `batch-update-${tableName}`);
    },
    {
      showSuccessToast: enableFeedback,
      showErrorToast: enableFeedback,
      successMessage: 'Records updated successfully',
      errorMessage: 'Failed to update records',
      onError: error =>
        logError(error, { table: tableName, operation: 'batch-update' }),
    }
  );

  return {
    // Data operations
    fetchData,
    createRecord,
    updateRecord,
    deleteRecord,
    batchCreate,
    batchUpdate,

    // Retry state
    isRetrying: retryLogic?.isRetrying || false,
    retryCount: retryLogic?.retryCount || 0,
    lastError: retryLogic?.lastError || null,
    nextRetryAt: retryLogic?.nextRetryAt || null,

    // Utility functions
    refetch: fetchData.refetch,
    reset: () => {
      fetchData.reset();
      createRecord.reset();
      updateRecord.reset();
      deleteRecord.reset();
      batchCreate.reset();
      batchUpdate.reset();
    },
  };
}

// Specialized hooks for common operations
export function usePeopleService(options: ServiceOptions = {}) {
  return useSupabaseService('people', options);
}

export function useCompaniesService(options: ServiceOptions = {}) {
  return useSupabaseService('companies', options);
}

// Jobs service removed - not in PDR
// export function useJobsService(options: ServiceOptions = {}) {
//   return useSupabaseService('jobs', options);
// }

// Network service wrapper for external APIs
export function useNetworkService(options: ServiceOptions = {}) {
  const {
    enableRetry = true,
    retryConfig = {
      maxRetries: 3,
      baseDelay: 1000,
      maxDelay: 10000,
      backoffMultiplier: 2,
    },
    enableFeedback = true,
    enableErrorHandling = true,
  } = options;

  // Always call hooks - conditionally use their return values
  const retryLogicHook = useNetworkRetry(retryConfig);
  const userFeedbackHook = useUserFeedback();
  const errorHandlerHook = useErrorHandler();

  const retryLogic = enableRetry ? retryLogicHook : null;
  const { showSuccess, showError } = enableFeedback
    ? userFeedbackHook
    : { showSuccess: undefined, showError: undefined };
  const { logError } = enableErrorHandling
    ? errorHandlerHook
    : { logError: () => {} };

  const executeWithRetry = async <R>(
    operation: () => Promise<R>,
    operationName: string
  ): Promise<R> => {
    if (retryLogic) {
      return retryLogic.executeWithRetry(operation, operationName);
    }
    return operation();
  };

  const makeRequest = useAsyncOperation(
    async (...args: unknown[]) => {
      const { url, options } = args[0] as {
        url: string;
        options?: RequestInit;
      };
      return executeWithRetry(async () => {
        const method = (options?.method || 'GET').toUpperCase();

        // Only set Content-Type for requests with a body (non-GET)
        const computedHeaders: HeadersInit | undefined = {
          ...(options?.headers || {}),
          ...(method !== 'GET' && !('Content-Type' in (options?.headers || {}))
            ? { 'Content-Type': 'application/json' }
            : {}),
        };

        const response = await fetch(url, {
          ...options,
          headers: computedHeaders,
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return response.json();
      }, `network-request-${url}`);
    },
    {
      showSuccessToast: false,
      showErrorToast: enableFeedback,
      onError: error => logError(error, { operation: 'network-request' }),
    }
  );

  return {
    makeRequest,
    isRetrying: retryLogic?.isRetrying || false,
    retryCount: retryLogic?.retryCount || 0,
    lastError: retryLogic?.lastError || null,
    nextRetryAt: retryLogic?.nextRetryAt || null,
  };
}

// AI Service wrapper
export function useAIService(options: ServiceOptions = {}) {
  const {
    enableRetry = true,
    retryConfig = {
      maxRetries: 2, // Fewer retries for AI calls
      baseDelay: 2000,
      maxDelay: 15000,
      backoffMultiplier: 2,
    },
    enableFeedback = true,
    enableErrorHandling = true,
  } = options;

  // Always call hooks - conditionally use their return values
  const retryLogicHook = useApiRetry(retryConfig);
  const userFeedbackHook = useUserFeedback();
  const errorHandlerHook = useErrorHandler();

  const retryLogic = enableRetry ? retryLogicHook : null;
  const { showSuccess, showError } = enableFeedback
    ? userFeedbackHook
    : { showSuccess: undefined, showError: undefined };
  const { logError } = enableErrorHandling
    ? errorHandlerHook
    : { logError: () => {} };

  const executeWithRetry = async <R>(
    operation: () => Promise<R>,
    operationName: string
  ): Promise<R> => {
    if (retryLogic) {
      return retryLogic.executeWithRetry(operation, operationName);
    }
    return operation();
  };

  const generateContent = useAsyncOperation(
    async (...args: unknown[]) => {
      const { prompt, model = 'gpt-3.5-turbo' } = args[0] as {
        prompt: string;
        model?: string;
      };
      return executeWithRetry(async () => {
        const response = await fetch('/api/ai/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt, model }),
        });

        if (!response.ok) {
          throw new Error(`AI service error: ${response.statusText}`);
        }

        return response.json();
      }, 'ai-generate');
    },
    {
      showSuccessToast: false,
      showErrorToast: enableFeedback,
      onError: error => logError(error, { operation: 'ai-generate' }),
    }
  );

  const analyzeData = useAsyncOperation(
    async (...args: unknown[]) => {
      const { data, analysisType } = args[0] as {
        data: unknown;
        analysisType: string;
      };
      return executeWithRetry(async () => {
        const response = await fetch('/api/ai/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data, analysisType }),
        });

        if (!response.ok) {
          throw new Error(`AI analysis error: ${response.statusText}`);
        }

        return response.json();
      }, 'ai-analyze');
    },
    {
      showSuccessToast: false,
      showErrorToast: enableFeedback,
      onError: error => logError(error, { operation: 'ai-analyze' }),
    }
  );

  return {
    generateContent,
    analyzeData,
    isRetrying: retryLogic?.isRetrying || false,
    retryCount: retryLogic?.retryCount || 0,
    lastError: retryLogic?.lastError || null,
    nextRetryAt: retryLogic?.nextRetryAt || null,
  };
}
