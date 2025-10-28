import { supabase } from '@/integrations/supabase/client';

/**
 * Handles company insertion with optional owner_id assignment
 * If no owner_id is provided, it will be set to null (unassigned)
 *
 * Best Practice: Always include proper validation and error handling
 */
export const insertCompanyWithOwner = async (companyData: any) => {
  try {
    // Validate required fields
    if (!companyData.name) {
      throw new Error('Company name is required');
    }

    // Get the current user (optional)
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    // Prepare company data - owner_id is optional
    const companyDataWithOwner = {
      ...companyData,
      // Only set owner_id if user is authenticated and not already provided
      owner_id: companyData.owner_id || user?.id || null,
    };

    // Insert the company
    const { data, error } = await supabase
      .from('companies')
      .insert(companyDataWithOwner)
      .select();

    if (error) {
      console.error('Failed to insert company:', error);
      throw error;
    }

    console.log('Company inserted successfully:', data);
    return data;
  } catch (error) {
    console.error('Failed to insert company with owner:', error);
    throw error;
  }
};

/**
 * Handles company insertion with automatic duplicate resolution
 * If a company name already exists, it will create a unique version
 */
export const insertCompanyWithDuplicateHandling = async (companyData: any) => {
  try {
    // Get the current user (optional)
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    // Prepare company data - owner_id is optional
    const companyDataWithOwner = {
      ...companyData,
      owner_id: companyData.owner_id || user?.id || null,
    };

    // First attempt: try to insert as-is
    const { data, error } = await supabase
      .from('companies')
      .insert(companyDataWithOwner)
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

      // Try inserting with the unique name
      const { data: uniqueData, error: uniqueError } = await supabase
        .from('companies')
        .insert({
          ...companyDataWithOwner,
          name: uniqueName,
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
export const upsertCompany = async (companyData: any) => {
  try {
    // Get the current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error('User must be authenticated to create companies');
    }

    // Ensure owner_id is set to current user
    const companyDataWithOwner = {
      ...companyData,
      owner_id: user.id,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('companies')
      .upsert(companyDataWithOwner, {
        onConflict: 'name,owner_id', // Handle conflicts on both fields
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
      .eq('owner_id', user.id)
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
  companyData: any
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

    let processedData = {
      ...companyData,
      owner_id: user.id,
    };

    // Handle name duplicate
    if (nameExists) {
      processedData.name = await generateUniqueCompanyName(companyData.name);
      console.log(
        `Company name conflict resolved: ${companyData.name} -> ${processedData.name}`
      );
    }

    // Insert with processed data
    const { data, error } = await supabase
      .from('companies')
      .insert(processedData)
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
