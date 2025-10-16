import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async req => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Validate environment variables
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing required Supabase environment variables');
    }

    const requestBody = await req.json();
    const { userId, accessToken, operation } = requestBody;

    // Validate required parameters
    if (!userId || !accessToken) {
      throw new Error('User ID and access token are required');
    }

    if (!operation) {
      throw new Error('Operation type is required');
    }

    let result: any = {};

    switch (operation) {
      case 'sync_inbox':
        result = await syncInboxEmails(accessToken, userId);
        break;
      case 'sync_sent':
        result = await syncSentEmails(accessToken, userId);
        break;
      case 'send_email':
        const { emailData } = requestBody;
        if (!emailData) {
          throw new Error('Email data is required for send_email operation');
        }
        result = await sendEmail(accessToken, emailData, userId);
        break;
      default:
        throw new Error(
          `Unknown operation: ${operation}. Supported operations: sync_inbox, sync_sent, send_email`
        );
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: result,
        timestamp: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Gmail sync error:', error);

    // Log error to database for monitoring
    try {
      await supabase.from('email_sync_logs').insert({
        operation_type: 'function_error',
        status: 'error',
        error_message: error.message || 'Unknown error',
        metadata: {
          error_type: error.constructor.name,
          stack: error.stack,
        },
      });
    } catch (logError) {
      console.error('Failed to log error to database:', logError);
    }

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Internal server error',
        timestamp: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: error.message?.includes('required') ? 400 : 500,
      }
    );
  }
});

async function syncInboxEmails(accessToken: string, userId: string) {
  try {
    // Get recent messages from Gmail
    const messagesResponse = await fetch(
      'https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=50',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!messagesResponse.ok) {
      throw new Error(`Gmail API error: ${messagesResponse.status}`);
    }

    const messagesData = await messagesResponse.json();
    const syncedThreads = [];

    for (const messageRef of messagesData.messages || []) {
      try {
        // Get full message details
        const messageResponse = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageRef.id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!messageResponse.ok) continue;

        const message = await messageResponse.json();
        const thread = await processGmailMessage(message, userId);

        if (thread) {
          // Store thread in database
          const { error } = await supabase
            .from('email_threads')
            .upsert(thread, { onConflict: 'gmail_thread_id' });

          if (!error) {
            syncedThreads.push(thread);
          }
        }
      } catch (error) {
        console.error(`Failed to process message ${messageRef.id}:`, error);
      }
    }

    // Log sync operation
    await supabase.from('email_sync_logs').insert({
      user_id: userId,
      operation_type: 'sync_inbox',
      status: 'success',
      message_count: syncedThreads.length,
    });

    return {
      success: true,
      syncedThreads: syncedThreads.length,
      threads: syncedThreads,
    };
  } catch (error) {
    // Log error
    await supabase.from('email_sync_logs').insert({
      user_id: userId,
      operation_type: 'sync_inbox',
      status: 'error',
      error_message: error.message,
    });

    throw error;
  }
}

async function processGmailMessage(gmailMessage: any, userId: string) {
  try {
    const headers = gmailMessage.payload.headers;
    const fromHeader = headers.find((h: any) => h.name === 'From');
    const toHeader = headers.find((h: any) => h.name === 'To');
    const subjectHeader = headers.find((h: any) => h.name === 'Subject');

    if (!fromHeader || !toHeader) return null;

    const fromEmail = extractEmail(fromHeader.value);
    const toEmails = extractEmails(toHeader.value);
    const subject = subjectHeader?.value || '';

    // Find person in CRM by email
    const { data: person } = await supabase
      .from('people')
      .select('id')
      .eq('email_address', fromEmail)
      .single();

    if (!person) return null;

    // Extract email body
    const bodyText = extractEmailBody(gmailMessage.payload);
    const bodyHtml = extractEmailBodyHtml(gmailMessage.payload);

    // Create email thread data
    const threadData = {
      gmail_thread_id: gmailMessage.threadId,
      person_id: person.id,
      subject,
      participants: [fromEmail, ...toEmails],
      last_message_at: new Date(
        parseInt(gmailMessage.internalDate)
      ).toISOString(),
      is_read: !gmailMessage.labelIds.includes('UNREAD'),
      sync_status: 'synced',
    };

    // Store email message
    const messageData = {
      gmail_message_id: gmailMessage.id,
      thread_id: gmailMessage.threadId,
      person_id: person.id,
      from_email: fromEmail,
      to_emails: toEmails,
      cc_emails: [],
      bcc_emails: [],
      subject,
      body_text: bodyText,
      body_html: bodyHtml,
      attachments: [],
      is_read: !gmailMessage.labelIds.includes('UNREAD'),
      is_sent: false,
      received_at: new Date(parseInt(gmailMessage.internalDate)).toISOString(),
      sync_status: 'synced',
    };

    await supabase
      .from('email_messages')
      .upsert(messageData, { onConflict: 'gmail_message_id' });

    return threadData;
  } catch (error) {
    console.error('Failed to process Gmail message:', error);
    return null;
  }
}

