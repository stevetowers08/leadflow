import { NextRequest, NextResponse } from 'next/server';
import { APIErrorHandler } from '@/lib/api-error-handler';
import { createServerSupabaseClient } from '@/lib/supabase-server';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();

    // Get all active Gmail integrations
    const { data: integrations, error } = await supabase
      .from('integrations')
      .select('id, config')
      .eq('platform', 'gmail')
      .eq('connected', true);

    if (error) {
      return APIErrorHandler.handleError(
        new Error('Failed to fetch integrations'),
        'gmail-watch-renewal'
      );
    }

    if (!integrations || integrations.length === 0) {
      return NextResponse.json(
        { message: 'No Gmail integrations found' },
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    let renewedCount = 0;
    let errorCount = 0;

    // Renew watches for each integration
    for (const integration of integrations) {
      try {
        // Type guard: ensure config is an object
        const integrationTyped = integration as {
          id?: string;
          config?: unknown;
        };
        if (
          !integrationTyped.id ||
          !integrationTyped.config ||
          typeof integrationTyped.config !== 'object' ||
          Array.isArray(integrationTyped.config)
        ) {
          console.error(
            `Invalid config for integration ${integrationTyped.id || 'unknown'}`
          );
          errorCount++;
          continue;
        }

        const config = integrationTyped.config as {
          access_token?: string;
          watch_expiration?: string;
          watch_history_id?: string;
          user_email?: string;
        };

        const { access_token, watch_expiration } = config;

        if (!access_token || !watch_expiration) {
          console.error(
            `Missing required config for integration ${integrationTyped.id}`
          );
          errorCount++;
          continue;
        }

        // Check if watch is expiring soon (within 24 hours)
        const expirationDate = new Date(watch_expiration);
        const now = new Date();
        const hoursUntilExpiration =
          (expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60);

        if (hoursUntilExpiration > 24) {
          continue; // Not expiring soon, skip
        }

        // Validate Gmail Pub/Sub topic environment variable
        const pubsubTopic = process.env.GMAIL_PUBSUB_TOPIC;
        if (!pubsubTopic) {
          console.error('GMAIL_PUBSUB_TOPIC environment variable is required');
          errorCount++;
          continue;
        }

        // Set up new Gmail watch
        const watchRequest = {
          topicName: pubsubTopic,
          labelIds: ['INBOX'],
        };

        const watchResponse = await fetch(
          'https://gmail.googleapis.com/gmail/v1/users/me/watch',
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${access_token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(watchRequest),
          }
        );

        if (!watchResponse.ok) {
          errorCount++;
          continue;
        }

        const watchData = await watchResponse.json();

        // Update integration with new watch data
        await supabase
          .from('integrations')
          .update({
            config: {
              ...(config as Record<string, unknown>),
              watch_history_id: watchData.historyId,
              watch_expiration: watchData.expiration,
            },
            updated_at: new Date().toISOString(),
          })
          .eq('id', integrationTyped.id);

        renewedCount++;
      } catch (error) {
        console.error(`Error renewing watch for integration:`, error);
        errorCount++;
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Gmail watch renewal completed',
        renewed: renewedCount,
        errors: errorCount,
        total: integrations.length,
      },
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Gmail watch renewal error:', error);
    return APIErrorHandler.handleError(error, 'gmail-watch-renewal');
  }
}
