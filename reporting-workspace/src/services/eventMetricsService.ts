import { FacebookAdsService, FacebookAdsMetrics } from './facebookAdsService';
import { GoogleAdsService, GoogleAdsMetrics } from './googleAdsService';
import { GoHighLevelService, GoHighLevelMetrics } from './goHighLevelService';
import { GoogleSheetsService, EventMetrics } from './googleSheetsService';

export interface EventLeadMetrics {
  // Cost per lead metrics
  facebookCostPerLead: number;
  googleCostPerLead: number;
  overallCostPerLead: number;
  
  // Lead quality metrics
  leadToOpportunityRate: number;
  opportunityToWinRate: number;
  averageEventValue: number;
  
  // Event-specific metrics
  averageGuestsPerEvent: number;
  mostPopularEventType: string;
  seasonalTrends: Array<{
    month: string;
    leads: number;
    events: number;
    revenue: number;
  }>;
  
  // Landing page performance
  landingPageConversionRate: number;
  formCompletionRate: number;
  
  // Attribution metrics
  leadSourceBreakdown: Array<{
    source: string;
    leads: number;
    cost: number;
    costPerLead: number;
    conversionRate: number;
    revenue: number;
    roi: number;
  }>;
}

export interface EventDashboardData {
  // Summary metrics
  totalLeads: number;
  totalSpend: number;
  totalRevenue: number;
  roi: number;
  
  // Platform-specific data
  facebookMetrics: FacebookAdsMetrics & { costPerLead: number };
  googleMetrics: GoogleAdsMetrics & { costPerLead: number };
  ghlMetrics: GoHighLevelMetrics;
  eventMetrics: EventMetrics;
  
  // Combined insights
  leadMetrics: EventLeadMetrics;
  
  // Time period
  dateRange: {
    start: string;
    end: string;
  };
}

export class EventMetricsService {
  static async getComprehensiveMetrics(
    clientId: string,
    dateRange: { start: string; end: string }
  ): Promise<EventDashboardData> {
    try {
      // Fetch data from all sources in parallel
      const [
        facebookMetrics,
        googleMetrics,
        ghlMetrics,
        eventMetrics
      ] = await Promise.all([
        this.getFacebookMetrics(dateRange),
        this.getGoogleMetrics(dateRange),
        this.getGHLMetrics(dateRange),
        this.getEventMetrics(dateRange)
      ]);

      // Calculate combined metrics
      const totalSpend = facebookMetrics.spend + googleMetrics.cost;
      const totalLeads = facebookMetrics.conversions + googleMetrics.conversions;
      const totalRevenue = ghlMetrics.totalRevenue;
      const roi = totalSpend > 0 ? (totalRevenue / totalSpend) : 0;

      // Calculate cost per lead
      const facebookCostPerLead = facebookMetrics.conversions > 0 
        ? facebookMetrics.spend / facebookMetrics.conversions 
        : 0;
      const googleCostPerLead = googleMetrics.conversions > 0 
        ? googleMetrics.cost / googleMetrics.conversions 
        : 0;
      const overallCostPerLead = totalLeads > 0 ? totalSpend / totalLeads : 0;

      // Build lead metrics
      const leadMetrics = this.calculateLeadMetrics(
        facebookMetrics,
        googleMetrics,
        ghlMetrics,
        eventMetrics,
        totalSpend,
        totalRevenue
      );

      return {
        totalLeads,
        totalSpend,
        totalRevenue,
        roi,
        facebookMetrics: { ...facebookMetrics, costPerLead: facebookCostPerLead },
        googleMetrics: { ...googleMetrics, costPerLead: googleCostPerLead },
        ghlMetrics,
        eventMetrics,
        leadMetrics,
        dateRange
      };
    } catch (error) {
      console.error('Error fetching comprehensive metrics:', error);
      throw error;
    }
  }

  private static async getFacebookMetrics(dateRange: { start: string; end: string }): Promise<FacebookAdsMetrics> {
    try {
      return await FacebookAdsService.getAccountMetrics(dateRange);
    } catch (error) {
      console.warn('Facebook metrics not available:', error);
      return this.getEmptyFacebookMetrics();
    }
  }

