// Dynamic import to prevent initialization issues
// import { supabase } from '@/integrations/supabase/client';
import { subDays, subWeeks, subMonths } from 'date-fns';

export interface DashboardMetrics {
  // Core Metrics (aligned with reporting)
  totalPeople: number;
  totalCompanies: number;
  totalJobs: number;
  
  // Activity Metrics
  peopleThisWeek: number;
  companiesThisWeek: number;
  jobsThisWeek: number;
  
  // Automation Metrics
  activeAutomations: number;
  automationSuccessRate: number;
  
  // Pipeline Metrics
  pipelineBreakdown: Record<string, number>;
  
  // Assignment Metrics
  favoritePeople: number;
  unassignedPeople: number;
  unassignedCompanies: number;
  
  // Owner Stats
  ownerStats: Record<string, number>;
}

export interface RecentItem {
  id: string;
  name: string;
  created_at: string;
  assigned_to?: string | null;
  stage?: string | null;
  notes_count?: number;
}

export interface RecentPerson extends RecentItem {
  email_address?: string | null;
  company_role?: string | null;
  employee_location?: string | null;
  company_name?: string | null;
  company_logo_url?: string | null;
}

export interface RecentCompany extends RecentItem {
  industry?: string | null;
  website?: string | null;
  logo_url?: string | null;
  employee_count?: number | null;
}

export interface RecentJob extends RecentItem {
  title: string;
  location?: string | null;
  priority?: string | null;
  company_name?: string | null;
  company_logo_url?: string | null;
  employment_type?: string | null;
  seniority_level?: string | null;
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
}

