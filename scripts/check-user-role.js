#!/usr/bin/env node

/**
 * Check and Update User Role Script
 * This script checks your current role and can update it to 'owner'
 */

import { createClient } from '@supabase/supabase-js';

// Use the hardcoded values from the client
const SUPABASE_URL = "https://jedfundfhzytpnbjkspn.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplZGZ1bmRmaHp5dHBuYmprc3BuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzNjE5NDIsImV4cCI6MjA3MzkzNzk0Mn0.K5PFr9NdDav7SLk5pguj5tawj-10j-yhlUfFa_Fkvqg";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkCurrentUser() {
  try {
    console.log('🔍 Checking current user...');
    
    const { data: { user }, error } = await supabase.auth.getUser();
    
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

