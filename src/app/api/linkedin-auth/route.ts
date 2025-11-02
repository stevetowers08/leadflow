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
      'LINKEDIN_REDIRECT_URI',
    ]);

    if (!envCheck.allPresent) {
      return APIErrorHandler.handleError(
        new Error(`Missing environment variables: ${envCheck.missing.join(', ')}`),
        'linkedin-auth'
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const clientId = process.env.LINKEDIN_CLIENT_ID!;
    const redirectUri = process.env.LINKEDIN_REDIRECT_URI!;

    const authHeader = request.headers.get('Authorization');
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: authHeader ? { Authorization: authHeader } : {},
      },
    });

    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return APIErrorHandler.handleError(
        new Error('User ID is required'),
        'linkedin-auth'
      );
    }

    // Generate LinkedIn OAuth URL
    const state = Buffer.from(JSON.stringify({ userId, timestamp: Date.now() })).toString('base64');
    const scopes = 'r_liteprofile,r_emailaddress,w_messaging';

    const authUrl =
      `https://www.linkedin.com/oauth/v2/authorization?` +
      `response_type=code&` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `state=${state}&` +
      `scope=${scopes}`;

    return NextResponse.json(
      {
        success: true,
        authUrl,
        timestamp: new Date().toISOString(),
      },
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('LinkedIn auth error:', error);
    return APIErrorHandler.handleError(error, 'linkedin-auth');
  }
}


