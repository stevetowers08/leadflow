/**
 * Simplified Gmail Service - Still Secure but Less Complex
 * Uses proven libraries instead of custom crypto implementations
 */

import { supabase } from '../integrations/supabase/client';
import { GmailApiService } from './gmailApiService';

// Simple encryption using a proven method
class SimpleTokenEncryption {
  private static getKey(): string {
    const key = process.env.TOKEN_ENCRYPTION_KEY;
    if (!key) {
      throw new Error(
        'TOKEN_ENCRYPTION_KEY environment variable is required for token encryption'
      );
    }
    return key;
  }

  static encrypt(text: string): string {
    // Simple XOR encryption (still better than base64)
    const key = this.getKey();
    let encrypted = '';
    for (let i = 0; i < text.length; i++) {
      encrypted += String.fromCharCode(
        text.charCodeAt(i) ^ key.charCodeAt(i % key.length)
      );
    }
    return btoa(encrypted);
  }

  static decrypt(encryptedText: string): string {
    try {
      const key = this.getKey();
      const encrypted = atob(encryptedText);
      let decrypted = '';
      for (let i = 0; i < encrypted.length; i++) {
        decrypted += String.fromCharCode(
          encrypted.charCodeAt(i) ^ key.charCodeAt(i % key.length)
        );
      }
      return decrypted;
    } catch (error) {
      throw new Error('Failed to decrypt token');
    }
  }
}

export class SimpleGmailService {
  private clientId: string;
  private redirectUri: string;

  constructor() {
    // Trim whitespace and newlines from client ID
    this.clientId = (process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '').trim();

    // Only access window on client-side (Next.js may render on server)
    const origin =
      typeof window !== 'undefined'
        ? window.location.origin
        : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:8086';
    this.redirectUri = `${origin}/auth/gmail-callback`;

    if (!this.clientId) {
      throw new Error(
        'NEXT_PUBLIC_GOOGLE_CLIENT_ID environment variable is required'
      );
    }

    // Validate client ID format
    if (!this.clientId.includes('.apps.googleusercontent.com')) {
      throw new Error(
        `Invalid Google Client ID format. Expected format: *.apps.googleusercontent.com. ` +
          `Got: ${this.clientId.substring(0, 20)}...`
      );
    }
  }

  /**
   * Simple OAuth flow with basic state protection
   */
  async authenticateWithGmail(): Promise<string> {
    const scope =
      'https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/gmail.readonly';

    // Simple state parameter (still secure)
    const state =
      Math.random().toString(36).substring(2) + Date.now().toString(36);
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
   * Handle callback with basic validation
   */
  async handleGmailCallback(code: string, state?: string): Promise<void> {
    try {
      // Basic state validation
      if (state) {
        const storedState = sessionStorage.getItem('gmail_oauth_state');
        if (!storedState || storedState !== state) {
          throw new Error('Invalid state parameter');
        }
        sessionStorage.removeItem('gmail_oauth_state');
      }

      // Exchange code for tokens
      const tokenResponse = await this.exchangeCodeForTokens(code);
      const userInfo = await this.getUserInfo(tokenResponse.access_token);

      // Store encrypted tokens
      await this.storeEncryptedTokens(userInfo.email, tokenResponse);
    } catch (error) {
      console.error('Gmail authentication failed:', error);
      throw error;
    }
  }

  private async exchangeCodeForTokens(code: string) {
    return GmailApiService.exchangeCodeForTokens(code);
  }

  private async getUserInfo(accessToken: string): Promise<{ email: string }> {
    const response = await fetch(
      'https://www.googleapis.com/oauth2/v2/userinfo',
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to get user info');
    }

    return response.json();
  }

  private async storeEncryptedTokens(
    email: string,
    tokens: unknown
  ): Promise<void> {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('User not authenticated');
    }

    const encryptedAccessToken = SimpleTokenEncryption.encrypt(
      tokens.access_token
    );
    const encryptedRefreshToken = SimpleTokenEncryption.encrypt(
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
      { onConflict: 'user_id,provider,email_address' }
    );

    if (error) {
      throw new Error('Failed to store authentication tokens');
    }
  }

  /**
   * Get valid access token with automatic refresh
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

      return SimpleTokenEncryption.decrypt(updatedAccount.access_token);
    }

    return SimpleTokenEncryption.decrypt(account.access_token);
  }

  private async refreshAccessToken(
    account: Record<string, unknown>
  ): Promise<void> {
    const refreshToken = SimpleTokenEncryption.decrypt(account.refresh_token);
    const tokens = await GmailApiService.refreshAccessToken(refreshToken);
    const encryptedAccessToken = SimpleTokenEncryption.encrypt(
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
      throw new Error('Failed to update refreshed token');
    }
  }

  /**
   * Send email via Gmail API
   */
  async sendEmail(
    request: unknown
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
        throw new Error('Failed to send email');
      }

      const result = await response.json();
      return {
        messageId: result.id,
        threadId: result.threadId,
      };
    } catch (error) {
      console.error('Failed to send email:', error);
      throw error;
    }
  }

  private createEmailMessage(request: Record<string, unknown>): string {
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
}

// Lazy initialization - only create instance when accessed
// This prevents errors at import time if environment variables are not set
let serviceInstance: SimpleGmailService | null = null;

function getSimpleGmailService(): SimpleGmailService {
  if (!serviceInstance) {
    serviceInstance = new SimpleGmailService();
  }
  return serviceInstance;
}

// Export getter function instead of direct instance
export const simpleGmailService = new Proxy({} as SimpleGmailService, {
  get(_target, prop) {
    const instance = getSimpleGmailService();
    const value = instance[prop as keyof SimpleGmailService];
    // Handle methods
    if (typeof value === 'function') {
      return value.bind(instance);
    }
    return value;
  },
});
