/**
 * Lemlist Workflow Service
 * 
 * Handles loading lemlist credentials from database and adding leads to campaigns
 */

import { supabase } from '@/integrations/supabase/client';
import { lemlistService } from './lemlistService';

/**
 * Load lemlist credentials from user profile metadata
 */
export async function loadLemlistCredentials(userId: string): Promise<{
  apiKey: string;
  email: string;
} | null> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('metadata')
      .eq('id', userId)
      .single();

    if (error || !data?.metadata) {
      return null;
    }

    const metadata = data.metadata as {
      lemlist_api_key?: string;
      lemlist_email?: string;
    };

    if (!metadata.lemlist_api_key || !metadata.lemlist_email) {
      return null;
    }

    return {
      apiKey: metadata.lemlist_api_key,
      email: metadata.lemlist_email,
    };
  } catch (error) {
    console.error('Error loading lemlist credentials:', error);
    return null;
  }
}

/**
 * Add a lead to a lemlist campaign using stored credentials
 */
export async function addLeadToLemlistCampaign(
  userId: string,
  campaignId: string,
  lead: {
    email: string;
    firstName?: string;
    lastName?: string;
    company?: string;
  }
) {
  // Load credentials from database
  const credentials = await loadLemlistCredentials(userId);
  
  if (!credentials) {
    throw new Error('Lemlist credentials not found. Please connect Lemlist in Settings.');
  }

  // Set credentials in service
  lemlistService.setApiKey(credentials.apiKey);
  lemlistService.setEmail(credentials.email);

  // Add lead to campaign
  return await lemlistService.addLeadToCampaign(campaignId, lead);
}

/**
 * Get lemlist campaigns using stored credentials
 */
export async function getLemlistCampaigns(userId: string) {
  // Load credentials from database
  const credentials = await loadLemlistCredentials(userId);
  
  if (!credentials) {
    throw new Error('Lemlist credentials not found. Please connect Lemlist in Settings.');
  }

  // Set credentials in service
  lemlistService.setApiKey(credentials.apiKey);
  lemlistService.setEmail(credentials.email);
  lemlistService.setUserId(userId); // Set userId so it uses API route (avoids CORS)

  // Get campaigns
  return await lemlistService.getCampaigns();
}

/**
 * Bulk add leads to a lemlist campaign using stored credentials
 */
export async function bulkAddLeadsToLemlistCampaign(
  userId: string,
  campaignId: string,
  leads: Array<{
    email: string;
    firstName?: string;
    lastName?: string;
    company?: string;
  }>
) {
  // Load credentials from database
  const credentials = await loadLemlistCredentials(userId);
  
  if (!credentials) {
    throw new Error('Lemlist credentials not found. Please connect Lemlist in Settings.');
  }

  // Set credentials in service
  lemlistService.setApiKey(credentials.apiKey);
  lemlistService.setEmail(credentials.email);

  // Bulk add leads to campaign
  return await lemlistService.bulkAddLeadsToCampaign(campaignId, leads);
}

