// Dynamic import to prevent initialization issues
// import { supabase } from '@/integrations/supabase/client';
import { subWeeks } from 'date-fns';

export interface DashboardMetrics {
  // Core Metrics (aligned with reporting)
  totalLeads: number;
  totalCompanies: number;

  // Activity Metrics
  leadsThisWeek: number;
  companiesThisWeek: number;

  // Automation Metrics
  activeAutomations: number;
  automationSuccessRate: number;

  // Pipeline Metrics
  pipelineBreakdown: Record<string, number>;

  // Assignment Metrics
  favoriteLeads: number;
  unassignedLeads: number;
  unassignedCompanies: number;
}

export interface RecentItem {
  id: string;
  name: string;
  created_at: string;
  assigned_to?: string | null;
  stage?: string | null;
  notes_count?: number;
}

export interface RecentLead extends RecentItem {
  email?: string | null;
  job_title?: string | null;
  company?: string | null;
  company_name?: string | null;
  company_logo_url?: string | null;
  reply_type?: 'interested' | 'not_interested' | 'maybe' | null;
  status?: string | null;
}

export interface RecentCompany extends RecentItem {
  industry?: string | null;
  website?: string | null;
  head_office?: string | null;
  logo_url?: string | null;
  employee_count?: number | null;
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
        leadsCount,
        companiesCount,
        leadsThisWeek,
        companiesThisWeek,
        recentLeadsData,
        recentCompaniesData,
        recentActivitiesData,
        pipelineData,
        automationData,
        favoritesData,
        unassignedLeadsData,
        unassignedCompaniesData,
        leadNotesData,
        companyNotesData,
      ] = await Promise.all([
        // Counts
        supabase.from('leads').select('*', { count: 'exact', head: true }),
        supabase.from('companies').select('*', { count: 'exact', head: true }),

        // This week counts
        supabase
          .from('leads')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', oneWeekAgo.toISOString()),
        supabase
          .from('companies')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', oneWeekAgo.toISOString()),

        // Recent items with notes count - fix the foreign key references
        supabase
          .from('leads')
          .select(
            `
          id,
          first_name,
          last_name,
          email,
          company,
          job_title,
          status,
          created_at,
          reply_type
        `
          )
          .order('created_at', { ascending: false })
          .limit(30),

        supabase
          .from('companies')
          .select(
            `
          id,
          name,
          industry,
          website,
          head_office,
          logo_url,
          company_size,
          created_at
        `
          )
          .order('created_at', { ascending: false })
          .limit(20),

        // Recent activities - using activity_log instead of interactions
        supabase
          .from('activity_log')
          .select(
            `
          id,
          activity_type,
          metadata,
          timestamp,
          lead_id
        `
          )
          .order('timestamp', { ascending: false })
          .limit(10),

        // Pipeline breakdown
        supabase.from('leads').select('status'),

        // Automation metrics - using workflow_status from leads
        supabase
          .from('leads')
          .select('workflow_status, status, company, created_at')
          .not('workflow_status', 'is', null),

        // Favorites and unassigned
        supabase
          .from('leads')
          .select('*', { count: 'exact', head: true })
          .eq('is_favourite', true),

        // Unassigned leads
        supabase
          .from('leads')
          .select('*', { count: 'exact', head: true })
          .is('owner_id', null),

        // Notes removed - using leads.notes field instead
        // Return empty arrays for compatibility
        Promise.resolve({ data: [], error: null }),
        Promise.resolve({ data: [], error: null }),
      ]);

      // Process pipeline breakdown
      const pipelineBreakdown: Record<string, number> = {};
      pipelineData.data?.forEach(lead => {
        const stage = lead.status || 'Unassigned';
        pipelineBreakdown[stage] = (pipelineBreakdown[stage] || 0) + 1;
      });

      // Calculate automation success rate based on companies with people automated
      const totalCompanies = companiesCount.count || 0;
      const uniqueCompaniesWithAutomation = new Set(
        automationData.data?.map(person => person.company_id).filter(Boolean)
      ).size;
      const automationSuccessRate =
        totalCompanies > 0
          ? Math.round((uniqueCompaniesWithAutomation / totalCompanies) * 100)
          : 0;

      const dashboardData: DashboardData = {
        metrics: {
          totalLeads: leadsCount.count || 0,
          totalCompanies: companiesCount.count || 0,
          leadsThisWeek: leadsThisWeek.count || 0,
          companiesThisWeek: companiesThisWeek.count || 0,
          activeAutomations: automationData.data?.length || 0,
          automationSuccessRate,
          pipelineBreakdown,
          favoriteLeads: favoritesData.count || 0,
          unassignedLeads: unassignedLeadsData.count || 0,
          unassignedCompanies: unassignedCompaniesData.count || 0,
        },
        recentLeads: this.processRecentLeads(
          recentLeadsData.data || [],
          [] // Notes table removed
        ),
        recentCompanies: this.processRecentCompanies(
          recentCompaniesData.data || [],
          [] // Notes table removed
        ),
        recentActivities: this.processRecentActivities(
          recentActivitiesData.data || []
        ),
        companiesOverTime: this.generateCompaniesAndAutomationOverTime(
          recentCompaniesData.data || [],
          automationData.data || []
        ),
        leadsAutomationOverTime: this.generateLeadsAutomationOverTime(
          automationData.data || []
        ),
      };

      console.log('Dashboard data fetched successfully:', dashboardData);
      return dashboardData;
    } catch (error) {
      console.error('Error fetching dashboard data:', error);

      // Return mock data on error
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
        },
        recentLeads: [],
        recentCompanies: [],
        recentActivities: [],
        companiesOverTime: [],
        leadsAutomationOverTime: [],
      };
    }
  }

  private static processRecentLeads(
    leads: Record<string, unknown>[],
    notes: Record<string, unknown>[]
  ): RecentLead[] {
    const notesCount = new Map<string, number>();
    notes.forEach(note => {
      const count = notesCount.get(note.entity_id) || 0;
      notesCount.set(note.entity_id, count + 1);
    });

    return leads.map(lead => {
      const fullName =
        `${lead.first_name || ''} ${lead.last_name || ''}`.trim() || 'Unknown';
      return {
        id: lead.id as string,
        name: fullName,
        email: (lead.email as string) || null,
        job_title: (lead.job_title as string) || null,
        company: (lead.company as string) || null,
        company_name: (lead.company as string) || null,
        company_logo_url: null,
        status: (lead.status as string) || null,
        created_at: lead.created_at as string,
        assigned_to: null,
        reply_type:
          (lead.reply_type as
            | 'interested'
            | 'not_interested'
            | 'maybe'
            | null) || null,
        notes_count: notesCount.get(lead.id as string) || 0,
      };
    });
  }

  private static processRecentCompanies(
    companies: Record<string, unknown>[],
    notes: Record<string, unknown>[]
  ): RecentCompany[] {
    const notesCount = new Map<string, number>();
    notes.forEach(note => {
      const count = notesCount.get(note.entity_id) || 0;
      notesCount.set(note.entity_id, count + 1);
    });

    return companies.map(company => ({
      id: company.id,
      name: company.name || 'Unknown Company',
      industry: company.industry || 'Unknown',
      website: company.website || '',
      head_office: company.head_office || null,
      logo_url: company.logo_url || '',
      employee_count: company.company_size || 0,
      stage: 'New', // Pipeline stages removed
      created_at: company.created_at,
      assigned_to: null,
      notes_count: notesCount.get(company.id) || 0,
    }));
  }

  private static processRecentActivities(
    activities: Record<string, unknown>[]
  ): Record<string, unknown>[] {
    return activities.map(activity => ({
      id: activity.id,
      type: activity.interaction_type || 'Unknown',
      description: activity.notes || 'No description',
      entityType: activity.entity_type || 'Unknown',
      entityId: activity.entity_id || '',
      created_at: activity.created_at,
      author: activity.author_id || 'Unknown',
    }));
  }

  private static generateCompaniesAndAutomationOverTime(
    companies: Record<string, unknown>[],
    automationData: Record<string, unknown>[]
  ): Array<{ date: string; newCompanies: number; automatedCompanies: number }> {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    // Count new companies by date
    const companiesByDate = companies.reduce(
      (acc, company) => {
        const date = new Date(company.created_at).toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    // Count unique companies automated by date (using workflow_status from leads)
    const automationByDate = automationData.reduce(
      (acc, lead) => {
        if (lead.workflow_status && lead.company) {
          const date = new Date(lead.created_at as string)
            .toISOString()
            .split('T')[0];
          if (!acc[date]) acc[date] = new Set();
          // Use company name as identifier since we don't have company_id in leads
          acc[date].add(lead.company as string);
        }
        return acc;
      },
      {} as Record<string, Set<string>>
    );

    let cumulativeNewCompanies = 0;
    const cumulativeAutomatedCompanies = new Set<string>();

    return last7Days.map(date => {
      cumulativeNewCompanies += companiesByDate[date] || 0;

      if (automationByDate[date]) {
        automationByDate[date].forEach(companyId =>
          cumulativeAutomatedCompanies.add(companyId)
        );
      }

      return {
        date,
        newCompanies: cumulativeNewCompanies,
        automatedCompanies: cumulativeAutomatedCompanies.size,
      };
    });
  }

  private static generateLeadsAutomationOverTime(
    automationData: Record<string, unknown>[]
  ): Array<{
    date: string;
    leadsWithAutomation: number;
    automationActivity: number;
  }> {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    // Count leads with automation started by date (using workflow_status from leads)
    const automationByDate = automationData.reduce(
      (acc, lead) => {
        if (lead.workflow_status) {
          const date = new Date(lead.created_at as string)
            .toISOString()
            .split('T')[0];
          acc[date] = (acc[date] || 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>
    );

    // Interactions table removed - no automation activity to count
    const activityByDate: Record<string, number> = {};

    let cumulativeLeadsWithAutomation = 0;

    return last7Days.map(date => {
      cumulativeLeadsWithAutomation += automationByDate[date] || 0;

      return {
        date,
        leadsWithAutomation: cumulativeLeadsWithAutomation,
        automationActivity: activityByDate[date] || 0,
      };
    });
  }
}
