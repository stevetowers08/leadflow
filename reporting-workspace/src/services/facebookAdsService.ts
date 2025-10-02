export interface FacebookAdsMetrics {
  impressions: number;
  clicks: number;
  spend: number;
  conversions: number;
  ctr: number;
  cpc: number;
  cpm: number;
  roas: number;
  reach: number;
  frequency: number;
}

export interface FacebookAdsCampaign {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'archived';
  objective: string;
  metrics: FacebookAdsMetrics;
  dateRange: {
    start: string;
    end: string;
  };
}

export class FacebookAdsService {
  private static accessToken: string | null = null;
  private static adAccountId: string | null = null;

  static async authenticate(accessToken: string, adAccountId: string): Promise<boolean> {
    try {
      // Validate token with Facebook Graph API
      const response = await fetch(`https://graph.facebook.com/v18.0/me?access_token=${accessToken}`);
      
      if (response.ok) {
        this.accessToken = accessToken;
        this.adAccountId = adAccountId;
        return true;
      }
      return false;
    } catch (error) {
      console.error('Facebook Ads authentication failed:', error);
      return false;
    }
  }

  static async getCampaigns(dateRange?: { start: string; end: string }): Promise<FacebookAdsCampaign[]> {
    if (!this.accessToken || !this.adAccountId) {
      throw new Error('Facebook Ads not authenticated');
    }

    try {
      const fields = [
        'id',
        'name',
        'status',
        'objective',
        'insights{impressions,clicks,spend,actions,ctr,cpc,cpm,reach,frequency}'
      ].join(',');

      const params = new URLSearchParams({
        access_token: this.accessToken,
        fields,
        limit: '100'
      });

      if (dateRange) {
        params.append('time_range', JSON.stringify({
          since: dateRange.start,
          until: dateRange.end
        }));
      }

      const response = await fetch(
        `https://graph.facebook.com/v18.0/act_${this.adAccountId}/campaigns?${params}`
      );

      if (!response.ok) {
        throw new Error(`Facebook API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      return data.data.map((campaign: any) => ({
        id: campaign.id,
        name: campaign.name,
        status: campaign.status,
        objective: campaign.objective,
        metrics: this.parseMetrics(campaign.insights?.data?.[0] || {}),
        dateRange: dateRange || { start: '', end: '' }
      }));
    } catch (error) {
      console.error('Error fetching Facebook campaigns:', error);
      throw error;
    }
  }

  static async getAccountMetrics(dateRange?: { start: string; end: string }): Promise<FacebookAdsMetrics> {
    if (!this.accessToken || !this.adAccountId) {
      throw new Error('Facebook Ads not authenticated');
    }

    try {
      const fields = 'impressions,clicks,spend,actions,ctr,cpc,cpm,reach,frequency';
      const params = new URLSearchParams({
        access_token: this.accessToken,
        fields,
        level: 'account'
      });

      if (dateRange) {
        params.append('time_range', JSON.stringify({
          since: dateRange.start,
          until: dateRange.end
        }));
      }

      const response = await fetch(
        `https://graph.facebook.com/v18.0/act_${this.adAccountId}/insights?${params}`
      );

      if (!response.ok) {
        throw new Error(`Facebook API error: ${response.statusText}`);
      }

      const data = await response.json();
      return this.parseMetrics(data.data?.[0] || {});
    } catch (error) {
      console.error('Error fetching Facebook account metrics:', error);
      throw error;
    }
  }

  private static parseMetrics(insights: any): FacebookAdsMetrics {
    const conversions = insights.actions?.find((action: any) => 
      action.action_type === 'purchase' || action.action_type === 'lead'
    )?.value || 0;

    return {
      impressions: parseInt(insights.impressions || '0'),
      clicks: parseInt(insights.clicks || '0'),
      spend: parseFloat(insights.spend || '0'),
      conversions: parseInt(conversions),
      ctr: parseFloat(insights.ctr || '0'),
      cpc: parseFloat(insights.cpc || '0'),
      cpm: parseFloat(insights.cpm || '0'),
      roas: insights.spend > 0 ? (conversions * 50) / insights.spend : 0, // Assuming $50 per conversion
      reach: parseInt(insights.reach || '0'),
      frequency: parseFloat(insights.frequency || '0')
    };
  }

  static disconnect(): void {
    this.accessToken = null;
    this.adAccountId = null;
  }
}

