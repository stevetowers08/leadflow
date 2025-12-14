/**
 * Bulk Leads Operations Service
 *
 * Handles all bulk operations for leads:
 * 1. Delete - Bulk delete with confirmation
 * 2. Favourite - Bulk favourite/unfavourite
 * 3. Export CSV - Download selected leads as CSV
 * 4. Sync to CRM - Send to n8n webhook for CRM sync
 * 5. Add to Campaign - Bulk enroll in campaigns
 *
 * Best Practices:
 * - Batched operations (50 items at a time for performance)
 * - Error handling with partial success reporting
 * - Progress feedback
 * - Optimistic UI updates support
 */

import { supabase } from '@/integrations/supabase/client';
import { Lead } from '@/types/database';

const BATCH_SIZE = 50;

export interface BulkOperationResult {
  success: boolean;
  successCount: number;
  errorCount: number;
  errors: Array<{ id: string; error: string }>;
  message: string;
}

/**
 * Bulk Delete Leads
 * Deletes selected leads in batches
 */
export const bulkDeletePeople = async (
  peopleIds: string[]
): Promise<BulkOperationResult> => {
  const errors: Array<{ id: string; error: string }> = [];
  let successCount = 0;

  try {
    // Process in batches
    for (let i = 0; i < peopleIds.length; i += BATCH_SIZE) {
      const batch = peopleIds.slice(i, i + BATCH_SIZE);

      const { error } = await supabase.from('leads').delete().in('id', batch);

      if (error) {
        batch.forEach(id => errors.push({ id, error: error.message }));
      } else {
        successCount += batch.length;
      }
    }

    return {
      success: errors.length === 0,
      successCount,
      errorCount: errors.length,
      errors,
      message:
        errors.length === 0
          ? `Successfully deleted ${successCount} leads`
          : `Deleted ${successCount} leads with ${errors.length} errors`,
    };
  } catch (error) {
    return {
      success: false,
      successCount,
      errorCount: peopleIds.length - successCount,
      errors: [{ id: 'all', error: (error as Error).message }],
      message: 'Failed to delete leads',
    };
  }
};

/**
 * Bulk Favourite/Unfavourite Leads
 * Toggles favourite status for selected leads
 */
export const bulkFavouritePeople = async (
  peopleIds: string[],
  isFavourite: boolean
): Promise<BulkOperationResult> => {
  const errors: Array<{ id: string; error: string }> = [];
  let successCount = 0;

  try {
    // Process in batches
    for (let i = 0; i < peopleIds.length; i += BATCH_SIZE) {
      const batch = peopleIds.slice(i, i + BATCH_SIZE);

      const { error } = await supabase
        .from('leads')
        .update({ is_favourite: isFavourite })
        .in('id', batch);

      if (error) {
        batch.forEach(id => errors.push({ id, error: error.message }));
      } else {
        successCount += batch.length;
      }
    }

    const action = isFavourite ? 'favourited' : 'unfavourited';
    return {
      success: errors.length === 0,
      successCount,
      errorCount: errors.length,
      errors,
      message:
        errors.length === 0
          ? `Successfully ${action} ${successCount} leads`
          : `${action} ${successCount} leads with ${errors.length} errors`,
    };
  } catch (error) {
    return {
      success: false,
      successCount,
      errorCount: peopleIds.length - successCount,
      errors: [{ id: 'all', error: (error as Error).message }],
      message: 'Failed to update favourites',
    };
  }
};

/**
 * Bulk Export Leads to CSV
 * Downloads selected leads as CSV file
 */
export const bulkExportPeople = async (
  peopleIds: string[]
): Promise<BulkOperationResult> => {
  try {
    // Fetch all selected leads with company data
    const { data, error } = await supabase
      .from('leads')
      .select(
        `
        id,
        first_name,
        last_name,
        email,
        job_title,
        company,
        linkedin_url,
        quality_rank,
        status,
        created_at
      `
      )
      .in('id', peopleIds);

    if (error) throw error;

    // Convert to CSV format
    const leads = data as Lead[];
    const headers = [
      'First Name',
      'Last Name',
      'Email',
      'Job Title',
      'Company',
      'LinkedIn',
      'Quality Rank',
      'Status',
      'Created Date',
    ];

    const csvRows = [
      headers.join(','),
      ...leads.map(lead =>
        [
          `"${lead.first_name || ''}"`,
          `"${lead.last_name || ''}"`,
          `"${lead.email || ''}"`,
          `"${lead.job_title || ''}"`,
          `"${lead.company || ''}"`,
          `"${lead.linkedin_url || ''}"`,
          `"${lead.quality_rank || ''}"`,
          `"${lead.status || ''}"`,
          `"${lead.created_at ? new Date(lead.created_at).toLocaleDateString() : ''}"`,
        ].join(',')
      ),
    ];

    // Add UTF-8 BOM for Excel compatibility (2025 best practice)
    const BOM = '\uFEFF';
    const csvContent = BOM + csvRows.join('\n');

    // Create and download file with proper MIME type
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `leads_export_${new Date().toISOString().split('T')[0]}.csv`
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // Clean up blob URL to prevent memory leak

    return {
      success: true,
      successCount: people.length,
      errorCount: 0,
      errors: [],
      message: `Successfully exported ${leads.length} leads to CSV`,
    };
  } catch (error) {
    return {
      success: false,
      successCount: 0,
      errorCount: peopleIds.length,
      errors: [{ id: 'all', error: (error as Error).message }],
      message: 'Failed to export leads',
    };
  }
};

