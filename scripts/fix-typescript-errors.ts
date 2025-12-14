/**
 * TypeScript Error Fixer Script
 * Analyzes and fixes common TypeScript error patterns in bulk
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

interface ErrorPattern {
  pattern: RegExp;
  fix: (match: string, filePath: string) => string;
  description: string;
}

const errorPatterns: ErrorPattern[] = [
  // Fix: Property does not exist on type 'unknown'
  {
    pattern: /(\w+):\s*unknown/g,
    fix: (match, filePath) => {
      // Try to infer better type from context
      if (match.includes('payload')) {
        return match.replace(': unknown', ': Record<string, unknown>');
      }
      if (match.includes('error')) {
        return match.replace(': unknown', ': Error');
      }
      if (match.includes('data')) {
        return match.replace(': unknown', ': unknown[] | null');
      }
      return match;
    },
    description: 'Fix unknown types',
  },
  // Fix: Cannot find module './useRealtimeSubscriptions'
  {
    pattern: /from\s+['"]\.\/useRealtimeSubscriptions['"]/g,
    fix: () => "from '@/hooks/useRealtimeSubscriptions'",
    description: 'Fix useRealtimeSubscriptions imports',
  },
  // Fix: Cannot find module './useAdvancedCaching'
  {
    pattern: /from\s+['"]\.\/useAdvancedCaching['"]/g,
    fix: () => "from '@/hooks/useAdvancedCaching'",
    description: 'Fix useAdvancedCaching imports',
  },
];

function processFile(filePath: string): { fixed: number; errors: string[] } {
  let content = readFileSync(filePath, 'utf-8');
  let fixed = 0;
  const errors: string[] = [];

  for (const { pattern, fix, description } of errorPatterns) {
    const matches = content.match(pattern);
    if (matches) {
      try {
        content = content.replace(pattern, match => {
          fixed++;
          return fix(match, filePath);
        });
      } catch (error) {
        errors.push(`${description}: ${error}`);
      }
    }
  }

  if (fixed > 0) {
    writeFileSync(filePath, content, 'utf-8');
  }

  return { fixed, errors };
}

function getAllTsFiles(dir: string, fileList: string[] = []): string[] {
  const files = readdirSync(dir);

  files.forEach(file => {
    const filePath = join(dir, file);
    const stat = statSync(filePath);

    if (stat.isDirectory()) {
      // Skip node_modules, .next, dist
      if (!['node_modules', '.next', 'dist', 'build'].includes(file)) {
        getAllTsFiles(filePath, fileList);
      }
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

// Main execution
const srcDir = join(process.cwd(), 'src');
const files = getAllTsFiles(srcDir);

console.log(`Found ${files.length} TypeScript files`);
console.log('Processing files...\n');

let totalFixed = 0;
const allErrors: string[] = [];

files.forEach(file => {
  const { fixed, errors } = processFile(file);
  if (fixed > 0) {
    console.log(
      `✓ Fixed ${fixed} issues in ${file.replace(process.cwd(), '.')}`
    );
    totalFixed += fixed;
  }
  allErrors.push(...errors);
});

console.log(`\n✅ Total fixes applied: ${totalFixed}`);
if (allErrors.length > 0) {
  console.log(`\n⚠️  Errors encountered: ${allErrors.length}`);
  allErrors.forEach(err => console.log(`  - ${err}`));
}
