/**
 * Enhanced Error Boundary with Modern Error Handling
 * Provides better error recovery and user experience
 */

import {
  AppError,
  ErrorCategory,
  ErrorFactory,
  ErrorSeverity,
  ErrorType,
} from '@/types/errors';
import { enhancedErrorHandler } from '@/utils/enhancedErrorHandler';
import React, { Component, ErrorInfo, ReactNode } from 'react';

export interface ErrorBoundaryState {
  hasError: boolean;
  error: AppError | null;
  errorInfo: ErrorInfo | null;
  retryCount: number;
  lastErrorTime: number;
}

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: AppError, errorInfo: ErrorInfo) => void;
  onRetry?: () => void;
  maxRetries?: number;
  recoverable?: boolean;
  showDetails?: boolean;
  componentName?: string;
  severity?: ErrorSeverity;
  resetKeys?: Array<string | number>;
  resetOnPropsChange?: boolean;
}

export class EnhancedErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  private resetTimeoutId: number | null = null;

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
      lastErrorTime: Date.now(),
    };
  }

  async componentDidCatch(error: Error, errorInfo: ErrorInfo): Promise<void> {
    const appError = await enhancedErrorHandler.handleError(error, {
      component: this.props.componentName || 'ErrorBoundary',
      action: 'component_error',
      metadata: {
        componentStack: errorInfo.componentStack,
        retryCount: this.state.retryCount,
        props: this.props.componentName,
      },
    });

    this.setState({
      error: appError,
      errorInfo,
    });

    // Call custom error handler
    this.props.onError?.(appError, errorInfo);
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    const { resetKeys, resetOnPropsChange } = this.props;

    if (resetOnPropsChange && resetKeys) {
      const hasResetKeyChanged = resetKeys.some(
        (key, index) => key !== prevProps.resetKeys?.[index]
      );

      if (hasResetKeyChanged && this.state.hasError) {
        this.resetErrorBoundary();
      }
    }
  }

  componentWillUnmount(): void {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }
  }

  private resetErrorBoundary = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
      lastErrorTime: 0,
    });
  };

  private handleRetry = (): void => {
    const { maxRetries = 3 } = this.props;

    if (this.state.retryCount < maxRetries) {
      this.setState(prevState => ({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: prevState.retryCount + 1,
      }));

      this.props.onRetry?.();
    }
  };

  private handleReload = (): void => {
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { error } = this.state;
      const {
        maxRetries = 3,
        recoverable = true,
        showDetails = false,
      } = this.props;

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

            <h2 className='text-lg font-semibold text-foreground text-center mb-2'>
              {error?.severity === ErrorSeverity.CRITICAL
                ? 'Critical Error'
                : 'Something went wrong'}
            </h2>

            <p className='text-sm text-muted-foreground text-center mb-6'>
              {error?.userMessage ||
                (recoverable
                  ? "We're sorry, but something unexpected happened. You can try again or reload the page."
                  : 'A critical error occurred. Please reload the page to continue.')}
            </p>

            {showDetails && error && (
              <details className='mb-6'>
                <summary className='text-sm font-medium text-foreground cursor-pointer'>
                  Error Details
                </summary>
                <div className='mt-2 p-3 bg-gray-100 rounded text-xs font-mono text-muted-foreground overflow-auto max-h-32'>
                  <div className='mb-2'>
                    <strong>Type:</strong> {error.type}
                  </div>
                  <div className='mb-2'>
                    <strong>Code:</strong> {error.code}
                  </div>
                  <div className='mb-2'>
                    <strong>Message:</strong> {error.message}
                  </div>
                  <div className='mb-2'>
                    <strong>Severity:</strong> {error.severity}
                  </div>
                  <div className='mb-2'>
                    <strong>Recoverable:</strong>{' '}
                    {error.recoverable ? 'Yes' : 'No'}
                  </div>
                  {error.stack && (
                    <div>
                      <strong>Stack:</strong>
                      <pre className='whitespace-pre-wrap'>{error.stack}</pre>
                    </div>
                  )}
                </div>
              </details>
            )}

            <div className='flex space-x-3'>
              {recoverable && this.props.recoverable !== false && (
                <button
                  onClick={this.handleRetry}
                  disabled={this.state.retryCount >= maxRetries}
                  className='flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  Try Again ({this.state.retryCount}/{maxRetries})
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
                Retry attempt {this.state.retryCount} of {maxRetries}
              </p>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Feature-specific error boundary
export const FeatureErrorBoundary: React.FC<{
  feature: string;
  children: ReactNode;
  fallback?: ReactNode;
}> = ({ feature, children, fallback }) => {
  return (
    <EnhancedErrorBoundary
      componentName={`FeatureErrorBoundary-${feature}`}
      severity={ErrorSeverity.MEDIUM}
      fallback={
        fallback || (
          <div className='p-4 border border-red-200 rounded-lg bg-destructive/10'>
            <div className='flex items-center gap-2 text-destructive'>
              <svg
                className='h-4 w-4'
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
              <span className='text-sm font-medium'>{feature} Error</span>
            </div>
            <p className='text-sm text-destructive mt-1'>
              There was an issue with the {feature.toLowerCase()} feature.
              Please try again.
            </p>
          </div>
        )
      }
      onError={(error, errorInfo) => {
        console.error(`${feature} Error:`, error, errorInfo);
      }}
    >
      {children}
    </EnhancedErrorBoundary>
  );
};

// Assignment-specific error boundary
export const AssignmentErrorBoundary: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <FeatureErrorBoundary feature='Assignment'>{children}</FeatureErrorBoundary>
  );
};

// Mobile-specific error boundary
export const MobileErrorBoundary: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <FeatureErrorBoundary feature='Mobile'>{children}</FeatureErrorBoundary>
  );
};

// Network error boundary
export class NetworkErrorBoundary extends Component<
  {
    children: ReactNode;
    onNetworkError?: (error: AppError) => void;
  },
  { hasNetworkError: boolean; error: AppError | null }
> {
  constructor(props: {
    children: ReactNode;
    onNetworkError?: (error: AppError) => void;
  }) {
    super(props);
    this.state = { hasNetworkError: false, error: null };
  }

  componentDidMount(): void {
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);
  }

  componentWillUnmount(): void {
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
  }

  private handleOnline = (): void => {
    this.setState({ hasNetworkError: false, error: null });
  };

  private handleOffline = (): void => {
    const error = ErrorFactory.create(
      ErrorType.NETWORK_ERROR,
      'NETWORK_CONNECTION_LOST',
      'Network connection lost',
      "You're currently offline. Please check your internet connection and try again.",
      {
        severity: ErrorSeverity.HIGH,
        category: ErrorCategory.NETWORK,
        recoverable: true,
      }
    );

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
              {this.state.error?.userMessage ||
                "You're currently offline. Please check your internet connection and try again."}
            </p>

            <button
              onClick={() => window.location.reload()}
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

// Error boundary provider for the entire app
export const ErrorBoundaryProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <NetworkErrorBoundary>
      <EnhancedErrorBoundary
        componentName='App'
        severity={ErrorSeverity.CRITICAL}
        maxRetries={1}
        recoverable={false}
        onError={(error, errorInfo) => {
          console.error('App-level error:', error, errorInfo);
        }}
      >
        {children}
      </EnhancedErrorBoundary>
    </NetworkErrorBoundary>
  );
};
