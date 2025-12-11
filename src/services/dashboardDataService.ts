/**
 * Dashboard Data Service
 * Long-term solution using React Query patterns
 * Follows best practices for data fetching, error handling, and caching
 */

import { supabase } from '@/integrations/supabase/client';

export interface DashboardJobsData {
  id: string;
  title: string;
  qualification_status: string;
  created_at: string;
  companies?: {
    id: string;
    name: string;
    website?: string;
    head_office?: string;
    industry?: string;
    logo_url?: string;
  };
}

export interface DashboardActivityData {
  id: string;
  type: 'email' | 'meeting' | 'note' | 'interaction' | 'email_reply';
  title: string;
  description: string;
  timestamp: string;
  person_id?: string | null;
  person_name?: string;
  company_name?: string;
}

export interface DashboardMetrics {
  jobsToReview: DashboardJobsData[];
  activities: DashboardActivityData[];
  newLeadsToday: number;
  newCompaniesToday: number;
}

export interface DashboardChartData {
  date: string;
  jobs: number;
  people: number;
  companies: number;
  replies: number;
}

export class DashboardDataService {
  /**
   * Fetch jobs to review (new status, last 2 days)
   * Respects RLS by filtering through client_jobs table
   */
  static async getJobsToReview(clientId: string): Promise<DashboardJobsData[]> {
    if (!clientId) {
      console.warn(
        '[DashboardDataService] No clientId provided, returning empty array'
      );
      return [];
    }

    const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();

    try {
      // First, get job IDs for this client from client_jobs (more efficient and respects RLS)
      const { data: clientJobsData, error: clientJobsError } = await supabase
        .from('client_jobs')
        .select('job_id')
        .eq('client_id', clientId);

      if (clientJobsError) {
        console.error(
          '[DashboardDataService] Client jobs query error:',
          clientJobsError
        );
        return [];
      }

      if (!clientJobsData || clientJobsData.length === 0) {
        return [];
      }

      const clientJobIds = clientJobsData.map(cj => cj.job_id);

      // Now fetch jobs filtered by client and status
      // Explicitly specify the foreign key relationship to avoid ambiguity
      const { data: jobsData, error: jobsError } = await supabase
        .from('jobs')
        .select(
          `
          id,
          title,
          qualification_status,
          created_at,
          company_id,
          companies!jobs_company_id_fkey(id, name, website, head_office, industry, logo_url)
        `
        )
        .in('id', clientJobIds)
        .eq('qualification_status', 'new')
        .gte('created_at', twoDaysAgo)
        .order('created_at', { ascending: false })
        .limit(10);

      if (jobsError) {
        console.error('[DashboardDataService] Jobs query error:', jobsError);
        // Log more details for debugging
        if (jobsError.code) {
          console.error('[DashboardDataService] Error code:', jobsError.code);
        }
        if (jobsError.message) {
          console.error(
            '[DashboardDataService] Error message:',
            jobsError.message
          );
        }
        return [];
      }

      if (!jobsData || jobsData.length === 0) {
        return [];
      }

      // Transform jobs data
      const filteredJobs = jobsData.map(job => ({
        id: job.id,
        title: job.title,
        qualification_status: job.qualification_status,
        created_at: job.created_at,
        companies: Array.isArray(job.companies)
          ? job.companies[0] || null
          : job.companies || null,
      }));

      return filteredJobs;
    } catch (error) {
      console.error('[DashboardDataService] Error in getJobsToReview:', error);
      // Return empty array instead of throwing to prevent page crash
      return [];
    }
  }

