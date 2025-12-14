import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

/**
 * Note: This file uses server-side Supabase client
 * Do not import client-side Supabase here
 */

/**
 * Common helper functions for admin API routes
 */

const ALLOWED_ROLES = ['user', 'admin', 'manager', 'viewer'] as const;
export type AllowedRole = (typeof ALLOWED_ROLES)[number];

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
}

/**
 * Validate UUID format
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Validate role
 */
export function isValidRole(role: string): role is AllowedRole {
  return ALLOWED_ROLES.includes(role as AllowedRole);
}

/**
 * Check if user is admin or owner
 */
export async function checkAdminPermission(
  userId: string
): Promise<{ authorized: boolean; error?: NextResponse }> {
  const supabase = await createClient();

  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', userId)
    .single();

  if (profileError || !profile) {
    return {
      authorized: false,
      error: NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      ),
    };
  }

  if (!['admin', 'owner'].includes(profile.role)) {
    return {
      authorized: false,
      error: NextResponse.json(
        { error: 'Insufficient permissions. Admin or owner role required.' },
        { status: 403 }
      ),
    };
  }

  return { authorized: true };
}

/**
 * Get authenticated user
 */
export async function getAuthenticatedUser(): Promise<{
  user: { id: string; email?: string } | null;
  error?: NextResponse;
}> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      user: null,
      error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    };
  }

  return { user };
}

/**
 * Standard error response
 */
export function errorResponse(
  message: string,
  status: number = 400
): NextResponse {
  return NextResponse.json({ error: message }, { status });
}

/**
 * Standard success response
 */
export function successResponse<T>(data: T, message?: string): NextResponse {
  const response: Record<string, unknown> = {
    success: true,
  };

  if (message) {
    response.message = message;
  }

  if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
    Object.assign(response, data);
  } else {
    response.data = data;
  }

  return NextResponse.json(response);
}
