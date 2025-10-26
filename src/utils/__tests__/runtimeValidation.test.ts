/**
 * Runtime Validation Tests
 *
 * Tests for the runtime validation system
 */

import { supabase } from '@/integrations/supabase/client';
import {
  ApiValidator,
  ComponentValidator,
  DatabaseValidator,
  RuntimeTestRunner,
  devValidation,
} from '@/utils/runtimeValidation';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(),
    auth: {
      getUser: vi.fn(),
    },
  },
}));

describe('DatabaseValidator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('validateConnection', () => {
    it('should return success when connection is valid', async () => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          limit: vi.fn().mockReturnValue({
            data: [{ id: 'test' }],
            error: null,
          }),
        }),
      });

      const result = await DatabaseValidator.validateConnection();

      expect(result.success).toBe(true);
      expect(result.message).toBe('Database connection successful');
      expect(result.details.hasData).toBe(true);
    });

    it('should return failure when connection fails', async () => {
      vi.mocked(supabase).from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          limit: vi.fn().mockReturnValue({
            data: null,
            error: { message: 'Connection failed' },
          }),
        }),
      });

      const result = await DatabaseValidator.validateConnection();

      expect(result.success).toBe(false);
      expect(result.message).toBe('Database connection failed');
      expect(result.details.message).toBe('Connection failed');
    });

    it('should handle exceptions', async () => {
      vi.mocked(supabase).from.mockImplementation(() => {
        throw new Error('Network error');
      });

      const result = await DatabaseValidator.validateConnection();

      expect(result.success).toBe(false);
      expect(result.message).toBe('Database connection error');
    });
  });

  describe('validateTableStructure', () => {
    it('should return success when all tables are accessible', async () => {
      vi.mocked(supabase).from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          limit: vi.fn().mockReturnValue({
            data: [{ id: 'test' }],
            error: null,
          }),
        }),
      });

      const result = await DatabaseValidator.validateTableStructure();

      expect(result.success).toBe(true);
      expect(result.message).toBe('All required tables are accessible');
      expect(result.details).toHaveLength(4); // people, companies, jobs, user_profiles
    });

    it('should return failure when some tables are missing', async () => {
      let callCount = 0;
      vi.mocked(supabase).from.mockImplementation(() => {
        callCount++;
        if (callCount === 2) {
          return {
            select: vi.fn().mockReturnValue({
              limit: vi.fn().mockReturnValue({
                data: null,
                error: { message: 'Table not found' },
              }),
            }),
          };
        }
        return {
          select: vi.fn().mockReturnValue({
            limit: vi.fn().mockReturnValue({
              data: [{ id: 'test' }],
              error: null,
            }),
          }),
        };
      });

      const result = await DatabaseValidator.validateTableStructure();

      expect(result.success).toBe(false);
      expect(result.message).toContain('Missing or inaccessible tables');
    });
  });

  describe('validateDataIntegrity', () => {
    it('should return success when data integrity is good', async () => {
      vi.mocked(supabase).from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          not: vi.fn().mockReturnValue({
            is: vi.fn().mockReturnValue({
              data: [],
              error: null,
            }),
          }),
        }),
      });

      const result = await DatabaseValidator.validateDataIntegrity();

      expect(result.success).toBe(true);
      expect(result.message).toBe('Data integrity checks passed');
    });

    it('should return failure when data integrity issues exist', async () => {
      let callCount = 0;
      vi.mocked(supabase).from.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return {
            select: vi.fn().mockReturnValue({
              not: vi.fn().mockReturnValue({
                is: vi.fn().mockReturnValue({
                  data: [{ id: 'orphaned-person' }],
                  error: null,
                }),
              }),
            }),
          };
        }
        return {
          select: vi.fn().mockReturnValue({
            not: vi.fn().mockReturnValue({
              is: vi.fn().mockReturnValue({
                data: [],
                error: null,
              }),
            }),
          }),
        };
      });

      const result = await DatabaseValidator.validateDataIntegrity();

      expect(result.success).toBe(false);
      expect(result.message).toContain('Data integrity issues found');
    });
  });
});

describe('ApiValidator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('validateReportingService', () => {
    it('should return success when reporting service is working', async () => {
      vi.mocked(supabase).from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          count: 100,
        }),
      });

      const result = await ApiValidator.validateReportingService();

      expect(result.success).toBe(true);
      expect(result.message).toBe('Reporting service validation successful');
      expect(result.details.peopleCount).toBe(100);
    });
  });

  describe('validateAuthService', () => {
    it('should return success when auth service is working', async () => {
      vi.mocked(supabase).auth.getUser.mockResolvedValue({
        data: { user: { id: 'test-user' } },
        error: null,
      });

      const result = await ApiValidator.validateAuthService();

      expect(result.success).toBe(true);
      expect(result.message).toBe('Auth service validation successful');
      expect(result.details.hasUser).toBe(true);
    });

    it('should return failure when auth service fails', async () => {
      vi.mocked(supabase).auth.getUser.mockResolvedValue({
        data: { user: null },
        error: { message: 'Auth failed' },
      });

      const result = await ApiValidator.validateAuthService();

      expect(result.success).toBe(false);
      expect(result.message).toBe('Auth service validation failed');
    });
  });
});

