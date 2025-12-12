import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Proxy endpoint for Lemlist API campaigns
 * This solves CORS issues by making the request server-side
 */
export async function GET(request: NextRequest) {
  try {
    // Get user ID from query param
    const userId = request.nextUrl.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 401 }
      );
    }

    // Get API key from user profile
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
    const lemlistEmail = metadata?.lemlist_email as string | undefined;

    if (!apiKey || typeof apiKey !== 'string' || apiKey.trim().length === 0) {
      return NextResponse.json(
        { error: 'Lemlist API key not configured' },
        { status: 400 }
      );
    }

    if (!lemlistEmail || typeof lemlistEmail !== 'string' || lemlistEmail.trim().length === 0) {
      return NextResponse.json(
        { error: 'Lemlist email not configured' },
        { status: 400 }
      );
    }

    // Make request to Lemlist API
    // Official format per docs: :apiKey (empty username, API key as password)
    // Reference: https://developer.lemlist.com/api-reference/getting-started/authentication
    const lemlistUrl = 'https://api.lemlist.com/api/campaigns';
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
        error: 'Failed to fetch campaigns',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

