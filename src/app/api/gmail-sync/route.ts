import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { APIErrorHandler } from '@/lib/api-error-handler';

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

async function syncInboxEmails(accessToken: string, userId: string) {
  // Simplified inbox sync - full implementation would fetch from Gmail API
  const response = await fetch(
    'https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=50&q=in:inbox',
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Gmail API error: ${response.status}`);
  }

  const data = await response.json();
  return {
    synced: data.messages?.length || 0,
    operation: 'sync_inbox',
  };
}

async function syncSentEmails(accessToken: string, userId: string) {
  const response = await fetch(
    'https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=50&q=in:sent',
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Gmail API error: ${response.status}`);
  }

  const data = await response.json();
  return {
    synced: data.messages?.length || 0,
    operation: 'sync_sent',
  };
}

async function sendEmail(accessToken: string, emailData: any, userId: string) {
  const message = [
    `To: ${emailData.to}`,
    `Subject: ${emailData.subject}`,
    `Content-Type: text/html; charset=utf-8`,
    '',
    emailData.body || '',
  ].join('\r\n');

  const response = await fetch(
    'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        raw: btoa(message)
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=+$/, ''),
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to send email: ${response.statusText}`);
  }

  const result = await response.json();
  return {
    messageId: result.id,
    threadId: result.threadId,
    operation: 'send_email',
  };
}

export async function POST(request: NextRequest) {
  try {
    const envCheck = APIErrorHandler.validateEnvVars([
      'NEXT_PUBLIC_SUPABASE_URL',
      'SUPABASE_SERVICE_ROLE_KEY',
    ]);

    if (!envCheck.allPresent) {
      return APIErrorHandler.handleError(
        new Error(`Missing environment variables: ${envCheck.missing.join(', ')}`),
        'gmail-sync'
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = await request.json();
    const { userId, accessToken, operation, emailData } = body;

    if (!userId || !accessToken) {
      return APIErrorHandler.handleError(
        new Error('User ID and access token are required'),
        'gmail-sync'
      );
    }

    if (!operation) {
      return APIErrorHandler.handleError(
        new Error('Operation type is required (sync_inbox, sync_sent, send_email)'),
        'gmail-sync'
      );
    }

    let result: any;

    switch (operation) {
      case 'sync_inbox':
        result = await syncInboxEmails(accessToken, userId);
        break;
      case 'sync_sent':
        result = await syncSentEmails(accessToken, userId);
        break;
      case 'send_email':
        if (!emailData) {
          return APIErrorHandler.handleError(
            new Error('Email data is required for send_email operation'),
            'gmail-sync'
          );
        }
        result = await sendEmail(accessToken, emailData, userId);
        break;
      default:
        return APIErrorHandler.handleError(
          new Error(`Unknown operation: ${operation}. Supported: sync_inbox, sync_sent, send_email`),
          'gmail-sync'
        );
    }

    // Log to database for monitoring
    try {
      await supabase.from('email_sync_logs').insert({
        operation_type: operation,
        status: 'success',
        metadata: result,
      });
    } catch (logError) {
      console.error('Failed to log to database:', logError);
    }

    return NextResponse.json(
      {
        success: true,
        data: result,
        timestamp: new Date().toISOString(),
      },
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Gmail sync error:', error);

    // Log error to database
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
      const supabase = createClient(supabaseUrl, supabaseServiceKey);

      await supabase.from('email_sync_logs').insert({
        operation_type: 'function_error',
        status: 'error',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      });
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }

    const errorResponse = APIErrorHandler.handleError(error, 'gmail-sync');
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


