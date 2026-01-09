import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Get API key from user profile
 */
async function getLemlistApiKey(userId: string): Promise<string> {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Server configuration error');
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('metadata')
    .eq('id', userId)
    .single();

  if (profileError || !profile) {
    throw new Error('User profile not found');
  }

  const metadata = profile.metadata as Record<string, unknown> | null;
  const apiKey = metadata?.lemlist_api_key as string | undefined;

  if (!apiKey || typeof apiKey !== 'string' || apiKey.trim().length === 0) {
    throw new Error('Lemlist API key not configured');
  }

  return apiKey;
}

/**
 * Proxy endpoint for Lemlist API campaign leads
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
      return NextResponse.json({ error: 'User ID required' }, { status: 401 });
    }

    let apiKey: string;
    try {
      apiKey = await getLemlistApiKey(userId);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      if (errorMessage.includes('not found')) {
        return NextResponse.json(
          { error: 'User profile not found' },
          { status: 404 }
        );
      }
      if (errorMessage.includes('not configured')) {
        return NextResponse.json(
          { error: 'Lemlist API key not configured' },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Make request to Lemlist API
    const lemlistUrl = `https://api.lemlist.com/api/campaigns/${campaignId}/leads`;
    const encoded = Buffer.from(`:${apiKey}`).toString('base64');

    const response = await fetch(lemlistUrl, {
      method: 'GET',
      headers: {
        Authorization: `Basic ${encoded}`,
        'Content-Type': 'application/json',
      },
    });

    // Handle rate limiting
    if (response.status === 429) {
      return NextResponse.json([], { status: 200 }); // Return empty array on rate limit
    }

    if (!response.ok) {
      // If no leads or campaign doesn't exist, return empty array (not an error)
      if (response.status === 404 || response.status === 400) {
        return NextResponse.json([], { status: 200 });
      }
      const errorText = await response.text();
      return NextResponse.json(
        {
          error: `Lemlist API error: ${response.status}`,
          details: errorText,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    // Ensure we return an array
    const leadsArray = Array.isArray(data) ? data : [];
    return NextResponse.json(leadsArray);
  } catch (error) {
    console.error('Error proxying Lemlist API request:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch campaign leads',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * POST handler - Add a lead to a Lemlist campaign
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { campaignId: string } }
) {
  try {
    const campaignId = params.campaignId;
    const userId = request.nextUrl.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 401 });
    }

    let apiKey: string;
    try {
      apiKey = await getLemlistApiKey(userId);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      if (errorMessage.includes('not found')) {
        return NextResponse.json(
          { error: 'User profile not found' },
          { status: 404 }
        );
      }
      if (errorMessage.includes('not configured')) {
        return NextResponse.json(
          { error: 'Lemlist API key not configured' },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { email, firstName, lastName, company } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Make request to Lemlist API
    const lemlistUrl = `https://api.lemlist.com/api/campaigns/${campaignId}/leads`;
    const encoded = Buffer.from(`:${apiKey}`).toString('base64');

    const response = await fetch(lemlistUrl, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${encoded}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        firstName,
        lastName,
        company,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        {
          error: `Lemlist API error: ${response.status}`,
          details: errorText,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error adding lead to Lemlist campaign:', error);
    return NextResponse.json(
      {
        error: 'Failed to add lead to campaign',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
