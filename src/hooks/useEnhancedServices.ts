import { useAsyncOperation, useAsyncData, useAsyncMutation } from '@/hooks/useAsyncOperation';
import { useRetryLogic, useNetworkRetry, useApiRetry, useDatabaseRetry } from '@/hooks/useRetryLogic';
import { useUserFeedback, useActionFeedback } from '@/hooks/useUserFeedback';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { supabase } from '@/integrations/supabase/client';

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
export function useSupabaseService<T = any>(
  tableName: string,
  options: ServiceOptions = {}
) {
  const {
    enableRetry = true,
    retryConfig = {
      maxRetries: 3,
      baseDelay: 1000,
      maxDelay: 10000,
      backoffMultiplier: 2
    },
    enableFeedback = true,
    enableErrorHandling = true
  } = options;

  const retryLogic = enableRetry ? useDatabaseRetry(retryConfig) : null;
  const { handleSave, handleDelete, handleUpdate, handleCreate } = enableFeedback ? useActionFeedback() : {};
  const { logError } = enableErrorHandling ? useErrorHandler() : { logError: () => {} };

  const executeWithRetry = async <R>(operation: () => Promise<R>, operationName: string): Promise<R> => {
    if (retryLogic) {
      return retryLogic.executeWithRetry(operation, operationName);
    }
    return operation();
  };

  // Fetch data with retry and error handling
  const fetchData = useAsyncData(
    async (query?: any) => {
      return executeWithRetry(async () => {
        const { data, error } = await supabase
          .from(tableName)
          .select(query || '*');
        
        if (error) throw error;
        return data;
      }, `fetch-${tableName}`);
    },
    {
      enableRetry,
      showSuccessToast: false,
      showErrorToast: enableFeedback,
      onError: (error) => logError(error, { table: tableName, operation: 'fetch' })
    }
  );

  // Create record with retry and feedback
  const createRecord = useAsyncMutation(
    async (record: Partial<T>) => {
      return executeWithRetry(async () => {
        const { data, error } = await supabase
          .from(tableName)
          .insert(record)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      }, `create-${tableName}`);
    },
    {
      enableRetry,
      showSuccessToast: enableFeedback,
      showErrorToast: enableFeedback,
      successMessage: 'Record created successfully',
      errorMessage: 'Failed to create record',
      onSuccess: (data) => handleCreate?.(true, `Record created successfully`),
      onError: (error) => {
        logError(error, { table: tableName, operation: 'create' });
        handleCreate?.(false, error.message);
      }
    }
  );

  // Update record with retry and feedback
  const updateRecord = useAsyncMutation(
    async ({ id, updates }: { id: string; updates: Partial<T> }) => {
      return executeWithRetry(async () => {
        const { data, error } = await supabase
          .from(tableName)
          .update(updates)
          .eq('id', id)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      }, `update-${tableName}`);
    },
    {
      enableRetry,
      showSuccessToast: enableFeedback,
      showErrorToast: enableFeedback,
      successMessage: 'Record updated successfully',
      errorMessage: 'Failed to update record',
      onSuccess: (data) => handleUpdate?.(true, `Record updated successfully`),
      onError: (error) => {
        logError(error, { table: tableName, operation: 'update' });
        handleUpdate?.(false, error.message);
      }
    }
  );

  // Delete record with retry and feedback
  const deleteRecord = useAsyncMutation(
    async (id: string) => {
      return executeWithRetry(async () => {
        const { error } = await supabase
          .from(tableName)
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        return { id };
      }, `delete-${tableName}`);
    },
    {
      enableRetry,
      showSuccessToast: enableFeedback,
      showErrorToast: enableFeedback,
      successMessage: 'Record deleted successfully',
      errorMessage: 'Failed to delete record',
      onSuccess: (data) => handleDelete?.(true, `Record deleted successfully`),
      onError: (error) => {
        logError(error, { table: tableName, operation: 'delete' });
        handleDelete?.(false, error.message);
      }
    }
  );

  // Batch operations
  const batchCreate = useAsyncMutation(
    async (records: Partial<T>[]) => {
      return executeWithRetry(async () => {
        const { data, error } = await supabase
          .from(tableName)
          .insert(records)
          .select();
        
        if (error) throw error;
        return data;
      }, `batch-create-${tableName}`);
    },
    {
      enableRetry,
      showSuccessToast: enableFeedback,
      showErrorToast: enableFeedback,
      successMessage: `${records.length} records created successfully`,
      errorMessage: 'Failed to create records',
      onError: (error) => logError(error, { table: tableName, operation: 'batch-create' })
    }
  );

  const batchUpdate = useAsyncMutation(
    async (updates: Array<{ id: string; updates: Partial<T> }>) => {
      return executeWithRetry(async () => {
        const results = [];
        for (const { id, updates: recordUpdates } of updates) {
          const { data, error } = await supabase
            .from(tableName)
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
      enableRetry,
      showSuccessToast: enableFeedback,
      showErrorToast: enableFeedback,
      successMessage: `${updates.length} records updated successfully`,
      errorMessage: 'Failed to update records',
      onError: (error) => logError(error, { table: tableName, operation: 'batch-update' })
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
    retryState: retryLogic?.retryState,
    isRetrying: retryLogic?.isRetrying || false,
    retryCount: retryLogic?.retryCount || 0,
    
    // Utility functions
    refetch: fetchData.refetch,
    reset: () => {
      fetchData.reset();
      createRecord.reset();
      updateRecord.reset();
      deleteRecord.reset();
      batchCreate.reset();
      batchUpdate.reset();
    }
  };
}

// Specialized hooks for common operations
export function usePeopleService(options: ServiceOptions = {}) {
  return useSupabaseService('people', options);
}

export function useCompaniesService(options: ServiceOptions = {}) {
  return useSupabaseService('companies', options);
}

export function useJobsService(options: ServiceOptions = {}) {
  return useSupabaseService('jobs', options);
}

// Network service wrapper for external APIs
export function useNetworkService(options: ServiceOptions = {}) {
  const {
    enableRetry = true,
    retryConfig = {
      maxRetries: 3,
      baseDelay: 1000,
      maxDelay: 10000,
      backoffMultiplier: 2
    },
    enableFeedback = true,
    enableErrorHandling = true
  } = options;

  const retryLogic = enableRetry ? useNetworkRetry(retryConfig) : null;
  const { showSuccess, showError } = enableFeedback ? useUserFeedback() : {};
  const { logError } = enableErrorHandling ? useErrorHandler() : { logError: () => {} };

  const executeWithRetry = async <R>(operation: () => Promise<R>, operationName: string): Promise<R> => {
    if (retryLogic) {
      return retryLogic.executeWithRetry(operation, operationName);
    }
    return operation();
  };

  const makeRequest = useAsyncOperation(
    async ({ url, options }: { url: string; options?: RequestInit }) => {
      return executeWithRetry(async () => {
        const response = await fetch(url, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            ...options?.headers
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return response.json();
      }, `network-request-${url}`);
    },
    {
      enableRetry,
      showSuccessToast: false,
      showErrorToast: enableFeedback,
      onError: (error) => logError(error, { operation: 'network-request' })
    }
  );

  return {
    makeRequest,
    retryState: retryLogic?.retryState,
    isRetrying: retryLogic?.isRetrying || false,
    retryCount: retryLogic?.retryCount || 0
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
      backoffMultiplier: 2
    },
    enableFeedback = true,
    enableErrorHandling = true
  } = options;

  const retryLogic = enableRetry ? useApiRetry(retryConfig) : null;
  const { showSuccess, showError } = enableFeedback ? useUserFeedback() : {};
  const { logError } = enableErrorHandling ? useErrorHandler() : { logError: () => {} };

  const executeWithRetry = async <R>(operation: () => Promise<R>, operationName: string): Promise<R> => {
    if (retryLogic) {
      return retryLogic.executeWithRetry(operation, operationName);
    }
    return operation();
  };

  const generateContent = useAsyncOperation(
    async ({ prompt, model = 'gpt-3.5-turbo' }: { prompt: string; model?: string }) => {
      return executeWithRetry(async () => {
        const response = await fetch('/api/ai/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt, model })
        });

        if (!response.ok) {
          throw new Error(`AI service error: ${response.statusText}`);
        }

        return response.json();
      }, 'ai-generate');
    },
    {
      enableRetry,
      showSuccessToast: false,
      showErrorToast: enableFeedback,
      onError: (error) => logError(error, { operation: 'ai-generate' })
    }
  );

  const analyzeData = useAsyncOperation(
    async ({ data, analysisType }: { data: any; analysisType: string }) => {
      return executeWithRetry(async () => {
        const response = await fetch('/api/ai/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data, analysisType })
        });

        if (!response.ok) {
          throw new Error(`AI analysis error: ${response.statusText}`);
        }

        return response.json();
      }, 'ai-analyze');
    },
    {
      enableRetry,
      showSuccessToast: false,
      showErrorToast: enableFeedback,
      onError: (error) => logError(error, { operation: 'ai-analyze' })
    }
  );

  return {
    generateContent,
    analyzeData,
    retryState: retryLogic?.retryState,
    isRetrying: retryLogic?.isRetrying || false,
    retryCount: retryLogic?.retryCount || 0
  };
}
