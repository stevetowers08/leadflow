import { useClientId } from '@/hooks/useClientId';
import { supabase } from '@/integrations/supabase/client';
import {
  CACHE_PATTERNS,
  useAdvancedCaching,
  useOptimisticMutation,
} from '@/hooks/useAdvancedCaching';
import {
  useMultiTableRealtime,
  useRealtimeSubscription,
} from '@/hooks/useRealtimeSubscriptions';

// Enhanced data service with caching and real-time updates
export function useEnhancedDataService() {
  // Real-time subscriptions for all major tables
  const realtimeSubscriptions = useMultiTableRealtime([
    {
      table: 'people',
      events: ['INSERT', 'UPDATE', 'DELETE'],
      onInsert: (payload: unknown) => {
        const p = payload as { new?: Record<string, unknown> };
        console.log('🆕 New person added:', p.new);
      },
      onUpdate: (payload: unknown) => {
        const p = payload as { new?: Record<string, unknown> };
        console.log('🔄 Person updated:', p.new);
      },
      onDelete: (payload: unknown) => {
        const p = payload as { old?: Record<string, unknown> };
        console.log('🗑️ Person deleted:', p.old);
      },
    },
    {
      table: 'companies',
      events: ['INSERT', 'UPDATE', 'DELETE'],
      onInsert: payload => {
        console.log('🏢 New company added:', payload.new);
      },
      onUpdate: payload => {
        console.log('🏢 Company updated:', payload.new);
      },
    },
    // Jobs table removed - not in PDR
    {
      table: 'activity_log',
      events: ['INSERT', 'UPDATE'],
      onInsert: payload => {
        console.log('💬 New activity:', payload.new);
      },
    },
    {
      table: 'workflows',
      events: ['INSERT', 'UPDATE', 'DELETE'],
    },
    {
      table: 'campaign_sequences',
      events: ['INSERT', 'UPDATE', 'DELETE'],
    },
  ]);

  return {
    realtimeSubscriptions,
  };
}

// Enhanced leads service with caching and real-time updates
export function useEnhancedLeadsService(
  pagination: { page: number; pageSize: number },
  sort: { column: string; ascending: boolean },
  filters: Record<string, unknown>
) {
  const { invalidateCache } = useAdvancedCaching(
    ['leads', pagination, sort, filters],
    async () => {
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
          show_name,
          show_date,
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
    {
      cacheType: 'DYNAMIC',
      refetchOnWindowFocus: false,
    }
  );

  // Real-time subscription for leads
  useRealtimeSubscription('people', {
    events: ['INSERT', 'UPDATE', 'DELETE'],
    onInsert: () => invalidateCache(CACHE_PATTERNS.PEOPLE),
    onUpdate: () => invalidateCache(CACHE_PATTERNS.PEOPLE),
    onDelete: () => invalidateCache(CACHE_PATTERNS.PEOPLE),
  });

  return {
    invalidateCache,
  };
}

// Enhanced companies service
export function useEnhancedCompaniesService(
  pagination: { page: number; pageSize: number },
  sort: { column: string; ascending: boolean },
  filters: Record<string, unknown>
) {
  const { invalidateCache } = useAdvancedCaching(
    ['companies', pagination, sort, filters],
    async () => {
      const { page, pageSize } = pagination;
      const { column, ascending } = sort;
      const { search, pipeline_stage, ...otherFilters } = filters;

      let query = supabase.from('companies').select(
        `
          id,
          name,
          website,
          linkedin_url,
          industry,
          lead_score,
          pipeline_stage,
          created_at,
          updated_at
        `,
        { count: 'exact' }
      );

      // Apply filters
      if (search) {
        query = query.or(`name.ilike.%${search}%,industry.ilike.%${search}%`);
      }

      if (pipeline_stage && pipeline_stage !== 'all') {
        query = query.eq('pipeline_stage', pipeline_stage);
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
    {
      cacheType: 'DYNAMIC',
      refetchOnWindowFocus: false,
    }
  );

  // Real-time subscription for companies
  useRealtimeSubscription('companies', {
    events: ['INSERT', 'UPDATE', 'DELETE'],
    onInsert: () => invalidateCache(CACHE_PATTERNS.COMPANIES),
    onUpdate: () => invalidateCache(CACHE_PATTERNS.COMPANIES),
    onDelete: () => invalidateCache(CACHE_PATTERNS.COMPANIES),
  });

  return {
    invalidateCache,
  };
}

// Enhanced dashboard service with real-time updates
export function useEnhancedDashboardService() {
  const {
    data: dashboardStats,
    isLoading,
    error,
  } = useAdvancedCaching(
    ['dashboard', 'stats'],
    async () => {
      const [
        { data: people, error: peopleError },
        { data: companies, error: companiesError },
        { data: activityLog, error: activityLogError },
      ] = await Promise.all([
        supabase.from('leads').select('id', { count: 'exact' }),
        supabase.from('companies').select('id', { count: 'exact' }),
        supabase.from('activity_log').select('id', { count: 'exact' }),
      ]);

      if (peopleError || companiesError || activityLogError) {
        throw new Error('Failed to fetch dashboard stats');
      }

      return {
        totalLeads: people?.length || 0,
        totalCompanies: companies?.length || 0,
        totalInteractions: activityLog?.length || 0,
        lastUpdated: new Date().toISOString(),
      };
    },
    {
      cacheType: 'REAL_TIME',
      refetchOnWindowFocus: true,
    }
  );

  // Real-time subscription for dashboard updates
  useMultiTableRealtime([
    { table: 'leads', events: ['INSERT', 'DELETE'] },
    { table: 'companies', events: ['INSERT', 'DELETE'] },
    { table: 'activity_log', events: ['INSERT'] },
  ]);

  return {
    dashboardStats,
    isLoading,
    error,
  };
}

// Optimistic mutations for common operations
export function useOptimisticMutations() {
  // Optimistic update for lead status
  const updatePersonStage = useOptimisticMutation(
    async ({ personId, newStage }: { personId: string; newStage: string }) => {
      const { data, error } = await supabase
        .from('leads')
        .update({ status: newStage, updated_at: new Date().toISOString() })
        .eq('id', personId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    {
      onMutate: async ({ personId, newStage }) => {
        // Optimistically update the cache
        // This would be implemented with queryClient.setQueryData
      },
      invalidateQueries: [['people'], ['dashboard']],
    }
  );

  // Optimistic update for company pipeline stage
  const updateCompanyPipelineStage = useOptimisticMutation(
    async ({
      companyId,
      newStage,
    }: {
      companyId: string;
      newStage: string;
    }) => {
      const { data, error } = await supabase
        .from('companies')
        .update({
          pipeline_stage: newStage,
          updated_at: new Date().toISOString(),
        })
        .eq('id', companyId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    {
      invalidateQueries: [['companies'], ['dashboard']],
    }
  );

  return {
    updatePersonStage,
    updateCompanyPipelineStage,
    updateJobPriority,
  };
}
