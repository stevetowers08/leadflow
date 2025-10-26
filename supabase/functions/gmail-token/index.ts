/**
 * Secure Gmail Token Exchange Edge Function
 * Handles OAuth2 code exchange with proper security measures
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

  if (recentRequests.length >= 10) {
    // Max 10 requests per minute
    return false;
  }

  recentRequests.push(now);
  rateLimitMap.set(ip, recentRequests);
  return true;
};

// Input validation
const validateCode = (code: string): boolean => {
  // Basic validation for authorization code
  return typeof code === 'string' && code.length > 10 && code.length < 1000;
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

    const { code } = await req.json();

    // Input validation
    if (!code || !validateCode(code)) {
      return new Response(
        JSON.stringify({ error: 'Invalid authorization code' }),
        {
          status: 400,
          headers: {
            ...corsHeaders(origin),
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Exchange code for tokens
    const tokenResponse = await exchangeCodeForTokens(code);

    return new Response(JSON.stringify(tokenResponse), {
      headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Gmail token exchange error:', error);

    // Don't expose internal error details
    const errorMessage = error.message?.includes('Token exchange failed')
      ? 'Authentication failed'
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

async function exchangeCodeForTokens(code: string) {
  const clientId = Deno.env.get('GOOGLE_CLIENT_ID');
  const clientSecret = Deno.env.get('GOOGLE_CLIENT_SECRET');
  const redirectUri = Deno.env.get('GMAIL_REDIRECT_URI');

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error('Google OAuth credentials not configured');
  }

  const tokenUrl = 'https://oauth2.googleapis.com/token';
  const tokenData = {
    client_id: clientId,
    client_secret: clientSecret,
    code: code,
    grant_type: 'authorization_code',
    redirect_uri: redirectUri,
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
    console.error('Google OAuth error:', errorText);
    throw new Error('Token exchange failed');
  }

  return await response.json();
}
