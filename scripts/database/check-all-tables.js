#!/usr/bin/env node

/**
 * Comprehensive Database Check Script
 * Checks all possible table names and variations
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
);

async function checkAllPossibleTables() {
  console.log('🔍 Checking ALL possible table names...\n');

  // Possible table name variations
  const possibleTables = [
    'People',
    'people',
    'PEOPLE',
    'Companies',
    'companies',
    'COMPANIES',
    'Jobs',
    'jobs',
    'JOBS',
    'Leads',
    'leads',
    'LEADS',
    'Interactions',
    'interactions',
    'INTERACTIONS',
    'Campaigns',
    'campaigns',
    'CAMPAIGNS',
    'Conversations',
    'conversations',
    'CONVERSATIONS',
    'user_profiles',
    'User_Profiles',
    'USER_PROFILES',
    'auth.users',
    'auth_users',
  ];

  const results = [];

  for (const tableName of possibleTables) {
    try {
      const { data, error, count } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true });

      if (!error) {
        results.push({
          table: tableName,
          count: count || 0,
          accessible: true,
        });
        console.log(`✅ ${tableName}: ${count || 0} records`);
      } else {
        console.log(`❌ ${tableName}: ${error.message}`);
      }
    } catch (e) {
      console.log(`❌ ${tableName}: Table not found or inaccessible`);
    }
  }

  console.log('\n📊 Summary:');
  console.log('============');

  const accessibleTables = results.filter(r => r.accessible);
  accessibleTables.forEach(result => {
    console.log(`${result.table}: ${result.count} records`);
  });

  // Check for tables with significant data
  const tablesWithData = accessibleTables.filter(r => r.count > 10);
  if (tablesWithData.length > 0) {
    console.log('\n🎯 Tables with significant data:');
    tablesWithData.forEach(result => {
      console.log(`  ${result.table}: ${result.count} records`);
    });
  }

  // Try to get table names from information_schema
  console.log('\n🔍 Checking information_schema for all tables...');
  try {
    const { data: schemaTables, error: schemaError } =
      await supabase.rpc('get_table_names');

    if (!schemaError && schemaTables) {
      console.log('Tables from schema:', schemaTables);
    } else {
      console.log('Could not access schema information');
    }
  } catch (e) {
    console.log('Schema check failed:', e.message);
  }
}

checkAllPossibleTables();
