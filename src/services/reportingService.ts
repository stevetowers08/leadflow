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
      const [coreCounts, peoplePipeline, recentActivity, growthMetrics] =
        await Promise.all([
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
      const [leadsResult, companiesResult] = await Promise.all([
        supabase.from('leads').select('id', { count: 'exact', head: true }),
        supabase.from('companies').select('id', { count: 'exact', head: true }),
      ]);

      // Handle errors gracefully
      if (leadsResult.error)
        logSupabaseError(leadsResult.error, 'counting leads');
      if (companiesResult.error)
        logSupabaseError(companiesResult.error, 'counting companies');

      return {
        totalPeople: leadsResult.count || 0,
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
   * Get leads pipeline breakdown by status
   */
  private static async getPeoplePipeline() {
    const { data, error } = await supabase.from('leads').select('status');

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

    data?.forEach(lead => {
      const stage = lead.status as string | undefined;
      if (!stage) return;

      switch (stage) {
        case 'processing':
          pipeline.new++;
          break;
        case 'replied_manual':
          pipeline.qualified++;
          break;
        case 'active':
          pipeline.proceed++;
          break;
        default:
          pipeline.skip++;
          break;
      }
    });

    return pipeline;
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

    // Recent leads added
    const { data: recentLeads } = await supabase
      .from('leads')
      .select('id, first_name, last_name, company, created_at, company_id')
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .order('created_at', { ascending: false })
      .limit(5);

    recentLeads?.forEach(lead => {
      const fullName =
        `${lead.first_name || ''} ${lead.last_name || ''}`.trim() || 'Unknown';
      const companyName =
        lead.company || companyMap.get(lead.company_id) || 'Unknown Company';
      activities.push({
        id: `lead-${lead.id}`,
        type: 'person_added' as const,
        description: `New lead added: ${fullName} at ${companyName}`,
        timestamp: lead.created_at,
        entityId: lead.id,
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
    const [leadsResult, companiesResult] = await Promise.all([
      supabase
        .from('leads')
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
