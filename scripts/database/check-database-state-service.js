#!/usr/bin/env node

/**
 * Database State Check Script (Service Role)
 * Checks actual database state using service role key
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('URL:', supabaseUrl ? '✅' : '❌');
  console.error('Service Key:', supabaseServiceKey ? '✅' : '❌');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkDatabaseState() {
  console.log('🔍 Checking ACTUAL database state with service role...\n');

  try {
    // Check auth users
    console.log('👤 Checking auth users...');
    const { data: authUsers, error: authError } =
      await supabase.auth.admin.listUsers();

    if (authError) {
      console.log('   ❌ Failed to fetch auth users:', authError.message);
    } else {
      console.log(`   ✅ Found ${authUsers.users.length} auth users`);
      authUsers.users.forEach((user, index) => {
        console.log(
          `   ${index + 1}. ${user.email} (${user.email_confirmed_at ? 'verified' : 'unverified'})`
        );
      });
    }

    // Check user_profiles table
    console.log('\n📋 Checking user_profiles table...');
    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('*');

    if (profilesError) {
      console.log('   ❌ user_profiles table error:', profilesError.message);
    } else {
      console.log(`   ✅ Found ${profiles?.length || 0} user profiles`);
      profiles?.forEach((profile, index) => {
        console.log(`   ${index + 1}. ${profile.email} (${profile.role})`);
      });
    }

    // Check companies table
    console.log('\n🏢 Checking companies table...');
    const { data: companies, error: companiesError } = await supabase
      .from('companies')
      .select('*')
      .limit(5);

    if (companiesError) {
      console.log('   ❌ companies table error:', companiesError.message);
    } else {
      console.log(`   ✅ Found ${companies?.length || 0} companies`);
      companies?.forEach((company, index) => {
        console.log(
          `   ${index + 1}. ${company.name || company['Company Name'] || 'Unnamed'}`
        );
      });
    }

    // Check people table
    console.log('\n👥 Checking people table...');
    const { data: people, error: peopleError } = await supabase
      .from('people')
      .select('*')
      .limit(5);

    if (peopleError) {
      console.log('   ❌ people table error:', peopleError.message);
    } else {
      console.log(`   ✅ Found ${people?.length || 0} people`);
      people?.forEach((person, index) => {
        console.log(
          `   ${index + 1}. ${person.name || person['Name'] || 'Unnamed'}`
        );
      });
    }

    // Check jobs table
    console.log('\n💼 Checking jobs table...');
    const { data: jobs, error: jobsError } = await supabase
      .from('jobs')
      .select('*')
      .limit(5);

    if (jobsError) {
      console.log('   ❌ jobs table error:', jobsError.message);
    } else {
      console.log(`   ✅ Found ${jobs?.length || 0} jobs`);
      jobs?.forEach((job, index) => {
        console.log(
          `   ${index + 1}. ${job.title || job['Job Title'] || 'Untitled'}`
        );
      });
    }

    // Check RLS status
    console.log('\n🔒 Checking RLS status...');
    const { data: rlsStatus, error: rlsError } =
      await supabase.rpc('get_rls_status');

    if (rlsError) {
      console.log('   ⚠️ Could not check RLS status (function may not exist)');
    } else {
      console.log('   📊 RLS Status:', rlsStatus);
    }

    console.log('\n🎯 Database state check complete!');
  } catch (error) {
    console.error('\n❌ Database check failed:', error.message);
  }
}

checkDatabaseState();
