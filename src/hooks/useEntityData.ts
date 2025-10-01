/**
 * Entity Data Hook
 * 
 * 📚 Database schema reference: src/types/databaseSchema.ts
 * 📖 Best practices: docs/DATABASE_BEST_PRACTICES.md
 * 🔧 Query utilities: src/utils/databaseQueries.ts
 */

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { EntityType } from "@/components/crm/EntityDetailPopup";
import { COMMON_SELECTIONS } from "@/types/databaseSchema";

interface UseEntityDataProps {
  entityType: EntityType;
  entityId: string;
  isOpen: boolean;
  refreshTrigger?: number;
}

export function useEntityData({ entityType, entityId, isOpen, refreshTrigger }: UseEntityDataProps) {
  console.log('🔍 useEntityData called:', { entityType, entityId, isOpen, refreshTrigger });
  
  // Optimized selections for popup performance
  const OPTIMIZED_SELECTIONS = {
    people: 'id, name, company_id, email_address, linkedin_url, employee_location, company_role, lead_score, stage, connected_at, last_reply_at, last_interaction_at, owner_id, created_at, confidence_level, is_favourite, lead_source',
    companies: 'id, name, website, linkedin_url, head_office, industry, company_size, confidence_level, lead_score, score_reason, automation_active, is_favourite, created_at, priority, logo_url, owner_id, pipeline_stage',
    jobs: 'id, title, company_id, location, description, employment_type, seniority_level, automation_active, created_at, priority, lead_score_job, salary, function, logo_url, owner_id'
  };
  
  // Fetch entity data based on type
  const entityQuery = useQuery({
    queryKey: [`${entityType}-detail`, entityId, refreshTrigger],
    queryFn: async () => {
      console.log('🔍 useEntityData queryFn called for:', { entityType, entityId });
      const tableName = entityType === 'lead' ? 'people' : entityType === 'company' ? 'companies' : 'jobs';
      
      // Add timeout to prevent hanging queries
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Query timeout after 10 seconds')), 10000);
      });
      
      // Test direct query without authentication checks first
      console.log('🔍 Testing direct query without auth checks...');
      
      const queryPromise = supabase
        .from(tableName)
        .select(OPTIMIZED_SELECTIONS[tableName])
        .eq('id', entityId)
        .single();

      try {
        const result = await Promise.race([queryPromise, timeoutPromise]);
        const { data, error } = result as any;

        if (error) {
          console.error(`❌ Error fetching ${entityType}:`, error);
          
          // If it's an RLS policy error, try to provide more context
          if (error.message?.includes('permission denied') || error.message?.includes('RLS')) {
            console.error('🔒 RLS Policy Error - User may not have proper permissions');
            console.error('🔍 User ID:', user?.id, 'User Role:', user?.role);
          }
          
          throw error;
        }
        console.log('🔍 useEntityData queryFn success:', { entityType, data });
        return data;
      } catch (error) {
        console.error(`❌ Query failed for ${entityType}:`, error);
        throw error;
      }
    },
    enabled: !!entityId && isOpen,
    retry: 1, // Only retry once
    retryDelay: 1000 // Wait 1 second before retry
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
    queryKey: [`${entityType}-leads`, entityQuery.data?.company_id || entityId, entityId, refreshTrigger],
    queryFn: async () => {
      // For companies, use entityId directly. For leads/jobs, use company_id from the entity
      const companyId = entityType === 'company' ? entityId : entityQuery.data?.company_id;
      
      if (!companyId) {
        return [];
      }

      let query = supabase
        .from("people")
        .select(`
          id,
          name,
          company_id,
          email_address,
          employee_location,
          company_role,
          stage,
          lead_score,
          linkedin_url,
          linkedin_request_message,
          linkedin_connected_message,
          linkedin_follow_up_message,
          automation_started_at,
          owner_id,
          last_interaction_at,
          created_at,
          updated_at
        `)
        .eq("company_id", companyId);

      // For lead popups, exclude the current lead from the employees list
      if (entityType === 'lead') {
        query = query.neq("id", entityId);
      }

      const { data, error } = await query.order("created_at", { ascending: false });

      if (error) {
        console.error("❌ Error fetching leads:", error);
        throw error;
      }
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
      return data || [];
    },
    enabled: (!!entityQuery.data?.company_id || entityType === 'company') && isOpen
  });


  const hasError = !!(entityQuery.error || companyQuery.error || leadsQuery.error || jobsQuery.error);
  
  if (hasError) {
    console.error('🔍 useEntityData errors:', {
      entityError: entityQuery.error,
      companyError: companyQuery.error,
      leadsError: leadsQuery.error,
      jobsError: jobsQuery.error
    });
  }

  const result = {
    entityData: entityQuery.data,
    entityLoading: entityQuery.isLoading,
    entityError: entityQuery.error,
    
    companyData: companyQuery.data,
    companyLoading: companyQuery.isLoading,
    companyError: companyQuery.error,
    
    leadsData: leadsQuery.data || [],
    leadsLoading: leadsQuery.isLoading,
    leadsError: leadsQuery.error,
    
    jobsData: jobsQuery.data || [],
    jobsLoading: jobsQuery.isLoading,
    jobsError: jobsQuery.error,
    
    isLoading: entityQuery.isLoading || companyQuery.isLoading || leadsQuery.isLoading || jobsQuery.isLoading,
    hasError
  };

  console.log('🔍 useEntityData returning:', {
    entityData: result.entityData,
    isLoading: result.isLoading,
    hasError: result.hasError,
    entityQueryStatus: entityQuery.status,
    entityQueryData: entityQuery.data
  });

  return result;
}
