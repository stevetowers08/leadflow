/**
 * Optimized database query utilities for user assignments
 * Provides efficient query patterns to avoid N+1 problems and improve performance
 */

import { supabase } from '../integrations/supabase/client';

export interface UserAssignment {
  id: string;
  name: string;
  email: string;
  role: string;
  total_leads: number;
  total_companies: number;
  qualified_leads: number;
  active_companies: number;
  // Note: jobs fields removed - recruitment features have been removed
  // Note: jobs fields removed - recruitment features have been removed
}

export interface LeadWithAssignment {
  id: string;
  name: string;
  email_address: string;
  company_role: string;
  stage: string;
  score: number | null;
  owner_id: string | null;
  created_at: string;
  company_name: string | null;
  company_website: string | null;
  owner_name: string | null;
  owner_email: string | null;
  owner_role: string | null;
}

export interface CompanyWithAssignment {
  id: string;
  name: string;
  website: string | null;
  industry: string | null;
  status: string | null;
  lead_score: string | null;
  owner_id: string | null;
  created_at: string;
  owner_name: string | null;
  owner_email: string | null;
  owner_role: string | null;
  total_leads: number;
  // Note: total_jobs removed - recruitment features have been removed
}

export class UserAssignmentQueries {
  /**
   * Get all user assignment statistics efficiently
   * Uses materialized view for optimal performance
   */
  static async getUserAssignmentStats(): Promise<UserAssignment[]> {
    // Note: user_assignment_stats is a database view, not in TypeScript types
    const { data, error } = await supabase
      .from('user_assignment_stats' as never)
      .select('*')
      .order('total_leads', { ascending: false });

    if (error) throw error;
    return (data || []) as UserAssignment[];
  }

