/**
 * Reporting Service - Real Data Integration
 *
 * Provides comprehensive reporting data from actual database tables
 * Replaces hardcoded values with real metrics and analytics
 */

import { supabase } from '@/integrations/supabase/client';
import { getErrorMessage, logSupabaseError } from '@/lib/utils';

export interface ReportingMetrics {
  // Core counts
  totalPeople: number;
  totalCompanies: number;

  // Pipeline breakdowns
  peoplePipeline: {
    new: number;
    qualified: number;
    proceed: number;
    skip: number;
  };


  // Recent activity
  recentActivity: Array<{
    id: string;
    type: 'person_added' | 'company_added';
    description: string;
    timestamp: string;
    entityId?: string;
  }>;

  // Growth metrics
  growthMetrics: {
    peopleGrowth: number;
    companiesGrowth: number;
  };
}

export interface ReportingFilters {
  period: '7d' | '30d' | '90d';
  startDate?: string;
  endDate?: string;
}

export class ReportingService {
  /**
   * Get comprehensive reporting metrics
   */
  static async getReportingData(
    filters: ReportingFilters = { period: '30d' }
  ): Promise<ReportingMetrics> {
    const { startDate, endDate } = this.getDateRange(filters.period);

    try {
      // Execute all queries in parallel for better performance
      const [
        coreCounts,
        peoplePipeline,
        recentActivity,
        growthMetrics,
      ] = await Promise.all([
        this.getCoreCounts(),
        this.getPeoplePipeline(),
        this.getRecentActivity(startDate, endDate),
        this.getGrowthMetrics(startDate, endDate),
      ]);

      return {
        ...coreCounts,
        peoplePipeline,
        recentActivity,
        growthMetrics,
      };
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.error('[ReportingService] Error fetching reporting data:', {
        message: errorMessage,
        error,
        filters,
        stack: error instanceof Error ? error.stack : undefined,
      });
      throw new Error(`Failed to fetch reporting data: ${errorMessage}`);
    }
  }

  /**
   * Get core entity counts
   */
  private static async getCoreCounts() {
    try {
      const [peopleResult, companiesResult] =
        await Promise.all([
          supabase.from('people').select('id', { count: 'exact', head: true }),
          supabase.from('companies').select('id', { count: 'exact', head: true }),
        ]);

      // Handle errors gracefully
      if (peopleResult.error) logSupabaseError(peopleResult.error, 'counting people');
      if (companiesResult.error) logSupabaseError(companiesResult.error, 'counting companies');

      return {
        totalPeople: peopleResult.count || 0,
        totalCompanies: companiesResult.count || 0,
      };
    } catch (error) {
      console.error('Error in getCoreCounts:', error);
      // Return zeros instead of throwing
      return {
        totalPeople: 0,
        totalCompanies: 0,
      };
    }
  }

  /**
   * Get people pipeline breakdown by stage
   */
  private static async getPeoplePipeline() {
    // Try both field names for compatibility
    const { data, error } = await supabase
      .from('people')
      .select('people_stage, stage');

    if (error) {
      console.error('Error fetching people pipeline:', error);
      // Return empty pipeline on error instead of throwing
      return { new: 0, qualified: 0, proceed: 0, skip: 0 };
    }

    const pipeline = {
      new: 0,
      qualified: 0,
      proceed: 0,
      skip: 0,
    };

    data?.forEach(person => {
      // Support both field names
      const stage = (person as any).stage || (person as any).people_stage;
      if (!stage) return;
      
      switch (stage) {
        case 'new':
        case 'new_lead':
          pipeline.new++;
          break;
        case 'qualified':
        case 'qualify':
          pipeline.qualified++;
          break;
        case 'proceed':
          pipeline.proceed++;
          break;
        case 'skip':
          pipeline.skip++;
          break;
      }
    });

    return pipeline;
  }


