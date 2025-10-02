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
import { useAuth } from "@/contexts/AuthContext";

interface UseEntityDataProps {
  entityType: EntityType;
  entityId: string;
  isOpen: boolean;
  refreshTrigger?: number;
}

export function useEntityData({ entityType, entityId, isOpen, refreshTrigger }: UseEntityDataProps) {
  console.log('🔍 useEntityData called:', { entityType, entityId, isOpen, refreshTrigger });
  
  const { user, isLoading: authLoading } = useAuth();
  
  // Optimized selections for popup performance
  const OPTIMIZED_SELECTIONS = {
    people: 'id, name, company_id, email_address, linkedin_url, employee_location, company_role, lead_score, stage, connected_at, last_reply_at, last_interaction_at, owner_id, created_at, confidence_level, is_favourite, lead_source',
    companies: 'id, name, website, linkedin_url, head_office, industry, company_size, confidence_level, lead_score, score_reason, automation_active, is_favourite, created_at, priority, logo_url, owner_id, pipeline_stage',
    jobs: 'id, title, company_id, location, description, employment_type, seniority_level, automation_active, created_at, priority, lead_score_job, salary, function, logo_url, owner_id'
  };
  
  // Fetch entity data based on type
  const entityQuery = useQuery({
    queryKey: [`${entityType}-detail`, entityId, refreshTrigger, user?.id],
    queryFn: async () => {
      console.log('🔍 useEntityData queryFn called for:', { entityType, entityId, userId: user?.id });
      
      // Check if user is authenticated first
      if (!user?.id) {
        console.error('❌ User not authenticated, cannot fetch data');
        throw new Error('User not authenticated');
      }
      
      const tableName = entityType === 'lead' ? 'people' : entityType === 'company' ? 'companies' : 'jobs';
      
      // Reduced timeout to 5 seconds for better UX
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Query timeout after 5 seconds')), 5000);
      });
      
      console.log('🔍 Executing authenticated query for:', { tableName, entityId, userId: user.id });
      
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
    enabled: !!entityId && isOpen && !authLoading && !!user?.id,
    retry: 1, // Reduced retries
    retryDelay: 1000, // Fixed retry delay
    staleTime: 2 * 60 * 1000, // Reduced to 2 minutes
    gcTime: 5 * 60 * 1000 // Reduced to 5 minutes
  });

  // Fetch company data (for leads and jobs) - optimized with timeout
  const companyQuery = useQuery({
    queryKey: [`${entityType}-company`, entityQuery.data?.company_id, refreshTrigger, user?.id],
    queryFn: async () => {
      if (!entityQuery.data?.company_id) {
        return null;
      }
      
      // Check if user is authenticated
      if (!user?.id) {
        console.error('❌ User not authenticated, cannot fetch company data');
        throw new Error('User not authenticated');
      }
      
      // Add timeout for company query
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Company query timeout after 5 seconds')), 5000);
      });
      
      const queryPromise = supabase
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

      try {
        const result = await Promise.race([queryPromise, timeoutPromise]);
        const { data, error } = result as any;

        if (error) {
          console.error("❌ Error fetching company:", error);
          throw error;
        }
        return data;
      } catch (error) {
        console.error("❌ Company query failed:", error);
        throw error;
      }
    },
    enabled: !!entityQuery.data?.company_id && isOpen && !authLoading && !!user?.id,
    retry: 1,
    retryDelay: 1000,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000
  });

  // Fetch related leads (for companies and jobs) - optimized with timeout
  const leadsQuery = useQuery({
    queryKey: [`${entityType}-leads`, entityQuery.data?.company_id || entityId, entityId, refreshTrigger, user?.id],
    queryFn: async () => {
      // For companies, use entityId directly. For leads/jobs, use company_id from the entity
      const companyId = entityType === 'company' ? entityId : entityQuery.data?.company_id;
      
      if (!companyId) {
        return [];
      }

      // Check if user is authenticated
      if (!user?.id) {
        console.error('❌ User not authenticated, cannot fetch leads data');
        throw new Error('User not authenticated');
      }

      // Add timeout for leads query
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Leads query timeout after 5 seconds')), 5000);
      });

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

      const queryPromise = query.order("created_at", { ascending: false });

      try {
        const result = await Promise.race([queryPromise, timeoutPromise]);
        const { data, error } = result as any;

        if (error) {
          console.error("❌ Error fetching leads:", error);
          throw error;
        }
        return data || [];
      } catch (error) {
        console.error("❌ Leads query failed:", error);
        throw error;
      }
    },
    enabled: (!!entityQuery.data?.company_id || entityType === 'company') && isOpen && !authLoading && !!user?.id,
    retry: 1,
    retryDelay: 1000,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000
  });

  // Fetch related jobs (for companies and leads) - optimized with timeout
  const jobsQuery = useQuery({
    queryKey: [`${entityType}-jobs`, entityQuery.data?.company_id || entityId, refreshTrigger, user?.id],
    queryFn: async () => {
      // For companies, use entityId directly. For leads/jobs, use company_id from the entity
      const companyId = entityType === 'company' ? entityId : entityQuery.data?.company_id;
      
      if (!companyId) {
        return [];
      }

      // Check if user is authenticated
      if (!user?.id) {
        console.error('❌ User not authenticated, cannot fetch jobs data');
        throw new Error('User not authenticated');
      }

      // Add timeout for jobs query
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Jobs query timeout after 5 seconds')), 5000);
      });

      const queryPromise = supabase
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

      try {
        const result = await Promise.race([queryPromise, timeoutPromise]);
        const { data, error } = result as any;

        if (error) {
          console.error("❌ Error fetching jobs:", error);
          throw error;
        }
        return data || [];
      } catch (error) {
        console.error("❌ Jobs query failed:", error);
        throw error;
      }
    },
    enabled: (!!entityQuery.data?.company_id || entityType === 'company') && isOpen && !authLoading && !!user?.id,
    retry: 1,
    retryDelay: 1000,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000
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
    
    isLoading: authLoading || entityQuery.isLoading || companyQuery.isLoading || leadsQuery.isLoading || jobsQuery.isLoading,
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
