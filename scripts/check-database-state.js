#!/usr/bin/env node

/**
 * Database State Check Script
 * Checks current database state before implementing security
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkDatabaseState() {
  console.log('🔍 Checking current database state...\n');

  try {
    // Check if user_profiles table exists
    console.log('📋 Checking user_profiles table...');
    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1);

    if (profilesError) {
      console.log(
        '   ❌ user_profiles table does not exist or is not accessible'
      );
      console.log('   Error:', profilesError.message);
    } else {
      console.log('   ✅ user_profiles table exists');
      console.log(`   📊 Found ${profiles?.length || 0} profiles`);
    }

    // Check companies table
    console.log('\n🏢 Checking companies table...');
    const { data: companies, error: companiesError } = await supabase
      .from('companies')
      .select('count', { count: 'exact', head: true });

    if (companiesError) {
      console.log('   ❌ companies table error:', companiesError.message);
    } else {
      console.log(
        `   ✅ companies table accessible, count: ${companies?.length || 0}`
      );
    }

    // Check people table
    console.log('\n👥 Checking people table...');
    const { data: people, error: peopleError } = await supabase
      .from('people')
      .select('count', { count: 'exact', head: true });

    if (peopleError) {
      console.log('   ❌ people table error:', peopleError.message);
    } else {
      console.log(
        `   ✅ people table accessible, count: ${people?.length || 0}`
      );
    }

    // Check jobs table
    console.log('\n💼 Checking jobs table...');
    const { data: jobs, error: jobsError } = await supabase
      .from('jobs')
      .select('count', { count: 'exact', head: true });

    if (jobsError) {
      console.log('   ❌ jobs table error:', jobsError.message);
    } else {
      console.log(`   ✅ jobs table accessible, count: ${jobs?.length || 0}`);
    }

    console.log('\n🎯 Database state check complete!');
  } catch (error) {
    console.error('\n❌ Database check failed:', error.message);
  }
}

checkDatabaseState();
