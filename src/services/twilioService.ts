/**
 * Twilio SMS Service
 * Comprehensive service for Twilio SMS integration
 */

export interface TwilioConfig {
  accountSid: string;
  authToken: string;
  phoneNumber: string;
}

export interface SMSMessage {
  to: string;
  body: string;
  from?: string;
  mediaUrl?: string[];
  statusCallback?: string;
}

export interface SMSResponse {
  sid: string;
  status: string;
  to: string;
  from: string;
  body: string;
  dateCreated: string;
  dateUpdated: string;
  dateSent?: string;
  errorCode?: string;
  errorMessage?: string;
}

export interface TwilioMessage {
  sid: string;
  status: string;
  to: string;
  from: string;
  body: string;
}

export interface TwilioUsageRecord {
  count: string;
  price: string;
}

export interface SMSStatus {
  sid: string;
  status:
    | 'queued'
    | 'sending'
    | 'sent'
    | 'delivered'
    | 'undelivered'
    | 'failed';
  to: string;
  from: string;
  body: string;
  dateCreated: string;
  dateUpdated: string;
  dateSent?: string;
  errorCode?: string;
  errorMessage?: string;
}

export class TwilioSMSService {
  private config: TwilioConfig;
  private baseUrl: string;

  constructor(config: TwilioConfig) {
    this.config = config;
    this.baseUrl = `https://api.twilio.com/2010-04-01/Accounts/${config.accountSid}`;
  }

