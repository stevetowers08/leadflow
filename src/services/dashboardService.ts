// Dynamic import to prevent initialization issues
// import { supabase } from '@/integrations/supabase/client';
import { subWeeks } from 'date-fns';

export interface DashboardMetrics {
  // Core Metrics (aligned with reporting)
  totalPeople: number;
  totalCompanies: number;

  // Activity Metrics
  peopleThisWeek: number;
  companiesThisWeek: number;

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
  head_office?: string | null;
  logo_url?: string | null;
  employee_count?: number | null;
}

export interface DashboardData {
  metrics: DashboardMetrics;
  recentPeople: RecentPerson[];
  recentCompanies: RecentCompany[];
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
        peopleThisWeek,
        companiesThisWeek,
        recentPeopleData,
        recentCompaniesData,
        recentActivitiesData,
        pipelineData,
        automationData,
        favoritesData,
        unassignedPeopleData,
        unassignedCompaniesData,
        ownersData,
        personNotesData,
        companyNotesData,
      ] = await Promise.all([
        // Counts
        supabase.from('people').select('*', { count: 'exact', head: true }),
        supabase.from('companies').select('*', { count: 'exact', head: true }),

        // This week counts
        supabase
          .from('people')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', oneWeekAgo.toISOString()),
        supabase
          .from('companies')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', oneWeekAgo.toISOString()),

        // Recent items with notes count - fix the foreign key references
        supabase
          .from('people')
          .select(
            `
          id,
          name,
          email_address,
          company_role,
          employee_location,
          people_stage,
          created_at,
          owner_id,
          companies(name, logo_url)
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
          pipeline_stage,
          created_at,
          owner_id
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
        supabase.from('people').select('people_stage'),

        // Automation metrics - check for automation_started_at
        supabase
          .from('people')
          .select('automation_started_at, people_stage, company_id')
          .not('automation_started_at', 'is', null),

        // Favorites and unassigned
        supabase
          .from('people')
          .select('*', { count: 'exact', head: true })
          .eq('is_favourite', true),
        supabase
          .from('people')
          .select('*', { count: 'exact', head: true })
          .is('owner_id', null),
        supabase
          .from('companies')
          .select('*', { count: 'exact', head: true })
          .is('owner_id', null),

        // Owner stats
        supabase.from('people').select('owner_id'),

        // Notes removed - using leads.notes field instead
        // Return empty arrays for compatibility
        Promise.resolve({ data: [], error: null }),
        Promise.resolve({ data: [], error: null }),
      ]);

      // Process pipeline breakdown
      const pipelineBreakdown: Record<string, number> = {};
      pipelineData.data?.forEach(person => {
        const stage = person.people_stage || 'Unassigned';
        pipelineBreakdown[stage] = (pipelineBreakdown[stage] || 0) + 1;
      });

      // Process owner stats
      const ownerStats: Record<string, number> = {};
      ownersData.data?.forEach(person => {
        if (person.owner_id) {
          ownerStats[person.owner_id] = (ownerStats[person.owner_id] || 0) + 1;
        }
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
          totalPeople: peopleCount.count || 0,
          totalCompanies: companiesCount.count || 0,
          peopleThisWeek: peopleThisWeek.count || 0,
          companiesThisWeek: companiesThisWeek.count || 0,
          activeAutomations: automationData.data?.length || 0,
          automationSuccessRate,
          pipelineBreakdown,
          favoritePeople: favoritesData.count || 0,
          unassignedPeople: unassignedPeopleData.count || 0,
          unassignedCompanies: unassignedCompaniesData.count || 0,
          ownerStats,
        },
        recentPeople: this.processRecentPeople(
          recentPeopleData.data || [],
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
        peopleAutomationOverTime: this.generatePeopleAutomationOverTime(
          automationData.data || [],
          recentActivitiesData.data || []
        ),
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
          peopleThisWeek: 0,
          companiesThisWeek: 0,
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
        recentActivities: [],
        companiesOverTime: [],
        peopleAutomationOverTime: [],
      };
    }
  }

  private static processRecentPeople(
    people: Record<string, unknown>[],
    notes: Record<string, unknown>[]
  ): RecentPerson[] {
    const notesCount = new Map<string, number>();
    notes.forEach(note => {
      const count = notesCount.get(note.entity_id) || 0;
      notesCount.set(note.entity_id, count + 1);
    });

    return people.map(person => ({
      id: person.id,
      name: person.name || 'Unknown',
      email: person.email_address || '',
      role: person.company_role || 'Unknown Role',
      company: person.companies?.name || 'Unknown Company',
      companyLogo: person.companies?.logo_url || '',
      stage: person.people_stage || 'New',
      created_at: person.created_at,
      owner_id: person.owner_id,
      notes_count: notesCount.get(person.id) || 0,
    }));
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
      stage: company.pipeline_stage || 'New',
      created_at: company.created_at,
      assigned_to: company.owner_id,
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

    // Count unique companies automated by date
    const automationByDate = automationData.reduce(
      (acc, person) => {
        if (person.automation_started_at && person.company_id) {
          const date = new Date(person.automation_started_at)
            .toISOString()
            .split('T')[0];
          if (!acc[date]) acc[date] = new Set();
          acc[date].add(person.company_id);
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

  private static generatePeopleAutomationOverTime(
    automationData: Record<string, unknown>[],
    interactions: Record<string, unknown>[]
  ): Array<{
    date: string;
    peopleWithAutomation: number;
    automationActivity: number;
  }> {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    // Count people with automation started by date
    const automationByDate = automationData.reduce(
      (acc, person) => {
        if (person.automation_started_at) {
          const date = new Date(person.automation_started_at)
            .toISOString()
            .split('T')[0];
          acc[date] = (acc[date] || 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>
    );

    // Count automation activity (interactions) by date
    const activityByDate = interactions.reduce(
      (acc, interaction) => {
        const date = new Date(interaction.occurred_at)
          .toISOString()
          .split('T')[0];
        // Only count automation-related interactions
        if (interaction.interaction_type?.includes('linkedin')) {
          acc[date] = (acc[date] || 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>
    );

    let cumulativePeopleWithAutomation = 0;

    return last7Days.map(date => {
      cumulativePeopleWithAutomation += automationByDate[date] || 0;

      return {
        date,
        peopleWithAutomation: cumulativePeopleWithAutomation,
        automationActivity: activityByDate[date] || 0,
      };
    });
  }
}
