import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Admin-only API route to invite users
 * Uses Supabase's built-in inviteUserByEmail for secure magic links
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin/owner
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      );
    }

    if (!['admin', 'owner'].includes(profile.role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions. Admin or owner role required.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { email, role = 'user' } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email address is required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const { data: existingUser } =
      await supabase.auth.admin.getUserByEmail(email);

    if (existingUser?.user) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Check for existing pending invitation
    const { data: existingInvitation } = await supabase
      .from('invitations')
      .select('*')
      .eq('email', email.toLowerCase())
      .eq('status', 'pending')
      .single();

    if (existingInvitation) {
      return NextResponse.json(
        { error: 'Invitation already sent to this email' },
        { status: 400 }
      );
    }

    // Get admin client for inviteUserByEmail
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

    // Create invitation record first (for tracking)
    const { data: invitation, error: inviteError } = await supabase
      .from('invitations')
      .insert({
        email: email.toLowerCase(),
        role,
        invited_by: user.id,
        expires_at: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000
        ).toISOString(), // 7 days
      })
      .select()
      .single();

    if (inviteError) {
      console.error('Error creating invitation record:', inviteError);
      return NextResponse.json(
        { error: 'Failed to create invitation record' },
        { status: 500 }
      );
    }

    // Send invitation via Supabase (magic link)
    const redirectTo = `${process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin}/auth/accept-invite?token=${invitation.token}`;

    const { data: inviteData, error: inviteUserError } =
      await adminClient.auth.admin.inviteUserByEmail(email, {
        redirectTo,
        data: {
          role,
          invitation_id: invitation.id,
        },
      });

    if (inviteUserError) {
      // Rollback invitation record
      await supabase.from('invitations').delete().eq('id', invitation.id);

      console.error('Error sending invitation:', inviteUserError);
      return NextResponse.json(
        {
          error: inviteUserError.message || 'Failed to send invitation email',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      invitation: {
        id: invitation.id,
        email: invitation.email,
        role: invitation.role,
        expires_at: invitation.expires_at,
      },
      message: 'Invitation sent successfully',
    });
  } catch (error) {
    console.error('Unexpected error in invite route:', error);
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
