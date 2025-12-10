// src/hooks/useClientId.ts
import { useAuth } from '@/contexts/AuthContext';
import { shouldBypassAuth } from '@/config/auth';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { getErrorMessage } from '@/lib/utils';
import { logger } from '@/utils/productionLogger';

export function useClientId() {
  const { user } = useAuth();
  const bypassAuth = shouldBypassAuth();

  return useQuery({
    queryKey: ['client-id', user?.id],
    queryFn: async () => {
      // Always use the actual user ID from auth context (even in bypassAuth mode)
      // The auth context now checks for actual session first in bypassAuth mode
      const userId = user?.id;
      
      if (!userId) return null;

      const { data: clientUser, error } = await supabase
        .from('client_users')
        .select('client_id')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        // PGRST116 = no rows found, which is acceptable
        // PGRST301 = table not found in schema cache (table may not exist or migration not run)
        // Both are acceptable - client_users table is optional for single-tenant setups
        const errorMessage = getErrorMessage(error);
        const isTableNotFound = 
          error.code === 'PGRST301' || 
          error.code === 'PGRST116' ||
          errorMessage?.includes('schema cache') ||
          errorMessage?.includes('does not exist') ||
          errorMessage?.includes('Could not find the table');
        
        if (!isTableNotFound) {
          logger.error('Error fetching client ID:', errorMessage, error);
        }
        return null;
      }

      return clientUser?.client_id || null;
    },
    enabled: !!user?.id || bypassAuth,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false, // Don't retry if table doesn't exist
  });
}

// Helper function for components that need client_id synchronously
export async function getClientId(): Promise<string | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.id) return null;

  const { data: clientUser, error } = await supabase
    .from('client_users')
    .select('client_id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) {
    // PGRST116 = no rows found, PGRST301 = table not found
    // Both are acceptable - client_users table is optional
    const errorMessage = getErrorMessage(error);
    const isTableNotFound = 
      error.code === 'PGRST301' || 
      error.code === 'PGRST116' ||
      errorMessage?.includes('schema cache') ||
      errorMessage?.includes('does not exist') ||
      errorMessage?.includes('Could not find the table');
    
    if (!isTableNotFound) {
      logger.error('Error fetching client ID:', errorMessage, error);
    }
    return null;
  }

  return clientUser?.client_id || null;
}
