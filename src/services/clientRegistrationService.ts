import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/database';
import { createClient } from '@supabase/supabase-js';

// NOTE: Client registration removed - multi-tenant feature not in PDR
// This service is kept for backward compatibility but will not create clients
export interface ClientRegistrationData {
  name: string;
  email: string;
  companyName: string;
  fullName?: string;
  industry?: string;
  contactPhone?: string;
  password?: string;
}

// Get admin client for server-side operations (only works in API routes or server components)
function getAdminClient() {
  // Only works in server-side context (API routes, server components)
  if (typeof window !== 'undefined') {
    throw new Error(
      'Admin client can only be used server-side. Use API route /api/clients/invite instead.'
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing Supabase admin credentials');
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export interface ClientRegistrationResult {
  success: boolean;
  userProfile?: UserProfile;
  error?: string;
}

/**
 * Register user (simplified - no multi-tenant clients per PDR)
 *
 * 1. Creates Supabase auth user
 * 2. Creates user profile
 *
 * @param registrationData - User registration information
 * @returns Registration result with user data
 */
export async function registerNewClient(
  registrationData: ClientRegistrationData
): Promise<ClientRegistrationResult> {
  try {
    // Validate input
    if (!registrationData.email || !registrationData.name) {
      return {
        success: false,
        error: 'Missing required fields (email and name)',
      };
    }

    const fullName =
      registrationData.fullName || registrationData.email.split('@')[0];

    // If no password provided, use API route for server-side registration with invitation
    if (!registrationData.password) {
      const response = await fetch('/api/clients/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: registrationData.name,
          email: registrationData.email,
          companyName: registrationData.companyName,
          fullName: fullName,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to create user');
      }

      return {
        success: true,
        userProfile: result.userProfile as UserProfile,
      };
    }

    // Password provided: Use regular sign-up flow
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: registrationData.email,
      password: registrationData.password,
      options: {
        data: {
          full_name: fullName,
          company: registrationData.companyName,
        },
      },
    });

    if (authError) throw authError;
    if (!authData.user) {
      throw new Error('Failed to create user');
    }

    const userId = authData.user.id;

    // Create user profile
    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        id: userId,
        email: registrationData.email,
        full_name: registrationData.fullName || registrationData.name,
        role: 'owner',
        is_active: true,
      })
      .select()
      .single();

    if (profileError) {
      console.error('Error creating user profile:', profileError);
      await supabase.auth.admin.deleteUser(userId);
      throw profileError;
    }

    return {
      success: true,
      userProfile: profileData as UserProfile,
    };
  } catch (error) {
    console.error('User registration error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to register user',
    };
  }
}

/**
 * Register user via OAuth (Google/LinkedIn) - simplified per PDR
 * This is called after OAuth completion
 */
export async function registerClientAfterOAuth(
  userId: string,
  email: string,
  metadata: {
    full_name?: string;
    company?: string;
  }
): Promise<ClientRegistrationResult> {
  try {
    // Create user profile
    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        id: userId,
        email,
        full_name: metadata.full_name || email.split('@')[0],
        role: 'owner',
        is_active: true,
      })
      .select()
      .single();

    if (profileError) {
      // Check if profile already exists
      if (profileError.code !== '23505') {
        throw profileError;
      }
    }

    return {
      success: true,
      userProfile: profileData as UserProfile,
    };
  } catch (error) {
    console.error('OAuth user registration error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to register user',
    };
  }
}
