#!/usr/bin/env node

/**
 * Authorization Test Runner
 *
 * This script runs comprehensive authorization tests to ensure
 * the CRM system properly enforces user permissions and data access controls.
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

interface TestConfig {
  name: string;
  command: string;
  description: string;
  critical: boolean;
}

const testSuites: TestConfig[] = [
  {
    name: 'Frontend Authorization Tests',
    command:
      'npm run test src/test/authorization/frontend-authorization.test.tsx',
    description: 'Tests React components and UI permission handling',
    critical: true,
  },
  {
    name: 'Backend Authorization Tests',
    command:
      'npm run test src/test/authorization/backend-authorization.test.ts',
    description: 'Tests service layer authorization and data access',
    critical: true,
  },
  {
    name: 'Edge Cases Tests',
    command: 'npm run test src/test/authorization/edge-cases.test.ts',
    description: 'Tests complex authorization scenarios and edge cases',
    critical: true,
  },
  {
    name: 'Complex Scenarios Tests',
    command: 'npm run test src/test/authorization/complex-scenarios.test.ts',
    description: 'Tests advanced authorization patterns and complex workflows',
    critical: false,
  },
  {
    name: 'E2E Authorization Tests',
    command: 'npm run test:e2e e2e/authorization.spec.ts',
    description: 'Tests complete user workflows and cross-role scenarios',
    critical: true,
  },
];

class AuthorizationTestRunner {
  private results: Array<{
    name: string;
    passed: boolean;
    output: string;
    error?: string;
  }> = [];
  private startTime: number = 0;

  async runAllTests(): Promise<void> {
    console.log('🔐 Starting Comprehensive Authorization Test Suite\n');
    this.startTime = Date.now();

    for (const suite of testSuites) {
      await this.runTestSuite(suite);
    }

    this.printSummary();
  }

  private async runTestSuite(suite: TestConfig): Promise<void> {
    console.log(`\n📋 Running ${suite.name}...`);
    console.log(`   ${suite.description}`);

    if (suite.critical) {
      console.log(
        '   ⚠️  CRITICAL: This test suite must pass for production deployment'
      );
    }

    try {
      const output = execSync(suite.command, {
        encoding: 'utf8',
        stdio: 'pipe',
        timeout: 300000, // 5 minutes timeout
      });

      this.results.push({
        name: suite.name,
        passed: true,
        output: output,
      });

      console.log(`   ✅ PASSED`);
    } catch (error: any) {
      this.results.push({
        name: suite.name,
        passed: false,
        output: error.stdout || '',
        error: error.stderr || error.message,
      });

      console.log(`   ❌ FAILED`);
      if (suite.critical) {
        console.log(`   🚨 CRITICAL FAILURE: ${suite.name} failed`);
      }
    }
  }

  private printSummary(): void {
    const duration = Date.now() - this.startTime;
    const passed = this.results.filter(r => r.passed).length;
    const failed = this.results.filter(r => !r.passed).length;
    const criticalFailures = this.results.filter(
      r => !r.passed && testSuites.find(s => s.name === r.name)?.critical
    ).length;

    console.log('\n' + '='.repeat(80));
    console.log('🔐 AUTHORIZATION TEST SUITE SUMMARY');
    console.log('='.repeat(80));

    console.log(`\n📊 Results:`);
    console.log(`   Total Tests: ${this.results.length}`);
    console.log(`   Passed: ${passed} ✅`);
    console.log(`   Failed: ${failed} ❌`);
    console.log(`   Critical Failures: ${criticalFailures} 🚨`);
    console.log(`   Duration: ${(duration / 1000).toFixed(2)}s`);

    if (failed > 0) {
      console.log(`\n❌ Failed Tests:`);
      this.results
        .filter(r => !r.passed)
        .forEach(result => {
          const suite = testSuites.find(s => s.name === result.name);
          const critical = suite?.critical ? ' 🚨 CRITICAL' : '';
          console.log(`   • ${result.name}${critical}`);
          if (result.error) {
            console.log(`     Error: ${result.error.split('\n')[0]}`);
          }
        });
    }

    if (criticalFailures > 0) {
      console.log(`\n🚨 CRITICAL FAILURES DETECTED!`);
      console.log(`   The following critical tests failed and must be fixed:`);
      this.results
        .filter(
          r => !r.passed && testSuites.find(s => s.name === r.name)?.critical
        )
        .forEach(result => {
          console.log(`   • ${result.name}`);
        });
      console.log(
        `\n   ⚠️  DO NOT DEPLOY TO PRODUCTION until these issues are resolved.`
      );
    } else if (failed === 0) {
      console.log(`\n🎉 ALL TESTS PASSED!`);
      console.log(`   ✅ Authorization system is working correctly`);
      console.log(`   ✅ Safe to deploy to production`);
    } else {
      console.log(
        `\n⚠️  Some non-critical tests failed, but critical tests passed.`
      );
      console.log(`   ✅ Safe to deploy to production`);
    }

    console.log('\n' + '='.repeat(80));
  }

  async runSpecificTest(testName: string): Promise<void> {
    const suite = testSuites.find(s =>
      s.name.toLowerCase().includes(testName.toLowerCase())
    );

    if (!suite) {
      console.log(`❌ Test suite "${testName}" not found.`);
      console.log(`Available test suites:`);
      testSuites.forEach(s => console.log(`   • ${s.name}`));
      return;
    }

    console.log(`🔐 Running ${suite.name}...`);
    console.log(`   ${suite.description}\n`);

    try {
      const output = execSync(suite.command, {
        encoding: 'utf8',
        stdio: 'inherit',
        timeout: 300000,
      });

      console.log(`\n✅ ${suite.name} completed successfully!`);
    } catch (error: any) {
      console.log(`\n❌ ${suite.name} failed!`);
      process.exit(1);
    }
  }

  async runCoverageReport(): Promise<void> {
    console.log('📊 Generating Authorization Test Coverage Report...\n');

    try {
      execSync('npm run test:auth:coverage', {
        encoding: 'utf8',
        stdio: 'inherit',
        timeout: 300000,
      });

      console.log('\n✅ Coverage report generated successfully!');
      console.log('   Check the coverage/ directory for detailed reports');
    } catch (error: any) {
      console.log('\n❌ Coverage report generation failed!');
      process.exit(1);
    }
  }

  printHelp(): void {
    console.log('🔐 Authorization Test Runner');
    console.log('\nUsage:');
    console.log('  node scripts/run-auth-tests.js [command] [options]');
    console.log('\nCommands:');
    console.log(
      '  all                    Run all authorization tests (default)'
    );
    console.log('  frontend               Run frontend authorization tests');
    console.log('  backend                Run backend authorization tests');
    console.log('  edge-cases             Run edge cases tests');
    console.log('  complex                Run complex scenarios tests');
    console.log('  e2e                    Run E2E authorization tests');
    console.log('  coverage               Generate coverage report');
    console.log('  help                   Show this help message');
    console.log('\nExamples:');
    console.log('  node scripts/run-auth-tests.js all');
    console.log('  node scripts/run-auth-tests.js frontend');
    console.log('  node scripts/run-auth-tests.js coverage');
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'all';

  const runner = new AuthorizationTestRunner();

  switch (command.toLowerCase()) {
    case 'all':
      await runner.runAllTests();
      break;
    case 'frontend':
      await runner.runSpecificTest('frontend');
      break;
    case 'backend':
      await runner.runSpecificTest('backend');
      break;
    case 'edge-cases':
      await runner.runSpecificTest('edge cases');
      break;
    case 'complex':
      await runner.runSpecificTest('complex');
      break;
    case 'e2e':
      await runner.runSpecificTest('e2e');
      break;
    case 'coverage':
      await runner.runCoverageReport();
      break;
    case 'help':
    case '--help':
    case '-h':
      runner.printHelp();
      break;
    default:
      console.log(`❌ Unknown command: ${command}`);
      runner.printHelp();
      process.exit(1);
  }
}

// Check if required files exist
function checkPrerequisites(): boolean {
  const requiredFiles = [
    'src/test/authorization/frontend-authorization.test.tsx',
    'src/test/authorization/backend-authorization.test.ts',
    'src/test/authorization/edge-cases.test.ts',
    'src/test/authorization/complex-scenarios.test.ts',
    'e2e/authorization.spec.ts',
  ];

  const missingFiles = requiredFiles.filter(file => !existsSync(file));

  if (missingFiles.length > 0) {
    console.log('❌ Missing required test files:');
    missingFiles.forEach(file => console.log(`   • ${file}`));
    console.log('\nPlease ensure all authorization test files are present.');
    return false;
  }

  return true;
}

// Run the script
if (require.main === module) {
  if (!checkPrerequisites()) {
    process.exit(1);
  }

  main().catch(error => {
    console.error('❌ Test runner failed:', error);
    process.exit(1);
  });
}

export { AuthorizationTestRunner };
