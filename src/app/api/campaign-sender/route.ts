import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 60;

/**
 * Vercel Cron Job Handler for Campaign Sender
 *
 * Security: Verifies Authorization header matches CRON_SECRET
 * Schedule: Daily at midnight (0 0 * * *) as configured in vercel.json
 *
 * @see https://vercel.com/docs/cron-jobs
 */
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret for security (Vercel sends this in Authorization header)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    // In production, verify the cron secret
    // In development, allow if CRON_SECRET is not set (for local testing)
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      console.warn('⚠️ Unauthorized cron job attempt', {
        hasAuthHeader: !!authHeader,
        hasCronSecret: !!cronSecret,
      });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('🕐 Cron job triggered campaign sender');

    // Validate required environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      const error = 'Missing Supabase environment variables';
      console.error('❌', error, {
        hasSupabaseUrl: !!supabaseUrl,
        hasSupabaseAnonKey: !!supabaseAnonKey,
      });
      return NextResponse.json({ error, success: false }, { status: 500 });
    }

    // Call the Supabase Edge Function
    const response = await fetch(
      `${supabaseUrl}/functions/v1/campaign-sender`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      const error = `Campaign sender failed: ${response.status} ${errorText}`;
      console.error('❌', error);
      return NextResponse.json(
        {
          success: false,
          error,
          statusCode: response.status,
        },
        { status: response.status }
      );
    }

    const result = await response.json();
    console.log('✅ Campaign sender completed:', {
      success: true,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Cron job executed successfully',
        campaignResult: result,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error('💥 Cron job error:', {
      error: errorMessage,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
