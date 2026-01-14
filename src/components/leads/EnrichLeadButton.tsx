'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { Lead } from '@/types/database';
import { Sparkles, RefreshCw } from 'lucide-react';
import type { ButtonProps } from '@/components/ui/button';
import { logger } from '@/utils/productionLogger';

interface EnrichLeadButtonProps {
  lead: Lead;
  onSuccess?: () => void;
  variant?: ButtonProps['variant'];
  size?: ButtonProps['size'];
}

export function EnrichLeadButton({
  lead,
  onSuccess,
  variant,
  size = 'sm',
}: EnrichLeadButtonProps) {
  const [enriching, setEnriching] = useState(false);

  async function handleEnrich() {
    if (!lead.email && !lead.first_name && !lead.last_name) {
      toast.error('Cannot enrich lead', {
        description: 'Lead must have at least an email or name',
      });
      return;
    }

    setEnriching(true);
    try {
      const response = await fetch('/api/enrich-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead_id: lead.id,
          company: lead.company,
          email: lead.email,
          first_name: lead.first_name,
          last_name: lead.last_name,
          linkedin_url: lead.linkedin_url,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(`Lead enriched! Confidence: ${result.likelihood}/10`, {
          description: 'Enrichment data has been added to this lead',
        });

        if (onSuccess) {
          onSuccess();
        } else {
          window.location.reload();
        }
      } else {
        toast.error(result.message || 'Enrichment failed', {
          description:
            result.error || 'Could not find enrichment data for this lead',
        });
      }
    } catch (error) {
      logger.error('Error enriching lead:', error);
      toast.error('Failed to enrich lead', {
        description:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred',
      });
    } finally {
      setEnriching(false);
    }
  }

  // Check enrichment status
  const isEnriched = lead.enrichment_status === 'completed';
  const isFailed = lead.enrichment_status === 'failed';
  const isPending =
    lead.enrichment_status === 'pending' ||
    lead.enrichment_status === 'enriching';

  // Check if enriched recently (within 90 days)
  const enrichedRecently =
    lead.enrichment_timestamp &&
    new Date(lead.enrichment_timestamp) >
      new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);

  // Show different button states
  if (isEnriched && enrichedRecently) {
    return (
      <Button
        variant={variant || 'outline'}
        size={size}
        onClick={handleEnrich}
        disabled={enriching}
      >
        <RefreshCw className='h-4 w-4 mr-2' />
        {enriching ? 'Re-enriching...' : 'Re-enrich'}
      </Button>
    );
  }

  if (isPending) {
    return (
      <Button variant={variant || 'outline'} size={size} disabled>
        <Sparkles className='h-4 w-4 mr-2 animate-pulse' />
        Enriching...
      </Button>
    );
  }

  return (
    <Button
      onClick={handleEnrich}
      disabled={enriching || !lead.email}
      size={size}
      variant={variant || (isFailed ? 'outline' : 'default')}
    >
      <Sparkles className='h-4 w-4 mr-2' />
      {enriching ? 'Enriching...' : 'Enrich with PDL'}
    </Button>
  );
}
