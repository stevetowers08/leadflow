/**
 * Secure Gmail Service with Encrypted Token Storage
 * Following best practices for OAuth2 and token management
 */

import { supabase } from '../integrations/supabase/client';
import { GmailApiService } from './gmailApiService';

// Types for email system
export interface EmailAccount {
  id: string;
  user_id: string;
  email_address: string;
  provider: 'gmail' | 'outlook';
  access_token: string; // Encrypted
  refresh_token: string; // Encrypted
  token_expires_at: string | null;
  scope: string;
  is_active: boolean;
  last_sync_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body_html: string;
  body_text?: string;
  category: 'outreach' | 'follow_up' | 'meeting' | 'proposal' | 'other';
  placeholders: string[];
  preview_data: Record<string, unknown>;
  variables: Record<string, unknown>;
  is_active: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface EmailSend {
  id: string;
  person_id: string;
  template_id?: string;
  email_account_id: string;
  gmail_message_id: string;
  gmail_thread_id?: string;
  to_email: string;
  subject: string;
  body_html?: string;
  body_text?: string;
  status: 'sent' | 'delivered' | 'failed' | 'bounced';
  sent_at: string;
  delivered_at?: string;
  failed_at?: string;
  error_message?: string;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface SendEmailRequest {
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  body: string;
  bodyHtml?: string;
  templateId?: string;
  personId?: string;
}

export interface GmailTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

/**
 * Secure encryption/decryption utility using AES-GCM
 * Following Google's best practices for token storage
 */
class TokenEncryption {
  private static readonly ENCRYPTION_KEY =
    process.env.TOKEN_ENCRYPTION_KEY ||
    'default-key-change-in-production';

  /**
   * Encrypts sensitive data using AES-GCM encryption
   */
  static async encrypt(text: string): Promise<string> {
    try {
      // Generate a random IV for each encryption
      const iv = crypto.getRandomValues(new Uint8Array(12));

      // Import the encryption key
      const key = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(
          this.ENCRYPTION_KEY.padEnd(32, '0').slice(0, 32)
        ),
        { name: 'AES-GCM' },
        false,
        ['encrypt']
      );

      // Encrypt the data
      const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        new TextEncoder().encode(text)
      );

      // Combine IV and encrypted data
      const combined = new Uint8Array(iv.length + encrypted.byteLength);
      combined.set(iv);
      combined.set(new Uint8Array(encrypted), iv.length);

      // Return base64 encoded result
      return btoa(String.fromCharCode(...combined));
    } catch (error) {
      console.error('Encryption failed:', error);
      throw new Error('Failed to encrypt token');
    }
  }

  /**
   * Decrypts sensitive data
   */
  static async decrypt(encryptedText: string): Promise<string> {
    try {
      // Decode base64
      const combined = new Uint8Array(
        atob(encryptedText)
          .split('')
          .map(c => c.charCodeAt(0))
      );

      // Extract IV and encrypted data
      const iv = combined.slice(0, 12);
      const encrypted = combined.slice(12);

      // Import the encryption key
      const key = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(
          this.ENCRYPTION_KEY.padEnd(32, '0').slice(0, 32)
        ),
        { name: 'AES-GCM' },
        false,
        ['decrypt']
      );

      // Decrypt the data
      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        encrypted
      );

      return new TextDecoder().decode(decrypted);
    } catch (error) {
      console.error('Decryption failed:', error);
      throw new Error('Failed to decrypt token');
    }
  }
}

export class SecureGmailService {
  private clientId: string;
  private redirectUri: string;

  constructor() {
    this.clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
    
    // Only access window on client-side (Next.js may render on server)
    const origin = typeof window !== 'undefined' 
      ? window.location.origin 
      : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:8086';
    this.redirectUri = `${origin}/auth/gmail-callback`;

    if (!this.clientId) {
      throw new Error('NEXT_PUBLIC_GOOGLE_CLIENT_ID environment variable is required');
    }
  }

  /**
   * Generate secure state parameter for CSRF protection
   */
  private generateSecureState(): string {
    const timestamp = Date.now();
    const randomBytes = crypto.getRandomValues(new Uint8Array(16));
    const randomString = Array.from(randomBytes, byte =>
      byte.toString(16).padStart(2, '0')
    ).join('');
    return `${timestamp}:${randomString}`;
  }

  /**
   * Initiate Gmail OAuth2 authentication with CSRF protection
   */
  async authenticateWithGmail(): Promise<string> {
    const scope =
      'https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/gmail.readonly';

    // Generate secure state parameter for CSRF protection
    const state = this.generateSecureState();

    // Store state in sessionStorage for validation
    sessionStorage.setItem('gmail_oauth_state', state);

    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authUrl.searchParams.set('client_id', this.clientId);
    authUrl.searchParams.set('redirect_uri', this.redirectUri);
    authUrl.searchParams.set('scope', scope);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('access_type', 'offline');
    authUrl.searchParams.set('prompt', 'consent');
    authUrl.searchParams.set('state', state);

    window.location.href = authUrl.toString();
    return authUrl.toString();
  }

