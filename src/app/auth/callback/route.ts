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
  // and should let the page component render it (avoid redirect loop)
  const existingMessage = searchParams.get('message');
  if (existingMessage && !code) {
    // Already processed - return empty response to let page component handle it
    return new NextResponse(null, { status: 200 });
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
