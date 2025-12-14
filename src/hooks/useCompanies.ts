import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

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
  priority?: string;
  confidence_level?: string;
  is_favourite?: boolean;
  created_at: string;
  updated_at: string;
  logo_url?: string;
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
      // Query all companies (shared canonical data)
      let query = supabase.from('companies').select(
        `
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
          created_at,
          updated_at,
          logo_url
        `,
        { count: 'exact' }
      );

      // Apply filters
      if (filters.search) {
        query = query.or(
          `name.ilike.%${filters.search}%,industry.ilike.%${filters.search}%,head_office.ilike.%${filters.search}%`
        );
      }

      if (filters.status && filters.status !== 'all') {
        // automation_active field removed - use workflow_status from leads instead
        if (filters.status === 'qualified') {
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

      // Get leads count for each company
      const companiesWithCounts = await Promise.all(
        (data || []).map(async company => {
          const { count: leadsCount } = await supabase
            .from('leads')
            .select('*', { count: 'exact', head: true })
            .eq('company_id', company.id);

          // Convert null to undefined for TypeScript compatibility (only for nullable fields)
          return {
            ...company,
            website: company.website ?? undefined,
            linkedin_url: company.linkedin_url ?? undefined,
            head_office: company.head_office ?? undefined,
            industry: company.industry ?? undefined,
            company_size: company.company_size ?? undefined,
            lead_score: company.lead_score ?? undefined,
            priority: company.priority ?? undefined,
            confidence_level: company.confidence_level ?? undefined,
            score_reason: company.score_reason ?? undefined,
            logo_url: company.logo_url ?? undefined,
            is_favourite: company.is_favourite ?? false,
            // created_at and updated_at are required, ensure they're always strings
            created_at: company.created_at || new Date().toISOString(),
            updated_at: company.updated_at || new Date().toISOString(),
            people_count: leadsCount || 0,
            // jobs_count removed - not in PDR
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
    gcTime: options?.cacheTime || 5 * 60 * 1000, // 5 minutes (cacheTime renamed to gcTime in v5)
    refetchOnWindowFocus: options?.refetchOnWindowFocus || false,
  });
}
