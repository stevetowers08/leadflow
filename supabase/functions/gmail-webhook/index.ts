import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

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
  sentiment: 'positive' | 'negative' | 'neutral' | 'question' | 'out_of_office';
  confidence: number;
  reasoning: string;
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse Pub/Sub message
    const pubSubMessage: PubSubMessage = await req.json();
    const decodedData = JSON.parse(atob(pubSubMessage.message.data));
    const notification: GmailNotification = decodedData;

    console.log(
      `Gmail notification for ${notification.emailAddress}, historyId: ${notification.historyId}`
    );

    // Get user's Gmail access token from integrations table
    const { data: integration } = await supabase
      .from('integrations')
      .select('config, user_id')
      .eq('platform', 'gmail')
      .eq('connected', true)
      .eq('config->>user_email', notification.emailAddress)
      .single();

    if (!integration?.config?.access_token) {
      console.log('No Gmail integration found');
      return new Response('OK', { status: 200 });
    }

    // Fetch history changes from Gmail API (optimized with fields parameter)
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
        return new Response('OK', { status: 200 });
      }
      throw new Error(`Gmail API error: ${historyResponse.status}`);
    }

    const historyData = await historyResponse.json();

    // Filter for new messages in INBOX (replies) - optimized processing
    const newMessages =
      historyData.history
        ?.flatMap((h: Record<string, unknown>) => h.messagesAdded || [])
        .filter((m: Record<string, unknown>) =>
          m.message.labelIds?.includes('INBOX')
        )
        .map((m: Record<string, unknown>) => m.message.id) || [];

    console.log(`Found ${newMessages.length} new messages`);

    // Process each new message
    for (const messageId of newMessages) {
      await processGmailReply(
        supabase,
        messageId,
        integration.config.access_token
      );
    }

    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error('Gmail webhook error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
});

