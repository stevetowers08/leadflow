import { supabase } from '@/integrations/supabase/client';

export interface SearchResult {
  id: string;
  type: 'person' | 'company' | 'lead';
  title: string;
  subtitle?: string;
  description?: string;
  metadata?: Record<string, unknown>;
  score?: number;
}

export interface GlobalSearchOptions {
  limit?: number;
  includeInactive?: boolean;
  sortBy?: 'relevance' | 'date' | 'name';
}

export class GlobalSearchService {
  /**
   * Search across people, companies, and leads
   */
  static async search(
    query: string,
    options: GlobalSearchOptions = {}
  ): Promise<SearchResult[]> {
    if (!query.trim()) {
      return [];
    }

    const {
      limit = 50,
      includeInactive = false,
      sortBy = 'relevance',
    } = options;
    const searchTerm = query.trim().toLowerCase();

    try {
      // Execute all searches in parallel
      const [peopleResults, companiesResults, leadsResults] = await Promise.all(
        [
          this.searchPeople(searchTerm, limit),
          this.searchCompanies(searchTerm, limit),
          this.searchLeads(searchTerm, limit),
        ]
      );

      // Combine and score results
      const allResults = [
        ...peopleResults.map(result => ({
          ...result,
          type: 'person' as const,
        })),
        ...companiesResults.map(result => ({
          ...result,
          type: 'company' as const,
        })),
        ...leadsResults.map(result => ({ ...result, type: 'lead' as const })),
      ];

      // Score results based on relevance
      const scoredResults = allResults.map(result => ({
        ...result,
        score: this.calculateRelevanceScore(result, searchTerm),
      }));

      // Sort by score and limit results
      return scoredResults
        .sort((a, b) => (b.score || 0) - (a.score || 0))
        .slice(0, limit);
    } catch (error) {
      console.error('Global search error:', error);
      throw new Error('Failed to perform global search');
    }
  }

  /**
   * Search people
   */
  private static async searchPeople(
    searchTerm: string,
    limit: number
  ): Promise<SearchResult[]> {
    const { data, error } = await supabase
      .from('people')
      .select(
        `
        id,
        name,
        email_address,
        company_role,
        employee_location,
        stage,
        lead_score,
        companies!inner(
          id,
          name,
          industry
        )
      `
      )
      .or(
        `name.ilike.%${searchTerm}%,email_address.ilike.%${searchTerm}%,company_role.ilike.%${searchTerm}%`
      )
      .limit(limit);

    if (error) {
      console.error('People search error:', error);
      return [];
    }

    return (data || []).map(person => ({
      id: person.id,
      title: person.name || 'Unknown',
      subtitle: person.company_role || 'No role specified',
      description: `${person.companies?.name || 'Unknown Company'} • ${person.employee_location || 'No location'}`,
      metadata: {
        email: person.email_address,
        stage: person.people_stage,
        leadScore: person.score,
        companyId: person.companies?.id,
        companyName: person.companies?.name,
        industry: person.companies?.industry,
      },
    }));
  }

  /**
   * Search companies
   */
  private static async searchCompanies(
    searchTerm: string,
    limit: number
  ): Promise<SearchResult[]> {
    const { data, error } = await supabase
      .from('companies')
      .select(
        `
        id,
        name,
        industry,
        head_office,
        company_size,
        website,
        lead_score,
        priority,
        automation_active
      `
      )
      .or(
        `name.ilike.%${searchTerm}%,industry.ilike.%${searchTerm}%,head_office.ilike.%${searchTerm}%`
      )
      .limit(limit);

    if (error) {
      console.error('Companies search error:', error);
      return [];
    }

    return (data || []).map(company => ({
      id: company.id,
      title: company.name || 'Unknown Company',
      subtitle: company.industry || 'No industry specified',
      description: `${company.head_office || 'No location'} • ${company.company_size || 'Unknown size'}`,
      metadata: {
        website: company.website,
        leadScore: company.lead_score,
        priority: company.priority,
        automationActive: company.automation_active,
        companySize: company.company_size,
      },
    }));
  }

  /**
   * Search leads
   */
  private static async searchLeads(
    searchTerm: string,
    limit: number
  ): Promise<SearchResult[]> {
    const { data, error } = await supabase
      .from('leads')
      .select(
        `
        id,
        first_name,
        last_name,
        email,
        company,
        job_title,
        status,
        quality_rank,
        created_at
      `
      )
      .or(
        `first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,company.ilike.%${searchTerm}%,job_title.ilike.%${searchTerm}%`
      )
      .limit(limit);

    if (error) {
      console.error('Leads search error:', error);
      return [];
    }

    return (data || []).map(lead => ({
      id: lead.id,
      title:
        `${lead.first_name || ''} ${lead.last_name || ''}`.trim() || 'Unknown',
      subtitle: lead.job_title || 'No title',
      description: `${lead.company || 'No company'} • ${lead.email || 'No email'}`,
      metadata: {
        email: lead.email,
        status: lead.status,
        qualityRank: lead.quality_rank,
        company: lead.company,
        createdAt: lead.created_at,
      },
    }));
  }

  /**
   * Calculate relevance score for search results
   */
  private static calculateRelevanceScore(
    result: SearchResult,
    searchTerm: string
  ): number {
    let score = 0;
    const term = searchTerm.toLowerCase();

    // Exact title match gets highest score
    if (result.title.toLowerCase().includes(term)) {
      score += 100;

      // Exact match gets bonus
      if (result.title.toLowerCase() === term) {
        score += 50;
      }

      // Starts with search term gets bonus
      if (result.title.toLowerCase().startsWith(term)) {
        score += 25;
      }
    }

    // Subtitle match gets medium score
    if (result.subtitle?.toLowerCase().includes(term)) {
      score += 50;
    }

    // Description match gets lower score
    if (result.description?.toLowerCase().includes(term)) {
      score += 25;
    }

    // Metadata matches get lower scores
    Object.values(result.metadata || {}).forEach(value => {
      if (typeof value === 'string' && value.toLowerCase().includes(term)) {
        score += 10;
      }
    });

    // Boost scores for active/important items
    if (result.type === 'person' && result.metadata?.stage === 'new') {
      score += 20;
    }

    if (result.type === 'company' && result.metadata?.automationActive) {
      score += 15;
    }

    if (result.type === 'job' && result.metadata?.automationActive) {
      score += 15;
    }

    // Boost scores for high priority items
    if (
      result.metadata?.priority === 'high' ||
      result.metadata?.priority === 'urgent'
    ) {
      score += 10;
    }

    return score;
  }

  /**
   * Get search suggestions based on partial input
   */
  static async getSuggestions(
    query: string,
    limit: number = 10
  ): Promise<string[]> {
    if (!query.trim() || query.length < 2) {
      return [];
    }

    try {
      const results = await this.search(query, { limit });

      // Extract unique suggestions from results
      const suggestions = new Set<string>();

      results.forEach(result => {
        // Add title as suggestion
        if (result.title.toLowerCase().includes(query.toLowerCase())) {
          suggestions.add(result.title);
        }

        // Add subtitle as suggestion
        if (result.subtitle?.toLowerCase().includes(query.toLowerCase())) {
          suggestions.add(result.subtitle);
        }

        // Add company names from metadata
        if (
          result.metadata?.companyName
            ?.toLowerCase()
            .includes(query.toLowerCase())
        ) {
          suggestions.add(result.metadata.companyName);
        }
      });

      return Array.from(suggestions).slice(0, limit);
    } catch (error) {
      console.error('Search suggestions error:', error);
      return [];
    }
  }
}
