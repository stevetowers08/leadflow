import { supabase } from '@/integrations/supabase/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Simplified Campaign Types
export interface SimplifiedCampaign {
  id: string;
  name: string;
  description?: string;
  steps: CampaignStep[];
  status: 'active' | 'paused' | 'archived';
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface CampaignStep {
  type: 'email' | 'wait';
  name: string;
  subject?: string;
  body?: string;
  wait_days?: number;
  business_hours_only?: boolean;
}

export interface SimplifiedCampaignLead {
  id: string;
  campaign_id: string;
  person_id: string;
  current_step_index: number;
  status: 'active' | 'paused' | 'completed' | 'failed';
  next_send_at?: string;
  last_sent_at?: string;
  total_sent: number;
  created_at: string;
  updated_at: string;
}

// Simplified Campaigns Hook
export function useSimplifiedCampaigns() {
  const queryClient = useQueryClient();

  const {
    data: campaigns,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['simplified-campaigns'],
    queryFn: async () => {
      console.log('🔍 Fetching simplified campaigns...');
      const { data, error } = await supabase
        .from('simplified_campaigns' as never)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching simplified campaigns:', error);
        throw error;
      }

      console.log('✅ Simplified campaigns fetched:', data);
      return data as unknown as SimplifiedCampaign[];
    },
  });

  const createCampaign = useMutation({
    mutationFn: async (formData: {
      name: string;
      description?: string;
      steps: CampaignStep[];
    }) => {
      const { data, error } = await supabase
        .from('simplified_campaigns' as never)
        .insert([
          {
            name: formData.name,
            description: formData.description,
            steps: formData.steps,
            status: 'active',
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data as unknown as SimplifiedCampaign;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['simplified-campaigns'] });
    },
  });

  const updateCampaign = useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<SimplifiedCampaign>;
    }) => {
      const { data, error } = await supabase
        .from('simplified_campaigns' as never)
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as unknown as SimplifiedCampaign;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['simplified-campaigns'] });
    },
  });

  const deleteCampaign = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('simplified_campaigns' as never)
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['simplified-campaigns'] });
    },
  });

  return {
    campaigns: campaigns || [],
    isLoading,
    error,
    createCampaign,
    updateCampaign,
    deleteCampaign,
  };
}

