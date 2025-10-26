// src/hooks/useJobFilterConfigs.ts

import { supabase } from '@/integrations/supabase/client';
import {
  CreateJobFilterConfigRequest,
  JobFilterConfig,
  JobFilterTestResult,
} from '@/types/jobFiltering';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useJobFilterConfigs() {
  return useQuery({
    queryKey: ['job-filter-configs'],
    queryFn: async (): Promise<JobFilterConfig[]> => {
      // Simple query - RLS is disabled for development
      const { data, error } = await supabase
        .from('job_filter_configs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    retry: (failureCount, error) => {
      // Don't retry on 500 errors to prevent infinite loops
      if (error && 'status' in error && error.status === 500) {
        return false;
      }
      return failureCount < 3;
    },
  });
}

export function useCreateJobFilterConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      config: CreateJobFilterConfigRequest
    ): Promise<JobFilterConfig> => {
      // Simple insert - RLS is disabled for development
      const { data, error } = await supabase
        .from('job_filter_configs')
        .insert({
          ...config,
          client_id: '720ab0e4-0c24-4b71-b906-f1928e44712f', // Development client ID
          user_id: '8fecfbaf-34e3-4106-9dd8-2cadeadea100', // Development user ID
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-filter-configs'] });
    },
  });
}

export function useUpdateJobFilterConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: { id: string } & Partial<JobFilterConfig>): Promise<JobFilterConfig> => {
      // Simple update - RLS is disabled for development
      const { data, error } = await supabase
        .from('job_filter_configs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-filter-configs'] });
    },
  });
}

export function useDeleteJobFilterConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      // Simple delete - RLS is disabled for development
      const { error } = await supabase
        .from('job_filter_configs')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-filter-configs'] });
    },
  });
}

export function useTestJobFilterConfig() {
  return useMutation({
    mutationFn: async (
      config: Partial<JobFilterConfig>
    ): Promise<JobFilterTestResult> => {
      const { data, error } = await supabase.functions.invoke(
        'test-job-filters',
        {
          body: { filterConfig: config },
        }
      );

      if (error) throw error;
      return data;
    },
  });
}

export function useDuplicateJobFilterConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (config: JobFilterConfig): Promise<JobFilterConfig> => {
      const { data, error } = await supabase
        .from('job_filter_configs')
        .insert({
          ...config,
          id: undefined,
          config_name: `${config.config_name} (Copy)`,
          created_at: undefined,
          updated_at: undefined,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-filter-configs'] });
    },
  });
}
