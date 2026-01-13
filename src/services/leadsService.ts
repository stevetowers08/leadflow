/**
 * Leads Service
 *
 * PDR Section: Phase 1 MVP - Core Features
 * Handles lead creation, updates, and queries
 */

import { supabase } from '@/integrations/supabase/client';
import type { Lead } from '@/types/database';
import { linkCompanyToShow } from './showCompaniesService';
import { formatLeadTextFields } from '@/utils/textFormatting';
import { triggerEnrichmentWebhook } from './enrichLeadWebhook';

export interface CreateLeadInput {
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  company?: string | null; // Company name (text field, not FK)
  job_title?: string | null;
  phone?: string | null;
  scan_image_url?: string | null;
  quality_rank?: 'hot' | 'warm' | 'cold' | null;
  show_id?: string | null;
  show_name?: string | null; // Legacy, use show_id
  show_date?: string | null; // Legacy, use show_id
  notes?: string | null;
  user_id?: string | null;
}

export interface UpdateLeadInput {
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  company?: string | null; // Company name (text field, not FK)
  job_title?: string | null;
  phone?: string | null;
  quality_rank?: 'hot' | 'warm' | 'cold' | null;
  status?: 'processing' | 'active' | 'replied_manual';
  show_id?: string | null;
  show_name?: string | null; // Legacy
  show_date?: string | null; // Legacy
  notes?: string | null;
  ai_summary?: string | null;
  ai_icebreaker?: string | null;
}

/**
 * Create a new lead
 */
export async function createLead(input: CreateLeadInput): Promise<Lead> {
  // Get current user if not provided
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = input.user_id || user?.id;

  // Format text fields to Title Case
  const formattedInput = formatLeadTextFields({
    first_name: input.first_name,
    last_name: input.last_name,
    company: input.company,
    job_title: input.job_title,
  });

  const { data, error } = await supabase
    .from('leads')
    .insert({
      ...input,
      ...formattedInput,
      user_id: userId,
      status: 'processing',
      enrichment_status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create lead: ${error.message}`);
  }

  // Auto-link company to show if both are present
  // Note: leads table doesn't have company_id, need to find company by name first
  if (data.company && data.show_id) {
    try {
      // Find company by name
      const { data: companyData } = await supabase
        .from('companies')
        .select('id')
        .eq('name', data.company)
        .maybeSingle();

      if (companyData?.id) {
        await linkCompanyToShow(data.show_id, companyData.id);
      }
    } catch (linkError) {
      // Don't fail lead creation if linking fails (might already be linked)
      console.warn('Failed to link company to show:', linkError);
    }
  }

  // Trigger automatic enrichment webhook (fire-and-forget)
  triggerEnrichmentWebhook({
    lead_id: data.id,
    company: data.company || undefined,
    email: data.email || undefined,
    first_name: data.first_name || undefined,
    last_name: data.last_name || undefined,
    linkedin_url: null,
  }).catch(error => {
    // Log but don't fail lead creation
    console.error('Failed to trigger enrichment webhook:', error);
  });

  return data as Lead;
}

/**
 * Update an existing lead
 */
export async function updateLead(
  leadId: string,
  input: UpdateLeadInput
): Promise<Lead> {
  // Get current lead to check status change
  const { data: currentLead } = await supabase
    .from('leads')
    .select(
      'status, enrichment_status, email, first_name, last_name, company, linkedin_url'
    )
    .eq('id', leadId)
    .single();

  // Format text fields to Title Case
  const formattedInput = formatLeadTextFields({
    first_name: input.first_name,
    last_name: input.last_name,
    company: input.company,
    job_title: input.job_title,
  });

  const { data, error } = await supabase
    .from('leads')
    .update({
      ...input,
      ...formattedInput,
      updated_at: new Date().toISOString(),
    })
    .eq('id', leadId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update lead: ${error.message}`);
  }

  // Trigger enrichment if status changed to 'active' and enrichment hasn't been completed
  if (
    currentLead &&
    currentLead.status !== 'active' &&
    input.status === 'active' &&
    currentLead.enrichment_status !== 'completed' &&
    currentLead.enrichment_status !== 'enriching'
  ) {
    triggerEnrichmentWebhook({
      lead_id: leadId,
      company: currentLead.company || undefined,
      email: currentLead.email || undefined,
      first_name: currentLead.first_name || undefined,
      last_name: currentLead.last_name || undefined,
      linkedin_url: currentLead.linkedin_url || undefined,
    }).catch(error => {
      console.error('Failed to trigger enrichment webhook on approval:', error);
    });
  }

  return data as Lead;
}

/**
 * Get a lead by ID
 */
export async function getLead(leadId: string): Promise<Lead | null> {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('id', leadId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Not found
    }
    throw new Error(`Failed to get lead: ${error.message}`);
  }

  return data as Lead;
}

/**
 * Parse sort option into field and direction
 */
