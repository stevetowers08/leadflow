export interface GoogleAdsMetrics {
  impressions: number;
  clicks: number;
  cost: number;
  conversions: number;
  ctr: number;
  cpc: number;
  conversionRate: number;
  costPerConversion: number;
  searchImpressionShare: number;
  qualityScore: number;
}

export interface GoogleAdsCampaign {
  id: string;
  name: string;
  status: 'enabled' | 'paused' | 'removed';
  type: string;
  metrics: GoogleAdsMetrics;
  dateRange: {
    start: string;
    end: string;
  };
}

export class GoogleAdsService {
  private static accessToken: string | null = null;
  private static customerId: string | null = null;
  private static developerToken: string | null = null;

  static async authenticate(accessToken: string, customerId: string, developerToken: string): Promise<boolean> {
    try {
      // Validate credentials with Google Ads API
      const response = await fetch('https://googleads.googleapis.com/v14/customers:listAccessibleCustomers', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'developer-token': developerToken,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        this.accessToken = accessToken;
        this.customerId = customerId;
        this.developerToken = developerToken;
        return true;
      }
      return false;
    } catch (error) {
      console.error('Google Ads authentication failed:', error);
      return false;
    }
  }

  static async getCampaigns(dateRange?: { start: string; end: string }): Promise<GoogleAdsCampaign[]> {
    if (!this.accessToken || !this.customerId || !this.developerToken) {
      throw new Error('Google Ads not authenticated');
    }

    try {
      const query = `
        SELECT 
          campaign.id,
          campaign.name,
          campaign.status,
          campaign.advertising_channel_type,
          metrics.impressions,
          metrics.clicks,
          metrics.cost_micros,
          metrics.conversions,
          metrics.ctr,
          metrics.average_cpc,
          metrics.conversions_from_interactions_rate,
          metrics.cost_per_conversion,
          metrics.search_impression_share,
          metrics.quality_score
        FROM campaign 
        WHERE segments.date DURING ${dateRange ? `${dateRange.start.replace(/-/g, '')},${dateRange.end.replace(/-/g, '')}` : 'LAST_30_DAYS'}
      `;

      const response = await fetch(`https://googleads.googleapis.com/v14/customers/${this.customerId}/googleAds:search`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'developer-token': this.developerToken!,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query })
      });

      if (!response.ok) {
        throw new Error(`Google Ads API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      return (data.results || []).map((result: any) => ({
        id: result.campaign.id,
        name: result.campaign.name,
        status: result.campaign.status.toLowerCase(),
        type: result.campaign.advertisingChannelType,
        metrics: this.parseMetrics(result.metrics),
        dateRange: dateRange || { start: '', end: '' }
      }));
    } catch (error) {
      console.error('Error fetching Google Ads campaigns:', error);
      throw error;
    }
  }

  static async getAccountMetrics(dateRange?: { start: string; end: string }): Promise<GoogleAdsMetrics> {
    if (!this.accessToken || !this.customerId || !this.developerToken) {
      throw new Error('Google Ads not authenticated');
    }

    try {
      const query = `
        SELECT 
          metrics.impressions,
          metrics.clicks,
          metrics.cost_micros,
          metrics.conversions,
          metrics.ctr,
          metrics.average_cpc,
          metrics.conversions_from_interactions_rate,
          metrics.cost_per_conversion,
          metrics.search_impression_share,
          metrics.quality_score
        FROM customer 
        WHERE segments.date DURING ${dateRange ? `${dateRange.start.replace(/-/g, '')},${dateRange.end.replace(/-/g, '')}` : 'LAST_30_DAYS'}
      `;

      const response = await fetch(`https://googleads.googleapis.com/v14/customers/${this.customerId}/googleAds:search`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'developer-token': this.developerToken!,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query })
      });

      if (!response.ok) {
        throw new Error(`Google Ads API error: ${response.statusText}`);
      }

      const data = await response.json();
      return this.parseMetrics(data.results?.[0]?.metrics || {});
    } catch (error) {
      console.error('Error fetching Google Ads account metrics:', error);
      throw error;
    }
  }

  private static parseMetrics(metrics: any): GoogleAdsMetrics {
    return {
      impressions: parseInt(metrics.impressions || '0'),
      clicks: parseInt(metrics.clicks || '0'),
      cost: parseFloat(metrics.costMicros || '0') / 1000000, // Convert from micros
      conversions: parseFloat(metrics.conversions || '0'),
      ctr: parseFloat(metrics.ctr || '0') * 100, // Convert to percentage
      cpc: parseFloat(metrics.averageCpc || '0') / 1000000, // Convert from micros
      conversionRate: parseFloat(metrics.conversionsFromInteractionsRate || '0') * 100,
      costPerConversion: parseFloat(metrics.costPerConversion || '0') / 1000000,
      searchImpressionShare: parseFloat(metrics.searchImpressionShare || '0') * 100,
      qualityScore: parseFloat(metrics.qualityScore || '0')
    };
  }

  static disconnect(): void {
    this.accessToken = null;
    this.customerId = null;
    this.developerToken = null;
  }
}

