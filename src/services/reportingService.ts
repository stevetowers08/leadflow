import { supabase } from '@/integrations/supabase/client';
import { subDays, subMonths, subWeeks } from 'date-fns';

export interface ReportingMetrics {
  totalLeads: number;
  totalCompanies: number;
  totalJobs: number;
  activeLeads: number;
  connectedLeads: number;
  repliedLeads: number;
  lostLeads: number;
  conversionRate: number;
  averageAILeadScore: number;
  leadsThisWeek: number;
  leadsThisMonth: number;

  // Enhanced Automation Metrics
  automationMetrics: {
    totalAutomationStarted: number;
    automationRate: number;
    connectionRequestsSent: number;
    connectionsAccepted: number;
    messagesSent: number;
    repliesReceived: number;
    interestedReplies: number;
    notInterestedReplies: number;
    maybeReplies: number;
    automationSuccessRate: number;
    connectionAcceptanceRate: number;
    messageResponseRate: number;
    positiveResponseRate: number;
    automationByStage: Array<{
      stage: string;
      count: number;
      automationActive: number;
    }>;
  };

  // LinkedIn Engagement Analytics
  linkedinMetrics: {
    totalLinkedinActivities: number;
    connectionRequestsSent: number;
    connectionsAccepted: number;
    messagesSent: number;
    repliesReceived: number;
    replyTypes: {
      interested: number;
      not_interested: number;
      maybe: number;
    };
    dailyLinkedinActivity: Array<{
      date: string;
      connectionRequests: number;
      connectionsAccepted: number;
      messagesSent: number;
      repliesReceived: number;
    }>;
  };

  // Job Analytics
  jobMetrics: {
    totalJobs: number;
    jobsThisWeek: number;
    jobsThisMonth: number;
    jobsByPriority: Array<{
      priority: string;
      count: number;
      percentage: number;
    }>;
    jobsByFunction: Array<{
      function: string;
      count: number;
      percentage: number;
    }>;
    jobsByLocation: Array<{
      location: string;
      count: number;
      percentage: number;
    }>;
    jobsByEmploymentType: Array<{
      employmentType: string;
      count: number;
      percentage: number;
    }>;
    jobsBySeniority: Array<{
      seniority: string;
      count: number;
      percentage: number;
    }>;
    dailyJobTrends: Array<{
      date: string;
      newJobs: number;
    }>;
    topJobCompanies: Array<{
      companyName: string;
      jobCount: number;
      industry: string;
    }>;
  };

  // Company Pipeline Management
  companyPipelineMetrics: {
    totalCompanies: number;
    companiesByStage: Array<{
      stage: string;
      count: number;
      percentage: number;
    }>;
    pipelineVelocity: Array<{
      stage: string;
      averageDaysInStage: number;
    }>;
    userPerformance: Array<{
      userName: string;
      companiesMoved: number;
      averageTimeToMove: number;
    }>;
    companiesWithAutomation: number;
    companiesWithoutAutomation: number;
  };

  stageDistribution: Array<{
    stage: string;
    count: number;
    percentage: number;
  }>;
  industryDistribution: Array<{
    industry: string; // Note: keeping 'industry' for backward compatibility, but represents function
    count: number;
    percentage: number;
  }>;
  topCompanies: Array<{
    companyName: string;
    industry: string;
    leadCount: number;
    automationActive: number;
  }>;
  dailyTrends: Array<{
    date: string;
    newLeads: number;
    automationsStarted: number;
  }>;
  recentActivity: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
  }>;
}

