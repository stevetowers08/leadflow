/**
 * Unified assignment state management hook
 * Provides consistent state synchronization across all components
 * Updated: Fixed supabase import issue
 */

import { useState, useCallback, useEffect } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/contexts/PermissionsContext';
import { supabase } from '@/integrations/supabase/client';
import { DatabaseQueries, DatabaseError } from '@/utils/databaseQueries';

export interface AssignmentState {
  ownerId: string | null;
  ownerName: string | null;
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;
}

export interface AssignmentOptions {
  entityType: 'people' | 'companies' | 'jobs';
  entityId: string;
  onSuccess?: (newOwner: string | null) => void;
  onError?: (error: string) => void;
  enableOptimisticUpdates?: boolean;
}

export const useAssignmentState = (options: AssignmentOptions) => {
  const { entityType, entityId, onSuccess, onError, enableOptimisticUpdates = true } = options;
  const [state, setState] = useState<AssignmentState>({
    ownerId: null,
    ownerName: null,
    isLoading: true,
    isUpdating: false,
    error: null,
  });

  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();
  const { hasRole } = usePermissions();

  // Check if user can assign
  const canAssign = hasRole('admin') || hasRole('owner');
  
  // Debug logging
  console.log('🔍 Assignment Debug:', {
    entityType,
    entityId,
    canAssign,
    hasAdminRole: hasRole('admin'),
    hasOwnerRole: hasRole('owner'),
    hasRecruiterRole: hasRole('recruiter'),
    userEmail: user?.email,
    allUserRoles: user?.user_metadata?.role || 'no role metadata'
  });

  // Fetch current assignment
  const fetchAssignment = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const { ownerId, ownerName } = await DatabaseQueries.getAssignment(entityType, entityId);

      setState(prev => ({
        ...prev,
        ownerId,
        ownerName,
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      console.error('Error fetching assignment:', error);
      const errorMessage = error instanceof DatabaseError 
        ? error.message 
        : 'Failed to fetch assignment';
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
    }
  }, [entityType, entityId]);

  // Assignment mutation with optimistic updates
  const assignmentMutation = useMutation({
    mutationFn: async (newOwnerId: string | null) => {
      // Validate user exists if assigning to someone
      if (newOwnerId) {
        const { data: userData, error: userError } = await supabase
          .from('user_profiles')
          .select('id, full_name')
          .eq('id', newOwnerId)
          .single();

        if (userError || !userData) {
          throw new Error('Target user does not exist or is not active');
        }
      }

      // Perform the assignment
      const { error } = await supabase
        .from(entityType)
        .update({ 
          owner_id: newOwnerId,
          updated_at: new Date().toISOString()
        })
        .eq('id', entityId);

      if (error) throw error;

      return { newOwnerId, ownerName: newOwnerId ? 'Loading...' : null };
    },
    onMutate: async (newOwnerId) => {
      if (!enableOptimisticUpdates) return;

      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['assignment', entityType, entityId] });

      // Snapshot the previous value
      const previousState = state;

      // Optimistically update the UI
      setState(prev => ({
        ...prev,
        ownerId: newOwnerId,
        ownerName: newOwnerId ? 'Updating...' : null,
        isUpdating: true,
        error: null,
      }));

      // Return a context object with the snapshotted value
      return { previousState };
    },
    onError: (error, newOwnerId, context) => {
      // Rollback optimistic update on error
      if (enableOptimisticUpdates && context?.previousState) {
        setState(context.previousState);
      }

      const errorMessage = error instanceof Error ? error.message : 'Assignment failed';
      setState(prev => ({
        ...prev,
        isUpdating: false,
        error: errorMessage,
      }));

      toast({
        title: "Assignment Failed",
        description: errorMessage,
        variant: "destructive",
      });

      onError?.(errorMessage);
    },
    onSuccess: (data) => {
      setState(prev => ({
        ...prev,
        ownerId: data.newOwnerId,
        ownerName: data.ownerName,
        isUpdating: false,
        error: null,
      }));

      // Fetch the actual owner name
      if (data.newOwnerId) {
        supabase
          .from('user_profiles')
          .select('full_name')
          .eq('id', data.newOwnerId)
          .single()
          .then(({ data: ownerData }) => {
            if (ownerData) {
              setState(prev => ({
                ...prev,
                ownerName: ownerData.full_name,
              }));
            }
          });
      }

      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['assignment', entityType, entityId] });
      queryClient.invalidateQueries({ queryKey: ['user-assignment-stats'] });
      queryClient.invalidateQueries({ queryKey: ['leads-with-assignments'] });
      queryClient.invalidateQueries({ queryKey: ['companies-with-assignments'] });
      queryClient.invalidateQueries({ queryKey: ['unassigned-leads'] });
      queryClient.invalidateQueries({ queryKey: ['unassigned-companies'] });
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });

      toast({
        title: "Assignment Updated",
        description: data.newOwnerId 
          ? `Assigned to ${data.ownerName || 'user'}`
          : "Assignment removed",
      });

      onSuccess?.(data.newOwnerId);
    },
  });

  // Assign entity to user
  const assignToUser = useCallback((newOwnerId: string | null) => {
    if (!canAssign) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to assign entities",
        variant: "destructive",
      });
      return;
    }

    assignmentMutation.mutate(newOwnerId);
  }, [canAssign, assignmentMutation, toast]);

  // Set up real-time subscription for assignment changes
  useEffect(() => {
    const channel = supabase
      .channel(`${entityType}-assignment-${entityId}`)
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: entityType,
          filter: `id=eq.${entityId}`
        }, 
        (payload) => {
          console.log('Assignment changed via real-time:', payload);
          // Refetch assignment data when it changes
          fetchAssignment();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [entityType, entityId, fetchAssignment]);

  // Initial fetch
  useEffect(() => {
    fetchAssignment();
  }, [fetchAssignment]);

  return {
    ...state,
    canAssign,
    assignToUser,
    refetch: fetchAssignment,
  };
};