  /**
   * Get top job functions by count
   */
  private static async getTopJobFunctions() {
    const { data, error } = await supabase
      .from('jobs')
      .select('function')
      .not('function', 'is', null);

    if (error) throw error;

    const functionCounts = new Map<string, number>();

    data?.forEach(job => {
      if (job.function) {
        const count = functionCounts.get(job.function) || 0;
        functionCounts.set(job.function, count + 1);
      }
    });

    return Array.from(functionCounts.entries())
      .map(([functionName, count]) => ({ function: functionName, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  /**
   * Get top companies by job count
   */
  private static async getTopCompaniesByJobs() {
    // Get jobs with company_id
    const { data: jobsData, error: jobsError } = await supabase
      .from('jobs')
      .select('company_id')
      .not('company_id', 'is', null);

    if (jobsError) throw jobsError;

    // Get all companies
    const { data: companiesData, error: companiesError } = await supabase
      .from('companies')
      .select('id, name');

    if (companiesError) throw companiesError;

    // Create a map of company names
    const companyMap = new Map<string, string>();
    companiesData?.forEach(company => {
      companyMap.set(company.id, company.name);
    });

    const companyJobCounts = new Map<string, number>();

    jobsData?.forEach(job => {
      const companyName = companyMap.get(job.company_id) || 'Unknown Company';
      const count = companyJobCounts.get(companyName) || 0;
      companyJobCounts.set(companyName, count + 1);
    });

    return Array.from(companyJobCounts.entries())
      .map(([companyName, jobCount]) => ({ companyName, jobCount }))
      .sort((a, b) => b.jobCount - a.jobCount)
      .slice(0, 10);
  }

  /**
   * Get recent activity feed
   */
  private static async getRecentActivity(startDate: string, endDate: string) {
    const activities = [];

    // Get all companies for name mapping
    const { data: companiesData } = await supabase
      .from('companies')
      .select('id, name');

    const companyMap = new Map<string, string>();
    companiesData?.forEach(company => {
      companyMap.set(company.id, company.name);
    });

    // Recent people added
    const { data: recentPeople } = await supabase
      .from('people')
      .select('id, name, created_at, company_id')
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .order('created_at', { ascending: false })
      .limit(5);

    recentPeople?.forEach(person => {
      const companyName =
        companyMap.get(person.company_id) || 'Unknown Company';
      activities.push({
        id: `person-${person.id}`,
        type: 'person_added' as const,
        description: `New person added: ${person.name} at ${companyName}`,
        timestamp: person.created_at,
        entityId: person.id,
      });
    });

    // Sort by timestamp and return most recent
    return activities
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
      .slice(0, 10);
  }

  /**
   * Get growth metrics compared to previous period
   */
  private static async getGrowthMetrics(startDate: string, endDate: string) {
    const periodDays = this.getPeriodDays(startDate, endDate);
    const previousStartDate = new Date(
      new Date(startDate).getTime() - periodDays * 24 * 60 * 60 * 1000
    ).toISOString();
    const previousEndDate = new Date(
      new Date(endDate).getTime() - periodDays * 24 * 60 * 60 * 1000
    ).toISOString();

    const [currentCounts, previousCounts] = await Promise.all([
      this.getCoreCounts(),
      this.getCoreCountsForPeriod(previousStartDate, previousEndDate),
    ]);

    const peopleGrowth = this.calculateGrowthRate(
      currentCounts.totalPeople,
      previousCounts.totalPeople
    );
    const companiesGrowth = this.calculateGrowthRate(
      currentCounts.totalCompanies,
      previousCounts.totalCompanies
    );
    return {
      peopleGrowth,
      companiesGrowth,
    };
  }

  /**
   * Get core counts for a specific period
   */
  private static async getCoreCountsForPeriod(
    startDate: string,
    endDate: string
  ) {
    const [peopleResult, companiesResult] =
      await Promise.all([
        supabase
          .from('people')
          .select('id', { count: 'exact', head: true })
          .lte('created_at', endDate),
        supabase
          .from('companies')
          .select('id', { count: 'exact', head: true })
          .lte('created_at', endDate),
      ]);

    return {
      totalPeople: peopleResult.count || 0,
      totalCompanies: companiesResult.count || 0,
    };
  }

  /**
   * Calculate growth rate percentage
   */
  private static calculateGrowthRate(
    current: number,
    previous: number
  ): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  }

  /**
   * Get date range based on period
   */
  private static getDateRange(period: string): {
    startDate: string;
    endDate: string;
  } {
    const endDate = new Date();
    const startDate = new Date();

    switch (period) {
      case '7d':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(endDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(endDate.getDate() - 90);
        break;
      default:
        startDate.setDate(endDate.getDate() - 30);
    }

    return {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };
  }

  /**
   * Get period duration in days
   */
  private static getPeriodDays(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  }
}
