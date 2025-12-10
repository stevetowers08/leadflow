/**
 * Bulk People Operations Service
 *
 * Handles all bulk operations for people (decision makers):
 * 1. Delete - Bulk delete with confirmation
 * 2. Favourite - Bulk favourite/unfavourite
 * 3. Export CSV - Download selected people as CSV
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
import { Person } from '@/types/database';

const BATCH_SIZE = 50;

export interface BulkOperationResult {
  success: boolean;
  successCount: number;
  errorCount: number;
  errors: Array<{ id: string; error: string }>;
  message: string;
}

/**
 * Bulk Delete People
 * Deletes selected people in batches
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

      const { error } = await supabase.from('people').delete().in('id', batch);

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
          ? `Successfully deleted ${successCount} people`
          : `Deleted ${successCount} people with ${errors.length} errors`,
    };
  } catch (error) {
    return {
      success: false,
      successCount,
      errorCount: peopleIds.length - successCount,
      errors: [{ id: 'all', error: (error as Error).message }],
      message: 'Failed to delete people',
    };
  }
};

/**
 * Bulk Favourite/Unfavourite People
 * Toggles favourite status for selected people
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
        .from('people')
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
          ? `Successfully ${action} ${successCount} people`
          : `${action} ${successCount} people with ${errors.length} errors`,
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
 * Bulk Export People to CSV
 * Downloads selected people as CSV file
 */
export const bulkExportPeople = async (
  peopleIds: string[]
): Promise<BulkOperationResult> => {
  try {
    // Fetch all selected people with company data
    const { data, error } = await supabase
      .from('people')
      .select(
        `
        id,
        name,
        email_address,
        company_role,
        employee_location,
        linkedin_url,
        score,
        people_stage,
        created_at,
        companies!left(name, website, industry)
      `
      )
      .in('id', peopleIds);

    if (error) throw error;

    // Convert to CSV format
    const people = data as Person[];
    const headers = [
      'Name',
      'Email',
      'Role',
      'Location',
      'Company',
      'Company Website',
      'Industry',
      'LinkedIn',
      'Score',
      'Stage',
      'Created Date',
    ];

    const csvRows = [
      headers.join(','),
      ...people.map(person =>
        [
          `"${person.name || ''}"`,
          `"${person.email_address || ''}"`,
          `"${person.company_role || ''}"`,
          `"${person.employee_location || ''}"`,
          `"${person.company_name || ''}"`,
          `"${person.company_website || ''}"`,
          `"${(person.companies as Record<string, unknown>)?.industry || ''}"`,
          `"${person.linkedin_url || ''}"`,
          `"${person.score || ''}"`,
          `"${person.people_stage || ''}"`,
          `"${person.created_at ? new Date(person.created_at).toLocaleDateString() : ''}"`,
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
      `people_export_${new Date().toISOString().split('T')[0]}.csv`
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
      message: `Successfully exported ${people.length} people to CSV`,
    };
  } catch (error) {
    return {
      success: false,
      successCount: 0,
      errorCount: peopleIds.length,
      errors: [{ id: 'all', error: (error as Error).message }],
      message: 'Failed to export people',
    };
  }
};

/**
 * Bulk Sync People to CRM (n8n webhook)
 * Sends selected people to n8n webhook for CRM synchronization
 */
export const bulkSyncToCRM = async (
  peopleIds: string[]
): Promise<BulkOperationResult> => {
  try {
    // Fetch all selected people with full details
    const { data, error } = await supabase
      .from('people')
      .select(
        `
        *,
        companies!left(*)
      `
      )
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
        message:
          'CRM sync not configured. Please set VITE_N8N_WEBHOOK_URL in .env',
      };
    }

    // Send to n8n webhook
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'bulk_sync_people',
        people: data,
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
      message: `Successfully synced ${peopleIds.length} people to CRM`,
    };
  } catch (error) {
    return {
      success: false,
      successCount: 0,
      errorCount: peopleIds.length,
      errors: [{ id: 'all', error: (error as Error).message }],
      message: 'Failed to sync people to CRM',
    };
  }
};

/**
 * Bulk Add People to Campaign
 * Enrolls selected people in a specific campaign
 */
export const bulkAddToCampaign = async (
  peopleIds: string[],
  campaignId: string
): Promise<BulkOperationResult> => {
  const errors: Array<{ id: string; error: string }> = [];
  let successCount = 0;

  try {
    // First check if campaign exists
    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .select('id, name')
      .eq('id', campaignId)
      .single();

    if (campaignError || !campaign) {
      return {
        success: false,
        successCount: 0,
        errorCount: peopleIds.length,
        errors: [{ id: 'campaign', error: 'Campaign not found' }],
        message: 'Invalid campaign ID',
      };
    }

    // Process in batches
    for (let i = 0; i < peopleIds.length; i += BATCH_SIZE) {
      const batch = peopleIds.slice(i, i + BATCH_SIZE);

      // Create campaign participant records
      const participants = batch.map(personId => ({
        campaign_id: campaignId,
        person_id: personId,
        status: 'active',
        enrolled_at: new Date().toISOString(),
      }));

      const { error } = await supabase
        .from('campaign_participants')
        .upsert(participants, {
          onConflict: 'campaign_id,person_id',
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
          ? `Successfully added ${successCount} people to ${campaign.name}`
          : `Added ${successCount} people to ${campaign.name} with ${errors.length} errors`,
    };
  } catch (error) {
    return {
      success: false,
      successCount,
      errorCount: peopleIds.length - successCount,
      errors: [{ id: 'all', error: (error as Error).message }],
      message: 'Failed to add people to campaign',
    };
  }
};

/**
 * Bulk Update People Stage
 * Updates the stage for selected people
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
        .from('people')
        .update({
          people_stage: newStage,
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
          ? `Successfully updated ${successCount} people to ${newStage}`
          : `Updated ${successCount} people with ${errors.length} errors`,
    };
  } catch (error) {
    return {
      success: false,
      successCount,
      errorCount: peopleIds.length - successCount,
      errors: [{ id: 'all', error: (error as Error).message }],
      message: 'Failed to update people stage',
    };
  }
};
