// Campaign Sequences removed - not in PDR. Use workflows table instead.
// This file is kept for backward compatibility but all functions return empty/error.

import { supabase } from '@/integrations/supabase/client';
import {
  CampaignSequence,
  CampaignSequenceFormData,
  CampaignStep,
} from '@/types/campaign.types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getErrorMessage } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { shouldBypassAuth, getAuthConfig } from '@/config/auth';

// Campaign Sequences Hook - DISABLED (not in PDR)
export function useCampaignSequences() {
  const queryClient = useQueryClient();
  const { user, session } = useAuth();

  const {
    data: sequences,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['campaign-sequences'],
    queryFn: async () => {
      console.log('🔍 Fetching campaign sequences from workflows table...');

      // Use workflows table instead of campaign_sequences
      const { data, error } = await supabase
        .from('workflows')
        .select('*')
        .order('created_at', { ascending: false });

      // Handle missing table gracefully
      if (error) {
        const errorMessage = (error as { message?: string })?.message || '';
        if (
          errorMessage.includes('schema cache') ||
          errorMessage.includes('does not exist')
        ) {
          console.debug(
            '❌ Error fetching workflows: Could not find the table',
            error
          );
          return [] as CampaignSequence[];
        }
        console.error(
          '❌ Error fetching workflows:',
          getErrorMessage(error),
          error
        );
        throw error;
      }

      // Map workflows to CampaignSequence format for backward compatibility
      const mappedSequences: CampaignSequence[] = (data || []).map(workflow => {
        // Handle both user_id (from database) and created_by (from type) fields
        const userId =
          (workflow as { user_id?: string; created_by?: string }).user_id ||
          (workflow as { user_id?: string; created_by?: string }).created_by ||
          user?.id ||
          '';

        // Get status from workflow.status or from pause_rules.status (fallback)
        const workflowStatus =
          (workflow as { status?: string }).status ||
          (workflow.pause_rules as { status?: string })?.status ||
          'draft';

        // Map 'archived' -> 'completed' for CampaignSequence
        const mappedStatus =
          workflowStatus === 'archived'
            ? 'completed'
            : (workflowStatus as 'draft' | 'active' | 'paused' | 'completed');

        return {
          id: workflow.id,
          name: workflow.name,
          description: workflow.description || '',
          status: mappedStatus,
          created_at: workflow.created_at || new Date().toISOString(),
          updated_at: workflow.updated_at || new Date().toISOString(),
          created_by: userId,
          total_leads: 0, // Will be calculated separately if needed
          active_leads: 0, // Will be calculated separately if needed
        };
      });

      console.log('✅ Campaign sequences fetched:', mappedSequences);
      return mappedSequences;
    },
  });

  const createSequence = useMutation({
    mutationFn: async (formData: CampaignSequenceFormData) => {
      const bypassAuth = shouldBypassAuth();

      // In bypass mode, use context user directly (no real session exists)
      // In normal mode, require a Supabase session
      let userId: string | undefined;

      if (bypassAuth) {
        // Bypass mode: use context user or session user, fallback to mock user from config
        // The AuthContext creates a mock session in bypass mode, so check that first
        userId = session?.user?.id || user?.id;
        if (!userId) {
          // Fallback: get mock user ID from config if context user not loaded yet
          const authConfig = getAuthConfig();
          userId = authConfig.mockUser.id;
        }
        if (!userId) {
          // Best practice: Require NEXT_PUBLIC_MOCK_USER_ID to be set to a real user ID
          // This ensures referential integrity and proper data relationships
          throw new Error(
            'User not authenticated. In bypass mode, you must set NEXT_PUBLIC_MOCK_USER_ID to a valid user ID from your database. ' +
              'To get a user ID: 1) Sign in normally once, 2) Check auth.users table in Supabase, 3) Set NEXT_PUBLIC_MOCK_USER_ID to that UUID.'
          );
        }
      } else {
        // Normal mode: require Supabase session
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();
        if (sessionError || !session) {
          throw new Error('No active session. Please sign in again.');
        }

        // Get user from session (more reliable than context user)
        const sessionUser = session.user;
        if (!sessionUser?.id) {
          throw new Error('User not authenticated');
        }

        // Use session user, fallback to context user
        userId = sessionUser.id || user?.id;
      }

      if (!userId) {
        throw new Error('User not authenticated');
      }

      // Create workflow instead of campaign_sequence
      // Map status: 'completed' -> 'archived' for workflows
      // Store status in pause_rules since workflows table may not have status column
      const workflowStatus =
        formData.status === 'completed'
          ? 'archived'
          : formData.status === 'active' ||
              formData.status === 'paused' ||
              formData.status === 'draft'
            ? formData.status
            : 'draft';

      // Best practice: workflows table uses created_by (nullable, references auth.users.id)
      // Always use a real user ID from the database to maintain referential integrity
      // The RLS policy "Allow all operations on workflows" permits this
      const { data, error } = await supabase
        .from('workflows')
        .insert({
          name: formData.name,
          description: formData.description || null,
          email_provider: 'gmail', // Default to gmail for email campaigns
          gmail_sequence: null,
          pause_rules: { status: workflowStatus }, // Store status in pause_rules metadata
          created_by: userId, // workflows table uses created_by (not user_id)
        })
        .select()
        .single();

      if (error) {
        // Provide detailed error message for debugging
        const errorMessage = getErrorMessage(error);
        const supabaseError = error as {
          code?: string;
          message?: string;
          details?: string;
          hint?: string;
        };

        let detailedMessage = `Failed to create campaign sequence: ${errorMessage}`;
        if (supabaseError.code) {
          detailedMessage += ` (Code: ${supabaseError.code})`;
        }
        if (supabaseError.details) {
          detailedMessage += ` - ${supabaseError.details}`;
        }
        if (supabaseError.hint) {
          detailedMessage += ` (Hint: ${supabaseError.hint})`;
        }

        throw new Error(detailedMessage);
      }

      if (!data) {
        throw new Error(
          'Campaign sequence was created but no data was returned'
        );
      }

      // Map workflow back to CampaignSequence format
      const mappedUserId =
        (data as { user_id?: string; created_by?: string }).user_id ||
        (data as { user_id?: string; created_by?: string }).created_by ||
        userId;

      // Get status from data.status or from pause_rules.status (fallback)
      const retrievedStatus =
        (data as { status?: string }).status ||
        (data.pause_rules as { status?: string })?.status ||
        'draft';

      // Map 'archived' -> 'completed' for CampaignSequence
      const mappedStatus =
        retrievedStatus === 'archived'
          ? 'completed'
          : (retrievedStatus as 'draft' | 'active' | 'paused' | 'completed');

      const sequence: CampaignSequence = {
        id: data.id,
        name: data.name,
        description: data.description || '',
        status: mappedStatus,
        created_at: data.created_at || new Date().toISOString(),
        updated_at: data.updated_at || new Date().toISOString(),
        created_by: mappedUserId,
        total_leads: 0,
        active_leads: 0,
      };

      return sequence;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaign-sequences'] });
    },
  });

  const updateSequence = useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<CampaignSequence>;
    }) => {
      // Map CampaignSequence updates to workflow format
      const workflowUpdates: Record<string, unknown> = {};

      if (updates.name !== undefined) workflowUpdates.name = updates.name;
      if (updates.description !== undefined)
        workflowUpdates.description = updates.description || null;
      if (updates.status !== undefined) {
        // Map 'completed' -> 'archived' for workflows
        const workflowStatus =
          updates.status === 'completed'
            ? 'archived'
            : updates.status === 'active' ||
                updates.status === 'paused' ||
                updates.status === 'draft'
              ? updates.status
              : 'draft';

        // Try to update status field if it exists, otherwise store in pause_rules
        workflowUpdates.status = workflowStatus;

        // Also update pause_rules to include status as fallback
        const { data: currentWorkflow } = await supabase
          .from('workflows')
          .select('pause_rules')
          .eq('id', id)
          .single();

        const currentPauseRules =
          (currentWorkflow?.pause_rules as Record<string, unknown>) || {};
        workflowUpdates.pause_rules = {
          ...currentPauseRules,
          status: workflowStatus,
        };
      }

      const { data, error } = await supabase
        .from('workflows')
        .update(workflowUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      if (!data) {
        throw new Error('Workflow was updated but no data was returned');
      }

      // Map workflow back to CampaignSequence format
      const userId =
        (data as { user_id?: string; created_by?: string }).user_id ||
        (data as { user_id?: string; created_by?: string }).created_by ||
        user?.id ||
        '';

      // Get status from data.status or from pause_rules.status (fallback)
      const workflowStatus =
        (data as { status?: string }).status ||
        (data.pause_rules as { status?: string })?.status ||
        'draft';

      // Map 'archived' -> 'completed' for CampaignSequence
      const mappedStatus =
        workflowStatus === 'archived'
          ? 'completed'
          : (workflowStatus as 'draft' | 'active' | 'paused' | 'completed');

      const sequence: CampaignSequence = {
        id: data.id,
        name: data.name,
        description: data.description || '',
        status: mappedStatus,
        created_at: data.created_at || new Date().toISOString(),
        updated_at: data.updated_at || new Date().toISOString(),
        created_by: userId,
        total_leads: 0,
        active_leads: 0,
      };

      return sequence;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaign-sequences'] });
    },
  });

  const deleteSequence = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('workflows').delete().eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaign-sequences'] });
    },
  });

  return {
    sequences: sequences || [],
    isLoading,
    error,
    createSequence,
    updateSequence,
    deleteSequence,
  };
}

