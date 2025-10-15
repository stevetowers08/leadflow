#!/usr/bin/env node

/**
 * Table Usage Analysis Script
 * Determines which tables are needed vs legacy tables
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
);

async function analyzeTableUsage() {
  console.log('🔍 TABLE USAGE ANALYSIS');
  console.log('=======================\n');

  // Tables that exist in database (from our assessment)
  const existingTables = [
    { name: 'people', records: 394, purpose: 'Lead/contact management' },
    { name: 'companies', records: 172, purpose: 'Company information' },
    { name: 'jobs', records: 172, purpose: 'Job postings' },
    { name: 'interactions', records: 96, purpose: 'User interaction tracking' },
    { name: 'user_profiles', records: 1, purpose: 'User role management' },
  ];

  // Tables referenced in application code
  const codeReferencedTables = [
    'people',
    'companies',
    'jobs',
    'conversations',
    'email_threads',
    'email_messages',
    'dashboard_metrics',
    'People',
    'Companies',
    'Jobs', // Capitalized versions
  ];

  console.log('📊 EXISTING TABLES IN DATABASE:');
  console.log('===============================');

  for (const table of existingTables) {
    console.log(`✅ ${table.name}: ${table.records} records`);
    console.log(`   Purpose: ${table.purpose}`);
  }

  console.log('\n📋 TABLES REFERENCED IN APPLICATION CODE:');
  console.log('==========================================');

  const missingTables = [];
  const unusedTables = [];

  for (const tableName of codeReferencedTables) {
    try {
      const { count, error } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true });

      if (!error) {
        console.log(`✅ ${tableName}: ${count} records (USED IN CODE)`);
      } else {
        console.log(
          `❌ ${tableName}: ${error.message} (REFERENCED BUT MISSING)`
        );
        missingTables.push(tableName);
      }
    } catch (e) {
      console.log(`❌ ${tableName}: Table not found (REFERENCED BUT MISSING)`);
      missingTables.push(tableName);
    }
  }

  // Check which existing tables are NOT used in code
  const existingTableNames = existingTables.map(t => t.name);
  const usedTableNames = codeReferencedTables.filter(name =>
    existingTableNames.includes(name.toLowerCase())
  );

  for (const table of existingTables) {
    if (!usedTableNames.includes(table.name)) {
      unusedTables.push(table.name);
    }
  }

  console.log('\n🎯 ANALYSIS RESULTS:');
  console.log('===================');

  console.log('\n✅ CORE TABLES (Exist + Used):');
  console.log('   - people: Lead management (394 records)');
  console.log('   - companies: Company profiles (172 records)');
  console.log('   - jobs: Job postings (172 records)');

  console.log("\n⚠️ MISSING TABLES (Referenced in code but don't exist):");
  missingTables.forEach(table => {
    console.log(`   - ${table}: Needs to be created or code updated`);
  });

  console.log('\n📊 ADDITIONAL TABLES (Exist but not heavily used):');
  unusedTables.forEach(table => {
    const tableInfo = existingTables.find(t => t.name === table);
    console.log(
      `   - ${table}: ${tableInfo?.records} records (${tableInfo?.purpose})`
    );
  });

  console.log('\n💡 RECOMMENDATIONS:');
  console.log('===================');

  console.log('\n🔒 FOR SECURITY IMPLEMENTATION:');
  console.log('   Focus on these core tables:');
  console.log('   1. people (394 records) - Main lead data');
  console.log('   2. companies (172 records) - Company profiles');
  console.log('   3. jobs (172 records) - Job postings');
  console.log('   4. user_profiles (1 record) - User management');

  console.log('\n📋 FOR MISSING FUNCTIONALITY:');
  if (missingTables.length > 0) {
    console.log('   Consider creating these tables:');
    missingTables.forEach(table => {
      console.log(`   - ${table}: Referenced in code but missing`);
    });
  } else {
    console.log('   ✅ All referenced tables exist');
  }

  console.log('\n🧹 FOR CLEANUP (Optional):');
  if (unusedTables.length > 0) {
    console.log('   These tables exist but are not heavily used:');
    unusedTables.forEach(table => {
      console.log(`   - ${table}: Could be archived or removed`);
    });
  } else {
    console.log('   ✅ All existing tables are being used');
  }

  console.log('\n🎯 FINAL RECOMMENDATION:');
  console.log('========================');
  console.log('For security implementation, focus on these 4 core tables:');
  console.log('1. people (394 records) - Enable RLS');
  console.log('2. companies (172 records) - Enable RLS');
  console.log('3. jobs (172 records) - Enable RLS');
  console.log('4. user_profiles (1 record) - Enable RLS');
  console.log('\nThe interactions table (96 records) can be included as well.');
}

analyzeTableUsage();
