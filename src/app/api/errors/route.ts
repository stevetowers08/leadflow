import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

interface ErrorReport {
  message: string;
  stack?: string;
  timestamp: string;
  userAgent: string;
  url: string;
  type: 'unhandled' | 'promise' | 'resource' | 'validation' | 'permission' | 'data' | 'unknown';
  componentName?: string;
  userId?: string;
  sessionId?: string;
  metadata?: Record<string, unknown>;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function POST(request: NextRequest) {
  try {
    // Validate environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse error report
    const errorReport: ErrorReport = await request.json();

    // Validate required fields
    if (!errorReport.message || !errorReport.timestamp || !errorReport.url) {
      return NextResponse.json(
        { error: 'Invalid error report format' },
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Determine severity based on error type
    let severity: 'low' | 'medium' | 'high' | 'critical' = 'medium';
    if (errorReport.type === 'resource') {
      severity = 'low';
    } else if (
      errorReport.type === 'permission' ||
      errorReport.message.includes('Unauthorized')
    ) {
      severity = 'high';
    } else if (
      errorReport.message.includes('Network') ||
      errorReport.message.includes('Failed to fetch')
    ) {
      severity = 'low';
    }

    // Store error in database
    const { error } = await supabase.from('error_logs').insert({
      message: errorReport.message,
      stack: errorReport.stack,
      timestamp: errorReport.timestamp,
      user_agent: errorReport.userAgent,
      url: errorReport.url,
      type: errorReport.type,
      severity,
      component_name: errorReport.componentName,
      user_id: errorReport.userId || null,
      session_id: errorReport.sessionId,
      metadata: errorReport.metadata || {},
    });

    if (error) {
      console.error('Failed to store error log:', error);
      // Don't fail the request if logging fails
    }

    return NextResponse.json(
      { success: true },
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in /api/errors endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
}


