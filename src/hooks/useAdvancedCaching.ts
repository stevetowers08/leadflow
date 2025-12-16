import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useRef, useState } from 'react';

// Advanced caching configuration
export const CACHE_CONFIG = {
  // Different cache times for different data types
  STATIC_DATA: 30 * 60 * 1000, // 30 minutes (dropdowns, enums)
  DYNAMIC_DATA: 5 * 60 * 1000, // 5 minutes (people, companies, jobs)
  REAL_TIME_DATA: 1 * 60 * 1000, // 1 minute (interactions, notifications)
  USER_DATA: 15 * 60 * 1000, // 15 minutes (user profiles, settings)

  // Stale time configurations
  STALE_TIME: {
    STATIC: 15 * 60 * 1000, // 15 minutes
    DYNAMIC: 2 * 60 * 1000, // 2 minutes
    REAL_TIME: 30 * 1000, // 30 seconds
    USER: 5 * 60 * 1000, // 5 minutes
  },

  // Background refetch intervals
  REFETCH_INTERVALS: {
    STATIC: false, // Never refetch static data
    DYNAMIC: 10 * 60 * 1000, // 10 minutes
    REAL_TIME: 2 * 60 * 1000, // 2 minutes
    USER: 5 * 60 * 1000, // 5 minutes
  },
};

// Cache invalidation patterns
export const CACHE_PATTERNS = {
  PEOPLE: ['people', 'leads'],
  COMPANIES: ['companies'],
  INTERACTIONS: ['interactions'],
  USER_PROFILES: ['user_profiles'],
  CAMPAIGNS: ['campaigns', 'campaign_participants', 'campaign_messages'],
  ALL: ['people', 'companies', 'interactions', 'user_profiles', 'campaigns'],
};

// Advanced caching hook with intelligent invalidation
export function useAdvancedCaching<T>(
  queryKey: string[],
  queryFn: () => Promise<T>,
  options: {
    cacheType?: 'STATIC' | 'DYNAMIC' | 'REAL_TIME' | 'USER';
    enabled?: boolean;
    refetchOnWindowFocus?: boolean;
    refetchOnMount?: boolean;
    retry?: number;
    retryDelay?: number;
  } = {}
) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const retryCountRef = useRef(0);

  const {
    cacheType = 'DYNAMIC',
    enabled = true,
    refetchOnWindowFocus = false,
    refetchOnMount = true,
    retry = 3,
    retryDelay = 1000,
  } = options;

  // Map cacheType to CACHE_CONFIG keys
  const cacheTimeMap: Record<typeof cacheType, number> = {
    STATIC: CACHE_CONFIG.STATIC_DATA,
    DYNAMIC: CACHE_CONFIG.DYNAMIC_DATA,
    REAL_TIME: CACHE_CONFIG.REAL_TIME_DATA,
    USER: CACHE_CONFIG.USER_DATA,
  };

  const cacheTime = cacheTimeMap[cacheType];
  const staleTime = CACHE_CONFIG.STALE_TIME[cacheType];
  const rawRefetchInterval = CACHE_CONFIG.REFETCH_INTERVALS[cacheType];
  // Type guard: ensure refetchInterval is number | false (not boolean which includes true)
  const refetchInterval: number | false =
    typeof rawRefetchInterval === 'number' ? rawRefetchInterval : false;

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      try {
        const result = await queryFn();
        retryCountRef.current = 0; // Reset retry count on success
        return result;
      } catch (error) {
        retryCountRef.current++;

        // Show toast for persistent errors
        if (retryCountRef.current >= retry) {
          toast({
            title: 'Data Loading Error',
            description:
              'Failed to load data after multiple attempts. Please refresh the page.',
            variant: 'destructive',
          });
        }

        throw error;
      }
    },
    enabled,
    staleTime,
    gcTime: cacheTime,
    refetchOnWindowFocus,
    refetchOnMount,
    refetchInterval,
    retry,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Intelligent cache invalidation
  const invalidateCache = useCallback(
    (patterns: string[] = []) => {
      patterns.forEach(pattern => {
        queryClient.invalidateQueries({ queryKey: [pattern] });
      });
    },
    [queryClient]
  );

  // Prefetch related data
  const prefetchRelated = useCallback(
    async (
      relatedQueries: Array<{ key: string[]; fn: () => Promise<unknown> }>
    ) => {
      const prefetchPromises = relatedQueries.map(({ key, fn }) =>
        queryClient.prefetchQuery({
          queryKey: key,
          queryFn: fn,
          staleTime: CACHE_CONFIG.STALE_TIME.DYNAMIC,
        })
      );

      await Promise.allSettled(prefetchPromises);
    },
    [queryClient]
  );

  // Cache warming for critical data
  const warmCache = useCallback(
    async (
      criticalQueries: Array<{ key: string[]; fn: () => Promise<unknown> }>
    ) => {
      const warmPromises = criticalQueries.map(({ key, fn }) =>
        queryClient.prefetchQuery({
          queryKey: key,
          queryFn: fn,
          staleTime: CACHE_CONFIG.STALE_TIME.DYNAMIC,
          gcTime: CACHE_CONFIG.DYNAMIC_DATA,
        })
      );

      await Promise.allSettled(warmPromises);
    },
    [queryClient]
  );

  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    setRetryCount(retryCountRef.current);
  }, [query.isFetching, query.isError]);

  return {
    ...query,
    invalidateCache,
    prefetchRelated,
    warmCache,
    retryCount,
  };
}

