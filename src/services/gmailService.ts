import { supabase } from '../integrations/supabase/client';

export interface GmailMessage {
  id: string;
  threadId: string;
  snippet: string;
  payload: {
    headers: Array<{ name: string; value: string }>;
    body: {
      data?: string;
      attachmentId?: string;
    };
    parts?: Array<{
      mimeType: string;
      body: { data?: string };
      parts?: Array<{
        mimeType: string;
        body: { data?: string };
      }>;
    }>;
  };
  sizeEstimate: number;
  historyId: string;
  internalDate: string;
  labelIds: string[];
}

export interface EmailThread {
  id: string;
  gmail_thread_id: string;
  person_id: string;
  subject: string;
  participants: string[];
  last_message_at: string;
  is_read: boolean;
  sync_status: 'synced' | 'pending' | 'error';
}

export interface EmailMessage {
  id: string;
  thread_id: string;
  gmail_message_id: string;
  person_id: string;
  from_email: string;
  to_emails: string[];
  cc_emails: string[];
  bcc_emails: string[];
  subject: string;
  body_text: string;
  body_html: string;
  attachments: any[];
  is_read: boolean;
  is_sent: boolean;
  sent_at?: string;
  received_at: string;
  sync_status: 'synced' | 'pending' | 'error';
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body_html: string;
  body_text?: string;
  category: 'outreach' | 'follow_up' | 'meeting' | 'proposal' | 'other';
  is_active: boolean;
  created_by: string;
}

export interface SendEmailRequest {
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  body: string;
  bodyHtml?: string;
  attachments?: File[];
  personId?: string;
}

