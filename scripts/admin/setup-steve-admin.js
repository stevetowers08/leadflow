#!/usr/bin/env node

/**
 * Complete setup script for steve@polarislabs.io as admin
 * Creates user in auth.users if needed, then sets admin role
 * Usage: node scripts/admin/setup-steve-admin.js
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = 
  process.env.NEXT_PUBLIC_SUPABASE_URL || 
  process.env.VITE_SUPABASE_URL;
const serviceRoleKey = 
  process.env.SUPABASE_SERVICE_ROLE_KEY || 
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   NEXT_PUBLIC_SUPABASE_URL or VITE_SUPABASE_URL');
  console.error('   SUPABASE_SERVICE_ROLE_KEY or VITE_SUPABASE_SERVICE_ROLE_KEY');
  console.error('');
  console.error('Please check your .env.local file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function setupSteveAdmin() {
  try {
    const email = 'steve@polarislabs.io';
    const fullName = 'Steve Towers';
    const password = 'TempPassword123!'; // User should change this
    
    console.log('🚀 Setting up steve@polarislabs.io as admin...');
    console.log('');

    // 1. Check if user already exists
    console.log('📋 Checking if user exists...');
    const { data: users, error: listError } =
      await supabase.auth.admin.listUsers();

    if (listError) {
      throw new Error(`Failed to list users: ${listError.message}`);
    }

    let user = users.users.find(u => u.email?.toLowerCase() === email.toLowerCase());
    let userId;

    if (user) {
      console.log(`✅ User already exists: ${email} (ID: ${user.id})`);
      userId = user.id;
    } else {
      // 2. Create new user via admin API
      console.log(`📋 Creating new user: ${email}`);
      const { data: userData, error: createError } = await supabase.auth.admin.createUser({
        email: email,
        email_confirm: true, // Auto-confirm email
        password: password,
        user_metadata: {
          full_name: fullName,
        },
        app_metadata: {
          provider: 'email',
          providers: ['email'],
        },
      });

      if (createError) {
        throw new Error(`Failed to create user: ${createError.message}`);
      }

      if (!userData.user) {
        throw new Error('Failed to create user - no user data returned');
      }

      console.log(`   ✅ User created: ${userData.user.id}`);
      userId = userData.user.id;
      user = userData.user;
    }

    // 3. Update auth.users metadata with admin role
    console.log('📋 Updating auth.users metadata...');
    const { error: updateAuthError } = await supabase.auth.admin.updateUserById(
      userId,
      {
        user_metadata: {
          ...user.user_metadata,
          role: 'admin',
          full_name: fullName,
        },
        app_metadata: {
          ...user.app_metadata,
          role: 'admin',
        },
      }
    );

    if (updateAuthError) {
      throw new Error(`Failed to update auth users: ${updateAuthError.message}`);
    }
    console.log('   ✅ Auth metadata updated');

    // 4. Upsert user_profiles table with admin role
    console.log('📋 Creating/updating user profile...');
    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .upsert(
        {
          id: userId,
          email: email,
          full_name: fullName,
          role: 'admin',
          user_limit: 1000,
          is_active: true,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      )
      .select()
      .single();

    if (profileError) {
      throw new Error(`Failed to update user_profiles: ${profileError.message}`);
    }

    console.log('   ✅ User profile created/updated');

    // 5. Generate password reset link if user was just created
    if (!user) {
      console.log('📋 Generating password reset link...');
      const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
        type: 'recovery',
        email: email,
      });

      if (linkError) {
        console.warn('   ⚠️  Could not generate password reset link:', linkError.message);
        console.log('   💡 User can use "Forgot Password" to set their password');
      } else {
        const resetLink = linkData?.properties?.action_link;
        console.log('   ✅ Password reset link generated');
        console.log('');
        console.log('🔗 Password Reset Link:');
        console.log(`   ${resetLink}`);
        console.log('');
      }
    }

    console.log('');
    console.log('🎉 Successfully set up user as admin!');
    console.log('');
    console.log('📝 User details:');
    console.log(`   Email: ${email}`);
    console.log(`   ID: ${userId}`);
    console.log(`   Role: admin`);
    console.log(`   Full Name: ${fullName}`);
    console.log(`   Status: Active`);
    console.log('');
    
    if (!user) {
      console.log('💡 Next steps:');
      console.log('   1. Use the password reset link above to set your password');
      console.log('   2. Or use "Forgot Password" on the login page');
      console.log('   3. Sign in with your email and new password');
    } else {
      console.log('💡 User can now sign in with their existing password');
      console.log('   If they need to reset password, use "Forgot Password"');
    }
    console.log('');
    console.log('✅ Admin access is now configured!');
  } catch (error) {
    console.error('');
    console.error('❌ Error:', error.message);
    console.error('');
    if (error.stack) {
      console.error('Stack trace:', error.stack);
    }
    process.exit(1);
  }
}

setupSteveAdmin();