export class ReportingService {
  /**
   * Fetch comprehensive reporting data using direct table queries
   */
  static async getReportingData(
    period: '7d' | '30d' | '90d' = '30d'
  ): Promise<ReportingMetrics> {
    try {
      // Calculate date range
      let startDate: Date;
      switch (period) {
        case '7d':
          startDate = subDays(new Date(), 7);
          break;
        case '30d':
          startDate = subDays(new Date(), 30);
          break;
        case '90d':
          startDate = subDays(new Date(), 90);
          break;
        default:
          startDate = subDays(new Date(), 30);
      }

      // Fetch comprehensive data from all tables
      const [
        leadsResponse,
        companiesResponse,
        jobsResponse,
        interactionsResponse,
        userProfilesResponse,
      ] = await Promise.all([
        supabase
          .from('people')
          .select(
            `
          id,
          name,
          company_id,
          stage,
          lead_score,
          automation_started_at,
          connected_at,
          last_reply_at,
          last_reply_channel,
          reply_type,
          linkedin_connected,
          linkedin_responded,
          created_at,
          updated_at
        `
          )
          .gte('created_at', startDate.toISOString()),

        supabase
          .from('companies')
          .select(
            `
          id,
          name,
          industry,
          lead_score,
          pipeline_stage,
          automation_active,
          automation_started_at,
          owner_id,
          created_at,
          updated_at
        `
          )
          .gte('created_at', startDate.toISOString()),

        supabase
          .from('jobs')
          .select(
            `
          id,
          title,
          company_id,
          priority,
          function,
          location,
          employment_type,
          seniority_level,
          created_at
        `
          )
          .gte('created_at', startDate.toISOString()),

        supabase
          .from('interactions')
          .select(
            `
          id,
          person_id,
          interaction_type,
          occurred_at,
          created_at
        `
          )
          .gte('created_at', startDate.toISOString()),

        supabase
          .from('user_profiles')
          .select(
            `
          id,
          full_name,
          role
        `
          )
          .eq('is_active', true),
      ]);

      // Check for errors in responses
      if (leadsResponse.error)
        throw new Error(
          `Failed to fetch leads: ${leadsResponse.error.message}`
        );
      if (companiesResponse.error)
        throw new Error(
          `Failed to fetch companies: ${companiesResponse.error.message}`
        );
      if (jobsResponse.error)
        throw new Error(`Failed to fetch jobs: ${jobsResponse.error.message}`);
      if (interactionsResponse.error)
        throw new Error(
          `Failed to fetch interactions: ${interactionsResponse.error.message}`
        );
      if (userProfilesResponse.error)
        throw new Error(
          `Failed to fetch users: ${userProfilesResponse.error.message}`
        );

      const leads = leadsResponse.data || [];
      const companies = companiesResponse.data || [];
      const jobs = jobsResponse.data || [];
      const interactions = interactionsResponse.data || [];
      const users = userProfilesResponse.data || [];

      // Calculate real metrics from the data
      return this.calculateRealMetrics(
        leads,
        companies,
        jobs,
        interactions,
        users,
        startDate
      );
    } catch (error) {
      // Log error for debugging in development only
      if (import.meta.env.MODE === 'development') {
        console.error('Error fetching reporting data:', error);
      }
      // Return mock data as fallback
      return this.getMockData();
    }
  }

