import { supabase } from '@/integrations/supabase/client';

export class DecisionMakerService {
  private webhookUrl: string;

  constructor() {
    this.webhookUrl = import.meta.env.VITE_DECISION_MAKER_WEBHOOK_URL;
  }

  async triggerDecisionMakerEnrichment(
    jobId: string,
    companyId: string
  ): Promise<void> {
    try {
      // Get company data for the webhook
      const { data: company, error: companyError } = await supabase
        .from('companies')
        .select('name, website, linkedin_url')
        .eq('id', companyId)
        .single();

      if (companyError) throw companyError;

      // Trigger external webhook (e.g., Clay API, Apollo, etc.)
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-webhook-signature': await this.generateSignature({
            job_id: jobId,
            company_id: companyId,
            company_name: company.name,
            company_website: company.website,
            company_linkedin: company.linkedin_url,
          }),
        },
        body: JSON.stringify({
          job_id: jobId,
          company_id: companyId,
          company_name: company.name,
          company_website: company.website,
          company_linkedin: company.linkedin_url,
          trigger_type: 'job_qualified',
        }),
      });

      if (!response.ok) {
        throw new Error(`Webhook trigger failed: ${response.statusText}`);
      }

      console.log('Decision maker enrichment webhook triggered successfully');
    } catch (error) {
      console.error('Failed to trigger decision maker enrichment:', error);
      throw error;
    }
  }

  private async generateSignature(
    data: Record<string, unknown>
  ): Promise<string> {
    const secret = import.meta.env.VITE_DECISION_MAKER_WEBHOOK_SECRET;
    const payload = JSON.stringify(data);
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const signature = await crypto.subtle.sign(
      'HMAC',
      key,
      encoder.encode(payload)
    );
    return Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }
}
