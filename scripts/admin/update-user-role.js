#!/usr/bin/env node

/**
 * Script to update user role in Supabase
 * Usage: node scripts/update-user-role.js <email> <role>
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables');
  console.error('Required: VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function updateUserRole(email, newRole) {
  try {
    console.log(`🔄 Updating user role for ${email} to ${newRole}...`);

    const { data, error } = await supabase
      .from('user_profiles')
      .update({ role: newRole })
      .eq('email', email)
      .select();

    if (error) {
      console.error('❌ Error updating user role:', error);
      return false;
    }

    if (data && data.length > 0) {
      console.log('✅ User role updated successfully:', data[0]);
      return true;
    } else {
      console.log('⚠️ No user found with that email');
      return false;
    }
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return false;
  }
}

// Get command line arguments
const email = process.argv[2];
const role = process.argv[3];

if (!email || !role) {
  console.log('Usage: node scripts/update-user-role.js <email> <role>');
  console.log(
    'Example: node scripts/update-user-role.js stevetowers08@gmail.com owner'
  );
  process.exit(1);
}

// Update the user role
updateUserRole(email, role)
  .then(success => {
    if (success) {
      console.log('🎉 User role update completed successfully!');
    } else {
      console.log('💥 User role update failed');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  });
