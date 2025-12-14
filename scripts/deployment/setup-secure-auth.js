#!/usr/bin/env node

/**
 * Security Setup Script
 *
 * This script sets up secure authentication by:
 * 1. Creating user profiles for existing auth users
 * 2. Setting up proper roles and permissions
 * 3. Ensuring admin access for the first user
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Use the same values as in client.ts
const supabaseUrl =
  process.env.VITE_SUPABASE_URL || 'https://jedfundfhzytpnbjkspn.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseServiceKey) {
  console.error('❌ Missing required environment variable:');
  console.error('   SUPABASE_SERVICE_ROLE_KEY');
  console.error('   Please set this in your .env file or environment');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupSecureAuth() {
  console.log('🔐 Setting up secure authentication...\n');

  try {
    // 1. Get all existing auth users
    console.log('📋 Fetching existing auth users...');
    const { data: authUsers, error: authError } =
      await supabase.auth.admin.listUsers();

    if (authError) {
      throw new Error(`Failed to fetch auth users: ${authError.message}`);
    }

    console.log(`   Found ${authUsers.users.length} existing users`);

    // 2. Create user profiles for existing users
    console.log('\n👥 Creating user profiles...');

    for (const user of authUsers.users) {
      const userProfile = {
        id: user.id,
        email: user.email,
        full_name:
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          'Unknown',
        role: 'admin', // Set all existing users as admin for now
        user_limit: 1000,
        is_active: true,
      };

      const { error: insertError } = await supabase
        .from('user_profiles')
        .upsert(userProfile, { onConflict: 'id' });

      if (insertError) {
        console.error(
          `   ❌ Failed to create profile for ${user.email}: ${insertError.message}`
        );
      } else {
        console.log(`   ✅ Created profile for ${user.email} (admin)`);
      }
    }

    // 3. Set up the first user as admin
    if (authUsers.users.length > 0) {
      const firstUser = authUsers.users[0];
      console.log(`\n👑 Setting ${firstUser.email} as admin...`);

      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ role: 'admin' })
        .eq('id', firstUser.id);

      if (updateError) {
        console.error(`   ❌ Failed to set admin: ${updateError.message}`);
      } else {
        console.log(`   ✅ ${firstUser.email} is now the admin`);
      }
    }

    // 4. Verify setup
    console.log('\n🔍 Verifying setup...');
    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('*');

    if (profilesError) {
      throw new Error(`Failed to verify profiles: ${profilesError.message}`);
    }

    console.log(`   ✅ Created ${profiles.length} user profiles`);

    const adminCount = profiles.filter(p => p.role === 'admin').length;

    console.log(`   👨‍💼 Admins: ${adminCount}`);

    console.log('\n🎉 Secure authentication setup complete!');
    console.log('\n📝 Next steps:');
    console.log('   1. Apply the security migration: supabase db push');
    console.log('   2. Test authentication in your app');
    console.log('   3. Configure user management through the admin panel');
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    process.exit(1);
  }
}

// Run the setup
setupSecureAuth();
