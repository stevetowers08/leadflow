// Ultra-optimized data service with intelligent caching and performance monitoring
import { PerformanceMonitor, safeAsync } from '@/services/performanceService';
import { subWeeks, subDays } from 'date-fns';

export interface OptimizedDashboardData {
  metrics: {
    totalLeads: number;
    totalCompanies: number;
    leadsThisWeek: number;
    companiesThisWeek: number;
    activeAutomations: number;
    automationSuccessRate: number;
  };
  recentLeads: Array<{
    id: string;
    first_name: string | null;
    last_name: string | null;
    email?: string | null;
    company?: string | null;
    created_at: string;
  }>;
  recentCompanies: Array<{
    id: string;
    name: string;
    industry?: string | null;
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

    return (
      safeAsync(
        async () => {
          const { supabase } = await import('@/integrations/supabase/client');

          const oneWeekAgo = subWeeks(new Date(), 1);

          const [leadsResult, companiesResult] = await Promise.all([
            supabase
              .from('leads')
              .select(
                'id, first_name, last_name, email, company, created_at, user_id'
              )
              .order('created_at', { ascending: false })
              .limit(20),

            supabase
              .from('companies')
              .select('id, name, industry, created_at, client_id')
              .order('created_at', { ascending: false })
              .limit(15),
          ]);

          const leads = leadsResult.data || [];
          const companies = companiesResult.data || [];

          const data: OptimizedDashboardData = {
            metrics: {
              totalLeads: leads.length,
              totalCompanies: companies.length,
              leadsThisWeek: leads.filter(
                l => l.created_at && new Date(l.created_at) >= oneWeekAgo
              ).length,
              companiesThisWeek: companies.filter(
                c => c.created_at && new Date(c.created_at) >= oneWeekAgo
              ).length,
              activeAutomations: 0, // Simplified for now
              automationSuccessRate: 0,
            },
            recentLeads: leads
              .filter(l => l.created_at)
              .map(l => ({
                id: l.id,
                first_name: l.first_name,
                last_name: l.last_name,
                email: l.email,
                company: l.company,
                created_at: l.created_at!,
              })),
            recentCompanies: companies
              .filter(c => c.created_at)
              .map(c => ({
                id: c.id,
                name: c.name,
                industry: c.industry,
                created_at: c.created_at!,
              })),
          };

          monitor.setCache(cacheKey, data, 300000); // 5 minutes
          return data;
        },
        { component: 'OptimizedDataService', action: 'getDashboardData' },
        this.getDefaultData()
      ) || this.getDefaultData()
    );
  }

  private static getDefaultData(): OptimizedDashboardData {
    return {
      metrics: {
        totalLeads: 0,
        totalCompanies: 0,
        leadsThisWeek: 0,
        companiesThisWeek: 0,
        activeAutomations: 0,
        automationSuccessRate: 0,
      },
      recentLeads: [],
      recentCompanies: [],
    };
  }
}
