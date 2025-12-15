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

// Campaign Sequences Hook - DISABLED (not in PDR)
export function useCampaignSequences() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

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
      // Verify user is authenticated
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      // Ensure Supabase session exists (required for RLS)
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
      if (sessionError || !session) {
        throw new Error('No active session. Please sign in again.');
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

      const { data, error } = await supabase
        .from('workflows')
        .insert({
          name: formData.name,
          description: formData.description || null,
          email_provider: 'gmail', // Default to gmail for email campaigns
          gmail_sequence: null,
          pause_rules: { status: workflowStatus }, // Store status in pause_rules metadata
          user_id: user.id,
        })
        .select()
        .single();

      if (error) {
        throw new Error(
          `Failed to create campaign sequence: ${getErrorMessage(error)}`
        );
      }

      if (!data) {
        throw new Error(
          'Campaign sequence was created but no data was returned'
        );
      }

      // Map workflow back to CampaignSequence format
      const userId =
        (data as { user_id?: string; created_by?: string }).user_id ||
        (data as { user_id?: string; created_by?: string }).created_by ||
        user.id;

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
      const { data, error } = await supabase
        // .from('campaign_sequence_steps') // Removed - not in PDR
        .from('workflows') // Use workflows instead
        .select('*')
        .eq('sequence_id', sequenceId)
        .order('order_position', { ascending: true });

      if (error) {
        throw error;
      }
      return data as unknown as CampaignStep[];
    },
    enabled: !!sequenceId,
  });

  const addStep = useMutation({
    mutationFn: async (type: 'email' | 'wait' | 'condition') => {
      // Get the next order position
      const { data: existingSteps } = await supabase
        // .from('campaign_sequence_steps') // Removed - not in PDR
        .from('workflows') // Use workflows instead
        .select('order_position')
        .eq('sequence_id', sequenceId)
        .order('order_position', { ascending: false })
        .limit(1);

      const nextOrder = (
        existingSteps as Array<{ order_position?: number }>
      )?.[0]?.order_position
        ? (existingSteps as Array<{ order_position: number }>)[0]
            .order_position + 1
        : 1;

      const stepData = {
        sequence_id: sequenceId,
        step_type: type,
        order_position: nextOrder,
        name: `New ${type} step`,
        ...(type === 'email' && {
          email_subject: '',
          email_body: '',
          send_immediately: 'immediate', // Changed to string
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
      };

      const { data, error } = await supabase
        // .from('campaign_sequence_steps') // Removed - not in PDR
        .from('workflows') // Use workflows instead
        .insert([stepData])
        .select()
        .single();

      if (error) throw error;
      return data as unknown as CampaignStep;
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
      const { data, error } = await supabase
        // .from('campaign_sequence_steps') // Removed - not in PDR
        .from('workflows') // Use workflows instead
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as unknown as CampaignStep;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['campaign-steps', sequenceId],
      });
    },
  });

  const deleteStep = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        // .from('campaign_sequence_steps') // Removed - not in PDR
        .from('workflows') // Use workflows instead
        .delete()
        .eq('id', id);

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
      const updates = reorderedSteps.map((step, index) => ({
        id: step.id,
        order_position: index + 1,
      }));

      // Update each step individually to avoid required field issues
      const updatePromises = updates.map(update =>
        supabase
          // .from('campaign_sequence_steps') // Removed - not in PDR
          .from('workflows') // Use workflows instead
          .update({ order_position: update.order_position })
          .eq('id', update.id)
      );

      const results = await Promise.all(updatePromises);
      const error = results.find(r => r.error)?.error;

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
      const { data, error } = await supabase
        // .from('campaign_sequence_leads') // Removed - not in PDR
        .from('leads') // Use leads table instead
        .select(
          `
          *,
          people:lead_id (
            id,
            name,
            email_address,
            company_role,
            companies:company_id (
              id,
              name
            )
          )
        `
        )
        .eq('sequence_id', sequenceId)
        .order('started_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!sequenceId,
  });

  const addLeads = useMutation({
    mutationFn: async (personIds: string[]) => {
      const leadData = personIds.map(personId => ({
        sequence_id: sequenceId,
        lead_id: personId,
        status: 'active' as const,
      }));

      const { data, error } = await supabase
        // .from('campaign_sequence_leads') // Removed - not in PDR
        .from('leads') // Use leads table instead
        .insert(leadData)
        .select();

      if (error) throw error;
      return data;
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
