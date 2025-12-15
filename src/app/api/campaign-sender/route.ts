import { NextRequest, NextResponse } from 'next/server';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
};

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function OPTIONS() {
  return new NextResponse('ok', {
    headers: corsHeaders,
  });
}

export async function GET(request: NextRequest) {
  return handleRequest(request);
}

export async function POST(request: NextRequest) {
  return handleRequest(request);
}

async function handleRequest(request: NextRequest) {
  try {
    console.log('🕐 Cron job triggered campaign sender');

    // Call the Supabase Edge Function
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase environment variables');
    }

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
      throw new Error(
        `Campaign sender failed: ${response.status} ${errorText}`
      );
    }

    const result = await response.json();
    console.log('✅ Campaign sender completed:', result);

    return NextResponse.json(
      {
        success: true,
        message: 'Cron job executed successfully',
        campaignResult: result,
        timestamp: new Date().toISOString(),
      },
      {
        headers: corsHeaders,
        status: 200,
      }
    );
  } catch (error) {
    console.error('💥 Cron job error:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      {
        headers: corsHeaders,
        status: 500,
      }
    );
  }
}
