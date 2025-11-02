import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { APIErrorHandler } from '@/lib/api-error-handler';

interface GmailWatchRequest {
  topicName: string;
  labelIds: string[];
}

interface GmailWatchResponse {
  historyId: string;
  expiration: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

// Handle CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function POST(request: NextRequest) {
  try {
    // Validate environment variables
    const envCheck = APIErrorHandler.validateEnvVars([
      'NEXT_PUBLIC_SUPABASE_URL',
      'SUPABASE_SERVICE_ROLE_KEY',
    ]);

    if (!envCheck.allPresent) {
      return APIErrorHandler.handleError(
        new Error(`Missing environment variables: ${envCheck.missing.join(', ')}`),
        'gmail-watch-setup'
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = await request.json();
    const { userId, accessToken } = body;

    if (!userId || !accessToken) {
      return APIErrorHandler.handleError(
        new Error('User ID and access token required'),
        'gmail-watch-setup'
      );
    }

    // Get user's email from auth.users using admin client
    const { data: user, error: userError } =
      await supabase.auth.admin.getUserById(userId);

    if (userError || !user) {
      return APIErrorHandler.handleError(
        new Error('User not found'),
        'gmail-watch-setup'
      );
    }

    // Set up Gmail watch
    const watchRequest: GmailWatchRequest = {
      topicName:
        process.env.GMAIL_PUBSUB_TOPIC ||
        'projects/your-project-id/topics/gmail-replies',
      labelIds: ['INBOX'],
    };

    const watchResponse = await fetch(
      'https://gmail.googleapis.com/gmail/v1/users/me/watch',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(watchRequest),
      }
    );

    if (!watchResponse.ok) {
      const errorText = await watchResponse.text();
      console.error('Gmail watch setup failed:', errorText);
      return APIErrorHandler.handleError(
        new Error('Failed to set up Gmail watch'),
        'gmail-watch-setup'
      );
    }

    const watchData: GmailWatchResponse = await watchResponse.json();

    // Store watch information in integrations table
    const { error: integrationError } = await supabase
      .from('integrations')
      .upsert({
        platform: 'gmail',
        connected: true,
        config: {
          access_token: accessToken,
          watch_history_id: watchData.historyId,
          watch_expiration: watchData.expiration,
          user_email: user.user.email,
        },
        updated_at: new Date().toISOString(),
      });

    if (integrationError) {
      console.error('Failed to store Gmail integration:', integrationError);
      return APIErrorHandler.handleError(
        new Error('Failed to store Gmail integration'),
        'gmail-watch-setup'
      );
    }

    return NextResponse.json(
      {
        success: true,
        historyId: watchData.historyId,
        expiration: watchData.expiration,
      },
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in gmail-watch-setup:', error);
    const errorResponse = APIErrorHandler.handleError(error, 'gmail-watch-setup');
    const headers = new Headers(errorResponse.headers);
    Object.entries(corsHeaders).forEach(([key, value]) => {
      headers.set(key, value);
    });
    return new NextResponse(errorResponse.body, {
      status: errorResponse.status,
      headers,
    });
  }
}


