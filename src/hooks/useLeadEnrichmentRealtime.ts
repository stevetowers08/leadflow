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
          filter: `user_id=eq.${user.id}`,
        },
        async payload => {
          console.log('🔔 Real-time update received for lead:', payload.new.id);
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

          // Check if any enrichment-related field changed
          const statusChanged =
            oldLead.enrichment_status !== lead.enrichment_status;
          const oldData = payload.old as {
            enrichment_data?: unknown;
            linkedin_url?: string | null;
            job_title?: string | null;
          };
          const newData = payload.new as {
            enrichment_data?: unknown;
            linkedin_url?: string | null;
            job_title?: string | null;
          };

          // Check if enrichment data, linkedin_url, or job_title changed
          const enrichmentDataChanged =
            JSON.stringify(oldData?.enrichment_data) !==
            JSON.stringify(newData?.enrichment_data);
          const linkedinChanged =
            oldData?.linkedin_url !== newData?.linkedin_url;
          const jobTitleChanged = oldData?.job_title !== newData?.job_title;

          // Skip if nothing enrichment-related changed
          if (
            !statusChanged &&
            !enrichmentDataChanged &&
            !linkedinChanged &&
            !jobTitleChanged
          ) {
            return;
          }

          console.log('📊 Enrichment change detected:', {
            statusChanged,
            enrichmentDataChanged,
            linkedinChanged,
            jobTitleChanged,
            oldStatus: oldLead.enrichment_status,
            newStatus: lead.enrichment_status,
          });

          // Check if enrichment status changed from pending/enriching to completed/failed
          const wasEnriching =
            oldLead.enrichment_status === 'pending' ||
            oldLead.enrichment_status === 'enriching';
          const isNowComplete =
            lead.enrichment_status === 'completed' ||
            lead.enrichment_status === 'failed';

          // Also handle when status changes to enriching (for real-time feedback)
          const isNowEnriching = lead.enrichment_status === 'enriching';
          const wasNotEnriching =
            oldLead.enrichment_status !== 'enriching' &&
            oldLead.enrichment_status !== 'pending';

          // Always update UI if enrichment-related fields changed
          const shouldNotify =
            (wasEnriching && isNowComplete) ||
            (wasNotEnriching && isNowEnriching);

          // Always refresh queries if any enrichment data changed
          if (
            enrichmentDataChanged ||
            linkedinChanged ||
            jobTitleChanged ||
            statusChanged
          ) {
            // Prevent duplicate notifications (debounce)
            if (shouldNotify) {
              const leadKey = `${lead.id}-${lead.enrichment_status}`;
              if (processedLeadsRef.current.has(leadKey)) {
                // Still update UI even if we've notified before
              } else {
                processedLeadsRef.current.add(leadKey);

                // Clean up old keys after 5 seconds
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
                } else if (lead.enrichment_status === 'failed') {
                  toast.error('Enrichment Failed', {
                    description: `Failed to enrich ${leadName}. Please try again.`,
                  });
                }

                // Create persistent notification
                if (shouldNotify) {
                  try {
                    await notificationService.notifyLeadEnriched(
                      user.id,
                      leadName,
                      lead.id,
                      success
                    );
                  } catch (error) {
                    console.error(
                      'Failed to create enrichment notification:',
                      error
                    );
                  }
                }
              }
            }

            // Always invalidate and refetch queries when enrichment data changes
            console.log(
              '🔄 Invalidating leads queries due to enrichment update'
            );
            queryClient.invalidateQueries({
              predicate: query => {
                const key = query.queryKey[0];
                return (
                  key === 'leads' ||
                  key === 'lead-stats' ||
                  key === 'leads-all-for-filter'
                );
              },
            });

            // Force immediate refetch
            queryClient.refetchQueries({
              predicate: query => {
                const key = query.queryKey[0];
                return key === 'leads' || key === 'lead-stats';
              },
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
