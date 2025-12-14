/**
 * Batch query utilities for optimizing database performance
 * Reduces N+1 query problems and improves data fetching efficiency
 */

import { supabase } from '@/integrations/supabase/client';

export interface BatchQueryOptions {
  staleTime?: number;
  enabled?: boolean;
}

/**
 * Batch fetch company data with related leads and jobs
 * Replaces multiple separate queries with a single optimized query
 */
export const batchFetchCompanyData = async (companyId: string) => {
  const { data, error } = await supabase
    .from('companies')
    .select(
      `
      *,
      jobs:jobs(*),
      people:people(*)
    `
    )
    .eq('id', companyId)
    .single();

  if (error) throw error;
  return data;
};

// batchFetchJobData removed - jobs table no longer exists

/**
 * Batch fetch lead data with company
 */
export const batchFetchLeadData = async (leadId: string) => {
  const { data, error } = await supabase
    .from('leads')
    .select(
      `
      *,
      companies!inner(*)
    `
    )
    .eq('id', leadId)
    .single();

  if (error) throw error;
  return data;
};

/**
 * Optimized dashboard data fetching
 * Fetches only required fields to reduce payload size
 */
export const batchFetchDashboardData = async () => {
  const today = new Date();
  const sevenDaysFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

  // Parallel fetch of counts and recent data
  const [countsResult, recentLeadsResult] = await Promise.all([
    // Count queries
    supabase.from('leads').select('id', { count: 'exact', head: true }),
    supabase.from('companies').select('id', { count: 'exact', head: true }),

    // Recent leads with minimal data
    supabase
      .from('leads')
      .select(
        `
        id,
        first_name,
        last_name,
        email,
        company,
        company_id,
        status,
        quality_rank,
        created_at
      `
      )
      .order('created_at', { ascending: false })
      .limit(5),
  ]);

  return {
    counts: {
      leads: countsResult[0].count,
      companies: countsResult[1].count,
      jobs: countsResult[2].count,
    },
    todayJobs: todayJobsResult.data || [],
    recentLeads: recentLeadsResult.data || [],
  };
};

/**
 * Optimized list fetching with pagination
 */
export const batchFetchListData = async (
  table: 'jobs' | 'people' | 'companies',
  options: {
    page?: number;
    limit?: number;
    filters?: Record<string, unknown>;
    orderBy?: string;
    orderDirection?: 'asc' | 'desc';
  } = {}
) => {
  const {
    page = 0,
    limit = 50,
    filters = {},
    orderBy = 'created_at',
    orderDirection = 'desc',
  } = options;

  let query = supabase
    .from(table)
    .select('*')
    .order(orderBy, { ascending: orderDirection === 'asc' })
    .range(page * limit, (page + 1) * limit - 1);

  // Apply filters
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query = query.eq(key, value);
    }
  });

  const { data, error, count } = await query;

  if (error) throw error;

  return {
    data: data || [],
    count: count || 0,
    hasMore: (count || 0) > (page + 1) * limit,
  };
};

/**
 * Cache for batch queries to prevent duplicate requests
 */
const queryCache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes

export const getCachedQuery = (key: string) => {
  const cached = queryCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
};

export const setCachedQuery = (key: string, data: unknown) => {
  queryCache.set(key, { data, timestamp: Date.now() });
};

/**
 * Clear cache for specific patterns
 */
export const clearQueryCache = (pattern?: string) => {
  if (pattern) {
    const keysToDelete = Array.from(queryCache.keys()).filter(key =>
      key.includes(pattern)
    );
    keysToDelete.forEach(key => queryCache.delete(key));
  } else {
    queryCache.clear();
  }
};
