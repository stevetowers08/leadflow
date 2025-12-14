import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import {
  getAuthenticatedUser,
  checkAdminPermission,
  isValidEmail,
  isValidRole,
  errorResponse,
  successResponse,
  type AllowedRole,
} from '@/lib/api/admin-helpers';

/**
 * Admin-only API route to invite users
 * Uses Supabase's built-in inviteUserByEmail for secure magic links
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const { user, error: authError } = await getAuthenticatedUser();
    if (authError || !user) {
      return authError || errorResponse('Unauthorized', 401);
    }

    // Check admin permission
    const { authorized, error: permError } = await checkAdminPermission(
      user.id
    );
    if (!authorized || permError) {
      return permError || errorResponse('Insufficient permissions', 403);
    }

    // Parse and validate request body
    let body;
    try {
      body = await request.json();
    } catch {
      return errorResponse('Invalid request body', 400);
    }

    const { email, role = 'user' } = body;

    // Validate email
    if (!email || typeof email !== 'string') {
      return errorResponse('Email address is required', 400);
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (!isValidEmail(normalizedEmail)) {
      return errorResponse('Invalid email address format', 400);
    }

    // Validate role
    if (!isValidRole(role)) {
      return errorResponse(
        `Invalid role. Must be one of: ${['user', 'admin', 'manager', 'viewer'].join(', ')}`,
        400
      );
    }

    const supabase = await createClient();

    // Check if user already exists
    const { data: existingUser } =
      await supabase.auth.admin.getUserByEmail(normalizedEmail);

    if (existingUser?.user) {
      return errorResponse('User with this email already exists', 400);
    }

    // Check for existing pending invitation
    const { data: existingInvitation } = await supabase
      .from('invitations')
      .select('*')
      .eq('email', normalizedEmail)
      .eq('status', 'pending')
      .maybeSingle();

    if (existingInvitation) {
      return errorResponse('Invitation already sent to this email', 400);
    }

    // Get admin client for inviteUserByEmail
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return errorResponse('Server configuration error', 500);
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
        email: normalizedEmail,
        role: role as AllowedRole,
        invited_by: user.id,
        expires_at: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000
        ).toISOString(), // 7 days
      })
      .select()
      .single();

    if (inviteError) {
      console.error('Error creating invitation record:', inviteError);
      return errorResponse('Failed to create invitation record', 500);
    }

    // Send invitation via Supabase (magic link)
    const redirectTo = `${process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin}/auth/accept-invite?token=${invitation.token}`;

    const { error: inviteUserError } =
      await adminClient.auth.admin.inviteUserByEmail(normalizedEmail, {
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
      return errorResponse(
        inviteUserError.message || 'Failed to send invitation email',
        500
      );
    }

    return successResponse(
      {
        invitation: {
          id: invitation.id,
          email: invitation.email,
          role: invitation.role,
          expires_at: invitation.expires_at,
        },
      },
      'Invitation sent successfully'
    );
  } catch (error) {
    console.error('Unexpected error in invite route:', error);
    return errorResponse(
      error instanceof Error ? error.message : 'An unexpected error occurred',
      500
    );
  }
}