async function syncSentEmails(accessToken: string, userId: string) {
  try {
    // Get sent messages from Gmail
    const messagesResponse = await fetch(
      'https://gmail.googleapis.com/gmail/v1/users/me/messages?labelIds=SENT&maxResults=50',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!messagesResponse.ok) {
      throw new Error(`Gmail API error: ${messagesResponse.status}`);
    }

    const messagesData = await messagesResponse.json();
    const syncedMessages = [];

    for (const messageRef of messagesData.messages || []) {
      try {
        const messageResponse = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageRef.id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!messageResponse.ok) continue;

        const message = await messageResponse.json();
        const processedMessage = await processSentMessage(message, userId);

        if (processedMessage) {
          syncedMessages.push(processedMessage);
        }
      } catch (error) {
        console.error(
          `Failed to process sent message ${messageRef.id}:`,
          error
        );
      }
    }

    // Log sync operation
    await supabase.from('email_sync_logs').insert({
      user_id: userId,
      operation_type: 'sync_sent',
      status: 'success',
      message_count: syncedMessages.length,
    });

    return {
      success: true,
      syncedMessages: syncedMessages.length,
      messages: syncedMessages,
    };
  } catch (error) {
    await supabase.from('email_sync_logs').insert({
      user_id: userId,
      operation_type: 'sync_sent',
      status: 'error',
      error_message: error.message,
    });

    throw error;
  }
}

async function processSentMessage(gmailMessage: any, userId: string) {
  try {
    const headers = gmailMessage.payload.headers;
    const fromHeader = headers.find((h: any) => h.name === 'From');
    const toHeader = headers.find((h: any) => h.name === 'To');
    const subjectHeader = headers.find((h: any) => h.name === 'Subject');

    if (!fromHeader || !toHeader) return null;

    const fromEmail = extractEmail(fromHeader.value);
    const toEmails = extractEmails(toHeader.value);
    const subject = subjectHeader?.value || '';

    // Find person in CRM by email (sent to)
    const { data: person } = await supabase
      .from('people')
      .select('id')
      .eq('email_address', toEmails[0])
      .single();

    if (!person) return null;

    // Extract email body
    const bodyText = extractEmailBody(gmailMessage.payload);
    const bodyHtml = extractEmailBodyHtml(gmailMessage.payload);

    // Store sent email message
    const messageData = {
      gmail_message_id: gmailMessage.id,
      thread_id: gmailMessage.threadId,
      person_id: person.id,
      from_email: fromEmail,
      to_emails: toEmails,
      cc_emails: [],
      bcc_emails: [],
      subject,
      body_text: bodyText,
      body_html: bodyHtml,
      attachments: [],
      is_read: true,
      is_sent: true,
      sent_at: new Date(parseInt(gmailMessage.internalDate)).toISOString(),
      received_at: new Date(parseInt(gmailMessage.internalDate)).toISOString(),
      sync_status: 'synced',
    };

    const { error } = await supabase
      .from('email_messages')
      .upsert(messageData, { onConflict: 'gmail_message_id' });

    if (error) {
      console.error('Failed to store sent message:', error);
      return null;
    }

    return messageData;
  } catch (error) {
    console.error('Failed to process sent message:', error);
    return null;
  }
}

