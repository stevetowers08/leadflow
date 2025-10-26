import { supabase } from '@/integrations/supabase/client';
import {
  CampaignSequence,
  CampaignSequenceFormData,
  CampaignStep,
} from '@/types/campaign.types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Campaign Sequences Hook
export function useCampaignSequences() {
  const queryClient = useQueryClient();

  const {
    data: sequences,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['campaign-sequences'],
    queryFn: async () => {
      console.log('🔍 Fetching campaign sequences...');
      const { data, error } = await supabase
        .from('campaign_sequences')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching campaign sequences:', error);
        throw error;
      }

      console.log('✅ Campaign sequences fetched:', data);
      return data as CampaignSequence[];
    },
  });

  const createSequence = useMutation({
    mutationFn: async (formData: CampaignSequenceFormData) => {
      // Remove created_by if not authenticated
      const { created_by, ...insertData } = formData;
      const { data, error } = await supabase
        .from('campaign_sequences')
        .insert([insertData])
        .select()
        .single();

      if (error) throw error;
      return data as CampaignSequence;
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
      const { data, error } = await supabase
        .from('campaign_sequences')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as CampaignSequence;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaign-sequences'] });
    },
  });

  const deleteSequence = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('campaign_sequences')
        .delete()
        .eq('id', id);

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
        .from('campaign_sequence_steps')
        .select('*')
        .eq('sequence_id', sequenceId)
        .order('order_position', { ascending: true });

      if (error) {
        throw error;
      }
      return data as CampaignStep[];
    },
    enabled: !!sequenceId,
  });

  const addStep = useMutation({
    mutationFn: async (type: 'email' | 'wait' | 'condition') => {
      // Get the next order position
      const { data: existingSteps } = await supabase
        .from('campaign_sequence_steps')
        .select('order_position')
        .eq('sequence_id', sequenceId)
        .order('order_position', { ascending: false })
        .limit(1);

      const nextOrder = existingSteps?.[0]?.order_position
        ? existingSteps[0].order_position + 1
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
        .from('campaign_sequence_steps')
        .insert([stepData])
        .select()
        .single();

      if (error) throw error;
      return data as CampaignStep;
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
        .from('campaign_sequence_steps')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as CampaignStep;
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
        .from('campaign_sequence_steps')
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

      const { error } = await supabase
        .from('campaign_sequence_steps')
        .upsert(updates, { onConflict: 'id' });

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
        .from('campaign_sequence_leads')
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
        .from('campaign_sequence_leads')
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
        .from('campaign_sequence_leads')
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
        .from('campaign_sequence_leads')
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
