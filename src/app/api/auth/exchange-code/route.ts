import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

/**
 * API route for exchanging OAuth authorization code for session (PKCE flow)
 * This is called by the client-side page component when it detects a code in query params
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json(
        { error: 'No authorization code provided' },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('Failed to exchange code for session:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to exchange code for session' },
        { status: 400 }
      );
    }

    if (!data.session) {
      return NextResponse.json(
        { error: 'No session created' },
        { status: 400 }
      );
    }

    // Ensure user profile exists (trigger should create it, but verify)
    if (data.session.user) {
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', data.session.user.id)
        .single();

      // If profile doesn't exist, create it (fallback if trigger didn't fire)
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
          console.error(
            '❌ Error creating user profile in exchange-code:',
            insertError
          );
          // Don't fail the auth flow if profile creation fails
        }
      }
    }

    return NextResponse.json({ success: true, session: data.session });
  } catch (error) {
    console.error('Unexpected error in code exchange:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}