// Simplified Campaign Steps Hook (for editing campaigns)
export function useSimplifiedCampaignSteps(campaignId: string) {
  const queryClient = useQueryClient();

  const {
    data: campaign,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['simplified-campaign', campaignId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('simplified_campaigns' as never)
        .select('*')
        .eq('id', campaignId)
        .single();

      if (error) throw error;
      return data as unknown as SimplifiedCampaign;
    },
    enabled: !!campaignId,
  });

  const updateSteps = useMutation({
    mutationFn: async (steps: CampaignStep[]) => {
      const { data, error } = await supabase
        .from('simplified_campaigns' as never)
        .update({ steps })
        .eq('id', campaignId)
        .select()
        .single();

      if (error) throw error;
      return data as unknown as SimplifiedCampaign;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['simplified-campaign', campaignId],
      });
      queryClient.invalidateQueries({ queryKey: ['simplified-campaigns'] });
    },
  });

  const addStep = useMutation({
    mutationFn: async (step: CampaignStep) => {
      const currentSteps = campaign?.steps || [];
      const newSteps = [...currentSteps, step];

      const { data, error } = await supabase
        .from('simplified_campaigns' as never)
        .update({ steps: newSteps })
        .eq('id', campaignId)
        .select()
        .single();

      if (error) throw error;
      return data as unknown as SimplifiedCampaign;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['simplified-campaign', campaignId],
      });
      queryClient.invalidateQueries({ queryKey: ['simplified-campaigns'] });
    },
  });

  const updateStep = useMutation({
    mutationFn: async ({
      index,
      step,
    }: {
      index: number;
      step: CampaignStep;
    }) => {
      const currentSteps = campaign?.steps || [];
      const newSteps = [...currentSteps];
      newSteps[index] = step;

      const { data, error } = await supabase
        .from('simplified_campaigns' as never)
        .update({ steps: newSteps })
        .eq('id', campaignId)
        .select()
        .single();

      if (error) throw error;
      return data as unknown as SimplifiedCampaign;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['simplified-campaign', campaignId],
      });
      queryClient.invalidateQueries({ queryKey: ['simplified-campaigns'] });
    },
  });

  const deleteStep = useMutation({
    mutationFn: async (index: number) => {
      const currentSteps = campaign?.steps || [];
      const newSteps = currentSteps.filter((_, i) => i !== index);

      const { data, error } = await supabase
        .from('simplified_campaigns' as never)
        .update({ steps: newSteps })
        .eq('id', campaignId)
        .select()
        .single();

      if (error) throw error;
      return data as unknown as SimplifiedCampaign;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['simplified-campaign', campaignId],
      });
      queryClient.invalidateQueries({ queryKey: ['simplified-campaigns'] });
    },
  });

  const reorderSteps = useMutation({
    mutationFn: async (reorderedSteps: CampaignStep[]) => {
      const { data, error } = await supabase
        .from('simplified_campaigns' as never)
        .update({ steps: reorderedSteps })
        .eq('id', campaignId)
        .select()
        .single();

      if (error) throw error;
      return data as unknown as SimplifiedCampaign;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['simplified-campaign', campaignId],
      });
      queryClient.invalidateQueries({ queryKey: ['simplified-campaigns'] });
    },
  });

  return {
    campaign,
    steps: campaign?.steps || [],
    isLoading,
    error,
    addStep,
    updateStep,
    deleteStep,
    reorderSteps,
    updateSteps,
  };
}

// Simplified Campaign Leads Hook
export function useSimplifiedCampaignLeads(campaignId: string) {
  const queryClient = useQueryClient();

  const {
    data: leads,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['simplified-campaign-leads', campaignId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('simplified_campaign_leads' as never)
        .select(
          `
          *,
          people:person_id (
            id,
            first_name,
            last_name,
            email_address,
            company_role,
            companies:company_id (
              id,
              name
            )
          )
        `
        )
        .eq('campaign_id', campaignId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as unknown as (SimplifiedCampaignLead & {
        people: Record<string, unknown>;
      })[];
    },
    enabled: !!campaignId,
  });

  const addLeads = useMutation({
    mutationFn: async (personIds: string[]) => {
      const leadData = personIds.map(personId => ({
        campaign_id: campaignId,
        person_id: personId,
        status: 'active' as const,
        current_step_index: 0,
        next_send_at: new Date().toISOString(), // Send immediately
        total_sent: 0,
      }));

      const { data, error } = await supabase
        .from('simplified_campaign_leads' as never)
        .insert(leadData)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['simplified-campaign-leads', campaignId],
      });
      queryClient.invalidateQueries({ queryKey: ['simplified-campaigns'] });
    },
  });

  const updateLeadStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data, error } = await supabase
        .from('simplified_campaign_leads' as never)
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['simplified-campaign-leads', campaignId],
      });
    },
  });

  const removeLead = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('simplified_campaign_leads' as never)
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['simplified-campaign-leads', campaignId],
      });
      queryClient.invalidateQueries({ queryKey: ['simplified-campaigns'] });
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

// Campaign Email Logs Hook
export function useCampaignEmailLogs(campaignId: string) {
  const {
    data: logs,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['campaign-email-logs', campaignId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('campaign_email_logs' as never)
        .select(
          `
          *,
          people:person_id (
            id,
            first_name,
            last_name,
            email_address
          )
        `
        )
        .eq('campaign_id', campaignId)
        .order('sent_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!campaignId,
  });

  return {
    logs: logs || [],
    isLoading,
    error,
  };
}
