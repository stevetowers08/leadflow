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
  total_jobs: number;
  qualified_leads: number;
  active_companies: number;
  active_jobs: number;
}

export interface LeadWithAssignment {
  id: string;
  name: string;
  email_address: string;
  company_role: string;
  stage: string;
  lead_score: string;
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
  total_jobs: number;
}

export class UserAssignmentQueries {
  /**
   * Get all user assignment statistics efficiently
   * Uses materialized view for optimal performance
   */
  static async getUserAssignmentStats(): Promise<UserAssignment[]> {
    const { data, error } = await supabase
      .from('user_assignment_stats')
      .select('*')
      .order('total_leads', { ascending: false });

    if (error) throw error;
    return data || [];
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
    let query = supabase.from('lead_assignments_with_users').select('*');

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
    let query = supabase.from('company_assignments_with_users').select('*');

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
    const { data, error } = await supabase
      .from('lead_assignments_with_users')
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
    const { data, error } = await supabase
      .from('company_assignments_with_users')
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
    entityType: 'people' | 'companies' | 'jobs',
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
    entityType: 'people' | 'companies' | 'jobs',
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
        jobs: number;
        qualified_leads: number;
        active_companies: number;
        active_jobs: number;
      }
    >
  > {
    const stats = await this.getUserAssignmentStats();

    return stats.reduce(
      (acc, stat) => {
        acc[stat.id] = {
          leads: stat.total_leads,
          companies: stat.total_companies,
          jobs: stat.total_jobs,
          qualified_leads: stat.qualified_leads,
          active_companies: stat.active_companies,
          active_jobs: stat.active_jobs,
        };
        return acc;
      },
      {} as Record<string, unknown>
    );
  }

  /**
   * Refresh materialized view for user assignment stats
   * Should be called periodically or after bulk operations
   */
  static async refreshAssignmentStats(): Promise<void> {
    const { error } = await supabase.rpc('refresh_user_assignment_stats');
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
    cacheTime: 10 * 60 * 1000, // 10 minutes
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
    cacheTime: 5 * 60 * 1000, // 5 minutes
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
    cacheTime: 5 * 60 * 1000, // 5 minutes
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
      entityType: 'people' | 'companies' | 'jobs';
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
      entityType: 'people' | 'companies' | 'jobs';
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
