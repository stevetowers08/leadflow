import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const adminClient = createServerSupabaseClient();

    const body = await request.json();
    const { name, email, companyName, fullName } = body;

    if (!email || !name) {
      return NextResponse.json(
        { error: 'Email and company name are required' },
        { status: 400 }
      );
    }

    const userName = fullName || email.split('@')[0];

    // Step 1: Create auth user via admin API
    const { data: userData, error: createError } = await adminClient.auth.admin.createUser({
      email: email,
      email_confirm: false, // User needs to confirm via invitation link
      user_metadata: {
        full_name: userName,
        company: companyName || name,
      },
    });

    if (createError) {
      console.error('Error creating user:', createError);
      return NextResponse.json(
        { error: 'Failed to create user', details: createError.message },
        { status: 400 }
      );
    }

    if (!userData.user) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      );
    }

    const userId = userData.user.id;

    // Step 2: Generate invitation link
    const { data: linkData, error: linkError } = await adminClient.auth.admin.generateLink({
      type: 'invite',
      email: email,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:8086'}/auth/callback?type=invite`,
      },
    });

    let invitationLink: string | null = null;
    if (linkError) {
      console.warn('Failed to generate invitation link:', linkError);
    } else {
      invitationLink = linkData?.properties?.action_link || null;
    }

    // Step 3: Create user profile
    const { data: profileData, error: profileError } = await adminClient
      .from('user_profiles')
      .insert({
        id: userId,
        email: email,
        full_name: userName,
        role: 'owner',
        is_active: true,
      })
      .select()
      .single();

    if (profileError) {
      console.error('Error creating user profile:', profileError);
      // Clean up auth user
      await adminClient.auth.admin.deleteUser(userId);
      return NextResponse.json(
        { error: 'Failed to create user profile', details: profileError.message },
        { status: 500 }
      );
    }

    // Step 4: Create client record
    const { data: clientData, error: clientError } = await adminClient
      .from('clients')
      .insert({
        name: name,
        email: email,
        company: companyName || name,
        accounts: {},
      })
      .select()
      .single();

    if (clientError) {
      console.error('Error creating client:', clientError);
      // Clean up on failure
      await adminClient.from('user_profiles').delete().eq('id', userId);
      await adminClient.auth.admin.deleteUser(userId);
      return NextResponse.json(
        { error: 'Failed to create client', details: clientError.message },
        { status: 500 }
      );
    }

    // Step 5: Link user to client
    const { error: clientUserError } = await adminClient
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
      await adminClient.from('clients').delete().eq('id', clientData.id);
      await adminClient.from('user_profiles').delete().eq('id', userId);
      await adminClient.auth.admin.deleteUser(userId);
      return NextResponse.json(
        { error: 'Failed to link user to client', details: clientUserError.message },
        { status: 500 }
      );
    }

    // Step 6: Create default job filter config (optional, non-critical)
    try {
      await adminClient
        .from('job_filter_configs')
        .insert({
          client_id: clientData.id,
          user_id: userId,
          config_name: 'Default Configuration',
          platform: 'linkedin',
          is_active: true,
        });
    } catch (err) {
      console.warn('Failed to create default filter config (non-critical):', err);
    }

    return NextResponse.json({
      success: true,
      client: clientData,
      userProfile: profileData,
      invitationLink: invitationLink,
    });
  } catch (error) {
    console.error('Error in client registration:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}





