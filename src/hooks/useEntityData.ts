import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { EntityType } from "@/components/crm/EntityDetailPopup";

interface UseEntityDataProps {
  entityType: EntityType;
  entityId: string;
  isOpen: boolean;
  refreshTrigger?: number;
}

export function useEntityData({ entityType, entityId, isOpen, refreshTrigger }: UseEntityDataProps) {
  // Fetch entity data based on type
  const entityQuery = useQuery({
    queryKey: [`${entityType}-detail`, entityId, refreshTrigger],
    queryFn: async () => {
      const tableName = entityType === 'lead' ? 'people' : entityType === 'company' ? 'companies' : 'jobs';
      
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('id', entityId)
        .single();

      if (error) {
        console.error(`❌ Error fetching ${entityType}:`, error);
        throw error;
      }
      return data;
    },
    enabled: !!entityId && isOpen
  });

  // Fetch company data (for leads and jobs) - now runs in parallel
  const companyQuery = useQuery({
    queryKey: [`${entityType}-company`, entityQuery.data?.company_id, refreshTrigger],
    queryFn: async () => {
      if (!entityQuery.data?.company_id) {
        return null;
      }
      
      const { data, error } = await supabase
        .from("companies")
        .select(`
          id,
          name,
          industry,
          head_office,
          company_size,
          website,
          lead_score,
          automation_active,
          confidence_level,
          linkedin_url,
          score_reason,
          created_at,
          lead_source,
          logo_url,
          pipeline_stage,
          owner_id
        `)
        .eq("id", entityQuery.data.company_id)
        .single();

      if (error) {
        console.error("❌ Error fetching company:", error);
        throw error;
      }
      return data;
    },
    enabled: !!entityQuery.data?.company_id && isOpen
  });

  // Fetch related leads (for companies and jobs) - optimized for parallel execution
  const leadsQuery = useQuery({
    queryKey: [`${entityType}-leads`, entityQuery.data?.company_id || entityId, refreshTrigger],
    queryFn: async () => {
      // For companies, use entityId directly. For leads/jobs, use company_id from the entity
      const companyId = entityType === 'company' ? entityId : entityQuery.data?.company_id;
      
      if (!companyId) {
        return [];
      }

      const { data, error } = await supabase
        .from("people")
        .select(`
          id,
          name,
          email_address,
          company_role,
          employee_location,
          stage,
          automation_started_at,
          created_at,
          linkedin_url,
          owner_id
        `)
        .eq("company_id", companyId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("❌ Error fetching leads:", error);
        throw error;
      }
      console.log("✅ Fetched leads:", data);
      return data || [];
    },
    enabled: (!!entityQuery.data?.company_id || entityType === 'company') && isOpen
  });

  // Fetch related jobs (for companies and leads) - optimized for parallel execution
  const jobsQuery = useQuery({
    queryKey: [`${entityType}-jobs`, entityQuery.data?.company_id || entityId, refreshTrigger],
    queryFn: async () => {
      // For companies, use entityId directly. For leads/jobs, use company_id from the entity
      const companyId = entityType === 'company' ? entityId : entityQuery.data?.company_id;
      
      if (!companyId) {
        return [];
      }

      const { data, error } = await supabase
        .from("jobs")
        .select(`
          id,
          title,
          location,
          function,
          employment_type,
          seniority_level,
          salary,
          created_at
        `)
        .eq("company_id", companyId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("❌ Error fetching jobs:", error);
        throw error;
      }
      console.log("✅ Fetched jobs:", data);
      return data || [];
    },
    enabled: (!!entityQuery.data?.company_id || entityType === 'company') && isOpen
  });


  return {
    entityData: entityQuery.data,
    entityLoading: entityQuery.isLoading,
    entityError: entityQuery.error,
    
    companyData: companyQuery.data,
    companyLoading: companyQuery.isLoading,
    companyError: companyQuery.error,
    
    leadsData: leadsQuery.data,
    leadsLoading: leadsQuery.isLoading,
    leadsError: leadsQuery.error,
    
    jobsData: jobsQuery.data,
    jobsLoading: jobsQuery.isLoading,
    jobsError: jobsQuery.error,
    
    isLoading: entityQuery.isLoading || companyQuery.isLoading || leadsQuery.isLoading || jobsQuery.isLoading,
    hasError: !!(entityQuery.error || companyQuery.error || leadsQuery.error || jobsQuery.error)
  };
}
