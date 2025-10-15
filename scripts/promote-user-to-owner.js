#!/usr/bin/env node

/**
 * Promote User to Owner Script
 * Usage: node scripts/promote-user-to-owner.js <user-email>
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const SUPABASE_URL =
  process.env.VITE_SUPABASE_URL || 'https://jedfundfhzytpnbjkspn.supabase.co';
const SERVICE_ROLE_KEY = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!SERVICE_ROLE_KEY) {
  console.error('❌ Missing VITE_SUPABASE_SERVICE_ROLE_KEY in .env.local');
  console.error('Please add your service role key to .env.local file');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function promoteUserToOwner(userEmail) {
  try {
    console.log(`🔍 Looking for user: ${userEmail}`);

    // Get all users
    const { data: users, error: listError } =
      await supabase.auth.admin.listUsers();

    if (listError) {
      throw new Error(`Failed to list users: ${listError.message}`);
    }

    // Find the user by email
    const user = users.users.find(u => u.email === userEmail);

    if (!user) {
      console.error(`❌ User not found: ${userEmail}`);
      console.log('\nAvailable users:');
      users.users.forEach(u => {
        console.log(`   - ${u.email} (${u.user_metadata?.role || 'no role'})`);
      });
      return;
    }

    console.log(`✅ Found user: ${user.email}`);
    console.log(`   Current role: ${user.user_metadata?.role || 'none'}`);

    // Update user metadata to set role as 'owner'
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      user.id,
      {
        user_metadata: {
          ...user.user_metadata,
          role: 'owner',
        },
      }
    );

    if (updateError) {
      throw new Error(`Failed to update user: ${updateError.message}`);
    }

    console.log('🎉 Successfully promoted user to Owner!');
    console.log(
      '   The user will need to refresh their browser to see the changes.'
    );
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Get email from command line arguments
const userEmail = process.argv[2];

if (!userEmail) {
  console.error('❌ Please provide a user email');
  console.error('Usage: node scripts/promote-user-to-owner.js <user-email>');
  process.exit(1);
}

promoteUserToOwner(userEmail);
