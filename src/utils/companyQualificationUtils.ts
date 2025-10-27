import { supabase } from '@/integrations/supabase/client';

/**
 * Get qualification details for a company
 */
export async function getCompanyQualificationDetails(companyId: string) {
  const { data, error } = await supabase
    .from('client_companies')
    .select(
      `
      qualified_by,
      qualified_at,
      qualification_status,
      priority,
      user_profiles!qualified_by (
        id,
        full_name,
        email
      )
    `
    )
    .eq('company_id', companyId)
    .single();

  if (error) {
    console.error('Error fetching qualification details:', error);
    return null;
  }

  return data;
}

/**
 * Get all users who qualified a company (including history)
 */
export async function getCompanyQualificationHistory(companyId: string) {
  const { data, error } = await supabase
    .from('client_companies')
    .select(
      `
      id,
      client_id,
      qualification_status,
      qualified_at,
      qualification_notes,
      priority,
      qualified_by,
      user_profiles!qualified_by (
        id,
        full_name,
        email
      ),
      clients (
        id,
        name
      )
    `
    )
    .eq('company_id', companyId)
    .order('qualified_at', { ascending: false });

  if (error) {
    console.error('Error fetching qualification history:', error);
    return null;
  }

  return data;
}
