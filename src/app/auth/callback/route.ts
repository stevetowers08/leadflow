import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Server-side OAuth callback handler
 *
 * Best Practice: Handle OAuth callbacks server-side for proper cookie management
 * This ensures cookies are set correctly before redirecting
 *
 * Reference: https://supabase.com/docs/guides/auth/server-side/nextjs
 */

// Force dynamic rendering - this route must be server-rendered
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');
  const errorDescription = requestUrl.searchParams.get('error_description');
  const next = requestUrl.searchParams.get('next') || '/'; // Support redirect to original page

  // Handle OAuth errors - redirect to home with error params
  if (error) {
    console.error('OAuth error:', { error, errorDescription });
    const errorUrl = new URL('/', request.url);
    errorUrl.searchParams.set('auth_error', error);
    if (errorDescription) {
      errorUrl.searchParams.set('error_description', errorDescription);
    }
    return NextResponse.redirect(errorUrl);
  }

  // If no code, redirect to home (might be a refresh or direct access)
  if (!code) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  try {
    // Create Supabase client with proper cookie handling for route handlers
    // Best practice: Create response object first, then set cookies on it during exchange
    const cookieStore = await cookies();
    const redirectResponse = NextResponse.redirect(new URL(next, request.url));

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            // Set cookies on the redirect response
            // This is called during exchangeCodeForSession
            cookiesToSet.forEach(({ name, value, options }) => {
              redirectResponse.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    // Exchange code for session (server-side)
    // This calls setAll() which sets cookies on redirectResponse
    const { data, error: exchangeError } =
      await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      console.error('Failed to exchange code for session:', exchangeError);
      const errorUrl = new URL('/', request.url);
      errorUrl.searchParams.set('auth_error', 'exchange_failed');
      errorUrl.searchParams.set('error_description', exchangeError.message);
      return NextResponse.redirect(errorUrl);
    }

    if (!data.session) {
      console.error('No session created after code exchange');
      const errorUrl = new URL('/', request.url);
      errorUrl.searchParams.set('auth_error', 'no_session');
      errorUrl.searchParams.set('error_description', 'No session was created');
      return NextResponse.redirect(errorUrl);
    }

    // Ensure user profile exists
    if (data.session.user) {
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', data.session.user.id)
        .single();

      // If profile doesn't exist, create it
      if (profileError && profileError.code === 'PGRST116') {
        const { error: insertError } = await supabase
          .from('user_profiles')
          .insert({
            id: data.session.user.id,
            email: data.session.user.email || '',
            full_name:
              data.session.user.user_metadata?.full_name ||
              data.session.user.user_metadata?.name ||
              data.session.user.email?.split('@')[0] ||
              'User',
            role: 'user',
            is_active: true,
          });

        if (insertError) {
          console.error('❌ Error creating user profile:', insertError);
          // Don't fail the auth flow if profile creation fails
        }
      }
    }

    // Success! Redirect response already has cookies set via setAll callback
    // Cookies were set during exchangeCodeForSession
    console.log('✅ OAuth callback successful, redirecting to:', next);
    console.log(
      '✅ Cookies set on response:',
      redirectResponse.cookies.getAll().length,
      'cookies'
    );
    return redirectResponse;
  } catch (error) {
    console.error('Unexpected error in OAuth callback:', error);
    const errorUrl = new URL('/', request.url);
    errorUrl.searchParams.set('auth_error', 'unexpected_error');
    errorUrl.searchParams.set(
      'error_description',
      error instanceof Error ? error.message : 'An unexpected error occurred'
    );
    return NextResponse.redirect(errorUrl);
  }
}