// Campaign Steps Hook
export function useCampaignSteps(sequenceId: string) {
  const queryClient = useQueryClient();

  const {
    data: steps,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['campaign-steps', sequenceId],
    queryFn: async () => {
      // Get the workflow by ID (sequenceId is the workflow ID)
      const { data: workflow, error } = await supabase
        .from('workflows')
        .select('gmail_sequence')
        .eq('id', sequenceId)
        .single();

      if (error) {
        throw error;
      }

      // Extract steps from gmail_sequence JSONB field
      // gmail_sequence is an array of step objects
      const gmailSequence = (workflow?.gmail_sequence as CampaignStep[]) || [];

      // Map to CampaignStep format with sequence_id
      return gmailSequence.map((step, index) => ({
        ...step,
        sequence_id: sequenceId,
        order_position: step.order_position || index + 1,
      })) as CampaignStep[];
    },
    enabled: !!sequenceId,
  });

  const addStep = useMutation({
    mutationFn: async (type: 'email' | 'wait' | 'condition') => {
      // Get current workflow with steps
      const { data: workflow, error: fetchError } = await supabase
        .from('workflows')
        .select('gmail_sequence')
        .eq('id', sequenceId)
        .single();

      if (fetchError) throw fetchError;

      // Get existing steps from gmail_sequence
      const existingSteps = (workflow?.gmail_sequence as CampaignStep[]) || [];
      const nextOrder = existingSteps.length + 1;

      // Create new step
      const newStep: CampaignStep = {
        id: crypto.randomUUID(),
        sequence_id: sequenceId,
        step_type: type,
        order_position: nextOrder,
        name: `New ${type} step`,
        created_at: new Date().toISOString(),
        ...(type === 'email' && {
          email_subject: '',
          email_body: '',
          send_immediately: 'immediate',
        }),
        ...(type === 'wait' && {
          wait_duration: 1,
          wait_unit: 'days' as const,
          business_hours_only: false,
        }),
        ...(type === 'condition' && {
          condition_type: 'opened' as const,
          condition_wait_duration: 24,
        }),
      } as CampaignStep;

      // Add new step to array
      const updatedSteps = [...existingSteps, newStep];

      // Update workflow's gmail_sequence field
      const { error } = await supabase
        .from('workflows')
        .update({ gmail_sequence: updatedSteps })
        .eq('id', sequenceId);

      if (error) throw error;
      return newStep;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['campaign-steps', sequenceId],
      });
    },
  });

  const updateStep = useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<CampaignStep>;
    }) => {
      // Get current workflow with steps
      const { data: workflow, error: fetchError } = await supabase
        .from('workflows')
        .select('gmail_sequence')
        .eq('id', sequenceId)
        .single();

      if (fetchError) throw fetchError;

      // Get existing steps and update the one with matching id
      const existingSteps = (workflow?.gmail_sequence as CampaignStep[]) || [];
      const updatedSteps = existingSteps.map(step =>
        step.id === id ? { ...step, ...updates } : step
      );

      // Update workflow's gmail_sequence field
      const { error } = await supabase
        .from('workflows')
        .update({ gmail_sequence: updatedSteps })
        .eq('id', sequenceId);

      if (error) throw error;

      const updatedStep = updatedSteps.find(s => s.id === id);
      if (!updatedStep) throw new Error('Step not found after update');
      return updatedStep as CampaignStep;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['campaign-steps', sequenceId],
      });
    },
  });

  const deleteStep = useMutation({
    mutationFn: async (id: string) => {
      // Get current workflow with steps
      const { data: workflow, error: fetchError } = await supabase
        .from('workflows')
        .select('gmail_sequence')
        .eq('id', sequenceId)
        .single();

      if (fetchError) throw fetchError;

      // Remove step from array
      const existingSteps = (workflow?.gmail_sequence as CampaignStep[]) || [];
      const updatedSteps = existingSteps.filter(step => step.id !== id);

      // Update workflow's gmail_sequence field
      const { error } = await supabase
        .from('workflows')
        .update({ gmail_sequence: updatedSteps })
        .eq('id', sequenceId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['campaign-steps', sequenceId],
      });
    },
  });

  const reorderSteps = useMutation({
    mutationFn: async (reorderedSteps: CampaignStep[]) => {
      // Update order_position for each step
      const updatedSteps = reorderedSteps.map((step, index) => ({
        ...step,
        order_position: index + 1,
      }));

      // Update workflow's gmail_sequence field with reordered steps
      const { error } = await supabase
        .from('workflows')
        .update({ gmail_sequence: updatedSteps })
        .eq('id', sequenceId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['campaign-steps', sequenceId],
      });
    },
  });

  return {
    steps: steps || [],
    isLoading,
    error,
    addStep,
    updateStep,
    deleteStep,
    reorderSteps,
  };
}

