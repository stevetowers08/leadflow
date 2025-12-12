import { NextRequest, NextResponse } from 'next/server';
import { APIErrorHandler } from '@/lib/api-error-handler';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import type { Json } from '@/integrations/supabase/types';

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

interface EmailData {
  to: string;
  subject: string;
  body?: string;
}

async function sendEmail(
  accessToken: string,
  emailData: EmailData,
  userId: string
) {
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
  let userId: string | null = null;
  try {
    const supabase = createServerSupabaseClient();

    const body = await request.json();
    const { userId: bodyUserId, accessToken, operation, emailData } = body;
    userId = bodyUserId || null;

    if (!userId || !accessToken) {
      return APIErrorHandler.handleError(
        new Error('User ID and access token are required'),
        'gmail-sync'
      );
    }

    if (!operation) {
      return APIErrorHandler.handleError(
        new Error(
          'Operation type is required (sync_inbox, sync_sent, send_email)'
        ),
        'gmail-sync'
      );
    }

    interface SyncResult {
      synced?: number;
      messageId?: string;
      threadId?: string;
      operation: string;
    }

    let result: SyncResult;

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
          new Error(
            `Unknown operation: ${operation}. Supported: sync_inbox, sync_sent, send_email`
          ),
          'gmail-sync'
        );
    }

    // Log to activity_log for monitoring (email_sync_logs table doesn't exist)
    try {
      await supabase.from('activity_log').insert({
        activity_type: 'email_sent',
        metadata: JSON.parse(JSON.stringify(result)) as unknown as Json,
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

    // Log error to activity_log (email_sync_logs table doesn't exist)
    try {
      const supabase = createServerSupabaseClient();

      await supabase.from('activity_log').insert({
        activity_type: 'email_sent',
        metadata: {
          operation: 'function_error',
          error: error instanceof Error ? error.message : 'Unknown error',
        } as unknown as Json,
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
