/**
 * Optimized Entity Data Hook
 * 
 * Consolidates N+1 query pattern into single optimized queries with joins
 * Reduces database round trips from 4 to 1-2 queries maximum
 * 
 * 📚 Database schema reference: src/types/databaseSchema.ts
 * 📖 Best practices: docs/DATABASE_BEST_PRACTICES.md
 */

import type { EntityType } from "@/components/crm/EntityDetailPopup";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface UseEntityDataProps {
  entityType: EntityType;
  entityId: string;
  isOpen: boolean;
  refreshTrigger?: number;
}

export function useEntityDataOptimized({ entityType, entityId, isOpen, refreshTrigger }: UseEntityDataProps) {
  console.log('🔍 useEntityDataOptimized called:', { entityType, entityId, isOpen, refreshTrigger });
  
  const { user, isLoading: authLoading } = useAuth();
  
  // Single optimized query with joins for all entity types
  const entityQuery = useQuery({
    queryKey: [`${entityType}-optimized`, entityId, refreshTrigger, user?.id],
    queryFn: async () => {
      console.log('🔍 useEntityDataOptimized queryFn called for:', { entityType, entityId, userId: user?.id });
      
      // Check if user is authenticated first
      if (!user?.id) {
        console.error('❌ User not authenticated, cannot fetch data');
        throw new Error('User not authenticated');
      }
      
      // Check Supabase session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      console.log('🔍 Supabase session check:', { 
        hasSession: !!sessionData.session, 
        userId: sessionData.session?.user?.id,
        expiresAt: sessionData.session?.expires_at,
        sessionError
      });
      
      if (sessionError) {
        console.error('❌ Session error:', sessionError);
        throw new Error(`Session error: ${sessionError.message}`);
      }
      
      if (!sessionData.session) {
        console.error('❌ No active session found');
        throw new Error('No active Supabase session');
      }

      let query;
      
      if (entityType === 'lead') {
        // For leads: get person + company + related people + related jobs in one query
        query = supabase
          .from('people')
          .select(`
            id,
            name,
            company_id,
            email_address,
            linkedin_url,
            employee_location,
            company_role,
            lead_score,
            stage,
            connected_at,
            last_reply_at,
            last_interaction_at,
            owner_id,
            created_at,
            confidence_level,
            is_favourite,
            lead_source,
            companies!inner(
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
            )
          `)
          .eq('id', entityId)
          .single();
      } else if (entityType === 'company') {
        // For companies: get company + related people + related jobs in one query
        query = supabase
          .from('companies')
          .select(`
            id,
            name,
            website,
            linkedin_url,
            head_office,
            industry,
            company_size,
            confidence_level,
            lead_score,
            score_reason,
            automation_active,
            is_favourite,
            created_at,
            priority,
            logo_url,
            owner_id,
            pipeline_stage,
            people!people_company_id_fkey(
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
            ),
            jobs!jobs_company_id_fkey(
              id,
              title,
              location,
              function,
              employment_type,
              seniority_level,
              salary,
              created_at
            )
          `)
          .eq('id', entityId)
          .single();
      } else if (entityType === 'job') {
        // For jobs: get job + company + related people + related jobs in one query
        query = supabase
          .from('jobs')
          .select(`
            id,
            title,
            company_id,
            location,
            description,
            employment_type,
            seniority_level,
            automation_active,
            created_at,
            priority,
            lead_score_job,
            salary,
            function,
            logo_url,
            owner_id,
            companies!inner(
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
            )
          `)
          .eq('id', entityId)
          .single();
      } else {
        throw new Error(`Unsupported entity type: ${entityType}`);
      }

      try {
        const { data, error } = await query;

        if (error) {
          console.error(`❌ Error fetching ${entityType}:`, error);
          
          // If it's an RLS policy error, try to provide more context
          if (error.message?.includes('permission denied') || error.message?.includes('RLS')) {
            console.error('🔒 RLS Policy Error - User may not have proper permissions');
            console.error('🔍 User ID:', user?.id, 'User Role:', user?.role);
          }
          
          throw error;
        }
        
        console.log('🔍 useEntityDataOptimized queryFn success:', { entityType, data });
        return data;
      } catch (error) {
        console.error(`❌ Query failed for ${entityType}:`, error);
        throw error;
      }
    },
    enabled: !!entityId && isOpen && !authLoading && !!user?.id,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000 // 15 minutes
  });

  // Additional query for related jobs (for leads) - only if needed
  const relatedJobsQuery = useQuery({
    queryKey: [`${entityType}-related-jobs`, entityQuery.data?.company_id, refreshTrigger, user?.id],
    queryFn: async () => {
      const companyId = entityQuery.data?.company_id;
      
      if (!companyId) {
        return [];
      }

      if (!user?.id) {
        throw new Error('User not authenticated');
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
        console.error("❌ Error fetching related jobs:", error);
        throw error;
      }
      return data || [];
    },
    enabled: !!entityQuery.data?.company_id && entityType === 'lead' && isOpen && !authLoading && !!user?.id,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000
  });

  // Additional query for related people (for jobs) - only if needed
  const relatedPeopleQuery = useQuery({
    queryKey: [`${entityType}-related-people`, entityQuery.data?.company_id, refreshTrigger, user?.id],
    queryFn: async () => {
      const companyId = entityQuery.data?.company_id;
      
      if (!companyId) {
        return [];
      }

      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
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
        .eq("company_id", companyId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("❌ Error fetching related people:", error);
        throw error;
      }
      return data || [];
    },
    enabled: !!entityQuery.data?.company_id && entityType === 'job' && isOpen && !authLoading && !!user?.id,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000
  });

  // Process the data based on entity type
  const processedData = (() => {
    if (!entityQuery.data) return null;

    const data = entityQuery.data;
    
    if (entityType === 'lead') {
      return {
        entityData: {
          id: data.id,
          name: data.name,
          company_id: data.company_id,
          email_address: data.email_address,
          linkedin_url: data.linkedin_url,
          employee_location: data.employee_location,
          company_role: data.company_role,
          lead_score: data.lead_score,
          stage: data.stage,
          connected_at: data.connected_at,
          last_reply_at: data.last_reply_at,
          last_interaction_at: data.last_interaction_at,
          owner_id: data.owner_id,
          created_at: data.created_at,
          confidence_level: data.confidence_level,
          is_favourite: data.is_favourite,
          lead_source: data.lead_source
        },
        companyData: data.companies,
        leadsData: [], // Will be populated by relatedPeopleQuery if needed
        jobsData: relatedJobsQuery.data || []
      };
    } else if (entityType === 'company') {
      return {
        entityData: {
          id: data.id,
          name: data.name,
          website: data.website,
          linkedin_url: data.linkedin_url,
          head_office: data.head_office,
          industry: data.industry,
          company_size: data.company_size,
          confidence_level: data.confidence_level,
          lead_score: data.lead_score,
          score_reason: data.score_reason,
          automation_active: data.automation_active,
          is_favourite: data.is_favourite,
          created_at: data.created_at,
          priority: data.priority,
          logo_url: data.logo_url,
          owner_id: data.owner_id,
          pipeline_stage: data.pipeline_stage
        },
        companyData: data,
        leadsData: data.people || [],
        jobsData: data.jobs || []
      };
    } else if (entityType === 'job') {
      return {
        entityData: {
          id: data.id,
          title: data.title,
          company_id: data.company_id,
          location: data.location,
          description: data.description,
          employment_type: data.employment_type,
          seniority_level: data.seniority_level,
          automation_active: data.automation_active,
          created_at: data.created_at,
          priority: data.priority,
          lead_score_job: data.lead_score_job,
          salary: data.salary,
          function: data.function,
          logo_url: data.logo_url,
          owner_id: data.owner_id
        },
        companyData: data.companies,
        leadsData: relatedPeopleQuery.data || [],
        jobsData: [] // Will be populated by relatedJobsQuery if needed
      };
    }
    
    return null;
  })();

  const hasError = !!(entityQuery.error || relatedJobsQuery.error || relatedPeopleQuery.error);
  
  if (hasError) {
    console.error('🔍 useEntityDataOptimized errors:', {
      entityError: entityQuery.error,
      relatedJobsError: relatedJobsQuery.error,
      relatedPeopleError: relatedPeopleQuery.error
    });
  }

  const result = {
    entityData: processedData?.entityData || null,
    entityLoading: entityQuery.isLoading,
    entityError: entityQuery.error,
    
    companyData: processedData?.companyData || null,
    companyLoading: entityQuery.isLoading,
    companyError: entityQuery.error,
    
    leadsData: processedData?.leadsData || [],
    leadsLoading: entityQuery.isLoading || relatedPeopleQuery.isLoading,
    leadsError: entityQuery.error || relatedPeopleQuery.error,
    
    jobsData: processedData?.jobsData || [],
    jobsLoading: entityQuery.isLoading || relatedJobsQuery.isLoading,
    jobsError: entityQuery.error || relatedJobsQuery.error,
    
    isLoading: authLoading || entityQuery.isLoading || relatedJobsQuery.isLoading || relatedPeopleQuery.isLoading,
    hasError
  };

  console.log('🔍 useEntityDataOptimized returning:', {
    entityData: result.entityData,
    isLoading: result.isLoading,
    hasError: result.hasError,
    entityQueryStatus: entityQuery.status,
    entityQueryData: entityQuery.data
  });

  return result;
}
