/**
 * Comprehensive Error Boundary System
 * Provides multiple layers of error handling and recovery
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { logger } from '../utils/logger';

// Error severity levels
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

// Error types
export enum ErrorType {
  RENDER = 'render',
  NETWORK = 'network',
  VALIDATION = 'validation',
  PERMISSION = 'permission',
  DATA = 'data',
  UNKNOWN = 'unknown',
}

// Error context interface
export interface ErrorContext {
  componentName?: string;
  userId?: string;
  userRole?: string;
  timestamp: Date;
  userAgent: string;
  url: string;
  stackTrace?: string;
  severity: ErrorSeverity;
  type: ErrorType;
  recoverable: boolean;
  metadata?: Record<string, unknown>;
}

// Error boundary props
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo, context: ErrorContext) => void;
  severity?: ErrorSeverity;
  componentName?: string;
  recoverable?: boolean;
  showDetails?: boolean;
  enableRetry?: boolean;
  maxRetries?: number;
}

// Error boundary state
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  retryCount: number;
  lastErrorTime: number;
}

// Global error handler
class GlobalErrorHandler {
  private static instance: GlobalErrorHandler;
  private errorQueue: Array<{ error: Error; context: ErrorContext }> = [];
  private isProcessing = false;

  static getInstance(): GlobalErrorHandler {
    if (!GlobalErrorHandler.instance) {
      GlobalErrorHandler.instance = new GlobalErrorHandler();
    }
    return GlobalErrorHandler.instance;
  }

  private constructor() {
    this.setupGlobalHandlers();
  }

  private setupGlobalHandlers(): void {
    // Only setup on client-side
    if (typeof window === 'undefined') {
      return;
    }

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', event => {
      const error = new Error(`Unhandled Promise Rejection: ${event.reason}`);
      this.handleError(error, {
        componentName: 'Global',
        timestamp: new Date(),
        userAgent:
          typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
        url: window.location.href,
        severity: ErrorSeverity.HIGH,
        type: ErrorType.UNKNOWN,
        recoverable: false,
        metadata: { reason: event.reason },
      });
    });

    // Handle global errors
    window.addEventListener('error', event => {
      const error = new Error(`Global Error: ${event.message}`);
      this.handleError(error, {
        componentName: 'Global',
        timestamp: new Date(),
        userAgent:
          typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
        url: window.location.href,
        severity: ErrorSeverity.HIGH,
        type: ErrorType.UNKNOWN,
        recoverable: false,
        metadata: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        },
      });
    });
  }

  handleError(error: Error, context: ErrorContext): void {
    // Add to queue
    this.errorQueue.push({ error, context });

    // Log error
    logger.error('Error occurred:', error, context);

    // Process queue if not already processing
    if (!this.isProcessing) {
      this.processErrorQueue();
    }
  }

  private async processErrorQueue(): Promise<void> {
    if (this.isProcessing || this.errorQueue.length === 0) return;

    this.isProcessing = true;

    while (this.errorQueue.length > 0) {
      const { error, context } = this.errorQueue.shift()!;

      try {
        await this.reportError(error, context);
      } catch (reportError) {
        logger.error('Failed to report error:', reportError);
      }
    }

    this.isProcessing = false;
  }

  private async reportError(
    error: Error,
    context: ErrorContext
  ): Promise<void> {
    // Send to error reporting service
    // Use Next.js compatible environment check
    const isProduction =
      typeof process !== 'undefined' && process.env.NODE_ENV === 'production';
    if (isProduction) {
      try {
        // Replace with actual error reporting service
        await fetch('/api/errors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            error: {
              message: error.message,
              stack: error.stack,
              name: error.name,
            },
            context,
          }),
        });
      } catch (reportError) {
        logger.error('Failed to send error report:', reportError);
      }
    }
  }
}

// Base error boundary component
export class BaseErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  private errorHandler = GlobalErrorHandler.getInstance();

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
      lastErrorTime: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
      lastErrorTime: Date.now(),
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/01e36b46-c269-4815-ad0a-9aee92c9938f', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: 'ErrorBoundary.tsx:211',
        message: 'Error caught in boundary',
        data: {
          errorMessage: error.message,
          errorName: error.name,
          componentName: this.props.componentName || 'Unknown',
          timestamp: Date.now(),
        },
        timestamp: Date.now(),
        sessionId: 'debug-session',
        runId: 'run1',
        hypothesisId: 'D',
      }),
    }).catch(() => {});
    // #endregion
    const context: ErrorContext = {
      componentName: this.props.componentName || 'Unknown',
      timestamp: new Date(),
      userAgent:
        typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      url: typeof window !== 'undefined' ? window.location.href : 'unknown',
      stackTrace: error.stack,
      severity: this.props.severity || ErrorSeverity.MEDIUM,
      type: ErrorType.RENDER,
      recoverable: this.props.recoverable !== false,
      metadata: {
        componentStack: errorInfo.componentStack,
        retryCount: this.state.retryCount,
      },
    };

    this.errorHandler.handleError(error, context);

    this.setState({
      error,
      errorInfo,
    });

    // Call custom error handler
    this.props.onError?.(error, errorInfo, context);
  }

  private handleRetry = (): void => {
    const { maxRetries = 3 } = this.props;

    if (this.state.retryCount < maxRetries) {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: this.state.retryCount + 1,
      });
    }
  };

  private handleReload = (): void => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  getErrorMessage(error: Error): {
    title: string;
    description: string;
    action: string;
  } {
    const errorMessage = error.message.toLowerCase();

    // Component render errors (import/compilation issues)
    if (
      errorMessage.includes('not defined') ||
      errorMessage.includes('undefined') ||
      errorMessage.includes('is not a function')
    ) {
      return {
        title: 'Component Error',
        description:
          "This section has a technical issue. You can still use other parts of the app. We've logged the error for our team.",
        action:
          'Try navigating to a different page, or contact support if this persists.',
      };
    }

    // Network/API errors
    if (
      errorMessage.includes('fetch') ||
      errorMessage.includes('network') ||
      errorMessage.includes('failed to fetch')
    ) {
      return {
        title: 'Connection Issue',
        description:
          'Unable to connect to our servers. Please check your internet connection.',
        action: 'Try again once your connection is stable.',
      };
    }

    // Data loading errors
    if (
      errorMessage.includes('null') ||
      errorMessage.includes('cannot read') ||
      errorMessage.includes('cannot access')
    ) {
      return {
        title: 'Data Loading Error',
        description: "Some information couldn't be loaded in this section.",
        action:
          'Navigate to another page and come back, or contact support if this continues.',
      };
    }

    // Authentication errors
    if (
      errorMessage.includes('unauthorized') ||
      errorMessage.includes('403') ||
      errorMessage.includes('401') ||
      errorMessage.includes('permission')
    ) {
      return {
        title: 'Access Issue',
        description: "You don't have permission to access this feature.",
        action: 'Contact your administrator if you believe this is an error.',
      };
    }

    // Generic message
    return {
      title: 'Something Went Wrong',
      description:
        'An unexpected error occurred in this section. The rest of the app is still working.',
      action: 'Navigate to another page or contact support if this continues.',
    };
  }

  getSimpleErrorMessage(error: Error): string {
    const msg = this.getErrorMessage(error);
    return `${msg.title}: ${msg.description}`;
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className='min-h-screen flex items-center justify-center bg-muted'>
          <div className='max-w-md w-full bg-white shadow-lg rounded-lg p-6'>
            <div className='flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4'>
              <svg
                className='w-6 h-6 text-destructive'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
                />
              </svg>
            </div>

            {this.state.error &&
              (() => {
                const errorInfo = this.getErrorMessage(this.state.error);
                return (
                  <>
                    <h2 className='text-lg font-semibold text-foreground text-center mb-2'>
                      {errorInfo.title}
                    </h2>
                    <p className='text-sm text-muted-foreground text-center mb-3'>
                      {errorInfo.description}
                    </p>
                    <p className='text-xs text-muted-foreground text-center mb-6 italic'>
                      {errorInfo.action}
                    </p>
                  </>
                );
              })()}

            {this.props.showDetails && this.state.error && (
              <details className='mb-6'>
                <summary className='text-sm font-medium text-foreground cursor-pointer'>
                  Error Details
                </summary>
                <div className='mt-2 p-3 bg-gray-100 rounded text-xs font-mono text-muted-foreground overflow-auto max-h-32'>
                  <div className='mb-2'>
                    <strong>Error:</strong> {this.state.error.message}
                  </div>
                  {this.state.error.stack && (
                    <div>
                      <strong>Stack:</strong>
                      <pre className='whitespace-pre-wrap'>
                        {this.state.error.stack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}

            <div className='flex space-x-3'>
              {this.props.enableRetry !== false &&
                this.props.recoverable !== false && (
                  <button
                    onClick={this.handleRetry}
                    disabled={
                      this.state.retryCount >= (this.props.maxRetries || 3)
                    }
                    className='flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    Try Again ({this.state.retryCount}/
                    {this.props.maxRetries || 3})
                  </button>
                )}

              <button
                onClick={this.handleReload}
                className='flex-1 bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700'
              >
                Reload Page
              </button>
            </div>

            {this.state.retryCount > 0 && (
              <p className='text-xs text-muted-foreground text-center mt-4'>
                Retry attempt {this.state.retryCount} of{' '}
                {this.props.maxRetries || 3}
              </p>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Specialized error boundaries
export class PageErrorBoundary extends BaseErrorBoundary {
  constructor(props: Omit<ErrorBoundaryProps, 'severity' | 'recoverable'>) {
    super({
      ...props,
      severity: ErrorSeverity.HIGH,
      recoverable: true,
      enableRetry: true,
      maxRetries: 2,
    });
  }
}

export class ComponentErrorBoundary extends BaseErrorBoundary {
  constructor(props: Omit<ErrorBoundaryProps, 'severity' | 'recoverable'>) {
    super({
      ...props,
      severity: ErrorSeverity.MEDIUM,
      recoverable: true,
      enableRetry: true,
      maxRetries: 1,
      showDetails: process.env.NODE_ENV === 'development',
    });
  }
}

export class CriticalErrorBoundary extends Component<
  Omit<ErrorBoundaryProps, 'severity' | 'recoverable'>,
  ErrorBoundaryState
> {
  private errorHandler = GlobalErrorHandler.getInstance();

  constructor(props: Omit<ErrorBoundaryProps, 'severity' | 'recoverable'>) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
      lastErrorTime: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
      lastErrorTime: Date.now(),
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const context: ErrorContext = {
      componentName: 'CriticalErrorBoundary',
      timestamp: new Date(),
      userAgent:
        typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      url: typeof window !== 'undefined' ? window.location.href : 'unknown',
      stackTrace: error.stack,
      severity: ErrorSeverity.CRITICAL,
      type: ErrorType.RENDER,
      recoverable: false,
      metadata: {
        componentStack: errorInfo.componentStack,
      },
    };

    this.errorHandler.handleError(error, context);

    this.setState({
      error,
      errorInfo,
    });
  }

  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1,
      lastErrorTime: 0,
    }));
  };

  handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  getErrorMessage(error: Error): {
    title: string;
    description: string;
    action: string;
  } {
    const errorMessage = error.message.toLowerCase();

    // Component render errors
    if (
      errorMessage.includes('not defined') ||
      errorMessage.includes('undefined') ||
      errorMessage.includes('is not a function')
    ) {
      return {
        title: 'Application Error',
        description:
          "The app encountered a technical issue. We've automatically logged this for our team.",
        action: 'Please refresh the page or contact support if this continues.',
      };
    }

    // Network errors
    if (errorMessage.includes('fetch') || errorMessage.includes('network')) {
      return {
        title: 'Connection Error',
        description:
          'Cannot connect to our servers. Please check your internet connection.',
        action: 'Once connected, refresh the page.',
      };
    }

    return {
      title: 'Critical Error',
      description:
        'The application encountered a critical error. This has been logged for our team.',
      action: 'Please refresh the page or contact support.',
    };
  }

  getSimpleErrorMessage(error: Error): string {
    const msg = this.getErrorMessage(error);
    return msg.description;
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className='min-h-screen flex items-center justify-center bg-muted px-4'>
          <div className='max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center'>
            <div className='text-destructive text-6xl mb-4'>⚠️</div>
            {this.state.error &&
              (() => {
                const errorInfo = this.getErrorMessage(this.state.error);
                return (
                  <>
                    <h1 className='text-xl font-semibold text-foreground mb-2'>
                      {errorInfo.title}
                    </h1>
                    <p className='text-muted-foreground mb-2'>
                      {errorInfo.description}
                    </p>
                    <p className='text-sm text-muted-foreground mb-4 italic'>
                      {errorInfo.action}
                    </p>
                  </>
                );
              })()}
            <button
              onClick={this.handleReload}
              className='w-full bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700'
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Network error boundary
export class NetworkErrorBoundary extends Component<
  {
    children: ReactNode;
    onNetworkError?: (error: Error) => void;
  },
  { hasNetworkError: boolean; error: Error | null }
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasNetworkError: false, error: null };
  }

  componentDidMount(): void {
    // Only setup on client-side
    if (typeof window === 'undefined') {
      return;
    }

    // Listen for network errors
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);
  }

  componentWillUnmount(): void {
    if (typeof window === 'undefined') {
      return;
    }

    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
  }

  private handleOnline = (): void => {
    this.setState({ hasNetworkError: false, error: null });
  };

  private handleOffline = (): void => {
    const error = new Error('Network connection lost');
    this.setState({ hasNetworkError: true, error });
    this.props.onNetworkError?.(error);
  };

  render(): ReactNode {
    if (this.state.hasNetworkError) {
      return (
        <div className='min-h-screen flex items-center justify-center bg-muted'>
          <div className='max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center'>
            <div className='flex items-center justify-center w-12 h-12 mx-auto bg-yellow-100 rounded-full mb-4'>
              <svg
                className='w-6 h-6 text-warning'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
                />
              </svg>
            </div>

            <h2 className='text-lg font-semibold text-foreground mb-2'>
              Connection Lost
            </h2>

            <p className='text-sm text-muted-foreground mb-6'>
              You&apos;re currently offline. Please check your internet
              connection and try again.
            </p>

            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.location.reload();
                }
              }}
              className='bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700'
            >
              Retry Connection
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Error boundary provider with graceful fallback for minor errors
export const ErrorBoundaryProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <CriticalErrorBoundary componentName='App'>
      <NetworkErrorBoundary>{children}</NetworkErrorBoundary>
    </CriticalErrorBoundary>
  );
};

// Hook for error handling
export function useErrorHandler() {
  const errorHandler = GlobalErrorHandler.getInstance();

  const handleError = (error: Error, context: Partial<ErrorContext> = {}) => {
    const fullContext: ErrorContext = {
      componentName: 'Unknown',
      timestamp: new Date(),
      userAgent:
        typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      url: typeof window !== 'undefined' ? window.location.href : 'unknown',
      severity: ErrorSeverity.MEDIUM,
      type: ErrorType.UNKNOWN,
      recoverable: true,
      ...context,
    };

    errorHandler.handleError(error, fullContext);
  };

  return { handleError };
}

// Export ErrorBoundary as default
export { BaseErrorBoundary as ErrorBoundary };
