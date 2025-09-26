import React from 'react';
import { ComponentErrorBoundary } from '@/components/ErrorBoundary';
import { LoadingState, InlineLoading } from '@/components/LoadingStates';
import { useAsyncOperation, useAsyncData } from '@/hooks/useAsyncOperation';
import { useUserFeedback } from '@/hooks/useUserFeedback';
import { useRetryLogic } from '@/hooks/useRetryLogic';
import { supabase } from '@/integrations/supabase/client';

// Example: Enhanced Lead Management Component
export function EnhancedLeadManagement() {
  const { showSuccess, showError } = useUserFeedback();
  const retryLogic = useRetryLogic();

  // Fetch leads with retry and error handling
  const leadsOperation = useAsyncData(
    async () => {
      return retryLogic.executeWithRetry(async () => {
        const { data, error } = await supabase
          .from('people')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data;
      }, 'fetch-leads');
    },
    {
      initialData: [],
      autoExecute: true,
      showSuccessToast: false,
      showErrorToast: true
    }
  );

  // Create lead with retry and feedback
  const createLeadOperation = useAsyncOperation(
    async (leadData: any) => {
      return retryLogic.executeWithRetry(async () => {
        const { data, error } = await supabase
          .from('people')
          .insert(leadData)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      }, 'create-lead');
    },
    {
      showSuccessToast: true,
      showErrorToast: true,
      successMessage: 'Lead created successfully',
      errorMessage: 'Failed to create lead',
      onSuccess: () => {
        showSuccess('Success', 'Lead created successfully');
        leadsOperation.refetch(); // Refresh the list
      },
      onError: (error) => {
        showError('Error', `Failed to create lead: ${error.message}`);
      }
    }
  );

  // Update lead with retry and feedback
  const updateLeadOperation = useAsyncOperation(
    async ({ id, updates }: { id: string; updates: any }) => {
      return retryLogic.executeWithRetry(async () => {
        const { data, error } = await supabase
          .from('people')
          .update(updates)
          .eq('id', id)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      }, 'update-lead');
    },
    {
      showSuccessToast: true,
      showErrorToast: true,
      successMessage: 'Lead updated successfully',
      errorMessage: 'Failed to update lead',
      onSuccess: () => {
        showSuccess('Success', 'Lead updated successfully');
        leadsOperation.refetch(); // Refresh the list
      },
      onError: (error) => {
        showError('Error', `Failed to update lead: ${error.message}`);
      }
    }
  );

  // Delete lead with retry and feedback
  const deleteLeadOperation = useAsyncOperation(
    async (id: string) => {
      return retryLogic.executeWithRetry(async () => {
        const { error } = await supabase
          .from('people')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        return { id };
      }, 'delete-lead');
    },
    {
      showSuccessToast: true,
      showErrorToast: true,
      successMessage: 'Lead deleted successfully',
      errorMessage: 'Failed to delete lead',
      onSuccess: () => {
        showSuccess('Success', 'Lead deleted successfully');
        leadsOperation.refetch(); // Refresh the list
      },
      onError: (error) => {
        showError('Error', `Failed to delete lead: ${error.message}`);
      }
    }
  );

  const handleCreateLead = async (leadData: any) => {
    try {
      await createLeadOperation.execute(leadData);
    } catch (error) {
      // Error handling is done by the hook
    }
  };

  const handleUpdateLead = async (id: string, updates: any) => {
    try {
      await updateLeadOperation.execute({ id, updates });
    } catch (error) {
      // Error handling is done by the hook
    }
  };

  const handleDeleteLead = async (id: string) => {
    try {
      await deleteLeadOperation.execute(id);
    } catch (error) {
      // Error handling is done by the hook
    }
  };

  return (
    <ComponentErrorBoundary>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Lead Management</h1>
          <button
            onClick={() => leadsOperation.refetch()}
            disabled={leadsOperation.isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {leadsOperation.isLoading ? (
              <InlineLoading isLoading={true} loadingText="Refreshing..." />
            ) : (
              'Refresh'
            )}
          </button>
        </div>

        {/* Loading State */}
        {leadsOperation.isLoading && (
          <LoadingState
            isLoading={true}
            loadingText="Loading leads..."
            variant="skeleton"
          />
        )}

        {/* Error State */}
        {leadsOperation.error && (
          <LoadingState
            isLoading={false}
            error={leadsOperation.error}
            onRetry={() => leadsOperation.refetch()}
            errorText="Failed to load leads"
          />
        )}

        {/* Retry Indicator */}
        {retryLogic.isRetrying && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
              <span className="text-sm text-yellow-800">
                Retrying... (attempt {retryLogic.retryCount}/3)
              </span>
            </div>
          </div>
        )}

        {/* Success Content */}
        {leadsOperation.data && !leadsOperation.isLoading && !leadsOperation.error && (
          <div className="space-y-4">
            <div className="grid gap-4">
              {leadsOperation.data.map((lead: any) => (
                <div key={lead.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{lead.name}</h3>
                      <p className="text-sm text-gray-600">{lead.email}</p>
                      <p className="text-sm text-gray-600">{lead.company}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleUpdateLead(lead.id, { status: 'contacted' })}
                        disabled={updateLeadOperation.isLoading}
                        className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 transition-colors"
                      >
                        {updateLeadOperation.isLoading ? (
                          <InlineLoading isLoading={true} loadingText="Updating..." />
                        ) : (
                          'Mark Contacted'
                        )}
                      </button>
                      <button
                        onClick={() => handleDeleteLead(lead.id)}
                        disabled={deleteLeadOperation.isLoading}
                        className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 transition-colors"
                      >
                        {deleteLeadOperation.isLoading ? (
                          <InlineLoading isLoading={true} loadingText="Deleting..." />
                        ) : (
                          'Delete'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Create Lead Form */}
        <div className="p-4 border rounded-lg">
          <h3 className="font-medium mb-4">Create New Lead</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const leadData = {
                name: formData.get('name'),
                email: formData.get('email'),
                company: formData.get('company')
              };
              handleCreateLead(leadData);
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                name="name"
                type="text"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                name="email"
                type="email"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Company</label>
              <input
                name="company"
                type="text"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <button
              type="submit"
              disabled={createLeadOperation.isLoading}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {createLeadOperation.isLoading ? (
                <InlineLoading isLoading={true} loadingText="Creating..." />
              ) : (
                'Create Lead'
              )}
            </button>
          </form>
        </div>
      </div>
    </ComponentErrorBoundary>
  );
}
