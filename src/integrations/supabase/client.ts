import { validateEnvironment } from '@/utils/environmentValidation';
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Defer validation to prevent initialization issues
// Validation will happen when client is first accessed

// Environment variables for Supabase configuration (CLIENT-SIDE ONLY)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
// Note: Service role key should NOT be exposed to client-side

// Development configuration
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

type SupabaseBrowserClient = ReturnType<typeof createClient<Database>>;

// Lazy initialization to prevent module loading issues
let _supabaseClient: SupabaseBrowserClient | null = null;

function getSupabaseClient() {
  if (_supabaseClient) return _supabaseClient;

  try {
    // Skip validation during SSR
    if (typeof window === 'undefined') {
      // Server-side: create client without validation
      if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
        // During SSR, return a mock client instead of throwing
        // This prevents the app from crashing during build/SSR
        if (IS_DEVELOPMENT) {
          console.warn(
            '⚠️ Missing Supabase environment variables during SSR. Using mock client.'
          );
        }
        // Return mock client for SSR when env vars are missing
        const createChainableQuery = () => {
          const query = {
            select: () => query,
            insert: () => query,
            update: () => query,
            delete: () => query,
            eq: () => query,
            or: () => query,
            neq: () => query,
            gt: () => query,
            lt: () => query,
            gte: () => query,
            lte: () => query,
            like: () => query,
            ilike: () => query,
            is: () => query,
            in: () => query,
            contains: () => query,
            order: () => query,
            limit: () => query,
            range: () => query,
            single: () => Promise.resolve({ data: null, error: null }),
            maybeSingle: () => Promise.resolve({ data: null, error: null }),
            then: (onResolve: any) => Promise.resolve({ data: [], error: null }).then(onResolve),
            catch: (onReject: any) => Promise.resolve({ data: [], error: null }).catch(onReject),
          };
          return query;
        };
        
        _supabaseClient = {
          from: () => createChainableQuery(),
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
        } as SupabaseBrowserClient;
        return _supabaseClient;
      }

      _supabaseClient = createClient<Database>(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY,
        {
          auth: {
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false,
          },
          global: {
            headers: {
              apikey: SUPABASE_PUBLISHABLE_KEY,
            },
          },
        }
      );
      return _supabaseClient;
    }

    // Client-side: validate environment on first access
    // Only validate if environment variables exist (they might be set via .env.local)
    const envConfig = validateEnvironment();
    if (!envConfig.isValid && envConfig.errors.length > 0) {
      // Only log errors if variables are actually missing, not just invalid format
      const criticalErrors = envConfig.errors.filter(
        e => e.includes('is required')
      );
      if (criticalErrors.length > 0 && IS_DEVELOPMENT) {
        console.error('❌ Supabase configuration validation failed:');
        criticalErrors.forEach(error => console.error(`  - ${error}`));
        console.warn(
          '⚠️ Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in your .env.local file'
        );
      }
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

    // Supabase client created successfully

    // Test connection (async, non-blocking) - only on client
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        _supabaseClient
          ?.from('companies')
          .select('count', { count: 'exact', head: true })
          .then(({ count, error }) => {
            if (error && IS_DEVELOPMENT) {
              console.error('❌ Supabase connection test failed:', error);
            }
          })
          .catch(err => {
            if (IS_DEVELOPMENT) {
              console.error('❌ Supabase connection error:', err);
            }
          });
      }, 100);
    }

    return _supabaseClient;
  } catch (error) {
    if (IS_DEVELOPMENT) {
      console.error('❌ Failed to create Supabase client:', error);
    }

    // Create a mock client to prevent app crash
    const createChainableQuery = () => {
      const query = {
        select: () => query,
        insert: () => query,
        update: () => query,
        delete: () => query,
        eq: () => query,
        or: () => query,
        neq: () => query,
        gt: () => query,
        lt: () => query,
        gte: () => query,
        lte: () => query,
        like: () => query,
        ilike: () => query,
        is: () => query,
        in: () => query,
        contains: () => query,
        order: () => query,
        limit: () => query,
        range: () => query,
        single: () => Promise.resolve({ data: null, error: null }),
        maybeSingle: () => Promise.resolve({ data: null, error: null }),
        then: (onResolve: any) => Promise.resolve({ data: [], error: null }).then(onResolve),
        catch: (onReject: any) => Promise.resolve({ data: [], error: null }).catch(onReject),
      };
      return query;
    };
    
    _supabaseClient = {
      from: () => createChainableQuery(),
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
    } as SupabaseBrowserClient;
    return _supabaseClient;
  }
}

// Export a getter function instead of direct client to prevent initialization issues
export const supabase = new Proxy(
  {} as SupabaseBrowserClient,
  {
    get(target, prop) {
      const client = getSupabaseClient();
      return client[prop];
    },
  }
);

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";
