import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Resend invitation email
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || !['admin', 'owner'].includes(profile.role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { invitationId } = body;

    if (!invitationId) {
      return NextResponse.json(
        { error: 'Invitation ID is required' },
        { status: 400 }
      );
    }

    // Get invitation
    const { data: invitation, error: inviteError } = await supabase
      .from('invitations')
      .select('*')
      .eq('id', invitationId)
      .single();

    if (inviteError || !invitation) {
      return NextResponse.json(
        { error: 'Invitation not found' },
        { status: 404 }
      );
    }

    if (invitation.status !== 'pending') {
      return NextResponse.json(
        { error: 'Can only resend pending invitations' },
        { status: 400 }
      );
    }

    // Check if expired
    if (new Date(invitation.expires_at) < new Date()) {
      // Extend expiration
      await supabase
        .from('invitations')
        .update({
          expires_at: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
          ).toISOString(),
        })
        .eq('id', invitationId);
    }

    // Resend via Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const { createClient: createAdminClient } =
      await import('@supabase/supabase-js');
    const adminClient = createAdminClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const redirectTo = `${process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin}/auth/accept-invite?token=${invitation.token}`;

    const { error: inviteUserError } =
      await adminClient.auth.admin.inviteUserByEmail(invitation.email, {
        redirectTo,
        data: {
          role: invitation.role,
          invitation_id: invitation.id,
        },
      });

    if (inviteUserError) {
      console.error('Error resending invitation:', inviteUserError);
      return NextResponse.json(
        {
          error: inviteUserError.message || 'Failed to resend invitation',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Invitation resent successfully',
    });
  } catch (error) {
    console.error('Unexpected error in resend route:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}
