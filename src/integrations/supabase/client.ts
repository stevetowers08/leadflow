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
  // #region agent log
  if (typeof window !== 'undefined') {
    try {
      const logData = {
        location: 'supabase/client.ts:21',
        message: 'getSupabaseClient entry',
        data: {
          hasClient: !!_supabaseClient,
          isSSR: typeof window === 'undefined',
          timestamp: Date.now(),
        },
        timestamp: Date.now(),
        sessionId: 'debug-session',
        runId: 'run1',
        hypothesisId: 'C',
      };
      fetch(
        'http://127.0.0.1:7242/ingest/01e36b46-c269-4815-ad0a-9aee92c9938f',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(logData),
        }
      ).catch(e => console.warn('Debug log failed:', e));
    } catch (e) {
      // Silently ignore debug logging errors
    }
  }
  // #endregion
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

      // Use createBrowserClient from @supabase/ssr for SSR compatibility
      // This reads from cookies set by server-side exchange-code route
      _supabaseClient = createBrowserClient<Database>(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
      );
      return _supabaseClient;
    }

    // Client-side: validate environment on first access
    // Only validate if environment variables exist (they might be set via .env.local)
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
          '⚠️ Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in your .env.local file'
        );
      }
    }

    // #region agent log
    if (typeof window !== 'undefined') {
      fetch(
        'http://127.0.0.1:7242/ingest/01e36b46-c269-4815-ad0a-9aee92c9938f',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            location: 'supabase/client.ts:129',
            message: 'Before creating client',
            data: {
              hasUrl: !!SUPABASE_URL,
              hasKey: !!SUPABASE_PUBLISHABLE_KEY,
              timestamp: Date.now(),
            },
            timestamp: Date.now(),
            sessionId: 'debug-session',
            runId: 'run1',
            hypothesisId: 'C',
          }),
        }
      ).catch(() => {});
    }
    // #endregion
    if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
      throw new Error('Missing Supabase environment variables');
    }

    // Use createBrowserClient from @supabase/ssr for SSR compatibility
    // This reads from cookies set by server-side exchange-code route
    // createBrowserClient automatically handles:
    // - Reading sessions from cookies (set by server)
    // - PKCE flow for OAuth
    // - Session persistence and auto-refresh
    _supabaseClient = createBrowserClient<Database>(
      SUPABASE_URL,
      SUPABASE_PUBLISHABLE_KEY
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

    // #region agent log
    if (typeof window !== 'undefined') {
      fetch(
        'http://127.0.0.1:7242/ingest/01e36b46-c269-4815-ad0a-9aee92c9938f',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            location: 'supabase/client.ts:176',
            message: 'Client created successfully',
            data: { timestamp: Date.now() },
            timestamp: Date.now(),
            sessionId: 'debug-session',
            runId: 'run1',
            hypothesisId: 'C',
          }),
        }
      ).catch(() => {});
    }
    // #endregion
    return _supabaseClient;
  } catch (error) {
    // #region agent log
    if (typeof window !== 'undefined') {
      fetch(
        'http://127.0.0.1:7242/ingest/01e36b46-c269-4815-ad0a-9aee92c9938f',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            location: 'supabase/client.ts:178',
            message: 'Client creation error',
            data: {
              errorMessage:
                error instanceof Error ? error.message : String(error),
              errorName: error instanceof Error ? error.name : 'unknown',
              timestamp: Date.now(),
            },
            timestamp: Date.now(),
            sessionId: 'debug-session',
            runId: 'run1',
            hypothesisId: 'C',
          }),
        }
      ).catch(() => {});
    }
    // #endregion
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
export const supabase = new Proxy({} as SupabaseBrowserClient, {
  get(_target, prop: string | symbol) {
    const client = getSupabaseClient();
    // Forward property access - Proxy requires this pattern
    // Double cast through unknown to satisfy TypeScript's strict type checking
    return (client as unknown as Record<string | symbol, unknown>)[prop];
  },
}) as SupabaseBrowserClient;

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";
