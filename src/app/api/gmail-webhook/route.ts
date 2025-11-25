import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { APIErrorHandler } from '@/lib/api-error-handler';

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
  sentiment: 'interested' | 'not_interested' | 'maybe' | 'out_of_office';
  confidence: number;
  reasoning: string;
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
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
  const headers = messageData.payload.headers;
  const subject = headers.find((h: any) => h.name === 'Subject')?.value || '';
  const from = headers.find((h: any) => h.name === 'From')?.value || '';
  const threadId = messageData.threadId;

  // Find person by email
  const emailMatch = from.match(/<(.+)>/);
  const emailAddress = emailMatch ? emailMatch[1] : from;

  const { data: person } = await supabase
    .from('people')
    .select('id, name, email_address')
    .eq('email_address', emailAddress)
    .single();

  if (!person) {
    console.log('No person found for email:', emailAddress);
    return;
  }

  // Extract message body
  let body = '';
  if (messageData.payload.parts) {
    const textPart = messageData.payload.parts.find(
      (p: any) => p.mimeType === 'text/plain'
    );
    if (textPart?.body?.data) {
      body = atob(textPart.body.data.replace(/-/g, '+').replace(/_/g, '/'));
    }
  } else if (messageData.payload.body?.data) {
    body = atob(messageData.payload.body.data.replace(/-/g, '+').replace(/_/g, '/'));
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
        const analysisText = aiData.candidates[0]?.content?.parts[0]?.text || '';
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

  // Store reply
  await supabase.from('email_replies').insert({
    person_id: person.id,
    gmail_message_id: messageId,
    gmail_thread_id: threadId,
    subject: subject,
    body: body,
    from_email: emailAddress,
    received_at: new Date(messageData.internalDate || Date.now()).toISOString(),
    sentiment: sentiment?.sentiment || 'neutral',
    confidence: sentiment?.confidence || 0.5,
  });

  // Update person's reply_type
  if (sentiment) {
    await supabase
      .from('people')
      .update({
        reply_type: sentiment.sentiment === 'interested' ? 'interested' : 
                    sentiment.sentiment === 'not_interested' ? 'not_interested' : 'maybe',
        updated_at: new Date().toISOString(),
      })
      .eq('id', person.id);
  }
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
        'gmail-webhook'
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse Pub/Sub message
    const pubSubMessage: PubSubMessage = await request.json();
    const decodedData = JSON.parse(atob(pubSubMessage.message.data));
    const notification: GmailNotification = decodedData;

    console.log(
      `Gmail notification for ${notification.emailAddress}, historyId: ${notification.historyId}`
    );

    // Get user's Gmail access token
    const { data: integration } = await supabase
      .from('integrations')
      .select('config, user_id')
      .eq('platform', 'gmail')
      .eq('connected', true)
      .ilike('config->>user_email', notification.emailAddress)
      .single();

    if (!integration?.config?.access_token) {
      console.log('No Gmail integration found');
      return new NextResponse('OK', { status: 200 });
    }

    // Fetch history changes
    const historyResponse = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/history?startHistoryId=${notification.historyId}&historyTypes=messageAdded&fields=history(messagesAdded(message(id,threadId,labelIds)))`,
      {
        headers: {
          Authorization: `Bearer ${integration.config.access_token}`,
        },
      }
    );

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
        ?.flatMap((h: Record<string, unknown>) => h.messagesAdded || [])
        .filter((m: Record<string, unknown>) =>
          (m.message as any)?.labelIds?.includes('INBOX')
        )
        .map((m: Record<string, unknown>) => (m.message as any).id) || [];

    console.log(`Found ${newMessages.length} new messages`);

    // Process each new message
    for (const messageId of newMessages) {
      await processGmailReply(supabase, messageId, integration.config.access_token);
    }

    return new NextResponse('OK', { status: 200 });
  } catch (error) {
    console.error('Gmail webhook error:', error);
    // Return 200 to prevent Pub/Sub retries for transient errors
    return new NextResponse('OK', { status: 200 });
  }
}


