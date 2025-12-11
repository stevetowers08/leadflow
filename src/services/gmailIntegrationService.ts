import { supabase } from '@/integrations/supabase/client';
import { logSupabaseError } from '@/lib/utils';

export interface GmailIntegration {
  id: string;
  platform: string;
  connected: boolean;
  config: {
    access_token: string;
    watch_history_id: string;
    watch_expiration: string;
    user_email: string;
  };
  created_at: string;
  updated_at: string;
}

/**
 * Set up Gmail watch for reply detection
 * This function should be called after user completes Gmail OAuth
 */
export async function setupGmailWatch(
  userId: string,
  accessToken: string
): Promise<boolean> {
  try {
    // Use Next.js API route instead of Edge Function
    const apiUrl = typeof window !== 'undefined' 
      ? '/api/gmail-watch-setup' 
      : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/gmail-watch-setup`; // Fallback for SSR
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        userId,
        accessToken,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to set up Gmail watch: ${response.status}`);
    }

    const result = await response.json();
    console.log('Gmail watch set up successfully:', result);
    return true;
  } catch (error) {
    console.error('Error setting up Gmail watch:', error);
    return false;
  }
}

/**
 * Get Gmail integration status for current user
 */
export async function getGmailIntegrationStatus(): Promise<GmailIntegration | null> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    const { data: integration, error } = await supabase
      .from('integrations')
      .select('*')
      .eq('platform', 'gmail')
      .eq('connected', true)
      .single();

    if (error) {
      logSupabaseError(error, 'fetching Gmail integration');
      return null;
    }

    return integration;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error getting Gmail integration status:', error.message);
    } else {
      logSupabaseError(error, 'getting Gmail integration status');
    }
    return null;
  }
}

/**
 * Check if Gmail watch is expiring soon
 */
export function isGmailWatchExpiringSoon(
  integration: GmailIntegration
): boolean {
  const expirationDate = new Date(integration.config.watch_expiration);
  const now = new Date();
  const hoursUntilExpiration =
    (expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60);

  return hoursUntilExpiration < 24; // Expiring within 24 hours
}

/**
 * Get Gmail integration status with expiration check
 */
export async function getGmailStatus(): Promise<{
  connected: boolean;
  expiringSoon: boolean;
  expirationDate?: string;
  userEmail?: string;
}> {
  const integration = await getGmailIntegrationStatus();

  if (!integration) {
    return { connected: false, expiringSoon: false };
  }

  return {
    connected: integration.connected,
    expiringSoon: isGmailWatchExpiringSoon(integration),
    expirationDate: integration.config.watch_expiration,
    userEmail: integration.config.user_email,
  };
}