  /**
   * Handle Gmail OAuth callback and store encrypted tokens
   */
  async handleGmailCallback(code: string, state?: string): Promise<void> {
    try {
      // Validate CSRF state parameter
      if (state) {
        const storedState = sessionStorage.getItem('gmail_oauth_state');
        if (!storedState || storedState !== state) {
          throw new Error('Invalid state parameter - possible CSRF attack');
        }
        // Clear the state after validation
        sessionStorage.removeItem('gmail_oauth_state');
      }

      // Exchange code for tokens
      const tokenResponse = await this.exchangeCodeForTokens(code);

      // Get user info
      const userInfo = await this.getUserInfo(tokenResponse.access_token);

      // Store encrypted tokens in database
      await this.storeEncryptedTokens(userInfo.email, tokenResponse);
    } catch (error) {
      console.error('Gmail authentication failed:', error);
      throw error;
    }
  }

  /**
   * Exchange authorization code for access and refresh tokens
   */
  private async exchangeCodeForTokens(
    code: string
  ): Promise<GmailTokenResponse> {
    return GmailApiService.exchangeCodeForTokens(code);
  }

  /**
   * Get user info from Gmail API
   */
  private async getUserInfo(accessToken: string): Promise<{ email: string }> {
    const response = await fetch(
      'https://www.googleapis.com/oauth2/v2/userinfo',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to get user info');
    }

    return response.json();
  }

  /**
   * Store encrypted tokens in database
   */
  private async storeEncryptedTokens(
    email: string,
    tokens: GmailTokenResponse
  ): Promise<void> {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('User not authenticated');
    }

    const encryptedAccessToken = await TokenEncryption.encrypt(
      tokens.access_token
    );
    const encryptedRefreshToken = await TokenEncryption.encrypt(
      tokens.refresh_token
    );
    const expiresAt = new Date(
      Date.now() + tokens.expires_in * 1000
    ).toISOString();

    const { error } = await supabase.from('email_accounts').upsert(
      {
        user_id: user.id,
        email_address: email,
        provider: 'gmail',
        access_token: encryptedAccessToken,
        refresh_token: encryptedRefreshToken,
        token_expires_at: expiresAt,
        scope: tokens.scope,
        is_active: true,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'user_id,provider,email_address',
      }
    );

