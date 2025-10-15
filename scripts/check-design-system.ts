/**
 * Design System Health Check Script
 * Run this to verify consistency across the app
 */

import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface HealthCheckResult {
  passed: boolean;
  issues: string[];
}

const checkHeaderConsistency = (filePath: string): string[] => {
  const issues: string[] = [];
  const content = readFileSync(filePath, 'utf-8');

  // Check for h1 elements
  const h1Regex = /<h1[^>]*className="([^"]*)"[^>]*>/g;
  let match;

  while ((match = h1Regex.exec(content)) !== null) {
    const className = match[1];
    if (!className.includes('text-xl font-semibold tracking-tight')) {
      issues.push(`Inconsistent h1 styling in ${filePath}: ${className}`);
    }
  }

  return issues;
};

const checkStatsConsistency = (filePath: string): string[] => {
  const issues: string[] = [];
  const content = readFileSync(filePath, 'utf-8');

  // Check for hardcoded stats patterns
  if (content.includes('flex items-center gap-6 mb-4 text-sm')) {
    issues.push(
      `Hardcoded stats layout in ${filePath} - consider using StatsBar component`
    );
  }

  return issues;
};

const checkDesignSystemHealth = (): HealthCheckResult => {
  const issues: string[] = [];

  try {
    // Check pages directory
    const pagesDir = join(__dirname, '..', 'src', 'pages');
    const files = readdirSync(pagesDir).filter(f => f.endsWith('.tsx'));

    files.forEach(file => {
      const filePath = join(pagesDir, file);
      issues.push(...checkHeaderConsistency(filePath));
      issues.push(...checkStatsConsistency(filePath));
    });
  } catch (error) {
    issues.push(`Error reading pages directory: ${error}`);
  }

  return {
    passed: issues.length === 0,
    issues,
  };
};

// Run the health check
const result = checkDesignSystemHealth();

if (result.passed) {
  console.log('✅ Design system health check passed!');
} else {
  console.log('❌ Design system issues found:');
  result.issues.forEach(issue => console.log(`  - ${issue}`));
  process.exit(1);
}
