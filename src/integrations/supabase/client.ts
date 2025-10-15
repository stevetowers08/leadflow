import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import {
  validateEnvironment,
  logEnvironmentStatus,
} from '@/utils/environmentValidation';

// Defer validation to prevent initialization issues
// Validation will happen when client is first accessed

// Environment variables for Supabase configuration (CLIENT-SIDE ONLY)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
// Note: Service role key should NOT be exposed to client-side

// Lazy initialization to prevent module loading issues
let _supabaseClient: any = null;

function getSupabaseClient() {
  if (_supabaseClient) return _supabaseClient;

  try {
    // Validate environment on first access
    const envConfig = validateEnvironment();
    if (!envConfig.isValid) {
      console.error('❌ Supabase configuration validation failed:');
      envConfig.errors.forEach(error => console.error(`  - ${error}`));
    }

    if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
      throw new Error('Missing Supabase environment variables');
    }

    _supabaseClient = createClient<Database>(
      SUPABASE_URL,
      SUPABASE_PUBLISHABLE_KEY,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
        global: {
          headers: {
            apikey: SUPABASE_PUBLISHABLE_KEY,
          },
        },
      }
    );

    console.log('✅ Supabase client created successfully');

    // Test connection (async, non-blocking)
    setTimeout(() => {
      _supabaseClient
        .from('companies')
        .select('count', { count: 'exact', head: true })
        .then(({ count, error }) => {
          if (error) {
            console.error('❌ Supabase connection test failed:', error);
          } else {
            console.log(
              '✅ Supabase connected successfully. Companies count:',
              count
            );
          }
        })
        .catch(err => {
          console.error('❌ Supabase connection error:', err);
        });
    }, 100);

    return _supabaseClient;
  } catch (error) {
    console.error('❌ Failed to create Supabase client:', error);

    // Create a mock client to prevent app crash
    _supabaseClient = {
      from: () => ({
        select: () => Promise.resolve({ data: [], error: null }),
        insert: () => Promise.resolve({ data: [], error: null }),
        update: () => Promise.resolve({ data: [], error: null }),
        delete: () => Promise.resolve({ data: [], error: null }),
      }),
      auth: {
        signIn: () => Promise.resolve({ data: null, error: null }),
        signOut: () => Promise.resolve({ error: null }),
        getUser: () => Promise.resolve({ data: null, error: null }),
        getSession: () =>
          Promise.resolve({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({
          data: { subscription: { unsubscribe: () => {} } },
        }),
      },
    };
    return _supabaseClient;
  }
}

// Export a getter function instead of direct client to prevent initialization issues
export const supabase = new Proxy({} as any, {
  get(target, prop) {
    const client = getSupabaseClient();
    return client[prop];
  },
});

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";
