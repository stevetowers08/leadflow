#!/usr/bin/env node

/**
 * Script to update a user's password via Supabase Admin API
 * Usage: node scripts/admin/update-user-password.js <user-email> <new-password>
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

async function updateUserPassword(userEmail, newPassword) {
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
      process.exit(1);
    }

    console.log(`✅ Found user: ${user.email} (ID: ${user.id})`);

    // 2. Update password via admin API
    console.log('🔐 Updating password...');
    const { data: updateData, error: updateError } = await supabase.auth.admin.updateUserById(
      user.id,
      {
        password: newPassword,
      }
    );

    if (updateError) {
      throw new Error(`Failed to update password: ${updateError.message}`);
    }

    console.log('   ✅ Password updated successfully');
    console.log('');
    console.log('🎉 Success!');
    console.log('');
    console.log('📝 User details:');
    console.log(`   Email: ${user.email}`);
    console.log(`   ID: ${user.id}`);
    console.log(`   Password: ${'*'.repeat(newPassword.length)}`);
    console.log('');
    console.log('💡 The user can now log in with:');
    console.log('   - Email/Password: ' + userEmail);
    console.log('   - Google OAuth (if already linked)');
  } catch (error) {
    console.error('');
    console.error('❌ Error:', error.message);
    console.error('');
    process.exit(1);
  }
}

// Get email and password from command line arguments
const userEmail = process.argv[2];
const newPassword = process.argv[3];

if (!userEmail || !newPassword) {
  console.log('Usage: node scripts/admin/update-user-password.js <user-email> <new-password>');
  console.log('');
  console.log('Example: node scripts/admin/update-user-password.js alistair@omniforce.ai Omniforce123');
  console.log('');
  process.exit(1);
}

updateUserPassword(userEmail, newPassword);

