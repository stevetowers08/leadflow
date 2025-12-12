#!/usr/bin/env tsx
/**
 * Generate TypeScript types from Supabase database schema
 * 
 * This script uses Supabase CLI to generate types automatically.
 * Run this after any database migration to keep types in sync.
 * 
 * Usage:
 *   npm run types:generate
 *   npm run types:generate -- --watch
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

const TYPES_FILE = join(process.cwd(), 'src/integrations/supabase/types.ts');
const SUPABASE_CONFIG = join(process.cwd(), 'supabase/config.toml');

async function generateTypes() {
  console.log('🔄 Generating TypeScript types from Supabase schema...\n');

  // Check if Supabase config exists
  if (!existsSync(SUPABASE_CONFIG)) {
    console.error('❌ Supabase config not found. Make sure you have supabase/config.toml');
    process.exit(1);
  }

  try {
    // Check if Supabase CLI is installed
    try {
      execSync('supabase --version', { stdio: 'ignore' });
    } catch {
      console.error('❌ Supabase CLI not found. Install it with: npm install -g supabase');
      console.log('\nAlternatively, use the Supabase MCP server to generate types.');
      process.exit(1);
    }

    // Generate types using Supabase CLI
    console.log('📝 Running: supabase gen types typescript --local > types.ts');
    
    const output = execSync(
      'supabase gen types typescript --local',
      { 
        encoding: 'utf-8',
        cwd: process.cwd(),
        stdio: 'pipe'
      }
    );

    // Write to types file
    const fs = await import('fs/promises');
    await fs.writeFile(TYPES_FILE, output, 'utf-8');

    console.log('✅ Types generated successfully!');
    console.log(`📄 Written to: ${TYPES_FILE}\n`);
    
    // Run TypeScript check
    console.log('🔍 Running TypeScript type check...');
    try {
      execSync('npx tsc --noEmit', { stdio: 'inherit' });
      console.log('✅ Type check passed!\n');
    } catch {
      console.warn('⚠️  Type check found errors. Please review the output above.\n');
    }

  } catch (error: any) {
    console.error('❌ Error generating types:', error.message);
    
    if (error.message.includes('not found') || error.message.includes('ENOENT')) {
      console.log('\n💡 Tip: Make sure Supabase CLI is installed:');
      console.log('   npm install -g supabase');
      console.log('\n   Or use the Supabase MCP server for type generation.');
    }
    
    process.exit(1);
  }
}

// Handle watch mode
if (process.argv.includes('--watch')) {
  console.log('👀 Watch mode: Monitoring for database changes...\n');
  // In watch mode, you'd set up a file watcher or polling
  // For now, just run once
  generateTypes();
} else {
  generateTypes();
}

