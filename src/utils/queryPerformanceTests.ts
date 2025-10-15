/**
 * Performance tests for user assignment queries
 * Tests query performance and identifies bottlenecks
 */

import { supabase } from '../integrations/supabase/client';
import { UserAssignmentQueries } from './userAssignmentQueries';
import { OptimizedQueries } from './optimizedQueries';

export interface PerformanceTestResult {
  testName: string;
  duration: number;
  recordCount: number;
  queryType: 'optimized' | 'original';
  success: boolean;
  error?: string;
}

export class QueryPerformanceTests {
  /**
   * Test 1: User assignment statistics query performance
   */
  static async testUserAssignmentStats(): Promise<PerformanceTestResult> {
    const startTime = performance.now();

    try {
      const stats = await UserAssignmentQueries.getUserAssignmentStats();
      const duration = performance.now() - startTime;

      return {
        testName: 'User Assignment Stats',
        duration,
        recordCount: stats.length,
        queryType: 'optimized',
        success: true,
      };
    } catch (error) {
      return {
        testName: 'User Assignment Stats',
        duration: performance.now() - startTime,
        recordCount: 0,
        queryType: 'optimized',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Test 2: Leads with assignments query performance
   */
  static async testLeadsWithAssignments(): Promise<PerformanceTestResult> {
    const startTime = performance.now();

    try {
      const leads = await UserAssignmentQueries.getLeadsWithAssignments({
        limit: 100,
      });
      const duration = performance.now() - startTime;

      return {
        testName: 'Leads with Assignments',
        duration,
        recordCount: leads.length,
        queryType: 'optimized',
        success: true,
      };
    } catch (error) {
      return {
        testName: 'Leads with Assignments',
        duration: performance.now() - startTime,
        recordCount: 0,
        queryType: 'optimized',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Test 3: Companies with assignments query performance
   */
  static async testCompaniesWithAssignments(): Promise<PerformanceTestResult> {
    const startTime = performance.now();

    try {
      const companies = await UserAssignmentQueries.getCompaniesWithAssignments(
        { limit: 100 }
      );
      const duration = performance.now() - startTime;

      return {
        testName: 'Companies with Assignments',
        duration,
        recordCount: companies.length,
        queryType: 'optimized',
        success: true,
      };
    } catch (error) {
      return {
        testName: 'Companies with Assignments',
        duration: performance.now() - startTime,
        recordCount: 0,
        queryType: 'optimized',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Test 4: Unassigned entities query performance
   */
  static async testUnassignedEntities(): Promise<PerformanceTestResult> {
    const startTime = performance.now();

    try {
      const [leads, companies] = await Promise.all([
        UserAssignmentQueries.getUnassignedLeads(50),
        UserAssignmentQueries.getUnassignedCompanies(50),
      ]);

      const duration = performance.now() - startTime;

      return {
        testName: 'Unassigned Entities',
        duration,
        recordCount: leads.length + companies.length,
        queryType: 'optimized',
        success: true,
      };
    } catch (error) {
      return {
        testName: 'Unassigned Entities',
        duration: performance.now() - startTime,
        recordCount: 0,
        queryType: 'optimized',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Test 5: Batch assignment operations performance
   */
  static async testBatchAssignments(): Promise<PerformanceTestResult> {
    const startTime = performance.now();

    try {
      // Create test assignments (this would be mocked in real tests)
      const testAssignments = [
        {
          entityType: 'people' as const,
          entityId: 'test-1',
          ownerId: 'test-user-1',
        },
        {
          entityType: 'people' as const,
          entityId: 'test-2',
          ownerId: 'test-user-2',
        },
        {
          entityType: 'companies' as const,
          entityId: 'test-3',
          ownerId: 'test-user-1',
        },
      ];

      await OptimizedQueries.batchUpdateAssignments(testAssignments);
      const duration = performance.now() - startTime;

      return {
        testName: 'Batch Assignments',
        duration,
        recordCount: testAssignments.length,
        queryType: 'optimized',
        success: true,
      };
    } catch (error) {
      return {
        testName: 'Batch Assignments',
        duration: performance.now() - startTime,
        recordCount: 0,
        queryType: 'optimized',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Test 6: Dashboard stats optimization
   */
  static async testDashboardStatsOptimized(): Promise<PerformanceTestResult> {
    const startTime = performance.now();

    try {
      const stats = await OptimizedQueries.getDashboardStatsOptimized();
      const duration = performance.now() - startTime;

      return {
        testName: 'Dashboard Stats Optimized',
        duration,
        recordCount:
          stats.recentLeads.length +
          stats.recentCompanies.length +
          stats.userStats.length,
        queryType: 'optimized',
        success: true,
      };
    } catch (error) {
      return {
        testName: 'Dashboard Stats Optimized',
        duration: performance.now() - startTime,
        recordCount: 0,
        queryType: 'optimized',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Test 7: User cache performance
   */
  static async testUserCachePerformance(): Promise<PerformanceTestResult> {
    const startTime = performance.now();

    try {
      const userCache = await OptimizedQueries.getUsersWithCache();
      const duration = performance.now() - startTime;

      return {
        testName: 'User Cache Performance',
        duration,
        recordCount: Object.keys(userCache).length,
        queryType: 'optimized',
        success: true,
      };
    } catch (error) {
      return {
        testName: 'User Cache Performance',
        duration: performance.now() - startTime,
        recordCount: 0,
        queryType: 'optimized',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Run all performance tests
   */
  static async runAllTests(): Promise<PerformanceTestResult[]> {
    const tests = [
      this.testUserAssignmentStats,
      this.testLeadsWithAssignments,
      this.testCompaniesWithAssignments,
      this.testUnassignedEntities,
      this.testBatchAssignments,
      this.testDashboardStatsOptimized,
      this.testUserCachePerformance,
    ];

    const results: PerformanceTestResult[] = [];

    for (const test of tests) {
      try {
        const result = await test.call(this);
        results.push(result);
      } catch (error) {
        results.push({
          testName: test.name,
          duration: 0,
          recordCount: 0,
          queryType: 'optimized',
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return results;
  }

  /**
   * Generate performance report
   */
  static generateReport(results: PerformanceTestResult[]): string {
    const successfulTests = results.filter(r => r.success);
    const failedTests = results.filter(r => !r.success);

    const avgDuration =
      successfulTests.reduce((sum, r) => sum + r.duration, 0) /
      successfulTests.length;
    const slowestTest = successfulTests.reduce(
      (slowest, current) =>
        current.duration > slowest.duration ? current : slowest,
      { duration: 0, testName: '' }
    );

    return `
# Query Performance Test Report

## Summary
- **Total Tests**: ${results.length}
- **Successful**: ${successfulTests.length}
- **Failed**: ${failedTests.length}
- **Average Duration**: ${avgDuration.toFixed(2)}ms
- **Slowest Test**: ${slowestTest.testName} (${slowestTest.duration.toFixed(2)}ms)

## Test Results

${results
  .map(
    result => `
### ${result.testName}
- **Status**: ${result.success ? '✅ PASS' : '❌ FAIL'}
- **Duration**: ${result.duration.toFixed(2)}ms
- **Records**: ${result.recordCount}
- **Type**: ${result.queryType}
${result.error ? `- **Error**: ${result.error}` : ''}
`
  )
  .join('\n')}

## Performance Recommendations

${
  results
    .filter(r => r.duration > 1000)
    .map(
      r =>
        `- **${r.testName}**: Consider further optimization (${r.duration.toFixed(2)}ms)`
    )
    .join('\n') ||
  '- All tests are performing within acceptable limits (< 1000ms)'
}

## Index Usage Verification

Run the following queries to verify index usage:

\`\`\`sql
-- Check if indexes are being used
EXPLAIN (ANALYZE, BUFFERS) 
SELECT * FROM lead_assignments_with_users 
WHERE owner_id = 'some-user-id' 
LIMIT 10;

EXPLAIN (ANALYZE, BUFFERS) 
SELECT * FROM company_assignments_with_users 
WHERE owner_id = 'some-user-id' 
LIMIT 10;

-- Check materialized view performance
EXPLAIN (ANALYZE, BUFFERS) 
SELECT * FROM user_assignment_stats;
\`\`\`
`;
  }
}

/**
 * Utility to run performance tests and generate reports
 */
export const runPerformanceTests = async (): Promise<string> => {
  console.log('🚀 Starting query performance tests...');

  const results = await QueryPerformanceTests.runAllTests();
  const report = QueryPerformanceTests.generateReport(results);

  console.log('📊 Performance test results:');
  console.log(report);

  return report;
};

/**
 * React hook for running performance tests in development
 */
export const usePerformanceTests = () => {
  const [isRunning, setIsRunning] = React.useState(false);
  const [results, setResults] = React.useState<PerformanceTestResult[]>([]);
  const [report, setReport] = React.useState<string>('');

  const runTests = async () => {
    setIsRunning(true);
    try {
      const testResults = await QueryPerformanceTests.runAllTests();
      const testReport = QueryPerformanceTests.generateReport(testResults);

      setResults(testResults);
      setReport(testReport);
    } catch (error) {
      console.error('Performance tests failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  return {
    runTests,
    isRunning,
    results,
    report,
  };
};
