import { useClientId } from '@/hooks/useClientId';
import { supabase } from '@/integrations/supabase/client';
import {
  CACHE_PATTERNS,
  useAdvancedCaching,
  useOptimisticMutation,
} from './useAdvancedCaching';
import {
  useMultiTableRealtime,
  useRealtimeSubscription,
} from './useRealtimeSubscriptions';

// Enhanced data service with caching and real-time updates
export function useEnhancedDataService() {
  // Real-time subscriptions for all major tables
  const realtimeSubscriptions = useMultiTableRealtime([
    {
      table: 'people',
      events: ['INSERT', 'UPDATE', 'DELETE'],
      onInsert: payload => {
        console.log('🆕 New person added:', payload.new);
      },
      onUpdate: payload => {
        console.log('🔄 Person updated:', payload.new);
      },
      onDelete: payload => {
        console.log('🗑️ Person deleted:', payload.old);
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
    {
      table: 'jobs',
      events: ['INSERT', 'UPDATE', 'DELETE'],
      onInsert: payload => {
        console.log('💼 New job added:', payload.new);
      },
      onUpdate: payload => {
        console.log('💼 Job updated:', payload.new);
      },
    },
    {
      table: 'interactions',
      events: ['INSERT', 'UPDATE'],
      onInsert: payload => {
        console.log('💬 New interaction:', payload.new);
      },
    },
    {
      table: 'campaigns',
      events: ['INSERT', 'UPDATE', 'DELETE'],
    },
    {
      table: 'campaign_participants',
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

      let query = supabase.from('people').select(
        `
          id,
          name,
          company_id,
          email_address,
          employee_location,
          company_role,
          stage,
          lead_score,
          linkedin_url,
          created_at,
          confidence_level,
          companies!inner(
            id,
            name,
            website
          )
        `,
        { count: 'exact' }
      );

      // Apply filters
      if (search) {
        query = query.or(
          `name.ilike.%${search}%,company_role.ilike.%${search}%,email_address.ilike.%${search}%`
        );
      }

      if (status && status !== 'all') {
        query = query.eq('people_stage', status);
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

// Enhanced jobs service
export function useEnhancedJobsService(
  pagination: { page: number; pageSize: number },
  sort: { column: string; ascending: boolean },
  filters: Record<string, unknown>
) {
  const { data: clientId, isLoading: clientIdLoading } = useClientId();

  const { invalidateCache } = useAdvancedCaching(
    ['jobs', pagination, sort, filters, clientId],
    async () => {
      // Don't fetch if client ID is still loading
      if (clientIdLoading || !clientId) {
        return {
          data: [],
          totalCount: 0,
          hasMore: false,
          page: pagination.page,
          pageSize: pagination.pageSize,
        };
      }

      const { page, pageSize } = pagination;
      const { column, ascending } = sort;
      const { search, priority, ...otherFilters } = filters;

      // CLIENT-SPECIFIC JOBS ONLY (jobs assigned to this client)
      let query = supabase.from('jobs').select(
        `
          id,
          title,
          location,
          priority,
          posted_date,
          lead_score_job,
          automation_active,
          company_id,
          created_at,
          qualification_status,
          companies!inner(
            id,
            name,
            website,
            industry
          ),
          client_jobs!client_jobs_job_id_fkey (
            status,
            priority_level,
            qualified_at,
            qualified_by
          )
        `,
        { count: 'exact' }
      );

      // Only show jobs assigned to this client
      query = query.eq('client_jobs.client_id', clientId);

      // Apply filters
      if (search) {
        query = query.or(`title.ilike.%${search}%,location.ilike.%${search}%`);
      }

      if (priority && priority !== 'all') {
        query = query.eq('priority', priority);
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

  // Real-time subscription for jobs
  useRealtimeSubscription('jobs', {
    events: ['INSERT', 'UPDATE', 'DELETE'],
    onInsert: () => invalidateCache(CACHE_PATTERNS.JOBS),
    onUpdate: () => invalidateCache(CACHE_PATTERNS.JOBS),
    onDelete: () => invalidateCache(CACHE_PATTERNS.JOBS),
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
        { data: jobs, error: jobsError },
        { data: interactions, error: interactionsError },
      ] = await Promise.all([
        supabase.from('people').select('id', { count: 'exact' }),
        supabase.from('companies').select('id', { count: 'exact' }),
        supabase.from('jobs').select('id', { count: 'exact' }),
        supabase.from('interactions').select('id', { count: 'exact' }),
      ]);

      if (peopleError || companiesError || jobsError || interactionsError) {
        throw new Error('Failed to fetch dashboard stats');
      }

      return {
        totalLeads: people?.length || 0,
        totalCompanies: companies?.length || 0,
        totalJobs: jobs?.length || 0,
        totalInteractions: interactions?.length || 0,
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
    { table: 'people', events: ['INSERT', 'DELETE'] },
    { table: 'companies', events: ['INSERT', 'DELETE'] },
    { table: 'jobs', events: ['INSERT', 'DELETE'] },
    { table: 'interactions', events: ['INSERT'] },
  ]);

  return {
    dashboardStats,
    isLoading,
    error,
  };
}

// Optimistic mutations for common operations
export function useOptimisticMutations() {
  // Optimistic update for person stage
  const updatePersonStage = useOptimisticMutation(
    async ({ personId, newStage }: { personId: string; newStage: string }) => {
      const { data, error } = await supabase
        .from('people')
        .update({ stage: newStage, updated_at: new Date().toISOString() })
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

  // Optimistic update for job priority
  const updateJobPriority = useOptimisticMutation(
    async ({ jobId, newPriority }: { jobId: string; newPriority: string }) => {
      const { data, error } = await supabase
        .from('jobs')
        .update({ priority: newPriority, updated_at: new Date().toISOString() })
        .eq('id', jobId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    {
      invalidateQueries: [['jobs'], ['dashboard']],
    }
  );

  return {
    updatePersonStage,
    updateCompanyPipelineStage,
    updateJobPriority,
  };
}
