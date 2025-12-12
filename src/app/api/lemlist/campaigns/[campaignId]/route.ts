import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Proxy endpoint for Lemlist API campaign detail
 * This solves CORS issues by making the request server-side
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { campaignId: string } }
) {
  try {
    const campaignId = params.campaignId;
    const userId = request.nextUrl.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 401 }
      );
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user profile with Lemlist credentials
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('metadata')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      );
    }

    const metadata = profile.metadata as Record<string, unknown> | null;
    const apiKey = metadata?.lemlist_api_key as string | undefined;

    if (!apiKey || typeof apiKey !== 'string' || apiKey.trim().length === 0) {
      return NextResponse.json(
        { error: 'Lemlist API key not configured' },
        { status: 400 }
      );
    }

    // Make request to Lemlist API
    const lemlistUrl = `https://api.lemlist.com/api/campaigns/${campaignId}`;
    const encoded = Buffer.from(`:${apiKey}`).toString('base64');

    const response = await fetch(lemlistUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${encoded}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { 
          error: `Lemlist API error: ${response.status}`,
          details: errorText 
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying Lemlist API request:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch campaign detail',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

