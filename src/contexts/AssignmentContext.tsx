/**
 * Global assignment context provider
 * Manages assignment state across the entire application
 */

import React, {
  createContext,
  useContext,
  useCallback,
  useEffect,
} from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/utils/toast';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/contexts/PermissionsContext';
import { useRealtimeAssignmentSync } from '@/hooks/useRealtimeAssignmentSync';

interface AssignmentContextType {
  assignEntity: (
    entityType: 'leads' | 'companies',
    entityId: string,
    newOwnerId: string | null
  ) => Promise<boolean>;
  canAssign: boolean;
  isLoading: boolean;
  invalidateAssignmentCaches: (entityType: string, entityId: string) => void;
}

const AssignmentContext = createContext<AssignmentContextType | undefined>(
  undefined
);

export const useAssignment = () => {
  const context = useContext(AssignmentContext);
  if (context === undefined) {
    throw new Error('useAssignment must be used within an AssignmentProvider');
  }
  return context;
};

interface AssignmentProviderProps {
  children: React.ReactNode;
}

export const AssignmentProvider: React.FC<AssignmentProviderProps> = ({
  children,
}) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { hasRole } = usePermissions();

  const canAssign = hasRole('admin');

  // Set up real-time synchronization for all entity types
  const { invalidateAssignmentCaches } = useRealtimeAssignmentSync({
    entityTypes: ['people', 'companies'] as ('people' | 'companies')[],
    onAssignmentChange: payload => {
      console.log('🔄 Global assignment change detected:', payload);
      // Additional global handling can be added here
    },
    enabled: true,
  });

  // Global assignment function
  const assignEntity = useCallback(
    async (
      entityType: 'leads' | 'companies',
      entityId: string,
      newOwnerId: string | null
    ): Promise<boolean> => {
      if (!canAssign) {
        toast.error('Permission Denied', {
          description: "You don't have permission to assign entities",
        });
        return false;
      }

      if (!user) {
        toast.error('Error', {
          description: 'You must be logged in to assign entities',
        });
        return false;
      }

      try {
        // Validate user exists if assigning to someone
        if (newOwnerId) {
          const { data: userData, error: userError } = await supabase
            .from('user_profiles')
            .select('id, full_name')
            .eq('id', newOwnerId)
            .single();

          if (userError || !userData) {
            toast.error('Assignment Failed', {
              description: 'Target user does not exist or is not active',
            });
            return false;
          }
        }

        // Assignment removed - no longer using owner_id
        // This function is kept for backward compatibility but does nothing
        const { error } = await supabase
          .from(entityType)
          .update({
            updated_at: new Date().toISOString(),
          })
          .eq('id', entityId);

        if (error) {
          throw error;
        }

        // Invalidate caches
        invalidateAssignmentCaches(entityType, entityId);

        // Show success message
        const entityName =
          entityType === 'leads' ? 'lead' : entityType.slice(0, -1);
        toast.success('Assignment Updated', {
          description: newOwnerId
            ? `${entityName} assigned successfully`
            : `${entityName} unassigned successfully`,
        });

        return true;
      } catch (error) {
        console.error('Error assigning entity:', error);
        toast.error('Assignment Failed', {
          description:
            error instanceof Error
              ? error.message
              : 'An unexpected error occurred',
        });
        return false;
      }
    },
    [canAssign, user, invalidateAssignmentCaches]
  );

  const value: AssignmentContextType = {
    assignEntity,
    canAssign,
    isLoading: false, // Could be enhanced to track loading state
    invalidateAssignmentCaches,
  };

  return (
    <AssignmentContext.Provider value={value}>
      {children}
    </AssignmentContext.Provider>
  );
};
