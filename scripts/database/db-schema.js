#!/usr/bin/env node

/**
 * Database Schema Helper
 *
 * This script helps developers quickly reference the database schema
 * and find the correct field names for queries.
 *
 * Usage:
 *   node scripts/db-schema.js [table] [field]
 *
 * Examples:
 *   node scripts/db-schema.js people
 *   node scripts/db-schema.js companies name
 *   node scripts/db-schema.js jobs salary
 */

const {
  DATABASE_SCHEMA,
  COMMON_SELECTIONS,
} = require('../src/types/databaseSchema.ts');

function showHelp() {
  console.log(`
🗄️  Database Schema Helper

Usage: node scripts/db-schema.js [table] [field]

Examples:
  node scripts/db-schema.js                    # Show all tables
  node scripts/db-schema.js people             # Show all fields for people table
  node scripts/db-schema.js companies name     # Show field type for companies.name
  node scripts/db-schema.js jobs salary        # Show field type for jobs.salary

Available tables: ${Object.keys(DATABASE_SCHEMA.FIELDS).join(', ')}

📚 Full documentation: docs/DATABASE_BEST_PRACTICES.md
🔧 Query utilities: src/utils/databaseQueries.ts
`);
}

function showTables() {
  console.log('\n📋 Available Tables:');
  Object.keys(DATABASE_SCHEMA.FIELDS).forEach(table => {
    const fieldCount = Object.keys(DATABASE_SCHEMA.FIELDS[table]).length;
    console.log(`  • ${table} (${fieldCount} fields)`);
  });
}

function showTableFields(table) {
  if (!DATABASE_SCHEMA.FIELDS[table]) {
    console.log(`❌ Table '${table}' not found`);
    showTables();
    return;
  }

  console.log(`\n📋 Fields for '${table}' table:`);
  Object.entries(DATABASE_SCHEMA.FIELDS[table]).forEach(([field, type]) => {
    console.log(`  • ${field}: ${type}`);
  });

  console.log(`\n🔧 Common selection for queries:`);
  console.log(`  ${COMMON_SELECTIONS[table]}`);
}

function showFieldInfo(table, field) {
  if (!DATABASE_SCHEMA.FIELDS[table]) {
    console.log(`❌ Table '${table}' not found`);
    showTables();
    return;
  }

  if (!DATABASE_SCHEMA.FIELDS[table][field]) {
    console.log(`❌ Field '${field}' not found in '${table}' table`);
    showTableFields(table);
    return;
  }

  const type = DATABASE_SCHEMA.FIELDS[table][field];
  console.log(`\n📋 Field Information:`);
  console.log(`  Table: ${table}`);
  console.log(`  Field: ${field}`);
  console.log(`  Type: ${type}`);

  // Check if it's an enum
  if (type.includes('_enum')) {
    const enumName = type.replace('_enum', '');
    if (DATABASE_SCHEMA.ENUMS[enumName]) {
      console.log(`  Values: ${DATABASE_SCHEMA.ENUMS[enumName].join(', ')}`);
    }
  }

  // Check foreign keys
  const fkKey = `${table}.${field}`;
  if (DATABASE_SCHEMA.FOREIGN_KEYS[fkKey]) {
    console.log(`  Foreign Key: ${DATABASE_SCHEMA.FOREIGN_KEYS[fkKey]}`);
  }
}

// Main execution
const args = process.argv.slice(2);

if (args.length === 0) {
  showHelp();
  showTables();
} else if (args.length === 1) {
  showTableFields(args[0]);
} else if (args.length === 2) {
  showFieldInfo(args[0], args[1]);
} else {
  showHelp();
}
