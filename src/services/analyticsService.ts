import { supabase } from '../integrations/supabase/client';

export interface ReplyAnalytics {
  status: string; // Changed from people_stage
  total_leads: number; // Changed from total_people
  total_replies: number;
  reply_rate_percent: number;
  interested_count: number;
  not_interested_count: number;
  maybe_count: number;
}

export interface ReplyIntentBreakdown {
  reply_type: 'interested' | 'not_interested' | 'maybe' | null;
  count: number;
  percentage: number;
}

export interface StageReplyAnalytics {
  stage: string;
  total_leads: number; // Changed from total_people
  total_replies: number;
  reply_rate_percent: number;
  intent_breakdown: ReplyIntentBreakdown[];
}

export interface OverallReplyMetrics {
  total_leads: number; // Changed from total_people
  total_replies: number;
  overall_reply_rate: number;
  interested_count: number;
  not_interested_count: number;
  maybe_count: number;
  interested_rate: number;
  not_interested_rate: number;
  maybe_rate: number;
}

export interface ReplyTrendData {
  date: string;
  replies_count: number;
  interested_count: number;
  not_interested_count: number;
  maybe_count: number;
}

export class AnalyticsService {
  /**
   * Get reply analytics by people stage
   */
  static async getReplyAnalyticsByStage(): Promise<ReplyAnalytics[]> {
    const { data, error } = await supabase.rpc('get_reply_analytics_by_stage');

    if (error) {
      console.error('Error fetching reply analytics by stage:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Get overall reply metrics across all people
   */
  static async getOverallReplyMetrics(): Promise<OverallReplyMetrics> {
    const { data, error } = await supabase.rpc('get_overall_reply_metrics');

    if (error) {
      console.error('Error fetching overall reply metrics:', error);
      throw error;
    }

    return (
      data || {
        total_leads: 0,
        total_replies: 0,
        overall_reply_rate: 0,
        interested_count: 0,
        not_interested_count: 0,
        maybe_count: 0,
        interested_rate: 0,
        not_interested_rate: 0,
        maybe_rate: 0,
      }
    );
  }

  /**
   * Get reply trends over time (last 30 days)
   */
  static async getReplyTrends(): Promise<ReplyTrendData[]> {
    const { data, error } = await supabase.rpc('get_reply_trends');

    if (error) {
      console.error('Error fetching reply trends:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Get reply analytics for a specific stage with detailed breakdown
   */
  static async getStageReplyAnalytics(
    stage: string
  ): Promise<StageReplyAnalytics | null> {
    const { data, error } = await supabase.rpc('get_stage_reply_analytics', {
      stage_name: stage,
    });

    if (error) {
      console.error('Error fetching stage reply analytics:', error);
      throw error;
    }

    return data || null;
  }

  /**
   * Get reply analytics for a specific person
   */
  static async getPersonReplyAnalytics(personId: string): Promise<{
    total_replies: number;
    last_reply_at: string | null;
    last_reply_type: string | null;
    reply_history: Array<{
      reply_type: string;
      reply_date: string;
      reply_message: string;
    }>;
  }> {
    const { data, error } = await supabase.rpc('get_person_reply_analytics', {
      person_id: personId,
    });

    if (error) {
      console.error('Error fetching person reply analytics:', error);
      throw error;
    }

    return (
      data || {
        total_replies: 0,
        last_reply_at: null,
        last_reply_type: null,
        reply_history: [],
      }
    );
  }

  /**
   * Get top performing stages by reply rate
   */
  static async getTopPerformingStages(
    limit: number = 5
  ): Promise<ReplyAnalytics[]> {
    const { data, error } = await supabase.rpc('get_top_performing_stages', {
      limit_count: limit,
    });

    if (error) {
      console.error('Error fetching top performing stages:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Get reply analytics summary for dashboard
   */
  static async getReplyAnalyticsSummary(): Promise<{
    overall: OverallReplyMetrics;
    by_stage: ReplyAnalytics[];
    trends: ReplyTrendData[];
    top_performing: ReplyAnalytics[];
  }> {
    try {
      const [overall, by_stage, trends, top_performing] = await Promise.all([
        this.getOverallReplyMetrics(),
        this.getReplyAnalyticsByStage(),
        this.getReplyTrends(),
        this.getTopPerformingStages(3),
      ]);

      return {
        overall,
        by_stage,
        trends,
        top_performing,
      };
    } catch (error) {
      console.error('Error fetching reply analytics summary:', error);
      throw error;
    }
  }
}
