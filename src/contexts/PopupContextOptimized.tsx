import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { getClearbitLogo } from '@/utils/logoService';
import { useScreenReaderAnnouncement } from '@/hooks/useScreenReaderAnnouncement';

interface PopupData {
  // Lead data
  lead?: any;
  company?: any;
  job?: any;
  
  // Related data
  relatedLeads?: any[];
  relatedJobs?: any[];
  relatedCompanies?: any[];
  
  // Loading states
  isLoadingLead?: boolean;
  isLoadingCompany?: boolean;
  isLoadingJob?: boolean;
  isLoadingRelatedLeads?: boolean;
  isLoadingRelatedJobs?: boolean;
  
  // Error states
  errorLead?: Error | null;
  errorCompany?: Error | null;
  errorJob?: Error | null;
  errorRelatedLeads?: Error | null;
  errorRelatedJobs?: Error | null;
}

interface PopupContextType {
  // Current popup state
  activePopup: 'lead' | 'company' | 'job' | null;
  popupData: PopupData;
  
  // Actions
  openLeadPopup: (leadId: string) => void;
  openCompanyPopup: (companyId: string) => void;
  openJobPopup: (jobId: string) => void;
  closePopup: () => void;
  
  // Selection for automation
  selectedLeads: any[];
  toggleLeadSelection: (leadId: string) => void;
  clearSelection: () => void;
}

const PopupContext = createContext<PopupContextType | undefined>(undefined);

export const usePopup = () => {
  const context = useContext(PopupContext);
  if (!context) {
    throw new Error('usePopup must be used within a PopupProvider');
  }
  return context;
};

interface PopupProviderProps {
  children: React.ReactNode;
}

