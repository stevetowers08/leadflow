/**
 * HubSpot Authentication Service
 * Handles OAuth token exchange and connection management
 */

interface HubSpotTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

interface HubSpotConnection {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  user_id: string;
}

export class HubSpotAuthService {
  /**
   * Exchange authorization code for access tokens
   */
  static async exchangeCodeForTokens(
    code: string,
    clientId: string,
    clientSecret: string,
    redirectUri: string
  ): Promise<HubSpotTokens> {
    const response = await fetch('https://api.hubapi.com/oauth/v1/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        code,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`HubSpot token exchange failed: ${error}`);
    }

    return await response.json();
  }

  /**
   * Save HubSpot connection to database
   */
  static async saveConnection(
    userId: string,
    tokens: HubSpotTokens
  ): Promise<void> {
    const { supabase } = await import('@/integrations/supabase/client');
    
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + tokens.expires_in);

    const connection: HubSpotConnection = {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: expiresAt.getTime(),
      user_id: userId,
    };

    // Save to user_profiles metadata or a dedicated integrations table
    const { error } = await supabase
      .from('user_profiles')
      .update({
        metadata: {
          hubspot: connection,
        },
      })
      .eq('id', userId);

    if (error) {
      throw new Error(`Failed to save HubSpot connection: ${error.message}`);
    }
  }

  /**
   * Get stored HubSpot connection for user
   */
  static async getConnection(userId: string): Promise<HubSpotConnection | null> {
    const { supabase } = await import('@/integrations/supabase/client');
    
    const { data, error } = await supabase
      .from('user_profiles')
      .select('metadata')
      .eq('id', userId)
      .single();

    if (error || !data?.metadata?.hubspot) {
      return null;
    }

    return data.metadata.hubspot as HubSpotConnection;
  }

  /**
   * Refresh access token using refresh token
   */
  static async refreshToken(
    refreshToken: string,
    clientId: string,
    clientSecret: string
  ): Promise<HubSpotTokens> {
    const response = await fetch('https://api.hubapi.com/oauth/v1/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`HubSpot token refresh failed: ${error}`);
    }

    return await response.json();
  }
}

