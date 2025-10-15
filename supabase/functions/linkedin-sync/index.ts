import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

serve(async req => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { userId } = await req.json();

    // Get user's LinkedIn token
    const { data: tokenData, error: tokenError } = await supabaseClient
      .from('linkedin_user_tokens')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .single();

    if (tokenError || !tokenData) {
      throw new Error('No active LinkedIn token found');
    }

    // Check if token is expired
    if (new Date(tokenData.expires_at) < new Date()) {
      // Try to refresh token
      const refreshResponse = await fetch(
        'https://www.linkedin.com/oauth/v2/accessToken',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: tokenData.refresh_token,
            client_id: Deno.env.get('LINKEDIN_CLIENT_ID')!,
            client_secret: Deno.env.get('LINKEDIN_CLIENT_SECRET')!,
          }),
        }
      );

      if (!refreshResponse.ok) {
        throw new Error('Failed to refresh LinkedIn token');
      }

      const refreshData = await refreshResponse.json();

      // Update token in database
      await supabaseClient
        .from('linkedin_user_tokens')
        .update({
          access_token: refreshData.access_token,
          expires_at: new Date(
            Date.now() + refreshData.expires_in * 1000
          ).toISOString(),
        })
        .eq('user_id', userId);

      tokenData.access_token = refreshData.access_token;
    }

    // Get LinkedIn profile
    const profileResponse = await fetch(
      'https://api.linkedin.com/v2/people/~',
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!profileResponse.ok) {
      throw new Error('Failed to fetch LinkedIn profile');
    }

    const profileData = await profileResponse.json();

    // Get connections
    const connectionsResponse = await fetch(
      'https://api.linkedin.com/v2/people/~/connections',
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    let connections = [];
    if (connectionsResponse.ok) {
      const connectionsData = await connectionsResponse.json();
      connections = connectionsData.elements || [];
    }

    // Update user's LinkedIn profile ID
    await supabaseClient
      .from('linkedin_user_tokens')
      .update({ linkedin_profile_id: profileData.id })
      .eq('user_id', userId);

    // Process connections and match to people
    let matchedCount = 0;
    for (const connection of connections) {
      const connectionName = `${connection.firstName.localized.en_US} ${connection.lastName.localized.en_US}`;

      // Try to find matching person in database
      const { data: personData, error: personError } = await supabaseClient
        .from('people')
        .select('*')
        .eq('owner_id', userId)
        .or(
          `linkedin_url.eq.${connection.profileUrl},name.ilike.%${connectionName}%`
        )
        .limit(1)
        .single();

      if (personData && !personError) {
        // Update person with LinkedIn data
        await supabaseClient
          .from('people')
          .update({
            linkedin_url: connection.profileUrl,
            linkedin_profile_id: connection.id,
            linkedin_connected: 'checked',
            connected_at: connection.connectedAt || new Date().toISOString(),
            last_interaction_at: new Date().toISOString(),
          })
          .eq('id', personData.id);

        // Create interaction record
        await supabaseClient.from('interactions').insert({
          person_id: personData.id,
          interaction_type: 'linkedin_connected',
          occurred_at: connection.connectedAt || new Date().toISOString(),
          content: `Connected with ${connectionName}`,
          metadata: {
            linkedinId: connection.id,
            profileUrl: connection.profileUrl,
          },
        });

        matchedCount++;
      }
    }

    // Update last sync timestamp
    await supabaseClient.from('linkedin_user_settings').upsert({
      user_id: userId,
      last_sync_at: new Date().toISOString(),
      auto_sync_enabled: true,
      sync_frequency_minutes: 15,
      webhook_enabled: true,
    });

    return new Response(
      JSON.stringify({
        success: true,
        connections: connections.length,
        matched: matchedCount,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('LinkedIn sync error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