/**
 * Bulk Sync Leads to CRM (n8n webhook)
 * Sends selected leads to n8n webhook for CRM synchronization
 */
export const bulkSyncToCRM = async (
  peopleIds: string[]
): Promise<BulkOperationResult> => {
  try {
    // Fetch all selected leads with full details
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .in('id', peopleIds);

    if (error) throw error;

    // Get n8n webhook URL from environment (server-only, no NEXT_PUBLIC_ prefix)
    const webhookUrl = process.env.N8N_WEBHOOK_URL;

    if (!webhookUrl) {
      return {
        success: false,
        successCount: 0,
        errorCount: peopleIds.length,
        errors: [{ id: 'config', error: 'N8N webhook URL not configured' }],
        message: 'CRM sync not configured. Please set N8N_WEBHOOK_URL in .env',
      };
    }

    // Send to n8n webhook
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'bulk_sync_leads',
        leads: data,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`Webhook returned status ${response.status}`);
    }

    return {
      success: true,
      successCount: peopleIds.length,
      errorCount: 0,
      errors: [],
      message: `Successfully synced ${peopleIds.length} leads to CRM`,
    };
  } catch (error) {
    return {
      success: false,
      successCount: 0,
      errorCount: peopleIds.length,
      errors: [{ id: 'all', error: (error as Error).message }],
      message: 'Failed to sync leads to CRM',
    };
  }
};

/**
 * Bulk Add Leads to Campaign Sequence
 * Enrolls selected leads in a specific campaign sequence
 */
export const bulkAddToCampaign = async (
  peopleIds: string[],
  campaignId: string
): Promise<BulkOperationResult> => {
  const errors: Array<{ id: string; error: string }> = [];
  let successCount = 0;

  try {
    // First check if campaign sequence exists
    const { data: campaign, error: campaignError } = await supabase
      .from('campaign_sequences')
      .select('id, name')
      .eq('id', campaignId)
      .single();

    if (campaignError || !campaign) {
      return {
        success: false,
        successCount: 0,
        errorCount: peopleIds.length,
        errors: [{ id: 'campaign', error: 'Campaign sequence not found' }],
        message: 'Invalid campaign sequence ID',
      };
    }

    // Process in batches
    for (let i = 0; i < peopleIds.length; i += BATCH_SIZE) {
      const batch = peopleIds.slice(i, i + BATCH_SIZE);

      // Create campaign sequence lead records
      const leadRecords = batch.map(personId => ({
        sequence_id: campaignId,
        lead_id: personId,
        status: 'active',
        started_at: new Date().toISOString(),
      }));

      const { error } = await supabase
        .from('campaign_sequence_leads')
        .upsert(leadRecords, {
          onConflict: 'sequence_id,lead_id',
          ignoreDuplicates: false,
        });

      if (error) {
        batch.forEach(id => errors.push({ id, error: error.message }));
      } else {
        successCount += batch.length;
      }
    }

    return {
      success: errors.length === 0,
      successCount,
      errorCount: errors.length,
      errors,
      message:
        errors.length === 0
          ? `Successfully added ${successCount} leads to ${campaign.name}`
          : `Added ${successCount} leads to ${campaign.name} with ${errors.length} errors`,
    };
  } catch (error) {
    return {
      success: false,
      successCount,
      errorCount: peopleIds.length - successCount,
      errors: [{ id: 'all', error: (error as Error).message }],
      message: 'Failed to add leads to campaign sequence',
    };
  }
};

/**
 * Bulk Update Leads Status
 * Updates the status for selected leads
 */
export const bulkUpdateStage = async (
  peopleIds: string[],
  newStage: string
): Promise<BulkOperationResult> => {
  const errors: Array<{ id: string; error: string }> = [];
  let successCount = 0;

  try {
    // Process in batches
    for (let i = 0; i < peopleIds.length; i += BATCH_SIZE) {
      const batch = peopleIds.slice(i, i + BATCH_SIZE);

      const { error } = await supabase
        .from('leads')
        .update({
          status: newStage,
          updated_at: new Date().toISOString(),
        })
        .in('id', batch);

      if (error) {
        batch.forEach(id => errors.push({ id, error: error.message }));
      } else {
        successCount += batch.length;
      }
    }

    return {
      success: errors.length === 0,
      successCount,
      errorCount: errors.length,
      errors,
      message:
        errors.length === 0
          ? `Successfully updated ${successCount} leads to ${newStage}`
          : `Updated ${successCount} leads with ${errors.length} errors`,
    };
  } catch (error) {
    return {
      success: false,
      successCount,
      errorCount: peopleIds.length - successCount,
      errors: [{ id: 'all', error: (error as Error).message }],
      message: 'Failed to update leads status',
    };
  }
};
