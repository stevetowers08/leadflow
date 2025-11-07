// src/hooks/useClientId.ts
import { useAuth } from '@/contexts/AuthContext';
import { shouldBypassAuth } from '@/config/auth';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

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
        // PGRST116 = no rows found, which is acceptable in some cases
        if (error.code !== 'PGRST116') {
          console.error('Error fetching client ID:', error);
        }
        return null;
      }

      return clientUser?.client_id || null;
    },
    enabled: !!user?.id || bypassAuth,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
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
    .single();

  if (error) {
    console.error('Error fetching client ID:', error);
    return null;
  }

  return clientUser?.client_id || null;
}