async function processGmailReply(
  supabase: Record<string, unknown>,
  messageId: string,
  accessToken: string
) {
  try {
    // Fetch full message from Gmail API (optimized with fields parameter)
    const messageResponse = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}?format=full&fields=id,threadId,internalDate,payload(headers(name,value),body(data),parts(parts(body(data)),body(data),mimeType))`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!messageResponse.ok) {
      console.error(
        `Failed to fetch message ${messageId}: ${messageResponse.status}`
      );
      return;
    }

    const message: Record<string, unknown> = await messageResponse.json();
    const threadId = message.threadId;

    // Check if this is a reply to one of our sent emails
    // Look for interactions with email_sent type
    const { data: interaction } = await supabase
      .from('interactions')
      .select(
        `
        id,
        person_id,
        people!inner(
          id,
          company_id,
          email_address,
          name
        )
      `
      )
      .eq('interaction_type', 'email_sent')
      .like('metadata->>gmail_thread_id', `%${threadId}%`)
      .single();

    if (!interaction) {
      console.log(`No matching interaction found for thread ${threadId}`);
      return;
    }

    // Extract email content
    const headers = message.payload.headers;
    const fromHeader = headers.find(
      (h: Record<string, unknown>) => h.name === 'From'
    )?.value;
    const subjectHeader = headers.find(
      (h: Record<string, unknown>) => h.name === 'Subject'
    )?.value;

    const bodyPlain = extractBodyPart(message.payload, 'text/plain');
    const bodyHtml = extractBodyPart(message.payload, 'text/html');

    // Analyze sentiment with Gemini AI
    const sentiment = await analyzeSentiment(bodyPlain || bodyHtml || '');

    // Insert email_reply record
    const { data: reply, error: insertError } = await supabase
      .from('email_replies')
      .insert({
        interaction_id: interaction.id,
        person_id: interaction.person_id,
        company_id: interaction.people.company_id,
        gmail_message_id: messageId,
        gmail_thread_id: threadId,
        from_email: extractEmail(fromHeader || ''),
        reply_subject: subjectHeader,
        reply_body_plain: bodyPlain,
        reply_body_html: bodyHtml,
        received_at: new Date(parseInt(message.internalDate)),
        sentiment: sentiment.sentiment,
        sentiment_confidence: sentiment.confidence,
        sentiment_reasoning: sentiment.reasoning,
        analyzed_at: new Date(),
        detected_at: new Date(),
        processed_at: new Date(),
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting reply:', insertError);
      return;
    }

    // Auto-progress pipeline stage based on sentiment
    await autoProgressPerson(
      supabase,
      interaction.person_id,
      sentiment.sentiment,
      reply.id
    );

    // Also auto-progress company if person belongs to one
    if (interaction.people?.company_id) {
      await autoProgressCompany(
        supabase,
        interaction.people.company_id,
        sentiment.sentiment,
        {
          messageId,
          threadId,
          replyContent: bodyPlain || bodyHtml,
          personId: interaction.person_id,
        }
      );
    }

    // Create interaction record for the reply
    await supabase.from('interactions').insert({
      person_id: interaction.person_id,
      interaction_type: 'email_reply',
      subject: subjectHeader,
      content: bodyPlain,
      metadata: {
        reply_id: reply.id,
        sentiment: sentiment.sentiment,
        confidence: sentiment.confidence,
        gmail_message_id: messageId,
        gmail_thread_id: threadId,
      },
      owner_id: interaction.people.id, // Use person's owner
    });

    // Create notification for email response received
    // Get the user_id who should receive the notification
    // Priority: interaction owner, then integration user_id, then person owner
    const { data: ownerUser } = await supabase
      .from('people')
      .select('owner_id')
      .eq('id', interaction.person_id)
      .single();

    const notificationUserId =
      interaction.people.owner_id ||
      integration?.user_id ||
      ownerUser?.owner_id;

    if (notificationUserId) {
      await supabase.from('user_notifications').insert({
        user_id: notificationUserId,
        type: 'email_response_received',
        priority: 'high',
        title: 'New Email Response',
        message: `${interaction.people.name || 'Someone'} replied to your message`,
        action_type: 'navigate',
        action_url: `/people/${interaction.person_id}`,
        action_entity_type: 'person',
        action_entity_id: interaction.person_id,
        metadata: {
          person_id: interaction.person_id,
          company_id: interaction.people.company_id,
          reply_id: reply.id,
        },
      });
    }

    console.log(
      `Processed reply ${messageId} with ${sentiment.sentiment} sentiment`
    );
  } catch (error) {
    console.error(`Error processing reply ${messageId}:`, error);
  }
}

function extractBodyPart(
  payload: Record<string, unknown>,
  mimeType: string
): string | null {
  if (payload.mimeType === mimeType && payload.body?.data) {
    return atob(payload.body.data.replace(/-/g, '+').replace(/_/g, '/'));
  }

  if (payload.parts) {
    for (const part of payload.parts) {
      const body = extractBodyPart(part, mimeType);
      if (body) return body;
    }
  }

  return null;
}

function extractEmail(fromHeader: string): string {
  const match = fromHeader.match(/<(.+?)>/);
  return match ? match[1] : fromHeader;
}

async function analyzeSentiment(text: string): Promise<SentimentAnalysis> {
  try {
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('Gemini API key not configured');
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`,
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
                  text: `Analyze the sentiment of this email reply and classify it as one of: positive, negative, neutral, question, out_of_office. 

Email content: "${text}"

Respond with JSON format:
{
  "sentiment": "positive|negative|neutral|question|out_of_office",
  "confidence": 0.85,
  "reasoning": "Brief explanation"
}`,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const analysisText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!analysisText) {
      throw new Error('No analysis returned from Gemini');
    }

    // Parse the JSON response
    const analysis = JSON.parse(analysisText.trim());

    return {
      sentiment: analysis.sentiment,
      confidence: analysis.confidence,
      reasoning: analysis.reasoning,
    };
  } catch (error) {
    console.error('Sentiment analysis error:', error);

    // Fallback to neutral sentiment
    return {
      sentiment: 'neutral',
      confidence: 0.5,
      reasoning: 'Unable to analyze sentiment, defaulting to neutral',
    };
  }
}

async function autoProgressPerson(
  supabase: Record<string, unknown>,
  personId: string,
  sentiment: string,
  replyId: string
) {
  try {
    let newStage = 'replied';

    // Simple progression rules based on sentiment
    if (sentiment === 'positive') {
      newStage = 'interested';
    } else if (sentiment === 'negative') {
      newStage = 'not_interested';
    } else if (sentiment === 'question') {
      newStage = 'replied';
    }

    // Update person stage
    await supabase
      .from('people')
      .update({
        people_stage: newStage,
        last_reply_at: new Date().toISOString(),
        reply_type:
          sentiment === 'positive'
            ? 'interested'
            : sentiment === 'negative'
              ? 'not_interested'
              : 'maybe',
      })
      .eq('id', personId);

    console.log(`Auto-progressed person ${personId} to stage: ${newStage}`);
  } catch (error) {
    console.error('Error auto-progressing person:', error);
  }
}

async function autoProgressCompany(
  supabase: Record<string, unknown>,
  companyId: string,
  sentiment: string,
  metadata: unknown
) {
  try {
    let newStage = 'replied';

    // Simple progression rules based on sentiment
    if (sentiment === 'positive') {
      newStage = 'replied';
    } else if (sentiment === 'negative') {
      newStage = 'closed_lost';
    }

    // Update company stage
    await supabase
      .from('companies')
      .update({
        pipeline_stage: newStage,
        last_reply_at: new Date().toISOString(),
      })
      .eq('id', companyId);

    console.log(`Auto-progressed company ${companyId} to stage: ${newStage}`);
  } catch (error) {
    console.error('Error auto-progressing company:', error);
  }
}
