import { Page } from '@playwright/test';

/**
 * Console inspection utilities for E2E testing
 * Provides comprehensive console monitoring and debugging capabilities
 */

export interface ConsoleLog {
  type: 'log' | 'error' | 'warn' | 'info' | 'debug';
  message: string;
  timestamp: number;
  location?: string;
}

export class ConsoleInspector {
  private logs: ConsoleLog[] = [];
  private page: Page;
  private isMonitoring = false;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Start monitoring console output
   */
  startMonitoring(): void {
    if (this.isMonitoring) return;

    this.logs = [];
    this.isMonitoring = true;

    // Listen to all console events
    this.page.on('console', msg => {
      const log: ConsoleLog = {
        type: msg.type() as ConsoleLog['type'],
        message: msg.text(),
        timestamp: Date.now(),
        location: msg.location()?.url,
      };

      this.logs.push(log);

      // Also log to test output for immediate visibility
      console.log(`[BROWSER ${log.type.toUpperCase()}] ${log.message}`);
    });

    // Listen to page errors
    this.page.on('pageerror', error => {
      const log: ConsoleLog = {
        type: 'error',
        message: `Page Error: ${error.message}`,
        timestamp: Date.now(),
        location: error.stack,
      };

      this.logs.push(log);
      console.log(`[BROWSER ERROR] ${log.message}`);
    });

    // Listen to unhandled promise rejections
    this.page.on('unhandledrejection', error => {
      const log: ConsoleLog = {
        type: 'error',
        message: `Unhandled Promise Rejection: ${error}`,
        timestamp: Date.now(),
      };

      this.logs.push(log);
      console.log(`[BROWSER ERROR] ${log.message}`);
    });
  }

  /**
   * Stop monitoring console output
   */
  stopMonitoring(): void {
    this.isMonitoring = false;
  }

  /**
   * Get all captured logs
   */
  getAllLogs(): ConsoleLog[] {
    return [...this.logs];
  }

  /**
   * Get only error logs
   */
  getErrors(): ConsoleLog[] {
    return this.logs.filter(log => log.type === 'error');
  }

  /**
   * Get only warning logs
   */
  getWarnings(): ConsoleLog[] {
    return this.logs.filter(log => log.type === 'warn');
  }

  /**
   * Get logs by type
   */
  getLogsByType(type: ConsoleLog['type']): ConsoleLog[] {
    return this.logs.filter(log => log.type === type);
  }

  /**
   * Check if there are any errors
   */
  hasErrors(): boolean {
    return this.getErrors().length > 0;
  }

  /**
   * Check if there are any warnings
   */
  hasWarnings(): boolean {
    return this.getWarnings().length > 0;
  }

  /**
   * Get logs since a specific timestamp
   */
  getLogsSince(timestamp: number): ConsoleLog[] {
    return this.logs.filter(log => log.timestamp >= timestamp);
  }

  /**
   * Clear all captured logs
   */
  clearLogs(): void {
    this.logs = [];
  }

  /**
   * Print summary of console activity
   */
  printSummary(): void {
    const errors = this.getErrors();
    const warnings = this.getWarnings();
    const info = this.getLogsByType('info');
    const debug = this.getLogsByType('debug');

    console.log('\n=== CONSOLE INSPECTION SUMMARY ===');
    console.log(`Total logs: ${this.logs.length}`);
    console.log(`Errors: ${errors.length}`);
    console.log(`Warnings: ${warnings.length}`);
    console.log(`Info: ${info.length}`);
    console.log(`Debug: ${debug.length}`);

    if (errors.length > 0) {
      console.log('\n--- ERRORS ---');
      errors.forEach(error => {
        console.log(
          `[${new Date(error.timestamp).toISOString()}] ${error.message}`
        );
        if (error.location) console.log(`  Location: ${error.location}`);
      });
    }

    if (warnings.length > 0) {
      console.log('\n--- WARNINGS ---');
      warnings.forEach(warning => {
        console.log(
          `[${new Date(warning.timestamp).toISOString()}] ${warning.message}`
        );
      });
    }
  }

  /**
   * Assert no errors occurred
   */
  assertNoErrors(): void {
    const errors = this.getErrors();
    if (errors.length > 0) {
      const errorMessages = errors.map(e => e.message).join('\n');
      throw new Error(`Console errors detected:\n${errorMessages}`);
    }
  }

  /**
   * Assert no warnings occurred
   */
  assertNoWarnings(): void {
    const warnings = this.getWarnings();
    if (warnings.length > 0) {
      const warningMessages = warnings.map(w => w.message).join('\n');
      throw new Error(`Console warnings detected:\n${warningMessages}`);
    }
  }

  /**
   * Assert specific error message exists
   */
  assertErrorExists(expectedMessage: string): void {
    const errors = this.getErrors();
    const hasError = errors.some(error =>
      error.message.includes(expectedMessage)
    );

    if (!hasError) {
      throw new Error(
        `Expected error message "${expectedMessage}" not found in console`
      );
    }
  }

  /**
   * Assert specific warning message exists
   */
  assertWarningExists(expectedMessage: string): void {
    const warnings = this.getWarnings();
    const hasWarning = warnings.some(warning =>
      warning.message.includes(expectedMessage)
    );

    if (!hasWarning) {
      throw new Error(
        `Expected warning message "${expectedMessage}" not found in console`
      );
    }
  }
}

/**
 * Helper function to create a console inspector for a test
 */
export function createConsoleInspector(page: Page): ConsoleInspector {
  return new ConsoleInspector(page);
}

/**
 * Helper function to monitor console for a specific test action
 */
export async function withConsoleMonitoring<T>(
  page: Page,
  action: () => Promise<T>
): Promise<{ result: T; inspector: ConsoleInspector }> {
  const inspector = createConsoleInspector(page);
  inspector.startMonitoring();

  try {
    const result = await action();
    return { result, inspector };
  } finally {
    inspector.stopMonitoring();
  }
}