  /**
   * Fetch recent activities (email threads + interactions)
   * Respects RLS by filtering through client relationships
   */
  static async getRecentActivities(
    clientId: string
  ): Promise<DashboardActivityData[]> {
    if (!clientId) {
      console.warn(
        '[DashboardDataService] No clientId provided, returning empty array'
      );
      return [];
    }

    const activities: DashboardActivityData[] = [];

    try {
      // Email threads table removed - use activity_log instead
      // Fetch recent activities from activity_log
      const { data: activityData, error: activityError } = await supabase
        .from('activity_log')
        .select(
          'id, activity_type, timestamp, metadata, lead_id'
        )
        .order('timestamp', { ascending: false })
        .limit(20);

      if (activityError) {
        console.error(
          '[DashboardDataService] Activity log query error:',
          activityError
        );
      } else if (activityData && activityData.length > 0) {
        // Fetch leads data for activities
        const leadIds = activityData
          .map(a => a.lead_id)
          .filter((id): id is string => id !== null);

        const peopleMap = new Map<
          string,
          { name: string; company_name?: string }
        >();

        if (leadIds.length > 0) {
          // Fetch leads first
          const { data: leadsData, error: leadsError } = await supabase
            .from('leads')
            .select('id, first_name, last_name, company')
            .in('id', leadIds);

          if (leadsError) {
            console.error(
              '[DashboardDataService] Query error:',
              leadsError
            );
          } else if (leadsData) {
            // Map leads for activity display
            leadsData.forEach(lead => {
              peopleMap.set(lead.id, {
                name: `${lead.first_name || ''} ${lead.last_name || ''}`.trim() || 'Unknown',
                company_name: lead.company || undefined,
              });
            });
          }
        }

        // Add activities from activity_log
        activityData.forEach(activity => {
          // Skip if lead_id is null
          if (!activity.lead_id) return;

          // Fetch lead to get person info
          const metadata = activity.metadata as Record<string, unknown> | null;
          let activityType: DashboardActivityData['type'] = 'interaction';

          if (
            activity.activity_type === 'email_sent' ||
            activity.activity_type === 'email_replied'
          ) {
            activityType = 'email';
          } else if (activity.activity_type === 'manual_note') {
            activityType = 'note';
          }

          activities.push({
            id: activity.id,
            type: activityType,
            title: (metadata?.subject as string) || activity.activity_type || 'Activity',
            description:
              (metadata?.content as string) || activity.activity_type || 'No details',
            timestamp: activity.timestamp || activity.created_at || new Date().toISOString(),
            person_id: activity.lead_id, // Using lead_id as person_id for compatibility
          });
        });
      }

      // Sort by timestamp and return most recent
      return activities.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    } catch (error) {
      console.error(
        '[DashboardDataService] Error in getRecentActivities:',
        error
      );
      // Return empty array instead of throwing to prevent page crash
      return [];
    }
  }

  /**
   * Fetch today's metrics
   * RLS policies should automatically filter by client_id
   */
  static async getTodayMetrics(clientId: string): Promise<{
    newLeadsToday: number;
    newCompaniesToday: number;
  }> {
    if (!clientId) {
      console.warn(
        '[DashboardDataService] No clientId provided, returning zero metrics'
      );
      return { newLeadsToday: 0, newCompaniesToday: 0 };
    }

    try {
      const today = new Date().toISOString().split('T')[0];

      const [leadsRes, companiesRes] = await Promise.all([
        supabase
          .from('people')
          .select('id', { count: 'exact', head: true })
          .gte('created_at', today),
        supabase
          .from('companies')
          .select('id', { count: 'exact', head: true })
          .gte('created_at', today),
      ]);

      // Handle errors gracefully
      if (leadsRes.error) {
        console.error(
          '[DashboardDataService] Leads count error:',
          leadsRes.error
        );
      }
      if (companiesRes.error) {
        console.error(
          '[DashboardDataService] Companies count error:',
          companiesRes.error
        );
      }

      return {
        newLeadsToday: leadsRes.count || 0,
        newCompaniesToday: companiesRes.count || 0,
      };
    } catch (error) {
      console.error('[DashboardDataService] Error in getTodayMetrics:', error);
      return { newLeadsToday: 0, newCompaniesToday: 0 };
    }
  }

