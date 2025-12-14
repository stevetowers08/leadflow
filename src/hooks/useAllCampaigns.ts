/**
 * Hook to fetch all campaigns (both email campaigns and Lemlist campaigns)
 * Following 2025 best practices: Simple, reusable, type-safe
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { getLemlistCampaigns } from '@/services/lemlistWorkflowService';
import { getErrorMessage } from '@/lib/utils';

export interface CampaignOption {
  id: string;
  name: string;
  type: 'email' | 'lemlist';
}

export function useAllCampaigns() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['all-campaigns', user?.id],
    queryFn: async (): Promise<CampaignOption[]> => {
      const allCampaigns: CampaignOption[] = [];

      // Fetch email campaigns
      try {
        const { data: emailCampaigns, error: emailError } = await supabase
          .from('campaign_sequences' as never)
          .select('id, name')
          .eq('status', 'active')
          .order('name', { ascending: true });

        if (!emailError && emailCampaigns) {
          allCampaigns.push(
            ...(emailCampaigns as Array<{ id: string; name: string }>).map(
              c => ({
                id: c.id,
                name: c.name,
                type: 'email' as const,
              })
            )
          );
        }
      } catch (emailErr) {
        // Silently handle missing table
        const errorMsg = getErrorMessage(emailErr);
        if (
          !errorMsg.includes('schema cache') &&
          !errorMsg.includes('does not exist')
        ) {
          console.error(
            '[useAllCampaigns] Error fetching email campaigns:',
            emailErr
          );
        }
      }

      // Fetch Lemlist campaigns
      if (user) {
        try {
          const lemlistCampaigns = await getLemlistCampaigns(user.id);
          allCampaigns.push(
            ...lemlistCampaigns.map(c => ({
              id: c.id,
              name: `[Lemlist] ${c.name}`,
              type: 'lemlist' as const,
            }))
          );
        } catch (lemlistErr) {
          // Silently handle Lemlist errors (credentials not set, etc.)
          console.debug(
            '[useAllCampaigns] Could not fetch Lemlist campaigns:',
            lemlistErr
          );
        }
      }

      return allCampaigns;
    },
    enabled: !!user,
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes
  });
}