  private static async getGoogleMetrics(dateRange: { start: string; end: string }): Promise<GoogleAdsMetrics> {
    try {
      return await GoogleAdsService.getAccountMetrics(dateRange);
    } catch (error) {
      console.warn('Google Ads metrics not available:', error);
      return this.getEmptyGoogleMetrics();
    }
  }

  private static async getGHLMetrics(dateRange: { start: string; end: string }): Promise<GoHighLevelMetrics> {
    try {
      return await GoHighLevelService.getMetrics(dateRange);
    } catch (error) {
      console.warn('Go High Level metrics not available:', error);
      return this.getEmptyGHLMetrics();
    }
  }

  private static async getEventMetrics(dateRange: { start: string; end: string }): Promise<EventMetrics> {
    try {
      return await GoogleSheetsService.calculateMetrics(dateRange);
    } catch (error) {
      console.warn('Event metrics not available:', error);
      return this.getEmptyEventMetrics();
    }
  }

  private static calculateLeadMetrics(
    facebook: FacebookAdsMetrics,
    google: GoogleAdsMetrics,
    ghl: GoHighLevelMetrics,
    events: EventMetrics,
    totalSpend: number,
    totalRevenue: number
  ): EventLeadMetrics {
    const totalLeads = facebook.conversions + google.conversions;
    
    // Calculate cost per lead
    const facebookCostPerLead = facebook.conversions > 0 ? facebook.spend / facebook.conversions : 0;
    const googleCostPerLead = google.conversions > 0 ? google.cost / google.conversions : 0;
    const overallCostPerLead = totalLeads > 0 ? totalSpend / totalLeads : 0;

    // Calculate conversion rates
    const leadToOpportunityRate = ghl.totalContacts > 0 
      ? (ghl.totalOpportunities / ghl.totalContacts) * 100 
      : 0;
    const opportunityToWinRate = ghl.totalOpportunities > 0 
      ? (ghl.wonOpportunities / ghl.totalOpportunities) * 100 
      : 0;

    // Event-specific calculations
    const averageGuestsPerEvent = events.averageGuests;
    const mostPopularEventType = events.eventTypeBreakdown.length > 0 
      ? events.eventTypeBreakdown.reduce((prev, current) => 
          prev.count > current.count ? prev : current
        ).type
      : 'Unknown';

    // Landing page metrics (estimated from form completion vs traffic)
    const landingPageConversionRate = 2.5; // Would need actual landing page analytics
    const formCompletionRate = 85; // Would need form analytics

    // Lead source breakdown with ROI
    const leadSourceBreakdown = events.leadSourceBreakdown.map(source => {
      let cost = 0;
      let leads = source.count;
      
      // Attribute costs based on source
      if (source.source.toLowerCase().includes('facebook')) {
        cost = facebook.spend * (source.percentage / 100);
      } else if (source.source.toLowerCase().includes('google')) {
        cost = google.cost * (source.percentage / 100);
      }

      const costPerLead = leads > 0 ? cost / leads : 0;
      const revenue = leads * ghl.averageDealSize * (ghl.conversionRate / 100);
      const roi = cost > 0 ? (revenue / cost) : 0;

      return {
        source: source.source,
        leads,
        cost,
        costPerLead,
        conversionRate: source.percentage,
        revenue,
        roi
      };
    });

    // Seasonal trends from monthly data
    const seasonalTrends = events.monthlyTrends.map(month => ({
      month: month.month,
      leads: month.submissions,
      events: Math.round(month.submissions * (ghl.conversionRate / 100)),
      revenue: month.totalRevenue
    }));

    return {
      facebookCostPerLead,
      googleCostPerLead,
      overallCostPerLead,
      leadToOpportunityRate,
      opportunityToWinRate,
      averageEventValue: ghl.averageDealSize,
      averageGuestsPerEvent,
      mostPopularEventType,
      seasonalTrends,
      landingPageConversionRate,
      formCompletionRate,
      leadSourceBreakdown
    };
  }