// Optimistic updates hook
export function useOptimisticMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options: {
    onMutate?: (variables: TVariables) => Promise<unknown>;
    onError?: (
      error: Error,
      variables: TVariables,
      context: unknown
    ) => Promise<unknown>;
    onSuccess?: (
      data: TData,
      variables: TVariables,
      context: unknown
    ) => Promise<unknown>;
    onSettled?: (
      data: TData | undefined,
      error: Error | null,
      variables: TVariables,
      context: unknown
    ) => Promise<unknown>;
    invalidateQueries?: string[][];
  } = {}
) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn,
    onMutate: async variables => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries();

      // Snapshot previous values
      const previousData = queryClient.getQueriesData({});

      // Optimistically update cache
      if (options.onMutate) {
        await options.onMutate(variables);
      }

      return { previousData };
    },
    onError: async (error, variables, context) => {
      // Rollback optimistic updates
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }

      toast({
        title: 'Update Failed',
        description: error.message || 'An error occurred while updating data.',
        variant: 'destructive',
      });

      if (options.onError) {
        await options.onError(error, variables, context);
      }
    },
    onSuccess: async (data, variables, context) => {
      toast({
        title: 'Success',
        description: 'Data updated successfully.',
      });

      // Invalidate related queries
      if (options.invalidateQueries) {
        options.invalidateQueries.forEach(queryKey => {
          queryClient.invalidateQueries({ queryKey });
        });
      }

      if (options.onSuccess) {
        await options.onSuccess(data, variables, context);
      }
    },
    onSettled: async (data, error, variables, context) => {
      if (options.onSettled) {
        await options.onSettled(data, error, variables, context);
      }
    },
  });
}

// Cache statistics and monitoring
export function useCacheStats() {
  const queryClient = useQueryClient();

  const getCacheStats = useCallback(() => {
    const cache = queryClient.getQueryCache();
    const queries = cache.getAll();

    const stats = {
      totalQueries: queries.length,
      staleQueries: queries.filter(q => q.isStale()).length,
      fetchingQueries: queries.filter(q => q.state.status === 'pending').length,
      errorQueries: queries.filter(q => q.state.status === 'error').length,
      cacheSize: JSON.stringify(queries).length,
      queriesByKey: queries.reduce(
        (acc, query) => {
          const key = query.queryKey[0] as string;
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      ),
    };

    return stats;
  }, [queryClient]);

  const clearExpiredCache = useCallback(() => {
    const cache = queryClient.getQueryCache();
    const queries = cache.getAll();

    queries.forEach(query => {
      if (
        query.isStale() &&
        query.state.dataUpdatedAt < Date.now() - CACHE_CONFIG.DYNAMIC_DATA
      ) {
        queryClient.removeQueries({ queryKey: query.queryKey });
      }
    });
  }, [queryClient]);

  const clearAllCache = useCallback(() => {
    queryClient.clear();
  }, [queryClient]);

  return {
    getCacheStats,
    clearExpiredCache,
    clearAllCache,
  };
}

// Background sync hook for offline support
export function useBackgroundSync() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const syncInBackground = useCallback(async () => {
    if (!navigator.onLine) return;

    try {
      // Sync critical data in background
      const criticalQueries = [
        {
          key: ['leads'],
          fn: async () => {
            const { data, error } = await supabase
              .from('leads')
              .select('id, first_name, last_name, status, updated_at')
              .limit(100);
            if (error) throw error;
            return data;
          },
        },
        {
          key: ['companies'],
          fn: async () => {
            const { data, error } = await supabase
              .from('companies')
              .select('id, name, pipeline_stage, updated_at')
              .limit(100);
            if (error) throw error;
            return data;
          },
        },
      ];

      await Promise.allSettled(
        criticalQueries.map(({ key, fn }) =>
          queryClient.prefetchQuery({
            queryKey: key,
            queryFn: fn as () => Promise<unknown>,
            staleTime: CACHE_CONFIG.STALE_TIME.DYNAMIC,
          })
        )
      );

      console.log('Background sync completed');
    } catch (error) {
      console.error('Background sync failed:', error);
    }
  }, [queryClient]);

  useEffect(() => {
    // Sync every 5 minutes when tab is visible
    const interval = setInterval(
      () => {
        if (document.visibilityState === 'visible') {
          syncInBackground();
        }
      },
      5 * 60 * 1000
    );

    // Sync when tab becomes visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        syncInBackground();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [syncInBackground]);

  return { syncInBackground };
}
