/**
 * Pause Detection Service
 * 
 * PDR Section: Phase 2 - Workflow Automation
 * Detects when workflows should pause based on lead activity
 */

import { supabase } from '@/integrations/supabase/client';
import { logSupabaseError } from '@/lib/utils';
import { PauseRules } from './workflowService';

export interface LeadActivity {
  leadId: string;
  hasReplied: boolean;
  hasClicked: boolean;
  openCount: number;
  lastActivityAt?: string;
}

/**
 * Check if a lead's workflow should be paused based on activity
 */
export async function checkAndPauseWorkflow(
  leadId: string,
  pauseRules: PauseRules | undefined
): Promise<boolean> {
  if (!pauseRules) return false;

  // Get lead activity
  const activity = await getLeadActivity(leadId);

  // Check pause conditions
  if (pauseRules.onReply && activity.hasReplied) {
    await pauseLeadWorkflow(leadId, 'replied');
    return true;
  }

  if (pauseRules.onClick && activity.hasClicked) {
    await pauseLeadWorkflow(leadId, 'clicked');
    return true;
  }

  if (
    pauseRules.onOpenCount &&
    activity.openCount >= pauseRules.onOpenCount
  ) {
    await pauseLeadWorkflow(leadId, 'opened_multiple');
    return true;
  }

  return false;
}

/**
 * Get activity data for a lead
 */
async function getLeadActivity(leadId: string): Promise<LeadActivity> {
  // Get activity log entries for this lead
  const { data: activities } = await supabase
    .from('activity_log')
    .select('*')
    .eq('lead_id', leadId)
    .order('timestamp', { ascending: false });

  const hasReplied =
    activities?.some((a) => a.activity_type === 'email_replied') || false;
  const hasClicked =
    activities?.some((a) => a.activity_type === 'email_clicked') || false;
  const openCount =
    activities?.filter((a) => a.activity_type === 'email_opened').length || 0;

  const lastActivity = activities?.[0]?.timestamp;

  return {
    leadId,
    hasReplied,
    hasClicked,
    openCount,
    lastActivityAt: lastActivity,
  };
}

/**
 * Pause a lead's workflow
 */
async function pauseLeadWorkflow(
  leadId: string,
  reason: 'replied' | 'clicked' | 'opened_multiple' | 'manual'
): Promise<void> {
  // Update lead status
  const { error: leadError } = await supabase
    .from('leads')
    .update({
      workflow_status: 'paused',
      status: 'paused',
      updated_at: new Date().toISOString(),
    })
    .eq('id', leadId);

  if (leadError) {
    console.error('Error pausing lead workflow:', leadError);
    throw leadError;
  }

  // Log the pause event
  const { error: logError } = await supabase.from('activity_log').insert({
    lead_id: leadId,
    activity_type: 'workflow_paused',
    metadata: {
      reason,
      paused_at: new Date().toISOString(),
    },
  });

  if (logError) {
    console.error('Error logging pause event:', logError);
  }
}

/**
 * Resume a lead's workflow
 */
export async function resumeLeadWorkflow(leadId: string): Promise<void> {
  const { error } = await supabase
    .from('leads')
    .update({
      workflow_status: 'active',
      status: 'active',
      updated_at: new Date().toISOString(),
    })
    .eq('id', leadId);

  if (error) {
    logSupabaseError(error, 'resuming lead workflow');
    throw error;
  }

  // Log the resume event
  await supabase.from('activity_log').insert({
    lead_id: leadId,
    activity_type: 'workflow_resumed',
    metadata: {
      resumed_at: new Date().toISOString(),
    },
  });
}

/**
 * Process webhook events from email providers (Gmail, Lemlist)
 * and check for pause conditions
 */
export async function processEmailWebhook(
  leadId: string,
  eventType: 'email_opened' | 'email_clicked' | 'email_replied',
  metadata?: Record<string, any>
): Promise<void> {
  // Log the activity
  await supabase.from('activity_log').insert({
    lead_id: leadId,
    activity_type: eventType,
    metadata: metadata || {},
  });

  // Get the lead's workflow and pause rules
  const { data: lead } = await supabase
    .from('leads')
    .select('workflow_id, workflow_status')
    .eq('id', leadId)
    .single();

  if (!lead?.workflow_id || lead.workflow_status === 'paused') {
    return; // No workflow or already paused
  }

  // Get workflow pause rules
  const { data: workflow } = await supabase
    .from('workflows')
    .select('pause_rules')
    .eq('id', lead.workflow_id)
    .single();

  if (!workflow?.pause_rules) {
    return; // No pause rules configured
  }

  // Check if workflow should pause
  await checkAndPauseWorkflow(leadId, workflow.pause_rules as PauseRules);
}

