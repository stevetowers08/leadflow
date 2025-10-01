/**
 * Optimized query patterns for existing components
 * Replaces inefficient queries with optimized versions
 */

import { supabase } from '../integrations/supabase/client';

export class OptimizedQueries {
  /**
   * BEFORE: Individual user profile fetches causing N+1 queries
   * AFTER: Batch fetch all users and create lookup cache
   */
  static async getUsersWithCache(): Promise<Record<string, { id: string; full_name: string; email: string; role: string }>> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id, full_name, email, role')
      .eq('is_active', true)
      .order('full_name');

    if (error) throw error;

    const cache: Record<string, { id: string; full_name: string; email: string; role: string }> = {};
    data?.forEach(user => {
      cache[user.id] = user;
    });

    return cache;
  }

  /**
   * BEFORE: Multiple separate queries for dashboard stats
   * AFTER: Single optimized query with joins
   */
  static async getDashboardStatsOptimized() {
    const [
      // Use optimized views instead of separate queries
      leadsWithAssignments,
      companiesWithAssignments,
      userStats,
      unassignedCounts
    ] = await Promise.all([
      // Get recent leads with assignment info in one query
      supabase
        .from('lead_assignments_with_users')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5),

      // Get recent companies with assignment info in one query
      supabase
        .from('company_assignments_with_users')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5),

      // Get user assignment statistics
      supabase
        .from('user_assignment_stats')
        .select('*'),

      // Get unassigned counts efficiently
      Promise.all([
        supabase
          .from('people')
          .select('*', { count: 'exact', head: true })
          .is('owner_id', null),
        supabase
          .from('companies')
          .select('*', { count: 'exact', head: true })
          .is('owner_id', null),
        supabase
          .from('jobs')
          .select('*', { count: 'exact', head: true })
          .is('owner_id', null)
      ])
    ]);

    return {
      recentLeads: leadsWithAssignments.data || [],
      recentCompanies: companiesWithAssignments.data || [],
      userStats: userStats.data || [],
      unassignedCounts: {
        leads: unassignedCounts[0].count || 0,
        companies: unassignedCounts[1].count || 0,
        jobs: unassignedCounts[2].count || 0
      }
    };
  }

  /**
   * BEFORE: Fetching leads with separate company queries
   * AFTER: Single query with proper joins
   */
  static async getLeadsOptimized(filters: {
    search?: string;
    status?: string;
    ownerId?: string;
    limit?: number;
    offset?: number;
  } = {}) {
    let query = supabase
      .from('lead_assignments_with_users')
      .select('*', { count: 'exact' });

    // Apply filters efficiently
    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,company_role.ilike.%${filters.search}%,email_address.ilike.%${filters.search}%`);
    }

    if (filters.status && filters.status !== 'all') {
      query = query.eq('stage', filters.status);
    }

    if (filters.ownerId && filters.ownerId !== 'all') {
      query = query.eq('owner_id', filters.ownerId);
    }

    query = query.order('created_at', { ascending: false });

    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    if (filters.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 50) - 1);
    }

    return await query;
  }

  /**
   * BEFORE: Fetching companies with separate lead/job count queries
   * AFTER: Single query with aggregated counts
   */
  static async getCompaniesOptimized(filters: {
    search?: string;
    status?: string;
    ownerId?: string;
    limit?: number;
    offset?: number;
  } = {}) {
    let query = supabase
      .from('company_assignments_with_users')
      .select('*', { count: 'exact' });

    // Apply filters efficiently
    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,industry.ilike.%${filters.search}%`);
    }

    if (filters.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }

    if (filters.ownerId && filters.ownerId !== 'all') {
      query = query.eq('owner_id', filters.ownerId);
    }

    query = query.order('created_at', { ascending: false });

    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    if (filters.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 50) - 1);
    }

    return await query;
  }

  /**
   * BEFORE: Individual assignment updates
   * AFTER: Batch assignment updates
   */
  static async batchUpdateAssignments(
    assignments: Array<{
      entityType: 'people' | 'companies' | 'jobs';
      entityId: string;
      ownerId: string | null;
    }>
  ) {
    // Group by entity type for batch updates
    const grouped = assignments.reduce((acc, assignment) => {
      if (!acc[assignment.entityType]) {
        acc[assignment.entityType] = { assign: [], unassign: [] };
      }
      
      if (assignment.ownerId) {
        acc[assignment.entityType].assign.push({
          id: assignment.entityId,
          owner_id: assignment.ownerId
        });
      } else {
        acc[assignment.entityType].unassign.push(assignment.entityId);
      }
      
      return acc;
    }, {} as Record<string, { assign: any[]; unassign: string[] }>);

    // Execute batch updates
    const promises = Object.entries(grouped).map(async ([entityType, operations]) => {
      const results = [];
      
      if (operations.assign.length > 0) {
        const { error: assignError } = await supabase
          .from(entityType)
          .upsert(operations.assign);
        results.push(assignError);
      }
      
      if (operations.unassign.length > 0) {
        const { error: unassignError } = await supabase
          .from(entityType)
          .update({ owner_id: null })
          .in('id', operations.unassign);
        results.push(unassignError);
      }
      
      return results;
    });

    const results = await Promise.all(promises);
    const errors = results.flat().filter(Boolean);
    
    if (errors.length > 0) {
      throw new Error(`Batch update failed: ${errors.map(e => e.message).join(', ')}`);
    }
  }

  /**
   * BEFORE: Multiple queries for pipeline data
   * AFTER: Single optimized query with proper filtering
   */
  static async getPipelineDataOptimized(filters: {
    stage?: string;
    ownerId?: string;
    showFavorites?: boolean;
  } = {}) {
    let query = supabase
      .from('company_assignments_with_users')
      .select('*');

    if (filters.stage && filters.stage !== 'all') {
      query = query.eq('status', filters.stage);
    }

    if (filters.ownerId && filters.ownerId !== 'all') {
      if (filters.ownerId === 'assigned') {
        query = query.not('owner_id', 'is', null);
      } else {
        query = query.eq('owner_id', filters.ownerId);
      }
    }

    if (filters.showFavorites) {
      query = query.eq('is_favourite', true);
    }

    query = query.order('created_at', { ascending: false });

    return await query;
  }

  /**
   * BEFORE: Individual user profile fetches in OwnerDisplay components
   * AFTER: Pre-fetch all users and pass as props
   */
  static async prefetchUsersForComponents(): Promise<Record<string, { id: string; full_name: string; email: string; role: string }>> {
    return await this.getUsersWithCache();
  }
}

/**
 * Query performance monitoring utilities
 */
export class QueryPerformanceMonitor {
  private static queryTimes: Map<string, number[]> = new Map();

  static startTiming(queryName: string): () => void {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      if (!this.queryTimes.has(queryName)) {
        this.queryTimes.set(queryName, []);
      }
      
      this.queryTimes.get(queryName)!.push(duration);
      
      // Log slow queries
      if (duration > 1000) { // 1 second
        console.warn(`🐌 Slow query detected: ${queryName} took ${duration.toFixed(2)}ms`);
      }
    };
  }

  static getQueryStats(queryName: string): { avg: number; min: number; max: number; count: number } | null {
    const times = this.queryTimes.get(queryName);
    if (!times || times.length === 0) return null;

    const avg = times.reduce((a, b) => a + b, 0) / times.length;
    const min = Math.min(...times);
    const max = Math.max(...times);

    return { avg, min, max, count: times.length };
  }

  static getAllQueryStats(): Record<string, { avg: number; min: number; max: number; count: number }> {
    const stats: Record<string, any> = {};
    
    for (const [queryName] of this.queryTimes) {
      stats[queryName] = this.getQueryStats(queryName);
    }
    
    return stats;
  }
}
