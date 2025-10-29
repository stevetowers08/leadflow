/**
 * Mailchimp Authentication Service
 * Handles API key authentication and token management
 */

import { supabase } from '@/integrations/supabase/client';

export interface MailchimpAuthTokens {
  accessToken: string;
  dataCenter: string;
  primaryListId?: string;
}

export class MailchimpAuthService {
  /**
   * Save connection to database
   */
  static async saveConnection(
    userId: string,
    tokens: MailchimpAuthTokens
  ): Promise<unknown> {
    const { data, error } = await supabase
      .from('mailchimp_connections')
      .upsert(
        {
          user_id: userId,
          access_token: tokens.accessToken,
          data_center: tokens.dataCenter,
          primary_list_id: tokens.primaryListId,
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
      .from('mailchimp_connections')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching Mailchimp connection:', error);
      return null;
    }

    return data;
  }

  /**
   * Disconnect Mailchimp integration
   */
  static async disconnect(userId: string): Promise<void> {
    const { error } = await supabase
      .from('mailchimp_connections')
      .update({ is_active: false })
      .eq('user_id', userId);

    if (error) throw error;
  }

  /**
   * Test connection to Mailchimp API
   */
  static async testConnection(
    apiKey: string,
    dataCenter: string
  ): Promise<boolean> {
    try {
      // Create Basic Auth header manually for browser compatibility
      const credentials = `anystring:${apiKey}`;
      const auth = btoa(credentials);
      const response = await fetch(
        `https://${dataCenter}.api.mailchimp.com/3.0/ping`,
        {
          headers: {
            Authorization: `Basic ${auth}`,
          },
        }
      );

      return response.ok && response.status === 200;
    } catch {
      return false;
    }
  }
}
