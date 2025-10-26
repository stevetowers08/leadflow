/**
 * Secure Gmail Token Refresh Edge Function
 * Handles refresh token exchange with proper security measures
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

// Rate limiting map (in production, use Redis or database)
const rateLimitMap = new Map<string, number[]>();

// Secure CORS configuration
const getAllowedOrigins = (): string[] => {
  const origins = Deno.env.get('ALLOWED_ORIGINS');
  return origins
    ? origins.split(',')
    : ['http://localhost:3000', 'https://localhost:3000'];
};

const corsHeaders = (origin?: string) => {
  const allowedOrigins = getAllowedOrigins();
  const allowedOrigin =
    origin && allowedOrigins.includes(origin) ? origin : allowedOrigins[0];

  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers':
      'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Max-Age': '86400',
  };
};

// Rate limiting check
const checkRateLimit = (ip: string): boolean => {
  const now = Date.now();
  const requests = rateLimitMap.get(ip) || [];
  const recentRequests = requests.filter(time => now - time < 60000); // 1 minute window

  if (recentRequests.length >= 5) {
    // Max 5 refresh requests per minute
    return false;
  }

  recentRequests.push(now);
  rateLimitMap.set(ip, recentRequests);
  return true;
};

// Input validation
const validateRefreshToken = (token: string): boolean => {
  // Basic validation for refresh token
  return typeof token === 'string' && token.length > 20 && token.length < 2000;
};

serve(async req => {
  const origin = req.headers.get('origin');
  const clientIP =
    req.headers.get('x-forwarded-for') ||
    req.headers.get('x-real-ip') ||
    'unknown';

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders(origin) });
  }

  try {
    // Rate limiting
    if (!checkRateLimit(clientIP)) {
      return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), {
        status: 429,
        headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' },
      });
    }

    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' },
      });
    }

    const { refresh_token } = await req.json();

    // Input validation
    if (!refresh_token || !validateRefreshToken(refresh_token)) {
      return new Response(JSON.stringify({ error: 'Invalid refresh token' }), {
        status: 400,
        headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' },
      });
    }

    // Exchange refresh token for new access token
    const tokenResponse = await refreshAccessToken(refresh_token);

    return new Response(JSON.stringify(tokenResponse), {
      headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Gmail token refresh error:', error);

    // Don't expose internal error details
    const errorMessage = error.message?.includes('Token refresh failed')
      ? 'Token refresh failed'
      : 'Internal server error';

    return new Response(
      JSON.stringify({
        error: errorMessage,
      }),
      {
        status: 500,
        headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' },
      }
    );
  }
});

async function refreshAccessToken(refreshToken: string) {
  const clientId = Deno.env.get('GOOGLE_CLIENT_ID');
  const clientSecret = Deno.env.get('GOOGLE_CLIENT_SECRET');

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
