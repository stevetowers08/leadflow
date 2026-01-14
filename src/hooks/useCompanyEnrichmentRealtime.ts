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

    // Note: enrichment_status field doesn't exist in companies table
    // This hook is disabled until enrichment_status is added back or removed from types
    // For now, we'll just listen for any company updates to refresh the UI
    const channel = supabase
      .channel('company-enrichment-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'companies',
        },
        async payload => {
          const company = payload.new as {
            id: string;
            name: string | null;
          };

          // Invalidate only specific company queries to avoid full refetch of all company data
          // Use predicate to match company-specific queries while avoiding broad invalidation
          queryClient.invalidateQueries({
            predicate: query => {
              const key = query.queryKey;
              // Match specific company query: ['company', companyId]
              if (key[0] === 'company' && key[1] === company.id) {
                return true;
              }
              // For list queries, only invalidate if they're currently active
              // to avoid unnecessary refetches
              return false;
            },
            refetchType: 'active',
          });

          // Also invalidate the companies list, but only active queries
          queryClient.invalidateQueries({
            queryKey: ['companies'],
            refetchType: 'active',
          });

          // Note: Enrichment status tracking removed - companies table doesn't have enrichment_status field
          // If enrichment notifications are needed, they should be handled via leads table instead
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
}

// Legacy hook - kept for backwards compatibility but disabled enrichment status tracking
export function useCompanyEnrichmentRealtimeLegacy() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const processedCompaniesRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!user?.id) return;

    // Disabled - enrichment_status doesn't exist in companies table
    // Legacy functionality removed - this hook is kept for backwards compatibility only
  }, [user?.id, queryClient]);
}
