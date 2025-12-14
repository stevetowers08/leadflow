import { NextRequest, NextResponse } from 'next/server';
import { APIErrorHandler } from '@/lib/api-error-handler';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { writeFile, appendFile } from 'fs/promises';
import { join } from 'path';

interface PubSubMessage {
  message: {
    data: string;
    messageId: string;
    publishTime: string;
  };
  subscription: string;
}

interface GmailNotification {
  emailAddress: string;
  historyId: string;
}

interface SentimentAnalysis {
  sentiment:
    | 'interested'
    | 'not_interested'
    | 'maybe'
    | 'out_of_office'
    | 'neutral';
  confidence: number;
  reasoning: string;
}

interface GmailHeader {
  name: string;
  value?: string;
}

interface GmailMessagePart {
  mimeType?: string;
  body?: { data?: string };
}

interface GmailMessageAdded {
  message?: {
    id?: string;
    labelIds?: string[];
  };
}

interface GmailHistoryRecord {
  messagesAdded?: GmailMessageAdded[];
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

async function processGmailReply(
  supabase: ReturnType<typeof createServerSupabaseClient>,
  messageId: string,
  accessToken: string
) {
  // Fetch message details
  const messageResponse = await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}?format=full`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!messageResponse.ok) {
    throw new Error(`Failed to fetch message: ${messageResponse.status}`);
  }

  const messageData = await messageResponse.json();

  // Extract email details
  const headers: GmailHeader[] = messageData.payload.headers || [];
  const subject = headers.find(h => h.name === 'Subject')?.value || '';
  const from = headers.find(h => h.name === 'From')?.value || '';
  const threadId = messageData.threadId;

  // Find person by email
  const emailMatch = from.match(/<(.+)>/);
  const emailAddress = emailMatch ? emailMatch[1] : from;

  const { data: lead } = await supabase
    .from('leads')
    .select('id, first_name, last_name, email')
    .eq('email', emailAddress)
    .single();

  if (!lead) {
    console.log('No lead found for email:', emailAddress);
    return;
  }

  // Extract message body
  let body = '';
  if (messageData.payload.parts) {
    const textPart = messageData.payload.parts.find(
      (p: GmailMessagePart) => p.mimeType === 'text/plain'
    );
    if (textPart?.body?.data) {
      body = atob(textPart.body.data.replace(/-/g, '+').replace(/_/g, '/'));
    }
  } else if (messageData.payload.body?.data) {
    body = atob(
      messageData.payload.body.data.replace(/-/g, '+').replace(/_/g, '/')
    );
  }

  // Analyze reply sentiment using Gemini (if configured)
  let sentiment: SentimentAnalysis | null = null;
  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (geminiApiKey && body) {
    try {
      const aiResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-001:generateContent?key=${geminiApiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Analyze this email reply and classify sentiment as: interested, not_interested, maybe, or out_of_office. Reply with JSON: {"sentiment": "...", "confidence": 0.85, "reasoning": "..."}. Email: ${body.substring(0, 500)}`,
                  },
                ],
              },
            ],
          }),
        }
      );

      if (aiResponse.ok) {
        const aiData = await aiResponse.json();
        const analysisText =
          aiData.candidates[0]?.content?.parts[0]?.text || '';
        try {
          sentiment = JSON.parse(analysisText.trim());
        } catch {
          // Fallback if JSON parsing fails
          sentiment = {
            sentiment: 'neutral',
            confidence: 0.5,
            reasoning: 'Could not analyze',
          };
        }
      }
    } catch (error) {
      console.error('Sentiment analysis error:', error);
    }
  }

  // Store reply (if email_replies table exists)
  // Note: Check if this table exists in your schema
  const receivedAt = new Date(
    messageData.internalDate || Date.now()
  ).toISOString();

  // Update lead's status based on sentiment
  if (sentiment) {
    const statusMap: Record<string, string> = {
      interested: 'active',
      not_interested: 'replied_manual',
      maybe: 'active',
      out_of_office: 'active',
    };

    await supabase
      .from('leads')
      .update({
        status: statusMap[sentiment.sentiment] || 'active',
        updated_at: new Date().toISOString(),
      })
      .eq('id', lead.id);
  }
}

// Helper function for server-side logging
async function logDebug(data: {
  location: string;
  message: string;
  data?: unknown;
  hypothesisId?: string;
}) {
  try {
    // Always log to console first for immediate visibility
    console.log(`[DEBUG] ${data.location}: ${data.message}`, data.data);

    const logPath = join(process.cwd(), '.cursor', 'debug.log');
    const logEntry =
      JSON.stringify({
        ...data,
        timestamp: Date.now(),
        sessionId: 'debug-session',
        runId: 'run1',
      }) + '\n';

    // Ensure directory exists
    const fs = await import('fs/promises');
    const dirPath = join(process.cwd(), '.cursor');
    try {
      await fs.access(dirPath);
    } catch {
      await fs.mkdir(dirPath, { recursive: true });
    }

    await appendFile(logPath, logEntry, 'utf8').catch(err => {
      console.warn('[DEBUG] Failed to write log file:', err);
    });
  } catch (err) {
    console.warn('[DEBUG] Logging error:', err);
  }
}