export class DashboardService {
  /**
   * Fetch comprehensive dashboard data
   */
  static async getDashboardData(userId?: string): Promise<DashboardData> {
    try {
      console.log('Fetching dashboard data...');
      
      // Dynamic import to prevent initialization issues
      const { supabase } = await import('@/integrations/supabase/client');
      
      // Calculate date ranges
      const oneWeekAgo = subWeeks(new Date(), 1);
      
      // Fetch all data in parallel
      const [
        peopleCount,
        companiesCount,
        jobsCount,
        peopleThisWeek,
        companiesThisWeek,
        jobsThisWeek,
        recentPeopleData,
        recentCompaniesData,
        recentJobsData,
        recentActivitiesData,
        pipelineData,
        automationData,
        favoritesData,
        unassignedPeopleData,
        unassignedCompaniesData,
        ownersData
      ] = await Promise.all([
        // Counts
        supabase.from('people').select('*', { count: 'exact', head: true }),
        supabase.from('companies').select('*', { count: 'exact', head: true }),
        supabase.from('jobs').select('*', { count: 'exact', head: true }),
        
        // This week counts
        supabase.from('people').select('*', { count: 'exact', head: true }).gte('created_at', oneWeekAgo.toISOString()),
        supabase.from('companies').select('*', { count: 'exact', head: true }).gte('created_at', oneWeekAgo.toISOString()),
        supabase.from('jobs').select('*', { count: 'exact', head: true }).gte('created_at', oneWeekAgo.toISOString()),
        
        // Recent items with notes count
        supabase.from('people').select(`
          id,
          name,
          email_address,
          company_role,
          employee_location,
          stage,
          created_at,
          assigned_to,
          companies(name, logo_url),
          notes(id)
        `).order('created_at', { ascending: false }).limit(30),
        
        supabase.from('companies').select(`
          id,
          name,
          industry,
          website,
          logo_url,
          employee_count,
          stage,
          created_at,
          assigned_to,
          notes(id)
        `).order('created_at', { ascending: false }).limit(6),
        
        supabase.from('jobs').select(`
          id,
          title,
          location,
          priority,
          employment_type,
          seniority_level,
          stage,
          created_at,
          assigned_to,
          companies(name, logo_url),
          notes(id)
        `).order('created_at', { ascending: false }).limit(6),
        
        // Recent activities
        supabase.from('interactions').select(`
          id,
          interaction_type,
          subject,
          content,
          occurred_at,
          people(name),
          companies(name)
        `).order('occurred_at', { ascending: false }).limit(10),
        
        // Pipeline breakdown
        supabase.from('people').select('stage'),
        
        // Automation metrics
        supabase.from('people').select('automation_status').not('automation_status', 'is', null),
        
        // Favorites and unassigned
        supabase.from('people').select('*', { count: 'exact', head: true }).eq('is_favorite', true),
        supabase.from('people').select('*', { count: 'exact', head: true }).is('assigned_to', null),
        supabase.from('companies').select('*', { count: 'exact', head: true }).is('assigned_to', null),
        
        // Owner stats
        supabase.from('people').select('assigned_to')
      ]);
      
      // Process pipeline breakdown
      const pipelineBreakdown: Record<string, number> = {};
      pipelineData.data?.forEach(person => {
        const stage = person.stage || 'Unassigned';
        pipelineBreakdown[stage] = (pipelineBreakdown[stage] || 0) + 1;
      });
      
      // Process owner stats
      const ownerStats: Record<string, number> = {};
      ownersData.data?.forEach(person => {
        if (person.assigned_to) {
          ownerStats[person.assigned_to] = (ownerStats[person.assigned_to] || 0) + 1;
        }
      });
      
      // Calculate automation success rate
      const totalAutomations = automationData.data?.length || 0;
      const successfulAutomations = automationData.data?.filter(
        p => p.automation_status === 'connected' || p.automation_status === 'replied'
      ).length || 0;
      const automationSuccessRate = totalAutomations > 0 ? (successfulAutomations / totalAutomations) * 100 : 0;
      
      // Process recent items with notes count
      const processRecentPeople = (data: any[]): RecentPerson[] => {
        return data.map(person => ({
          id: person.id,
          name: person.name,
          email_address: person.email_address,
          company_role: person.company_role,
          employee_location: person.employee_location,
          stage: person.stage,
          created_at: person.created_at,
          assigned_to: person.assigned_to,
          company_name: person.companies?.name || null,
          company_logo_url: person.companies?.logo_url || null,
          notes_count: person.notes?.length || 0
        }));
      };
      
      const processRecentCompanies = (data: any[]): RecentCompany[] => {
        return data.map(company => ({
          id: company.id,
          name: company.name,
          industry: company.industry,
          website: company.website,
          logo_url: company.logo_url,
          employee_count: company.employee_count,
          stage: company.stage,
          created_at: company.created_at,
          assigned_to: company.assigned_to,
          notes_count: company.notes?.length || 0
        }));
      };
      
      const processRecentJobs = (data: any[]): RecentJob[] => {
        return data.map(job => ({
          id: job.id,
          name: job.title, // Jobs use title as name
          title: job.title,
          location: job.location,
          priority: job.priority,
          employment_type: job.employment_type,
          seniority_level: job.seniority_level,
          stage: job.stage,
          created_at: job.created_at,
          assigned_to: job.assigned_to,
          company_name: job.companies?.name || null,
          company_logo_url: job.companies?.logo_url || null,
          notes_count: job.notes?.length || 0
        }));
      };
      
      const processRecentActivities = (data: any[]) => {
        return data.map(activity => ({
          id: activity.id,
          interaction_type: activity.interaction_type,
          subject: activity.subject,
          content: activity.content,
          occurred_at: activity.occurred_at,
          person_name: activity.people?.name || null,
          company_name: activity.companies?.name || null
        }));
      };
      
      const dashboardData: DashboardData = {
        metrics: {
          totalPeople: peopleCount.count || 0,
          totalCompanies: companiesCount.count || 0,
          totalJobs: jobsCount.count || 0,
          peopleThisWeek: peopleThisWeek.count || 0,
          companiesThisWeek: companiesThisWeek.count || 0,
          jobsThisWeek: jobsThisWeek.count || 0,
          activeAutomations: totalAutomations,
          automationSuccessRate,
          pipelineBreakdown,
          favoritePeople: favoritesData.count || 0,
          unassignedPeople: unassignedPeopleData.count || 0,
          unassignedCompanies: unassignedCompaniesData.count || 0,
          ownerStats
        },
        recentPeople: processRecentPeople(recentPeopleData.data || []),
        recentCompanies: processRecentCompanies(recentCompaniesData.data || []),
        recentJobs: processRecentJobs(recentJobsData.data || []),
        recentActivities: processRecentActivities(recentActivitiesData.data || [])
      };
      
      console.log('Dashboard data fetched successfully:', dashboardData);
      return dashboardData;
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      
      // Return mock data on error
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
          ownerStats: {}
        },
        recentPeople: [],
        recentCompanies: [],
        recentJobs: [],
        recentActivities: []
      };
    }
  };
}
