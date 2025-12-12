import { NextRequest, NextResponse } from 'next/server';
import { APIErrorHandler } from '@/lib/api-error-handler';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import type { Tables } from '@/integrations/supabase/types';

type CampaignExecution = Tables<'campaign_sequence_executions'> & {
  campaign_sequence_leads: Pick<
    Tables<'campaign_sequence_leads'>,
    'id' | 'lead_id' | 'sequence_id' | 'status'
  >;
  campaign_sequence_steps: Pick<
    Tables<'campaign_sequence_steps'>,
    | 'id'
    | 'step_type'
    | 'order_position'
    | 'sequence_id'
    | 'email_subject'
    | 'email_body'
    | 'wait_duration'
    | 'wait_unit'
    | 'condition_type'
    | 'true_next_step_id'
    | 'false_next_step_id'
  >;
  people: Pick<Tables<'leads'>, 'id' | 'first_name' | 'last_name' | 'email'> | null;
};

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();

    // Fetch pending executions (max 50)
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
        leads!campaign_sequence_executions_lead_id_fkey (id, first_name, last_name, email)
      `
      )
      .eq('status', 'pending')
      .limit(50);

    if (fetchError || !pendingExecutions?.length) {
      return NextResponse.json(
        { message: 'No pending executions' },
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Type the results (using unknown first to satisfy TypeScript)
    const typedExecutions = pendingExecutions as unknown as CampaignExecution[];

    // Process executions
    for (const execution of typedExecutions) {
      try {
        await processExecution(supabase, execution);
      } catch (error) {
        await (supabase
          .from('campaign_sequence_executions') as any)
          .update({
            status: 'failed',
            error_message: error instanceof Error ? error.message : 'Unknown error',
          })
          .eq('id', (execution as any).id);
      }
    }

    return NextResponse.json(
      { processed: typedExecutions.length },
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Fatal error:', error);
    return APIErrorHandler.handleError(error, 'campaign-executor');
  }
}

async function processExecution(
  supabase: ReturnType<typeof createServerSupabaseClient>,
  execution: CampaignExecution
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
  supabase: ReturnType<typeof createServerSupabaseClient>,
  execution: CampaignExecution
) {
  const step = execution.campaign_sequence_steps;
  const leadData = execution.people;
  const lead = execution.campaign_sequence_leads;

  if (!leadData || !lead) throw new Error('Missing lead or person data');

  const email = leadData.email;
  if (!email) throw new Error('No email address');
  
  const fullName = [leadData.first_name, leadData.last_name].filter(Boolean).join(' ') || 'there';

  const { data: sequence, error: sequenceError } = await supabase
    .from('campaign_sequences')
    .select('created_by')
    .eq('id', lead.sequence_id)
    .single();

  if (sequenceError || !(sequence as any)?.created_by) {
    throw new Error(sequenceError?.message || 'Sequence owner not found');
  }

  const { data: emailAccount, error: emailAccountError } = await supabase
    .from('email_accounts')
    .select('*')
    .eq('user_id', (sequence as any).created_by)
    .eq('is_active', true)
    .limit(1)
    .single();

  if (emailAccountError || !emailAccount) {
    throw new Error(emailAccountError?.message || 'No active Gmail account');
  }

  const accessToken = Buffer.from((emailAccount as any).access_token, 'base64').toString('utf-8');

  // Send email via Gmail API
  const message = [
    `To: ${email}`,
    `Subject: ${step.email_subject || 'Follow up'}`,
    `Content-Type: text/html; charset=utf-8`,
    '',
    personalizeEmail(step.email_body || '', person),
  ].join('\r\n');

  const emailResponse = await fetch(
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

  if (!emailResponse.ok) {
    throw new Error(`Failed to send email: ${emailResponse.statusText}`);
  }

  const emailResult = await emailResponse.json();
  const now = new Date().toISOString();

  await (supabase.from('email_sends') as any).insert({
    person_id: leadData.id,
    email_account_id: (emailAccount as any).id,
    gmail_message_id: emailResult.id,
    gmail_thread_id: emailResult.threadId,
    to_email: email,
    subject: step.email_subject,
    status: 'sent',
    sent_at: now,
  });

  await (supabase
    .from('campaign_sequence_executions') as any)
    .update({ status: 'sent', executed_at: now })
    .eq('id', (execution as any).id);

  await scheduleNextStep(supabase, execution);
}

async function processWaitStep(
  supabase: ReturnType<typeof createServerSupabaseClient>,
  execution: CampaignExecution
) {
  const step = execution.campaign_sequence_steps;
  await (supabase
    .from('campaign_sequence_executions') as any)
    .update({ status: 'sent', executed_at: new Date().toISOString() })
    .eq('id', (execution as any).id);
  await scheduleNextStep(supabase, execution, step.wait_duration, step.wait_unit);
}

async function processConditionStep(
  supabase: ReturnType<typeof createServerSupabaseClient>,
  execution: CampaignExecution
) {
  const step = execution.campaign_sequence_steps;
  const conditionResult = await evaluateCondition(supabase, execution, step);

  await (supabase
    .from('campaign_sequence_executions') as any)
    .update({ status: 'sent', executed_at: new Date().toISOString() })
    .eq('id', (execution as any).id);

  const nextStepId = conditionResult ? step.true_next_step_id : step.false_next_step_id;
  if (nextStepId) {
    await scheduleNextStep(supabase, execution, 0, 'hours', nextStepId);
  }
}

function personalizeEmail(
  body: string,
  leadData: Pick<Tables<'leads'>, 'first_name' | 'last_name' | 'email'> | null,
  fullName: string,
  email: string
): string {
  let personalized = body || '';
  personalized = personalized.replace(/\{name\}/g, leadData?.first_name || 'there');
  personalized = personalized.replace(/\{full_name\}/g, fullName);
  personalized = personalized.replace(/\{email\}/g, email || '');

  if (!personalized.includes('<html>') && !personalized.includes('<div')) {
    personalized = `<div style="max-width: 600px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333;">${personalized.replace(/\n/g, '<br>')}</div>`;
  }

  return personalized;
}

function calculateWaitHours(duration: number | undefined, unit: string | undefined): number {
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
  supabase: ReturnType<typeof createServerSupabaseClient>,
  execution: CampaignExecution,
  step: CampaignExecution['campaign_sequence_steps']
): Promise<boolean> {
  const leadData = execution.people;
  if (!leadData) throw new Error('Missing lead data for condition evaluation');

  if (step.condition_type === 'replied') {
    const { data: recentReply } = await supabase
      .from('email_replies')
      .select('id')
      .eq('person_id', leadData.id)
      .gte('received_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .limit(1);

    const hasReplied = !!recentReply && recentReply.length > 0;

    if (hasReplied) {
      await (supabase
        .from('campaign_sequence_leads') as any)
        .update({ status: 'paused' })
        .eq('id', (execution as any).sequence_lead_id);
    }

    return hasReplied;
  }

  return true;
}

async function scheduleNextStep(
  supabase: ReturnType<typeof createServerSupabaseClient>,
  execution: CampaignExecution,
  waitDuration?: number,
  waitUnit?: string,
  specificNextStepId?: string
) {
  const step = execution.campaign_sequence_steps;
  const sequenceLead = execution.campaign_sequence_leads;

  if (!sequenceLead) {
    throw new Error('Missing sequence lead data for scheduling');
  }

  const scheduledAt = new Date();
  if (waitDuration && waitUnit) {
    const waitHours = calculateWaitHours(waitDuration, waitUnit);
    scheduledAt.setHours(scheduledAt.getHours() + waitHours);
  }

  let nextStepId = specificNextStepId;

  if (!nextStepId) {
    const { data: nextStep, error: nextStepError } = await supabase
      .from('campaign_sequence_steps')
      .select('id')
      .eq('sequence_id', sequenceLead.sequence_id)
      .gt('order_position', step.order_position)
      .order('order_position', { ascending: true })
      .limit(1)
      .maybeSingle();

    if (nextStepError) {
      throw new Error(nextStepError.message);
    }

    nextStepId = (nextStep as any)?.id ?? undefined;
  }

  if (nextStepId) {
    await (supabase.from('campaign_sequence_executions') as any).insert({
      sequence_lead_id: (execution as any).sequence_lead_id,
      step_id: nextStepId,
      status: 'pending',
      executed_at: scheduledAt.toISOString(),
    });
  } else {
    await (supabase
      .from('campaign_sequence_leads') as any)
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
      })
      .eq('id', (execution as any).sequence_lead_id);
  }
}


