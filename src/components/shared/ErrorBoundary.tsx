import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetKeys?: Array<string | number>;
  resetOnPropsChange?: boolean;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  private resetTimeoutId: number | null = null;

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // Call the onError callback if provided
    this.props.onError?.(error, errorInfo);

    // Log to external service in production
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to error reporting service
      // errorReportingService.captureException(error, { extra: errorInfo });
    }
  }

  componentDidUpdate(prevProps: Props) {
    const { resetKeys, resetOnPropsChange } = this.props;
    const { hasError } = this.state;

    if (hasError && prevProps.resetKeys !== resetKeys) {
      if (resetOnPropsChange && this.shouldResetDueToPropsChange(prevProps)) {
        this.resetErrorBoundary();
      }
    }
  }

  componentWillUnmount() {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }
  }

  private shouldResetDueToPropsChange(prevProps: Props): boolean {
    const { resetKeys } = this.props;
    if (!resetKeys || !prevProps.resetKeys) return false;

    return resetKeys.some((key, index) => key !== prevProps.resetKeys?.[index]);
  }

  private resetErrorBoundary = () => {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }

    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  private handleRetry = () => {
    this.resetErrorBoundary();
  };

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <Card className='mx-auto max-w-md mt-8'>
          <CardHeader className='text-center'>
            <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100'>
              <AlertTriangle className='h-6 w-6 text-destructive' />
            </div>
            <CardTitle className='text-lg font-semibold text-foreground'>
              Something went wrong
            </CardTitle>
          </CardHeader>
          <CardContent className='text-center space-y-4'>
            <p className='text-sm text-muted-foreground'>
              We encountered an unexpected error. This has been logged and we'll
              look into it.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className='text-left'>
                <summary className='cursor-pointer text-sm font-medium text-foreground mb-2'>
                  Error Details (Development)
                </summary>
                <div className='bg-gray-100 p-3 rounded-md text-xs font-mono text-foreground overflow-auto'>
                  <div className='mb-2'>
                    <strong>Error:</strong> {this.state.error.message}
                  </div>
                  {this.state.error.stack && (
                    <div>
                      <strong>Stack:</strong>
                      <pre className='whitespace-pre-wrap mt-1'>
                        {this.state.error.stack}
                      </pre>
                    </div>
                  )}
                  {this.state.errorInfo?.componentStack && (
                    <div className='mt-2'>
                      <strong>Component Stack:</strong>
                      <pre className='whitespace-pre-wrap mt-1'>
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}

            <div className='flex gap-2 justify-center'>
              <Button
                onClick={this.handleRetry}
                variant='outline'
                size='sm'
                className='flex items-center gap-2'
              >
                <RefreshCw className='h-4 w-4' />
                Try Again
              </Button>
              <Button
                onClick={this.handleReload}
                variant='default'
                size='sm'
                className='flex items-center gap-2'
              >
                <RefreshCw className='h-4 w-4' />
                Reload Page
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

// Assignment-specific error boundary
export const AssignmentErrorBoundary: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <ErrorBoundary
      fallback={
        <div className='p-4 border border-red-200 rounded-lg bg-destructive/10'>
          <div className='flex items-center gap-2 text-destructive'>
            <AlertTriangle className='h-4 w-4' />
            <span className='text-sm font-medium'>Assignment Error</span>
          </div>
          <p className='text-sm text-destructive mt-1'>
            There was an issue with the assignment system. Please try again.
          </p>
        </div>
      }
      onError={(error, errorInfo) => {
        console.error('Assignment Error:', error, errorInfo);
        // Could send to analytics service
      }}
    >
      {children}
    </ErrorBoundary>
  );
};

// Mobile-specific error boundary
export const MobileErrorBoundary: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <ErrorBoundary
      fallback={
        <div className='p-4 text-center'>
          <AlertTriangle className='h-8 w-8 text-destructive mx-auto mb-2' />
          <p className='text-sm text-muted-foreground mb-4'>
            Something went wrong with the mobile interface.
          </p>
          <Button onClick={() => window.location.reload()} size='sm'>
            Reload
          </Button>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
};

export default ErrorBoundary;
