import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { reportingService } from '../services/reportingService';

export interface ReportingData {
  totalPeople: number;
  totalCompanies: number;
  totalJobs: number;
  totalInteractions: number;
  peopleByStage: Array<{ stage: string; count: number }>;
  companiesByStage: Array<{ stage: string; count: number }>;
  interactionsByType: Array<{ type: string; count: number }>;
  recentInteractions: Array<{
    id: string;
    type: string;
    description: string;
    occurred_at: string;
    person_name: string;
    company_name: string;
  }>;
  monthlyStats: Array<{
    month: string;
    people: number;
    companies: number;
    interactions: number;
  }>;
  topCompanies: Array<{
    id: string;
    name: string;
    industry: string;
    people_count: number;
    interactions_count: number;
  }>;
  userStats: Array<{
    user_id: string;
    user_name: string;
    people_count: number;
    companies_count: number;
    interactions_count: number;
  }>;
}

export const useReportingData = () => {
  const { user } = useAuth();

  return useQuery<ReportingData>({
    queryKey: ['reporting-data', user?.id],
    queryFn: async () => {
      const data = await reportingService.getReportingData();
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    refetchOnWindowFocus: false,
    retry: 2,
  });
};