describe('ComponentValidator', () => {
  describe('validateRequiredProps', () => {
    it('should return success when all required props are present', () => {
      const props = { name: 'Test', age: 25, email: 'test@example.com' };
      const requiredProps = ['name', 'age'];

      const result = ComponentValidator.validateRequiredProps(
        'TestComponent',
        props,
        requiredProps
      );

      expect(result.success).toBe(true);
      expect(result.message).toBe('TestComponent has all required props');
    });

    it('should return failure when required props are missing', () => {
      const props = { name: 'Test' };
      const requiredProps = ['name', 'age', 'email'];

      const result = ComponentValidator.validateRequiredProps(
        'TestComponent',
        props,
        requiredProps
      );

      expect(result.success).toBe(false);
      expect(result.message).toContain('TestComponent missing required props');
      expect(result.details.missingProps).toEqual(['age', 'email']);
    });
  });

  describe('validateDataTypes', () => {
    it('should return success when prop types are correct', () => {
      const props = { name: 'Test', age: 25, isActive: true };
      const typeMap = { name: 'string', age: 'number', isActive: 'boolean' };

      const result = ComponentValidator.validateDataTypes(
        'TestComponent',
        props,
        typeMap
      );

      expect(result.success).toBe(true);
      expect(result.message).toBe('TestComponent has correct prop types');
    });

    it('should return failure when prop types are incorrect', () => {
      const props = { name: 'Test', age: '25', isActive: 'true' };
      const typeMap = { name: 'string', age: 'number', isActive: 'boolean' };

      const result = ComponentValidator.validateDataTypes(
        'TestComponent',
        props,
        typeMap
      );

      expect(result.success).toBe(false);
      expect(result.message).toContain('TestComponent has type errors');
      expect(result.details).toHaveLength(2); // age and isActive type errors
    });
  });
});

describe('RuntimeTestRunner', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('runAllTests', () => {
    it('should run all validation tests', async () => {
      // Mock successful responses
      vi.mocked(supabase).from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          limit: vi.fn().mockReturnValue({
            data: [{ id: 'test' }],
            error: null,
          }),
        }),
      });

      vi.mocked(supabase).auth.getUser.mockResolvedValue({
        data: { user: { id: 'test-user' } },
        error: null,
      });

      const results = await RuntimeTestRunner.runAllTests();

      expect(results).toHaveLength(5); // 3 database + 2 API tests
      expect(results.every(r => r.success)).toBe(true);
    });

    it('should handle test failures gracefully', async () => {
      vi.mocked(supabase).from.mockImplementation(() => {
        throw new Error('Database error');
      });

      const results = await RuntimeTestRunner.runAllTests();

      expect(results).toHaveLength(5);
      expect(results.some(r => !r.success)).toBe(true);
    });
  });

  describe('getTestSummary', () => {
    it('should calculate correct summary', () => {
      const results = [
        { success: true, message: 'Test 1', timestamp: '2023-01-01' },
        { success: true, message: 'Test 2', timestamp: '2023-01-01' },
        { success: false, message: 'Test 3', timestamp: '2023-01-01' },
      ];

      const summary = RuntimeTestRunner.getTestSummary(results);

      expect(summary.total).toBe(3);
      expect(summary.passed).toBe(2);
      expect(summary.failed).toBe(1);
      expect(summary.successRate).toBe(66.7);
    });
  });
});

describe('devValidation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock console methods
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should run validation in development mode', async () => {
    // Mock environment
    vi.stubGlobal('import.meta.env', { NODE_ENV: 'development' });

    // Mock successful responses
    vi.mocked(supabase).from.mockReturnValue({
      select: vi.fn().mockReturnValue({
        limit: vi.fn().mockReturnValue({
          data: [{ id: 'test' }],
          error: null,
        }),
      }),
    });

    vi.mocked(supabase).auth.getUser.mockResolvedValue({
      data: { user: { id: 'test-user' } },
      error: null,
    });

    await devValidation.runDevValidation();

    expect(console.log).toHaveBeenCalledWith(
      '🔍 Running development validation...'
    );
  });

  it('should warn when not in development mode', async () => {
    vi.stubGlobal('import.meta.env', { NODE_ENV: 'production' });

    await devValidation.runDevValidation();

    expect(console.warn).toHaveBeenCalledWith(
      'Dev validation should only run in development mode'
    );
  });

  it('should validate component props', () => {
    const props = { name: 'Test' };
    const requiredProps = ['name', 'age'];

    devValidation.validateComponentProps('TestComponent', props, requiredProps);

    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining('Component validation failed')
    );
  });

  it('should validate prop types', () => {
    const props = { name: 'Test', age: '25' };
    const typeMap = { name: 'string', age: 'number' };

    devValidation.validatePropTypes('TestComponent', props, typeMap);

    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining('Type validation failed')
    );
  });
});
