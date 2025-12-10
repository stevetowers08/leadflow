#!/usr/bin/env node

/**
 * Script to create steve@polarislabs.io as a proper Supabase user
 * Uses Supabase Admin API - no bypasses
 * Usage: node scripts/admin/create-steve-user.js
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

async function createSteveUser() {
  try {
    const email = 'steve@polarislabs.io';
    const fullName = 'Steve Towers';
    
    console.log(`🔍 Checking if user exists: ${email}`);
    console.log('');

    // 1. Check if user already exists
    const { data: users, error: listError } =
      await supabase.auth.admin.listUsers();

    if (listError) {
      throw new Error(`Failed to list users: ${listError.message}`);
    }

    const existingUser = users.users.find(u => u.email?.toLowerCase() === email.toLowerCase());

    if (existingUser) {
      console.log(`✅ User already exists: ${email} (ID: ${existingUser.id})`);
      
      // Ensure user_profile exists
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .upsert(
          {
            id: existingUser.id,
            email: email,
            full_name: fullName,
            role: 'owner',
            is_active: true,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'id' }
        )
        .select();

      if (profileError) {
        throw new Error(`Failed to update user_profiles: ${profileError.message}`);
      }

      console.log('   ✅ User profile updated');
      console.log('');
      console.log('📝 User details:');
      console.log(`   Email: ${email}`);
      console.log(`   ID: ${existingUser.id}`);
      console.log(`   Role: owner`);
      console.log('');
      console.log('💡 User can sign in with their existing password');
      return;
    }

    // 2. Create new user via admin API
    console.log(`📋 Creating new user: ${email}`);
    const { data: userData, error: createError } = await supabase.auth.admin.createUser({
      email: email,
      email_confirm: true, // Auto-confirm email
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

    // 3. Create user profile
    console.log('📋 Creating user profile...');
    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        id: userData.user.id,
        email: email,
        full_name: fullName,
        role: 'owner',
        is_active: true,
      })
      .select()
      .single();

    if (profileError) {
      // If profile already exists, update it
      if (profileError.code === '23505') {
        const { data: updatedProfile, error: updateError } = await supabase
          .from('user_profiles')
          .update({
            email: email,
            full_name: fullName,
            role: 'owner',
            is_active: true,
            updated_at: new Date().toISOString(),
          })
          .eq('id', userData.user.id)
          .select()
          .single();

        if (updateError) {
          throw new Error(`Failed to update user_profiles: ${updateError.message}`);
        }
        console.log('   ✅ User profile updated');
      } else {
        throw new Error(`Failed to create user_profiles: ${profileError.message}`);
      }
    } else {
      console.log('   ✅ User profile created');
    }

    // 4. Generate password reset link (user will set their password)
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

    console.log('');
    console.log('🎉 Successfully created user!');
    console.log('');
    console.log('📝 User details:');
    console.log(`   Email: ${email}`);
    console.log(`   ID: ${userData.user.id}`);
    console.log(`   Role: owner`);
    console.log(`   Full Name: ${fullName}`);
    console.log('');
    console.log('💡 Next steps:');
    console.log('   1. User should use the password reset link to set their password');
    console.log('   2. Or user can use "Forgot Password" on the login page');
    console.log('   3. User can then sign in normally');
  } catch (error) {
    console.error('');
    console.error('❌ Error:', error.message);
    console.error('');
    process.exit(1);
  }
}

createSteveUser();

