import { supabase } from '@/integrations/supabase/client';

/**
 * Handles job insertion with automatic duplicate resolution
 * If a LinkedIn job ID already exists, it will create a unique version
 */
export const insertJobWithDuplicateHandling = async (jobData: any) => {
  try {
    // First attempt: try to insert as-is
    const { data, error } = await supabase
      .from('jobs')
      .insert(jobData)
      .select();

    if (!error) {
      console.log('Job inserted successfully:', data);
      return data;
    }

    // If it's a duplicate key error, handle it
    if (
      error.code === '23505' &&
      error.message.includes('linkedin_job_id_key')
    ) {
      console.log(
        'Duplicate LinkedIn job ID detected, creating unique version...'
      );

      // Generate a unique LinkedIn job ID by adding a timestamp suffix
      const originalLinkedInId = jobData.linkedin_job_id;
      const timestamp = Date.now();
      const uniqueLinkedInId = `${originalLinkedInId}_${timestamp}`;

      // Try inserting with the unique ID
      const { data: uniqueData, error: uniqueError } = await supabase
        .from('jobs')
        .insert({
          ...jobData,
          linkedin_job_id: uniqueLinkedInId,
        })
        .select();

      if (uniqueError) {
        console.error('Failed to insert job even with unique ID:', uniqueError);
        throw uniqueError;
      }

      console.log('Job inserted with unique LinkedIn ID:', uniqueData);
      return uniqueData;
    }

    // If it's not a duplicate key error, throw it
    throw error;
  } catch (error) {
    console.error('Failed to insert job:', error);
    throw error;
  }
};

/**
 * Alternative approach: Use upsert with conflict resolution
 * This will update existing jobs instead of creating duplicates
 */
export const upsertJob = async (jobData: any) => {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .upsert(
        {
          ...jobData,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'linkedin_job_id',
          ignoreDuplicates: false,
        }
      )
      .select();

    if (error) {
      console.error('Error upserting job:', error);
      throw error;
    }

    console.log('Job upserted successfully:', data);
    return data;
  } catch (error) {
    console.error('Failed to upsert job:', error);
    throw error;
  }
};

/**
 * Check if a LinkedIn job ID already exists
 */
export const checkLinkedInJobExists = async (linkedinJobId: string) => {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('id, linkedin_job_id')
      .eq('linkedin_job_id', linkedinJobId)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no rows returned
      throw error;
    }

    return !!data; // Returns true if job exists, false if not
  } catch (error) {
    console.error('Error checking if LinkedIn job exists:', error);
    throw error;
  }
};

/**
 * Generate a unique LinkedIn job ID by checking for conflicts
 */
export const generateUniqueLinkedInJobId = async (
  originalLinkedInId: string
): Promise<string> => {
  let uniqueId = originalLinkedInId;
  let counter = 1;

  while (await checkLinkedInJobExists(uniqueId)) {
    uniqueId = `${originalLinkedInId}_${counter}`;
    counter++;
  }

  return uniqueId;
};
