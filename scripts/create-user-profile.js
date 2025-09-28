#!/usr/bin/env node

/**
 * Create User Profile Script
 * Creates a user profile in the database for proper role management
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables');
  console.error('   VITE_SUPABASE_URL');
  console.error('   VITE_SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createUserProfile(userEmail, role = 'owner') {
  try {
    console.log(`🔍 Looking for user: ${userEmail}`);
    
    // Get user from auth
    const { data: users, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      throw new Error(`Failed to list users: ${listError.message}`);
    }
    
    const user = users.users.find(u => u.email === userEmail);
    
    if (!user) {
      console.error(`❌ User not found: ${userEmail}`);
      return;
    }
    
    console.log(`✅ Found user: ${user.email} (ID: ${user.id})`);
    
    // Check if profile already exists
    const { data: existingProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (existingProfile) {
      console.log(`📋 Profile already exists for ${user.email}`);
      console.log(`   Current role: ${existingProfile.role}`);
      
      // Update role if different
      if (existingProfile.role !== role) {
        const { error: updateError } = await supabase
          .from('user_profiles')
          .update({ role: role, updated_at: new Date().toISOString() })
          .eq('id', user.id);
        
        if (updateError) {
          throw new Error(`Failed to update profile: ${updateError.message}`);
        }
        
        console.log(`🎉 Updated role to: ${role}`);
      }
    } else {
      // Create new profile
      const { error: insertError } = await supabase
        .from('user_profiles')
        .insert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || user.email.split('@')[0],
          role: role,
          user_limit: role === 'owner' ? 1000 : 100,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      
      if (insertError) {
        throw new Error(`Failed to create profile: ${insertError.message}`);
      }
      
      console.log(`🎉 Created profile with role: ${role}`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Get email from command line arguments
const userEmail = process.argv[2];
const role = process.argv[3] || 'owner';

if (!userEmail) {
  console.log('Usage: node scripts/create-user-profile.js <user-email> [role]');
  console.log('');
  console.log('Example: node scripts/create-user-profile.js stevetowers08@gmail.com owner');
  process.exit(1);
}

createUserProfile(userEmail, role);