    if (error) {
      console.error('Failed to store tokens:', error);
      throw new Error('Failed to store authentication tokens');
    }
  }

  /**
   * Get valid access token (with automatic refresh)
   */
  async getValidAccessToken(): Promise<string> {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data: account, error } = await supabase
      .from('email_accounts')
      .select('*')
      .eq('user_id', user.id)
      .eq('provider', 'gmail')
      .eq('is_active', true)
      .single();

    if (error || !account) {
      throw new Error('No Gmail account connected. Please authenticate first.');
    }

    // Check if token is expired
    const now = new Date();
    const expiresAt = new Date(account.token_expires_at || 0);

    if (now >= expiresAt) {
      // Token expired, refresh it
      await this.refreshAccessToken(account);

      // Get updated account
      const { data: updatedAccount } = await supabase
        .from('email_accounts')
        .select('*')
        .eq('id', account.id)
        .single();

      if (!updatedAccount) {
        throw new Error('Failed to refresh token');
      }

      return await TokenEncryption.decrypt(updatedAccount.access_token);
    }

    return await TokenEncryption.decrypt(account.access_token);
  }

  /**
   * Refresh expired access token
   */
  private async refreshAccessToken(account: EmailAccount): Promise<void> {
    const refreshToken = await TokenEncryption.decrypt(account.refresh_token);

    const tokens = await GmailApiService.refreshAccessToken(refreshToken);
    const encryptedAccessToken = await TokenEncryption.encrypt(
      tokens.access_token
    );
    const expiresAt = new Date(
      Date.now() + tokens.expires_in * 1000
    ).toISOString();

    const { error } = await supabase
      .from('email_accounts')
      .update({
        access_token: encryptedAccessToken,
        token_expires_at: expiresAt,
        updated_at: new Date().toISOString(),
      })
      .eq('id', account.id);

    if (error) {
      console.error('Failed to update refreshed token:', error);
      throw new Error('Failed to update refreshed token');
    }
  }

  /**
   * Send email via Gmail API
   */
  async sendEmail(
    request: SendEmailRequest
  ): Promise<{ messageId: string; threadId?: string }> {
    try {
      const accessToken = await this.getValidAccessToken();
      const emailMessage = this.createEmailMessage(request);

      const response = await fetch(
        'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
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
        const error = await response.text();
        throw new Error(`Failed to send email: ${error}`);
      }

      const result = await response.json();

      // Store email send record
      await this.storeEmailSend(request, result.id, result.threadId);

      return {
        messageId: result.id,
        threadId: result.threadId,
      };
    } catch (error) {
      console.error('Failed to send email:', error);
      throw error;
    }
  }

  /**
   * Create MIME email message
   */
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

  /**
   * Store email send record in database
   */
  private async storeEmailSend(
    request: SendEmailRequest,
    gmailMessageId: string,
    gmailThreadId?: string
  ): Promise<void> {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('User not authenticated');
    }

    // Get email account
    const { data: account } = await supabase
      .from('email_accounts')
      .select('id')
      .eq('user_id', user.id)
      .eq('provider', 'gmail')
      .eq('is_active', true)
      .single();

    if (!account) {
      throw new Error('No active Gmail account found');
    }

    const emailSendData = {
      person_id: request.personId,
      template_id: request.templateId,
      email_account_id: account.id,
      gmail_message_id: gmailMessageId,
      gmail_thread_id: gmailThreadId,
      to_email: request.to[0], // Primary recipient
      subject: request.subject,
      body_html: request.bodyHtml,
      body_text: request.body,
      status: 'sent' as const,
      sent_at: new Date().toISOString(),
      metadata: {
        cc: request.cc,
        bcc: request.bcc,
        all_recipients: request.to,
      },
    };

    const { error } = await supabase.from('email_sends').insert(emailSendData);

    if (error) {
      console.error('Failed to store email send record:', error);
      // Don't throw error here as email was sent successfully
    }
  }

  /**
   * Get email templates
   */
  async getEmailTemplates(): Promise<EmailTemplate[]> {
    const { data, error } = await supabase
      .from('email_templates')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) {
      console.error('Failed to fetch email templates:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Create email template
   */
  async createEmailTemplate(
    template: Omit<
      EmailTemplate,
      'id' | 'created_by' | 'created_at' | 'updated_at'
    >
  ): Promise<EmailTemplate> {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('email_templates')
      .insert({
        ...template,
        created_by: user?.id,
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to create email template:', error);
      throw error;
    }

    return data;
  }

  /**
   * Render template with person data
   */
  renderTemplate(
    template: EmailTemplate,
    personData: Record<string, unknown>
  ): { subject: string; body: string; bodyHtml: string } {
    let subject = template.subject;
    let body = template.body_text || '';
    let bodyHtml = template.body_html;

    // Replace placeholders with person data
    const placeholders = {
      '{{name}}': personData.name || '',
      '{{email}}': personData.email_address || '',
      '{{company}}': personData.company_name || '',
      '{{job_title}}': personData.company_role || '',
      '{{first_name}}': personData.name?.split(' ')[0] || '',
      '{{last_name}}': personData.name?.split(' ').slice(1).join(' ') || '',
    };

    // Replace placeholders in subject
    Object.entries(placeholders).forEach(([placeholder, value]) => {
      subject = subject.replace(new RegExp(placeholder, 'g'), value);
    });

    // Replace placeholders in body
    Object.entries(placeholders).forEach(([placeholder, value]) => {
      body = body.replace(new RegExp(placeholder, 'g'), value);
      bodyHtml = bodyHtml.replace(new RegExp(placeholder, 'g'), value);
    });

    return { subject, body, bodyHtml };
  }

  /**
   * Check if user has Gmail connected
   */
  async isGmailConnected(): Promise<boolean> {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return false;

    const { data } = await supabase
      .from('email_accounts')
      .select('id')
      .eq('user_id', user.id)
      .eq('provider', 'gmail')
      .eq('is_active', true)
      .single();

    return !!data;
  }

  /**
   * Disconnect Gmail account
   */
  async disconnectGmail(): Promise<void> {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('email_accounts')
      .update({ is_active: false })
      .eq('user_id', user.id)
      .eq('provider', 'gmail');

    if (error) {
      console.error('Failed to disconnect Gmail:', error);
      throw error;
    }
  }
}

// Lazy initialization - only create instance when accessed
// This prevents errors at import time if environment variables are not set
let serviceInstance: SecureGmailService | null = null;

function getSecureGmailService(): SecureGmailService {
  if (!serviceInstance) {
    serviceInstance = new SecureGmailService();
  }
  return serviceInstance;
}

// Export getter function instead of direct instance
export const secureGmailService = new Proxy({} as SecureGmailService, {
  get(_target, prop) {
    const instance = getSecureGmailService();
    const value = instance[prop as keyof SecureGmailService];
    // Handle methods
    if (typeof value === 'function') {
      return value.bind(instance);
    }
    return value;
  },
});
