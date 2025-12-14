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
 * Cancel invitation
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

    // Get invitation to check ownership
    const { data: invitation, error: inviteError } = await supabase
      .from('invitations')
      .select('id, status, invited_by')
      .eq('id', invitationId)
      .maybeSingle();

    if (inviteError || !invitation) {
      return errorResponse('Invitation not found', 404);
    }

    if (invitation.status !== 'pending') {
      return errorResponse('Can only cancel pending invitations', 400);
    }

    // Check if user owns the invitation or is admin
    if (invitation.invited_by !== user.id) {
      // Verify user is admin (already checked, but extra safety)
      const { authorized } = await checkAdminPermission(user.id);
      if (!authorized) {
        return errorResponse(
          'You can only cancel invitations you created',
          403
        );
      }
    }

    // Update invitation status
    const { error: updateError } = await supabase
      .from('invitations')
      .update({ status: 'cancelled', updated_at: new Date().toISOString() })
      .eq('id', invitationId)
      .eq('status', 'pending'); // Only cancel pending invitations

    if (updateError) {
      console.error('Error cancelling invitation:', updateError);
      return errorResponse('Failed to cancel invitation', 500);
    }

    return successResponse({}, 'Invitation cancelled successfully');
  } catch (error) {
    console.error('Unexpected error in cancel route:', error);
    return errorResponse(
      error instanceof Error ? error.message : 'An unexpected error occurred',
      500
    );
  }
}
