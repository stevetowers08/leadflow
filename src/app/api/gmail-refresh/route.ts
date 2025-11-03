import { NextRequest, NextResponse } from 'next/server';
import { APIErrorHandler } from '@/lib/api-error-handler';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

// Handle CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

// Input validation
function validateRefreshToken(token: string): boolean {
  return typeof token === 'string' && token.length > 20 && token.length < 2000;
}

async function refreshAccessToken(refreshToken: string) {
  // Trim whitespace to prevent OAuth errors
  const clientId = (process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '').trim();
  const clientSecret = (process.env.GOOGLE_CLIENT_SECRET || '').trim();

  if (!clientId || !clientSecret) {
    throw new Error('Google OAuth credentials not configured');
  }

  const tokenUrl = 'https://oauth2.googleapis.com/token';
  const tokenData = {
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
  };

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(tokenData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Google OAuth refresh error:', errorText);
    throw new Error('Token refresh failed');
  }

  return await response.json();
}

export async function POST(request: NextRequest) {
  try {
    // Validate environment variables
    const envCheck = APIErrorHandler.validateEnvVars([
      'NEXT_PUBLIC_GOOGLE_CLIENT_ID',
      'GOOGLE_CLIENT_SECRET',
    ]);

    if (!envCheck.allPresent) {
      return APIErrorHandler.handleError(
        new Error(
          `Missing environment variables: ${envCheck.missing.join(', ')}`
        ),
        'gmail-refresh'
      );
    }

    const body = await request.json();
    const { refresh_token } = body;

    // Input validation
    if (!refresh_token || !validateRefreshToken(refresh_token)) {
      return APIErrorHandler.handleError(
        new Error('Invalid refresh token'),
        'gmail-refresh'
      );
    }

    // Exchange refresh token for new access token
    const tokenResponse = await refreshAccessToken(refresh_token);

    return NextResponse.json(tokenResponse, {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Gmail token refresh error:', error);

    // Don't expose internal error details
    const errorMessage =
      error instanceof Error && error.message.includes('Token refresh failed')
        ? 'Token refresh failed'
        : 'Internal server error';

    return APIErrorHandler.handleError(
      new Error(errorMessage),
      'gmail-refresh'
    );
  }
}
