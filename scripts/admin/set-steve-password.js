#!/usr/bin/env node

/**
 * Set password for steve@polarislabs.io
 * Usage: node scripts/admin/set-steve-password.js [password]
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
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function setPassword() {
  try {
    const email = 'steve@polarislabs.io';
    // Get password from command line or use a default secure password
    const password = process.argv[2] || 'StevePolaris2025!';
    
    console.log('🔐 Setting password for steve@polarislabs.io...');
    console.log('');

    // 1. Find user
    const { data: users, error: listError } =
      await supabase.auth.admin.listUsers();

    if (listError) {
      throw new Error(`Failed to list users: ${listError.message}`);
    }

    const user = users.users.find(u => u.email?.toLowerCase() === email.toLowerCase());

    if (!user) {
      throw new Error(`User not found: ${email}`);
    }

    console.log(`✅ Found user: ${email} (ID: ${user.id})`);

    // 2. Update password using admin API
    console.log('📋 Setting password...');
    const { data, error } = await supabase.auth.admin.updateUserById(
      user.id,
      {
        password: password,
      }
    );

    if (error) {
      throw new Error(`Failed to set password: ${error.message}`);
    }

    console.log('   ✅ Password set successfully!');
    console.log('');
    console.log('📝 Login credentials:');
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log('');
    console.log('💡 You can now sign in with these credentials');
    console.log('⚠️  Please change your password after signing in for security');
  } catch (error) {
    console.error('');
    console.error('❌ Error:', error.message);
    console.error('');
    process.exit(1);
  }
}

setPassword();


