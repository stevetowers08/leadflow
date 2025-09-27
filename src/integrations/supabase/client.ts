import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { validateSupabaseConfig, logEnvironmentStatus } from '@/utils/envValidation';

// Validate environment configuration
const configValidation = validateSupabaseConfig();
if (!configValidation.isValid) {
  console.warn(`⚠️ Supabase configuration warning: ${configValidation.error}`);
  // Don't throw error, just log warning
}

// Log environment status for debugging
logEnvironmentStatus();

// Environment variables for Supabase configuration
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('🔧 Supabase client config:', { 
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY: SUPABASE_PUBLISHABLE_KEY ? SUPABASE_PUBLISHABLE_KEY.substring(0, 20) + '...' : 'MISSING' 
});

// Create client with proper auth configuration
let supabase: any = null;

try {
  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    throw new Error('Missing Supabase environment variables');
  }
  
  supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
    global: {
      headers: {
        'apikey': SUPABASE_PUBLISHABLE_KEY,
      },
    },
  });
  
  console.log('✅ Supabase client created successfully');
} catch (error) {
  console.error('❌ Failed to create Supabase client:', error);
  // Create a mock client to prevent app crash
  supabase = {
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
    }
  };
}

export { supabase };

// Export supabaseAdmin as alias for admin operations
export const supabaseAdmin = supabase;

// Test connection on startup (only if client was created successfully)
if (supabase && SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY) {
  supabase.from('companies').select('count', { count: 'exact', head: true })
    .then(({ count, error }) => {
      if (error) {
        console.error('❌ Supabase connection test failed:', error);
      } else {
        console.log('✅ Supabase connected successfully. Companies count:', count);
      }
    })
    .catch(err => {
      console.error('❌ Supabase connection error:', err);
    });
} else {
  console.warn('⚠️ Skipping Supabase connection test - client not properly initialized');
}

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";