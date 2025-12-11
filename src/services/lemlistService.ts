/**
 * Lemlist API Service
 * 
 * PDR Section: Technical Specifications - Workflow Automation
 * Handles Lemlist OAuth and API integration for email campaigns
 */

interface LemlistCampaign {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'completed';
  emailCount: number;
  createdAt: string;
}

interface LemlistLead {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  campaignId: string;
  status: 'active' | 'paused' | 'completed';
}

interface LemlistApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

export class LemlistService {
  private apiKey: string | null = null;
  private baseUrl = 'https://api.lemlist.com/api';

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.NEXT_PUBLIC_LEMLIST_API_KEY || null;
  }

  /**
   * Set API key for authenticated requests
   */
  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }

  /**
   * Check if Lemlist is connected
   */
  isConnected(): boolean {
    return !!this.apiKey;
  }

  /**
   * Get Basic Auth header value
   * Lemlist uses Basic Authentication with API key as username and empty password
   */
  private getAuthHeader(): string {
    if (!this.apiKey) {
      throw new Error('Lemlist API key not configured');
    }
    // Encode API key as base64 for Basic Auth (format: apiKey:)
    const encoded = btoa(`${this.apiKey}:`);
    return `Basic ${encoded}`;
  }

  /**
   * Get all campaigns from Lemlist
   * API Reference: https://developer.lemlist.com/api-reference/endpoints/campaigns/get-campaign
   */
  async getCampaigns(): Promise<LemlistCampaign[]> {
    if (!this.apiKey) {
      throw new Error('Lemlist API key not configured');
    }

    try {
      const response = await fetch(`${this.baseUrl}/campaigns`, {
        method: 'GET',
        headers: {
          'Authorization': this.getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Lemlist API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      // Handle both array and object responses
      const campaigns = Array.isArray(data) ? data : (data.data || []);
      
      return campaigns.map((campaign: any) => ({
        id: campaign._id || campaign.id,
        name: campaign.name,
        status: campaign.status || 'active',
        emailCount: campaign.steps?.length || campaign.emailCount || 0,
        createdAt: campaign.createdAt || campaign.created_at,
      }));
    } catch (error) {
      console.error('Error fetching Lemlist campaigns:', error);
      throw error;
    }
  }

  /**
   * Add a lead to a Lemlist campaign
   */
  async addLeadToCampaign(
    campaignId: string,
    lead: {
      email: string;
      firstName?: string;
      lastName?: string;
      company?: string;
    }
  ): Promise<LemlistLead> {
    if (!this.apiKey) {
      throw new Error('Lemlist API key not configured');
    }

    try {
      const response = await fetch(`${this.baseUrl}/campaigns/${campaignId}/leads`, {
        method: 'POST',
        headers: {
          'Authorization': this.getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: lead.email,
          firstName: lead.firstName,
          lastName: lead.lastName,
          company: lead.company,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Lemlist API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      return {
        id: data._id,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        company: data.company,
        campaignId: campaignId,
        status: 'active',
      };
    } catch (error) {
      console.error('Error adding lead to Lemlist campaign:', error);
      throw error;
    }
  }

  /**
   * Get lead status from Lemlist
   */
  async getLeadStatus(campaignId: string, leadId: string): Promise<LemlistLead> {
    if (!this.apiKey) {
      throw new Error('Lemlist API key not configured');
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/campaigns/${campaignId}/leads/${leadId}`,
        {
          method: 'GET',
          headers: {
            'Authorization': this.getAuthHeader(),
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Lemlist API error: ${response.status}`);
      }

      const data = await response.json();
      return {
        id: data._id,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        company: data.company,
        campaignId: campaignId,
        status: data.status || 'active',
      };
    } catch (error) {
      console.error('Error fetching Lemlist lead status:', error);
      throw error;
    }
  }

  /**
   * Pause a lead's sequence in Lemlist
   */
  async pauseLead(campaignId: string, leadId: string): Promise<void> {
    if (!this.apiKey) {
      throw new Error('Lemlist API key not configured');
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/campaigns/${campaignId}/leads/${leadId}/pause`,
        {
          method: 'PUT',
          headers: {
            'Authorization': this.getAuthHeader(),
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Lemlist API error: ${response.status}`);
      }
    } catch (error) {
      console.error('Error pausing Lemlist lead:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const lemlistService = new LemlistService();

