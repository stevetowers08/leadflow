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
): Promise<{ success: number; failed: number; errors: Array<{ personId: string; error: string }> }> {
  // Fetch people data from database
  const { supabase } = await import('@/integrations/supabase/client');
  
  const { data: people, error } = await supabase
    .from('people')
    .select('id, email_address, name, company_id, companies(name)')
    .in('id', peopleIds);

  if (error || !people) {
    throw new Error(`Failed to fetch people: ${error?.message || 'Unknown error'}`);
  }

  // Convert people to lemlist lead format
  const leads = people.map((person: any) => {
    // Split name into first and last name
    const nameParts = (person.name || '').split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || undefined;

    return {
      email: person.email_address || '',
      firstName: firstName || undefined,
      lastName: lastName,
      company: person.companies?.name || undefined,
    };
  }).filter(lead => lead.email); // Only include leads with email

  if (leads.length === 0) {
    throw new Error('No valid leads found (all missing email addresses)');
  }

  // Bulk add to lemlist
  const result = await bulkAddLeadsToLemlistCampaign(userId, campaignId, leads);

  // Map errors back to person IDs
  const mappedErrors = result.errors.map((err, index) => {
    const leadIndex = leads.findIndex(l => 
      l.email === (err.lead as any)?.email
    );
    return {
      personId: people[leadIndex]?.id || '',
      error: err.error,
    };
  }).filter(e => e.personId);

  return {
    success: result.success,
    failed: result.failed,
    errors: mappedErrors,
  };
}

