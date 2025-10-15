import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';
import type { JobFilters } from '@/lib/queryKeys';

export type Job = Tables<'jobs'> & {
  company_name?: string;
  company_industry?: string;
  company_logo_url?: string;
  company_head_office?: string;
  company_size?: string;
  company_website?: string;
  company_lead_score?: string;
  company_priority?: string;
  company_automation_active?: boolean;
  company_confidence_level?: string;
  company_linkedin_url?: string;
  company_score_reason?: string;
  company_is_favourite?: boolean;
  total_leads?: number;
  new_leads?: number;
  automation_started_leads?: number;
};

export const jobsService = {
  async getJobs(filters: JobFilters = {}): Promise<Job[]> {
    console.log('🔍 JobsService.getJobs called with filters:', filters);

    const { data, error } = await supabase
      .from('jobs')
      .select(
        `
        id, title, company_id, location, description, employment_type, 
        seniority_level, automation_active, created_at, priority, 
        lead_score_job, salary, function, logo_url, owner_id, 
        posted_date, valid_through
      `
      )
      .order(filters.sortBy || 'posted_date', {
        ascending: filters.sortOrder === 'asc',
      });

    if (error) {
      console.error('❌ JobsService.getJobs error:', error);
      throw error;
    }

    console.log('✅ JobsService.getJobs success:', data?.length || 0, 'jobs');
    return data || [];
  },

  async getJob(id: string): Promise<Job> {
    console.log('🔍 JobsService.getJob called with id:', id);

    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('❌ JobsService.getJob error:', error);
      throw error;
    }

    console.log('✅ JobsService.getJob success:', data);
    return data;
  },

  async updateJob(id: string, updates: Partial<Job>): Promise<Job> {
    console.log('🔍 JobsService.updateJob called:', { id, updates });

    const { data, error } = await supabase
      .from('jobs')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('❌ JobsService.updateJob error:', error);
      throw error;
    }

    console.log('✅ JobsService.updateJob success:', data);
    return data;
  },

  async createJob(job: Omit<Job, 'id' | 'created_at'>): Promise<Job> {
    console.log('🔍 JobsService.createJob called:', job);

    const { data, error } = await supabase
      .from('jobs')
      .insert(job)
      .select()
      .single();

    if (error) {
      console.error('❌ JobsService.createJob error:', error);
      throw error;
    }

    console.log('✅ JobsService.createJob success:', data);
    return data;
  },

  async deleteJob(id: string): Promise<void> {
    console.log('🔍 JobsService.deleteJob called with id:', id);

    const { error } = await supabase.from('jobs').delete().eq('id', id);

    if (error) {
      console.error('❌ JobsService.deleteJob error:', error);
      throw error;
    }

    console.log('✅ JobsService.deleteJob success');
  },
};
