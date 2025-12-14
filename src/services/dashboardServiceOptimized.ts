// Ultra-optimized dashboard service with performance monitoring and caching
import { PerformanceMonitor, safeAsync } from '@/services/performanceService';
import { subWeeks } from 'date-fns';

export interface DashboardMetrics {
  totalLeads: number;
  totalCompanies: number;
  leadsThisWeek: number;
  companiesThisWeek: number;
  activeAutomations: number;
  automationSuccessRate: number;
  pipelineBreakdown: Record<string, number>;
  favoriteLeads: number;
  unassignedLeads: number;
  unassignedCompanies: number;
  ownerStats: Record<string, number>;
}

export interface RecentLead {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email?: string | null;
  job_title?: string | null;
  company?: string | null;
  status?: string | null;
  created_at: string;
  assigned_to?: string | null;
  company_name?: string | null;
  company_logo_url?: string | null;
  notes_count?: number;
}

export interface RecentCompany {
  id: string;
  name: string;
  industry?: string | null;
  website?: string | null;
  head_office?: string | null;
  logo_url?: string | null;
  company_size?: string | null;
  pipeline_stage?: string | null;
  created_at: string;
  assigned_to?: string | null;
  notes_count?: number;
}

export interface DashboardData {
  metrics: DashboardMetrics;
  recentLeads: RecentLead[];
  recentCompanies: RecentCompany[];
  recentActivities: Array<{
    id: string;
    interaction_type: string;
    subject?: string | null;
    content?: string | null;
    occurred_at: string;
    lead_name?: string | null;
    company_name?: string | null;
  }>;
  companiesOverTime: Array<{
    date: string;
    newCompanies: number;
    automatedCompanies: number;
  }>;
  leadsAutomationOverTime: Array<{
    date: string;
    leadsWithAutomation: number;
    automationActivity: number;
  }>;
}

export class DashboardServiceOptimized {
  /**
   * Ultra-optimized dashboard data fetch with caching and performance monitoring
   */
  static async getDashboardData(): Promise<DashboardData> {
    const monitor = PerformanceMonitor.getInstance();
    const cacheKey = 'dashboard_data';

    // Check cache first
    const cachedData = monitor.getCache(cacheKey);
    if (cachedData) {
      console.log('🚀 Dashboard data loaded from cache');
      return cachedData;
    }

    return (
      safeAsync(
        async () => {
          console.log('🚀 Fetching optimized dashboard data...');
          const { supabase } = await import('@/integrations/supabase/client');

          const oneWeekAgo = subWeeks(new Date(), 1);

          // Single optimized query with timeout
          const timeoutPromise = new Promise<never>((_, reject) => {
            setTimeout(
              () => reject(new Error('Dashboard data fetch timeout')),
              5000
            );
          });

          const dataPromise = Promise.all([
            // Query 1: Get leads with company info (most important data)
            supabase
              .from('leads')
              .select(
                `
              id, first_name, last_name, email, company, job_title, status, 
              quality_rank, user_id, owner_id, created_at, is_favourite, enrichment_timestamp
            `
              )
              .order('created_at', { ascending: false })
              .limit(50),

            // Query 2: Get companies
            supabase
              .from('companies')
              .select(
                `
              id, name, industry, website, head_office, logo_url, company_size, 
              pipeline_stage, created_at, client_id
            `
              )
              .order('created_at', { ascending: false })
              .limit(30),
          ]);

          const [leadsResult, companiesResult] = await Promise.race([
            dataPromise,
            timeoutPromise,
          ]);

          const leads = leadsResult.data || [];
          const companies = companiesResult.data || [];

          // Calculate metrics efficiently from existing data
          const metrics: DashboardMetrics = {
            totalLeads: leads.length,
            totalCompanies: companies.length,
            leadsThisWeek: leads.filter(
              l => new Date(l.created_at) >= oneWeekAgo
            ).length,
            companiesThisWeek: companies.filter(
              c => new Date(c.created_at) >= oneWeekAgo
            ).length,
            activeAutomations: 0, // automation_active field removed
            automationSuccessRate: 0, // automation_active field removed
            pipelineBreakdown: this.calculatePipelineBreakdown(leads),
            favoriteLeads: leads.filter(l => l.is_favourite).length,
            unassignedLeads: leads.filter(l => !l.owner_id).length,
            unassignedCompanies: companies.filter(c => !c.client_id).length,
            ownerStats: {}, // owner_id removed - using client_id for multi-tenant
          };

          const dashboardData: DashboardData = {
            metrics,
            recentLeads: this.processRecentLeads(leads),
            recentCompanies: this.processRecentCompanies(companies),
            recentActivities: [], // Skip for performance
            companiesOverTime: this.generateCompaniesOverTime(companies),
            leadsAutomationOverTime:
              this.generateLeadsAutomationOverTime(leads),
          };

          // Cache the result for 5 minutes
          monitor.setCache(cacheKey, dashboardData, 300000);

          console.log('✅ Dashboard data fetched successfully:', dashboardData);
          return dashboardData;
        },
        { component: 'DashboardService', action: 'getDashboardData' },
        this.getDefaultDashboardData()
      ) || this.getDefaultDashboardData()
    );
  }

