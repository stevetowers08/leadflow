import { NextRequest, NextResponse } from 'next/server';
import { APIErrorHandler } from '@/lib/api-error-handler';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import type { Database } from '@/integrations/supabase/types';

type ServerSupabaseClient = ReturnType<typeof createServerSupabaseClient>;

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
  owner_id?: string;
  [key: string]: unknown;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

// Handle CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
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
 * Insert person with duplicate handling
 */
async function insertPersonWithDuplicateHandling(
  supabase: ServerSupabaseClient,
  personData: PersonData
) {
  try {
    // First attempt: try to insert as-is
    const insertData: Database['public']['Tables']['people']['Insert'] = {
      ...personData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('people')
      .insert(insertData)
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
          personData.linkedin_url as string
        );

        // Try inserting with the unique LinkedIn URL
        const uniqueInsertData: Database['public']['Tables']['people']['Insert'] = {
          ...personData,
          linkedin_url: uniqueLinkedInUrl,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        const { data: uniqueData, error: uniqueError } = await supabase
          .from('people')
          .insert(uniqueInsertData)
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
        const uniqueEmail = generateUniqueEmail(
          personData.email_address as string
        );

        // Try inserting with the unique email
        const uniqueEmailInsertData: Database['public']['Tables']['people']['Insert'] = {
          ...personData,
          email_address: uniqueEmail,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        const { data: uniqueData, error: uniqueError } = await supabase
          .from('people')
          .insert(uniqueEmailInsertData)
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
async function upsertPerson(
  supabase: ServerSupabaseClient,
  personData: PersonData
) {
  try {
    const upsertData: Database['public']['Tables']['people']['Insert'] = {
      ...personData,
      updated_at: new Date().toISOString(),
    };
    const { data, error } = await supabase
      .from('people')
      .upsert(upsertData, {
        onConflict: 'linkedin_url,email_address',
        ignoreDuplicates: false,
      })
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

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();

    // Parse request body
    const personData: PersonData = await request.json();

    // Validate required fields
    if (!personData.name) {
      return APIErrorHandler.handleError(
        new Error('Missing required field: name'),
        'add-person'
      );
    }

    // Get the method from query params or default to 'duplicate_handling'
    const { searchParams } = new URL(request.url);
    const method = searchParams.get('method') || 'duplicate_handling';

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

    const headers = new Headers(corsHeaders);
    headers.set('Content-Type', 'application/json');

    return NextResponse.json(
      {
        message: 'Person added successfully',
        ...result,
      },
      {
        status: 201,
        headers,
      }
    );
  } catch (error: unknown) {
    console.error('Error in add-person function:', error);

    // Handle specific error types
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      error.code === '23505'
    ) {
      const errorResponse = APIErrorHandler.handleError(
        new Error('Duplicate key constraint violation'),
        'add-person'
      );
      const headers = new Headers(errorResponse.headers);
      Object.entries(corsHeaders).forEach(([key, value]) => {
        headers.set(key, value);
      });
      return new NextResponse(
        JSON.stringify({
          error: 'Duplicate key constraint violation',
          code: error.code,
          details: 'details' in error ? error.details : undefined,
          message:
            'message' in error ? String(error.message) : 'Duplicate entry',
          hint: 'Try using method=upsert to update existing records instead of creating duplicates',
        }),
        {
          status: 409,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const errorResponse = APIErrorHandler.handleError(error, 'add-person');
    const headers = new Headers(errorResponse.headers);
    Object.entries(corsHeaders).forEach(([key, value]) => {
      headers.set(key, value);
    });
    return new NextResponse(errorResponse.body, {
      status: errorResponse.status,
      headers,
    });
  }
}
