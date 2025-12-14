import { useClientId } from '@/hooks/useClientId';
import { supabase } from '@/integrations/supabase/client';
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useCallback } from 'react';

// Types for pagination and filtering
export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface SortParams {
  column: string;
  ascending: boolean;
}

export interface FilterParams {
  search?: string;
  status?: string;
  priority?: string;
  [key: string]: unknown;
}

export interface QueryOptions {
  enabled?: boolean;
  staleTime?: number;
  cacheTime?: number;
  refetchOnWindowFocus?: boolean;
}

// Optimized leads query with server-side pagination
export const useLeads = (
  pagination: PaginationParams,
  sort: SortParams,
  filters: FilterParams,
  options: QueryOptions = {}
) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['leads', pagination, sort, filters],
    queryFn: async () => {
      const { page, pageSize } = pagination;
      const { column, ascending } = sort;
      const { search, status, ...otherFilters } = filters;

      let query = supabase.from('leads').select(
        `
          id,
          first_name,
          last_name,
          email,
          company,
          company_id,
          job_title,
          status,
          quality_rank,
          linkedin_url,
          created_at,
          confidence_level
        `,
        { count: 'exact' }
      );

      // Apply filters
      if (search) {
        query = query.or(
          `first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%,company.ilike.%${search}%,job_title.ilike.%${search}%`
        );
      }

      if (status && status !== 'all') {
        query = query.eq('status', status);
      }

      // Apply other filters
      Object.entries(otherFilters).forEach(([key, value]) => {
        if (value && value !== 'all') {
          query = query.eq(key, value);
        }
      });

      // Apply sorting
      query = query.order(column, { ascending });

      // Apply pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        data: data || [],
        totalCount: count || 0,
        hasMore: (count || 0) > to + 1,
        page,
        pageSize,
      };
    },
    enabled: options.enabled !== false,
    staleTime: options.staleTime || 2 * 60 * 1000, // 2 minutes
    gcTime: options.cacheTime || 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
    refetchOnWindowFocus: options.refetchOnWindowFocus || false,
  });
};

// Optimized companies query with server-side pagination and counts
export const useCompanies = (
  pagination: PaginationParams,
  sort: SortParams,
  filters: FilterParams,
  options: QueryOptions = {}
) => {
  return useQuery({
    queryKey: ['companies', pagination, sort, filters],
    queryFn: async () => {
      const { page, pageSize } = pagination;
      const { column, ascending } = sort;
      const { search, status, ...otherFilters } = filters;

      // Build the main query with counts using a single optimized query
      let query = supabase.from('companies').select(
        `
          *
        `,
        { count: 'exact' }
      );

      // Apply filters
      if (search) {
        query = query.or(
          `name.ilike.%${search}%,industry.ilike.%${search}%,head_office.ilike.%${search}%`
        );
      }

      if (status && status !== 'all') {
        // automation_active field removed - use workflow_status from leads instead
        if (status === 'qualified') {
          query = query.eq('confidence_level', 'high');
        } else if (status === 'prospect') {
          query = query.eq('confidence_level', 'medium');
        } else if (status === 'new') {
          query = query.eq('confidence_level', 'low');
        }
      }

      // Apply other filters
      Object.entries(otherFilters).forEach(([key, value]) => {
        if (value && value !== 'all') {
          query = query.eq(key, value);
        }
      });

      // Apply sorting
      query = query.order(column, { ascending });

      // Apply pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        data: data || [],
        totalCount: count || 0,
        hasMore: (count || 0) > to + 1,
        page,
        pageSize,
      };
    },
    enabled: options.enabled !== false,
    staleTime: options.staleTime || 2 * 60 * 1000,
    gcTime: options.cacheTime || 5 * 60 * 1000, // formerly cacheTime
    refetchOnWindowFocus: options.refetchOnWindowFocus || false,
  });
};

