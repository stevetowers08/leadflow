import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');
  const errorCode = searchParams.get('error_code');

  // if "next" is in param, use it as the redirect URL
  let next = searchParams.get('next') ?? '/';
  if (!next.startsWith('/')) {
    // if "next" is not a relative URL, use the default
    next = '/';
  }

  // Check if we already have a message param - this means we've already processed the error
  // Render error page HTML directly
  const existingMessage = searchParams.get('message');
  if (existingMessage && !code) {
    // Render error page HTML
    return new NextResponse(
      `<!DOCTYPE html>
<html>
<head>
  <title>Authentication Failed</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
  <div style="min-height: 100vh; display: flex; align-items: center; justify-center; background: #f9fafb; font-family: system-ui, -apple-system, sans-serif;">
    <div style="text-align: center; max-width: 28rem; margin: 0 auto; padding: 1.5rem;">
      <div style="margin-bottom: 1rem;">
        <svg style="margin: 0 auto; height: 3rem; width: 3rem; color: #ef4444;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </div>
      <h2 style="font-size: 1.5rem; font-weight: 700; color: #111827; margin-bottom: 0.5rem;">Authentication Failed</h2>
      <p style="color: #4b5563; font-size: 0.875rem; margin-bottom: 1.5rem;">${existingMessage}</p>
      <button onclick="window.location.href='/'" style="padding: 0.5rem 1rem; background: #2563eb; color: white; border-radius: 0.375rem; border: none; cursor: pointer; font-size: 0.875rem;">Return to Home</button>
    </div>
  </div>
</body>
</html>`,
      {
        status: 200,
        headers: { 'Content-Type': 'text/html' },
      }
    );
  }

  // Handle OAuth errors from Supabase
  if (error) {
    console.error('OAuth error:', error, errorCode, errorDescription);

    // For bad_oauth_state, redirect with error message
    if (errorCode === 'bad_oauth_state') {
      const redirectTo = new URL('/auth/callback', origin);
      redirectTo.searchParams.set('error', 'session_expired');
      redirectTo.searchParams.set(
        'message',
        'Authentication session expired. Please try signing in again.'
      );
      return NextResponse.redirect(redirectTo);
    }

    // For other errors, redirect to error page
    const redirectTo = new URL('/auth/callback', origin);
    redirectTo.searchParams.set('error', error);
    redirectTo.searchParams.set(
      'message',
      errorDescription || 'Authentication failed'
    );
    return NextResponse.redirect(redirectTo);
  }

  if (code) {
    const supabase = await createClient();
    const { error: exchangeError } =
      await supabase.auth.exchangeCodeForSession(code);

    if (!exchangeError) {
      const forwardedHost = request.headers.get('x-forwarded-host'); // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === 'development';

      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    } else {
      // Code exchange failed - log and redirect with error
      console.error('Failed to exchange code for session:', exchangeError);
      const redirectTo = new URL('/auth/callback', origin);
      redirectTo.searchParams.set('error', 'exchange_failed');
      redirectTo.searchParams.set(
        'message',
        exchangeError.message || 'Failed to complete authentication'
      );
      return NextResponse.redirect(redirectTo);
    }
  }

  // No code provided - return the user to an error page with instructions
  const redirectTo = new URL('/auth/callback', origin);
  redirectTo.searchParams.set('error', 'no_code');
  redirectTo.searchParams.set('message', 'No authorization code received');
  return NextResponse.redirect(redirectTo);
}
