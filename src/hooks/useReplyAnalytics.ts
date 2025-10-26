import { useQuery } from '@tanstack/react-query';
import { AnalyticsService } from '../services/analyticsService';

/**
 * Hook to get reply analytics by stage
 */
export function useReplyAnalyticsByStage() {
  return useQuery({
    queryKey: ['reply-analytics-by-stage'],
    queryFn: () => AnalyticsService.getReplyAnalyticsByStage(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to get overall reply metrics
 */
export function useOverallReplyMetrics() {
  return useQuery({
    queryKey: ['overall-reply-metrics'],
    queryFn: () => AnalyticsService.getOverallReplyMetrics(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to get reply trends over time
 */
export function useReplyTrends() {
  return useQuery({
    queryKey: ['reply-trends'],
    queryFn: () => AnalyticsService.getReplyTrends(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 15 * 60 * 1000, // 15 minutes
  });
}

/**
 * Hook to get stage-specific reply analytics
 */
export function useStageReplyAnalytics(stage: string) {
  return useQuery({
    queryKey: ['stage-reply-analytics', stage],
    queryFn: () => AnalyticsService.getStageReplyAnalytics(stage),
    enabled: !!stage,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to get person-specific reply analytics
 */
export function usePersonReplyAnalytics(personId: string) {
  return useQuery({
    queryKey: ['person-reply-analytics', personId],
    queryFn: () => AnalyticsService.getPersonReplyAnalytics(personId),
    enabled: !!personId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook to get top performing stages
 */
export function useTopPerformingStages(limit: number = 5) {
  return useQuery({
    queryKey: ['top-performing-stages', limit],
    queryFn: () => AnalyticsService.getTopPerformingStages(limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to get comprehensive reply analytics summary
 */
export function useReplyAnalyticsSummary() {
  return useQuery({
    queryKey: ['reply-analytics-summary'],
    queryFn: () => AnalyticsService.getReplyAnalyticsSummary(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to get reply analytics for a specific person with real-time updates
 */
export function usePersonReplyAnalyticsRealtime(personId: string) {
  return useQuery({
    queryKey: ['person-reply-analytics-realtime', personId],
    queryFn: () => AnalyticsService.getPersonReplyAnalytics(personId),
    enabled: !!personId,
    staleTime: 30 * 1000, // 30 seconds for real-time feel
    refetchInterval: 60 * 1000, // 1 minute
  });
}

/**
 * Hook to get reply analytics for dashboard with optimized caching
 */
export function useDashboardReplyAnalytics() {
  return useQuery({
    queryKey: ['dashboard-reply-analytics'],
    queryFn: async () => {
      const [overall, byStage, trends, topPerforming] = await Promise.all([
        AnalyticsService.getOverallReplyMetrics(),
        AnalyticsService.getReplyAnalyticsByStage(),
        AnalyticsService.getReplyTrends(),
        AnalyticsService.getTopPerformingStages(3),
      ]);

      return {
        overall,
        byStage,
        trends,
        topPerforming,
      };
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // 5 minutes
  });
}
