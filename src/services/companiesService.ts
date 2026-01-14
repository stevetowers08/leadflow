import { supabase } from '@/integrations/supabase/client';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, Tables } from '@/integrations/supabase/types';
import { formatCompanyTextFields } from '@/utils/textFormatting';
import { toTitleCase } from '@/utils/textFormatting';

type CompanyInsertData = Tables<'companies'>['Insert'];
type Company = Tables<'companies'>['Row'];

/**
 * Find or create a company by name (case-insensitive)
 * This function ensures no duplicates are created by checking for existing companies
 * before inserting. It uses the unique constraint on LOWER(name) to prevent duplicates.
 *
 * @param companyName - The company name to find or create
 * @param additionalData - Optional additional company data to merge when creating
 * @param supabaseClient - Optional Supabase client (for server-side usage)
 * @returns The company ID if found or created, null if error
 */
export async function findOrCreateCompany(
  companyName: string,
  additionalData?: Partial<CompanyInsertData>,
  supabaseClient?: SupabaseClient<Database>
): Promise<string | null> {
  if (!companyName || companyName.trim() === '') {
    return null;
  }

  const client = supabaseClient || supabase;

  try {
    // Format company name to Title Case for consistency
    const formattedName = toTitleCase(companyName.trim());

    // Try to find existing company (case-insensitive search)
    const { data: existing, error: findError } = await client
      .from('companies')
      .select('id')
      .ilike('name', formattedName)
      .limit(1)
      .maybeSingle();

    if (findError && findError.code !== 'PGRST116') {
      // PGRST116 = no rows found (expected when company doesn't exist)
      console.error('Error finding company:', findError);
      return null;
    }

    // If company exists, return its ID
    if (existing?.id) {
      return existing.id;
    }

    // Company doesn't exist, create it
    const companyData: CompanyInsertData = {
      name: formattedName,
      ...additionalData,
    };

    // Format text fields to Title Case
    const formattedData = formatCompanyTextFields({
      name: companyData.name,
      head_office: companyData.head_office,
      industry: companyData.industry,
    });

    const { data: newCompany, error: createError } = await client
      .from('companies')
      .insert({
        ...companyData,
        ...formattedData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select('id')
      .single();

    if (createError) {
      // If it's a unique constraint violation, try to find the company again
      // (race condition: another process might have created it)
      if (createError.code === '23505') {
        const { data: raceConditionCompany } = await client
          .from('companies')
          .select('id')
          .ilike('name', formattedName)
          .limit(1)
          .maybeSingle();

        if (raceConditionCompany?.id) {
          return raceConditionCompany.id;
        }
      }

      console.error('Error creating company:', createError);
      return null;
    }

    return newCompany?.id || null;
  } catch (error) {
    console.error('Error in findOrCreateCompany:', error);
    return null;
  }
}

/**
 * Find or create a company and return the full company object
 * @param companyName - The company name to find or create
 * @param additionalData - Optional additional company data to merge when creating
 * @param supabaseClient - Optional Supabase client (for server-side usage)
 * @returns The company object if found or created, null if error
 */
export async function findOrCreateCompanyFull(
  companyName: string,
  additionalData?: Partial<CompanyInsertData>,
  supabaseClient?: SupabaseClient<Database>
): Promise<Company | null> {
  if (!companyName || companyName.trim() === '') {
    return null;
  }

  const client = supabaseClient || supabase;

  try {
    const formattedName = toTitleCase(companyName.trim());

    // Try to find existing company
    const { data: existing, error: findError } = await client
      .from('companies')
      .select('*')
      .ilike('name', formattedName)
      .limit(1)
      .maybeSingle();

    if (findError && findError.code !== 'PGRST116') {
      console.error('Error finding company:', findError);
      return null;
    }

    // If company exists, return it
    if (existing) {
      return existing;
    }

    // Company doesn't exist, create it
    const companyData: CompanyInsertData = {
      name: formattedName,
      ...additionalData,
    };

    const formattedData = formatCompanyTextFields({
      name: companyData.name,
      head_office: companyData.head_office,
      industry: companyData.industry,
    });

    const { data: newCompany, error: createError } = await client
      .from('companies')
      .insert({
        ...companyData,
        ...formattedData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (createError) {
      // Handle race condition
      if (createError.code === '23505') {
        const { data: raceConditionCompany } = await client
          .from('companies')
          .select('*')
          .ilike('name', formattedName)
          .limit(1)
          .maybeSingle();

        if (raceConditionCompany) {
          return raceConditionCompany;
        }
      }

      console.error('Error creating company:', createError);
      return null;
    }

    return newCompany || null;
  } catch (error) {
    console.error('Error in findOrCreateCompanyFull:', error);
    return null;
  }
}

/**
 * Check if a company exists by name (case-insensitive)
 * @param companyName - The company name to check
 * @param supabaseClient - Optional Supabase client (for server-side usage)
 * @returns true if company exists, false otherwise
 */
export async function companyExists(
  companyName: string,
  supabaseClient?: SupabaseClient<Database>
): Promise<boolean> {
  if (!companyName || companyName.trim() === '') {
    return false;
  }

  const client = supabaseClient || supabase;

  try {
    const formattedName = toTitleCase(companyName.trim());

    const { data, error } = await client
      .from('companies')
      .select('id')
      .ilike('name', formattedName)
      .limit(1)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking company existence:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Error in companyExists:', error);
    return false;
  }
}