export const PopupProvider: React.FC<PopupProviderProps> = ({ children }) => {
  const [activePopup, setActivePopup] = useState<'lead' | 'company' | 'job' | null>(null);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [selectedLeads, setSelectedLeads] = useState<any[]>([]);
  const announce = useScreenReaderAnnouncement();

  // OPTIMIZATION: Only fetch data for active popup type
  const { data: leadData, isLoading: isLoadingLead, error: errorLead } = useQuery({
    queryKey: ['popup-lead', currentId],
    queryFn: async () => {
      if (!currentId) return null;
      
      const { data, error } = await supabase
        .from('people')
        .select(`
          *,
          companies(
            id,
            name,
            website,
            linkedin_url,
            head_office,
            industry,
            company_size,
            lead_score,
            score_reason,
            automation_active,
            automation_started_at,
            priority,
            confidence_level,
            is_favourite,
            ai_info,
            key_info_raw,
            created_at,
            updated_at
          )
        `)
        .eq('id', currentId)
        .single();
        
      if (error) throw error;
      
      // Process lead data with company logo URL
      if (data?.companies) {
        data.companies = {
          ...data.companies,
          logo_url: getClearbitLogo(data.companies?.name, data.companies?.website)
        };
      }
      
      return data;
    },
    enabled: !!currentId && activePopup === 'lead', // Only fetch when lead popup is active
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });

  // OPTIMIZATION: Only fetch company data when company popup is active
  const { data: companyData, isLoading: isLoadingCompany, error: errorCompany } = useQuery({
    queryKey: ['popup-company', currentId],
    queryFn: async () => {
      if (!currentId) return null;
      
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', currentId)
        .single();
        
      if (error) throw error;
      return data;
    },
    enabled: !!currentId && activePopup === 'company', // Only fetch when company popup is active
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });

  // OPTIMIZATION: Only fetch job data when job popup is active
  const { data: jobData, isLoading: isLoadingJob, error: errorJob } = useQuery({
    queryKey: ['popup-job', currentId],
    queryFn: async () => {
      if (!currentId) return null;
      
      // Fetch job with company data in single query
      const { data: job, error: jobError } = await supabase
        .from('jobs')
        .select(`
          *,
          companies!inner(
            id,
            name,
            website,
            linkedin_url,
            head_office,
            industry,
            company_size,
            lead_score,
            score_reason,
            automation_active,
            automation_started_at,
            priority,
            confidence_level,
            is_favourite,
            ai_info,
            key_info_raw,
            created_at,
            updated_at
          )
        `)
        .eq('id', currentId)
        .single();
        
      if (jobError) throw jobError;
      
      // Process company data with logo URL
      if (job?.companies) {
        job.companies = {
          ...job.companies,
          logo_url: job.companies?.profile_image_url || getClearbitLogo(job.companies?.name, job.companies?.website)
        };
      }
      
      return job;
    },
    enabled: !!currentId && activePopup === 'job', // Only fetch when job popup is active
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });

  // OPTIMIZATION: Only fetch related data when needed
  const { data: relatedLeads, isLoading: isLoadingRelatedLeads, error: errorRelatedLeads } = useQuery({
    queryKey: ['popup-related-leads', currentId, activePopup],
    queryFn: async () => {
      if (!currentId || !['company', 'job', 'lead'].includes(activePopup!)) return [];
      
      let companyId = currentId;
      if (activePopup === 'job' && jobData?.company_id) {
        companyId = jobData.company_id;
      } else if (activePopup === 'lead' && leadData?.company_id) {
        companyId = leadData.company_id;
      }
      
      let query = supabase
        .from('people')
        .select('*')
        .eq('company_id', companyId);
      
      // Exclude the current lead when viewing a lead popup
      if (activePopup === 'lead') {
        query = query.neq('id', currentId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
        
      if (error) {
        console.error('Related leads query error:', error);
        throw error;
      }
      return data || [];
    },
    enabled: !!currentId && ['company', 'job', 'lead'].includes(activePopup!) && 
      (activePopup === 'company' || 
       (activePopup === 'job' && !!jobData) || 
       (activePopup === 'lead' && !!leadData)),
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 5 * 60 * 1000, // 5 minutes
  });

  // OPTIMIZATION: Only fetch related jobs when needed
  const { data: relatedJobs, isLoading: isLoadingRelatedJobs, error: errorRelatedJobs } = useQuery({
    queryKey: ['popup-related-jobs', currentId, activePopup],
    queryFn: async () => {
      if (!currentId || !['company', 'lead'].includes(activePopup!)) return [];
      
      let companyId = currentId;
      if (activePopup === 'lead' && leadData?.company_id) {
        companyId = leadData.company_id;
      }
      
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          companies(
            id,
            name,
            website,
            linkedin_url,
            head_office,
            industry,
            company_size,
            lead_score,
            score_reason,
            automation_active,
            automation_started_at,
            priority,
            confidence_level,
            is_favourite,
            ai_info,
            key_info_raw,
            created_at,
            updated_at
          )
        `)
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data || [];
    },
    enabled: !!currentId && ['company', 'lead'].includes(activePopup!) && 
      (activePopup === 'company' || (activePopup === 'lead' && !!leadData)),
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 5 * 60 * 1000, // 5 minutes
  });

  const openLeadPopup = useCallback((leadId: string) => {
    setCurrentId(leadId);
    setActivePopup('lead');
    setSelectedLeads([]);
    announce('Lead popup opened', 'polite');
  }, [announce]);

  const openCompanyPopup = useCallback((companyId: string) => {
    setCurrentId(companyId);
    setActivePopup('company');
    setSelectedLeads([]);
    announce('Company popup opened', 'polite');
  }, [announce]);

  const openJobPopup = useCallback((jobId: string) => {
    setCurrentId(jobId);
    setActivePopup('job');
    setSelectedLeads([]);
    announce('Job popup opened', 'polite');
  }, [announce]);

  const closePopup = useCallback(() => {
    setActivePopup(null);
    setCurrentId(null);
    setSelectedLeads([]);
    announce('Popup closed', 'polite');
  }, [announce]);

  const toggleLeadSelection = useCallback((leadId: string) => {
    setSelectedLeads(prev => {
      const isSelected = prev.some(lead => lead.id === leadId);
      if (isSelected) {
        return prev.filter(lead => lead.id !== leadId);
      } else {
        const lead = relatedLeads?.find(l => l.id === leadId);
        return lead ? [...prev, lead] : prev;
      }
    });
  }, [relatedLeads]);

  const clearSelection = useCallback(() => {
    setSelectedLeads([]);
  }, []);

  // OPTIMIZATION: Memoize expensive computations
  const popupData: PopupData = useMemo(() => ({
    lead: leadData,
    company: companyData || leadData?.companies || jobData?.companies,
    job: jobData,
    relatedLeads,
    relatedJobs,
    isLoadingLead,
    isLoadingCompany,
    isLoadingJob,
    isLoadingRelatedLeads,
    isLoadingRelatedJobs,
    errorLead,
    errorCompany,
    errorJob,
    errorRelatedLeads,
    errorRelatedJobs,
  }), [leadData, companyData, jobData, relatedLeads, relatedJobs, isLoadingLead, isLoadingCompany, isLoadingJob, isLoadingRelatedLeads, isLoadingRelatedJobs, errorLead, errorCompany, errorJob, errorRelatedLeads, errorRelatedJobs]);

  // OPTIMIZATION: Memoize context value to prevent unnecessary re-renders
  const contextValue: PopupContextType = useMemo(() => ({
    activePopup,
    popupData,
    openLeadPopup,
    openCompanyPopup,
    openJobPopup,
    closePopup,
    selectedLeads,
    toggleLeadSelection,
    clearSelection,
  }), [activePopup, popupData, selectedLeads, openLeadPopup, openCompanyPopup, openJobPopup, closePopup, toggleLeadSelection, clearSelection]);

  return (
    <PopupContext.Provider value={contextValue}>
      {children}
    </PopupContext.Provider>
  );
};
