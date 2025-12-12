import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type PersonInsertData = Tables<'people'>['Insert'];

/**
 * Handles people insertion with automatic duplicate resolution
 * If a LinkedIn URL or email already exists, it will create unique versions
 */
export const insertPersonWithDuplicateHandling = async (personData: PersonInsertData) => {
  try {
    // First attempt: try to insert as-is
    const { data, error } = await supabase
      .from('people')
      .insert(personData)
      .select();

    if (!error) {
      console.log('Person inserted successfully:', data);
      return data;
    }

    // Handle duplicate key errors
    if (error.code === '23505') {
      if (error.message.includes('linkedin_url_key')) {
        console.log(
          'Duplicate LinkedIn URL detected, creating unique version...'
        );

        // Generate a unique LinkedIn URL by adding a timestamp suffix
        const originalLinkedInUrl = personData.linkedin_url;
        const timestamp = Date.now();
        const uniqueLinkedInUrl = `${originalLinkedInUrl}_${timestamp}`;

        // Try inserting with the unique LinkedIn URL
        const { data: uniqueData, error: uniqueError } = await supabase
          .from('people')
          .insert({
            ...personData,
            linkedin_url: uniqueLinkedInUrl,
          })
          .select();

        if (uniqueError) {
          console.error(
            'Failed to insert person even with unique LinkedIn URL:',
            uniqueError
          );
          throw uniqueError;
        }

        console.log('Person inserted with unique LinkedIn URL:', uniqueData);
        return uniqueData;
      }

      if (error.message.includes('email_address_key')) {
        console.log(
          'Duplicate email address detected, creating unique version...'
        );

        // Generate a unique email by adding a timestamp suffix
        const originalEmail = personData.email_address;
        const timestamp = Date.now();
        const [localPart, domain] = originalEmail.split('@');
        const uniqueEmail = `${localPart}_${timestamp}@${domain}`;

        // Try inserting with the unique email
        const { data: uniqueData, error: uniqueError } = await supabase
          .from('people')
          .insert({
            ...personData,
            email_address: uniqueEmail,
          })
          .select();

        if (uniqueError) {
          console.error(
            'Failed to insert person even with unique email:',
            uniqueError
          );
          throw uniqueError;
        }

        console.log('Person inserted with unique email:', uniqueData);
        return uniqueData;
      }
    }

    // If it's not a duplicate key error, throw it
    throw error;
  } catch (error) {
    console.error('Failed to insert person:', error);
    throw error;
  }
};

/**
 * Alternative approach: Use upsert with conflict resolution
 * This will update existing people instead of creating duplicates
 */
export const upsertPerson = async (personData: PersonInsertData) => {
  try {
    const { data, error } = await supabase
      .from('people')
      .upsert(
        {
          ...personData,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'linkedin_url,email_address', // Handle conflicts on both fields
          ignoreDuplicates: false,
        }
      )
      .select();

    if (error) {
      console.error('Error upserting person:', error);
      throw error;
    }

    console.log('Person upserted successfully:', data);
    return data;
  } catch (error) {
    console.error('Failed to upsert person:', error);
    throw error;
  }
};

/**
 * Check if a LinkedIn URL already exists
 */
export const checkLinkedInUrlExists = async (linkedinUrl: string) => {
  try {
    const { data, error } = await supabase
      .from('people')
      .select('id, linkedin_url')
      .eq('linkedin_url', linkedinUrl)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no rows returned
      throw error;
    }

    return !!data; // Returns true if person exists, false if not
  } catch (error) {
    console.error('Error checking if LinkedIn URL exists:', error);
    throw error;
  }
};

/**
 * Check if an email address already exists
 */
export const checkEmailExists = async (email: string) => {
  try {
    const { data, error } = await supabase
      .from('people')
      .select('id, email_address')
      .eq('email_address', email)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no rows returned
      throw error;
    }

    return !!data; // Returns true if person exists, false if not
  } catch (error) {
    console.error('Error checking if email exists:', error);
    throw error;
  }
};

/**
 * Generate a unique LinkedIn URL by checking for conflicts
 */
export const generateUniqueLinkedInUrl = async (
  originalLinkedInUrl: string
): Promise<string> => {
  let uniqueUrl = originalLinkedInUrl;
  let counter = 1;

  while (await checkLinkedInUrlExists(uniqueUrl)) {
    uniqueUrl = `${originalLinkedInUrl}_${counter}`;
    counter++;
  }

  return uniqueUrl;
};

/**
 * Generate a unique email address by checking for conflicts
 */
export const generateUniqueEmail = async (
  originalEmail: string
): Promise<string> => {
  let uniqueEmail = originalEmail;
  let counter = 1;

  while (await checkEmailExists(uniqueEmail)) {
    const [localPart, domain] = originalEmail.split('@');
    uniqueEmail = `${localPart}_${counter}@${domain}`;
    counter++;
  }

  return uniqueEmail;
};

/**
 * Handle both LinkedIn URL and email duplicates in one function
 */
export const insertPersonWithAllDuplicateHandling = async (personData: PersonInsertData) => {
  try {
    // Check for existing LinkedIn URL and email
    const linkedinExists = personData.linkedin_url
      ? await checkLinkedInUrlExists(personData.linkedin_url)
      : false;
    const emailExists = personData.email_address
      ? await checkEmailExists(personData.email_address)
      : false;

    let processedData = { ...personData };

    // Handle LinkedIn URL duplicate
    if (linkedinExists && personData.linkedin_url) {
      processedData.linkedin_url = await generateUniqueLinkedInUrl(
        personData.linkedin_url
      );
      console.log(
        `LinkedIn URL conflict resolved: ${personData.linkedin_url} -> ${processedData.linkedin_url}`
      );
    }

    // Handle email duplicate
    if (emailExists && personData.email_address) {
      processedData.email_address = await generateUniqueEmail(
        personData.email_address
      );
      console.log(
        `Email conflict resolved: ${personData.email_address} -> ${processedData.email_address}`
      );
    }

    // Insert with processed data
    const { data, error } = await supabase
      .from('people')
      .insert(processedData)
      .select();

    if (error) {
      console.error(
        'Failed to insert person after conflict resolution:',
        error
      );
      throw error;
    }

    console.log('Person inserted successfully with conflict resolution:', data);
    return data;
  } catch (error) {
    console.error('Failed to insert person with conflict resolution:', error);
    throw error;
  }
};
