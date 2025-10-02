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
  head_office?: string | null;
  logo_url?: string | null;
  employee_count?: number | null;
}

export interface RecentJob extends RecentItem {
  title: string;
  location?: string | null;
  priority?: string | null;
  company_name?: string | null;
  company_logo_url?: string | null;
  company_website?: string | null;
  employment_type?: string | null;
  seniority_level?: string | null;
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
  companiesOverTime: Array<{ date: string; newCompanies: number; automatedCompanies: number }>;
  peopleAutomationOverTime: Array<{ date: string; peopleWithAutomation: number; automationActivity: number }>;
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
        ownersData,
        personNotesData,
        companyNotesData,
        jobNotesData,
        peopleByCompanyData
      ] = await Promise.all([
        // Counts
        supabase.from('people').select('*', { count: 'exact', head: true }),
        supabase.from('companies').select('*', { count: 'exact', head: true }),
        supabase.from('jobs').select('*', { count: 'exact', head: true }),
        
        // This week counts
        supabase.from('people').select('*', { count: 'exact', head: true }).gte('created_at', oneWeekAgo.toISOString()),
        supabase.from('companies').select('*', { count: 'exact', head: true }).gte('created_at', oneWeekAgo.toISOString()),
        supabase.from('jobs').select('*', { count: 'exact', head: true }).gte('created_at', oneWeekAgo.toISOString()),
        
        // Recent items with notes count - fix the foreign key references
        supabase.from('people').select(`
          id,
          name,
          email_address,
          company_role,
          employee_location,
          stage,
          created_at,
          owner_id,
          companies(name, logo_url)
        `).order('created_at', { ascending: false }).limit(30),
        
        supabase.from('companies').select(`
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
        `).order('created_at', { ascending: false }).limit(20),
        
        supabase.from('jobs').select(`
          id,
          title,
          location,
          priority,
          employment_type,
          seniority_level,
          created_at,
          owner_id,
          company_id,
          companies(name, logo_url, website)
        `).order('created_at', { ascending: false }).limit(20),
        
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
        
        // Automation metrics - check for automation_started_at
        supabase.from('people').select('automation_started_at, stage, company_id').not('automation_started_at', 'is', null),
        
        // Favorites and unassigned
        supabase.from('people').select('*', { count: 'exact', head: true }).eq('is_favourite', true),
        supabase.from('people').select('*', { count: 'exact', head: true }).is('owner_id', null),
        supabase.from('companies').select('*', { count: 'exact', head: true }).is('owner_id', null),
        
        // Owner stats
        supabase.from('people').select('owner_id'),
        
        // Notes counts for recent items
        supabase.from('notes').select('entity_id, entity_type').eq('entity_type', 'person'),
        supabase.from('notes').select('entity_id, entity_type').eq('entity_type', 'company'),
        supabase.from('notes').select('entity_id, entity_type').eq('entity_type', 'job'),
        
        // People count per company for jobs
        supabase.from('people').select('company_id').not('company_id', 'is', null)
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
        if (person.owner_id) {
          ownerStats[person.owner_id] = (ownerStats[person.owner_id] || 0) + 1;
        }
      });
      
      // Calculate automation success rate based on companies with people automated
      const totalCompanies = companiesCount.count || 0;
      const uniqueCompaniesWithAutomation = new Set(automationData.data?.map(p => p.company_id).filter(Boolean)).size;
      const automationSuccessRate = totalCompanies > 0 ? Math.round((uniqueCompaniesWithAutomation / totalCompanies) * 100) : 0;
      
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
          assigned_to: person.owner_id,
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
          employee_count: company.company_size,
          stage: company.pipeline_stage,
          created_at: company.created_at,
          assigned_to: company.owner_id,
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
          stage: null, // Jobs don't have stages in the schema
          created_at: job.created_at,
          assigned_to: job.owner_id,
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
          activeAutomations: automationData.data?.length || 0,
          automationSuccessRate,
          pipelineBreakdown,
          favoritePeople: favoritesData.count || 0,
          unassignedPeople: unassignedPeopleData.count || 0,
          unassignedCompanies: unassignedCompaniesData.count || 0,
          ownerStats
        },
        recentPeople: this.processRecentPeople(recentPeopleData.data || [], personNotesData.data || []),
        recentCompanies: this.processRecentCompanies(recentCompaniesData.data || [], companyNotesData.data || []),
        recentJobs: this.processRecentJobs(recentJobsData.data || [], jobNotesData.data || [], peopleByCompanyData.data || []),
        recentActivities: this.processRecentActivities(recentActivitiesData.data || []),
        companiesOverTime: this.generateCompaniesAndAutomationOverTime(recentCompaniesData.data || [], automationData.data || []),
        peopleAutomationOverTime: this.generatePeopleAutomationOverTime(automationData.data || [], recentActivitiesData.data || [])
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
        recentActivities: [],
        companiesOverTime: [],
        peopleAutomationOverTime: []
      };
    }
  };

  private static processRecentPeople(people: any[], notes: any[]): RecentPerson[] {
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
      stage: person.stage || 'New',
      created_at: person.created_at,
      owner_id: person.owner_id,
      notes_count: notesCount.get(person.id) || 0
    }));
  }

  private static processRecentCompanies(companies: any[], notes: any[]): RecentCompany[] {
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
      notes_count: notesCount.get(company.id) || 0
    }));
  }

  private static processRecentJobs(jobs: any[], notes: any[], peopleByCompany: any[]): RecentJob[] {
    const notesCount = new Map<string, number>();
    notes.forEach(note => {
      const count = notesCount.get(note.entity_id) || 0;
      notesCount.set(note.entity_id, count + 1);
    });

    // Count people per company
    const peopleCountByCompany = new Map<string, number>();
    peopleByCompany.forEach(person => {
      const count = peopleCountByCompany.get(person.company_id) || 0;
      peopleCountByCompany.set(person.company_id, count + 1);
    });

    return jobs.map(job => ({
      id: job.id,
      name: job.title || 'Unknown Job',
      title: job.title || 'Unknown Job',
      location: job.location || 'Unknown',
      priority: job.priority || 'Medium',
      company_name: job.companies?.name || 'Unknown Company',
      company_logo_url: job.companies?.logo_url || '',
      company_website: job.companies?.website || null,
      employment_type: job.employment_type || 'Unknown',
      seniority_level: job.seniority_level || 'Unknown',
      created_at: job.created_at,
      assigned_to: job.owner_id,
      notes_count: notesCount.get(job.id) || 0,
      people_count: job.company_id ? (peopleCountByCompany.get(job.company_id) || 0) : 0
    }));
  }

  private static processRecentActivities(activities: any[]): any[] {
    return activities.map(activity => ({
      id: activity.id,
      type: activity.interaction_type || 'Unknown',
      description: activity.notes || 'No description',
      entityType: activity.entity_type || 'Unknown',
      entityId: activity.entity_id || '',
      created_at: activity.created_at,
      author: activity.author_id || 'Unknown'
    }));
  }

  private static generateCompaniesAndAutomationOverTime(companies: any[], automationData: any[]): Array<{ date: string; newCompanies: number; automatedCompanies: number }> {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    // Count new companies by date
    const companiesByDate = companies.reduce((acc, company) => {
      const date = new Date(company.created_at).toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Count unique companies automated by date
    const automationByDate = automationData.reduce((acc, person) => {
      if (person.automation_started_at && person.company_id) {
        const date = new Date(person.automation_started_at).toISOString().split('T')[0];
        if (!acc[date]) acc[date] = new Set();
        acc[date].add(person.company_id);
      }
      return acc;
    }, {} as Record<string, Set<string>>);

    let cumulativeNewCompanies = 0;
    let cumulativeAutomatedCompanies = new Set<string>();

    return last7Days.map(date => {
      cumulativeNewCompanies += companiesByDate[date] || 0;
      
      if (automationByDate[date]) {
        automationByDate[date].forEach(companyId => cumulativeAutomatedCompanies.add(companyId));
      }

      return { 
        date, 
        newCompanies: cumulativeNewCompanies,
        automatedCompanies: cumulativeAutomatedCompanies.size
      };
    });
  }

  private static generatePeopleAutomationOverTime(automationData: any[], interactions: any[]): Array<{ date: string; peopleWithAutomation: number; automationActivity: number }> {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    // Count people with automation started by date
    const automationByDate = automationData.reduce((acc, person) => {
      if (person.automation_started_at) {
        const date = new Date(person.automation_started_at).toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    // Count automation activity (interactions) by date
    const activityByDate = interactions.reduce((acc, interaction) => {
      const date = new Date(interaction.occurred_at).toISOString().split('T')[0];
      // Only count automation-related interactions
      if (interaction.interaction_type?.includes('linkedin')) {
        acc[date] = (acc[date] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    let cumulativePeopleWithAutomation = 0;

    return last7Days.map(date => {
      cumulativePeopleWithAutomation += automationByDate[date] || 0;
      
      return { 
        date, 
        peopleWithAutomation: cumulativePeopleWithAutomation,
        automationActivity: activityByDate[date] || 0
      };
    });
  }
}
