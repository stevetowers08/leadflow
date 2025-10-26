/**
 * Runtime Validation System
 *
 * Provides comprehensive runtime testing and validation for the application
 * Includes data validation, API testing, and component health checks
 */

import { supabase } from '@/integrations/supabase/client';

export interface ValidationResult {
  success: boolean;
  message: string;
  details?: Record<string, unknown>;
  timestamp: string;
}

export interface ValidationSuite {
  name: string;
  tests: ValidationTest[];
}

export interface ValidationTest {
  name: string;
  description: string;
  run: () => Promise<ValidationResult>;
}

/**
 * Database Connection Validation
 */
export class DatabaseValidator {
  static async validateConnection(): Promise<ValidationResult> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id')
        .limit(1);

      if (error) {
        return {
          success: false,
          message: 'Database connection failed',
          details: error,
          timestamp: new Date().toISOString(),
        };
      }

      return {
        success: true,
        message: 'Database connection successful',
        details: { hasData: !!data },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        message: 'Database connection error',
        details: error,
        timestamp: new Date().toISOString(),
      };
    }
  }

  static async validateTableStructure(): Promise<ValidationResult> {
    try {
      const requiredTables = ['people', 'companies', 'jobs', 'user_profiles'];
      const results = [];

      for (const table of requiredTables) {
        const { data, error } = await supabase.from(table).select('*').limit(1);

        results.push({
          table,
          exists: !error,
          error: error?.message,
        });
      }

      const failedTables = results.filter(r => !r.exists);

      return {
        success: failedTables.length === 0,
        message:
          failedTables.length === 0
            ? 'All required tables are accessible'
            : `Missing or inaccessible tables: ${failedTables.map(t => t.table).join(', ')}`,
        details: results,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        message: 'Table structure validation failed',
        details: error,
        timestamp: new Date().toISOString(),
      };
    }
  }

  static async validateDataIntegrity(): Promise<ValidationResult> {
    try {
      const checks = [];

      // Check for orphaned people without companies
      const { data: orphanedPeople } = await supabase
        .from('people')
        .select('id, company_id')
        .not('company_id', 'is', null)
        .is('company_id', null);

      checks.push({
        check: 'orphaned_people',
        passed: orphanedPeople?.length === 0,
        count: orphanedPeople?.length || 0,
      });

      // Check for orphaned jobs without companies
      const { data: orphanedJobs } = await supabase
        .from('jobs')
        .select('id, company_id')
        .not('company_id', 'is', null)
        .is('company_id', null);

      checks.push({
        check: 'orphaned_jobs',
        passed: orphanedJobs?.length === 0,
        count: orphanedJobs?.length || 0,
      });

      // Check for invalid stage values
      const { data: invalidStages } = await supabase
        .from('people')
        .select('id, people_stage')
        .not('people_stage', 'in', ['new', 'qualified', 'proceed', 'skip']);

      checks.push({
        check: 'invalid_stages',
        passed: invalidStages?.length === 0,
        count: invalidStages?.length || 0,
      });

      const failedChecks = checks.filter(c => !c.passed);

      return {
        success: failedChecks.length === 0,
        message:
          failedChecks.length === 0
            ? 'Data integrity checks passed'
            : `Data integrity issues found: ${failedChecks.map(c => c.check).join(', ')}`,
        details: checks,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        message: 'Data integrity validation failed',
        details: error,
        timestamp: new Date().toISOString(),
      };
    }
  }
}

/**
 * API Validation
 */
export class ApiValidator {
  static async validateReportingService(): Promise<ValidationResult> {
    try {
      // Test the reporting service with a simple query
      const { data: peopleCount } = await supabase
        .from('people')
        .select('id', { count: 'exact', head: true });

      const { data: companiesCount } = await supabase
        .from('companies')
        .select('id', { count: 'exact', head: true });

      const { data: jobsCount } = await supabase
        .from('jobs')
        .select('id', { count: 'exact', head: true });

      return {
        success: true,
        message: 'Reporting service validation successful',
        details: {
          peopleCount: peopleCount || 0,
          companiesCount: companiesCount || 0,
          jobsCount: jobsCount || 0,
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        message: 'Reporting service validation failed',
        details: error,
        timestamp: new Date().toISOString(),
      };
    }
  }

  static async validateAuthService(): Promise<ValidationResult> {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      return {
        success: !error,
        message: error
          ? 'Auth service validation failed'
          : 'Auth service validation successful',
        details: {
          hasUser: !!user,
          error: error?.message,
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        message: 'Auth service validation failed',
        details: error,
        timestamp: new Date().toISOString(),
      };
    }
  }
}

/**
 * Component Health Validation
 */
export class ComponentValidator {
  static validateRequiredProps(
    componentName: string,
    props: Record<string, unknown>,
    requiredProps: string[]
  ): ValidationResult {
    const missingProps = requiredProps.filter(prop => !(prop in props));

    return {
      success: missingProps.length === 0,
      message:
        missingProps.length === 0
          ? `${componentName} has all required props`
          : `${componentName} missing required props: ${missingProps.join(', ')}`,
      details: { missingProps, providedProps: Object.keys(props) },
      timestamp: new Date().toISOString(),
    };
  }

