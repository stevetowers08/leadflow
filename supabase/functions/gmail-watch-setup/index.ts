import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

interface GmailWatchRequest {
  topicName: string;
  labelIds: string[];
}

interface GmailWatchResponse {
  historyId: string;
  expiration: string;
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { userId, accessToken } = await req.json();

    if (!userId || !accessToken) {
      return new Response(
        JSON.stringify({ error: 'User ID and access token required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user's email from auth.users using admin client
    const { data: user, error: userError } =
      await supabase.auth.admin.getUserById(userId);

    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Set up Gmail watch
    const watchRequest: GmailWatchRequest = {
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
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(watchRequest),
      }
    );

    if (!watchResponse.ok) {
      const errorText = await watchResponse.text();
      console.error('Gmail watch setup failed:', errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to set up Gmail watch' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const watchData: GmailWatchResponse = await watchResponse.json();

    // Store watch information in integrations table
    const { error: integrationError } = await supabase
      .from('integrations')
      .upsert({
        platform: 'gmail',
        connected: true,
        config: {
          access_token: accessToken,
          watch_history_id: watchData.historyId,
          watch_expiration: watchData.expiration,
          user_email: user.user.email,
        },
        updated_at: new Date().toISOString(),
      });

    if (integrationError) {
      console.error('Failed to store Gmail integration:', integrationError);
      return new Response(
        JSON.stringify({ error: 'Failed to store Gmail integration' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Gmail watch set up successfully',
        historyId: watchData.historyId,
        expiration: watchData.expiration,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Gmail watch setup error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
