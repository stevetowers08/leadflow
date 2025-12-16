/**
 * Leads Service
 *
 * PDR Section: Phase 1 MVP - Core Features
 * Handles lead creation, updates, and queries
 */

import { supabase } from '@/integrations/supabase/client';
import type { Lead } from '@/types/database';
import { linkCompanyToShow } from './showCompaniesService';

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

  const { data, error } = await supabase
    .from('leads')
    .insert({
      ...input,
      user_id: userId,
      status: 'processing',
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

  return data as Lead;
}

/**
 * Update an existing lead
 */
export async function updateLead(
  leadId: string,
  input: UpdateLeadInput
): Promise<Lead> {
  const { data, error } = await supabase
    .from('leads')
    .update({
      ...input,
      updated_at: new Date().toISOString(),
    })
    .eq('id', leadId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update lead: ${error.message}`);
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
  show_name?: string; // Legacy filter
  show_date?: string; // Legacy filter
}): Promise<Lead[]> {
  // Helper function to build query with optional shows join
  // Note: companies join removed - leads table doesn't have company_id FK
  const buildQuery = (includeShows: boolean) => {
    const selectQuery = includeShows
      ? `*, shows(id, name, start_date, end_date, city, venue)`
      : `*`;

    let query = supabase
      .from('leads')
      .select(selectQuery)
      .order('created_at', { ascending: false });

    if (options?.quality_rank) {
      query = query.eq('quality_rank', options.quality_rank);
    }

    if (options?.status) {
      query = query.eq('status', options.status);
    }

    if (options?.show_id) {
      query = query.eq('show_id', options.show_id);
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
  const { error } = await supabase.from('leads').delete().eq('id', leadId);

  if (error) {
    throw new Error(`Failed to delete lead: ${error.message}`);
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
