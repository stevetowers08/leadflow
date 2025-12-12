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

    // Insert error into database
    const { data, error } = await supabase
      .from('error_logs')
      .insert({
        message,
        stack,
        timestamp: timestamp || new Date().toISOString(),
        user_agent: userAgent,
        url,
        type,
        component_name: componentName,
        user_id: userId,
        session_id: sessionId,
        metadata,
      })
      .select('id')
      .single();

    if (error) {
      console.error('Failed to log error to database:', error);
      // Return 200 anyway to prevent recursive error logging
      return NextResponse.json(
        { id: `error-${Date.now()}`, message: 'Error logged locally' },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { id: data?.id || `error-${Date.now()}` },
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

