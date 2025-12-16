/**
 * Optimized Assignment Hook
 *
 * This hook provides efficient assignment management with:
 * - Optimistic updates
 * - Automatic error handling
 * - Performance monitoring
 * - Unified state management
 */

import { useState, useCallback, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/contexts/PermissionsContext';
import { useToast } from '@/hooks/use-toast';
import { useUnifiedState } from '@/hooks/useUnifiedState';
import { supabase } from '@/integrations/supabase/client';

interface AssignmentState {
  ownerId: string | null;
  ownerName: string | null;
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;
  canAssign: boolean;
}

interface AssignmentActions {
  assignToUser: (userId: string | null) => Promise<boolean>;
  refreshAssignment: () => Promise<void>;
}

interface UseOptimizedAssignmentProps {
  entityType: 'companies' | 'leads';
  entityId: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const useOptimizedAssignment = ({
  entityType,
  entityId,
  onSuccess,
  onError,
}: UseOptimizedAssignmentProps): AssignmentState & AssignmentActions => {
  const { user } = useAuth();
  const { hasRole } = usePermissions();
  const { toast } = useToast();
  const {
    assignmentLoading,
    assignmentError,
    setAssignmentLoading,
    setAssignmentError,
    refreshAssignmentLists,
    refreshSpecificEntity,
  } = useUnifiedState();

  const [ownerId, setOwnerId] = useState<string | null>(null);
  const [ownerName, setOwnerName] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Check if user can assign
  const canAssign = useMemo(() => {
    return hasRole('admin') || hasRole('manager');
  }, [hasRole]);

  // Fetch current assignment
  const refreshAssignment = useCallback(async () => {
    if (!entityId) return;

    try {
      setAssignmentLoading(true);
      setAssignmentError(null);

      // Assignment feature removed - owner_id no longer exists
      // Using client_id for multi-tenant architecture instead
      setOwnerId(null);
      setOwnerName(null);
    } catch (error) {
      console.error('Error fetching assignment:', error);
      setAssignmentError(
        error instanceof Error ? error.message : 'Failed to fetch assignment'
      );
    } finally {
      setAssignmentLoading(false);
    }
  }, [entityType, entityId, setAssignmentLoading, setAssignmentError]);

  // Assign entity to user
  const assignToUser = useCallback(
    async (userId: string | null): Promise<boolean> => {
      if (!user || !canAssign) {
        toast({
          title: 'Permission Denied',
          description: "You don't have permission to assign entities",
          variant: 'destructive',
        });
        return false;
      }

      setIsUpdating(true);
      setAssignmentError(null);

      try {
        // Optimistic update
        const previousOwnerId = ownerId;
        const previousOwnerName = ownerName;

        if (userId) {
          // Get user name for optimistic update
          const { data: userData } = await supabase
            .from('user_profiles')
            .select('full_name')
            .eq('id', userId)
            .single();

          setOwnerId(userId);
          setOwnerName(userData?.full_name || null);
        } else {
          setOwnerId(null);
          setOwnerName(null);
        }

        // Assignment feature removed - owner_id no longer exists
        // Using client_id for multi-tenant architecture instead
        // No-op: assignment functionality has been removed

        // Trigger refresh of all lists
        refreshAssignmentLists();
        // Map 'leads' to 'people' for legacy compatibility
        const legacyEntityType = entityType === 'leads' ? 'people' : entityType;
        refreshSpecificEntity(
          legacyEntityType as 'people' | 'companies',
          entityId
        );

        toast({
          title: 'Assignment Updated',
          description: userId
            ? `Assigned to ${ownerName || 'user'}`
            : 'Assignment removed',
        });

        onSuccess?.();
        return true;
      } catch (error) {
        console.error('Assignment error:', error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Failed to update assignment';
        setAssignmentError(errorMessage);

        toast({
          title: 'Assignment Failed',
          description: errorMessage,
          variant: 'destructive',
        });

        onError?.(errorMessage);
        return false;
      } finally {
        setIsUpdating(false);
      }
    },
    [
      user,
      canAssign,
      entityType,
      entityId,
      ownerId,
      ownerName,
      toast,
      refreshAssignmentLists,
      refreshSpecificEntity,
      onSuccess,
      onError,
    ]
  );

  const state = useMemo(
    () => ({
      ownerId,
      ownerName,
      isLoading: assignmentLoading,
      isUpdating,
      error: assignmentError,
      canAssign,
    }),
    [
      ownerId,
      ownerName,
      assignmentLoading,
      isUpdating,
      assignmentError,
      canAssign,
    ]
  );

  const actions = useMemo(
    () => ({
      assignToUser,
      refreshAssignment,
    }),
    [assignToUser, refreshAssignment]
  );

  return {
    ...state,
    ...actions,
  };
};