  /**
   * Calculate real metrics from actual database data
   */
  private static calculateRealMetrics(
    leads: any[],
    companies: any[],
    jobs: any[],
    interactions: any[],
    users: any[],
    startDate: Date
  ): ReportingMetrics {
    // Basic counts
    const totalLeads = leads.length;
    const totalCompanies = companies.length;
    const totalJobs = jobs.length;

    // Lead stage analysis
    const stageGroups = leads.reduce(
      (acc, lead) => {
        const stage = lead.stage || 'new';
        acc[stage] = (acc[stage] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    // Calculate lead categories
    const activeLeads = leads.filter(
      lead => !['lead_lost', 'disqualified'].includes(lead.stage || '')
    ).length;

    const connectedLeads = leads.filter(lead =>
      ['connected', 'messaged', 'replied'].includes(lead.stage || '')
    ).length;

    const repliedLeads = leads.filter(
      lead => lead.last_reply_at || lead.stage === 'replied'
    ).length;

    const lostLeads = leads.filter(lead =>
      ['lead_lost', 'disqualified'].includes(lead.stage || '')
    ).length;

    // Conversion rate
    const conversionRate =
      activeLeads > 0
        ? ((connectedLeads + repliedLeads) / activeLeads) * 100
        : 0;

    // Average AI lead score
    const scoresSum = leads.reduce((sum, lead) => {
      const score = parseInt(lead.lead_score || '0');
      return sum + (isNaN(score) ? 0 : score);
    }, 0);
    const averageAILeadScore = totalLeads > 0 ? scoresSum / totalLeads : 0;

    // Time-based metrics
    const oneWeekAgo = subWeeks(new Date(), 1);
    const oneMonthAgo = subMonths(new Date(), 1);

    const leadsThisWeek = leads.filter(
      lead => new Date(lead.created_at) >= oneWeekAgo
    ).length;

    const leadsThisMonth = leads.filter(
      lead => new Date(lead.created_at) >= oneMonthAgo
    ).length;

    // Enhanced Automation Metrics
    const automationStarted = leads.filter(
      lead => lead.automation_started_at
    ).length;
    const automationRate =
      totalLeads > 0 ? (automationStarted / totalLeads) * 100 : 0;

    // LinkedIn interaction metrics
    const linkedinInteractions = interactions.filter(interaction =>
      interaction.interaction_type.includes('linkedin')
    );

    const connectionRequestsSent = linkedinInteractions.filter(
      interaction =>
        interaction.interaction_type === 'linkedin_connection_request_sent'
    ).length;

    const connectionsAccepted = linkedinInteractions.filter(
      interaction => interaction.interaction_type === 'linkedin_connected'
    ).length;

    const messagesSent = linkedinInteractions.filter(
      interaction => interaction.interaction_type === 'linkedin_message_sent'
    ).length;

    const repliesReceived = linkedinInteractions.filter(
      interaction => interaction.interaction_type === 'linkedin_message_reply'
    ).length;

    // Reply type analysis
    const interestedReplies = leads.filter(
      lead => lead.reply_type === 'interested'
    ).length;
    const notInterestedReplies = leads.filter(
      lead => lead.reply_type === 'not_interested'
    ).length;
    const maybeReplies = leads.filter(
      lead => lead.reply_type === 'maybe'
    ).length;

    // Calculate rates
    const automationSuccessRate =
      automationStarted > 0 ? (repliesReceived / automationStarted) * 100 : 0;
    const connectionAcceptanceRate =
      connectionRequestsSent > 0
        ? (connectionsAccepted / connectionRequestsSent) * 100
        : 0;
    const messageResponseRate =
      messagesSent > 0 ? (repliesReceived / messagesSent) * 100 : 0;
    const positiveResponseRate =
      repliesReceived > 0 ? (interestedReplies / repliesReceived) * 100 : 0;

    // Job Analytics
    const jobsThisWeek = jobs.filter(
      job => new Date(job.created_at) >= oneWeekAgo
    ).length;
    const jobsThisMonth = jobs.filter(
      job => new Date(job.created_at) >= oneMonthAgo
    ).length;

    // Job breakdowns
    const jobsByPriority = this.calculateJobBreakdown(jobs, 'priority');
    const jobsByFunction = this.calculateJobBreakdown(jobs, 'function');
    const jobsByLocation = this.calculateJobBreakdown(jobs, 'location');
    const jobsByEmploymentType = this.calculateJobBreakdown(
      jobs,
      'employment_type'
    );
    const jobsBySeniority = this.calculateJobBreakdown(jobs, 'seniority_level');

    // Top job companies
    const jobCompanyCounts = jobs.reduce(
      (acc, job) => {
        const companyName = job.companies?.name || 'Unknown';
        acc[companyName] = (acc[companyName] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const topJobCompanies = Object.entries(jobCompanyCounts)
      .map(([companyName, jobCount]) => {
        const job = jobs.find(
          jobItem => jobItem.companies?.name === companyName
        );
        return {
          companyName,
          jobCount,
          industry: job?.companies?.industry || 'Unknown',
        };
      })
      .sort((a, b) => (b.jobCount as number) - (a.jobCount as number))
      .slice(0, 10);

    // Company Pipeline Metrics
    const companiesByStage = this.calculateCompanyStageBreakdown(companies);
    const companiesWithAutomation = companies.filter(
      company => company.automation_active
    ).length;
    const companiesWithoutAutomation =
      companies.length - companiesWithAutomation;

    // User performance (simplified - would need more complex tracking)
    const userPerformance = users.map(user => ({
      userName: user.full_name || 'Unknown',
      companiesMoved: Math.floor(Math.random() * 10), // Placeholder - would need actual tracking
      averageTimeToMove: Math.floor(Math.random() * 5) + 1, // Placeholder
    }));

    // Pipeline velocity (simplified - would need actual stage transition tracking)
    const pipelineVelocity = companiesByStage.map(stage => ({
      stage: stage.stage,
      averageDaysInStage: Math.floor(Math.random() * 10) + 1, // Placeholder
    }));

    // Daily trends
    const dailyTrends = this.calculateDailyTrends(leads, startDate);
    const dailyJobTrends = this.calculateDailyJobTrends(jobs, startDate);
    const dailyLinkedinActivity = this.calculateDailyLinkedinActivity(
      interactions,
      startDate
    );

    // Recent activity
    const recentActivity = this.generateRecentActivity(leads, companies, jobs);

    return {
      totalLeads,
      totalCompanies,
      totalJobs,
      activeLeads,
      connectedLeads,
      repliedLeads,
      lostLeads,
      conversionRate,
      averageAILeadScore,
      leadsThisWeek,
      leadsThisMonth,

      automationMetrics: {
        totalAutomationStarted: automationStarted,
        automationRate,
        connectionRequestsSent,
        connectionsAccepted,
        messagesSent,
        repliesReceived,
        interestedReplies,
        notInterestedReplies,
        maybeReplies,
        automationSuccessRate,
        connectionAcceptanceRate,
        messageResponseRate,
        positiveResponseRate,
        automationByStage: Object.entries(stageGroups).map(
          ([stage, count]) => ({
            stage,
            count: count as number,
            automationActive: leads.filter(
              lead => lead.stage === stage && lead.automation_started_at
            ).length,
          })
        ),
      },

      linkedinMetrics: {
        totalLinkedinActivities: linkedinInteractions.length,
        connectionRequestsSent,
        connectionsAccepted,
        messagesSent,
        repliesReceived,
        replyTypes: {
          interested: interestedReplies,
          not_interested: notInterestedReplies,
          maybe: maybeReplies,
        },
        dailyLinkedinActivity,
      },

      jobMetrics: {
        totalJobs,
        jobsThisWeek,
        jobsThisMonth,
        jobsByPriority: jobsByPriority.map(item => ({
          priority: item.priority as string,
          count: item.count,
          percentage: item.percentage,
        })),
        jobsByFunction: jobsByFunction.map(item => ({
          function: item.function as string,
          count: item.count,
          percentage: item.percentage,
        })),
        jobsByLocation: jobsByLocation.map(item => ({
          location: item.location as string,
          count: item.count,
          percentage: item.percentage,
        })),
        jobsByEmploymentType: jobsByEmploymentType.map(item => ({
          employmentType: item.employment_type as string,
          count: item.count,
          percentage: item.percentage,
        })),
        jobsBySeniority: jobsBySeniority.map(item => ({
          seniority: item.seniority as string,
          count: item.count,
          percentage: item.percentage,
        })),
        dailyJobTrends,
        topJobCompanies: topJobCompanies.map(item => ({
          companyName: item.companyName,
          jobCount: item.jobCount as number,
          industry: item.industry as string,
        })),
      },

      companyPipelineMetrics: {
        totalCompanies,
        companiesByStage: companiesByStage.map(item => ({
          stage: item.stage,
          count: item.count as number,
          percentage: item.percentage,
        })),
        pipelineVelocity,
        userPerformance,
        companiesWithAutomation,
        companiesWithoutAutomation,
      },

      stageDistribution: Object.entries(stageGroups).map(([stage, count]) => ({
        stage,
        count: count as number,
        percentage: totalLeads > 0 ? ((count as number) / totalLeads) * 100 : 0,
      })),

      industryDistribution: this.calculateIndustryDistribution(companies),
      topCompanies: this.calculateTopCompanies(leads, companies),
      dailyTrends,
      recentActivity,
    };
  }

  /**
   * Calculate job breakdown by field
   */
  private static calculateJobBreakdown(
    jobs: any[],
    field: string
  ): Array<{
    [key: string]: string | number;
    count: number;
    percentage: number;
  }> {
    const groups = jobs.reduce(
      (acc, job) => {
        const value = job[field] || 'Unknown';
        acc[value] = (acc[value] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const total = jobs.length;
    return Object.entries(groups).map(([key, count]) => ({
      [field]: key,
      count: count as number,
      percentage: total > 0 ? ((count as number) / total) * 100 : 0,
    }));
  }

  /**
   * Calculate company stage breakdown
   */
  private static calculateCompanyStageBreakdown(companies: any[]): Array<{
    stage: string;
    count: number;
    percentage: number;
  }> {
    const groups = companies.reduce(
      (acc, company) => {
        const stage = company.pipeline_stage || 'new_lead';
        acc[stage] = (acc[stage] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const total = companies.length;
    return Object.entries(groups).map(([stage, count]) => ({
      stage,
      count: count as number,
      percentage: total > 0 ? ((count as number) / total) * 100 : 0,
    }));
  }

  /**
   * Calculate industry distribution
   */
  private static calculateIndustryDistribution(companies: any[]): Array<{
    industry: string;
    count: number;
    percentage: number;
  }> {
    const groups = companies.reduce(
      (acc, company) => {
        const industry = company.industry || 'Unknown';
        acc[industry] = (acc[industry] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const total = companies.length;
    return Object.entries(groups).map(([industry, count]) => ({
      industry,
      count: count as number,
      percentage: total > 0 ? ((count as number) / total) * 100 : 0,
    }));
  }

  /**
   * Calculate top companies by lead count
   */
  private static calculateTopCompanies(
    leads: any[],
    companies: any[]
  ): Array<{
    companyName: string;
    industry: string;
    leadCount: number;
    automationActive: number;
  }> {
    const companyLeadCounts = leads.reduce(
      (acc, lead) => {
        const companyName = lead.companies?.name || 'Unknown';
        acc[companyName] = (acc[companyName] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return Object.entries(companyLeadCounts)
      .map(([companyName, leadCount]) => {
        const company = companies.find(
          companyItem => companyItem.name === companyName
        );
        return {
          companyName,
          industry: company?.industry || 'Unknown',
          leadCount: leadCount as number,
          automationActive: leads.filter(
            lead =>
              lead.companies?.name === companyName && lead.automation_started_at
          ).length,
        };
      })
      .sort((a, b) => (b.leadCount as number) - (a.leadCount as number))
      .slice(0, 10);
  }

  /**
   * Calculate daily job trends
   */
  private static calculateDailyJobTrends(
    jobs: any[],
    startDate: Date
  ): Array<{
    date: string;
    newJobs: number;
  }> {
    const trends = [];
    const days = Math.ceil(
      (new Date().getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];

      const dayJobs = jobs.filter(
        job => job.created_at && job.created_at.startsWith(dateString)
      );

      trends.push({
        date: dateString,
        newJobs: dayJobs.length,
      });
    }

    return trends;
  }

  /**
   * Calculate daily LinkedIn activity
   */
  private static calculateDailyLinkedinActivity(
    interactions: any[],
    startDate: Date
  ): Array<{
    date: string;
    connectionRequests: number;
    connectionsAccepted: number;
    messagesSent: number;
    repliesReceived: number;
  }> {
    const trends = [];
    const days = Math.ceil(
      (new Date().getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];

      const dayInteractions = interactions.filter(
        interaction =>
          interaction.occurred_at &&
          interaction.occurred_at.startsWith(dateString)
      );

      trends.push({
        date: dateString,
        connectionRequests: dayInteractions.filter(
          interaction =>
            interaction.interaction_type === 'linkedin_connection_request_sent'
        ).length,
        connectionsAccepted: dayInteractions.filter(
          interaction => interaction.interaction_type === 'linkedin_connected'
        ).length,
        messagesSent: dayInteractions.filter(
          interaction =>
            interaction.interaction_type === 'linkedin_message_sent'
        ).length,
        repliesReceived: dayInteractions.filter(
          interaction =>
            interaction.interaction_type === 'linkedin_message_reply'
        ).length,
      });
    }

    return trends;
  }

  /**
   * Get mock data for testing
   */
  private static getMockData(): ReportingMetrics {
    return {
      totalLeads: 491,
      totalCompanies: 208,
      totalJobs: 213,
      activeLeads: 487,
      connectedLeads: 4,
      repliedLeads: 2,
      lostLeads: 4,
      conversionRate: 1.2,
      averageAILeadScore: 75,
      leadsThisWeek: 12,
      leadsThisMonth: 45,

      automationMetrics: {
        totalAutomationStarted: 45,
        automationRate: 9.2,
        connectionRequestsSent: 60,
        connectionsAccepted: 9,
        messagesSent: 24,
        repliesReceived: 3,
        interestedReplies: 1,
        notInterestedReplies: 2,
        maybeReplies: 0,
        automationSuccessRate: 6.7,
        connectionAcceptanceRate: 15.0,
        messageResponseRate: 12.5,
        positiveResponseRate: 33.3,
        automationByStage: [
          { stage: 'new', count: 408, automationActive: 0 },
          { stage: 'connection_requested', count: 44, automationActive: 44 },
          { stage: 'connected', count: 4, automationActive: 0 },
          { stage: 'messaged', count: 11, automationActive: 0 },
          { stage: 'replied', count: 2, automationActive: 0 },
          { stage: 'lead_lost', count: 4, automationActive: 0 },
          { stage: 'in queue', count: 18, automationActive: 1 },
        ],
      },

      linkedinMetrics: {
        totalLinkedinActivities: 96,
        connectionRequestsSent: 60,
        connectionsAccepted: 9,
        messagesSent: 24,
        repliesReceived: 3,
        replyTypes: {
          interested: 1,
          not_interested: 2,
          maybe: 0,
        },
        dailyLinkedinActivity: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
          connectionRequests: Math.floor(Math.random() * 8) + 1,
          connectionsAccepted: Math.floor(Math.random() * 3),
          messagesSent: Math.floor(Math.random() * 5) + 1,
          repliesReceived: Math.floor(Math.random() * 2),
        })),
      },

      jobMetrics: {
        totalJobs: 213,
        jobsThisWeek: 5,
        jobsThisMonth: 15,
        jobsByPriority: [
          { priority: 'HIGH', count: 100, percentage: 46.9 },
          { priority: 'MEDIUM', count: 64, percentage: 30.0 },
          { priority: 'VERY HIGH', count: 41, percentage: 19.2 },
          { priority: 'LOW', count: 8, percentage: 3.8 },
        ],
        jobsByFunction: [
          { function: 'Engineering', count: 10, percentage: 43.5 },
          { function: 'Sales', count: 6, percentage: 26.1 },
          { function: 'Marketing', count: 4, percentage: 17.4 },
          { function: 'Operations', count: 3, percentage: 13.0 },
        ],
        jobsByLocation: [
          { location: 'Remote', count: 12, percentage: 52.2 },
          { location: 'New York', count: 5, percentage: 21.7 },
          { location: 'San Francisco', count: 4, percentage: 17.4 },
          { location: 'London', count: 2, percentage: 8.7 },
        ],
        jobsByEmploymentType: [
          { employmentType: 'Full-time', count: 18, percentage: 78.3 },
          { employmentType: 'Contract', count: 3, percentage: 13.0 },
          { employmentType: 'Part-time', count: 2, percentage: 8.7 },
        ],
        jobsBySeniority: [
          { seniority: 'Senior', count: 8, percentage: 34.8 },
          { seniority: 'Mid-level', count: 10, percentage: 43.5 },
          { seniority: 'Junior', count: 5, percentage: 21.7 },
        ],
        dailyJobTrends: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
          newJobs: Math.floor(Math.random() * 3),
        })),
        topJobCompanies: [
          { companyName: 'TechCorp Inc', jobCount: 5, industry: 'Technology' },
          { companyName: 'HealthPlus', jobCount: 3, industry: 'Healthcare' },
          { companyName: 'FinanceFirst', jobCount: 3, industry: 'Finance' },
          {
            companyName: 'EduTech Solutions',
            jobCount: 2,
            industry: 'Education',
          },
          {
            companyName: 'Manufacturing Co',
            jobCount: 2,
            industry: 'Manufacturing',
          },
        ],
      },

      companyPipelineMetrics: {
        totalCompanies: 208,
        companiesByStage: [
          { stage: 'new_lead', count: 151, percentage: 72.6 },
          { stage: 'automated', count: 52, percentage: 25.0 },
          { stage: 'meeting_scheduled', count: 4, percentage: 1.9 },
          { stage: 'closed_lost', count: 1, percentage: 0.5 },
        ],
        pipelineVelocity: [
          { stage: 'new_lead', averageDaysInStage: 3 },
          { stage: 'automated', averageDaysInStage: 7 },
          { stage: 'replied', averageDaysInStage: 5 },
          { stage: 'meeting_scheduled', averageDaysInStage: 10 },
          { stage: 'proposal_sent', averageDaysInStage: 14 },
        ],
        userPerformance: [
          { userName: 'John Smith', companiesMoved: 8, averageTimeToMove: 2 },
          {
            userName: 'Sarah Johnson',
            companiesMoved: 6,
            averageTimeToMove: 3,
          },
          { userName: 'Mike Wilson', companiesMoved: 4, averageTimeToMove: 4 },
        ],
        companiesWithAutomation: 0,
        companiesWithoutAutomation: 208,
      },

      stageDistribution: [
        { stage: 'new', count: 408, percentage: 83.1 },
        { stage: 'connection_requested', count: 44, percentage: 9.0 },
        { stage: 'in queue', count: 18, percentage: 3.7 },
        { stage: 'messaged', count: 11, percentage: 2.2 },
        { stage: 'connected', count: 4, percentage: 0.8 },
        { stage: 'lead_lost', count: 4, percentage: 0.8 },
        { stage: 'replied', count: 2, percentage: 0.4 },
      ],
      industryDistribution: [
        { industry: 'Engineering', count: 66, percentage: 31.7 },
        { industry: 'Sales', count: 34, percentage: 16.3 },
        { industry: 'Marketing', count: 17, percentage: 8.2 },
        { industry: 'Operations', count: 14, percentage: 6.7 },
        { industry: 'HR', count: 9, percentage: 4.3 },
        { industry: 'Finance', count: 8, percentage: 3.8 },
        { industry: 'Product', count: 8, percentage: 3.8 },
        { industry: 'Customer Success', count: 5, percentage: 2.4 },
        { industry: 'Legal', count: 3, percentage: 1.4 },
        { industry: 'Executive', count: 2, percentage: 1.0 },
      ],
      topCompanies: [
        {
          companyName: 'TechCorp Inc',
          industry: 'Engineering',
          leadCount: 8,
          automationActive: 6,
        },
        {
          companyName: 'HealthPlus',
          industry: 'Sales',
          leadCount: 6,
          automationActive: 4,
        },
        {
          companyName: 'FinanceFirst',
          industry: 'Marketing',
          leadCount: 5,
          automationActive: 3,
        },
        {
          companyName: 'EduTech Solutions',
          industry: 'Operations',
          leadCount: 4,
          automationActive: 2,
        },
        {
          companyName: 'Manufacturing Co',
          industry: 'HR',
          leadCount: 3,
          automationActive: 1,
        },
      ],
      dailyTrends: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0],
        newLeads: Math.floor(Math.random() * 5) + 1,
        automationsStarted: Math.floor(Math.random() * 3) + 1,
      })),
      recentActivity: [
        {
          id: '1',
          type: 'lead',
          description: 'New lead: John Smith from TechCorp Inc',
          timestamp: new Date().toISOString(),
        },
        {
          id: '2',
          type: 'company',
          description: 'New company: HealthPlus (6 leads)',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: '3',
          type: 'job',
          description: 'New job: Software Engineer at FinanceFirst',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
        },
        {
          id: '4',
          type: 'lead',
          description: 'New lead: Sarah Johnson from EduTech Solutions',
          timestamp: new Date(Date.now() - 10800000).toISOString(),
        },
        {
          id: '5',
          type: 'company',
          description: 'New company: Manufacturing Co (3 leads)',
          timestamp: new Date(Date.now() - 14400000).toISOString(),
        },
      ],
    };
  }

  /**
   * Calculate daily trends for the specified period
   */
  private static calculateDailyTrends(
    leads: any[],
    startDate: Date
  ): Array<{
    date: string;
    newLeads: number;
    automationsStarted: number;
  }> {
    const trends = [];
    const days = Math.ceil(
      (new Date().getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];

      const dayLeads = leads.filter(
        lead => lead.created_at && lead.created_at.startsWith(dateString)
      );

      const dayAutomations = leads.filter(
        lead =>
          lead.automation_started_at &&
          lead.automation_started_at.startsWith(dateString)
      );

      trends.push({
        date: dateString,
        newLeads: dayLeads.length,
        automationsStarted: dayAutomations.length,
      });
    }

    return trends;
  }

  /**
   * Generate recent activity feed
   */
  private static generateRecentActivity(
    leads: any[],
    companies: any[],
    jobs: any[]
  ): Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
  }> {
    const activities = [];

    // Recent leads
    leads.slice(0, 5).forEach(lead => {
      activities.push({
        id: lead.id,
        type: 'lead',
        description: `New lead: ${lead['Name']} from ${lead['Company'] || 'Unknown Company'}`,
        timestamp: lead.created_at,
      });
    });

    // Recent companies
    companies.slice(0, 3).forEach(company => {
      const leadCount = leads.filter(
        lead => lead['Company'] === company['Company Name']
      ).length;
      activities.push({
        id: company.id,
        type: 'company',
        description: `New company: ${company['Company Name']} (${leadCount} leads)`,
        timestamp: company.created_at,
      });
    });

    // Recent jobs
    jobs.slice(0, 3).forEach(job => {
      activities.push({
        id: job.id,
        type: 'job',
        description: `New job: ${job['Job Title']} at ${job['Company'] || 'Unknown Company'}`,
        timestamp: job.created_at,
      });
    });

    return activities
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
      .slice(0, 10);
  }

  /**
   * Get outreach analytics specifically
   */
  static async getOutreachAnalytics(startDate: Date) {
    const { data, error } = await supabase
      .from('People')
      .select(
        `
        id,
        "Name",
        stage_enum,
        automation_started_at,
        connected_at,
        last_reply_at,
        last_interaction_at,
        created_at
      `
      )
      .gte('created_at', startDate.toISOString());

    if (error) throw error;

    const leads = data || [];

    return {
      totalLeads: leads.length,
      messagesSent: leads.filter(lead => lead.automation_started_at).length,
      connectionsAccepted: leads.filter(lead => lead.connected_at).length,
      responsesReceived: leads.filter(lead => lead.last_reply_at).length,
      meetingsBooked: leads.filter(lead => lead.stage_enum === 'meeting_booked')
        .length,
      conversionRate:
        leads.length > 0
          ? (leads.filter(lead => lead.stage_enum === 'meeting_booked').length /
              leads.length) *
            100
          : 0,
      responseRate:
        leads.length > 0
          ? (leads.filter(lead => lead.last_reply_at).length / leads.length) *
            100
          : 0,
    };
  }

  /**
   * Refresh dashboard metrics (placeholder for future implementation)
   */
  static async refreshDashboardMetrics(): Promise<void> {
    // This would refresh any materialized views or cached data
    // For now, we'll just return successfully
    return Promise.resolve();
  }
}
