/**
 * HubSpot Authentication Service
 * Handles OAuth flow and token management
 */

import { supabase } from '@/integrations/supabase/client';

export interface HubSpotAuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: string;
  hubId?: string;
  portalId?: string;
}

export class HubSpotAuthService {
  private static readonly HUBSPOT_AUTH_BASE_URL =
    'https://app.hubspot.com/oauth';
  private static readonly API_BASE_URL = 'https://api.hubapi.com';

  /**
   * Generate HubSpot OAuth authorization URL
   */
  static getAuthUrl(
    clientId: string,
    redirectUri: string,
    scopes: string[]
  ): string {
    const scopeString = scopes.join(' ');
    const encodedRedirectUri = encodeURIComponent(redirectUri);
    return `${this.HUBSPOT_AUTH_BASE_URL}/authorize?client_id=${clientId}&redirect_uri=${encodedRedirectUri}&scope=${scopeString}`;
  }

  /**
   * Exchange authorization code for access token
   */
  static async exchangeCodeForTokens(
    code: string,
    clientId: string,
    clientSecret: string,
    redirectUri: string
  ): Promise<HubSpotAuthTokens> {
    const url = `${this.API_BASE_URL}/oauth/v1/token`;

    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('client_id', clientId);
    params.append('client_secret', clientSecret);
    params.append('redirect_uri', redirectUri);
    params.append('code', code);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });

      if (!response.ok) {
        const error = await response
          .json()
          .catch(() => ({ message: response.statusText }));
        throw new Error(
          `Token exchange failed: ${error.message || response.statusText}`
        );
      }

      const data = await response.json();

      return {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt: data.expires_in
          ? new Date(Date.now() + data.expires_in * 1000).toISOString()
          : undefined,
        hubId: data.hub_id,
        portalId: data.hub_id,
      };
    } catch (error) {
      console.error('HubSpot token exchange error:', error);
      throw error;
    }
  }

  /**
   * Refresh access token using refresh token
   */
  static async refreshAccessToken(
    refreshToken: string,
    clientId: string,
    clientSecret: string
  ): Promise<HubSpotAuthTokens> {
    const url = `${this.API_BASE_URL}/oauth/v1/token`;

    const params = new URLSearchParams();
    params.append('grant_type', 'refresh_token');
    params.append('client_id', clientId);
    params.append('client_secret', clientSecret);
    params.append('refresh_token', refreshToken);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });

      if (!response.ok) {
        const error = await response
          .json()
          .catch(() => ({ message: response.statusText }));
        throw new Error(
          `Token refresh failed: ${error.message || response.statusText}`
        );
      }

      const data = await response.json();

      return {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt: data.expires_in
          ? new Date(Date.now() + data.expires_in * 1000).toISOString()
          : undefined,
        hubId: data.hub_id,
        portalId: data.hub_id,
      };
    } catch (error) {
      console.error('HubSpot token refresh error:', error);
      throw error;
    }
  }

  /**
   * Save connection to database
   */
  static async saveConnection(
    userId: string,
    tokens: HubSpotAuthTokens
  ): Promise<unknown> {
    const { data, error } = await supabase
      .from('hubspot_connections')
      .upsert(
        {
          user_id: userId,
          access_token: tokens.accessToken,
          refresh_token: tokens.refreshToken,
          expires_at: tokens.expiresAt,
          hub_id: tokens.hubId,
          portal_id: tokens.portalId,
          is_active: true,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'user_id',
        }
      )
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Get connection for current user
   */
  static async getConnection(userId: string): Promise<unknown | null> {
    const { data, error } = await supabase
      .from('hubspot_connections')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching HubSpot connection:', error);
      return null;
    }

    return data;
  }

  /**
   * Check if token is expired and refresh if needed
   */
  static async ensureValidToken(userId: string): Promise<string | null> {
    const connection = (await this.getConnection(userId)) as {
      access_token: string;
      refresh_token: string;
      expires_at: string;
      hub_id: string;
    } | null;

    if (!connection) return null;

    const expiresAt = connection.expires_at
      ? new Date(connection.expires_at)
      : null;
    const now = new Date();

    // If token expires within 5 minutes, refresh it
    if (expiresAt && expiresAt.getTime() - now.getTime() < 5 * 60 * 1000) {
      try {
        const clientId = process.env.NEXT_PUBLIC_HUBSPOT_CLIENT_ID || '';
        const clientSecret = process.env.HUBSPOT_CLIENT_SECRET;

        if (!clientId || !clientSecret) {
          console.error('HubSpot client credentials not configured');
          return null;
        }

        const newTokens = await this.refreshAccessToken(
          connection.refresh_token,
          clientId,
          clientSecret
        );

        await this.saveConnection(userId, newTokens);
        return newTokens.accessToken;
      } catch (error) {
        console.error('Error refreshing HubSpot token:', error);
        return null;
      }
    }

    return connection.access_token;
  }

  /**
   * Disconnect HubSpot integration
   */
  static async disconnect(userId: string): Promise<void> {
    const { error } = await supabase
      .from('hubspot_connections')
      .update({ is_active: false })
      .eq('user_id', userId);

    if (error) throw error;
  }
}
