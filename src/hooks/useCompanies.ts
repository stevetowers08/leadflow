import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface CompaniesFilters {
  search?: string;
  status?: string;
}

interface CompaniesSort {
  column: string;
  ascending: boolean;
}

interface CompaniesPagination {
  page: number;
  pageSize: number;
}

interface Company {
  id: string;
  name: string;
  website?: string;
  linkedin_url?: string;
  head_office?: string;
  industry?: string;
  company_size?: string;
  lead_score?: string;
  score_reason?: string;
  automation_active?: boolean;
  automation_started_at?: string;
  priority?: string;
  confidence_level?: string;
  is_favourite?: boolean;
  created_at: string;
  updated_at: string;
  logo_url?: string;
  people_count?: number;
  jobs_count?: number;
}

interface CompaniesResponse {
  data: Company[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export function useCompanies(
  pagination: CompaniesPagination,
  sort: CompaniesSort,
  filters: CompaniesFilters,
  options?: {
    staleTime?: number;
    cacheTime?: number;
    refetchOnWindowFocus?: boolean;
  }
) {
  return useQuery<CompaniesResponse>({
    queryKey: ['companies', pagination, sort, filters],
    queryFn: async () => {
      let query = supabase
        .from('companies')
        .select(`
          id,
          name,
          website,
          linkedin_url,
          head_office,
          industry,
          company_size,
          lead_score,
          score_reason,
          automation_active,
          automation_started_at,
          priority,
          confidence_level,
          is_favourite,
          created_at,
          updated_at,
          logo_url
        `, { count: 'exact' });

      // Apply filters
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,industry.ilike.%${filters.search}%,head_office.ilike.%${filters.search}%`);
      }

      if (filters.status && filters.status !== 'all') {
        if (filters.status === 'active') {
          query = query.eq('automation_active', true);
        } else if (filters.status === 'qualified') {
          query = query.eq('confidence_level', 'high');
        } else if (filters.status === 'prospect') {
          query = query.eq('confidence_level', 'medium');
        } else if (filters.status === 'new') {
          query = query.eq('confidence_level', 'low');
        }
      }

      // Apply sorting
      if (sort.column) {
        query = query.order(sort.column, { ascending: sort.ascending });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      // Apply pagination
      const from = (pagination.page - 1) * pagination.pageSize;
      const to = from + pagination.pageSize - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        throw new Error(`Failed to fetch companies: ${error.message}`);
      }

      // Get people count for each company
      const companiesWithCounts = await Promise.all(
        (data || []).map(async (company) => {
          const { count: peopleCount } = await supabase
            .from('people')
            .select('*', { count: 'exact', head: true })
            .eq('company_id', company.id);

          const { count: jobsCount } = await supabase
            .from('jobs')
            .select('*', { count: 'exact', head: true })
            .eq('company_id', company.id);

          return {
            ...company,
            people_count: peopleCount || 0,
            jobs_count: jobsCount || 0,
          };
        })
      );

      return {
        data: companiesWithCounts,
        totalCount: count || 0,
        page: pagination.page,
        pageSize: pagination.pageSize,
      };
    },
    staleTime: options?.staleTime || 2 * 60 * 1000, // 2 minutes
    cacheTime: options?.cacheTime || 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: options?.refetchOnWindowFocus || false,
  });
}
