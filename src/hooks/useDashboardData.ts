/**
 * Dashboard Data Hook
 * Long-term solution using React Query best practices
 * Provides caching, error handling, and retry logic
 */

import { useQuery } from '@tanstack/react-query';
import { useClientId } from './useClientId';
import {
  DashboardDataService,
  DashboardMetrics,
  DashboardChartData,
} from '@/services/dashboardDataService';

/**
 * Main dashboard data hook
 * Uses React Query for automatic caching, refetching, and error handling
 */
export function useDashboardData() {
  const { data: clientId, isLoading: clientIdLoading } = useClientId();

  return useQuery<DashboardMetrics>({
    queryKey: ['dashboard', 'data', clientId],
    queryFn: async () => {
      if (!clientId) {
        // Return empty data instead of throwing - enabled flag prevents this from running
        return {
          jobsToReview: [],
          activities: [],
          newLeadsToday: 0,
          newCompaniesToday: 0,
        };
      }
      return DashboardDataService.getDashboardData(clientId);
    },
    enabled: !!clientId && !clientIdLoading,
    staleTime: 2 * 60 * 1000, // 2 minutes - data is fresh for 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes - cache for 10 minutes
    refetchOnWindowFocus: true, // Refetch when user returns to tab
    refetchOnMount: true, // Always refetch on mount for fresh data
    retry: 2, // Retry failed requests 2 times
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });
}

/**
 * Chart data hook (loads separately, non-blocking)
 * Can be enabled/disabled independently
 */
export function useDashboardChartData(enabled: boolean = true) {
  const { data: clientId, isLoading: clientIdLoading } = useClientId();

  return useQuery<DashboardChartData[]>({
    queryKey: ['dashboard', 'chart', clientId],
    queryFn: async () => {
      if (!clientId) {
        // Return empty array instead of throwing - enabled flag prevents this from running
        return [];
      }
      return DashboardDataService.getChartData(clientId);
    },
    enabled: enabled && !!clientId && !clientIdLoading,
    staleTime: 5 * 60 * 1000, // 5 minutes - chart data changes less frequently
    gcTime: 15 * 60 * 1000, // 15 minutes
    refetchOnWindowFocus: false, // Don't refetch chart on focus
    retry: 1, // Only retry once for chart (less critical)
  });
}
