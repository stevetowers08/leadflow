/**
 * Real-time synchronization hook for assignment changes
 * Provides automatic updates across all components when assignments change
 */

import { useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface RealtimeAssignmentOptions {
  entityTypes?: ('people' | 'companies' | 'jobs')[];
  onAssignmentChange?: (payload: {
    entityType: 'people' | 'companies' | 'jobs';
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
    entityTypes = ['people', 'companies', 'jobs'],
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
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['leads-infinite'] });

      // Invalidate dashboard stats
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
    [queryClient]
  );

  // Handle assignment changes
  const handleAssignmentChange = useCallback(
    (payload: any) => {
      const { new: newRecord, old: oldRecord, eventType, table } = payload;

      if (eventType === 'UPDATE' && newRecord && oldRecord) {
        const oldOwnerId = oldRecord.owner_id;
        const newOwnerId = newRecord.owner_id;

        // Only trigger if owner actually changed
        if (oldOwnerId !== newOwnerId) {
          console.log('🔄 Assignment changed via real-time:', {
            entityType: table,
            entityId: newRecord.id,
            oldOwnerId,
            newOwnerId,
          });

          // Invalidate caches
          invalidateAssignmentCaches(table, newRecord.id);

          // Call custom handler if provided
          onAssignmentChange?.({
            entityType: table as 'people' | 'companies' | 'jobs',
            entityId: newRecord.id,
            newOwnerId,
            oldOwnerId,
          });
        }
      }
    },
    [invalidateAssignmentCaches, onAssignmentChange]
  );

  useEffect(() => {
    if (!enabled) return;

    const channels: any[] = [];

    // Set up subscriptions for each entity type
    entityTypes.forEach(entityType => {
      const channel = supabase
        .channel(`${entityType}-assignment-sync`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: entityType,
            filter: 'owner_id=neq.null',
          },
          handleAssignmentChange
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: entityType,
            filter: 'owner_id=is.null',
          },
          handleAssignmentChange
        )
        .subscribe(status => {
          if (status === 'SUBSCRIBED') {
            if (process.env.NEXT_PUBLIC_VERBOSE_LOGS === 'true') {
              console.log(`✅ Real-time subscription active for ${entityType}`);
            }
          } else if (status === 'CHANNEL_ERROR') {
            console.error(`❌ Real-time subscription error for ${entityType}`);
          }
        });

      channels.push(channel);
    });

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
  }, [entityTypes.join(','), enabled]); // Remove handleAssignmentChange from dependencies

  return {
    invalidateAssignmentCaches,
  };
};
