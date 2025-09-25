#!/usr/bin/env node

/**
 * Script to promote a user to admin role
 * Usage: node scripts/promote-user-to-admin.js <user-email>
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   VITE_SUPABASE_URL');
  console.error('   VITE_SUPABASE_SERVICE_ROLE_KEY');
  console.error('');
  console.error('Please check your .env.local file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function promoteUserToAdmin(userEmail) {
  try {
    console.log(`🔍 Looking for user: ${userEmail}`);
    
    // Get user by email
    const { data: users, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      throw new Error(`Failed to list users: ${listError.message}`);
    }
    
    const user = users.users.find(u => u.email === userEmail);
    
    if (!user) {
      console.error(`❌ User not found: ${userEmail}`);
      console.log('Available users:');
      users.users.forEach(u => console.log(`  - ${u.email}`));
      return;
    }
    
    console.log(`✅ Found user: ${user.email} (ID: ${user.id})`);
    console.log(`📋 Current role: ${user.user_metadata?.role || 'none'}`);
    
    // Update user role to admin
    const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
      user_metadata: {
        ...user.user_metadata,
        role: 'admin'
      }
    });
    
    if (updateError) {
      throw new Error(`Failed to update user: ${updateError.message}`);
    }
    
    console.log('🎉 Successfully promoted user to admin!');
    console.log('🔄 Please refresh your browser to see the changes');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Get email from command line arguments
const userEmail = process.argv[2];

if (!userEmail) {
  console.log('Usage: node scripts/promote-user-to-admin.js <user-email>');
  console.log('');
  console.log('Example: node scripts/promote-user-to-admin.js steve@example.com');
  process.exit(1);
}

promoteUserToAdmin(userEmail);