// Optimized dashboard stats query using performance views
export const useDashboardStats = (options: QueryOptions = {}) => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const today = new Date();
      const sydneyDate = new Date(
        today.toLocaleString('en-US', { timeZone: 'Australia/Sydney' })
      );
      const todayDateString = sydneyDate.toISOString().split('T')[0];

      // Use materialized view for dashboard metrics and optimized queries
      const [dashboardMetrics] = await Promise.all([
        // Get dashboard metrics from materialized view
        supabase
          .from('dashboard_metrics' as never)
          .select('*')
          .single(),
      ]);

      const metrics = dashboardMetrics.data as unknown as {
        total_leads?: number;
        total_companies?: number;
        active_automations?: number;
        avg_lead_score?: number;
      } | null;

      return {
        totalLeads: metrics?.total_leads || 0,
        totalCompanies: metrics?.total_companies || 0,
        activeAutomations: metrics?.active_automations || 0,
        avgLeadScore: metrics?.avg_lead_score || 0,
      };
    },
    enabled: options.enabled !== false,
    staleTime: options.staleTime || 1 * 60 * 1000, // 1 minute for stats
    gcTime: options.cacheTime || 5 * 60 * 1000, // formerly cacheTime
    refetchOnWindowFocus: options.refetchOnWindowFocus || false,
  });
};

// Infinite query for large datasets
export const useInfiniteLeads = (
  sort: SortParams,
  filters: FilterParams,
  pageSize: number = 20,
  options: QueryOptions = {}
) => {
  return useInfiniteQuery({
    queryKey: ['leads-infinite', sort, filters, pageSize],
    initialPageParam: 0,
    queryFn: async ({ pageParam = 0 }) => {
      const { column, ascending } = sort;
      const { search, status, ...otherFilters } = filters;

      let query = supabase.from('leads').select(`
          id,
          first_name,
          last_name,
          email,
          company,
          company_id,
          job_title,
          status,
          quality_rank,
          linkedin_url,
          created_at,
          confidence_level
        `);

      // Apply filters
      if (search) {
        query = query.or(
          `first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%,company.ilike.%${search}%,job_title.ilike.%${search}%`
        );
      }

      if (status && status !== 'all') {
        query = query.eq('status', status);
      }

      // Apply other filters
      Object.entries(otherFilters).forEach(([key, value]) => {
        if (value && value !== 'all') {
          query = query.eq(key, value);
        }
      });

      // Apply sorting
      query = query.order(column, { ascending });

      // Apply pagination
      const from = pageParam * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, error } = await query;

      if (error) throw error;

      return {
        data: data || [],
        nextCursor:
          data && data.length === pageSize ? pageParam + 1 : undefined,
        hasMore: data && data.length === pageSize,
      };
    },
    getNextPageParam: lastPage => lastPage.nextCursor,
    enabled: options.enabled !== false,
    staleTime: options.staleTime || 2 * 60 * 1000,
    gcTime: options.cacheTime || 5 * 60 * 1000, // formerly cacheTime
    refetchOnWindowFocus: options.refetchOnWindowFocus || false,
  });
};

// Prefetching utilities
export const usePrefetchData = () => {
  const queryClient = useQueryClient();

  const prefetchLead = useCallback(
    (leadId: string) => {
      queryClient.prefetchQuery({
        queryKey: ['popup-lead', leadId],
        queryFn: async () => {
          const { data, error } = await supabase
            .from('leads')
            .select(
              `
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
              priority,
              confidence_level,
              is_favourite,
              ai_info,
              key_info_raw,
              created_at,
              updated_at
            )
          `
            )
            .eq('id', leadId)
            .single();

          if (error) throw error;
          return data;
        },
        staleTime: 5 * 60 * 1000,
      });
    },
    [queryClient]
  );

  const prefetchCompany = useCallback(
    (companyId: string) => {
      queryClient.prefetchQuery({
        queryKey: ['popup-company', companyId],
        queryFn: async () => {
          const { data, error } = await supabase
            .from('companies')
            .select('*')
            .eq('id', companyId)
            .single();

          if (error) throw error;
          return data;
        },
        staleTime: 5 * 60 * 1000,
      });
    },
    [queryClient]
  );

  return {
    prefetchLead,
    prefetchCompany,
  };
};

// Cache invalidation utilities
export const useCacheInvalidation = () => {
  const queryClient = useQueryClient();

  const invalidateLeads = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['leads'] });
    queryClient.invalidateQueries({ queryKey: ['leads-infinite'] });
  }, [queryClient]);

  const invalidateCompanies = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['companies'] });
  }, [queryClient]);

  const invalidateDashboard = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
  }, [queryClient]);

  const invalidateAll = useCallback(() => {
    queryClient.invalidateQueries();
  }, [queryClient]);

  return {
    invalidateLeads,
    invalidateCompanies,
    invalidateDashboard,
    invalidateAll,
  };
};
