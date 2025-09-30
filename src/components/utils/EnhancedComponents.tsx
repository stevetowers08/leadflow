import React from 'react';
import { ErrorBoundary, ComponentErrorBoundary, FeatureErrorBoundary, PageErrorBoundary } from '@/components/ErrorBoundary';
import { LoadingState, InlineLoading, CardLoading, LoadingOverlay } from '@/components/loading/LoadingStates';
import { RetryIndicator } from '@/hooks/useRetryLogic';
import { InlineFeedback, FloatingFeedback, useUserFeedback } from '@/hooks/useUserFeedback';
import { useAsyncOperation, useAsyncData, useAsyncMutation } from '@/hooks/useAsyncOperation';
import { useSupabaseService } from '@/hooks/useEnhancedServices';
import { supabase } from '@/integrations/supabase/client';

// Example: Enhanced Data Table Component
interface EnhancedDataTableProps<T> {
  title: string;
  data: T[];
  columns: any[];
  loading?: boolean;
  error?: string | null;
  onRowClick?: (row: T) => void;
  onRefresh?: () => void;
  enableRetry?: boolean;
  enableFeedback?: boolean;
}

export function EnhancedDataTable<T extends { id: string }>({
  title,
  data,
  columns,
  loading = false,
  error,
  onRowClick,
  onRefresh,
  enableRetry = true,
  enableFeedback = true
}: EnhancedDataTableProps<T>) {
  const { showSuccess, showError } = enableFeedback ? useUserFeedback() : {};

  return (
    <ComponentErrorBoundary>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{title}</h2>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Refresh
            </button>
          )}
        </div>

        <LoadingOverlay isLoading={loading} loadingText="Loading data...">
          {error ? (
            <div className="p-8 text-center">
              <LoadingState
                isLoading={false}
                error={error}
                onRetry={onRefresh}
                errorText="Failed to load data"
              />
            </div>
          ) : (
            <div className="bg-white rounded-lg border overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {columns.map((column, index) => (
                      <th key={index} className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                        {column.header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data.map((row) => (
                    <tr
                      key={row.id}
                      onClick={() => onRowClick?.(row)}
                      className="hover:bg-gray-50 cursor-pointer"
                    >
                      {columns.map((column, index) => (
                        <td key={index} className="px-4 py-3 text-sm text-gray-900">
                          {column.render ? column.render(row) : row[column.accessorKey]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </LoadingOverlay>
      </div>
    </ComponentErrorBoundary>
  );
}

// Example: Enhanced Form Component
interface EnhancedFormProps {
  onSubmit: (data: any) => Promise<void>;
  initialData?: any;
  children: React.ReactNode;
  enableRetry?: boolean;
  enableFeedback?: boolean;
}

export function EnhancedForm({
  onSubmit,
  initialData,
  children,
  enableRetry = true,
  enableFeedback = true
}: EnhancedFormProps) {
  const formOperation = useAsyncMutation(onSubmit, {
    enableRetry,
    showSuccessToast: enableFeedback,
    showErrorToast: enableFeedback,
    successMessage: 'Form submitted successfully',
    errorMessage: 'Failed to submit form'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    
    try {
      await formOperation.execute(data);
    } catch (error) {
      // Error handling is done by the hook
    }
  };

  return (
    <ComponentErrorBoundary>
      <form onSubmit={handleSubmit} className="space-y-4">
        {children}
        
        <div className="flex items-center space-x-4">
          <button
            type="submit"
            disabled={formOperation.isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {formOperation.isLoading ? (
              <InlineLoading isLoading={true} loadingText="Submitting..." />
            ) : (
              'Submit'
            )}
          </button>
          
          {formOperation.error && (
            <button
              type="button"
              onClick={() => formOperation.retry()}
              className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              Retry
            </button>
          )}
        </div>

        {formOperation.isRetrying && (
          <RetryIndicator
            retryState={formOperation}
            onRetry={() => formOperation.retry()}
            onCancel={() => formOperation.reset()}
          />
        )}
      </form>
    </ComponentErrorBoundary>
  );
}

// Example: Enhanced Popup Component
interface EnhancedPopupProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  enableRetry?: boolean;
  enableFeedback?: boolean;
}

export function EnhancedPopup({
  isOpen,
  onClose,
  title,
  children,
  enableRetry = true,
  enableFeedback = true
}: EnhancedPopupProps) {
  const { feedback, isVisible, hideFeedback } = enableFeedback ? useUserFeedback() : {};

  if (!isOpen) return null;

  return (
    <FeatureErrorBoundary>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ×
            </button>
          </div>
          
          <div className="p-4 overflow-y-auto max-h-[calc(90vh-120px)]">
            {children}
          </div>
        </div>
      </div>

      {enableFeedback && (
        <FloatingFeedback
          feedback={feedback}
          isVisible={isVisible}
          onDismiss={hideFeedback}
          position="top-right"
        />
      )}
    </FeatureErrorBoundary>
  );
}

// Example: Enhanced Service Hook Usage
export function useEnhancedPeopleService() {
  const peopleService = useSupabaseService('people', {
    enableRetry: true,
    enableFeedback: true,
    enableErrorHandling: true
  });

  // Additional custom operations
  const searchPeople = useAsyncOperation(
    async (query: string) => {
      const { data, error } = await supabase
        .from('people')
        .select('*')
        .or(`name.ilike.%${query}%,email.ilike.%${query}%,company.ilike.%${query}%`);
      
      if (error) throw error;
      return data;
    },
    {
      enableRetry: true,
      showSuccessToast: false,
      showErrorToast: true
    }
  );

  const bulkUpdateStatus = useAsyncMutation(
    async ({ ids, status }: { ids: string[]; status: string }) => {
      const { data, error } = await supabase
        .from('people')
        .update({ status })
        .in('id', ids)
        .select();
      
      if (error) throw error;
      return data;
    },
    {
      enableRetry: true,
      showSuccessToast: true,
      showErrorToast: true,
      successMessage: `${ids.length} people updated successfully`
    }
  );

  return {
    ...peopleService,
    searchPeople,
    bulkUpdateStatus
  };
}

// Example: Enhanced Dashboard Component
export function EnhancedDashboard() {
  const peopleService = useEnhancedPeopleService();
  const { feedback, isVisible, hideFeedback } = useUserFeedback();

  return (
    <PageErrorBoundary>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        
        <EnhancedDataTable
          title="People"
          data={peopleService.fetchData.data || []}
          columns={[
            { header: 'Name', accessorKey: 'name' },
            { header: 'Email', accessorKey: 'email' },
            { header: 'Company', accessorKey: 'company' },
            { header: 'Status', accessorKey: 'status' }
          ]}
          loading={peopleService.fetchData.isLoading}
          error={peopleService.fetchData.error}
          onRefresh={peopleService.fetchData.refetch}
          enableRetry={true}
          enableFeedback={true}
        />

        {peopleService.isRetrying && (
          <RetryIndicator
            retryState={peopleService.retryState}
            onRetry={() => peopleService.fetchData.retry()}
            onCancel={() => peopleService.reset()}
          />
        )}
      </div>

      <FloatingFeedback
        feedback={feedback}
        isVisible={isVisible}
        onDismiss={hideFeedback}
        position="top-right"
      />
    </PageErrorBoundary>
  );
}

// Export all enhanced components and hooks
export {
  ErrorBoundary,
  ComponentErrorBoundary,
  FeatureErrorBoundary,
  PageErrorBoundary,
  LoadingState,
  InlineLoading,
  CardLoading,
  LoadingOverlay,
  RetryIndicator,
  InlineFeedback,
  FloatingFeedback,
  useAsyncOperation,
  useAsyncData,
  useAsyncMutation,
  useSupabaseService,
  useEnhancedPeopleService
};
