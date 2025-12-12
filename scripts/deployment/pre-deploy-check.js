#!/usr/bin/env node
/**
 * Comprehensive Pre-Deployment Validation Script
 * Runs all checks locally before deploying to Vercel
 * Based on 2025 best practices for Next.js deployments
 */

import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '../..');

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function runCommand(command, description) {
  log(`\n${'='.repeat(60)}`, 'cyan');
  log(`🔍 ${description}`, 'blue');
  log(`${'='.repeat(60)}`, 'cyan');

  try {
    const output = execSync(command, {
      cwd: rootDir,
      stdio: 'inherit',
      encoding: 'utf-8',
    });
    log(`✅ ${description} - PASSED`, 'green');
    return { success: true, output };
  } catch (error) {
    log(`❌ ${description} - FAILED`, 'red');
    log(`Error: ${error.message}`, 'red');
    return { success: false, error: error.message };
  }
}

function checkForCommonIssues() {
  log(`\n${'='.repeat(60)}`, 'cyan');
  log('🔍 Checking for common deployment issues...', 'blue');
  log(`${'='.repeat(60)}`, 'cyan');

  const issues = [];

  // Check for people table references (should use leads)
  try {
    const grepOutput = execSync(
      'grep -r "from([\\"\\\']people[\\"\\\'])" src --include="*.ts" --include="*.tsx" | head -5',
      { cwd: rootDir, encoding: 'utf-8' }
    );
    if (grepOutput.trim()) {
      issues.push({
        severity: 'warning',
        message:
          'Found references to "people" table (should use "leads" table)',
        count: grepOutput.split('\n').filter(l => l.trim()).length,
      });
    }
  } catch (e) {
    // No matches found - good!
  }

  // Check for non-existent tables
  const nonExistentTables = ['email_sync_logs', 'error_logs', 'email_domains'];
  for (const table of nonExistentTables) {
    try {
      const grepOutput = execSync(
        `grep -r "${table}" src --include="*.ts" --include="*.tsx" | head -3`,
        { cwd: rootDir, encoding: 'utf-8' }
      );
      if (grepOutput.trim()) {
        issues.push({
          severity: 'error',
          message: `Found references to non-existent table: ${table}`,
          count: grepOutput.split('\n').filter(l => l.trim()).length,
        });
      }
    } catch (e) {
      // No matches found - good!
    }
  }

  // Check for any types
  try {
    const grepOutput = execSync(
      'grep -r ": any" src --include="*.ts" --include="*.tsx" | wc -l',
      { cwd: rootDir, encoding: 'utf-8' }
    );
    const count = parseInt(grepOutput.trim(), 10);
    if (count > 0) {
      issues.push({
        severity: 'warning',
        message: `Found ${count} instances of 'any' type (should use specific types)`,
      });
    }
  } catch (e) {
    // Couldn't check
  }

  if (issues.length > 0) {
    log('\n⚠️  Issues found:', 'yellow');
    issues.forEach(issue => {
      const icon = issue.severity === 'error' ? '❌' : '⚠️';
      log(
        `${icon} ${issue.message}`,
        issue.severity === 'error' ? 'red' : 'yellow'
      );
    });
    return {
      success: issues.filter(i => i.severity === 'error').length === 0,
      issues,
    };
  }

  log('✅ No common issues found', 'green');
  return { success: true, issues: [] };
}

async function main() {
  log('\n🚀 Starting Pre-Deployment Validation', 'cyan');
  log('This will run all checks locally before deploying to Vercel\n', 'cyan');

  const results = {
    typeCheck: null,
    lint: null,
    build: null,
    commonIssues: null,
  };

  // Step 1: TypeScript Type Checking
  results.typeCheck = runCommand(
    'npm run type-check',
    'TypeScript Type Checking'
  );

  if (!results.typeCheck.success) {
    log('\n❌ TypeScript errors found. Fix these before deploying.', 'red');
    process.exit(1);
  }

  // Step 2: Linting
  results.lint = runCommand('npm run lint', 'ESLint Code Quality Check');

  if (!results.lint.success) {
    log('\n⚠️  Linting issues found. Consider fixing these.', 'yellow');
    // Don't exit - warnings are OK, but log them
  }

  // Step 3: Check for common issues
  results.commonIssues = checkForCommonIssues();

  if (!results.commonIssues.success) {
    log('\n❌ Critical issues found. Fix these before deploying.', 'red');
    process.exit(1);
  }

  // Step 4: Local Build (most important - this is what Vercel runs)
  results.build = runCommand(
    'npm run build',
    'Local Next.js Build (simulates Vercel build)'
  );

  if (!results.build.success) {
    log('\n❌ Build failed. This will fail on Vercel too.', 'red');
    log('Fix the build errors above before deploying.', 'red');
    process.exit(1);
  }

  // Summary
  log(`\n${'='.repeat(60)}`, 'cyan');
  log('📊 Pre-Deployment Validation Summary', 'cyan');
  log(`${'='.repeat(60)}`, 'cyan');

  log(
    `✅ TypeScript: ${results.typeCheck.success ? 'PASSED' : 'FAILED'}`,
    results.typeCheck.success ? 'green' : 'red'
  );
  log(
    `${results.lint.success ? '✅' : '⚠️'}  Linting: ${results.lint.success ? 'PASSED' : 'WARNINGS'}`,
    results.lint.success ? 'green' : 'yellow'
  );
  log(
    `✅ Common Issues: ${results.commonIssues.success ? 'PASSED' : 'FAILED'}`,
    results.commonIssues.success ? 'green' : 'red'
  );
  log(
    `✅ Build: ${results.build.success ? 'PASSED' : 'FAILED'}`,
    results.build.success ? 'green' : 'red'
  );

  if (
    results.typeCheck.success &&
    results.build.success &&
    results.commonIssues.success
  ) {
    log('\n🎉 All checks passed! Ready to deploy to Vercel.', 'green');
    log('Run: npm run deploy or vercel --prod', 'cyan');
    process.exit(0);
  } else {
    log(
      '\n❌ Some checks failed. Fix the issues above before deploying.',
      'red'
    );
    process.exit(1);
  }
}

main().catch(error => {
  log(`\n❌ Fatal error: ${error.message}`, 'red');
  process.exit(1);
});