  /**
   * Send SMS message
   */
  async sendSMS(message: SMSMessage): Promise<SMSResponse> {
    try {
      const url = `${this.baseUrl}/Messages.json`;

      const formData = new FormData();
      formData.append('To', message.to);
      formData.append('From', message.from || this.config.phoneNumber);
      formData.append('Body', message.body);

      if (message.mediaUrl) {
        message.mediaUrl.forEach(url => formData.append('MediaUrl', url));
      }

      if (message.statusCallback) {
        formData.append('StatusCallback', message.statusCallback);
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${btoa(`${this.config.accountSid}:${this.config.authToken}`)}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Twilio API error: ${errorData.message || 'Unknown error'}`
        );
      }

      const data = await response.json();

      return {
        sid: data.sid,
        status: data.status,
        to: data.to,
        from: data.from,
        body: data.body,
        dateCreated: data.date_created,
        dateUpdated: data.date_updated,
        dateSent: data.date_sent,
        errorCode: data.error_code,
        errorMessage: data.error_message,
      };
    } catch (error) {
      console.error('Error sending SMS:', error);
      throw new Error(
        `Failed to send SMS: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Send bulk SMS messages
   */
  async sendBulkSMS(messages: SMSMessage[]): Promise<SMSResponse[]> {
    const results: SMSResponse[] = [];

    // Process messages in batches to avoid rate limits
    const batchSize = 10;
    for (let i = 0; i < messages.length; i += batchSize) {
      const batch = messages.slice(i, i + batchSize);

      const batchPromises = batch.map(message => this.sendSMS(message));
      const batchResults = await Promise.allSettled(batchPromises);

      batchResults.forEach(result => {
        if (result.status === 'fulfilled') {
          results.push(result.value);
        } else {
          // Create error response for failed messages
          results.push({
            sid: '',
            status: 'failed',
            to: '',
            from: '',
            body: '',
            dateCreated: new Date().toISOString(),
            dateUpdated: new Date().toISOString(),
            errorMessage: result.reason?.message || 'Unknown error',
          });
        }
      });

      // Add delay between batches to respect rate limits
      if (i + batchSize < messages.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return results;
  }

  /**
   * Get SMS message status
   */
  async getSMSStatus(messageSid: string): Promise<SMSStatus> {
    try {
      const url = `${this.baseUrl}/Messages/${messageSid}.json`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Basic ${btoa(`${this.config.accountSid}:${this.config.authToken}`)}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Twilio API error: ${errorData.message || 'Unknown error'}`
        );
      }

      const data = await response.json();

      return {
        sid: data.sid,
        status: data.status,
        to: data.to,
        from: data.from,
        body: data.body,
        dateCreated: data.date_created,
        dateUpdated: data.date_updated,
        dateSent: data.date_sent,
        errorCode: data.error_code,
        errorMessage: data.error_message,
      };
    } catch (error) {
      console.error('Error getting SMS status:', error);
      throw new Error(
        `Failed to get SMS status: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Get SMS messages (with optional filters)
   */
  async getSMSMessages(filters?: {
    to?: string;
    from?: string;
    dateSent?: string;
    limit?: number;
  }): Promise<SMSStatus[]> {
    try {
      let url = `${this.baseUrl}/Messages.json`;
      const params = new URLSearchParams();

      if (filters?.to) params.append('To', filters.to);
      if (filters?.from) params.append('From', filters.from);
      if (filters?.dateSent) params.append('DateSent', filters.dateSent);
      if (filters?.limit) params.append('PageSize', filters.limit.toString());

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Basic ${btoa(`${this.config.accountSid}:${this.config.authToken}`)}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Twilio API error: ${errorData.message || 'Unknown error'}`
        );
      }

      const data = (await response.json()) as { messages?: TwilioApiMessage[] };

      // Twilio API response includes additional fields not in our interface
      interface TwilioApiMessage extends TwilioMessage {
        date_created?: string;
        date_updated?: string;
        date_sent?: string;
        error_code?: string;
        error_message?: string;
      }

      return (data.messages || []).map((message: TwilioApiMessage) => ({
        sid: message.sid,
        status: message.status,
        to: message.to,
        from: message.from,
        body: message.body,
        dateCreated: message.date_created,
        dateUpdated: message.date_updated,
        dateSent: message.date_sent,
        errorCode: message.error_code,
        errorMessage: message.error_message,
      }));
    } catch (error) {
      console.error('Error getting SMS messages:', error);
      throw new Error(
        `Failed to get SMS messages: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Validate phone number
   */
  async validatePhoneNumber(phoneNumber: string): Promise<{
    valid: boolean;
    formatted?: string;
    countryCode?: string;
    type?: string;
  }> {
    try {
      const url = `${this.baseUrl}/Lookups.json`;
      const params = new URLSearchParams({
        PhoneNumber: phoneNumber,
        Type: 'carrier',
      });

      const response = await fetch(`${url}?${params}`, {
        method: 'GET',
        headers: {
          Authorization: `Basic ${btoa(`${this.config.accountSid}:${this.config.authToken}`)}`,
        },
      });

      if (!response.ok) {
        return { valid: false };
      }

      const data = await response.json();

      return {
        valid: true,
        formatted: data.phone_number,
        countryCode: data.country_code,
        type: data.carrier?.type,
      };
    } catch (error) {
      console.error('Error validating phone number:', error);
      return { valid: false };
    }
  }

  /**
   * Get account usage statistics
   */
  async getUsageStats(
    startDate?: string,
    endDate?: string
  ): Promise<{
    messagesSent: number;
    messagesDelivered: number;
    messagesFailed: number;
    cost: number;
  }> {
    try {
      const url = `${this.baseUrl}/Usage/Records.json`;
      const params = new URLSearchParams({
        Category: 'sms',
        StartDate:
          startDate ||
          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
        EndDate: endDate || new Date().toISOString().split('T')[0],
      });

      const response = await fetch(`${url}?${params}`, {
        method: 'GET',
        headers: {
          Authorization: `Basic ${btoa(`${this.config.accountSid}:${this.config.authToken}`)}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Twilio API error: ${errorData.message || 'Unknown error'}`
        );
      }

      const data = await response.json();
      const usageRecords = data.usage_records || [];

      let messagesSent = 0;
      let messagesDelivered = 0;
      let messagesFailed = 0;
      let cost = 0;

      usageRecords.forEach((record: TwilioUsageRecord) => {
        messagesSent += parseInt(record.count) || 0;
        cost += parseFloat(record.price) || 0;

        // Estimate delivered vs failed based on typical delivery rates
        messagesDelivered += Math.floor((parseInt(record.count) || 0) * 0.95);
        messagesFailed += Math.ceil((parseInt(record.count) || 0) * 0.05);
      });

      return {
        messagesSent,
        messagesDelivered,
        messagesFailed,
        cost,
      };
    } catch (error) {
      console.error('Error getting usage stats:', error);
      throw new Error(
        `Failed to get usage stats: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Test API connection
   */
  async testConnection(): Promise<boolean> {
    try {
      const url = `${this.baseUrl}.json`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Basic ${btoa(`${this.config.accountSid}:${this.config.authToken}`)}`,
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Twilio API connection test failed:', error);
      return false;
    }
  }

  /**
   * Parse webhook payload
   */
  parseWebhookPayload(formData: FormData): {
    messageSid: string;
    messageStatus: string;
    to: string;
    from: string;
    body: string;
    errorCode?: string;
    errorMessage?: string;
  } {
    return {
      messageSid: formData.get('MessageSid') as string,
      messageStatus: formData.get('MessageStatus') as string,
      to: formData.get('To') as string,
      from: formData.get('From') as string,
      body: formData.get('Body') as string,
      errorCode: (formData.get('ErrorCode') as string) || undefined,
      errorMessage: (formData.get('ErrorMessage') as string) || undefined,
    };
  }
}

// Singleton instance
let twilioServiceInstance: TwilioSMSService | null = null;

export function getTwilioService(): TwilioSMSService {
  if (!twilioServiceInstance) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const phoneNumber = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || !authToken || !phoneNumber) {
      throw new Error(
        'TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER environment variables are required'
      );
    }

    twilioServiceInstance = new TwilioSMSService({
      accountSid,
      authToken,
      phoneNumber,
    });
  }

  return twilioServiceInstance;
}

export function createTwilioService(config: TwilioConfig): TwilioSMSService {
  return new TwilioSMSService(config);
}
