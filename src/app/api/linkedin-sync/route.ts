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
      'LINKEDIN_CLIENT_ID',
      'LINKEDIN_CLIENT_SECRET',
    ]);

    if (!envCheck.allPresent) {
      return APIErrorHandler.handleError(
        new Error(`Missing environment variables: ${envCheck.missing.join(', ')}`),
        'linkedin-sync'
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: request.headers.get('Authorization') || '',
        },
      },
    });

    const body = await request.json();
    const { userId } = body;

    // Get user's LinkedIn token
    const { data: tokenData, error: tokenError } = await supabaseClient
      .from('linkedin_user_tokens')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .single();

    if (tokenError || !tokenData) {
      return APIErrorHandler.handleError(
        new Error('No active LinkedIn token found'),
        'linkedin-sync'
      );
    }

    // Check if token is expired and refresh if needed
    let accessToken = tokenData.access_token;
    if (new Date(tokenData.expires_at) < new Date()) {
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
            client_id: process.env.LINKEDIN_CLIENT_ID!,
            client_secret: process.env.LINKEDIN_CLIENT_SECRET!,
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
          expires_at: new Date(Date.now() + refreshData.expires_in * 1000).toISOString(),
        })
        .eq('user_id', userId);

      accessToken = refreshData.access_token;
    }

    // Get LinkedIn profile (simplified)
    const profileResponse = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!profileResponse.ok) {
      throw new Error(`LinkedIn API error: ${profileResponse.status}`);
    }

    const profile = await profileResponse.json();

    return NextResponse.json(
      {
        success: true,
        profile,
        timestamp: new Date().toISOString(),
      },
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('LinkedIn sync error:', error);
    return APIErrorHandler.handleError(error, 'linkedin-sync');
  }
}


