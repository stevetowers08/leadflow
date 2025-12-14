import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import {
  getAuthenticatedUser,
  checkAdminPermission,
  isValidUUID,
  errorResponse,
  successResponse,
} from '@/lib/api/admin-helpers';

/**
 * Resend invitation email
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

    const { invitationId } = body;

    if (!invitationId || typeof invitationId !== 'string') {
      return errorResponse('Invitation ID is required', 400);
    }

    if (!isValidUUID(invitationId)) {
      return errorResponse('Invalid invitation ID format', 400);
    }

    const supabase = await createClient();

    // Get invitation
    const { data: invitation, error: inviteError } = await supabase
      .from('invitations')
      .select('*')
      .eq('id', invitationId)
      .maybeSingle();

    if (inviteError || !invitation) {
      return errorResponse('Invitation not found', 404);
    }

    if (invitation.status !== 'pending') {
      return errorResponse('Can only resend pending invitations', 400);
    }

    // Check if user owns the invitation or is admin (RLS should handle this, but double-check)
    if (invitation.invited_by !== user.id) {
      // Verify user is admin (already checked, but extra safety)
      const { authorized } = await checkAdminPermission(user.id);
      if (!authorized) {
        return errorResponse(
          'You can only resend invitations you created',
          403
        );
      }
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
      return errorResponse(
        inviteUserError.message || 'Failed to resend invitation',
        500
      );
    }

    return successResponse({}, 'Invitation resent successfully');
  } catch (error) {
    console.error('Unexpected error in resend route:', error);
    return errorResponse(
      error instanceof Error ? error.message : 'An unexpected error occurred',
      500
    );
  }
}
