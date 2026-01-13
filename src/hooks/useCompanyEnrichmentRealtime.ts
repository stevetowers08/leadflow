/**
 * Real-time hook for company enrichment status changes
 * Listens for enrichment_status updates and triggers notifications + query invalidation
 */

import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { notificationService } from '@/services/notificationService';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export function useCompanyEnrichmentRealtime() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const processedCompaniesRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('company-enrichment-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'companies',
          filter: 'enrichment_status=neq.null',
        },
        async payload => {
          const company = payload.new as {
            id: string;
            enrichment_status:
              | 'pending'
              | 'enriching'
              | 'completed'
              | 'failed'
              | null;
            name: string | null;
            owner_id: string | null;
          };

          const oldCompany = payload.old as {
            enrichment_status:
              | 'pending'
              | 'enriching'
              | 'completed'
              | 'failed'
              | null;
          };

          // Only process if this is the current user's company
          if (company.owner_id !== user.id) return;

          // Check if enrichment status changed from pending/enriching to completed/failed
          const wasEnriching =
            oldCompany.enrichment_status === 'pending' ||
            oldCompany.enrichment_status === 'enriching';
          const isNowComplete =
            company.enrichment_status === 'completed' ||
            company.enrichment_status === 'failed';

          // Only notify on status transition from enriching to complete/failed
          if (wasEnriching && isNowComplete) {
            // Prevent duplicate notifications (debounce)
            const companyKey = `${company.id}-${company.enrichment_status}`;
            if (processedCompaniesRef.current.has(companyKey)) {
              return;
            }
            processedCompaniesRef.current.add(companyKey);

            // Clean up old keys after 5 seconds to allow re-notification if status changes again
            setTimeout(() => {
              processedCompaniesRef.current.delete(companyKey);
            }, 5000);

            const companyName = company.name || 'Company';
            const success = company.enrichment_status === 'completed';

            // Show toast notification
            if (success) {
              toast.success('Company Enriched', {
                description: `${companyName} has been enriched with additional information.`,
              });
            } else {
              toast.error('Enrichment Failed', {
                description: `Failed to enrich ${companyName}. Please try again.`,
              });
            }

            // Create persistent notification
            try {
              await notificationService.create({
                userId: user.id,
                type: 'company_enriched',
                title: success ? 'Company Enriched' : 'Enrichment Failed',
                message: success
                  ? `${companyName} has been enriched with additional information.`
                  : `Failed to enrich ${companyName}.`,
                priority: 'medium',
                action: `/companies?id=${company.id}`,
                metadata: {
                  companyId: company.id,
                  companyName,
                  success,
                },
              });
            } catch (error) {
              console.error('Failed to create enrichment notification:', error);
            }

            // Invalidate queries to refresh UI
            queryClient.invalidateQueries({ queryKey: ['companies'] });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, queryClient]);
}
