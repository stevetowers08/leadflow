import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';
import { findOrCreateCompanyFull } from '@/services/companiesService';

type CompanyInsertData = Tables<'companies'>['Insert'];

/**
 * Handles company insertion
 * Uses centralized findOrCreateCompany service to prevent duplicates
 *
 * @deprecated Consider using findOrCreateCompany or findOrCreateCompanyFull from @/services/companiesService directly
 * Best Practice: Always include proper validation and error handling
 */
export const insertCompany = async (companyData: CompanyInsertData) => {
  try {
    // Validate required fields
    if (!companyData.name) {
      throw new Error('Company name is required');
    }

    // Use centralized service to prevent duplicates
    const company = await findOrCreateCompanyFull(
      companyData.name,
      companyData
    );

    if (!company) {
      throw new Error('Failed to create or find company');
    }

    // If company already existed, update it with any new data
    if (company.id) {
      const updateData: Partial<CompanyInsertData> = { ...companyData };
      delete updateData.name; // Don't update name

      // Only update if there's data to update
      if (Object.keys(updateData).length > 0) {
        const { data: updated, error: updateError } = await supabase
          .from('companies')
          .update(updateData)
          .eq('id', company.id)
          .select();

        if (updateError) {
          console.error('Failed to update company:', updateError);
          // Don't throw - company was found/created successfully
        } else if (updated && updated.length > 0) {
          return updated;
        }
      }
    }

    return [company];
  } catch (error) {
    console.error('Failed to insert company:', error);
    throw error;
  }
};

/**
 * Handles company insertion with automatic duplicate resolution
 * If a company name already exists, it will create a unique version
 */
export const insertCompanyWithDuplicateHandling = async (
  companyData: CompanyInsertData
) => {
  try {
    // First attempt: try to insert as-is
    const { data, error } = await supabase
      .from('companies')
      .insert(companyData)
      .select();

    if (!error) {
      console.log('Company inserted successfully:', data);
      return data;
    }

    // If it's a duplicate key error, handle it
    if (error.code === '23505' && error.message.includes('name')) {
      console.log(
        'Duplicate company name detected, creating unique version...'
      );

      // Generate a unique company name by adding a timestamp suffix
      const originalName = companyData.name;
      const timestamp = Date.now();
      const uniqueName = `${originalName} (${timestamp})`;

      // Format text fields to Title Case
      const formattedData = formatCompanyTextFields({
        name: uniqueName,
        head_office: companyData.head_office,
        industry: companyData.industry,
      });

      // Try inserting with the unique name
      const { data: uniqueData, error: uniqueError } = await supabase
        .from('companies')
        .insert({
          ...companyData,
          ...formattedData,
        })
        .select();

      if (uniqueError) {
        console.error(
          'Failed to insert company even with unique name:',
          uniqueError
        );
        throw uniqueError;
      }

      console.log('Company inserted with unique name:', uniqueData);
      return uniqueData;
    }

    // If it's not a duplicate key error, throw it
    throw error;
  } catch (error) {
    console.error('Failed to insert company with duplicate handling:', error);
    throw error;
  }
};

/**
 * Alternative approach: Use upsert with conflict resolution
 * This will update existing companies instead of creating duplicates
 */
export const upsertCompany = async (companyData: CompanyInsertData) => {
  try {
    // Get the current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error('User must be authenticated to create companies');
    }

    // Format text fields to Title Case
    const formattedData = formatCompanyTextFields({
      name: companyData.name,
      head_office: companyData.head_office,
      industry: companyData.industry,
    });

    // Set updated_at
    const companyDataWithTimestamp = {
      ...companyData,
      ...formattedData,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('companies')
      .upsert(companyDataWithTimestamp, {
        onConflict: 'name', // Handle conflicts on name
        ignoreDuplicates: false,
      })
      .select();

    if (error) {
      console.error('Error upserting company:', error);
      throw error;
    }

    console.log('Company upserted successfully:', data);
    return data;
  } catch (error) {
    console.error('Failed to upsert company:', error);
    throw error;
  }
};

/**
 * Check if a company name already exists for the current user
 */
export const checkCompanyNameExists = async (companyName: string) => {
  try {
    // Get the current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error('User must be authenticated to check company names');
    }

    const { data, error } = await supabase
      .from('companies')
      .select('id, name')
      .eq('name', companyName)
      // owner_id removed - check by name only
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no rows returned
      throw error;
    }

    return !!data; // Returns true if company exists, false if not
  } catch (error) {
    console.error('Error checking if company name exists:', error);
    throw error;
  }
};

/**
 * Generate a unique company name by checking for conflicts
 */
export const generateUniqueCompanyName = async (
  originalName: string
): Promise<string> => {
  let uniqueName = originalName;
  let counter = 1;

  while (await checkCompanyNameExists(uniqueName)) {
    uniqueName = `${originalName} (${counter})`;
    counter++;
  }

  return uniqueName;
};

/**
 * Handle both name and owner duplicates in one function
 */
export const insertCompanyWithAllDuplicateHandling = async (
  companyData: CompanyInsertData
) => {
  try {
    // Get the current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error('User must be authenticated to create companies');
    }

    // Check for existing company name
    const nameExists = await checkCompanyNameExists(companyData.name);

    const processedData = {
      ...companyData,
      // owner_id removed
    };

    // Handle name duplicate
    if (nameExists) {
      processedData.name = await generateUniqueCompanyName(companyData.name);
      console.log(
        `Company name conflict resolved: ${companyData.name} -> ${processedData.name}`
      );
    }

    // Format text fields to Title Case
    const formattedData = formatCompanyTextFields({
      name: processedData.name,
      head_office: processedData.head_office,
      industry: processedData.industry,
    });

    // Insert with processed data
    const { data, error } = await supabase
      .from('companies')
      .insert({
        ...processedData,
        ...formattedData,
      })
      .select();

    if (error) {
      console.error(
        'Failed to insert company after conflict resolution:',
        error
      );
      throw error;
    }

    console.log(
      'Company inserted successfully with conflict resolution:',
      data
    );
    return data;
  } catch (error) {
    console.error('Failed to insert company with conflict resolution:', error);
    throw error;
  }
};
