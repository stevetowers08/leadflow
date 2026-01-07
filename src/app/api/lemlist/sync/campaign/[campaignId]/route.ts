import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { syncLemlistCampaign } from '@/services/lemlistSyncService';

/**
 * Sync activity data from a lemlist campaign
 * GET /api/lemlist/sync/campaign/[campaignId]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { campaignId: string } }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const campaignId = params.campaignId;

    if (!campaignId) {
      return NextResponse.json(
        { error: 'Campaign ID is required' },
        { status: 400 }
      );
    }

    // Sync the campaign
    const result = await syncLemlistCampaign(user.id, campaignId, supabase);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('Error syncing lemlist campaign:', error);
    return NextResponse.json(
      {
        error: 'Failed to sync campaign',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