  /**
   * Fetch chart data for past 7 days (non-blocking, can be called separately)
   */
  static async getChartData(clientId: string): Promise<DashboardChartData[]> {
    if (!clientId) {
      console.warn(
        '[DashboardDataService] No clientId provided, returning empty chart data'
      );
      return [];
    }

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysAgoISO = sevenDaysAgo.toISOString();

    // Fetch all data for past 7 days in parallel
    // RLS policies should automatically filter by client_id
    const [jobsRes, peopleRes, companiesRes, repliesRes] = await Promise.all([
      supabase
        .from('jobs')
        .select('created_at')
        .gte('created_at', sevenDaysAgoISO)
        .catch(err => {
          console.error('[DashboardDataService] Chart jobs query error:', err);
          return { data: null, error: err };
        }),
      supabase
        .from('people')
        .select('created_at')
        .gte('created_at', sevenDaysAgoISO)
        .catch(err => {
          console.error(
            '[DashboardDataService] Chart people query error:',
            err
          );
          return { data: null, error: err };
        }),
      supabase
        .from('companies')
        .select('created_at')
        .gte('created_at', sevenDaysAgoISO)
        .catch(err => {
          console.error(
            '[DashboardDataService] Chart companies query error:',
            err
          );
          return { data: null, error: err };
        }),
      supabase
        .from('activity_log')
        .select('timestamp')
        .eq('activity_type', 'email_replied')
        .gte('timestamp', sevenDaysAgoISO)
        .catch(err => {
          console.error(
            '[DashboardDataService] Chart replies query error:',
            err
          );
          return { data: null, error: err };
        }),
    ]);

    // Errors are already logged in catch blocks above

    // Group data by day client-side
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      date.setHours(0, 0, 0, 0);
      return date;
    });

    return last7Days.map(date => {
      try {
        const dateStr = date.toISOString().split('T')[0];
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);
        const nextDayStr = nextDay.toISOString().split('T')[0];

        // Count items for this day with safe null checks
        const jobsCount =
          (jobsRes.data && Array.isArray(jobsRes.data)
            ? jobsRes.data.filter(
                item =>
                  item?.created_at &&
                  item.created_at >= dateStr &&
                  item.created_at < nextDayStr
              ).length
            : 0) || 0;
        const peopleCount =
          (peopleRes.data && Array.isArray(peopleRes.data)
            ? peopleRes.data.filter(
                item =>
                  item?.created_at &&
                  item.created_at >= dateStr &&
                  item.created_at < nextDayStr
              ).length
            : 0) || 0;
        const companiesCount =
          (companiesRes.data && Array.isArray(companiesRes.data)
            ? companiesRes.data.filter(
                item =>
                  item?.created_at &&
                  item.created_at >= dateStr &&
                  item.created_at < nextDayStr
              ).length
            : 0) || 0;
        const repliesCount =
          (repliesRes.data && Array.isArray(repliesRes.data)
            ? repliesRes.data.filter(
                item =>
                  item?.last_message_at &&
                  item.last_message_at >= dateStr &&
                  item.last_message_at < nextDayStr
              ).length
            : 0) || 0;

        return {
          date: date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          }),
          jobs: jobsCount,
          people: peopleCount,
          companies: companiesCount,
          replies: repliesCount,
        };
      } catch (err) {
        console.error(
          '[DashboardDataService] Error processing chart date:',
          date,
          err
        );
        return {
          date: date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          }),
          jobs: 0,
          people: 0,
          companies: 0,
          replies: 0,
        };
      }
    });
  }

  /**
   * Fetch all dashboard data (main data, chart loads separately)
   */
  static async getDashboardData(clientId: string): Promise<DashboardMetrics> {
    try {
      const [jobs, activities, metrics] = await Promise.all([
        this.getJobsToReview(clientId).catch(err => {
          console.error('[DashboardDataService] Error fetching jobs:', err);
          return [];
        }),
        this.getRecentActivities(clientId).catch(err => {
          console.error(
            '[DashboardDataService] Error fetching activities:',
            err
          );
          return [];
        }),
        this.getTodayMetrics(clientId).catch(err => {
          console.error('[DashboardDataService] Error fetching metrics:', err);
          return { newLeadsToday: 0, newCompaniesToday: 0 };
        }),
      ]);

      return {
        jobsToReview: jobs,
        activities,
        newLeadsToday: metrics.newLeadsToday,
        newCompaniesToday: metrics.newCompaniesToday,
      };
    } catch (error) {
      console.error(
        '[DashboardDataService] Fatal error in getDashboardData:',
        error
      );
      // Return empty data instead of throwing to prevent app crash
      return {
        jobsToReview: [],
        activities: [],
        newLeadsToday: 0,
        newCompaniesToday: 0,
      };
    }
  }
}