export async function POST(request: NextRequest) {
  // #region agent log
  await logDebug({
    location: 'gmail-webhook/route.ts:193',
    message: 'POST handler entry',
    data: { timestamp: Date.now() },
    hypothesisId: 'A',
  });
  // #endregion
  try {
    // #region agent log
    await logDebug({
      location: 'gmail-webhook/route.ts:195',
      message: 'Creating Supabase client',
      data: { timestamp: Date.now() },
      hypothesisId: 'C',
    });
    // #endregion
    const supabase = createServerSupabaseClient();

    // Parse Pub/Sub message
    // #region agent log
    await logDebug({
      location: 'gmail-webhook/route.ts:198',
      message: 'Before parsing request',
      data: { timestamp: Date.now() },
      hypothesisId: 'A',
    });
    // #endregion
    const pubSubMessage: PubSubMessage = await request.json();
    // #region agent log
    await logDebug({
      location: 'gmail-webhook/route.ts:200',
      message: 'After parsing request',
      data: { hasMessage: !!pubSubMessage.message },
      hypothesisId: 'A',
    });
    // #endregion
    const decodedData = JSON.parse(atob(pubSubMessage.message.data));
    const notification: GmailNotification = decodedData;

    console.log(
      `Gmail notification for ${notification.emailAddress}, historyId: ${notification.historyId}`
    );

    // Get user's Gmail access token
    // #region agent log
    await logDebug({
      location: 'gmail-webhook/route.ts:207',
      message: 'Querying integrations table',
      data: { emailAddress: notification.emailAddress },
      hypothesisId: 'A',
    });
    // #endregion
    const { data: integration, error: integrationError } = await supabase
      .from('integrations')
      .select('config')
      .eq('platform', 'gmail')
      .eq('connected', true)
      .ilike('config->>user_email', notification.emailAddress)
      .single();

    // #region agent log
    await logDebug({
      location: 'gmail-webhook/route.ts:214',
      message: 'Integration query result',
      data: {
        hasIntegration: !!integration,
        hasError: !!integrationError,
        errorMessage: integrationError?.message,
        errorCode: integrationError?.code,
      },
      hypothesisId: 'A',
    });
    // #endregion

    // Handle table not found or other expected errors gracefully
    if (integrationError) {
      const isTableNotFound =
        integrationError.code === 'PGRST301' ||
        integrationError.code === '42P01' ||
        integrationError.message?.includes('schema cache') ||
        integrationError.message?.includes('does not exist') ||
        integrationError.message?.includes('Could not find the table');

      if (isTableNotFound) {
        console.log(
          'Integrations table not found - Gmail integration not configured'
        );
        return new NextResponse('OK', { status: 200 });
      }

      // Log unexpected errors but don't fail the webhook
      console.error('Error querying integrations:', integrationError);
      return new NextResponse('OK', { status: 200 });
    }

    const integrationTyped = integration as {
      config?: { access_token?: string; refresh_token?: string };
    } | null;
    // #region agent log
    await logDebug({
      location: 'gmail-webhook/route.ts:218',
      message: 'Integration check',
      data: {
        hasIntegration: !!integrationTyped,
        hasConfig: !!integrationTyped?.config,
      },
      hypothesisId: 'A',
    });
    // #endregion
    if (!integrationTyped?.config) {
      console.log('No Gmail integration found');
      return new NextResponse('OK', { status: 200 });
    }

    // Type guard for config
    const config = integrationTyped.config as { access_token?: string } | null;
    if (!config?.access_token) {
      console.log('No Gmail access token found');
      return new NextResponse('OK', { status: 200 });
    }

    // Fetch history changes
    const historyResponse = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/history?startHistoryId=${notification.historyId}&historyTypes=messageAdded&fields=history(messagesAdded(message(id,threadId,labelIds)))`,
      {
        headers: {
          Authorization: `Bearer ${config.access_token}`,
        },
      }
    );

    // #region agent log
    await logDebug({
      location: 'gmail-webhook/route.ts:240',
      message: 'History response check',
      data: { ok: historyResponse.ok, status: historyResponse.status },
      hypothesisId: 'A',
    });
    // #endregion
    if (!historyResponse.ok) {
      if (historyResponse.status === 401) {
        console.log('Gmail token expired, skipping');
        return new NextResponse('OK', { status: 200 });
      }
      throw new Error(`Gmail API error: ${historyResponse.status}`);
    }

    const historyData = await historyResponse.json();

    // Filter for new messages in INBOX
    const newMessages =
      historyData.history
        ?.flatMap((h: GmailHistoryRecord) => h.messagesAdded || [])
        .filter(
          (
            m: GmailMessageAdded
          ): m is GmailMessageAdded & {
            message: { id: string; labelIds?: string[] };
          } => !!m?.message && !!m.message.id
        )
        .filter(
          (
            m: GmailMessageAdded & {
              message: { id: string; labelIds?: string[] };
            }
          ) => m.message.labelIds?.includes('INBOX')
        )
        .map(
          (
            m: GmailMessageAdded & {
              message: { id: string; labelIds?: string[] };
            }
          ) => m.message.id
        ) || [];

    console.log(`Found ${newMessages.length} new messages`);

    // Process each new message (config already defined above)
    for (const messageId of newMessages) {
      await processGmailReply(supabase, messageId, config.access_token);
    }

    return new NextResponse('OK', { status: 200 });
  } catch (error) {
    // #region agent log
    await logDebug({
      location: 'gmail-webhook/route.ts:285',
      message: 'Error caught',
      data: {
        errorMessage: error instanceof Error ? error.message : String(error),
        errorName: error instanceof Error ? error.name : 'unknown',
      },
      hypothesisId: 'A',
    });
    // #endregion
    console.error('Gmail webhook error:', error);
    // Return 200 to prevent Pub/Sub retries for transient errors
    return new NextResponse('OK', { status: 200 });
  }
}
