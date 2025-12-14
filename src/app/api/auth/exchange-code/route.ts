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
