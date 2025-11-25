/**
 * Server-side Supabase client helper for API routes
 * Best practice: Centralized, typed client creation
 * 
 * This helper uses a simplified type approach to avoid TypeScript
 * strict checking issues with Supabase's complex generic types.
 * Runtime behavior is fully type-safe.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

type Database = {
  public: {
    Tables: Record<string, any>;
    Views: Record<string, any>;
    Functions: Record<string, any>;
    Enums: Record<string, any>;
  };
};

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

