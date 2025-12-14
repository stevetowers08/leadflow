import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

interface PersonData {
  name: string;
  company_id?: string;
  email_address?: string;
  linkedin_url?: string;
  employee_location?: string;
  company_role?: string;
  lead_score?: string;
  stage?: string;
  confidence_level?: string;
  lead_source?: string;
  // owner_id removed
  [key: string]: any;
}

/**
 * Generate a unique LinkedIn URL by adding a timestamp suffix
 */
function generateUniqueLinkedInUrl(originalUrl: string): string {
  const timestamp = Date.now();
  return `${originalUrl}_${timestamp}`;
}

/**
 * Generate a unique email by adding a timestamp suffix
 */
function generateUniqueEmail(originalEmail: string): string {
  const timestamp = Date.now();
  const [localPart, domain] = originalEmail.split('@');
  return `${localPart}_${timestamp}@${domain}`;
}

/**
 * Check if a LinkedIn URL already exists
 */
async function checkLinkedInUrlExists(
  supabase: any,
  linkedinUrl: string
): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('people')
      .select('id')
      .eq('linkedin_url', linkedinUrl)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no rows returned
      throw error;
    }

    return !!data;
  } catch (error) {
    console.error('Error checking if LinkedIn URL exists:', error);
    return false;
  }
}

/**
 * Check if an email address already exists
 */
async function checkEmailExists(
  supabase: any,
  email: string
): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('people')
      .select('id')
      .eq('email_address', email)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no rows returned
      throw error;
    }

    return !!data;
  } catch (error) {
    console.error('Error checking if email exists:', error);
    return false;
  }
}

/**
 * Insert person with duplicate handling
 */
async function insertPersonWithDuplicateHandling(
  supabase: any,
  personData: PersonData
) {
  try {
    // First attempt: try to insert as-is
    const { data, error } = await supabase
      .from('people')
      .insert({
        ...personData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select();

    if (!error) {
      console.log('Person inserted successfully:', data);
      return { success: true, data, method: 'direct_insert' };
    }

    // Handle duplicate key errors
    if (error.code === '23505') {
      if (error.message.includes('linkedin_url_key')) {
        console.log(
          'Duplicate LinkedIn URL detected, creating unique version...'
        );

        // Generate a unique LinkedIn URL
        const uniqueLinkedInUrl = generateUniqueLinkedInUrl(
          personData.linkedin_url!
        );

        // Try inserting with the unique LinkedIn URL
        const { data: uniqueData, error: uniqueError } = await supabase
          .from('people')
          .insert({
            ...personData,
            linkedin_url: uniqueLinkedInUrl,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
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
        return {
          success: true,
          data: uniqueData,
          method: 'unique_linkedin_url',
          originalLinkedInUrl: personData.linkedin_url,
          uniqueLinkedInUrl,
        };
      }

      if (error.message.includes('email_address_key')) {
        console.log(
          'Duplicate email address detected, creating unique version...'
        );

        // Generate a unique email
        const uniqueEmail = generateUniqueEmail(personData.email_address!);

        // Try inserting with the unique email
        const { data: uniqueData, error: uniqueError } = await supabase
          .from('people')
          .insert({
            ...personData,
            email_address: uniqueEmail,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
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
        return {
          success: true,
          data: uniqueData,
          method: 'unique_email',
          originalEmail: personData.email_address,
          uniqueEmail,
        };
      }
    }

    // If it's not a duplicate key error, throw it
    throw error;
  } catch (error) {
    console.error('Failed to insert person:', error);
    throw error;
  }
}

/**
 * Alternative approach: Use upsert with conflict resolution
 */
async function upsertPerson(supabase: any, personData: PersonData) {
  try {
    const { data, error } = await supabase
      .from('people')
      .upsert(
        {
          ...personData,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'linkedin_url,email_address',
          ignoreDuplicates: false,
        }
      )
      .select();

    if (error) {
      console.error('Error upserting person:', error);
      throw error;
    }

    console.log('Person upserted successfully:', data);
    return { success: true, data, method: 'upsert' };
  } catch (error) {
    console.error('Failed to upsert person:', error);
    throw error;
  }
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse request body
    const personData: PersonData = await req.json();

    // Validate required fields
    if (!personData.name) {
      return new Response(
        JSON.stringify({
          error: 'Missing required field: name',
          code: 'VALIDATION_ERROR',
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Get the method from query params or default to 'duplicate_handling'
    const url = new URL(req.url);
    const method = url.searchParams.get('method') || 'duplicate_handling';

    let result;

    switch (method) {
      case 'upsert':
        result = await upsertPerson(supabase, personData);
        break;
      case 'duplicate_handling':
      default:
        result = await insertPersonWithDuplicateHandling(supabase, personData);
        break;
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Person added successfully',
        ...result,
      }),
      {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error in add-person function:', error);

    // Handle specific error types
    if (error.code === '23505') {
      return new Response(
        JSON.stringify({
          error: 'Duplicate key constraint violation',
          code: error.code,
          details: error.details,
          message: error.message,
          hint: 'Try using method=upsert to update existing records instead of creating duplicates',
        }),
        {
          status: 409,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
        message: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
