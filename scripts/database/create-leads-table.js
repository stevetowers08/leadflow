#!/usr/bin/env node

/**
 * Script to create leads table in Supabase
 * Uses Supabase Admin API
 * Usage: node scripts/database/create-leads-table.js
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

async function createLeadsTable() {
  try {
    console.log('📋 Creating leads table...');
    console.log('');

    // Read the migration SQL
    const migrationPath = join(__dirname, '../../supabase/migrations/20250128000002_create_leads_table.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf-8');

    // Execute the migration
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: migrationSQL
    });

    if (error) {
      // If RPC doesn't work, try direct query (split into statements)
      console.log('⚠️  RPC method failed, trying direct execution...');
      
      // Split SQL into individual statements and execute
      const statements = migrationSQL
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));

      for (const statement of statements) {
        if (statement.trim()) {
          try {
            // Use REST API directly for DDL
            const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'apikey': serviceRoleKey,
                'Authorization': `Bearer ${serviceRoleKey}`,
              },
              body: JSON.stringify({ sql: statement }),
            });

            if (!response.ok) {
              console.warn(`⚠️  Statement failed: ${statement.substring(0, 50)}...`);
            }
          } catch (err) {
            console.warn(`⚠️  Error executing statement: ${err.message}`);
          }
        }
      }

      // Alternative: Use Supabase client to execute via SQL editor API
      console.log('');
      console.log('💡 Alternative: Please run the migration SQL manually:');
      console.log('');
      console.log('1. Go to Supabase Dashboard > SQL Editor');
      console.log('2. Copy the SQL from: supabase/migrations/20250128000002_create_leads_table.sql');
      console.log('3. Paste and execute');
      console.log('');
      return;
    }

    console.log('✅ Leads table created successfully!');
    console.log('');

    // Verify table exists
    const { data: tables, error: tableError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'leads');

    if (!tableError && tables && tables.length > 0) {
      console.log('✅ Verified: leads table exists');
    } else {
      console.log('⚠️  Could not verify table creation. Please check Supabase dashboard.');
    }

  } catch (error) {
    console.error('');
    console.error('❌ Error:', error.message);
    console.error('');
    console.error('💡 Please run the migration SQL manually in Supabase Dashboard:');
    console.error('   1. Go to Supabase Dashboard > SQL Editor');
    console.error('   2. Copy SQL from: supabase/migrations/20250128000002_create_leads_table.sql');
    console.error('   3. Paste and execute');
    console.error('');
    process.exit(1);
  }
}

createLeadsTable();








