/**
 * Real-time hook for lead enrichment status changes
 * Listens for enrichment_status updates and triggers notifications + query invalidation
 */

import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { notificationService } from '@/services/notificationService';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export function useLeadEnrichmentRealtime() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const processedLeadsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('lead-enrichment-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'leads',
          filter: 'enrichment_status=neq.null',
        },
        async payload => {
          const lead = payload.new as {
            id: string;
            enrichment_status:
              | 'pending'
              | 'enriching'
              | 'completed'
              | 'failed'
              | null;
            first_name: string | null;
            last_name: string | null;
            user_id: string | null;
          };

          const oldLead = payload.old as {
            enrichment_status:
              | 'pending'
              | 'enriching'
              | 'completed'
              | 'failed'
              | null;
          };

          // Only process if this is the current user's lead
          if (lead.user_id !== user.id) return;

          // Check if enrichment status changed from pending/enriching to completed/failed
          const wasEnriching =
            oldLead.enrichment_status === 'pending' ||
            oldLead.enrichment_status === 'enriching';
          const isNowComplete =
            lead.enrichment_status === 'completed' ||
            lead.enrichment_status === 'failed';

          // Only notify on status transition from enriching to complete/failed
          if (wasEnriching && isNowComplete) {
            // Prevent duplicate notifications (debounce)
            const leadKey = `${lead.id}-${lead.enrichment_status}`;
            if (processedLeadsRef.current.has(leadKey)) {
              return;
            }
            processedLeadsRef.current.add(leadKey);

            // Clean up old keys after 5 seconds to allow re-notification if status changes again
            setTimeout(() => {
              processedLeadsRef.current.delete(leadKey);
            }, 5000);

            const leadName =
              [lead.first_name, lead.last_name].filter(Boolean).join(' ') ||
              'Lead';

            const success = lead.enrichment_status === 'completed';

            // Show toast notification
            if (success) {
              toast.success('Lead Enriched', {
                description: `${leadName} has been enriched with additional information.`,
              });
            } else {
              toast.error('Enrichment Failed', {
                description: `Failed to enrich ${leadName}. Please try again.`,
              });
            }

            // Create persistent notification
            try {
              await notificationService.notifyLeadEnriched(
                user.id,
                leadName,
                lead.id,
                success
              );
            } catch (error) {
              console.error('Failed to create enrichment notification:', error);
            }

            // Invalidate queries to refresh UI
            queryClient.invalidateQueries({ queryKey: ['leads'] });
            queryClient.invalidateQueries({ queryKey: ['lead-stats'] });
            queryClient.invalidateQueries({
              queryKey: ['leads-all-for-filter'],
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, queryClient]);
}
