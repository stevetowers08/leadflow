import { supabase } from '@/integrations/supabase/client';
import { Client, UserProfile } from '@/types/database';

export interface ClientRegistrationData {
  name: string;
  email: string;
  companyName: string;
  password: string;
  fullName?: string;
  industry?: string;
  contactPhone?: string;
}

export interface ClientRegistrationResult {
  success: boolean;
  client?: Client;
  userProfile?: UserProfile;
  error?: string;
}

/**
 * Complete client registration process
 *
 * 1. Creates Supabase auth user
 * 2. Creates user profile
 * 3. Creates client record
 * 4. Links user to client (client_users)
 * 5. Creates default job filter config
 *
 * @param registrationData - Client registration information
 * @returns Registration result with client and user data
 */
export async function registerNewClient(
  registrationData: ClientRegistrationData
): Promise<ClientRegistrationResult> {
  try {
    // Validate input
    if (
      !registrationData.email ||
      !registrationData.password ||
      !registrationData.name
    ) {
      return {
        success: false,
        error: 'Missing required fields',
      };
    }

    // Step 1: Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: registrationData.email,
      password: registrationData.password,
      options: {
        data: {
          full_name: registrationData.fullName || registrationData.name,
          company: registrationData.companyName,
        },
      },
    });

    if (authError) throw authError;
    if (!authData.user) {
      throw new Error('Failed to create user');
    }

    const userId = authData.user.id;

    // Step 2: Create user profile
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
      // Clean up auth user if profile creation fails
      await supabase.auth.admin.deleteUser(userId);
      throw profileError;
    }

    // Step 3: Create client record
    const { data: clientData, error: clientError } = await supabase
      .from('clients')
      .insert({
        name: registrationData.name,
        company_name: registrationData.companyName,
        contact_email: registrationData.email,
        contact_phone: registrationData.contactPhone,
        industry: registrationData.industry,
        subscription_tier: 'starter',
        subscription_status: 'trial',
        is_active: true,
        settings: {},
      })
      .select()
      .single();

    if (clientError) {
      console.error('Error creating client:', clientError);
      // Clean up on failure
      await supabase.from('user_profiles').delete().eq('id', userId);
      await supabase.auth.admin.deleteUser(userId);
      throw clientError;
    }

    // Step 4: Link user to client
    const { error: clientUserError } = await supabase
      .from('client_users')
      .insert({
        client_id: clientData.id,
        user_id: userId,
        role: 'owner',
        is_primary_contact: true,
      });

    if (clientUserError) {
      console.error('Error linking user to client:', clientUserError);
      // Clean up on failure
      await supabase.from('clients').delete().eq('id', clientData.id);
      await supabase.from('user_profiles').delete().eq('id', userId);
      await supabase.auth.admin.deleteUser(userId);
      throw clientUserError;
    }

    // Step 5: Create default job filter config (optional)
    const { error: configError } = await supabase
      .from('job_filter_configs')
      .insert({
        client_id: clientData.id,
        user_id: userId,
        config_name: 'Default Configuration',
        is_active: true,
      });

    if (configError) {
      console.warn(
        'Warning: Could not create default filter config:',
        configError
      );
      // Don't fail the whole registration for this
    }

    return {
      success: true,
      client: clientData as Client,
      userProfile: profileData as UserProfile,
    };
  } catch (error: any) {
    console.error('Client registration error:', error);
    return {
      success: false,
      error: error.message || 'Failed to register client',
    };
  }
}

/**
 * Register client via OAuth (Google/LinkedIn)
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
    const companyName = metadata.company || metadata.full_name || 'New Client';

    // Step 1: Create user profile
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

    // Step 2: Create client record
    const { data: clientData, error: clientError } = await supabase
      .from('clients')
      .insert({
        name: metadata.full_name || companyName,
        company_name: companyName,
        contact_email: email,
        subscription_tier: 'starter',
        subscription_status: 'trial',
        is_active: true,
        settings: {},
      })
      .select()
      .single();

    if (clientError) throw clientError;

    // Step 3: Link user to client
    const { error: clientUserError } = await supabase
      .from('client_users')
      .insert({
        client_id: clientData.id,
        user_id: userId,
        role: 'owner',
        is_primary_contact: true,
      });

    if (clientUserError) throw clientUserError;

    return {
      success: true,
      client: clientData as Client,
      userProfile: profileData as UserProfile,
    };
  } catch (error: any) {
    console.error('OAuth client registration error:', error);
    return {
      success: false,
      error: error.message || 'Failed to register client',
    };
  }
}
