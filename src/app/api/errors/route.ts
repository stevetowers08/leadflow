import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Error logging API endpoint
 * Receives error logs from the client and stores them in Supabase
 */
export async function POST(request: NextRequest) {
  try {
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const {
      message,
      stack,
      timestamp,
      userAgent,
      url,
      type = 'unknown',
      componentName,
      userId,
      sessionId,
      metadata = {},
    } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Error message is required' },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Note: error_logs table doesn't exist - using activity_log instead
    // Log error to activity_log if needed, otherwise just log to console
    try {
      await supabase.from('activity_log').insert({
        activity_type: 'manual_note',
        metadata: {
          message,
          stack,
          timestamp: timestamp || new Date().toISOString(),
          user_agent: userAgent,
          url,
          type,
          component_name: componentName,
          user_id: userId,
          session_id: sessionId,
          ...metadata,
        } as Record<string, unknown>,
      });
    } catch (logError) {
      console.error('Failed to log error to database:', logError);
    }

    return NextResponse.json(
      { id: `error-${Date.now()}` },
      { status: 200 }
    );
  } catch (error) {
    // Silently fail to prevent recursive error logging
    console.error('Error in error logging endpoint:', error);
    return NextResponse.json(
      { id: `error-${Date.now()}`, message: 'Error logged locally' },
      { status: 200 }
    );
  }
}

