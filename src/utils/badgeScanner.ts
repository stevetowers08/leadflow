/**
 * Badge System Scanner
 * Scans the codebase for inconsistent badge usage
 */

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

interface BadgeViolation {
  file: string;
  line: number;
  type: 'wrong_component' | 'manual_capitalization' | 'inconsistent_usage';
  message: string;
}

export class BadgeSystemScanner {
  private violations: BadgeViolation[] = [];

  async scanCodebase(): Promise<BadgeViolation[]> {
    console.log('🔍 Scanning codebase for badge inconsistencies...');
    
    const files = await glob('src/**/*.{ts,tsx}');
    
    for (const file of files) {
      await this.scanFile(file);
    }
    
    return this.violations;
  }

  private async scanFile(filePath: string): Promise<void> {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      // Check for direct StatusBadge imports (should use centralized Badge)
      if (line.includes('import { StatusBadge }') && !filePath.includes('BadgeSystem')) {
        this.violations.push({
          file: filePath,
          line: index + 1,
          type: 'wrong_component',
          message: 'Direct StatusBadge import - use centralized Badge component instead'
        });
      }

      // Check for AIScoreBadge in related leads context
      if (line.includes('AIScoreBadge') && content.includes('relatedLeads')) {
        this.violations.push({
          file: filePath,
          line: index + 1,
          type: 'wrong_component',
          message: 'AIScoreBadge used in related leads - should use stage badge instead'
        });
      }

      // Check for manual capitalization
      if (line.includes('charAt(0).toUpperCase()')) {
        this.violations.push({
          file: filePath,
          line: index + 1,
          type: 'manual_capitalization',
          message: 'Manual capitalization detected - use centralized getStatusDisplayText function'
        });
      }

      // Check for inconsistent badge props
      if (line.includes('<StatusBadge') && !line.includes('status=')) {
        this.violations.push({
          file: filePath,
          line: index + 1,
          type: 'inconsistent_usage',
          message: 'StatusBadge missing required status prop'
        });
      }
    });
  }

  generateReport(): string {
    if (this.violations.length === 0) {
      return '✅ No badge inconsistencies found!';
    }

    let report = `🚨 Found ${this.violations.length} badge inconsistencies:\n\n`;
    
    const grouped = this.violations.reduce((acc, violation) => {
      if (!acc[violation.type]) acc[violation.type] = [];
      acc[violation.type].push(violation);
      return acc;
    }, {} as Record<string, BadgeViolation[]>);

    Object.entries(grouped).forEach(([type, violations]) => {
      report += `## ${type.replace('_', ' ').toUpperCase()}\n`;
      violations.forEach(violation => {
        report += `- ${violation.file}:${violation.line} - ${violation.message}\n`;
      });
      report += '\n';
    });

    return report;
  }
}

// Usage example
export const runBadgeScan = async () => {
  const scanner = new BadgeSystemScanner();
  const violations = await scanner.scanCodebase();
  const report = scanner.generateReport();
  
  console.log(report);
  
  if (violations.length > 0) {
    process.exit(1); // Fail build if violations found
  }
};
