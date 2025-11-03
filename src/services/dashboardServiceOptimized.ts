// Ultra-optimized dashboard service with performance monitoring and caching
import { PerformanceMonitor, safeAsync } from '@/services/performanceService';
import { subWeeks } from 'date-fns';

export interface DashboardMetrics {
  totalPeople: number;
  totalCompanies: number;
  totalJobs: number;
  peopleThisWeek: number;
  companiesThisWeek: number;
  jobsThisWeek: number;
  activeAutomations: number;
  automationSuccessRate: number;
  pipelineBreakdown: Record<string, number>;
  favoritePeople: number;
  unassignedPeople: number;
  unassignedCompanies: number;
  ownerStats: Record<string, number>;
}

export interface RecentPerson {
  id: string;
  name: string;
  email_address?: string | null;
  company_role?: string | null;
  employee_location?: string | null;
  stage?: string | null;
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

export interface RecentJob {
  id: string;
  name: string; // Add missing name field
  title: string;
  location?: string | null;
  priority?: string | null;
  employment_type?: string | null;
  seniority_level?: string | null;
  created_at: string;
  assigned_to?: string | null;
  company_name?: string | null;
  company_logo_url?: string | null;
  company_website?: string | null;
  notes_count?: number;
  people_count?: number;
}

export interface DashboardData {
  metrics: DashboardMetrics;
  recentPeople: RecentPerson[];
  recentCompanies: RecentCompany[];
  recentJobs: RecentJob[];
  recentActivities: Array<{
    id: string;
    interaction_type: string;
    subject?: string | null;
    content?: string | null;
    occurred_at: string;
    person_name?: string | null;
    company_name?: string | null;
  }>;
  companiesOverTime: Array<{
    date: string;
    newCompanies: number;
    automatedCompanies: number;
  }>;
  peopleAutomationOverTime: Array<{
    date: string;
    peopleWithAutomation: number;
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
            // Query 1: Get people with company info (most important data)
            supabase
              .from('people')
              .select(
                `
              id, name, email_address, company_role, employee_location, people_stage, 
              score, owner_id, created_at, is_favourite, last_interaction_at,
              companies!left(name, logo_url, website)
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
              pipeline_stage, created_at, owner_id, automation_active, automation_started_at
            `
              )
              .order('created_at', { ascending: false })
              .limit(30),

            // Query 3: Get jobs with company info
            supabase
              .from('jobs')
              .select(
                `
              id, title, location, priority, employment_type, seniority_level, 
              created_at, owner_id, company_id,
              companies!left(name, logo_url, website)
            `
              )
              .order('created_at', { ascending: false })
              .limit(30),
          ]);

          const [peopleResult, companiesResult, jobsResult] =
            await Promise.race([dataPromise, timeoutPromise]);

          const people = peopleResult.data || [];
          const companies = companiesResult.data || [];
          const jobs = jobsResult.data || [];

          // Calculate metrics efficiently from existing data
          const metrics: DashboardMetrics = {
            totalPeople: people.length,
            totalCompanies: companies.length,
            totalJobs: jobs.length,
            peopleThisWeek: people.filter(
              p => new Date(p.created_at) >= oneWeekAgo
            ).length,
            companiesThisWeek: companies.filter(
              c => new Date(c.created_at) >= oneWeekAgo
            ).length,
            jobsThisWeek: jobs.filter(j => new Date(j.created_at) >= oneWeekAgo)
              .length,
            activeAutomations: companies.filter(c => c.automation_active)
              .length,
            automationSuccessRate:
              companies.length > 0
                ? Math.round(
                    (companies.filter(c => c.automation_active).length /
                      companies.length) *
                      100
                  )
                : 0,
            pipelineBreakdown: this.calculatePipelineBreakdown(people),
            favoritePeople: people.filter(p => p.is_favourite).length,
            unassignedPeople: people.filter(p => !p.owner_id).length,
            unassignedCompanies: companies.filter(c => !c.owner_id).length,
            ownerStats: this.calculateOwnerStats(people),
          };

          const dashboardData: DashboardData = {
            metrics,
            recentPeople: this.processRecentPeople(people),
            recentCompanies: this.processRecentCompanies(companies),
            recentJobs: this.processRecentJobs(jobs),
            recentActivities: [], // Skip for performance
            companiesOverTime: this.generateCompaniesOverTime(companies),
            peopleAutomationOverTime:
              this.generatePeopleAutomationOverTime(people),
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
    people: Record<string, unknown>[]
  ): Record<string, number> {
    const breakdown: Record<string, number> = {};
    people.forEach(person => {
      const stage = person.people_stage || 'Unassigned';
      breakdown[stage] = (breakdown[stage] || 0) + 1;
    });
    return breakdown;
  }

  private static calculateOwnerStats(
    people: Record<string, unknown>[]
  ): Record<string, number> {
    const stats: Record<string, number> = {};
    people.forEach(person => {
      if (person.owner_id) {
        stats[person.owner_id] = (stats[person.owner_id] || 0) + 1;
      }
    });
    return stats;
  }

  private static processRecentPeople(
    data: Record<string, unknown>[]
  ): RecentPerson[] {
    return data.map(person => ({
      id: person.id,
      name: person.name,
      email_address: person.email_address,
      company_role: person.company_role,
      employee_location: person.employee_location,
      stage: person.people_stage,
      created_at: person.created_at,
      assigned_to: person.owner_id,
      company_name: person.companies?.name || null,
      company_logo_url: person.companies?.logo_url || null,
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
      assigned_to: company.owner_id,
      notes_count: 0, // Skip notes for performance
    }));
  }

  private static processRecentJobs(
    data: Record<string, unknown>[]
  ): RecentJob[] {
    return data.map(job => ({
      id: job.id,
      name: job.title, // Use title as name for compatibility
      title: job.title,
      location: job.location,
      priority: job.priority,
      employment_type: job.employment_type,
      seniority_level: job.seniority_level,
      created_at: job.created_at,
      assigned_to: job.owner_id,
      company_name: job.companies?.name || null,
      company_logo_url: job.companies?.logo_url || null,
      company_website: job.companies?.website || null,
      notes_count: 0, // Skip notes for performance
      people_count: 0, // Skip people count for performance
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
        c => c.automation_started_at && c.automation_started_at.startsWith(date)
      ).length,
    }));
  }

  private static generatePeopleAutomationOverTime(
    people: Record<string, unknown>[]
  ): Array<{
    date: string;
    peopleWithAutomation: number;
    automationActivity: number;
  }> {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => ({
      date,
      peopleWithAutomation: 0,
      automationActivity: people.filter(
        p => p.last_interaction_at && p.last_interaction_at.startsWith(date)
      ).length,
    }));
  }

  private static getDefaultDashboardData(): DashboardData {
    return {
      metrics: {
        totalPeople: 0,
        totalCompanies: 0,
        totalJobs: 0,
        peopleThisWeek: 0,
        companiesThisWeek: 0,
        jobsThisWeek: 0,
        activeAutomations: 0,
        automationSuccessRate: 0,
        pipelineBreakdown: {},
        favoritePeople: 0,
        unassignedPeople: 0,
        unassignedCompanies: 0,
        ownerStats: {},
      },
      recentPeople: [],
      recentCompanies: [],
      recentJobs: [],
      recentActivities: [],
      companiesOverTime: [],
      peopleAutomationOverTime: [],
    };
  }
}
