/**
 * Custom hook for reporting data
 * Provides real-time reporting metrics with caching and error handling
 */

import {
  ReportingFilters,
  ReportingMetrics,
  ReportingService,
} from '@/services/reportingService';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

export interface UseReportingDataOptions {
  filters?: ReportingFilters;
  enabled?: boolean;
  refetchInterval?: number;
}

export function useReportingData(options: UseReportingDataOptions = {}) {
  const {
    filters = { period: '30d' },
    enabled = true,
    refetchInterval,
  } = options;

  return useQuery<ReportingMetrics>({
    queryKey: ['reporting-data', filters],
    queryFn: () => ReportingService.getReportingData(filters),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchInterval,
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook for refreshing reporting data
 */
export function useRefreshReportingData() {
  const queryClient = useQueryClient();

  return useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['reporting-data'] });
  }, [queryClient]);
}