export class GmailService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    this.loadTokens();
  }

  private loadTokens() {
    const user = supabase.auth.getUser();
    if (user) {
      this.accessToken = localStorage.getItem('gmail_access_token');
      this.refreshToken = localStorage.getItem('gmail_refresh_token');
    }
  }

  private async getValidAccessToken(): Promise<string> {
    if (!this.accessToken) {
      throw new Error(
        'No Gmail access token available. Please authenticate with Gmail.'
      );
    }
    return this.accessToken;
  }

  private async makeGmailRequest(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<any> {
    const token = await this.getValidAccessToken();

    const response = await fetch(
      `https://gmail.googleapis.com/gmail/v1/${endpoint}`,
      {
        ...options,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          ...options.headers,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Gmail API error: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  }

  async authenticateWithGmail(): Promise<string> {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (!clientId) {
      throw new Error(
        'Google OAuth is not configured. Please set VITE_GOOGLE_CLIENT_ID environment variable.'
      );
    }

    const redirectUri = `${window.location.origin}/auth/gmail-callback`;

    const scope =
      'https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.send';
    const authUrl =
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `scope=${encodeURIComponent(scope)}&` +
      `response_type=code&` +
      `access_type=offline&` +
      `prompt=consent`;

    window.location.href = authUrl;
    return authUrl;
  }

  async handleGmailCallback(code: string): Promise<void> {
    try {
      const response = await fetch('/api/gmail/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      const { access_token, refresh_token } = await response.json();

      this.accessToken = access_token;
      this.refreshToken = refresh_token;

      localStorage.setItem('gmail_access_token', access_token);
      localStorage.setItem('gmail_refresh_token', refresh_token);
    } catch (error) {
      console.error('Gmail authentication failed:', error);
      throw error;
    }
  }

  async syncInboxEmails(): Promise<EmailThread[]> {
    try {
      const messages = await this.makeGmailRequest(
        'users/me/messages?maxResults=50'
      );

      const threads: EmailThread[] = [];

      for (const messageRef of messages.messages || []) {
        const message = await this.makeGmailRequest(
          `users/me/messages/${messageRef.id}`
        );
        const thread = await this.processGmailMessage(message);

        if (thread) {
          threads.push(thread);
        }
      }

      await this.storeEmailThreads(threads);
      return threads;
    } catch (error) {
      console.error('Failed to sync inbox emails:', error);
      await this.logSyncError('sync_inbox', error);
      throw error;
    }
  }

  private async processGmailMessage(
    gmailMessage: GmailMessage
  ): Promise<EmailThread | null> {
    try {
      const headers = gmailMessage.payload.headers;
      const fromHeader = headers.find(header => header.name === 'From');
      const toHeader = headers.find(header => header.name === 'To');
      const subjectHeader = headers.find(header => header.name === 'Subject');

      if (!fromHeader || !toHeader) return null;

      const fromEmail = this.extractEmail(fromHeader.value);
      const toEmails = this.extractEmails(toHeader.value);
      const subject = subjectHeader?.value || '';

      const { data: person } = await supabase
        .from('people')
        .select('id')
        .eq('email_address', fromEmail)
        .single();

      if (!person) return null;

      const bodyText = this.extractEmailBody(gmailMessage.payload);
      const bodyHtml = this.extractEmailBodyHtml(gmailMessage.payload);

      const threadData = {
        gmail_thread_id: gmailMessage.threadId,
        person_id: person.id,
        subject,
        participants: [fromEmail, ...toEmails],
        last_message_at: new Date(
          parseInt(gmailMessage.internalDate)
        ).toISOString(),
        is_read: !gmailMessage.labelIds.includes('UNREAD'),
        sync_status: 'synced' as const,
      };

      return threadData as EmailThread;
    } catch (error) {
      console.error('Failed to process Gmail message:', error);
      return null;
    }
  }

  private extractEmail(emailString: string): string {
    const match =
      emailString.match(/<([^>]+)>/) || emailString.match(/([^\s]+@[^\s]+)/);
    return match ? match[1] : emailString;
  }

  private extractEmails(emailString: string): string[] {
    const emails = emailString
      .split(',')
      .map(email => this.extractEmail(email.trim()));
    return emails.filter(email => email.includes('@'));
  }

  private extractEmailBody(payload: any): string {
    if (payload.body?.data) {
      return atob(payload.body.data.replace(/-/g, '+').replace(/_/g, '/'));
    }

    if (payload.parts) {
      for (const part of payload.parts) {
        if (part.mimeType === 'text/plain' && part.body?.data) {
          return atob(part.body.data.replace(/-/g, '+').replace(/_/g, '/'));
        }
        if (part.parts) {
          const body = this.extractEmailBody(part);
          if (body) return body;
        }
      }
    }

    return '';
  }

  private extractEmailBodyHtml(payload: any): string {
    if (payload.parts) {
      for (const part of payload.parts) {
        if (part.mimeType === 'text/html' && part.body?.data) {
          return atob(part.body.data.replace(/-/g, '+').replace(/_/g, '/'));
        }
        if (part.parts) {
          const body = this.extractEmailBodyHtml(part);
          if (body) return body;
        }
      }
    }

    return '';
  }

  async sendEmail(request: SendEmailRequest): Promise<void> {
    try {
      const token = await this.getValidAccessToken();

      const emailMessage = this.createEmailMessage(request);

      const response = await fetch(
        'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            raw: btoa(emailMessage)
              .replace(/\+/g, '-')
              .replace(/\//g, '_')
              .replace(/=+$/, ''),
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to send email: ${response.statusText}`);
      }

      const result = await response.json();
      await this.storeSentEmail(request, result.id);
      await this.logSyncSuccess('send_email', 1);
    } catch (error) {
      console.error('Failed to send email:', error);
      await this.logSyncError('send_email', error);
      throw error;
    }
  }

  private createEmailMessage(request: SendEmailRequest): string {
    const boundary = '----=_Part_' + Math.random().toString(36).substr(2, 9);

    let message = `To: ${request.to.join(', ')}\r\n`;
    if (request.cc) message += `Cc: ${request.cc.join(', ')}\r\n`;
    if (request.bcc) message += `Bcc: ${request.bcc.join(', ')}\r\n`;
    message += `Subject: ${request.subject}\r\n`;
    message += `MIME-Version: 1.0\r\n`;
    message += `Content-Type: multipart/alternative; boundary="${boundary}"\r\n\r\n`;

    message += `--${boundary}\r\n`;
    message += `Content-Type: text/plain; charset=UTF-8\r\n\r\n`;
    message += `${request.body}\r\n\r\n`;

    if (request.bodyHtml) {
      message += `--${boundary}\r\n`;
      message += `Content-Type: text/html; charset=UTF-8\r\n\r\n`;
      message += `${request.bodyHtml}\r\n\r\n`;
    }

    message += `--${boundary}--\r\n`;

    return message;
  }

  async getEmailTemplates(): Promise<EmailTemplate[]> {
    const { data, error } = await supabase
      .from('email_templates')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) throw error;
    return data || [];
  }

  async createEmailTemplate(
    template: Omit<EmailTemplate, 'id' | 'created_by'>
  ): Promise<EmailTemplate> {
    const { data: user } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('email_templates')
      .insert({
        ...template,
        created_by: user.user?.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getEmailThreads(personId?: string): Promise<EmailThread[]> {
    let query = supabase
      .from('email_threads')
      .select('*')
      .order('last_message_at', { ascending: false });

    if (personId) {
      query = query.eq('person_id', personId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  async getEmailMessages(threadId: string): Promise<EmailMessage[]> {
    const { data, error } = await supabase
      .from('email_messages')
      .select('*')
      .eq('thread_id', threadId)
      .order('received_at', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  private async storeEmailThreads(threads: EmailThread[]): Promise<void> {
    for (const thread of threads) {
      const { error } = await supabase
        .from('email_threads')
        .upsert(thread, { onConflict: 'gmail_thread_id' });

      if (error) {
        console.error('Failed to store email thread:', error);
      }
    }
  }

  private async storeSentEmail(
    request: SendEmailRequest,
    gmailMessageId: string
  ): Promise<void> {
    const { data: user } = await supabase.auth.getUser();

    const messageData = {
      gmail_message_id: gmailMessageId,
      person_id: request.personId,
      from_email: user.user?.email || '',
      to_emails: request.to,
      cc_emails: request.cc || [],
      bcc_emails: request.bcc || [],
      subject: request.subject,
      body_text: request.body,
      body_html: request.bodyHtml || '',
      attachments: [],
      is_read: true,
      is_sent: true,
      sent_at: new Date().toISOString(),
      sync_status: 'synced' as const,
    };

    const { error } = await supabase.from('email_messages').insert(messageData);

    if (error) {
      console.error('Failed to store sent email:', error);
    }
  }

  private async logSyncSuccess(
    operationType: string,
    messageCount: number
  ): Promise<void> {
    const { data: user } = await supabase.auth.getUser();

    await supabase.from('email_sync_logs').insert({
      user_id: user.user?.id,
      operation_type: operationType,
      status: 'success',
      message_count: messageCount,
    });
  }

  private async logSyncError(operationType: string, error: any): Promise<void> {
    const { data: user } = await supabase.auth.getUser();

    await supabase.from('email_sync_logs').insert({
      user_id: user.user?.id,
      operation_type: operationType,
      status: 'error',
      error_message: error.message || 'Unknown error',
    });
  }

  async markAsRead(threadId: string): Promise<void> {
    try {
      const token = await this.getValidAccessToken();

      await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/threads/${threadId}/modify`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            removeLabelIds: ['UNREAD'],
          }),
        }
      );

      await supabase
        .from('email_threads')
        .update({ is_read: true })
        .eq('gmail_thread_id', threadId);

      await this.logSyncSuccess('mark_read', 1);
    } catch (error) {
      console.error('Failed to mark as read:', error);
      await this.logSyncError('mark_read', error);
      throw error;
    }
  }
}

export const gmailService = new GmailService();
