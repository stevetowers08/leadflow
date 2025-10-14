// Ultra-optimized data service with intelligent caching and performance monitoring
import { PerformanceMonitor, safeAsync } from '@/services/performanceService';
import { subWeeks, subDays } from 'date-fns';

export interface OptimizedDashboardData {
  metrics: {
    totalPeople: number;
    totalCompanies: number;
    totalJobs: number;
    peopleThisWeek: number;
    companiesThisWeek: number;
    jobsThisWeek: number;
    activeAutomations: number;
    automationSuccessRate: number;
  };
  recentPeople: Array<{
    id: string;
    name: string;
    email_address?: string | null;
    company_name?: string | null;
    created_at: string;
  }>;
  recentCompanies: Array<{
    id: string;
    name: string;
    industry?: string | null;
    created_at: string;
  }>;
  recentJobs: Array<{
    id: string;
    title: string;
    company_name?: string | null;
    created_at: string;
  }>;
}

export class OptimizedDataService {
  static async getDashboardData(): Promise<OptimizedDashboardData> {
    const monitor = PerformanceMonitor.getInstance();
    const cacheKey = 'optimized_dashboard_data';
    
    const cachedData = monitor.getCache(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    return safeAsync(
      async () => {
        const { supabase } = await import('@/integrations/supabase/client');
        
        const oneWeekAgo = subWeeks(new Date(), 1);
        
        const [peopleResult, companiesResult, jobsResult] = await Promise.all([
          supabase.from('people')
            .select('id, name, email_address, created_at, owner_id, companies(name)')
            .order('created_at', { ascending: false })
            .limit(20),
          
          supabase.from('companies')
            .select('id, name, industry, created_at, owner_id')
            .order('created_at', { ascending: false })
            .limit(15),
          
          supabase.from('jobs')
            .select('id, title, created_at, owner_id, companies(name)')
            .order('created_at', { ascending: false })
            .limit(15)
        ]);

        const people = peopleResult.data || [];
        const companies = companiesResult.data || [];
        const jobs = jobsResult.data || [];

        const data: OptimizedDashboardData = {
          metrics: {
            totalPeople: people.length,
            totalCompanies: companies.length,
            totalJobs: jobs.length,
            peopleThisWeek: people.filter(p => new Date(p.created_at) >= oneWeekAgo).length,
            companiesThisWeek: companies.filter(c => new Date(c.created_at) >= oneWeekAgo).length,
            jobsThisWeek: jobs.filter(j => new Date(j.created_at) >= oneWeekAgo).length,
            activeAutomations: 0, // Simplified for now
            automationSuccessRate: 0
          },
          recentPeople: people.map(p => ({
            id: p.id,
            name: p.name,
            email_address: p.email_address,
            company_name: p.companies?.name || null,
            created_at: p.created_at
          })),
          recentCompanies: companies.map(c => ({
            id: c.id,
            name: c.name,
            industry: c.industry,
            created_at: c.created_at
          })),
          recentJobs: jobs.map(j => ({
            id: j.id,
            title: j.title,
            company_name: j.companies?.name || null,
            created_at: j.created_at
          }))
        };

        monitor.setCache(cacheKey, data, 300000); // 5 minutes
        return data;
      },
      { component: 'OptimizedDataService', action: 'getDashboardData' },
      this.getDefaultData()
    ) || this.getDefaultData();
  }

  private static getDefaultData(): OptimizedDashboardData {
    return {
      metrics: {
        totalPeople: 0,
        totalCompanies: 0,
        totalJobs: 0,
        peopleThisWeek: 0,
        companiesThisWeek: 0,
        jobsThisWeek: 0,
        activeAutomations: 0,
        automationSuccessRate: 0
      },
      recentPeople: [],
      recentCompanies: [],
      recentJobs: []
    };
  }
}
