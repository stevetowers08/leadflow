import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get all active Gmail integrations
    const { data: integrations, error } = await supabase
      .from('integrations')
      .select('id, config')
      .eq('platform', 'gmail')
      .eq('connected', true);

    if (error) {
      console.error('Failed to fetch Gmail integrations:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch integrations' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (!integrations || integrations.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No Gmail integrations found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let renewedCount = 0;
    let errorCount = 0;

    // Renew watches for each integration
    for (const integration of integrations) {
      try {
        const { access_token, watch_expiration } = integration.config;

        // Check if watch is expiring soon (within 24 hours)
        const expirationDate = new Date(watch_expiration);
        const now = new Date();
        const hoursUntilExpiration =
          (expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60);

        if (hoursUntilExpiration > 24) {
          console.log(
            `Watch for ${integration.config.user_email} not expiring soon, skipping`
          );
          continue;
        }

        // Set up new Gmail watch
        const watchRequest = {
          topicName:
            Deno.env.get('GMAIL_PUBSUB_TOPIC') ||
            'projects/your-project-id/topics/gmail-replies',
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
          console.error(
            `Failed to renew watch for ${integration.config.user_email}`
          );
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
        console.log(
          `Successfully renewed watch for ${integration.config.user_email}`
        );
      } catch (error) {
        console.error(`Error renewing watch for integration:`, error);
        errorCount++;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Gmail watch renewal completed`,
        renewed: renewedCount,
        errors: errorCount,
        total: integrations.length,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Gmail watch renewal error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
