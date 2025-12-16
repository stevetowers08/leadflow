/**
 * Real-time synchronization hook for assignment changes
 * Provides automatic updates across all components when assignments change
 */

import { useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

export interface RealtimeAssignmentOptions {
  entityTypes?: ('people' | 'companies')[];
  onAssignmentChange?: (payload: {
    entityType: 'people' | 'companies';
    entityId: string;
    newOwnerId: string | null;
    oldOwnerId: string | null;
  }) => void;
  enabled?: boolean;
}

export const useRealtimeAssignmentSync = (
  options: RealtimeAssignmentOptions = {}
) => {
  const {
    entityTypes = ['people', 'companies'],
    onAssignmentChange,
    enabled = true,
  } = options;

  const queryClient = useQueryClient();

  // Cache invalidation function
  const invalidateAssignmentCaches = useCallback(
    (entityType: string, entityId: string) => {
      // Invalidate specific entity assignment
      queryClient.invalidateQueries({
        queryKey: ['assignment', entityType, entityId],
      });

      // Invalidate general assignment queries
      queryClient.invalidateQueries({ queryKey: ['user-assignment-stats'] });
      queryClient.invalidateQueries({ queryKey: ['leads-with-assignments'] });
      queryClient.invalidateQueries({
        queryKey: ['companies-with-assignments'],
      });
      queryClient.invalidateQueries({ queryKey: ['unassigned-leads'] });
      queryClient.invalidateQueries({ queryKey: ['unassigned-companies'] });

      // Invalidate main entity queries
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      queryClient.invalidateQueries({ queryKey: ['leads-infinite'] });

      // Invalidate dashboard stats
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
    [queryClient]
  );

  // Assignment feature removed - owner_id no longer exists
  // Using client_id for multi-tenant architecture instead
  const handleAssignmentChange = useCallback(() => {
    // No-op: assignment functionality has been removed
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const channels: RealtimeChannel[] = [];

    // Assignment feature removed - owner_id no longer exists
    // Real-time assignment sync disabled
    // No subscriptions needed

    return () => {
      console.log('🧹 Cleaning up real-time subscriptions...');
      channels.forEach(channel => {
        try {
          supabase.removeChannel(channel);
        } catch (error) {
          console.warn('Warning: Error removing channel:', error);
        }
      });
    };
  }, [enabled, entityTypes]);

  return {
    invalidateAssignmentCaches,
  };
};
