#!/usr/bin/env node

/**
 * Database Cleanup Script
 * Removes unused tables to keep only the core tables needed for empowr-crm
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_SERVICE_ROLE_KEY);

async function cleanupDatabase() {
  console.log('🧹 DATABASE CLEANUP - REMOVING UNUSED TABLES');
  console.log('=============================================\n');

  // Tables to KEEP (core tables)
  const keepTables = [
    'people',      // 394 records - Main lead data
    'companies',   // 172 records - Company profiles
    'jobs',        // 172 records - Job postings
    'interactions', // 96 records - Activity tracking
    'user_profiles' // 1 record - User management
  ];

  // Tables to REMOVE (unused/empty tables)
  const removeTables = [
    'conversations',    // 0 records - Empty
    'email_threads',    // 0 records - Empty
    'email_messages',   // 0 records - Empty
    'dashboard_metrics', // 0 records - Empty
    'campaigns',        // 0 records - Empty
    'campaign_participants', // 0 records - Empty
    'system_settings'   // Empty system settings
  ];

  console.log('✅ TABLES TO KEEP:');
  console.log('==================');
  for (const table of keepTables) {
    try {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (!error) {
        console.log(`✅ ${table}: ${count} records`);
      } else {
        console.log(`⚠️ ${table}: ${error.message}`);
      }
    } catch (e) {
      console.log(`❌ ${table}: Table not found`);
    }
  }

  console.log('\n🗑️ TABLES TO REMOVE:');
  console.log('=====================');
  
  const removedTables = [];
  const failedRemovals = [];

  for (const table of removeTables) {
    try {
      // Check if table exists first
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (!error) {
        console.log(`🗑️ Removing ${table} (${count} records)...`);
        
        // Drop the table
        const { error: dropError } = await supabase
          .rpc('drop_table_if_exists', { table_name: table });
        
        if (!dropError) {
          console.log(`✅ Successfully removed ${table}`);
          removedTables.push(table);
        } else {
          console.log(`❌ Failed to remove ${table}: ${dropError.message}`);
          failedRemovals.push(table);
        }
      } else {
        console.log(`ℹ️ ${table}: Table doesn't exist or already removed`);
      }
    } catch (e) {
      console.log(`❌ Error checking ${table}: ${e.message}`);
      failedRemovals.push(table);
    }
  }

  console.log('\n📊 CLEANUP SUMMARY:');
  console.log('===================');
  console.log(`✅ Successfully removed: ${removedTables.length} tables`);
  if (removedTables.length > 0) {
    removedTables.forEach(table => console.log(`   - ${table}`));
  }
  
  console.log(`❌ Failed to remove: ${failedRemovals.length} tables`);
  if (failedRemovals.length > 0) {
    failedRemovals.forEach(table => console.log(`   - ${table}`));
  }

  console.log('\n🎯 FINAL DATABASE STATE:');
  console.log('========================');
  console.log('Core tables remaining:');
  for (const table of keepTables) {
    try {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (!error) {
        console.log(`✅ ${table}: ${count} records`);
      }
    } catch (e) {
      console.log(`❌ ${table}: Error checking`);
    }
  }

  console.log('\n🚀 READY FOR SECURITY IMPLEMENTATION!');
  console.log('=====================================');
  console.log('Next steps:');
  console.log('1. Create user profile for steve@polarislabs.io');
  console.log('2. Enable RLS on companies table');
  console.log('3. Enable RLS on people table');
  console.log('4. Enable RLS on jobs table');
  console.log('5. Enable RLS on interactions table');
  console.log('6. Enable RLS on user_profiles table');
}

cleanupDatabase();
