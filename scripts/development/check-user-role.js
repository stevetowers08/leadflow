#!/usr/bin/env node

/**
 * Check and Update User Role Script
 * This script checks your current role and can update it to 'owner'
 */

import { createClient } from '@supabase/supabase-js';

// Use environment variables - never hardcode keys
const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL ||
  process.env.SUPABASE_URL;

const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Missing Supabase environment variables:');
  console.error('   Required: NEXT_PUBLIC_SUPABASE_URL (or VITE_SUPABASE_URL)');
  console.error(
    '   Required: NEXT_PUBLIC_SUPABASE_ANON_KEY (or VITE_SUPABASE_ANON_KEY)'
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkCurrentUser() {
  try {
    console.log('🔍 Checking current user...');

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.error('❌ Error getting user:', error.message);
      return;
    }

    if (!user) {
      console.log('❌ No user found. Please sign in first.');
      return;
    }

    console.log('✅ User found:');
    console.log(`   Email: ${user.email}`);
    console.log(`   Name: ${user.user_metadata?.full_name || 'Not set'}`);
    console.log(`   Current Role: ${user.user_metadata?.role || 'Not set'}`);
    console.log(`   User ID: ${user.id}`);

    // Check if user is already owner
    if (user.user_metadata?.role === 'owner') {
      console.log('🎉 You are already an Owner!');
      return;
    }

    console.log('\n📝 To update your role to Owner, you need to:');
    console.log('1. Go to Supabase Dashboard: https://supabase.com/dashboard');
    console.log('2. Select your project: jedfundfhzytpnbjkspn');
    console.log('3. Go to Authentication > Users');
    console.log(`4. Find user: ${user.email}`);
    console.log('5. Click "Edit" and update user_metadata.role to "owner"');
    console.log('\nAlternatively, ask the project owner to run:');
    console.log(`   node scripts/promote-user-to-owner.js ${user.email}`);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the check
checkCurrentUser();
