/**
 * Enhanced Error Handling System
 * 
 * This module provides comprehensive error handling including:
 * - Error boundaries for different component types
 * - Retry mechanisms
 * - Error recovery strategies
 * - User-friendly error messages
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, Home, ArrowLeft } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  retryCount: number;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  maxRetries?: number;
  resetOnPropsChange?: boolean;
}

class EnhancedErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private resetTimeoutId: NodeJS.Timeout | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Log error to monitoring service
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Call custom error handler
    this.props.onError?.(error, errorInfo);

    // Auto-reset after 5 seconds if max retries not reached
    if (this.state.retryCount < (this.props.maxRetries || 3)) {
      this.resetTimeoutId = setTimeout(() => {
        this.handleRetry();
      }, 5000);
    }
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    if (this.props.resetOnPropsChange && prevProps.children !== this.props.children) {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: 0
      });
    }
  }

  componentWillUnmount() {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }
  }

  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1
    }));
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleGoBack = () => {
    window.history.back();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { error, retryCount } = this.state;
      const maxRetries = this.props.maxRetries || 3;
      const canRetry = retryCount < maxRetries;

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            
            <div className="text-center">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Something went wrong
              </h2>
              
              <p className="text-sm text-gray-600 mb-4">
                {canRetry 
                  ? `We encountered an error. Retrying automatically... (${retryCount}/${maxRetries})`
                  : 'An unexpected error occurred. Please try again or contact support.'
                }
              </p>

              {process.env.NODE_ENV === 'development' && error && (
                <details className="mb-4 text-left">
                  <summary className="text-sm font-medium text-gray-700 cursor-pointer">
                    Error Details
                  </summary>
                  <pre className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded overflow-auto">
                    {error.message}
                    {error.stack}
                  </pre>
                </details>
              )}

              <div className="flex flex-col gap-2">
                {canRetry && (
                  <Button
                    onClick={this.handleRetry}
                    className="w-full"
                    variant="default"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Retry Now
                  </Button>
                )}
                
                <div className="flex gap-2">
                  <Button
                    onClick={this.handleGoBack}
                    variant="outline"
                    className="flex-1"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Go Back
                  </Button>
                  
                  <Button
                    onClick={this.handleGoHome}
                    variant="outline"
                    className="flex-1"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Home
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Specialized error boundaries for different use cases
export const PopupErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <EnhancedErrorBoundary
    maxRetries={2}
    resetOnPropsChange={true}
    fallback={
      <div className="p-4 text-center text-red-500">
        <AlertCircle className="w-8 h-8 mx-auto mb-2" />
        <p className="text-sm">Failed to load popup content</p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.location.reload()}
          className="mt-2"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Reload Page
        </Button>
      </div>
    }
  >
    {children}
  </EnhancedErrorBoundary>
);

export const DataTableErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <EnhancedErrorBoundary
    maxRetries={1}
    fallback={
      <div className="p-8 text-center">
        <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
        <h3 className="text-lg font-semibold mb-2">Failed to load data</h3>
        <p className="text-gray-600 mb-4">There was an error loading the table data.</p>
        <Button
          onClick={() => window.location.reload()}
          variant="default"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Reload Page
        </Button>
      </div>
    }
  >
    {children}
  </EnhancedErrorBoundary>
);

export const AssignmentErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <EnhancedErrorBoundary
    maxRetries={3}
    fallback={
      <div className="p-4 text-center text-red-500">
        <AlertCircle className="w-6 h-6 mx-auto mb-2" />
        <p className="text-sm">Assignment failed</p>
        <p className="text-xs text-gray-500">Please try again or contact support</p>
      </div>
    }
  >
    {children}
  </EnhancedErrorBoundary>
);

// Error recovery utilities
export const useErrorRecovery = () => {
  const [error, setError] = React.useState<Error | null>(null);
  const [retryCount, setRetryCount] = React.useState(0);

  const handleError = React.useCallback((error: Error) => {
    setError(error);
    console.error('Error occurred:', error);
  }, []);

  const retry = React.useCallback(() => {
    setError(null);
    setRetryCount(prev => prev + 1);
  }, []);

  const reset = React.useCallback(() => {
    setError(null);
    setRetryCount(0);
  }, []);

  return {
    error,
    retryCount,
    handleError,
    retry,
    reset,
    hasError: !!error
  };
};

// Network error handling
export const useNetworkErrorHandler = () => {
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);
  const [retryCount, setRetryCount] = React.useState(0);

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const retry = React.useCallback(() => {
    setRetryCount(prev => prev + 1);
  }, []);

  return {
    isOnline,
    retryCount,
    retry,
    isOffline: !isOnline
  };
};

export default EnhancedErrorBoundary;
