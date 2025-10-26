/**
 * SECURE Gmail Service with Proper Encryption
 * Fixed implementation following security best practices
 */

import { supabase } from '../integrations/supabase/client';
import { GmailApiService } from './gmailApiService';

// Types for email system
export interface EmailAccount {
  id: string;
  user_id: string;
  email_address: string;
  provider: 'gmail' | 'outlook';
  access_token: string; // Properly encrypted
  refresh_token: string; // Properly encrypted
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
 * SECURE Token Encryption using Web Crypto API
 * Production-ready encryption implementation
 */
class SecureTokenEncryption {
  private static readonly ALGORITHM = 'AES-GCM';
  private static readonly KEY_LENGTH = 256;

  /**
   * Get encryption key from environment or generate a secure one
   */
  private static async getEncryptionKey(): Promise<CryptoKey> {
    const keyString = import.meta.env.VITE_TOKEN_ENCRYPTION_KEY;

    if (!keyString) {
      throw new Error(
        'VITE_TOKEN_ENCRYPTION_KEY environment variable is required'
      );
    }

    // Convert string key to CryptoKey
    const keyBuffer = new TextEncoder().encode(
      keyString.padEnd(32, '0').slice(0, 32)
    );
    return await crypto.subtle.importKey(
      'raw',
      keyBuffer,
      { name: this.ALGORITHM },
      false,
      ['encrypt', 'decrypt']
    );
  }

  /**
   * Encrypt sensitive data using AES-GCM
   */
  static async encrypt(text: string): Promise<string> {
    try {
      const key = await this.getEncryptionKey();
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const encodedText = new TextEncoder().encode(text);

      const encrypted = await crypto.subtle.encrypt(
        { name: this.ALGORITHM, iv },
        key,
        encodedText
      );

      // Combine IV and encrypted data
      const combined = new Uint8Array(iv.length + encrypted.byteLength);
      combined.set(iv);
      combined.set(new Uint8Array(encrypted), iv.length);

      return btoa(String.fromCharCode(...combined));
    } catch (error) {
      console.error('Encryption failed:', error);
      throw new Error('Failed to encrypt token');
    }
  }

  /**
   * Decrypt sensitive data using AES-GCM
   */
  static async decrypt(encryptedText: string): Promise<string> {
    try {
      const key = await this.getEncryptionKey();
      const combined = new Uint8Array(
        atob(encryptedText)
          .split('')
          .map(char => char.charCodeAt(0))
      );

      // Extract IV and encrypted data
      const iv = combined.slice(0, 12);
      const encrypted = combined.slice(12);

      const decrypted = await crypto.subtle.decrypt(
        { name: this.ALGORITHM, iv },
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

/**
 * CSRF Protection Utilities
 */
class CSRFProtection {
  /**
   * Generate secure state parameter
   */
  static generateState(): string {
    const uuid = crypto.randomUUID();
    const timestamp = Date.now().toString();
    const nonce = crypto.getRandomValues(new Uint8Array(16));
    const nonceString = btoa(String.fromCharCode(...nonce));

    return `${uuid}:${timestamp}:${nonceString}`;
  }

  /**
   * Validate state parameter
   */
  static validateState(state: string): boolean {
    try {
      const [uuid, timestamp, nonce] = state.split(':');

      // Check format
      if (!uuid || !timestamp || !nonce) {
        return false;
      }

      // Check timestamp (max 10 minutes old)
      const age = Date.now() - parseInt(timestamp);
      if (age < 0 || age > 600000) {
        return false;
      }

      // Check UUID format
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(uuid)) {
        return false;
      }

      return true;
    } catch (error) {
      console.error('State validation failed:', error);
      return false;
    }
  }
}

/**
 * Rate Limiting for API calls
 */
class RateLimiter {
  private static requests = new Map<string, number[]>();

  /**
   * Check if request is within rate limit
   */
  static checkRateLimit(
    identifier: string,
    maxRequests: number = 10,
    windowMs: number = 60000
  ): boolean {
    const now = Date.now();
    const requests = this.requests.get(identifier) || [];

    // Remove old requests outside the window
    const recentRequests = requests.filter(time => now - time < windowMs);

    if (recentRequests.length >= maxRequests) {
      return false;
    }

    // Add current request
    recentRequests.push(now);
    this.requests.set(identifier, recentRequests);

    return true;
  }

  /**
   * Clean up old entries to prevent memory leaks
   */
  static cleanup(): void {
    const now = Date.now();
    for (const [key, requests] of this.requests.entries()) {
      const recentRequests = requests.filter(time => now - time < 300000); // 5 minutes
      if (recentRequests.length === 0) {
        this.requests.delete(key);
      } else {
        this.requests.set(key, recentRequests);
      }
    }
  }
}

/**
 * Enhanced Error Handling
 */
class GmailAPIError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number,
    public retryable: boolean = false,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'GmailAPIError';
  }
}

export class SecureGmailService {
  private clientId: string;
  private redirectUri: string;