  private static calculatePipelineBreakdown(
    leads: Record<string, unknown>[]
  ): Record<string, number> {
    const breakdown: Record<string, number> = {};
    leads.forEach(lead => {
      const stage = lead.status || 'Unassigned';
      breakdown[stage] = (breakdown[stage] || 0) + 1;
    });
    return breakdown;
  }

  // owner_id removed - using client_id for multi-tenant architecture
  // This method kept for interface compatibility but returns empty object

  private static processRecentLeads(
    data: Record<string, unknown>[]
  ): RecentLead[] {
    return data.map(lead => ({
      id: lead.id,
      first_name: lead.first_name,
      last_name: lead.last_name,
      email: lead.email,
      job_title: lead.job_title,
      company: lead.company,
      status: lead.status,
      created_at: lead.created_at,
      assigned_to: lead.owner_id || null,
      company_name: lead.company || null,
      company_logo_url: null, // Would need to join with companies table
      notes_count: 0, // Skip notes for performance
    }));
  }

  private static processRecentCompanies(
    data: Record<string, unknown>[]
  ): RecentCompany[] {
    return data.map(company => ({
      id: company.id,
      name: company.name,
      industry: company.industry,
      website: company.website,
      head_office: company.head_office,
      logo_url: company.logo_url,
      company_size: company.company_size,
      pipeline_stage: company.pipeline_stage,
      created_at: company.created_at,
      assigned_to: null, // owner_id removed - using client_id for multi-tenant
      notes_count: 0, // Skip notes for performance
    }));
  }

  private static generateCompaniesOverTime(
    companies: Record<string, unknown>[]
  ): Array<{ date: string; newCompanies: number; automatedCompanies: number }> {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => ({
      date,
      newCompanies: companies.filter(c => c.created_at.startsWith(date)).length,
      automatedCompanies: companies.filter(
        // automation_started_at field removed - using workflow_status from leads instead
        false
      ).length,
    }));
  }

  private static generateLeadsAutomationOverTime(
    leads: Record<string, unknown>[]
  ): Array<{
    date: string;
    leadsWithAutomation: number;
    automationActivity: number;
  }> {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => ({
      date,
      leadsWithAutomation: 0,
      automationActivity: leads.filter(
        l => l.enrichment_timestamp && l.enrichment_timestamp.startsWith(date)
      ).length,
    }));
  }

  private static getDefaultDashboardData(): DashboardData {
    return {
      metrics: {
        totalLeads: 0,
        totalCompanies: 0,
        leadsThisWeek: 0,
        companiesThisWeek: 0,
        activeAutomations: 0,
        automationSuccessRate: 0,
        pipelineBreakdown: {},
        favoriteLeads: 0,
        unassignedLeads: 0,
        unassignedCompanies: 0,
        ownerStats: {},
      },
      recentLeads: [],
      recentCompanies: [],
      recentActivities: [],
      companiesOverTime: [],
      leadsAutomationOverTime: [],
    };
  }
}
