import { validateEnvironment } from '@/utils/environmentValidation';
import { createBrowserClient } from '@supabase/ssr';
import type { Database } from './types';

// Defer validation to prevent initialization issues
// Validation will happen when client is first accessed

// Environment variables for Supabase configuration (CLIENT-SIDE ONLY)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
// Note: Service role key should NOT be exposed to client-side

// Development configuration
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

type SupabaseBrowserClient = ReturnType<typeof createBrowserClient<Database>>;

// Lazy initialization to prevent module loading issues
let _supabaseClient: SupabaseBrowserClient | null = null;

function getSupabaseClient() {
  if (_supabaseClient) return _supabaseClient;

  try {
    // Skip validation during SSR
    if (typeof window === 'undefined') {
      // Server-side: validate with strict checks (2025 best practice)
      const isValidUrl =
        SUPABASE_URL &&
        typeof SUPABASE_URL === 'string' &&
        SUPABASE_URL.trim().length > 0;
      const isValidKey =
        SUPABASE_PUBLISHABLE_KEY &&
        typeof SUPABASE_PUBLISHABLE_KEY === 'string' &&
        SUPABASE_PUBLISHABLE_KEY.trim().length > 0;

      if (!isValidUrl || !isValidKey) {
        // During SSR, return a mock client instead of throwing
        // This prevents the app from crashing during build/SSR
        if (IS_DEVELOPMENT) {
          const missingVars: string[] = [];
          if (!isValidUrl) missingVars.push('NEXT_PUBLIC_SUPABASE_URL');
          if (!isValidKey) missingVars.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');
          console.warn(
            `⚠️ Missing Supabase environment variables during SSR: ${missingVars.join(', ')}. Using mock client.`
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
            then: (
              onResolve: (value: { data: unknown[]; error: null }) => unknown
            ) => Promise.resolve({ data: [], error: null }).then(onResolve),
            catch: (onReject: (reason?: unknown) => unknown) =>
              Promise.resolve({ data: [], error: null }).catch(onReject),
          };
          return query;
        };

        _supabaseClient = {
          from: () => createChainableQuery(),
          auth: {
            signIn: () => Promise.resolve({ data: null, error: null }),
            signOut: () => Promise.resolve({ error: null }),
            getUser: () =>
              Promise.resolve({ data: { user: null }, error: null }),
            getSession: () =>
              Promise.resolve({ data: { session: null }, error: null }),
            onAuthStateChange: () => ({
              data: { subscription: { unsubscribe: () => {} } },
            }),
          },
        } as unknown as SupabaseBrowserClient;
        return _supabaseClient;
      }

      // Use createBrowserClient from @supabase/ssr for SSR compatibility
      // This reads from cookies set by server-side exchange-code route
      // Ensure we pass valid, non-empty strings (2025 best practice)
      _supabaseClient = createBrowserClient<Database>(
        SUPABASE_URL.trim(),
        SUPABASE_PUBLISHABLE_KEY.trim()
      );
      return _supabaseClient;
    }

    // Client-side: validate environment on first access
    // Only validate if environment variables exist (they might be set via .env or .env.local)
    const envConfig = validateEnvironment();
    if (!envConfig.isValid && envConfig.errors.length > 0) {
      // Only log errors if variables are actually missing, not just invalid format
      const criticalErrors = envConfig.errors.filter(e =>
        e.includes('is required')
      );
      if (criticalErrors.length > 0 && IS_DEVELOPMENT) {
        console.error('❌ Supabase configuration validation failed:');
        criticalErrors.forEach(error => console.error(`  - ${error}`));
        console.warn(
          '⚠️ Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in your .env or .env.local file'
        );
      }
    }

    // Validate environment variables with strict checks (2025 best practice)
    // Check for both undefined and empty strings
    const isValidUrl =
      SUPABASE_URL &&
      typeof SUPABASE_URL === 'string' &&
      SUPABASE_URL.trim().length > 0;
    const isValidKey =
      SUPABASE_PUBLISHABLE_KEY &&
      typeof SUPABASE_PUBLISHABLE_KEY === 'string' &&
      SUPABASE_PUBLISHABLE_KEY.trim().length > 0;

    if (!isValidUrl || !isValidKey) {
      const missingVars: string[] = [];
      if (!isValidUrl) missingVars.push('NEXT_PUBLIC_SUPABASE_URL');
      if (!isValidKey) missingVars.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');

      const errorMessage = `Missing or invalid Supabase environment variables: ${missingVars.join(', ')}. Please set these in your .env or .env.local file.`;

      if (IS_DEVELOPMENT) {
        console.error(`❌ ${errorMessage}`);
        console.warn(
          '⚠️  Using mock client. The app will function but Supabase features will not work.'
        );
      }

      // Return mock client instead of throwing to prevent app crash
      // This follows 2025 best practices for graceful degradation
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
          single: () =>
            Promise.resolve({
              data: null,
              error: { message: errorMessage, code: 'ENV_MISSING' },
            }),
          maybeSingle: () =>
            Promise.resolve({
              data: null,
              error: { message: errorMessage, code: 'ENV_MISSING' },
            }),
          then: (
            onResolve: (value: {
              data: unknown[];
              error: { message: string; code: string };
            }) => unknown
          ) =>
            Promise.resolve({
              data: [],
              error: { message: errorMessage, code: 'ENV_MISSING' },
            }).then(onResolve),
          catch: (onReject: (reason?: unknown) => unknown) =>
            Promise.resolve({
              data: [],
              error: { message: errorMessage, code: 'ENV_MISSING' },
            }).catch(onReject),
        };
        return query;
      };

      _supabaseClient = {
        from: () => createChainableQuery(),
        auth: {
          signIn: () =>
            Promise.resolve({
              data: null,
              error: { message: errorMessage, code: 'ENV_MISSING' },
            }),
          signOut: () =>
            Promise.resolve({
              error: { message: errorMessage, code: 'ENV_MISSING' },
            }),
          getUser: () =>
            Promise.resolve({
              data: { user: null },
              error: { message: errorMessage, code: 'ENV_MISSING' },
            }),
          getSession: () =>
            Promise.resolve({
              data: { session: null },
              error: { message: errorMessage, code: 'ENV_MISSING' },
            }),
          onAuthStateChange: () => ({
            data: { subscription: { unsubscribe: () => {} } },
          }),
        },
      } as unknown as SupabaseBrowserClient;
      return _supabaseClient;
    }

    // Use createBrowserClient from @supabase/ssr for SSR compatibility
    // This reads from cookies set by server-side exchange-code route
    // createBrowserClient automatically handles:
    // - Reading sessions from cookies (set by server)
    // - PKCE flow for OAuth
    // - Session persistence and auto-refresh
    // Ensure we pass valid, non-empty strings (2025 best practice)
    _supabaseClient = createBrowserClient<Database>(
      SUPABASE_URL.trim(),
      SUPABASE_PUBLISHABLE_KEY.trim()
    );

    // Supabase client created successfully

    // Test connection (async, non-blocking) - only on client
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        Promise.resolve(
          _supabaseClient
            ?.from('companies')
            .select('count', { count: 'exact', head: true })
        )
          .then(result => {
            if (result?.error && IS_DEVELOPMENT) {
              console.error(
                '❌ Supabase connection test failed:',
                result.error
              );
            }
          })
          .catch((err: unknown) => {
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
        then: (
          onResolve: (value: { data: unknown[]; error: null }) => unknown
        ) => Promise.resolve({ data: [], error: null }).then(onResolve),
        catch: (onReject: (reason?: unknown) => unknown) =>
          Promise.resolve({ data: [], error: null }).catch(onReject),
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
    } as unknown as SupabaseBrowserClient;
    return _supabaseClient;
  }
}