  /**
   * Get leads with assignment information in a single query
   * Avoids N+1 queries by joining user profiles
   */
  static async getLeadsWithAssignments(
    filters: {
      ownerId?: string;
      stage?: string;
      search?: string;
      limit?: number;
      offset?: number;
    } = {}
  ): Promise<LeadWithAssignment[]> {
    // Note: lead_assignments_with_users is a database view, not in TypeScript types
    let query = supabase
      .from('lead_assignments_with_users' as never)
      .select('*');

    if (filters.ownerId) {
      query = query.eq('owner_id', filters.ownerId);
    }

    if (filters.stage) {
      query = query.eq('people_stage', filters.stage);
    }

    if (filters.search) {
      query = query.or(
        `name.ilike.%${filters.search}%,company_role.ilike.%${filters.search}%,email_address.ilike.%${filters.search}%`
      );
    }

    query = query.order('created_at', { ascending: false });

    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    if (filters.offset) {
      query = query.range(
        filters.offset,
        filters.offset + (filters.limit || 50) - 1
      );
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }

  /**
   * Get companies with assignment information in a single query
   * Avoids N+1 queries by joining user profiles
   */
  static async getCompaniesWithAssignments(
    filters: {
      ownerId?: string;
      status?: string;
      search?: string;
      limit?: number;
      offset?: number;
    } = {}
  ): Promise<CompanyWithAssignment[]> {
    // Note: company_assignments_with_users is a database view, not in TypeScript types
    let query = supabase
      .from('company_assignments_with_users' as never)
      .select('*');

    if (filters.ownerId) {
      query = query.eq('owner_id', filters.ownerId);
    }

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    if (filters.search) {
      query = query.or(
        `name.ilike.%${filters.search}%,industry.ilike.%${filters.search}%`
      );
    }

    query = query.order('created_at', { ascending: false });

    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    if (filters.offset) {
      query = query.range(
        filters.offset,
        filters.offset + (filters.limit || 50) - 1
      );
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }

  /**
   * Get unassigned leads efficiently
   * Uses partial index for optimal performance
   */
  static async getUnassignedLeads(
    limit: number = 50
  ): Promise<LeadWithAssignment[]> {
    // Note: lead_assignments_with_users is a database view, not in TypeScript types
    const { data, error } = await supabase
      .from('lead_assignments_with_users' as never)
      .select('*')
      .is('owner_id', null)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  /**
   * Get unassigned companies efficiently
   * Uses partial index for optimal performance
   */
  static async getUnassignedCompanies(
    limit: number = 50
  ): Promise<CompanyWithAssignment[]> {
    // Note: company_assignments_with_users is a database view, not in TypeScript types
    const { data, error } = await supabase
      .from('company_assignments_with_users' as never)
      .select('*')
      .is('owner_id', null)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  /**
   * Batch assign multiple entities to a user
   * More efficient than individual updates
   */
  static async batchAssignEntities(
    entityType: 'people' | 'companies' | 'leads',
    entityIds: string[],
    ownerId: string
  ): Promise<void> {
    const { error } = await supabase
      .from(entityType)
      .update({ owner_id: ownerId })
      .in('id', entityIds);

    if (error) throw error;
  }

  /**
   * Batch unassign multiple entities
   * More efficient than individual updates
   */
  static async batchUnassignEntities(
    entityType: 'people' | 'companies' | 'leads',
    entityIds: string[]
  ): Promise<void> {
    const { error } = await supabase
      .from(entityType)
      .update({ owner_id: null })
      .in('id', entityIds);

    if (error) throw error;
  }

  /**
   * Get assignment counts by user efficiently
   * Uses materialized view for optimal performance
   */
  static async getAssignmentCountsByUser(): Promise<
    Record<
      string,
      {
        leads: number;
        companies: number;
        qualified_leads: number;
        active_companies: number;
      }
    >
  > {
    const stats = await this.getUserAssignmentStats();

    return stats.reduce(
      (acc, stat) => {
        acc[stat.id] = {
          leads: stat.total_leads,
          companies: stat.total_companies,
          qualified_leads: stat.qualified_leads,
          active_companies: stat.active_companies,
          // Note: jobs fields removed - recruitment features have been removed
          // Note: jobs fields removed - recruitment features have been removed
        };
        return acc;
      },
      {} as Record<
        string,
        {
          leads: number;
          companies: number;
          qualified_leads: number;
          active_companies: number;
          // Note: jobs fields removed - recruitment features have been removed
        }
      >
    );
  }

  /**
   * Refresh materialized view for user assignment stats
   * Should be called periodically or after bulk operations
   */
  static async refreshAssignmentStats(): Promise<void> {
    // Note: refresh_user_assignment_stats RPC may not exist in all projects
    const { error } = await supabase.rpc(
      'refresh_user_assignment_stats' as never
    );
    if (error) throw error;
  }
}

/**
 * Optimized hooks for user assignment queries
 * Provides React Query integration with proper caching
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useUserAssignmentStats = () => {
  return useQuery({
    queryKey: ['user-assignment-stats'],
    queryFn: () => UserAssignmentQueries.getUserAssignmentStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
};

export const useLeadsWithAssignments = (
  filters: Parameters<
    typeof UserAssignmentQueries.getLeadsWithAssignments
  >[0] = {}
) => {
  return useQuery({
    queryKey: ['leads-with-assignments', filters],
    queryFn: () => UserAssignmentQueries.getLeadsWithAssignments(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
  });
};

export const useCompaniesWithAssignments = (
  filters: Parameters<
    typeof UserAssignmentQueries.getCompaniesWithAssignments
  >[0] = {}
) => {
  return useQuery({
    queryKey: ['companies-with-assignments', filters],
    queryFn: () => UserAssignmentQueries.getCompaniesWithAssignments(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
  });
};

export const useBatchAssignEntities = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      entityType,
      entityIds,
      ownerId,
    }: {
      entityType: 'people' | 'companies';
      entityIds: string[];
      ownerId: string;
    }) =>
      UserAssignmentQueries.batchAssignEntities(entityType, entityIds, ownerId),
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['user-assignment-stats'] });
      queryClient.invalidateQueries({ queryKey: ['leads-with-assignments'] });
      queryClient.invalidateQueries({
        queryKey: ['companies-with-assignments'],
      });
      queryClient.invalidateQueries({ queryKey: ['unassigned-leads'] });
      queryClient.invalidateQueries({ queryKey: ['unassigned-companies'] });
    },
  });
};

export const useBatchUnassignEntities = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      entityType,
      entityIds,
    }: {
      entityType: 'people' | 'companies';
      entityIds: string[];
    }) => UserAssignmentQueries.batchUnassignEntities(entityType, entityIds),
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['user-assignment-stats'] });
      queryClient.invalidateQueries({ queryKey: ['leads-with-assignments'] });
      queryClient.invalidateQueries({
        queryKey: ['companies-with-assignments'],
      });
      queryClient.invalidateQueries({ queryKey: ['unassigned-leads'] });
      queryClient.invalidateQueries({ queryKey: ['unassigned-companies'] });
    },
  });
};
