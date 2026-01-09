import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxy endpoint for HubSpot OAuth token exchange
 * This solves CORS issues and keeps client secret server-side
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, redirectUri } = body;

    if (!code) {
      return NextResponse.json(
        { error: 'Authorization code is required' },
        { status: 400 }
      );
    }

    // Get credentials from environment (server-side only)
    const clientId = process.env.HUBSPOT_CLIENT_ID;
    const clientSecret = process.env.HUBSPOT_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return NextResponse.json(
        { error: 'HubSpot credentials not configured' },
        { status: 500 }
      );
    }

    // Make request to HubSpot API
    const response = await fetch('https://api.hubapi.com/oauth/v1/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri:
          redirectUri ||
          `${request.headers.get('origin') || ''}/integrations/callback`,
        code,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        {
          error: 'HubSpot token exchange failed',
          details: errorText,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error exchanging HubSpot token:', error);
    return NextResponse.json(
      {
        error: 'Failed to exchange token',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