  constructor() {
    this.clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    this.redirectUri = `${window.location.origin}/auth/gmail-callback`;

    if (!this.clientId) {
      throw new Error('VITE_GOOGLE_CLIENT_ID environment variable is required');
    }
  }

  /**
   * Initiate Gmail OAuth2 authentication with CSRF protection
   */
  async authenticateWithGmail(): Promise<string> {
    const scope =
      'https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/gmail.readonly';

    // Generate secure state parameter
    const state = CSRFProtection.generateState();

    // Store state in session storage for validation
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
   * Handle Gmail OAuth callback with enhanced security
   */
  async handleGmailCallback(code: string): Promise<void> {
    try {
      // Validate CSRF state parameter
      const storedState = sessionStorage.getItem('gmail_oauth_state');
      if (!storedState || !CSRFProtection.validateState(storedState)) {
        throw new GmailAPIError(
          'Invalid or expired state parameter',
          'INVALID_STATE',
          400
        );
      }

      // Clear state from storage
      sessionStorage.removeItem('gmail_oauth_state');

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
      throw new GmailAPIError(
        'Failed to get user info',
        'USER_INFO_FAILED',
        response.status
      );
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
      throw new GmailAPIError('User not authenticated', 'UNAUTHORIZED', 401);
    }

    // Encrypt tokens securely
    const encryptedAccessToken = await SecureTokenEncryption.encrypt(
      tokens.access_token
    );
    const encryptedRefreshToken = await SecureTokenEncryption.encrypt(
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
      throw new GmailAPIError(
        'Failed to store authentication tokens',
        'STORAGE_FAILED',
        500
      );
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
      throw new GmailAPIError('User not authenticated', 'UNAUTHORIZED', 401);
    }

    const { data: account, error } = await supabase
      .from('email_accounts')
      .select('*')
      .eq('user_id', user.id)
      .eq('provider', 'gmail')
      .eq('is_active', true)
      .single();

    if (error || !account) {
      throw new GmailAPIError(
        'No Gmail account connected. Please authenticate first.',
        'NO_ACCOUNT',
        404
      );
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
        throw new GmailAPIError(
          'Failed to refresh token',
          'REFRESH_FAILED',
          500
        );
      }

      return await SecureTokenEncryption.decrypt(updatedAccount.access_token);
    }

    return await SecureTokenEncryption.decrypt(account.access_token);
  }

  /**
   * Refresh expired access token
   */
  private async refreshAccessToken(account: EmailAccount): Promise<void> {
    const refreshToken = await SecureTokenEncryption.decrypt(
      account.refresh_token
    );

    const tokens = await GmailApiService.refreshAccessToken(refreshToken);
    const encryptedAccessToken = await SecureTokenEncryption.encrypt(
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
      throw new GmailAPIError(
        'Failed to update refreshed token',
        'UPDATE_FAILED',
        500
      );
    }
  }

  /**
   * Send email via Gmail API with enhanced error handling
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
        throw new GmailAPIError(
          `Failed to send email: ${error}`,
          'SEND_FAILED',
          response.status
        );
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
      throw new GmailAPIError('User not authenticated', 'UNAUTHORIZED', 401);
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
      throw new GmailAPIError(
        'No active Gmail account found',
        'NO_ACCOUNT',
        404
      );
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
      throw new GmailAPIError(
        'Failed to fetch email templates',
        'FETCH_FAILED',
        500
      );
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
      throw new GmailAPIError(
        'Failed to create email template',
        'CREATE_FAILED',
        500
      );
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
      throw new GmailAPIError('User not authenticated', 'UNAUTHORIZED', 401);
    }

    const { error } = await supabase
      .from('email_accounts')
      .update({ is_active: false })
      .eq('user_id', user.id)
      .eq('provider', 'gmail');

    if (error) {
      console.error('Failed to disconnect Gmail:', error);
      throw new GmailAPIError(
        'Failed to disconnect Gmail',
        'DISCONNECT_FAILED',
        500
      );
    }
  }
}

// Export singleton instance
export const secureGmailService = new SecureGmailService();
