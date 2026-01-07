import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { syncLemlistLeadByEmail } from '@/services/lemlistSyncService';

/**
 * Sync a single lead by email from a lemlist campaign
 * POST /api/lemlist/sync/lead
 * Body: { campaignId: string, email: string }
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { campaignId, email } = body;

    if (!campaignId || !email) {
      return NextResponse.json(
        { error: 'Campaign ID and email are required' },
        { status: 400 }
      );
    }

    // Sync the lead
    const result = await syncLemlistLeadByEmail(
      user.id,
      campaignId,
      email,
      supabase
    );

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('Error syncing lemlist lead:', error);
    return NextResponse.json(
      {
        error: 'Failed to sync lead',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
