/**
 * SECURE Gmail Token Exchange Edge Function
 * Enhanced with proper security, rate limiting, and error handling
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';

// Rate limiting storage
const rateLimitMap = new Map<string, number[]>();

// Enhanced CORS headers with security
const secureCorsHeaders = {
  'Access-Control-Allow-Origin':
    Deno.env.get('ALLOWED_ORIGINS') || 'http://localhost:3000',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
};

// Rate limiting function
function checkRateLimit(ip: string): boolean {
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
}

// Clean up old rate limit entries
function cleanupRateLimit(): void {
  const now = Date.now();
  for (const [key, requests] of rateLimitMap.entries()) {
    const recentRequests = requests.filter(time => now - time < 300000); // 5 minutes
    if (recentRequests.length === 0) {
      rateLimitMap.delete(key);
    } else {
      rateLimitMap.set(key, recentRequests);
    }
  }
}

// Enhanced error handling
class GmailAPIError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number,
    public retryable: boolean = false
  ) {
    super(message);
    this.name = 'GmailAPIError';
  }
}

serve(async req => {
  // Clean up rate limit entries periodically
  if (Math.random() < 0.01) {
    // 1% chance
    cleanupRateLimit();
  }

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: secureCorsHeaders });
  }

  try {
    // Validate request method
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...secureCorsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get client IP for rate limiting
    const clientIP =
      req.headers.get('x-forwarded-for') ||
      req.headers.get('x-real-ip') ||
      'unknown';

    // Check rate limit
    if (!checkRateLimit(clientIP)) {
      return new Response(
        JSON.stringify({
          error: 'Rate limit exceeded',
          code: 'RATE_LIMIT_EXCEEDED',
          retryAfter: 60,
        }),
        {
          status: 429,
          headers: {
            ...secureCorsHeaders,
            'Content-Type': 'application/json',
            'Retry-After': '60',
          },
        }
      );
    }

    // Validate request body
    const body = await req.json();
    const { code } = body;

    if (!code || typeof code !== 'string') {
      return new Response(
        JSON.stringify({
          error: 'Authorization code is required',
          code: 'MISSING_CODE',
        }),
        {
          status: 400,
          headers: { ...secureCorsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Validate code format (basic validation)
    if (!/^[A-Za-z0-9_-]+$/.test(code)) {
      return new Response(
        JSON.stringify({
          error: 'Invalid authorization code format',
          code: 'INVALID_CODE_FORMAT',
        }),
        {
          status: 400,
          headers: { ...secureCorsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Exchange code for tokens
    const tokenResponse = await exchangeCodeForTokens(code);

    return new Response(JSON.stringify(tokenResponse), {
      headers: { ...secureCorsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Gmail token exchange error:', error);

    // Determine error type and response
    let statusCode = 500;
    let errorCode = 'UNKNOWN_ERROR';
    let retryable = false;

    if (error instanceof GmailAPIError) {
      statusCode = error.statusCode;
      errorCode = error.code;
      retryable = error.retryable;
    } else if (error.message.includes('rate limit')) {
      statusCode = 429;
      errorCode = 'RATE_LIMIT';
      retryable = true;
    } else if (error.message.includes('invalid_grant')) {
      statusCode = 400;
      errorCode = 'INVALID_GRANT';
    }

    return new Response(
      JSON.stringify({
        error: 'Token exchange failed',
        code: errorCode,
        message: error.message || 'Unknown error',
        retryable,
      }),
      {
        status: statusCode,
        headers: { ...secureCorsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function exchangeCodeForTokens(code: string) {
  const clientId = Deno.env.get('GOOGLE_CLIENT_ID');
  const clientSecret = Deno.env.get('GOOGLE_CLIENT_SECRET');
  const redirectUri =
    Deno.env.get('GMAIL_REDIRECT_URI') ||
    'http://localhost:3000/auth/gmail-callback';

  // Validate environment variables
  if (!clientId || !clientSecret) {
    throw new GmailAPIError(
      'Google OAuth credentials not configured',
      'MISSING_CREDENTIALS',
      500
    );
  }

  // Validate redirect URI
  if (!redirectUri || !redirectUri.startsWith('http')) {
    throw new GmailAPIError(
      'Invalid redirect URI',
      'INVALID_REDIRECT_URI',
      500
    );
  }

  const tokenUrl = 'https://oauth2.googleapis.com/token';
  const tokenData = {
    client_id: clientId,
    client_secret: clientSecret,
    code: code,
    grant_type: 'authorization_code',
    redirect_uri: redirectUri,
  };

  try {
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'EmpowrCRM/1.0',
      },
      body: new URLSearchParams(tokenData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;

      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: errorText };
      }

      // Handle specific Google OAuth errors
      if (response.status === 400) {
        if (errorData.error === 'invalid_grant') {
          throw new GmailAPIError(
            'Invalid or expired authorization code',
            'INVALID_GRANT',
            400
          );
        } else if (errorData.error === 'invalid_client') {
          throw new GmailAPIError(
            'Invalid client credentials',
            'INVALID_CLIENT',
            400
          );
        }
      } else if (response.status === 429) {
        throw new GmailAPIError('Rate limit exceeded', 'RATE_LIMIT', 429, true);
      }

      throw new GmailAPIError(
        `Token exchange failed: ${errorData.error || errorText}`,
        'TOKEN_EXCHANGE_FAILED',
        response.status
      );
    }

    const tokenResponse = await response.json();

    // Validate token response
    if (!tokenResponse.access_token || !tokenResponse.refresh_token) {
      throw new GmailAPIError(
        'Invalid token response from Google',
        'INVALID_TOKEN_RESPONSE',
        500
      );
    }

    return tokenResponse;
  } catch (error) {
    if (error instanceof GmailAPIError) {
      throw error;
    }

    // Network or other errors
    throw new GmailAPIError(
      `Network error during token exchange: ${error.message}`,
      'NETWORK_ERROR',
      500,
      true
    );
  }
}
