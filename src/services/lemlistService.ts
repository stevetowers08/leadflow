/**
 * Lemlist API Service
 *
 * PDR Section: Technical Specifications - Workflow Automation
 * Handles Lemlist OAuth and API integration for email campaigns
 */

export interface LemlistCampaign {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'completed';
  emailCount: number;
  createdAt: string;
  description?: string;
}

export interface LemlistCampaignStats {
  total_sent: number;
  total_opened: number;
  total_clicked: number;
  total_replied: number;
  total_bounced: number;
  total_positive_replies: number;
}

export interface LemlistLeadActivity {
  opened?: boolean;
  openedAt?: string;
  clicked?: boolean;
  clickedAt?: string;
  replied?: boolean;
  repliedAt?: string;
  bounced?: boolean;
  bouncedAt?: string;
  unsubscribed?: boolean;
  unsubscribedAt?: string;
  lastActivityAt?: string;
}

export interface LemlistLead {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  campaignId: string;
  status: 'active' | 'paused' | 'completed' | 'pending';
  activity?: LemlistLeadActivity;
  // Raw data from API for debugging
  rawData?: Record<string, unknown>;
}

// Lemlist webhook event types
export const LEMLIST_EVENT_TYPES = {
  // Lead status events
  CONTACTED: 'contacted',
  HOOKED: 'hooked',
  ATTRACTED: 'attracted',
  WARMED: 'warmed',
  INTERESTED: 'interested',
  SKIPPED: 'skipped',
  NOT_INTERESTED: 'notInterested',

  // Email activity events
  EMAIL_SENT: 'emailsSent',
  EMAIL_OPENED: 'emailsOpened',
  EMAIL_CLICKED: 'emailsClicked',
  EMAIL_REPLIED: 'emailsReplied',
  EMAIL_BOUNCED: 'emailsBounced',
  EMAIL_SEND_FAILED: 'emailsSendFailed',
  EMAIL_FAILED: 'emailsFailed',
  EMAIL_UNSUBSCRIBED: 'emailsUnsubscribed',
  EMAIL_INTERESTED: 'emailsInterested',
  EMAIL_NOT_INTERESTED: 'emailsNotInterested',

  // LinkedIn events
  LINKEDIN_VISIT_DONE: 'linkedinVisitDone',
  LINKEDIN_VISIT_FAILED: 'linkedinVisitFailed',
  LINKEDIN_INVITE_DONE: 'linkedinInviteDone',
  LINKEDIN_INVITE_FAILED: 'linkedinInviteFailed',
  LINKEDIN_INVITE_ACCEPTED: 'linkedinInviteAccepted',
  LINKEDIN_REPLIED: 'linkedinReplied',
  LINKEDIN_SENT: 'linkedinSent',
  LINKEDIN_INTERESTED: 'linkedinInterested',
  LINKEDIN_NOT_INTERESTED: 'linkedinNotInterested',

  // Operational alerts
  CUSTOM_DOMAIN_ERRORS: 'customDomainErrors',
  CONNECTION_ISSUE: 'connectionIssue',
  SEND_LIMIT_REACHED: 'sendLimitReached',
  LEMWARM_PAUSED: 'lemwarmPaused',
  CAMPAIGN_COMPLETE: 'campaignComplete',
} as const;

export type LemlistEventType =
  (typeof LEMLIST_EVENT_TYPES)[keyof typeof LEMLIST_EVENT_TYPES];

export interface LemlistWebhookPayload {
  type: string;
  campaignId?: string;
  campaignName?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  lemlistCampaignId?: string;
  isFirst?: boolean;
  [key: string]: unknown;
}

export interface CreateWebhookParams {
  targetUrl: string;
  event?: LemlistEventType;
  campaignId?: string;
  isFirst?: boolean;
}

export interface LemlistWebhookResponse {
  hookId: string;
  targetUrl: string;
  event?: string;
  campaignId?: string;
  isFirst?: boolean;
}

interface LemlistApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

export class LemlistService {
  private apiKey: string | null = null;
  private lemlistEmail: string | null = null;
  private baseUrl = 'https://api.lemlist.com/api';
  private userId: string | null = null; // Store user ID for API route calls

  constructor(apiKey?: string, email?: string) {
    // Support both client-side (NEXT_PUBLIC_) and server-side env vars
    this.apiKey =
      apiKey ||
      process.env.NEXT_PUBLIC_LEMLIST_API_KEY ||
      process.env.LEMLIST_API_KEY ||
      null;
    this.lemlistEmail = email || process.env.LEMLIST_EMAIL || null;
  }

