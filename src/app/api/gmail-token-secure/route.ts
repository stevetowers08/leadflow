import { NextRequest, NextResponse } from 'next/server';
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

function validateCode(code: string): boolean {
  return typeof code === 'string' && code.length > 10 && code.length < 1000;
}

export async function POST(request: NextRequest) {
  try {
    const envCheck = APIErrorHandler.validateEnvVars([
      'NEXT_PUBLIC_GOOGLE_CLIENT_ID',
      'GOOGLE_CLIENT_SECRET',
    ]);

    if (!envCheck.allPresent) {
      return APIErrorHandler.handleError(
        new Error(`Missing environment variables: ${envCheck.missing.join(', ')}`),
        'gmail-token-secure'
      );
    }

    const body = await request.json();
    const { code } = body;

    if (!code || !validateCode(code)) {
      return APIErrorHandler.handleError(
        new Error('Invalid authorization code'),
        'gmail-token-secure'
      );
    }

    const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;
    const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;

    const origin = request.headers.get('origin') || request.headers.get('host');
    const redirectUri = origin
      ? `${origin.startsWith('http') ? origin : `https://${origin}`}/auth/gmail-callback`
      : `${process.env.NEXT_PUBLIC_SUPABASE_URL?.split('/functions')[0] || ''}/auth/gmail-callback`;

    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      return APIErrorHandler.handleError(
        new Error(`Token exchange failed: ${tokenResponse.status}`),
        'gmail-token-secure'
      );
    }

    const tokenData = await tokenResponse.json();

    return NextResponse.json(
      {
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        expires_in: tokenData.expires_in,
      },
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    return APIErrorHandler.handleError(error, 'gmail-token-secure');
  }
}