async function sendEmail(accessToken: string, emailData: any, userId: string) {
  try {
    // Create email message
    const emailMessage = createEmailMessage(emailData);

    // Send via Gmail API
    const response = await fetch(
      'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          raw: btoa(emailMessage)
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

    // Store in database
    await storeSentEmail(emailData, result.id, userId);

    // Log successful send
    await supabase.from('email_sync_logs').insert({
      user_id: userId,
      operation_type: 'send_email',
      status: 'success',
      message_count: 1,
    });

    return { success: true, messageId: result.id };
  } catch (error) {
    await supabase.from('email_sync_logs').insert({
      user_id: userId,
      operation_type: 'send_email',
      status: 'error',
      error_message: error.message,
    });

    throw error;
  }
}

function createEmailMessage(emailData: any): string {
  const boundary = '----=_Part_' + Math.random().toString(36).substr(2, 9);

  let message = `To: ${emailData.to.join(', ')}\r\n`;
  if (emailData.cc) message += `Cc: ${emailData.cc.join(', ')}\r\n`;
  if (emailData.bcc) message += `Bcc: ${emailData.bcc.join(', ')}\r\n`;
  message += `Subject: ${emailData.subject}\r\n`;
  message += `MIME-Version: 1.0\r\n`;
  message += `Content-Type: multipart/alternative; boundary="${boundary}"\r\n\r\n`;

  message += `--${boundary}\r\n`;
  message += `Content-Type: text/plain; charset=UTF-8\r\n\r\n`;
  message += `${emailData.body}\r\n\r\n`;

  if (emailData.bodyHtml) {
    message += `--${boundary}\r\n`;
    message += `Content-Type: text/html; charset=UTF-8\r\n\r\n`;
    message += `${emailData.bodyHtml}\r\n\r\n`;
  }

  message += `--${boundary}--\r\n`;

  return message;
}

async function storeSentEmail(
  emailData: any,
  gmailMessageId: string,
  userId: string
) {
  const messageData = {
    gmail_message_id: gmailMessageId,
    person_id: emailData.personId,
    from_email: emailData.fromEmail || '',
    to_emails: emailData.to,
    cc_emails: emailData.cc || [],
    bcc_emails: emailData.bcc || [],
    subject: emailData.subject,
    body_text: emailData.body,
    body_html: emailData.bodyHtml || '',
    attachments: [],
    is_read: true,
    is_sent: true,
    sent_at: new Date().toISOString(),
    sync_status: 'synced',
  };

  const { error } = await supabase.from('email_messages').insert(messageData);

  if (error) {
    console.error('Failed to store sent email:', error);
  }
}

function extractEmail(emailString: string): string {
  const match =
    emailString.match(/<([^>]+)>/) || emailString.match(/([^\s]+@[^\s]+)/);
  return match ? match[1] : emailString;
}

function extractEmails(emailString: string): string[] {
  const emails = emailString
    .split(',')
    .map(email => extractEmail(email.trim()));
  return emails.filter(email => email.includes('@'));
}

function extractEmailBody(payload: any): string {
  if (payload.body?.data) {
    return atob(payload.body.data.replace(/-/g, '+').replace(/_/g, '/'));
  }

  if (payload.parts) {
    for (const part of payload.parts) {
      if (part.mimeType === 'text/plain' && part.body?.data) {
        return atob(part.body.data.replace(/-/g, '+').replace(/_/g, '/'));
      }
      if (part.parts) {
        const body = extractEmailBody(part);
        if (body) return body;
      }
    }
  }

  return '';
}

function extractEmailBodyHtml(payload: any): string {
  if (payload.parts) {
    for (const part of payload.parts) {
      if (part.mimeType === 'text/html' && part.body?.data) {
        return atob(part.body.data.replace(/-/g, '+').replace(/_/g, '/'));
      }
      if (part.parts) {
        const body = extractEmailBodyHtml(part);
        if (body) return body;
      }
    }
  }

  return '';
}
