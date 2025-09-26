#!/usr/bin/env node

// Database Documentation Generator
// Run with: node scripts/generate-db-docs.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function generateDatabaseDocs() {
  console.log('📊 Generating Database Documentation...\n');

  try {
    // Get all tables
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .order('table_name');

    if (tablesError) throw tablesError;

    let markdown = '# Database Documentation\n\n';
    markdown += `Generated on: ${new Date().toISOString()}\n\n`;
    markdown += `Total Tables: ${tables.length}\n\n`;

    for (const table of tables) {
      const tableName = table.table_name;
      console.log(`📋 Processing table: ${tableName}`);

      // Get columns
      const { data: columns, error: columnsError } = await supabase
        .from('information_schema.columns')
        .select('column_name, data_type, is_nullable, column_default')
        .eq('table_name', tableName)
        .eq('table_schema', 'public');

      if (columnsError) throw columnsError;

      // Get row count
      const { count, error: countError } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true });

      if (countError) throw countError;

      // Get sample data
      const { data: sampleData, error: sampleError } = await supabase
        .from(tableName)
        .select('*')
        .limit(3);

      if (sampleError) throw sampleError;

      markdown += `## Table: ${tableName}\n\n`;
      markdown += `**Row Count:** ${count || 0}\n\n`;

      // Columns table
      markdown += '### Columns\n\n';
      markdown += '| Column | Type | Nullable | Default |\n';
      markdown += '|--------|------|----------|----------|\n';
      
      columns.forEach(col => {
        markdown += `| ${col.column_name} | ${col.data_type} | ${col.is_nullable} | ${col.column_default || 'NULL'} |\n`;
      });

      // Sample data
      if (sampleData && sampleData.length > 0) {
        markdown += '\n### Sample Data\n\n';
        markdown += '```json\n';
        markdown += JSON.stringify(sampleData, null, 2);
        markdown += '\n```\n';
      }

      markdown += '\n---\n\n';
    }

    // Write to file
    const fs = require('fs');
    const filename = `database-docs-${new Date().toISOString().split('T')[0]}.md`;
    fs.writeFileSync(filename, markdown);

    console.log(`✅ Documentation generated: ${filename}`);
    console.log(`📄 Total tables documented: ${tables.length}`);

  } catch (error) {
    console.error('❌ Error generating documentation:', error);
    process.exit(1);
  }
}

generateDatabaseDocs();
