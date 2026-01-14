// src/hooks/useClientId.ts
import { useAuth } from '@/contexts/AuthContext';
import { shouldBypassAuth } from '@/config/auth';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { getErrorMessage } from '@/lib/utils';
import { logger } from '@/utils/productionLogger';

// Import organization context (will throw if not in provider, which is expected)
import { useOrganization } from '@/contexts/OrganizationContext';

export function useClientId() {
  const { user } = useAuth();
  const bypassAuth = shouldBypassAuth();

  // Get organization from context (OrganizationProvider wraps the app)
  // Note: This will throw if OrganizationProvider is not in the tree, which is expected
  // The error is caught and we fall back to the query method
  let currentOrganization: { id: string } | null = null;
  try {
    const orgContext = useOrganization();
    currentOrganization = orgContext?.currentOrganization || null;
  } catch {
    // Context not available - OrganizationProvider not mounted yet or not in tree
    // This is expected during initial render or if provider setup is incomplete
    // Will fall back to querying client_users table directly
  }

  // Always call useQuery (React hooks must be called unconditionally)
  // If we have organization context, the query will be disabled and we'll return early
  const queryResult = useQuery({
    queryKey: ['client-id', user?.id],
    queryFn: async () => {
      // Always use the actual user ID from auth context (even in bypassAuth mode)
      // The auth context now checks for actual session first in bypassAuth mode
      const userId = user?.id;

      if (!userId) return null;

      const { data: clientUser, error } = await supabase
        .from('client_users' as never)
        .select('client_id')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        // PGRST116 = no rows found, which is acceptable
        // PGRST301 = table not found in schema cache (table may not exist or migration not run)
        // PGRST301 with infinite recursion = RLS policy issue (suppress error, return null)
        // ENV_MISSING = Supabase environment variables not configured (mock client)
        // Both are acceptable - client_users table is optional for single-tenant setups
        const errorMessage = getErrorMessage(error);
        const errorCode = (error as { code?: string })?.code;
        const errorString = String(errorMessage || error);

        // Check for suppressible errors (2025 best practice: comprehensive error detection)
        const isTableNotFound =
          errorCode === 'PGRST301' ||
          errorCode === 'PGRST116' ||
          errorCode === 'ENV_MISSING' ||
          errorString.includes('schema cache') ||
          errorString.includes('does not exist') ||
          errorString.includes('Could not find the table') ||
          errorString.includes(
            'Missing or invalid Supabase environment variables'
          ) ||
          errorString.includes('Missing Supabase environment variables') ||
          errorString.includes('NEXT_PUBLIC_SUPABASE_URL') ||
          errorString.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY');

        const isInfiniteRecursion =
          errorString.includes('infinite recursion') ||
          errorString.includes('recursion detected');

        // Suppress infinite recursion errors (RLS policy issue), table not found errors, and env missing errors
        if (!isTableNotFound && !isInfiniteRecursion) {
          logger.error('Error fetching client ID:', errorMessage, error);
        }
        return null;
      }

      return (
        (clientUser as unknown as { client_id?: string } | null)?.client_id ||
        null
      );
    },
    enabled: !currentOrganization?.id && (!!user?.id || bypassAuth),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false, // Don't retry if table doesn't exist
  });

  // If we have organization context, use it directly (more efficient)
  if (currentOrganization?.id) {
    return {
      data: currentOrganization.id,
      isLoading: false,
      error: null,
    };
  }

  // Return query result as fallback
  return queryResult;
}

// Helper function for components that need client_id synchronously
export async function getClientId(): Promise<string | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.id) return null;

  const { data: clientUser, error } = await supabase
    .from('client_users' as never)
    .select('client_id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) {
    // PGRST116 = no rows found, PGRST301 = table not found
    // PGRST301 with infinite recursion = RLS policy issue (suppress error, return null)
    // ENV_MISSING = Supabase environment variables not configured (mock client)
    // Both are acceptable - client_users table is optional
    const errorMessage = getErrorMessage(error);
    const errorCode = (error as { code?: string })?.code;
    const errorString = String(errorMessage || error);

    // Check for suppressible errors (2025 best practice: comprehensive error detection)
    const isTableNotFound =
      errorCode === 'PGRST301' ||
      errorCode === 'PGRST116' ||
      errorCode === 'ENV_MISSING' ||
      errorString.includes('schema cache') ||
      errorString.includes('does not exist') ||
      errorString.includes('Could not find the table') ||
      errorString.includes(
        'Missing or invalid Supabase environment variables'
      ) ||
      errorString.includes('Missing Supabase environment variables') ||
      errorString.includes('NEXT_PUBLIC_SUPABASE_URL') ||
      errorString.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY');

    const isInfiniteRecursion =
      errorString.includes('infinite recursion') ||
      errorString.includes('recursion detected');

    // Suppress infinite recursion errors (RLS policy issue), table not found errors, and env missing errors
    if (!isTableNotFound && !isInfiniteRecursion) {
      logger.error('Error fetching client ID:', errorMessage, error);
    }
    return null;
  }

  return (
    (clientUser as unknown as { client_id?: string } | null)?.client_id || null
  );
}
