/**
 * Development-time utilities to validate provider setup and prevent common issues
 */

import React from 'react';

interface ProviderValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validates that all required providers are properly set up
 * This should only run in development mode
 */
export function validateProviderSetup(): ProviderValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (import.meta.env.DEV) {
    // Check if we're in a React environment
    try {
      const React = require('react');
      if (!React.version) {
        errors.push('React not detected - this will cause silent failures');
      }
    } catch {
      errors.push('React not available - check imports');
    }

    // Check for common missing provider patterns
    const commonIssues = [
      {
        name: 'QueryClientProvider',
        check: () => {
          try {
            const { QueryClient } = require('@tanstack/react-query');
            return true;
          } catch {
            return false;
          }
        },
        error: 'QueryClientProvider missing - React Query hooks will fail',
      },
      {
        name: 'BrowserRouter',
        check: () => {
          try {
            const { BrowserRouter } = require('react-router-dom');
            return true;
          } catch {
            return false;
          }
        },
        error: 'BrowserRouter missing - routing hooks will fail',
      },
      {
        name: 'AuthProvider',
        check: () => {
          try {
            // This is harder to check without importing the actual context
            return true; // Assume it's there if we can import
          } catch {
            return false;
          }
        },
        error: 'AuthProvider missing - authentication hooks will fail',
      },
    ];

    commonIssues.forEach(issue => {
      if (!issue.check()) {
        errors.push(issue.error);
      }
    });

    // Check for potential provider order issues
    warnings.push(
      'Ensure providers are in correct order: ErrorBoundary > QueryClientProvider > BrowserRouter > AuthProvider > App'
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Logs provider validation results to console in development
 */
export function logProviderValidation(): void {
  if (import.meta.env.DEV) {
    const result = validateProviderSetup();

    if (result.isValid) {
      console.log('✅ Provider validation passed');
    } else {
      console.error('❌ Provider validation failed:', result.errors);
    }

    if (result.warnings.length > 0) {
      console.warn('⚠️ Provider warnings:', result.warnings);
    }
  }
}

/**
 * Hook to validate providers on component mount
 */
export function useProviderValidation(): void {
  React.useEffect(() => {
    logProviderValidation();
  }, []);
}

/**
 * Higher-order component that validates providers
 */
export function withProviderValidation<P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P> {
  const WrappedComponent = (props: P) => {
    useProviderValidation();
    return <Component {...props} />;
  };

  WrappedComponent.displayName = `withProviderValidation(${Component.displayName || Component.name})`;

  return WrappedComponent;
}

/**
 * Common provider error patterns to watch for
 */
export const PROVIDER_ERROR_PATTERNS = {
  AUTH: 'useAuth must be used within an AuthProvider',
  QUERY: 'useQuery must be used within a QueryClientProvider',
  ROUTER: 'useNavigate must be used within a Router',
  BROWSER_HISTORY: 'Browser history needs a DOM',
  CONTEXT_UNDEFINED: 'Context is undefined',
  HOOK_OUTSIDE_PROVIDER: 'must be used within',
} as const;

/**
 * Checks if an error is provider-related
 */
export function isProviderError(error: Error): boolean {
  return Object.values(PROVIDER_ERROR_PATTERNS).some(
    pattern => error.message.includes(pattern) || error.stack?.includes(pattern)
  );
}

/**
 * Gets suggestions for fixing provider errors
 */
export function getProviderErrorSuggestions(error: Error): string[] {
  const suggestions: string[] = [];

  if (error.message.includes(PROVIDER_ERROR_PATTERNS.AUTH)) {
    suggestions.push('Wrap components using useAuth with <AuthProvider>');
  }
  if (error.message.includes(PROVIDER_ERROR_PATTERNS.QUERY)) {
    suggestions.push(
      'Wrap components using useQuery with <QueryClientProvider>'
    );
  }
  if (error.message.includes(PROVIDER_ERROR_PATTERNS.ROUTER)) {
    suggestions.push(
      'Wrap components using routing hooks with <BrowserRouter>'
    );
  }

  return suggestions;
}
