/**
 * Resend Email Service
 * Comprehensive service for Resend API integration
 */

import { Resend } from 'resend';
import crypto from 'crypto';

export interface ResendConfig {
  apiKey: string;
  baseUrl?: string;
}

export interface EmailDomain {
  id: string;
  name: string;
  status: 'pending' | 'verified' | 'failed';
  records: DNSRecord[];
  created_at: string;
}

export interface EmailDetails {
  id: string;
  to: string[];
  from: string;
  subject: string;
  html?: string;
  text?: string;
  created_at: string;
  status: 'sent' | 'delivered' | 'bounced' | 'complained';
}

export interface DomainAnalytics {
  sent: number;
  delivered: number;
  bounced: number;
  complained: number;
  opened: number;
  clicked: number;
}

export interface DNSRecord {
  type: 'TXT' | 'CNAME' | 'MX';
  name: string;
  value: string;
  status: 'pending' | 'verified' | 'failed';
}

export interface EmailSendRequest {
  from: string;
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  reply_to?: string;
  tags?: Array<{ name: string; value: string }>;
  headers?: Record<string, string>;
}

export interface EmailSendResponse {
  id: string;
  from: string;
  to: string[];
  created_at: string;
}

export interface EmailEvent {
  id: string;
  type:
    | 'email.sent'
    | 'email.delivered'
    | 'email.delivery_delayed'
    | 'email.complained'
    | 'email.bounced'
    | 'email.opened'
    | 'email.clicked';
  created_at: string;
  data: {
    email_id: string;
    from: string;
    to: string[];
    subject: string;
    html?: string;
    text?: string;
    reply_to?: string;
    last_event?: string;
  };
}

export class ResendService {
  private resend: Resend;
  private config: ResendConfig;

  constructor(config: ResendConfig) {
    this.config = config;
    this.resend = new Resend(config.apiKey);
  }

