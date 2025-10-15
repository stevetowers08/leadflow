import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { ReportingService } from '../services/reportingService';

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
      const serviceData = await ReportingService.getReportingData();

      // Transform service data to match hook interface
      return {
        totalPeople: serviceData.totalLeads,
        totalCompanies: serviceData.totalCompanies,
        totalJobs: serviceData.totalJobs,
        totalInteractions: serviceData.totalLeads, // Using totalLeads as proxy
        peopleByStage: serviceData.stageDistribution.map(item => ({
          stage: item.stage,
          count: item.count,
        })),
        companiesByStage:
          serviceData.companyPipelineMetrics.companiesByStage.map(item => ({
            stage: item.stage,
            count: item.count,
          })),
        interactionsByType: [], // Not available in service
        recentInteractions: [], // Not available in service
        monthlyStats: [], // Not available in service
        topCompanies: serviceData.topCompanies.map(company => ({
          id: company.companyName, // Using name as ID
          name: company.companyName,
          industry: company.industry,
          people_count: company.leadCount,
          interactions_count: company.automationActive,
        })),
        userStats: [], // Not available in service
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    refetchOnWindowFocus: false,
    retry: 2,
  });
};