// Campaign Sequence Lead Management Hook
export function useCampaignSequenceLeads(sequenceId: string) {
  const queryClient = useQueryClient();

  const {
    data: leads,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['campaign-sequence-leads', sequenceId],
    queryFn: async () => {
      // Simplified - just get leads with workflow_id matching sequenceId
      // Note: campaign_sequence_leads table doesn't exist, use workflow_id instead
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('workflow_id', sequenceId)
        .order('created_at', { ascending: false });

      if (error) {
        // Handle gracefully if workflow_id column doesn't exist or other errors
        const errorMessage = (error as { message?: string })?.message || '';
        if (
          errorMessage.includes('does not exist') ||
          errorMessage.includes('column') ||
          (error as { status?: number })?.status === 400
        ) {
          return []; // Return empty array if column doesn't exist
        }
        throw error;
      }
      return data || [];
    },
    enabled: !!sequenceId,
  });

  const addLeads = useMutation({
    mutationFn: async (leadIds: string[]) => {
      // Update leads to assign them to workflow
      // Note: campaign_sequence_leads table doesn't exist, use workflow_id instead
      const updates = leadIds.map(leadId => ({
        id: leadId,
        workflow_id: sequenceId,
        workflow_status: 'active' as const,
      }));

      const results = await Promise.all(
        updates.map(update =>
          supabase
            .from('leads')
            .update({
              workflow_id: update.workflow_id,
              workflow_status: update.workflow_status,
            })
            .eq('id', update.id)
            .select()
            .single()
        )
      );

      const errors = results.filter(r => r.error);
      if (errors.length > 0) {
        throw errors[0].error;
      }

      return results.map(r => r.data).filter(Boolean);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['campaign-sequence-leads', sequenceId],
      });
      queryClient.invalidateQueries({ queryKey: ['campaign-sequences'] });
    },
  });

  const updateLeadStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data, error } = await supabase
        // .from('campaign_sequence_leads') // Removed - not in PDR
        .from('leads') // Use leads table instead
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['campaign-sequence-leads', sequenceId],
      });
    },
  });

  const removeLead = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        // .from('campaign_sequence_leads') // Removed - not in PDR
        .from('leads') // Use leads table instead
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['campaign-sequence-leads', sequenceId],
      });
      queryClient.invalidateQueries({ queryKey: ['campaign-sequences'] });
    },
  });

  return {
    leads: leads || [],
    isLoading,
    error,
    addLeads,
    updateLeadStatus,
    removeLead,
  };
}
