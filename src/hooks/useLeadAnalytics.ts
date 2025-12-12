/**
 * Hook for Lead Analytics
 * 
 * Provides React Query integration for lead analytics data
 */

import { useQuery } from '@tanstack/react-query';
import { LeadAnalyticsService, LeadAnalyticsFilters } from '@/services/leadAnalyticsService';

export function useLeadAnalytics(filters: LeadAnalyticsFilters = { period: 'last_30_days' }) {
  return useQuery({
    queryKey: ['lead-analytics', filters],
    queryFn: () => LeadAnalyticsService.getLeadAnalytics(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}