  // Helper methods for empty metrics when services are not connected
  private static getEmptyFacebookMetrics(): FacebookAdsMetrics {
    return {
      impressions: 0,
      clicks: 0,
      spend: 0,
      conversions: 0,
      ctr: 0,
      cpc: 0,
      cpm: 0,
      roas: 0,
      reach: 0,
      frequency: 0
    };
  }

  private static getEmptyGoogleMetrics(): GoogleAdsMetrics {
    return {
      impressions: 0,
      clicks: 0,
      cost: 0,
      conversions: 0,
      ctr: 0,
      cpc: 0,
      conversionRate: 0,
      costPerConversion: 0,
      searchImpressionShare: 0,
      qualityScore: 0
    };
  }

  private static getEmptyGHLMetrics(): GoHighLevelMetrics {
    return {
      totalContacts: 0,
      newContacts: 0,
      totalOpportunities: 0,
      wonOpportunities: 0,
      lostOpportunities: 0,
      totalRevenue: 0,
      conversionRate: 0,
      averageDealSize: 0,
      pipelineValue: 0,
      appointmentsScheduled: 0,
      appointmentsCompleted: 0,
      emailsSent: 0,
      emailsOpened: 0,
      emailsClicked: 0,
      smsSent: 0,
      smsReplies: 0
    };
  }

  private static getEmptyEventMetrics(): EventMetrics {
    return {
      totalSubmissions: 0,
      averageGuests: 0,
      totalGuests: 0,
      eventTypeBreakdown: [],
      monthlyTrends: [],
      leadSourceBreakdown: [],
      budgetRanges: []
    };
  }

  // Utility method to get key insights for client reports
  static generateInsights(data: EventDashboardData): Array<{
    type: 'success' | 'warning' | 'info';
    title: string;
    description: string;
    metric?: string;
  }> {
    const insights = [];

    // ROI insights
    if (data.roi > 3) {
      insights.push({
        type: 'success' as const,
        title: 'Excellent ROI Performance',
        description: `Your campaigns are generating ${data.roi.toFixed(1)}x return on investment, well above industry average.`,
        metric: `${data.roi.toFixed(1)}x ROI`
      });
    } else if (data.roi < 2) {
      insights.push({
        type: 'warning' as const,
        title: 'ROI Below Target',
        description: 'Consider optimizing targeting and ad creative to improve return on investment.',
        metric: `${data.roi.toFixed(1)}x ROI`
      });
    }

    // Cost per lead insights
    const avgCPL = data.leadMetrics.overallCostPerLead;
    if (avgCPL > 0 && avgCPL < 50) {
      insights.push({
        type: 'success' as const,
        title: 'Low Cost Per Lead',
        description: 'Your cost per lead is excellent for the event planning industry.',
        metric: `$${avgCPL.toFixed(2)} CPL`
      });
    } else if (avgCPL > 100) {
      insights.push({
        type: 'warning' as const,
        title: 'High Cost Per Lead',
        description: 'Consider refining targeting or improving landing page conversion rates.',
        metric: `$${avgCPL.toFixed(2)} CPL`
      });
    }

    // Event type insights
    if (data.eventMetrics.eventTypeBreakdown.length > 0) {
      const topEvent = data.leadMetrics.mostPopularEventType;
      insights.push({
        type: 'info' as const,
        title: 'Most Popular Event Type',
        description: `${topEvent} events generate the most leads for your venue.`,
        metric: topEvent
      });
    }

    // Seasonal insights
    if (data.leadMetrics.seasonalTrends.length >= 3) {
      const recentTrends = data.leadMetrics.seasonalTrends.slice(-3);
      const isGrowing = recentTrends[2].leads > recentTrends[0].leads;
      
      insights.push({
        type: isGrowing ? 'success' as const : 'info' as const,
        title: isGrowing ? 'Growing Lead Volume' : 'Stable Lead Volume',
        description: isGrowing 
          ? 'Your lead generation is trending upward over the past quarter.'
          : 'Lead volume has remained consistent over the past quarter.',
        metric: `${recentTrends[2].leads} leads this month`
      });
    }

    return insights;
  }
}

