/**
 * Leads Service
 * 
 * PDR Section: Phase 1 MVP - Core Features
 * Handles lead creation, updates, and queries
 */

import { supabase } from '@/integrations/supabase/client';
import type { Lead } from '@/types/database';

export interface CreateLeadInput {
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  company?: string | null;
  job_title?: string | null;
  phone?: string | null;
  scan_image_url?: string | null;
  quality_rank?: 'hot' | 'warm' | 'cold' | null;
  notes?: string | null;
  user_id?: string | null;
}

export interface UpdateLeadInput {
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  company?: string | null;
  job_title?: string | null;
  phone?: string | null;
  quality_rank?: 'hot' | 'warm' | 'cold' | null;
  status?: 'processing' | 'active' | 'replied_manual';
  notes?: string | null;
  ai_summary?: string | null;
  ai_icebreaker?: string | null;
}

/**
 * Create a new lead
 */
export async function createLead(input: CreateLeadInput): Promise<Lead> {
  // Get current user if not provided
  const { data: { user } } = await supabase.auth.getUser();
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
}): Promise<Lead[]> {
  let query = supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });

  if (options?.quality_rank) {
    query = query.eq('quality_rank', options.quality_rank);
  }

  if (options?.status) {
    query = query.eq('status', options.status);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  if (options?.offset && options?.limit) {
    query = query.range(options.offset, options.offset + options.limit - 1);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to get leads: ${error.message}`);
  }

  return (data || []) as Lead[];
}

/**
 * Delete a lead
 */
export async function deleteLead(leadId: string): Promise<void> {
  const { error } = await supabase
    .from('leads')
    .delete()
    .eq('id', leadId);

  if (error) {
    throw new Error(`Failed to delete lead: ${error.message}`);
  }
}

/**
 * Get lead statistics
 */
export async function getLeadStats(): Promise<{
  total: number;
  hot: number;
  warm: number;
  cold: number;
  active: number;
  processing: number;
}> {
  const { data, error } = await supabase
    .from('leads')
    .select('quality_rank, status');

  if (error) {
    throw new Error(`Failed to get lead stats: ${error.message}`);
  }

  const leads = data || [];

  return {
    total: leads.length,
    hot: leads.filter((l) => l.quality_rank === 'hot').length,
    warm: leads.filter((l) => l.quality_rank === 'warm').length,
    cold: leads.filter((l) => l.quality_rank === 'cold').length,
    active: leads.filter((l) => l.status === 'active').length,
    processing: leads.filter((l) => l.status === 'processing').length,
  };
}

