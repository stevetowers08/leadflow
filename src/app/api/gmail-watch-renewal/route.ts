import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { APIErrorHandler } from '@/lib/api-error-handler';

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
    const envCheck = APIErrorHandler.validateEnvVars([
      'NEXT_PUBLIC_SUPABASE_URL',
      'SUPABASE_SERVICE_ROLE_KEY',
    ]);

    if (!envCheck.allPresent) {
      return APIErrorHandler.handleError(
        new Error(`Missing environment variables: ${envCheck.missing.join(', ')}`),
        'gmail-watch-renewal'
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

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
        const { access_token, watch_expiration } = integration.config as any;

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
              ...integration.config,
              watch_history_id: watchData.historyId,
              watch_expiration: watchData.expiration,
            },
            updated_at: new Date().toISOString(),
          })
          .eq('id', integration.id);

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