function parseSortBy(sortBy?: string): [string, 'asc' | 'desc'] {
  if (!sortBy) return ['created_at', 'desc'];

  const sortMap: Record<string, [string, 'asc' | 'desc']> = {
    created_at_desc: ['created_at', 'desc'],
    created_at_asc: ['created_at', 'asc'],
    name_asc: ['first_name', 'asc'],
    name_desc: ['first_name', 'desc'],
    quality_desc: ['quality_rank', 'desc'], // hot, warm, cold
    quality_asc: ['quality_rank', 'asc'], // cold, warm, hot
  };

  return sortMap[sortBy] || ['created_at', 'desc'];
}

/**
 * Get all leads for the current user
 * RLS policies ensure users only see their own leads
 */
export async function getLeads(options?: {
  limit?: number;
  offset?: number;
  quality_rank?: 'hot' | 'warm' | 'cold';
  status?: 'processing' | 'active' | 'replied_manual';
  show_id?: string;
  company_id?: string;
  company?: string; // Filter by company name (text match)
  sortBy?: string;
  show_name?: string; // Legacy filter
  show_date?: string; // Legacy filter
}): Promise<Lead[]> {
  // Helper function to build query with optional shows join
  // Note: companies join removed - leads table doesn't have company_id FK
  const buildQuery = (includeShows: boolean) => {
    const selectQuery = includeShows
      ? `*, shows(id, name, start_date, end_date, city, venue)`
      : `*`;

    // Parse sorting
    const [sortField, sortDirection] = parseSortBy(options?.sortBy);

    let query = supabase
      .from('leads')
      .select(selectQuery)
      .order(sortField, { ascending: sortDirection === 'asc' });

    if (options?.quality_rank) {
      query = query.eq('quality_rank', options.quality_rank);
    }

    if (options?.status) {
      query = query.eq('status', options.status);
    }

    if (options?.show_id) {
      query = query.eq('show_id', options.show_id);
    }

    // Filter by company name (text match)
    if (options?.company) {
      query = query.ilike('company', `%${options.company}%`);
    }

    // Note: leads table doesn't have company_id column, only company (text)
    // company_id filter removed - use company name filter if needed

    // Legacy filters
    if (options?.show_name) {
      query = query.eq('show_name', options.show_name);
    }

    if (options?.show_date) {
      query = query.eq('show_date', options.show_date);
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset && options?.limit) {
      query = query.range(options.offset, options.offset + options.limit - 1);
    }

    return query;
  };

  // Try with shows join first
  let { data, error } = await buildQuery(true);

  // If error, try without shows join
  if (error) {
    const errorMessage = (error as { message?: string })?.message || '';
    const isJoinError =
      error.code === 'PGRST116' ||
      error.code === '42P01' ||
      errorMessage.includes('does not exist') ||
      errorMessage.includes('relation') ||
      errorMessage.includes('foreign key') ||
      (error as { status?: number })?.status === 400;

    if (isJoinError) {
      // Retry without shows join
      ({ data, error } = await buildQuery(false));

      if (error) {
        throw new Error(`Failed to get leads: ${error.message}`);
      }
      return (data || []) as Lead[];
    }

    throw new Error(`Failed to get leads: ${error.message}`);
  }

  return (data || []) as Lead[];
}

/**
 * Delete a lead
 */
export async function deleteLead(leadId: string): Promise<void> {
  // Try to delete - RLS will automatically filter what the user can delete
  const { data: deletedData, error: deleteError } = await supabase
    .from('leads')
    .delete()
    .eq('id', leadId)
    .select('id');

  if (deleteError) {
    throw new Error(`Failed to delete lead: ${deleteError.message}`);
  }

  // If no rows were deleted, it means RLS blocked it or lead doesn't exist
  if (!deletedData || deletedData.length === 0) {
    throw new Error('Lead not found or access denied');
  }
}

/**
 * Get lead statistics
 * Optimized: Uses database aggregation instead of fetching all records
 */
export async function getLeadStats(): Promise<{
  total: number;
  hot: number;
  warm: number;
  cold: number;
  active: number;
  processing: number;
}> {
  // Use count queries for better performance - only fetch counts, not data
  const [
    totalResult,
    hotResult,
    warmResult,
    coldResult,
    activeResult,
    processingResult,
  ] = await Promise.all([
    supabase.from('leads').select('*', { count: 'exact', head: true }),
    supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('quality_rank', 'hot'),
    supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('quality_rank', 'warm'),
    supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('quality_rank', 'cold'),
    supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active'),
    supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'processing'),
  ]);

  if (totalResult.error) {
    throw new Error(`Failed to get lead stats: ${totalResult.error.message}`);
  }

  return {
    total: totalResult.count || 0,
    hot: hotResult.count || 0,
    warm: warmResult.count || 0,
    cold: coldResult.count || 0,
    active: activeResult.count || 0,
    processing: processingResult.count || 0,
  };
}
