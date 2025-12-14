/**
 * Bulk Lemlist Service
 *
 * Handles bulk operations for adding leads to lemlist campaigns
 */

import { bulkAddLeadsToLemlistCampaign } from './lemlistWorkflowService';

/**
 * Bulk add people/leads to a lemlist campaign
 */
export async function bulkAddPeopleToLemlistCampaign(
  userId: string,
  campaignId: string,
  peopleIds: string[]
): Promise<{
  success: number;
  failed: number;
  errors: Array<{ personId: string; error: string }>;
}> {
  // Fetch leads data from database
  const { supabase } = await import('@/integrations/supabase/client');

  const { data: leads, error } = await supabase
    .from('leads')
    .select('id, email, first_name, last_name, company')
    .in('id', peopleIds);

  if (error || !leads) {
    throw new Error(
      `Failed to fetch leads: ${error?.message || 'Unknown error'}`
    );
  }

  // Convert leads to lemlist lead format
  const lemlistLeads = leads
    .map(
      (lead: {
        email: string | null;
        first_name: string | null;
        last_name: string | null;
        company: string | null;
      }) => {
        return {
          email: lead.email || '',
          firstName: lead.first_name || undefined,
          lastName: lead.last_name || undefined,
          company: lead.company || undefined,
        };
      }
    )
    .filter(lead => lead.email); // Only include leads with email

  if (lemlistLeads.length === 0) {
    throw new Error('No valid leads found (all missing email addresses)');
  }

  // Bulk add to lemlist
  const result = await bulkAddLeadsToLemlistCampaign(
    userId,
    campaignId,
    lemlistLeads
  );

  // Map errors back to lead IDs
  const mappedErrors = result.errors
    .map((err, index) => {
      const leadIndex = lemlistLeads.findIndex(
        l => l.email === (err.lead as { email?: string })?.email
      );
      return {
        personId: leads[leadIndex]?.id || '',
        error: err.error,
      };
    })
    .filter(e => e.personId);

  return {
    success: result.success,
    failed: result.failed,
    errors: mappedErrors,
  };
}
