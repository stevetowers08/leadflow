/**
 * Bulk Leads Service
 * 
 * Handles bulk operations for leads, including converting leads to people
 * and adding them to campaigns (both email and Lemlist)
 */

import { supabase } from '@/integrations/supabase/client';
import { bulkAddToCampaign } from './bulkPeopleService';
import { bulkAddPeopleToLemlistCampaign } from '../bulkLemlistService';
import type { Lead } from '@/types/database';

/**
 * Find or create people from leads
 * Matches by email, creates new people if not found
 */
async function findOrCreatePeopleFromLeads(
  leads: Lead[],
  userId: string
): Promise<{ 
  personIds: string[]; 
  leadToPersonMap: Map<string, string>; // Maps lead ID to person ID
  errors: Array<{ leadId: string; error: string }> 
}> {
  const personIds: string[] = [];
  const leadToPersonMap = new Map<string, string>();
  const errors: Array<{ leadId: string; error: string }> = [];

  for (const lead of leads) {
    try {
      if (!lead.email) {
        errors.push({
          leadId: lead.id,
          error: 'Lead missing email address',
        });
        continue;
      }

      // Try to find existing person by email
      const { data: existingPerson } = await supabase
        .from('people')
        .select('id')
        .eq('email_address', lead.email.toLowerCase())
        .single();

      if (existingPerson) {
        personIds.push(existingPerson.id);
        leadToPersonMap.set(lead.id, existingPerson.id);
        continue;
      }

      // Create new person from lead
      const name = [lead.first_name, lead.last_name].filter(Boolean).join(' ') || 'Unknown';
      
      // Find or create company if company name exists
      let companyId: string | null = null;
      if (lead.company) {
        const { data: existingCompany } = await supabase
          .from('companies')
          .select('id')
          .ilike('name', lead.company)
          .single();

        if (existingCompany) {
          companyId = existingCompany.id;
        } else {
          // Create new company
          const { data: newCompany } = await supabase
            .from('companies')
            .insert({
              name: lead.company,
              owner_id: userId,
            })
            .select('id')
            .single();

          if (newCompany) {
            companyId = newCompany.id;
          }
        }
      }

      // Create person
      const { data: newPerson, error: personError } = await supabase
        .from('people')
        .insert({
          name,
          email_address: lead.email.toLowerCase(),
          company_id: companyId,
          company_role: lead.job_title || null,
          owner_id: userId,
          lead_source: 'lead_capture',
        })
        .select('id')
        .single();

      if (personError || !newPerson) {
        errors.push({
          leadId: lead.id,
          error: personError?.message || 'Failed to create person',
        });
        continue;
      }

      personIds.push(newPerson.id);
      leadToPersonMap.set(lead.id, newPerson.id);
    } catch (error) {
      errors.push({
        leadId: lead.id,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  return { personIds, leadToPersonMap, errors };
}

/**
 * Bulk add leads to campaign (email or Lemlist)
 */
export async function bulkAddLeadsToCampaign(
  leadIds: string[],
  campaignId: string,
  userId: string
): Promise<{ success: number; failed: number; errors: Array<{ leadId: string; error: string }> }> {
  try {
    console.log('[bulkAddLeadsToCampaign] Starting', { leadIds: leadIds.length, campaignId, userId });
    
    // Fetch leads
    const { data: leads, error: leadsError } = await supabase
      .from('leads')
      .select('*')
      .in('id', leadIds);

    if (leadsError || !leads) {
      console.error('[bulkAddLeadsToCampaign] Failed to fetch leads', leadsError);
      return {
        success: 0,
        failed: leadIds.length,
        errors: [{ leadId: 'all', error: leadsError?.message || 'Failed to fetch leads' }],
      };
    }

    console.log('[bulkAddLeadsToCampaign] Fetched leads', leads.length);

    // Convert leads to people
    const { personIds, leadToPersonMap, errors: conversionErrors } = await findOrCreatePeopleFromLeads(leads, userId);

    console.log('[bulkAddLeadsToCampaign] Converted to people', { 
      personIds: personIds.length, 
      conversionErrors: conversionErrors.length 
    });

    if (personIds.length === 0) {
      console.error('[bulkAddLeadsToCampaign] No people created', conversionErrors);
      return {
        success: 0,
        failed: leadIds.length,
        errors: conversionErrors,
      };
    }

    // Check if it's a Lemlist campaign (ID starts with "cam_")
    const isLemlistCampaign = campaignId.startsWith('cam_');
    console.log('[bulkAddLeadsToCampaign] Campaign type', { isLemlistCampaign, campaignId });

    if (isLemlistCampaign) {
      // Use Lemlist service
      const result = await bulkAddPeopleToLemlistCampaign(userId, campaignId, personIds);
      
      // Map person IDs back to lead IDs for error reporting
      // Create reverse map (person ID -> lead ID)
      const personToLeadMap = new Map<string, string>();
      leadToPersonMap.forEach((personId, leadId) => {
        personToLeadMap.set(personId, leadId);
      });

      const mappedErrors = result.errors.map(err => ({
        leadId: personToLeadMap.get(err.personId) || 'unknown',
        error: err.error,
      }));

      return {
        success: result.success,
        failed: result.failed + conversionErrors.length,
        errors: [...conversionErrors, ...mappedErrors],
      };
    } else {
      // Use regular email campaign service
      console.log('[bulkAddLeadsToCampaign] Adding to email campaign', { personIds: personIds.length, campaignId });
      const result = await bulkAddToCampaign(personIds, campaignId);
      console.log('[bulkAddLeadsToCampaign] Email campaign result', result);
      
      // Map person IDs back to lead IDs for error reporting
      const personToLeadMap = new Map<string, string>();
      leadToPersonMap.forEach((personId, leadId) => {
        personToLeadMap.set(personId, leadId);
      });

      return {
        success: result.successCount,
        failed: result.errorCount + conversionErrors.length,
        errors: [
          ...conversionErrors,
          ...result.errors.map(err => ({
            leadId: personToLeadMap.get(err.id) || 'unknown',
            error: err.error,
          })),
        ],
      };
    }
  } catch (error) {
    console.error('[bulkAddLeadsToCampaign] Error', error);
    return {
      success: 0,
      failed: leadIds.length,
      errors: [{ leadId: 'all', error: error instanceof Error ? error.message : 'Unknown error' }],
    };
  }
}

