/**
 * Global Error Handler Initialization
 * Sets up comprehensive error logging and email notifications
 */

import { enhancedErrorLogger } from '@/services/supabaseErrorService';
import { supabaseErrorService } from '@/services/supabaseErrorService';
import { ErrorSeverity, ErrorCategory } from '@/services/errorLogger';

// Initialize error service with admin email
export async function initializeErrorHandling(
  adminEmail?: string
): Promise<void> {
  try {
    // Initialize the Supabase error service
    await supabaseErrorService.initialize(adminEmail);

    // Error handling system initialized
  } catch (error) {
    console.error('❌ Failed to initialize error handling:', error);
  }
}

// Global error handlers
export function setupGlobalErrorHandlers(): void {
  // Only setup on client-side
  if (typeof window === 'undefined') {
    return;
  }

  // Handle unhandled JavaScript errors
  window.addEventListener('error', async event => {
    await enhancedErrorLogger.logError(
      event.error || event.message,
      ErrorSeverity.HIGH,
      ErrorCategory.UNKNOWN,
      {
        component: 'global',
        action: 'unhandled_error',
        metadata: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          type: 'javascript_error',
        },
      }
    );
  });

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', async event => {
    await enhancedErrorLogger.logError(
      event.reason,
      ErrorSeverity.HIGH,
      ErrorCategory.UNKNOWN,
      {
        component: 'global',
        action: 'unhandled_promise_rejection',
        metadata: {
          promise: event.promise,
          type: 'promise_rejection',
        },
      }
    );
  });

  // Handle fetch errors
  const originalFetch = window.fetch;
  window.fetch = async (...args) => {
    try {
      const response = await originalFetch(...args);

      // Log failed requests
      if (!response.ok) {
        await enhancedErrorLogger.logNetworkError(
          `HTTP ${response.status}: ${response.statusText}`,
          {
            component: 'fetch',
            action: 'http_request',
            metadata: {
              url: args[0]?.toString(),
              status: response.status,
              statusText: response.statusText,
              method: args[1]?.method || 'GET',
            },
          }
        );
      }

      return response;
    } catch (error) {
      await enhancedErrorLogger.logNetworkError(error as Error, {
        component: 'fetch',
        action: 'network_error',
        metadata: {
          url: args[0]?.toString(),
          method: args[1]?.method || 'GET',
        },
      });
      throw error;
    }
  };

  // Global error handlers set up
}

// React Error Boundary integration
export const logReactError = async (
  error: Error,
  errorInfo: { componentStack?: string }
) => {
  await enhancedErrorLogger.logError(
    error,
    ErrorSeverity.HIGH,
    ErrorCategory.UI,
    {
      component: 'react_error_boundary',
      action: 'component_error',
      metadata: {
        componentStack: errorInfo.componentStack,
        errorBoundary: true,
      },
    }
  );
};

// Supabase error handler
export async function handleSupabaseError(
  error: unknown,
  context: string
): Promise<void> {
  const supabaseError = error as {
    code?: string;
    message?: string;
    details?: string;
    hint?: string;
  };
  await enhancedErrorLogger.logDatabaseError(error, {
    component: 'supabase',
    action: context,
    metadata: {
      errorCode: supabaseError.code,
      errorMessage: supabaseError.message,
      errorDetails: supabaseError.details,
      errorHint: supabaseError.hint,
    },
  });
}

// API error handler
export async function handleApiError(
  error: unknown,
  context: string,
  endpoint?: string
): Promise<void> {
  const apiError = error as {
    message?: string;
    status?: number;
    response?: unknown;
  };
  await enhancedErrorLogger.logNetworkError(error, {
    component: 'api',
    action: context,
    metadata: {
      endpoint,
      errorMessage: apiError.message,
      errorStatus: apiError.status,
      errorResponse: apiError.response,
    },
  });
}

// Authentication error handler
export async function handleAuthError(
  error: unknown,
  context: string
): Promise<void> {
  const authError = error as { code?: string; message?: string };
  await enhancedErrorLogger.logAuthError(error, {
    component: 'authentication',
    action: context,
    metadata: {
      errorCode: authError.code,
      errorMessage: authError.message,
    },
  });
}

// Business logic error handler
export async function handleBusinessError(
  error: unknown,
  context: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  const businessError = error as { message?: string };
  await enhancedErrorLogger.logError(
    error,
    ErrorSeverity.MEDIUM,
    ErrorCategory.BUSINESS_LOGIC,
    {
      component: 'business_logic',
      action: context,
      metadata: {
        ...metadata,
        errorMessage: businessError.message,
      },
    }
  );
}

// Critical error handler for system-level issues
export async function handleCriticalError(
  error: unknown,
  context: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  await enhancedErrorLogger.logCriticalError(error, {
    component: 'system',
    action: context,
    metadata: {
      ...metadata,
      errorMessage: error.message,
      critical: true,
    },
  });
}
