#!/usr/bin/env node

/**
 * Script to set a user as admin role
 * Updates both auth.users metadata and user_profiles table
 * Usage: node scripts/admin/set-admin-user.js <user-email>
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// Try both environment variable names for compatibility
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

async function setUserAsAdmin(userEmail) {
  try {
    console.log(`🔍 Looking for user: ${userEmail}`);
    console.log('');

    // 1. Find user in auth.users
    const { data: users, error: listError } =
      await supabase.auth.admin.listUsers();

    if (listError) {
      throw new Error(`Failed to list users: ${listError.message}`);
    }

    const user = users.users.find(u => u.email?.toLowerCase() === userEmail.toLowerCase());

    if (!user) {
      console.error(`❌ User not found: ${userEmail}`);
      console.log('');
      console.log('Available users:');
      users.users.forEach(u => console.log(`  - ${u.email || 'no email'}`));
      console.log('');
      console.log('💡 Tip: User must sign in at least once to be created in auth.users');
      process.exit(1);
    }

    console.log(`✅ Found user: ${user.email} (ID: ${user.id})`);

    // 2. Update auth.users metadata
    console.log('📋 Updating auth.users metadata...');
    const { error: updateAuthError } = await supabase.auth.admin.updateUserById(
      user.id,
      {
        user_metadata: {
          ...user.user_metadata,
          role: 'admin',
        },
      }
    );

    if (updateAuthError) {
      throw new Error(`Failed to update auth users: ${updateAuthError.message}`);
    }
    console.log('   ✅ Auth metadata updated');

    // 3. Upsert user_profiles table
    console.log('📋 Updating user_profiles table...');
    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .upsert(
        {
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || user.user_metadata?.name || null,
          role: 'admin',
          user_limit: 1000,
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
    console.log('🎉 Successfully set user as admin!');
    console.log('');
    console.log('📝 User details:');
    console.log(`   Email: ${user.email}`);
    console.log(`   ID: ${user.id}`);
    console.log(`   Role: admin`);
    console.log('');
    console.log('🔄 User should refresh their browser to see admin privileges');
  } catch (error) {
    console.error('');
    console.error('❌ Error:', error.message);
    console.error('');
    process.exit(1);
  }
}

// Get email from command line arguments
const userEmail = process.argv[2];

if (!userEmail) {
  console.log('Usage: node scripts/admin/set-admin-user.js <user-email>');
  console.log('');
  console.log('Example: node scripts/admin/set-admin-user.js steve@polarislabs.io');
  console.log('');
  process.exit(1);
}

setUserAsAdmin(userEmail);
