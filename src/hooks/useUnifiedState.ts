/**
 * Unified State Management Hook
 *
 * This hook consolidates multiple state management concerns into a single,
 * optimized hook that reduces re-renders and improves performance.
 */

import { useState, useCallback, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export interface UnifiedState {
  // UI State
  isLoading: boolean;
  error: string | null;

  // Assignment State
  assignmentLoading: boolean;
  assignmentError: string | null;

  // Refresh State
  refreshTrigger: number;
}

export interface UnifiedActions {
  // Loading Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Assignment Actions
  setAssignmentLoading: (loading: boolean) => void;
  setAssignmentError: (error: string | null) => void;

  // Refresh Actions
  triggerRefresh: () => void;
  refreshAssignmentLists: () => void;
  refreshSpecificEntity: (
    entityType: 'people' | 'companies' | 'jobs',
    entityId: string
  ) => void;
}

export const useUnifiedState = (): UnifiedState & UnifiedActions => {
  const queryClient = useQueryClient();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [assignmentLoading, setAssignmentLoading] = useState(false);
  const [assignmentError, setAssignmentError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const setLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  const setErrorMessage = useCallback((error: string | null) => {
    setError(error);
  }, []);

  const setAssignmentLoadingCallback = useCallback((loading: boolean) => {
    setAssignmentLoading(loading);
  }, []);

  const setAssignmentErrorCallback = useCallback((error: string | null) => {
    setAssignmentError(error);
  }, []);

  const triggerRefresh = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  const refreshAssignmentLists = useCallback(() => {
    // Invalidate all relevant queries to trigger refetch
    queryClient.invalidateQueries({ queryKey: ['people'] });
    queryClient.invalidateQueries({ queryKey: ['companies'] });
    queryClient.invalidateQueries({ queryKey: ['jobs'] });
    queryClient.invalidateQueries({ queryKey: ['entity-data'] });

    console.log('🔄 Assignment lists refreshed via React Query invalidation');
  }, [queryClient]);

  const refreshSpecificEntity = useCallback(
    (entityType: 'people' | 'companies' | 'jobs', entityId: string) => {
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

  const state = useMemo(
    () => ({
      isLoading,
      error,
      assignmentLoading,
      assignmentError,
      refreshTrigger,
    }),
    [isLoading, error, assignmentLoading, assignmentError, refreshTrigger]
  );

  const actions = useMemo(
    () => ({
      setLoading,
      setError: setErrorMessage,
      setAssignmentLoading: setAssignmentLoadingCallback,
      setAssignmentError: setAssignmentErrorCallback,
      triggerRefresh,
      refreshAssignmentLists,
      refreshSpecificEntity,
    }),
    [
      setLoading,
      setErrorMessage,
      setAssignmentLoadingCallback,
      setAssignmentErrorCallback,
      triggerRefresh,
      refreshAssignmentLists,
      refreshSpecificEntity,
    ]
  );

  return {
    ...state,
    ...actions,
  };
};
