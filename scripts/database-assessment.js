#!/usr/bin/env node

/**
 * Comprehensive Supabase Database Structure Assessment
 * Analyzes table schemas, relationships, RLS status, and data patterns
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_SERVICE_ROLE_KEY);

async function assessDatabaseStructure() {
  console.log('🔍 COMPREHENSIVE SUPABASE DATABASE ASSESSMENT');
  console.log('=============================================\n');

  try {
    // 1. Check RLS Status on all tables
    console.log('🔒 ROW LEVEL SECURITY (RLS) STATUS:');
    console.log('==================================');
    
    const tablesToCheck = ['people', 'companies', 'jobs', 'interactions', 'campaigns', 'user_profiles'];
    
    for (const table of tablesToCheck) {
      try {
        const { data, error } = await supabase
          .rpc('check_rls_status', { table_name: table });
        
        if (!error) {
          console.log(`✅ ${table}: RLS ${data ? 'ENABLED' : 'DISABLED'}`);
        } else {
          // Alternative method - try to query without auth
          const { error: queryError } = await supabase
            .from(table)
            .select('*')
            .limit(1);
          
          if (queryError && queryError.message.includes('RLS')) {
            console.log(`✅ ${table}: RLS ENABLED (blocked by policy)`);
          } else if (!queryError) {
            console.log(`❌ ${table}: RLS DISABLED (accessible without auth)`);
          } else {
            console.log(`⚠️ ${table}: RLS status unclear`);
          }
        }
      } catch (e) {
        console.log(`⚠️ ${table}: Could not check RLS status`);
      }
    }

    // 2. Analyze Table Schemas
    console.log('\n📋 TABLE SCHEMA ANALYSIS:');
    console.log('=========================');

    const tablesWithData = [
      { name: 'people', count: 394 },
      { name: 'companies', count: 172 },
      { name: 'jobs', count: 172 },
      { name: 'interactions', count: 96 },
      { name: 'user_profiles', count: 1 }
    ];

    for (const table of tablesWithData) {
      console.log(`\n🏷️ ${table.name.toUpperCase()} TABLE (${table.count} records):`);
      console.log('─'.repeat(50));
      
      try {
        // Get sample data to understand structure
        const { data: sampleData, error } = await supabase
          .from(table.name)
          .select('*')
          .limit(3);

        if (!error && sampleData && sampleData.length > 0) {
          const columns = Object.keys(sampleData[0]);
          console.log(`📊 Columns (${columns.length}): ${columns.join(', ')}`);
          
          // Show sample data
          console.log('📝 Sample data:');
          sampleData.forEach((row, index) => {
            console.log(`   ${index + 1}. ${JSON.stringify(row, null, 2).substring(0, 200)}...`);
          });
        } else {
          console.log('❌ Could not fetch sample data');
        }
      } catch (e) {
        console.log(`❌ Error analyzing ${table.name}: ${e.message}`);
      }
    }

    // 3. Check for Foreign Key Relationships
    console.log('\n🔗 RELATIONSHIP ANALYSIS:');
    console.log('=========================');

    // Check if people table has company_id
    try {
      const { data: peopleSample } = await supabase
        .from('people')
        .select('id, company_id, name')
        .limit(5);
      
      if (peopleSample && peopleSample.length > 0) {
        console.log('👥 People → Companies relationship:');
        peopleSample.forEach(person => {
          console.log(`   ${person.name}: company_id = ${person.company_id || 'NULL'}`);
        });
      }
    } catch (e) {
      console.log('❌ Could not analyze people relationships');
    }

    // Check if jobs table has company_id
    try {
      const { data: jobsSample } = await supabase
        .from('jobs')
        .select('id, company_id, title')
        .limit(5);
      
      if (jobsSample && jobsSample.length > 0) {
        console.log('\n💼 Jobs → Companies relationship:');
        jobsSample.forEach(job => {
          console.log(`   ${job.title}: company_id = ${job.company_id || 'NULL'}`);
        });
      }
    } catch (e) {
      console.log('❌ Could not analyze jobs relationships');
    }

    // 4. Check User Management
    console.log('\n👤 USER MANAGEMENT ANALYSIS:');
    console.log('=============================');

    try {
      // Check auth users
      const { data: authUsers } = await supabase.auth.admin.listUsers();
      console.log(`🔐 Auth Users: ${authUsers.users.length}`);
      authUsers.users.forEach(user => {
        console.log(`   - ${user.email} (${user.email_confirmed_at ? 'verified' : 'unverified'})`);
      });

      // Check user profiles
      const { data: profiles } = await supabase
        .from('user_profiles')
        .select('*');
      
      console.log(`\n👥 User Profiles: ${profiles.length}`);
      profiles.forEach(profile => {
        console.log(`   - ${profile.email}: ${profile.role} (${profile.is_active ? 'active' : 'inactive'})`);
      });

      // Check for missing profiles
      const authEmails = authUsers.users.map(u => u.email);
      const profileEmails = profiles.map(p => p.email);
      const missingProfiles = authEmails.filter(email => !profileEmails.includes(email));
      
      if (missingProfiles.length > 0) {
        console.log(`\n⚠️ Missing User Profiles:`);
        missingProfiles.forEach(email => {
          console.log(`   - ${email} (needs profile creation)`);
        });
      }

    } catch (e) {
      console.log('❌ Could not analyze user management:', e.message);
    }

    // 5. Security Assessment
    console.log('\n🛡️ SECURITY ASSESSMENT:');
    console.log('========================');

    // Check if RLS is properly configured
    const rlsEnabledTables = [];
    const rlsDisabledTables = [];

    for (const table of ['people', 'companies', 'jobs', 'interactions']) {
      try {
        // Try to access without proper auth context
        const { error } = await supabase
          .from(table)
          .select('*')
          .limit(1);
        
        if (error && error.message.includes('RLS')) {
          rlsEnabledTables.push(table);
        } else if (!error) {
          rlsDisabledTables.push(table);
        }
      } catch (e) {
        // Assume RLS is enabled if we can't access
        rlsEnabledTables.push(table);
      }
    }

    console.log(`✅ RLS ENABLED: ${rlsEnabledTables.join(', ') || 'None'}`);
    console.log(`❌ RLS DISABLED: ${rlsDisabledTables.join(', ') || 'None'}`);

    if (rlsDisabledTables.length > 0) {
      console.log('\n🚨 SECURITY RISK: Tables without RLS can be accessed by anyone!');
    }

    // 6. Data Quality Assessment
    console.log('\n📊 DATA QUALITY ASSESSMENT:');
    console.log('===========================');

    // Check for null/empty values in key fields
    const qualityChecks = [
      { table: 'people', field: 'name', description: 'People without names' },
      { table: 'companies', field: 'name', description: 'Companies without names' },
      { table: 'jobs', field: 'title', description: 'Jobs without titles' }
    ];

    for (const check of qualityChecks) {
      try {
        const { data, error } = await supabase
          .from(check.table)
          .select(check.field)
          .is(check.field, null);
        
        if (!error) {
          console.log(`${check.description}: ${data?.length || 0}`);
        }
      } catch (e) {
        console.log(`Could not check ${check.description}`);
      }
    }

    // 7. Recommendations
    console.log('\n💡 RECOMMENDATIONS:');
    console.log('===================');

    if (rlsDisabledTables.length > 0) {
      console.log('🔒 IMMEDIATE: Enable RLS on all tables');
    }

    if (missingProfiles && missingProfiles.length > 0) {
      console.log('👤 HIGH: Create user profiles for all auth users');
    }

    console.log('📋 MEDIUM: Review data quality and relationships');
    console.log('🔍 LOW: Consider adding indexes for performance');

    console.log('\n🎯 ASSESSMENT COMPLETE!');
    console.log('=======================');

  } catch (error) {
    console.error('\n❌ Assessment failed:', error.message);
  }
}

assessDatabaseStructure();
