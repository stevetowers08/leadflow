import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { getClearbitLogo } from '@/utils/logoService';

export const usePopupPrefetch = () => {
  const queryClient = useQueryClient();

  const prefetchLeadData = async (leadId: string) => {
    const queryKey = ['popup-lead', leadId];
    
    // Check if data is already cached
    const existingData = queryClient.getQueryData(queryKey);
    if (existingData) return;

    // Prefetch lead data
    queryClient.prefetchQuery({
      queryKey,
      queryFn: async () => {
        const { data, error } = await supabase
          .from('people')
          .select(`
            *,
            companies(
              id, name, website, linkedin_url, profile_image_url, head_office, industry, company_size, lead_score, score_reason, automation_active, automation_started_at, priority, confidence_level, is_favourite, ai_info, key_info_raw, created_at, updated_at
            )
          `)
          .eq('id', leadId)
          .single();

        if (error) throw error;
        
        if (data?.companies) {
          data.companies = {
            ...data.companies,
            logo_url: data.companies?.profile_image_url || getClearbitLogo(data.companies?.name, data.companies?.website)
          };
        }
        
        return data;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  const prefetchCompanyData = async (companyId: string) => {
    const queryKey = ['popup-company', companyId];
    
    const existingData = queryClient.getQueryData(queryKey);
    if (existingData) return;

    queryClient.prefetchQuery({
      queryKey,
      queryFn: async () => {
        const { data, error } = await supabase
          .from('companies')
          .select(`
            id, name, website, linkedin_url, profile_image_url, head_office, industry, company_size, lead_score, score_reason, automation_active, automation_started_at, priority, confidence_level, is_favourite, ai_info, key_info_raw, created_at, updated_at
          `)
          .eq('id', companyId)
          .single();
        
        if (error) throw error;
        return data;
      },
      staleTime: 5 * 60 * 1000,
    });
  };

  const prefetchJobData = async (jobId: string) => {
    const queryKey = ['popup-job', jobId];
    
    const existingData = queryClient.getQueryData(queryKey);
    if (existingData) return;

    queryClient.prefetchQuery({
      queryKey,
      queryFn: async () => {
        const { data: job, error: jobError } = await supabase
          .from('jobs')
          .select('*')
          .eq('id', jobId)
          .single();

        if (jobError) throw jobError;

        let company = null;
        if (job?.company_id) {
          const { data: companyData, error: companyError } = await supabase
            .from('companies')
            .select(`
              id, name, website, linkedin_url, profile_image_url, head_office, industry, company_size, lead_score, score_reason, automation_active, automation_started_at, priority, confidence_level, is_favourite, ai_info, key_info_raw, created_at, updated_at
            `)
            .eq('id', job.company_id)
            .single();

          if (companyError) throw companyError;
          company = { 
            ...companyData, 
            logo_url: companyData?.profile_image_url || getClearbitLogo(companyData?.name, companyData?.website) 
          };
        }

        return { ...job, companies: company };
      },
      staleTime: 5 * 60 * 1000,
    });
  };

  const prefetchRelatedData = async (id: string, type: 'lead' | 'company' | 'job') => {
    // Prefetch related leads
    const relatedLeadsKey = ['popup-related-leads', id, type];
    const existingRelatedLeads = queryClient.getQueryData(relatedLeadsKey);
    
    if (!existingRelatedLeads) {
      queryClient.prefetchQuery({
        queryKey: relatedLeadsKey,
        queryFn: async () => {
          let query = supabase.from('people').select(`
            id, name, company_role, status, lead_score, location, created_at,
            companies!inner(id, name, website, profile_image_url)
          `);

          if (type === 'company') {
            query = query.eq('company_id', id);
          } else if (type === 'job') {
            // For jobs, we'd need to get the company_id first
            const { data: job } = await supabase.from('jobs').select('company_id').eq('id', id).single();
            if (job?.company_id) {
              query = query.eq('company_id', job.company_id);
            }
          } else if (type === 'lead') {
            const { data: lead } = await supabase.from('people').select('company_id').eq('id', id).single();
            if (lead?.company_id) {
              query = query.eq('company_id', lead.company_id).neq('id', id);
            }
          }

          const { data, error } = await query.limit(20).order('created_at', { ascending: false });
          
          if (error) throw error;
          return data || [];
        },
        staleTime: 2 * 60 * 1000,
      });
    }

    // Prefetch related jobs
    const relatedJobsKey = ['popup-related-jobs', id, type];
    const existingRelatedJobs = queryClient.getQueryData(relatedJobsKey);
    
    if (!existingRelatedJobs && (type === 'company' || type === 'lead')) {
      queryClient.prefetchQuery({
        queryKey: relatedJobsKey,
        queryFn: async () => {
          let query = supabase.from('jobs').select(`
            id, title, company_id, status, location, salary_min, salary_max, posted_date, created_at,
            companies!inner(id, name, website, profile_image_url)
          `);

          if (type === 'company') {
            query = query.eq('company_id', id);
          } else if (type === 'lead') {
            const { data: lead } = await supabase.from('people').select('company_id').eq('id', id).single();
            if (lead?.company_id) {
              query = query.eq('company_id', lead.company_id);
            }
          }

          const { data, error } = await query.limit(10).order('posted_date', { ascending: false });
          
          if (error) throw error;
          return data || [];
        },
        staleTime: 2 * 60 * 1000,
      });
    }
  };

  return {
    prefetchLeadData,
    prefetchCompanyData,
    prefetchJobData,
    prefetchRelatedData,
  };
};

