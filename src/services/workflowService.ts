/**
 * Workflow Service
 * 
 * PDR Section: Technical Specifications - Workflow Automation
 * Handles workflow CRUD operations and automation logic
 */

import { supabase } from '@/integrations/supabase/client';

export interface Workflow {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  status: 'draft' | 'active' | 'paused' | 'archived';
  email_provider: 'lemlist' | 'gmail';
  lemlist_campaign_id?: string;
  gmail_sequence?: GmailEmailStep[];
  pause_rules?: PauseRules;
  created_at: string;
  updated_at: string;
}

export interface GmailEmailStep {
  stepNumber: number;
  subject: string;
  body: string;
  delay: {
    type: 'immediate' | 'hours' | 'days';
    value: number;
  };
  tokens?: string[]; // Available tokens for personalization
}

export interface PauseRules {
  onReply: boolean;
  onClick?: boolean;
  onOpenCount?: number; // Pause after N opens
  manualPause?: boolean;
  notifyOnPause?: boolean;
}

export interface WorkflowStats {
  activeLeads: number;
  respondedLeads: number;
  responseRate: number;
  lastUsed?: string;
}

/**
 * Get all workflows for the current user
 */
export async function getWorkflows(): Promise<Workflow[]> {
  const { data, error } = await supabase
    .from('workflows')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch workflows: ${error.message}`);
  }

  return data || [];
}

/**
 * Get a single workflow by ID
 */
export async function getWorkflow(id: string): Promise<Workflow | null> {
  const { data, error } = await supabase
    .from('workflows')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(`Failed to fetch workflow: ${error.message}`);
  }

  return data;
}

/**
 * Create a new workflow
 */
export async function createWorkflow(
  workflow: Omit<Workflow, 'id' | 'user_id' | 'created_at' | 'updated_at'>
): Promise<Workflow> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('workflows')
    .insert({
      ...workflow,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create workflow: ${error.message}`);
  }

  return data;
}

/**
 * Update an existing workflow
 */
export async function updateWorkflow(
  id: string,
  updates: Partial<Workflow>
): Promise<Workflow> {
  const { data, error } = await supabase
    .from('workflows')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update workflow: ${error.message}`);
  }

  return data;
}

/**
 * Delete a workflow
 */
export async function deleteWorkflow(id: string): Promise<void> {
  const { error } = await supabase.from('workflows').delete().eq('id', id);

  if (error) {
    throw new Error(`Failed to delete workflow: ${error.message}`);
  }
}

/**
 * Get workflow statistics
 */
export async function getWorkflowStats(workflowId: string): Promise<WorkflowStats> {
  // Get leads assigned to this workflow
  const { data: leads, error } = await supabase
    .from('leads')
    .select('id, status, created_at')
    .eq('workflow_id', workflowId);

  if (error) {
    throw new Error(`Failed to fetch workflow stats: ${error.message}`);
  }

  const activeLeads = leads?.filter((lead) => lead.status === 'active').length || 0;
  const respondedLeads =
    leads?.filter((lead) => lead.status === 'responded').length || 0;
  const responseRate =
    activeLeads > 0 ? (respondedLeads / activeLeads) * 100 : 0;

  // Get last used timestamp from activity log
  const { data: lastActivity } = await supabase
    .from('activity_log')
    .select('timestamp')
    .eq('workflow_id', workflowId)
    .order('timestamp', { ascending: false })
    .limit(1)
    .single();

  return {
    activeLeads,
    respondedLeads,
    responseRate: Math.round(responseRate * 10) / 10,
    lastUsed: lastActivity?.timestamp,
  };
}

/**
 * Check if workflow should pause based on pause rules
 */
export function shouldPauseWorkflow(
  pauseRules: PauseRules | undefined,
  activity: {
    hasReplied?: boolean;
    hasClicked?: boolean;
    openCount?: number;
  }
): boolean {
  if (!pauseRules) return false;

  if (pauseRules.onReply && activity.hasReplied) return true;
  if (pauseRules.onClick && activity.hasClicked) return true;
  if (
    pauseRules.onOpenCount &&
    activity.openCount &&
    activity.openCount >= pauseRules.onOpenCount
  ) {
    return true;
  }

  return false;
}

/**
 * Assign a lead to a workflow and add to lemlist campaign if applicable
 */
export async function assignLeadToWorkflow(
  leadId: string,
  workflowId: string
): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  // Get workflow details
  const workflow = await getWorkflow(workflowId);
  if (!workflow) {
    throw new Error('Workflow not found');
  }

  // Get lead details
  const { data: lead, error: leadError } = await supabase
    .from('leads')
    .select('id, email, first_name, last_name, company')
    .eq('id', leadId)
    .single();

  if (leadError || !lead) {
    throw new Error('Lead not found');
  }

  // Update lead with workflow assignment
  const { error: updateError } = await supabase
    .from('leads')
    .update({
      workflow_id: workflowId,
      workflow_status: 'active',
    })
    .eq('id', leadId);

  if (updateError) {
    throw new Error(`Failed to assign workflow: ${updateError.message}`);
  }

  // If workflow uses lemlist, add lead to lemlist campaign
  if (workflow.email_provider === 'lemlist' && workflow.lemlist_campaign_id) {
    try {
      const { addLeadToLemlistCampaign } = await import('./lemlistWorkflowService');
      await addLeadToLemlistCampaign(
        user.id,
        workflow.lemlist_campaign_id,
        {
          email: lead.email || '',
          firstName: lead.first_name || undefined,
          lastName: lead.last_name || undefined,
          company: lead.company || undefined,
        }
      );
    } catch (error) {
      console.error('Error adding lead to lemlist campaign:', error);
      // Don't throw - workflow assignment succeeded, lemlist add failed
      // This allows the workflow to be assigned even if lemlist fails
    }
  }
}