// Export a getter function instead of direct client to prevent initialization issues
// Enhanced error handling in Proxy (2025 best practice)
export const supabase = new Proxy({} as SupabaseBrowserClient, {
  get(_target, prop: string | symbol) {
    try {
      const client = getSupabaseClient();
      // Forward property access - Proxy requires this pattern
      // Double cast through unknown to satisfy TypeScript's strict type checking
      const value = (client as unknown as Record<string | symbol, unknown>)[
        prop
      ];

      // If the property is a function, wrap it to catch errors
      if (typeof value === 'function') {
        return (...args: unknown[]) => {
          try {
            return value.apply(client, args);
          } catch (error) {
            if (IS_DEVELOPMENT) {
              console.error(
                `❌ Error calling Supabase method ${String(prop)}:`,
                error
              );
            }
            throw error;
          }
        };
      }

      return value;
    } catch (error) {
      if (IS_DEVELOPMENT) {
        console.error(
          `❌ Error accessing Supabase property ${String(prop)}:`,
          error
        );
      }
      // Return a no-op function for methods, undefined for properties
      if (
        typeof prop === 'string' &&
        (prop.startsWith('from') || prop.startsWith('auth'))
      ) {
        return () =>
          Promise.resolve({
            data: null,
            error: {
              message: 'Supabase client not initialized',
              code: 'CLIENT_ERROR',
            },
          });
      }
      return undefined;
    }
  },
}) as SupabaseBrowserClient;

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";