  /**
   * Set user ID for API route calls
   */
  setUserId(userId: string): void {
    this.userId = userId;
  }

  /**
   * Set API key for authenticated requests
   */
  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }

  /**
   * Set Lemlist email
   */
  setEmail(email: string): void {
    this.lemlistEmail = email;
  }

  /**
   * Get Lemlist email
   */
  getEmail(): string | null {
    return this.lemlistEmail;
  }

  /**
   * Check if Lemlist is connected
   */
  isConnected(): boolean {
    return !!this.apiKey;
  }

  /**
   * Get Basic Auth header value
   * Official format per Lemlist docs: :apiKey (empty username, API key as password)
   * Reference: https://developer.lemlist.com/api-reference/getting-started/authentication
   */
  private getAuthHeader(): string {
    if (!this.apiKey) {
      throw new Error('Lemlist API key not configured');
    }
    // Official format: :apiKey (colon before API key, empty username)
    // Both :apiKey and email:apiKey formats work, but :apiKey is the official format
    const encoded = btoa(`:${this.apiKey}`);
    return `Basic ${encoded}`;
  }

  /**
   * Fetch with timeout wrapper
   */
  private async fetchWithTimeout(
    url: string,
    options: RequestInit,
    timeout = 10000
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout: Lemlist API did not respond in time');
      }
      throw error;
    }
  }

  /**
   * Get campaign detail to fetch email count (steps)
   * Note: This is a separate call as list endpoint doesn't include steps
   */
  async getCampaignDetail(campaignId: string): Promise<{ emailCount: number }> {
    if (!this.apiKey) {
      throw new Error('Lemlist API key not configured');
    }

    try {
      const apiUrl = this.userId
        ? `/api/lemlist/campaigns/${campaignId}?userId=${encodeURIComponent(this.userId)}`
        : `${this.baseUrl}/campaigns/${campaignId}`;

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (!this.userId) {
        headers['Authorization'] = this.getAuthHeader();
      }

      const response = await this.fetchWithTimeout(
        apiUrl,
        {
          method: 'GET',
          headers,
        },
        10000
      );

      if (!response.ok) {
        return { emailCount: 0 };
      }

      const data = await response.json();
      // Count email senders (senders that have an email field)
      // This is a proxy for email count since Lemlist API doesn't provide steps in list endpoint
      interface LemlistSender {
        email?: string;
        [key: string]: unknown;
      }
      const emailSenders =
        (data.senders as LemlistSender[] | undefined)?.filter(s => s.email) ||
        [];
      return { emailCount: emailSenders.length };
    } catch (error) {
      return { emailCount: 0 };
    }
  }

  /**
   * Get all campaigns from Lemlist
   * API Reference: https://developer.lemlist.com/api-reference/endpoints/campaigns/get-campaign
   * Uses Next.js API route to avoid CORS issues
   */
  async getCampaigns(): Promise<LemlistCampaign[]> {
    if (!this.apiKey && !this.userId) {
      throw new Error('Lemlist API key not configured');
    }

    try {
      // Use API route to avoid CORS issues
      const apiUrl = this.userId
        ? `/api/lemlist/campaigns?userId=${encodeURIComponent(this.userId)}`
        : `${this.baseUrl}/campaigns`; // Fallback to direct call if no userId (server-side)

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      // Only add auth header if making direct API call (server-side)
      if (!this.userId) {
        headers['Authorization'] = this.getAuthHeader();
      }

      const response = await this.fetchWithTimeout(
        apiUrl,
        {
          method: 'GET',
          headers,
        },
        10000
      );

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: 'Unknown error' }));
        throw new Error(
          errorData.error || `Lemlist API error: ${response.status}`
        );
      }

      const data = await response.json();

      // Handle error response from API route
      if (data.error) {
        throw new Error(data.error);
      }

      // Handle both array and object responses
      // Lemlist API returns campaigns in different formats
      interface LemlistCampaignResponse {
        id?: string;
        name?: string;
        status?: string;
        campaignStatus?: string;
        [key: string]: unknown;
      }

      let campaigns: LemlistCampaignResponse[] = [];

      if (Array.isArray(data)) {
        campaigns = data as LemlistCampaignResponse[];
      } else if (
        data &&
        typeof data === 'object' &&
        'data' in data &&
        Array.isArray(data.data)
      ) {
        campaigns = data.data as LemlistCampaignResponse[];
      } else if (
        data &&
        typeof data === 'object' &&
        'campaigns' in data &&
        Array.isArray(data.campaigns)
      ) {
        campaigns = data.campaigns as LemlistCampaignResponse[];
      } else if (
        data &&
        typeof data === 'object' &&
        Object.keys(data).length > 0
      ) {
        // Sometimes it's an object with campaign IDs as keys
        campaigns = Object.values(data) as LemlistCampaignResponse[];
      }

      return campaigns.map((campaign: LemlistCampaignResponse) => {
        // Map status: "running" -> "active" to match our type
        let status = campaign.status || campaign.campaignStatus || 'paused';
        if (status === 'running') {
          status = 'active';
        }

        return {
          id: campaign._id || campaign.id || campaign.campaignId,
          name: campaign.name || campaign.campaignName,
          status: status as 'active' | 'paused' | 'completed',
          // Note: emailCount not available in list endpoint, will be 0 or fetched separately
          emailCount:
            campaign.steps?.length ||
            campaign.emailCount ||
            campaign.numberOfEmails ||
            0,
          createdAt:
            campaign.createdAt || campaign.created_at || campaign.dateCreated,
          description: campaign.description,
        };
      });
    } catch (error) {
      // Don't log network errors - they're expected during connection testing
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      const isNetworkError =
        errorMessage === 'Failed to fetch' ||
        errorMessage.includes('timeout') ||
        errorMessage.includes('network') ||
        errorMessage.includes('AbortError');

      if (!isNetworkError) {
        console.error('Error fetching Lemlist campaigns:', error);
      }
      throw error;
    }
  }

  /**
   * Add a lead to a Lemlist campaign
   * Uses Next.js API route to avoid CORS issues when called from frontend
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
    if (!this.apiKey && !this.userId) {
      throw new Error('Lemlist API key not configured');
    }

    try {
      // Use API route to avoid CORS issues when called from frontend
      const apiUrl = this.userId
        ? `/api/lemlist/campaigns/${campaignId}/leads?userId=${encodeURIComponent(this.userId)}`
        : `${this.baseUrl}/campaigns/${campaignId}/leads`; // Fallback to direct call if no userId (server-side)

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      // Only add auth header if making direct API call (server-side)
      if (!this.userId) {
        headers['Authorization'] = this.getAuthHeader();
      }

      const response = await this.fetchWithTimeout(
        apiUrl,
        {
          method: 'POST',
          headers,
          body: JSON.stringify({
            email: lead.email,
            firstName: lead.firstName,
            lastName: lead.lastName,
            company: lead.company,
          }),
        },
        10000
      );

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: 'Unknown error' }));
        throw new Error(
          errorData.error ||
            errorData.details ||
            `Lemlist API error: ${response.status}`
        );
      }

      const data = await response.json();
      return {
        id: data._id || data.id,
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
   * Bulk add leads to a Lemlist campaign
   * Adds up to 100 leads at a time (lemlist API limit)
   */
  async bulkAddLeadsToCampaign(
    campaignId: string,
    leads: Array<{
      email: string;
      firstName?: string;
      lastName?: string;
      company?: string;
    }>
  ): Promise<{
    success: number;
    failed: number;
    errors: Array<{ lead: unknown; error: string }>;
  }> {
    if (!this.apiKey) {
      throw new Error('Lemlist API key not configured');
    }

    if (leads.length === 0) {
      return { success: 0, failed: 0, errors: [] };
    }

    // Lemlist API processes one lead at a time, but we can batch the requests
    const batchSize = 10; // Process 10 at a time to avoid rate limits
    const results = {
      success: 0,
      failed: 0,
      errors: [] as Array<{ lead: unknown; error: string }>,
    };

    for (let i = 0; i < leads.length; i += batchSize) {
      const batch = leads.slice(i, i + batchSize);

      const batchPromises = batch.map(async lead => {
        try {
          await this.addLeadToCampaign(campaignId, lead);
          results.success++;
          return { success: true };
        } catch (error) {
          results.failed++;
          results.errors.push({
            lead,
            error: error instanceof Error ? error.message : 'Unknown error',
          });
          return { success: false, error };
        }
      });

      await Promise.all(batchPromises);

      // Small delay between batches to avoid rate limiting
      if (i + batchSize < leads.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    return results;
  }

  /**
   * Get lead by email from a Lemlist campaign
   * API Reference: https://developer.lemlist.com/api-reference/endpoints/leads/get-lead-by-email
   */
  async getLeadByEmail(
    campaignId: string,
    email: string
  ): Promise<LemlistLead | null> {
    if (!this.apiKey) {
      throw new Error('Lemlist API key not configured');
    }

    try {
      // Lemlist API uses email as the identifier in the URL
      const encodedEmail = encodeURIComponent(email);
      const response = await this.fetchWithTimeout(
        `${this.baseUrl}/campaigns/${campaignId}/leads/${encodedEmail}`,
        {
          method: 'GET',
          headers: {
            Authorization: this.getAuthHeader(),
            'Content-Type': 'application/json',
          },
        },
        10000
      );

      if (response.status === 404) {
        return null; // Lead not found
      }

      if (!response.ok) {
        throw new Error(`Lemlist API error: ${response.status}`);
      }

      const data = await response.json();
      return this.mapLemlistLeadData(data, campaignId);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      // Don't throw on 404 - lead just doesn't exist
      if (errorMessage.includes('404')) {
        return null;
      }
      console.error('Error fetching Lemlist lead by email:', error);
      throw error;
    }
  }

  /**
   * Get all leads from a Lemlist campaign with activity data
   * API Reference: https://developer.lemlist.com/api-reference/endpoints/campaigns/get-campaign-leads
   * Uses Next.js API route to avoid CORS issues when called from frontend
   */
  async getCampaignLeads(campaignId: string): Promise<LemlistLead[]> {
    if (!this.apiKey && !this.userId) {
      throw new Error('Lemlist API key not configured');
    }

    try {
      // Use API route to avoid CORS issues when called from frontend
      const apiUrl = this.userId
        ? `/api/lemlist/campaigns/${campaignId}/leads?userId=${encodeURIComponent(this.userId)}`
        : `${this.baseUrl}/campaigns/${campaignId}/leads`; // Fallback to direct call if no userId (server-side)

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      // Only add auth header if making direct API call (server-side)
      if (!this.userId) {
        headers['Authorization'] = this.getAuthHeader();
      }

      const response = await this.fetchWithTimeout(
        apiUrl,
        {
          method: 'GET',
          headers,
        },
        15000
      );

      // Handle rate limiting
      if (response.status === 429) {
        console.warn('Lemlist API rate limit reached');
        return [];
      }

      if (!response.ok) {
        // If no leads or campaign doesn't exist, return empty array (not an error)
        if (response.status === 404 || response.status === 400) {
          return [];
        }
        const errorData = await response
          .json()
          .catch(() => ({ error: 'Unknown error' }));
        throw new Error(
          errorData.error || `Lemlist API error: ${response.status}`
        );
      }

      const leads = await response.json();
      const leadsArray = Array.isArray(leads) ? leads : [];

      return leadsArray.map((lead: Record<string, unknown>) =>
        this.mapLemlistLeadData(lead, campaignId)
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      const isNetworkError =
        errorMessage === 'Failed to fetch' ||
        errorMessage.includes('timeout') ||
        errorMessage.includes('network') ||
        errorMessage.includes('AbortError') ||
        errorMessage.includes('CORS');

      if (!isNetworkError) {
        console.error('Error fetching Lemlist campaign leads:', error);
      }

      // Return empty array on error to prevent UI blocking
      return [];
    }
  }

  /**
   * Map raw Lemlist API lead data to our LemlistLead interface
   */
  private mapLemlistLeadData(
    data: Record<string, unknown>,
    campaignId: string
  ): LemlistLead {
    // Extract activity data
    const activity: LemlistLeadActivity = {
      opened: !!(data.openedAt || data.opened || data.isOpened),
      openedAt: this.extractTimestamp(data.openedAt),
      clicked: !!(data.clickedAt || data.clicked || data.isClicked),
      clickedAt: this.extractTimestamp(data.clickedAt),
      replied: !!(data.repliedAt || data.replied || data.isReplied),
      repliedAt: this.extractTimestamp(data.repliedAt),
      bounced: !!(data.bounced || data.bouncedAt || data.isBounced),
      bouncedAt: this.extractTimestamp(data.bouncedAt),
      unsubscribed: !!(
        data.unsubscribed ||
        data.unsubscribedAt ||
        data.isUnsubscribed
      ),
      unsubscribedAt: this.extractTimestamp(data.unsubscribedAt),
      lastActivityAt: this.extractTimestamp(
        data.lastActivityAt || data.lastActivity || data.updatedAt
      ),
    };

    // Determine status
    let status: LemlistLead['status'] = 'active';
    if (data.status) {
      const statusStr = String(data.status).toLowerCase();
      if (['paused', 'paused'].includes(statusStr)) {
        status = 'paused';
      } else if (['completed', 'finished', 'done'].includes(statusStr)) {
        status = 'completed';
      } else if (['pending', 'waiting'].includes(statusStr)) {
        status = 'pending';
      }
    }

    return {
      id: String(data._id || data.id || ''),
      email: String(data.email || ''),
      firstName: data.firstName ? String(data.firstName) : undefined,
      lastName: data.lastName ? String(data.lastName) : undefined,
      company: data.company ? String(data.company) : undefined,
      campaignId,
      status,
      activity,
      rawData: data,
    };
  }

  /**
   * Extract timestamp from various formats
   */
  private extractTimestamp(value: unknown): string | undefined {
    if (!value) return undefined;
    if (typeof value === 'string') return value;
    if (typeof value === 'number') {
      // Unix timestamp in seconds or milliseconds
      const date = value > 1e10 ? new Date(value) : new Date(value * 1000);
      return date.toISOString();
    }
    if (value instanceof Date) return value.toISOString();
    return undefined;
  }

  /**
   * Get lead status from Lemlist (by lead ID)
   */
  async getLeadStatus(
    campaignId: string,
    leadId: string
  ): Promise<LemlistLead> {
    if (!this.apiKey) {
      throw new Error('Lemlist API key not configured');
    }

    try {
      const response = await this.fetchWithTimeout(
        `${this.baseUrl}/campaigns/${campaignId}/leads/${leadId}`,
        {
          method: 'GET',
          headers: {
            Authorization: this.getAuthHeader(),
            'Content-Type': 'application/json',
          },
        },
        10000
      );

      if (!response.ok) {
        throw new Error(`Lemlist API error: ${response.status}`);
      }

      const data = await response.json();
      return this.mapLemlistLeadData(data, campaignId);
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
      const response = await this.fetchWithTimeout(
        `${this.baseUrl}/campaigns/${campaignId}/leads/${leadId}/pause`,
        {
          method: 'PUT',
          headers: {
            Authorization: this.getAuthHeader(),
            'Content-Type': 'application/json',
          },
        },
        10000
      );

      if (!response.ok) {
        throw new Error(`Lemlist API error: ${response.status}`);
      }
    } catch (error) {
      console.error('Error pausing Lemlist lead:', error);
      throw error;
    }
  }

  /**
   * Get campaign statistics by fetching leads and calculating metrics
   *
   * Best practices per official docs:
   * - Uses leads endpoint to calculate stats (no dedicated stats endpoint available)
   * - Implements proper error handling for rate limits and network issues
   * - Returns zero values on errors to prevent UI blocking
   * - Uses Next.js API route to avoid CORS issues when called from frontend
   *
   * Reference: https://developer.lemlist.com/api-reference/endpoints/campaigns
   */
  async getCampaignStats(campaignId: string): Promise<LemlistCampaignStats> {
    if (!this.apiKey && !this.userId) {
      throw new Error('Lemlist API key not configured');
    }

    try {
      // Fetch all leads for the campaign
      // Note: Lemlist API doesn't have a dedicated stats endpoint, so we calculate from leads
      // Use API route to avoid CORS issues when called from frontend
      const apiUrl = this.userId
        ? `/api/lemlist/campaigns/${campaignId}/leads?userId=${encodeURIComponent(this.userId)}`
        : `${this.baseUrl}/campaigns/${campaignId}/leads`; // Fallback to direct call if no userId (server-side)

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      // Only add auth header if making direct API call (server-side)
      if (!this.userId) {
        headers['Authorization'] = this.getAuthHeader();
      }

      const response = await this.fetchWithTimeout(
        apiUrl,
        {
          method: 'GET',
          headers,
        },
        15000
      );

      // Handle rate limiting (429) per best practices
      if (response.status === 429) {
        console.warn('Lemlist API rate limit reached, returning zero stats');
        return {
          total_sent: 0,
          total_opened: 0,
          total_clicked: 0,
          total_replied: 0,
          total_bounced: 0,
          total_positive_replies: 0,
        };
      }

      if (!response.ok) {
        // If no leads or campaign doesn't exist, return zeros (not an error)
        if (response.status === 404 || response.status === 400) {
          return {
            total_sent: 0,
            total_opened: 0,
            total_clicked: 0,
            total_replied: 0,
            total_bounced: 0,
            total_positive_replies: 0,
          };
        }
        const errorData = await response
          .json()
          .catch(() => ({ error: 'Unknown error' }));
        throw new Error(
          errorData.error || `Lemlist API error: ${response.status}`
        );
      }

      const leads = await response.json();
      const leadsArray = Array.isArray(leads) ? leads : [];

      // Calculate statistics from leads data
      const stats: LemlistCampaignStats = {
        total_sent: 0,
        total_opened: 0,
        total_clicked: 0,
        total_replied: 0,
        total_bounced: 0,
        total_positive_replies: 0,
      };

      for (const lead of leadsArray) {
        // Count sent (leads that have been processed, not pending)
        if (lead.status && lead.status !== 'pending') {
          stats.total_sent++;
        }

        // Count opened (leads with open tracking data)
        if (lead.openedAt || lead.opened || lead.isOpened) {
          stats.total_opened++;
        }

        // Count clicked (leads with click tracking data)
        if (lead.clickedAt || lead.clicked || lead.isClicked) {
          stats.total_clicked++;
        }

        // Count replied (leads with reply data)
        if (lead.repliedAt || lead.replied || lead.isReplied) {
          stats.total_replied++;
          // Positive replies (heuristic: if replied and not bounced)
          if (!lead.bounced && !lead.bouncedAt) {
            stats.total_positive_replies++;
          }
        }

        // Count bounced
        if (lead.bounced || lead.bouncedAt || lead.isBounced) {
          stats.total_bounced++;
        }
      }

      return stats;
    } catch (error) {
      // Best practice: Don't log network errors - they're expected during connection testing
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      const isNetworkError =
        errorMessage === 'Failed to fetch' ||
        errorMessage.includes('timeout') ||
        errorMessage.includes('network') ||
        errorMessage.includes('AbortError') ||
        errorMessage.includes('CORS');

      if (!isNetworkError) {
        console.error('Error fetching Lemlist campaign stats:', error);
      }

      // Return zeros on error to prevent UI blocking (best practice)
      return {
        total_sent: 0,
        total_opened: 0,
        total_clicked: 0,
        total_replied: 0,
        total_bounced: 0,
        total_positive_replies: 0,
      };
    }
  }

  /**
   * Create a webhook subscription
   * API Reference: https://developer.lemlist.com/api-reference/endpoints/webhooks/add-webhook
   */
  async createWebhook(
    params: CreateWebhookParams
  ): Promise<LemlistWebhookResponse> {
    if (!this.apiKey) {
      throw new Error('Lemlist API key not configured');
    }

    try {
      const response = await this.fetchWithTimeout(
        `${this.baseUrl}/hooks`,
        {
          method: 'POST',
          headers: {
            Authorization: this.getAuthHeader(),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            targetUrl: params.targetUrl,
            event: params.event,
            campaignId: params.campaignId,
            isFirst: params.isFirst,
          }),
        },
        10000
      );

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: 'Unknown error' }));
        throw new Error(
          errorData.error || `Lemlist API error: ${response.status}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating Lemlist webhook:', error);
      throw error;
    }
  }

  /**
   * Delete a webhook subscription
   * API Reference: https://developer.lemlist.com/api-reference/endpoints/webhooks/delete-webhook
   */
  async deleteWebhook(hookId: string): Promise<void> {
    if (!this.apiKey) {
      throw new Error('Lemlist API key not configured');
    }

    try {
      const response = await this.fetchWithTimeout(
        `${this.baseUrl}/hooks/${hookId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: this.getAuthHeader(),
            'Content-Type': 'application/json',
          },
        },
        10000
      );

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: 'Unknown error' }));
        throw new Error(
          errorData.error || `Lemlist API error: ${response.status}`
        );
      }
    } catch (error) {
      console.error('Error deleting Lemlist webhook:', error);
      throw error;
    }
  }

  /**
   * List all webhooks
   * API Reference: https://developer.lemlist.com/api-reference/endpoints/webhooks/list-webhooks
   */
  async listWebhooks(): Promise<LemlistWebhookResponse[]> {
    if (!this.apiKey) {
      throw new Error('Lemlist API key not configured');
    }

    try {
      const response = await this.fetchWithTimeout(
        `${this.baseUrl}/hooks`,
        {
          method: 'GET',
          headers: {
            Authorization: this.getAuthHeader(),
            'Content-Type': 'application/json',
          },
        },
        10000
      );

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: 'Unknown error' }));
        throw new Error(
          errorData.error || `Lemlist API error: ${response.status}`
        );
      }

      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error listing Lemlist webhooks:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const lemlistService = new LemlistService();