  /**
   * Create a new domain
   */
  async createDomain(name: string): Promise<EmailDomain> {
    try {
      const response = await this.resend.domains.create({ name });

      return {
        id: response.data?.id || '',
        name: response.data?.name || name,
        status: response.data?.status || 'pending',
        records: response.data?.records || [],
        created_at: response.data?.created_at || new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error creating domain:', error);
      throw new Error(
        `Failed to create domain: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * List all domains
   */
  async listDomains(): Promise<EmailDomain[]> {
    try {
      const response = await this.resend.domains.list();

      return (response.data || []).map(domain => ({
        id: domain.id,
        name: domain.name,
        status: domain.status as 'pending' | 'verified' | 'failed',
        records: domain.records || [],
        created_at: domain.created_at,
      }));
    } catch (error) {
      console.error('Error listing domains:', error);
      throw new Error(
        `Failed to list domains: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Get domain details
   */
  async getDomain(domainId: string): Promise<EmailDomain> {
    try {
      const response = await this.resend.domains.get(domainId);

      return {
        id: response.data?.id || domainId,
        name: response.data?.name || '',
        status: response.data?.status || 'pending',
        records: response.data?.records || [],
        created_at: response.data?.created_at || new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error getting domain:', error);
      throw new Error(
        `Failed to get domain: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Verify domain
   */
  async verifyDomain(
    domainId: string
  ): Promise<{ status: string; verified: boolean }> {
    try {
      const response = await this.resend.domains.verify(domainId);

      return {
        status: response.data?.status || 'pending',
        verified: response.data?.verified || false,
      };
    } catch (error) {
      console.error('Error verifying domain:', error);
      throw new Error(
        `Failed to verify domain: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Delete domain
   */
  async deleteDomain(domainId: string): Promise<boolean> {
    try {
      const response = await this.resend.domains.remove(domainId);
      return response.data?.deleted || false;
    } catch (error) {
      console.error('Error deleting domain:', error);
      throw new Error(
        `Failed to delete domain: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Send email
   */
  async sendEmail(request: EmailSendRequest): Promise<EmailSendResponse> {
    try {
      const response = await this.resend.emails.send({
        from: request.from,
        to: request.to,
        subject: request.subject,
        html: request.html,
        text: request.text,
        reply_to: request.reply_to,
        tags: request.tags,
        headers: request.headers,
      });

      return {
        id: response.data?.id || '',
        from: request.from,
        to: Array.isArray(request.to) ? request.to : [request.to],
        created_at: response.data?.created_at || new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error(
        `Failed to send email: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Send batch emails
   */
  async sendBatchEmails(
    requests: EmailSendRequest[]
  ): Promise<EmailSendResponse[]> {
    try {
      const response = await this.resend.batch.send(
        requests.map(req => ({
          from: req.from,
          to: req.to,
          subject: req.subject,
          html: req.html,
          text: req.text,
          reply_to: req.reply_to,
          tags: req.tags,
          headers: req.headers,
        }))
      );

      return (response.data || []).map((email, index) => ({
        id: email.id || '',
        from: requests[index].from,
        to: Array.isArray(requests[index].to)
          ? requests[index].to
          : [requests[index].to],
        created_at: email.created_at || new Date().toISOString(),
      }));
    } catch (error) {
      console.error('Error sending batch emails:', error);
      throw new Error(
        `Failed to send batch emails: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Get email details
   */
  async getEmail(emailId: string): Promise<EmailDetails> {
    try {
      const response = await this.resend.emails.get(emailId);
      return response.data;
    } catch (error) {
      console.error('Error getting email:', error);
      throw new Error(
        `Failed to get email: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Validate webhook signature
   */
  validateWebhookSignature(
    payload: string,
    signature: string,
    secret: string
  ): boolean {
    // Resend uses HMAC-SHA256 for webhook signatures
    import crypto from 'crypto';
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  }

  /**
   * Parse webhook event
   */
  parseWebhookEvent(payload: string): EmailEvent {
    try {
      const event = JSON.parse(payload);

      return {
        id: event.id || '',
        type: event.type || 'email.sent',
        created_at: event.created_at || new Date().toISOString(),
        data: event.data || {},
      };
    } catch (error) {
      console.error('Error parsing webhook event:', error);
      throw new Error('Invalid webhook payload');
    }
  }

  /**
   * Update domain settings (tracking, etc.)
   */
  async updateDomainSettings(
    domainId: string,
    settings: {
      openTracking?: boolean;
      clickTracking?: boolean;
    }
  ): Promise<boolean> {
    try {
      const response = await this.resend.domains.update(domainId, {
        openTracking: settings.openTracking,
        clickTracking: settings.clickTracking,
      });

      return !!response.data;
    } catch (error) {
      console.error('Error updating domain settings:', error);
      throw new Error(
        `Failed to update domain settings: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Get domain analytics
   */
  async getDomainAnalytics(
    domainId: string,
    startDate?: string,
    endDate?: string
  ): Promise<DomainAnalytics> {
    try {
      // Note: Resend doesn't have a direct analytics API endpoint
      // This would need to be implemented using webhook events
      // For now, return empty analytics
      return {
        domain_id: domainId,
        start_date: startDate,
        end_date: endDate,
        emails_sent: 0,
        emails_delivered: 0,
        emails_opened: 0,
        emails_clicked: 0,
        emails_bounced: 0,
        emails_complained: 0,
      };
    } catch (error) {
      console.error('Error getting domain analytics:', error);
      throw new Error(
        `Failed to get domain analytics: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Test API connection
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.resend.domains.list();
      return true;
    } catch (error) {
      console.error('Resend API connection test failed:', error);
      return false;
    }
  }
}

// Singleton instance
let resendServiceInstance: ResendService | null = null;

export function getResendService(): ResendService {
  if (!resendServiceInstance) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error('RESEND_API_KEY environment variable is required');
    }

    resendServiceInstance = new ResendService({ apiKey });
  }

  return resendServiceInstance;
}

export function createResendService(config: ResendConfig): ResendService {
  return new ResendService(config);
}
