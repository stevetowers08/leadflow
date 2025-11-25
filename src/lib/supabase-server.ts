/**
 * Server-side Supabase client helper for API routes
 * Best practice: Centralized, typed client creation
 *
 * This helper reuses the generated Database type so every server-side
 * call stays fully typed and consistent with the live schema.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

/**
 * Creates a Supabase client for server-side API routes
 * Uses service role key for admin operations
 * 
 * @returns Typed Supabase client
 */
export function createServerSupabaseClient(): SupabaseClient<Database> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      'Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required'
    );
  }

  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

