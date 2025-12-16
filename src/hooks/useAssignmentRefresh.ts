/**
 * Custom hook for handling assignment changes with automatic list refresh
 * Uses React Query's invalidation for efficient cache updates
 */

import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

export const useAssignmentRefresh = () => {
  const queryClient = useQueryClient();

  const refreshAssignmentLists = useCallback(() => {
    // Invalidate all relevant queries to trigger refetch
    queryClient.invalidateQueries({ queryKey: ['people'] });
    queryClient.invalidateQueries({ queryKey: ['companies'] });

    // Also invalidate any entity-specific queries
    queryClient.invalidateQueries({ queryKey: ['entity-data'] });

    console.log('🔄 Assignment lists refreshed via React Query invalidation');
  }, [queryClient]);

  const refreshSpecificEntity = useCallback(
    (entityType: 'people' | 'companies', entityId: string) => {
      // Invalidate specific entity queries
      queryClient.invalidateQueries({ queryKey: [entityType, entityId] });
      queryClient.invalidateQueries({
        queryKey: ['entity-data', entityType, entityId],
      });

      if (process.env.NEXT_PUBLIC_VERBOSE_LOGS === 'true') {
        console.log(`🔄 Refreshed ${entityType} entity ${entityId}`);
      }
    },
    [queryClient]
  );

  return {
    refreshAssignmentLists,
    refreshSpecificEntity,
  };
};
