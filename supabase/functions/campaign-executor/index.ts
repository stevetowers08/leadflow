import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient, SupabaseClient } from 'jsr:@supabase/supabase-js@2';

serve(async req => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Fetch all data in single query
    const { data: pendingExecutions, error: fetchError } = await supabase
      .from('campaign_sequence_executions')
      .select(
        `
        *,
        campaign_sequence_leads!sequence_lead_id (id, lead_id, sequence_id, status),
        campaign_sequence_steps!step_id (
          id,
          step_type,
          order_position,
          sequence_id,
          email_subject,
          email_body,
          wait_duration,
          wait_unit,
          condition_type,
          true_next_step_id,
          false_next_step_id
        ),
        people!campaign_sequence_leads.lead_id (id, name, email_address)
      `
      )
      .eq('status', 'pending')
      .limit(50);

    if (fetchError || !pendingExecutions?.length) {
      return new Response(
        JSON.stringify({ message: 'No pending executions' }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Process executions
    for (const execution of pendingExecutions) {
      try {
        await processExecution(supabase, execution);
      } catch (error) {
        await supabase
          .from('campaign_sequence_executions')
          .update({ status: 'failed', error_message: error.message })
          .eq('id', execution.id);
      }
    }

    return new Response(
      JSON.stringify({ processed: pendingExecutions.length }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Fatal error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

async function processExecution(
  supabase: SupabaseClient,
  execution: Record<string, unknown>
) {
  const step = execution.campaign_sequence_steps;
  if (!step) throw new Error('Missing step configuration');

  switch (step.step_type) {
    case 'email':
      await processEmailStep(supabase, execution);
      break;
    case 'wait':
      await processWaitStep(supabase, execution);
      break;
    case 'condition':
      await processConditionStep(supabase, execution);
      break;
  }
}

async function processEmailStep(
  supabase: SupabaseClient,
  execution: Record<string, unknown>
) {
  const step = execution.campaign_sequence_steps!;
  const person = execution.people!;
  const lead = execution.campaign_sequence_leads!;

  if (!person.email_address) throw new Error('No email address');

  const { data: sequence } = await supabase
    .from('campaign_sequences')
    .select('created_by')
    .eq('id', lead.sequence_id)
    .single();

  const { data: emailAccount } = await supabase
    .from('email_accounts')
    .select('*')
    .eq('user_id', sequence?.created_by)
    .eq('is_active', true)
    .limit(1)
    .single();

  if (!emailAccount) throw new Error('No active Gmail account');

  const result = await sendGmailEmail(atob(emailAccount.access_token), {
    to: person.email_address,
    subject: step.email_subject || 'Follow up',
    body: personalizeEmail(step.email_body || '', person),
  });

  const now = new Date().toISOString();

  await supabase.from('email_sends').insert({
    person_id: person.id,
    email_account_id: emailAccount.id,
    gmail_message_id: result.messageId,
    gmail_thread_id: result.threadId,
    to_email: person.email_address,
    subject: step.email_subject,
    status: 'sent',
    sent_at: now,
  });

  await supabase
    .from('campaign_sequence_executions')
    .update({ status: 'sent', executed_at: now })
    .eq('id', execution.id);

  await scheduleNextStep(supabase, execution);
}

async function processWaitStep(
  supabase: SupabaseClient,
  execution: Record<string, unknown>
) {
  const step = execution.campaign_sequence_steps!;
  await supabase
    .from('campaign_sequence_executions')
    .update({ status: 'sent', executed_at: new Date().toISOString() })
    .eq('id', execution.id);
  await scheduleNextStep(
    supabase,
    execution,
    step.wait_duration,
    step.wait_unit
  );
}

async function processConditionStep(
  supabase: SupabaseClient,
  execution: Record<string, unknown>
) {
  const step = execution.campaign_sequence_steps!;
  const conditionResult = await evaluateCondition(supabase, execution, step);

  await supabase
    .from('campaign_sequence_executions')
    .update({ status: 'sent', executed_at: new Date().toISOString() })
    .eq('id', execution.id);

  const nextStepId = conditionResult
    ? step.true_next_step_id
    : step.false_next_step_id;
  if (nextStepId) {
    await scheduleNextStep(supabase, execution, 0, 'hours', nextStepId);
  }
}

async function sendGmailEmail(
  accessToken: string,
  email: { to: string; subject: string; body: string }
): Promise<{ messageId: string; threadId?: string }> {
  const message = [
    `To: ${email.to}`,
    `Subject: ${email.subject}`,
    `Content-Type: text/html; charset=utf-8`,
    '',
    email.body,
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
  return { messageId: result.id, threadId: result.threadId };
}

function personalizeEmail(
  body: string,
  person: Record<string, unknown>
): string {
  let personalized = body || '';

  personalized = personalized.replace(
    /\{name\}/g,
    (person.name || '').split(' ')[0] || 'there'
  );
  personalized = personalized.replace(/\{full_name\}/g, person.name || 'there');
  personalized = personalized.replace(/\{email\}/g, person.email_address || '');

  if (!personalized.includes('<html>') && !personalized.includes('<div')) {
    personalized = `
    <div style="max-width: 600px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333;">
      ${personalized.replace(/\n/g, '<br>')}
    </div>
    `;
  }

  return personalized;
}

function calculateWaitHours(
  duration: number | undefined,
  unit: string | undefined
): number {
  if (!duration) return 120;

  switch (unit) {
    case 'hours':
      return duration;
    case 'days':
      return duration * 24;
    case 'weeks':
      return duration * 24 * 7;
    default:
      return duration;
  }
}

async function evaluateCondition(
  supabase: SupabaseClient,
  execution: Record<string, unknown>,
  step: Record<string, unknown>
): Promise<boolean> {
  const person = execution.people!;

  if (step.condition_type === 'replied') {
    const { data: recentReply } = await supabase
      .from('email_replies')
      .select('id')
      .eq('person_id', person.id)
      .gte(
        'received_at',
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      )
      .limit(1);

    const hasReplied = !!recentReply && recentReply.length > 0;

    if (hasReplied) {
      await supabase
        .from('campaign_sequence_leads')
        .update({ status: 'paused' })
        .eq('id', execution.sequence_lead_id);
    }

    return hasReplied;
  }

  return true;
}

async function scheduleNextStep(
  supabase: SupabaseClient,
  execution: Record<string, unknown>,
  waitDuration?: number,
  waitUnit?: string,
  specificNextStepId?: string
) {
  const step = execution.campaign_sequence_steps!;
  const sequenceLead = execution.campaign_sequence_leads!;

  const scheduledAt = new Date();
  if (waitDuration && waitUnit) {
    const waitHours = calculateWaitHours(waitDuration, waitUnit);
    scheduledAt.setHours(scheduledAt.getHours() + waitHours);
  }

  let nextStepId = specificNextStepId;

  if (!nextStepId) {
    const { data: nextStep } = await supabase
      .from('campaign_sequence_steps')
      .select('id')
      .eq('sequence_id', sequenceLead.sequence_id)
      .gt('order_position', step.order_position)
      .order('order_position', { ascending: true })
      .limit(1)
      .single();

    nextStepId = nextStep?.id;
  }

  if (nextStepId) {
    await supabase.from('campaign_sequence_executions').insert({
      sequence_lead_id: execution.sequence_lead_id,
      step_id: nextStepId,
      status: 'pending',
      executed_at: scheduledAt.toISOString(),
    });
  } else {
    await supabase
      .from('campaign_sequence_leads')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
      })
      .eq('id', execution.sequence_lead_id);
  }
}