  static validateDataTypes(
    componentName: string,
    props: Record<string, unknown>,
    typeMap: Record<string, string>
  ): ValidationResult {
    const typeErrors = [];

    for (const [propName, expectedType] of Object.entries(typeMap)) {
      if (propName in props) {
        const actualType = typeof props[propName];
        if (actualType !== expectedType) {
          typeErrors.push({
            prop: propName,
            expected: expectedType,
            actual: actualType,
          });
        }
      }
    }

    return {
      success: typeErrors.length === 0,
      message:
        typeErrors.length === 0
          ? `${componentName} has correct prop types`
          : `${componentName} has type errors: ${typeErrors.map(e => `${e.prop} (${e.actual} vs ${e.expected})`).join(', ')}`,
      details: typeErrors,
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Runtime Test Runner
 */
export class RuntimeTestRunner {
  private static validationSuites: ValidationSuite[] = [
    {
      name: 'Database Validation',
      tests: [
        {
          name: 'connection',
          description: 'Test database connection',
          run: () => DatabaseValidator.validateConnection(),
        },
        {
          name: 'table_structure',
          description: 'Validate table structure',
          run: () => DatabaseValidator.validateTableStructure(),
        },
        {
          name: 'data_integrity',
          description: 'Check data integrity',
          run: () => DatabaseValidator.validateDataIntegrity(),
        },
      ],
    },
    {
      name: 'API Validation',
      tests: [
        {
          name: 'reporting_service',
          description: 'Test reporting service',
          run: () => ApiValidator.validateReportingService(),
        },
        {
          name: 'auth_service',
          description: 'Test authentication service',
          run: () => ApiValidator.validateAuthService(),
        },
      ],
    },
  ];

  static async runAllTests(): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];

    for (const suite of this.validationSuites) {
      console.log(`Running ${suite.name}...`);

      for (const test of suite.tests) {
        try {
          const result = await test.run();
          results.push(result);

          console.log(
            `  ${test.name}: ${result.success ? 'PASS' : 'FAIL'} - ${result.message}`
          );
        } catch (error) {
          const errorResult: ValidationResult = {
            success: false,
            message: `Test ${test.name} failed with error`,
            details: error,
            timestamp: new Date().toISOString(),
          };
          results.push(errorResult);
          console.log(`  ${test.name}: FAIL - ${errorResult.message}`);
        }
      }
    }

    return results;
  }

  static async runSuite(suiteName: string): Promise<ValidationResult[]> {
    const suite = this.validationSuites.find(s => s.name === suiteName);
    if (!suite) {
      throw new Error(`Suite ${suiteName} not found`);
    }

    const results: ValidationResult[] = [];

    for (const test of suite.tests) {
      try {
        const result = await test.run();
        results.push(result);
      } catch (error) {
        const errorResult: ValidationResult = {
          success: false,
          message: `Test ${test.name} failed with error`,
          details: error,
          timestamp: new Date().toISOString(),
        };
        results.push(errorResult);
      }
    }

    return results;
  }

  static getTestSummary(results: ValidationResult[]): {
    total: number;
    passed: number;
    failed: number;
    successRate: number;
  } {
    const total = results.length;
    const passed = results.filter(r => r.success).length;
    const failed = total - passed;
    const successRate = total > 0 ? (passed / total) * 100 : 0;

    return { total, passed, failed, successRate };
  }
}

/**
 * Development-time validation utilities
 */
export const devValidation = {
  /**
   * Run validation in development mode
   */
  async runDevValidation(): Promise<void> {
    if (import.meta.env.NODE_ENV !== 'development') {
      console.warn('Dev validation should only run in development mode');
      return;
    }

    console.log('🔍 Running development validation...');
    const results = await RuntimeTestRunner.runAllTests();
    const summary = RuntimeTestRunner.getTestSummary(results);

    console.log(`\n📊 Validation Summary:`);
    console.log(`  Total tests: ${summary.total}`);
    console.log(`  Passed: ${summary.passed}`);
    console.log(`  Failed: ${summary.failed}`);
    console.log(`  Success rate: ${summary.successRate.toFixed(1)}%`);

    if (summary.failed > 0) {
      console.log(`\n❌ Failed tests:`);
      results
        .filter(r => !r.success)
        .forEach(r => console.log(`  - ${r.message}`));
    } else {
      console.log(`\n✅ All validation tests passed!`);
    }
  },

  /**
   * Validate component props at runtime
   */
  validateComponentProps(
    componentName: string,
    props: Record<string, unknown>,
    requiredProps: string[]
  ): void {
    const result = ComponentValidator.validateRequiredProps(
      componentName,
      props,
      requiredProps
    );
    if (!result.success) {
      console.warn(`⚠️ Component validation failed: ${result.message}`);
      console.warn('Details:', result.details);
    }
  },

  /**
   * Validate data types at runtime
   */
  validatePropTypes(
    componentName: string,
    props: Record<string, unknown>,
    typeMap: Record<string, string>
  ): void {
    const result = ComponentValidator.validateDataTypes(
      componentName,
      props,
      typeMap
    );
    if (!result.success) {
      console.warn(`⚠️ Type validation failed: ${result.message}`);
      console.warn('Details:', result.details);
    }
  },
};
