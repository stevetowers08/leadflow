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
  CRITICAL = 'critical'
}

// Error types
export enum ErrorType {
  RENDER = 'render',
  NETWORK = 'network',
  VALIDATION = 'validation',
  PERMISSION = 'permission',
  DATA = 'data',
  UNKNOWN = 'unknown'
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
  metadata?: Record<string, any>;
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
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      const error = new Error(`Unhandled Promise Rejection: ${event.reason}`);
      this.handleError(error, {
        componentName: 'Global',
        timestamp: new Date(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        severity: ErrorSeverity.HIGH,
        type: ErrorType.UNKNOWN,
        recoverable: false,
        metadata: { reason: event.reason }
      });
    });

    // Handle global errors
    window.addEventListener('error', (event) => {
      const error = new Error(`Global Error: ${event.message}`);
      this.handleError(error, {
        componentName: 'Global',
        timestamp: new Date(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        severity: ErrorSeverity.HIGH,
        type: ErrorType.UNKNOWN,
        recoverable: false,
        metadata: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        }
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

  private async reportError(error: Error, context: ErrorContext): Promise<void> {
    // Send to error reporting service
    if (import.meta.env.PROD) {
      try {
        // Replace with actual error reporting service
        await fetch('/api/errors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            error: {
              message: error.message,
              stack: error.stack,
              name: error.name
            },
            context
          })
        });
      } catch (reportError) {
        logger.error('Failed to send error report:', reportError);
      }
    }
  }
}

// Base error boundary component
export class BaseErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private errorHandler = GlobalErrorHandler.getInstance();

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
      lastErrorTime: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
      lastErrorTime: Date.now()
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const context: ErrorContext = {
      componentName: this.props.componentName || 'Unknown',
      timestamp: new Date(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      stackTrace: error.stack,
      severity: this.props.severity || ErrorSeverity.MEDIUM,
      type: ErrorType.RENDER,
      recoverable: this.props.recoverable !== false,
      metadata: {
        componentStack: errorInfo.componentStack,
        retryCount: this.state.retryCount
      }
    };

    this.errorHandler.handleError(error, context);

    this.setState({
      error,
      errorInfo
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
        retryCount: this.state.retryCount + 1
      });
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

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            
            <h2 className="text-lg font-semibold text-gray-900 text-center mb-2">
              Something went wrong
            </h2>
            
            <p className="text-sm text-gray-600 text-center mb-6">
              {this.props.recoverable !== false 
                ? "We're sorry, but something unexpected happened. You can try again or reload the page."
                : "A critical error occurred. Please reload the page to continue."
              }
            </p>

            {this.props.showDetails && this.state.error && (
              <details className="mb-6">
                <summary className="text-sm font-medium text-gray-700 cursor-pointer">
                  Error Details
                </summary>
                <div className="mt-2 p-3 bg-gray-100 rounded text-xs font-mono text-gray-600 overflow-auto max-h-32">
                  <div className="mb-2">
                    <strong>Error:</strong> {this.state.error.message}
                  </div>
                  {this.state.error.stack && (
                    <div>
                      <strong>Stack:</strong>
                      <pre className="whitespace-pre-wrap">{this.state.error.stack}</pre>
                    </div>
                  )}
                </div>
              </details>
            )}

            <div className="flex space-x-3">
              {this.props.enableRetry !== false && this.props.recoverable !== false && (
                <button
                  onClick={this.handleRetry}
                  disabled={this.state.retryCount >= (this.props.maxRetries || 3)}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Try Again ({this.state.retryCount}/{(this.props.maxRetries || 3)})
                </button>
              )}
              
              <button
                onClick={this.handleReload}
                className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
              >
                Reload Page
              </button>
            </div>

            {this.state.retryCount > 0 && (
              <p className="text-xs text-gray-500 text-center mt-4">
                Retry attempt {this.state.retryCount} of {(this.props.maxRetries || 3)}
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
      maxRetries: 2
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
      showDetails: import.meta.env.DEV
    });
  }
}

export class CriticalErrorBoundary extends BaseErrorBoundary {
  constructor(props: Omit<ErrorBoundaryProps, 'severity' | 'recoverable'>) {
    const criticalProps: ErrorBoundaryProps = {
      ...props,
      severity: ErrorSeverity.CRITICAL,
      recoverable: false,
      enableRetry: false,
      showDetails: true
    };
    super(criticalProps);
  }
}

// Network error boundary
export class NetworkErrorBoundary extends Component<{
  children: ReactNode;
  onNetworkError?: (error: Error) => void;
}, { hasNetworkError: boolean; error: Error | null }> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasNetworkError: false, error: null };
  }

  componentDidMount(): void {
    // Listen for network errors
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
    const error = new Error('Network connection lost');
    this.setState({ hasNetworkError: true, error });
    this.props.onNetworkError?.(error);
  };

  render(): ReactNode {
    if (this.state.hasNetworkError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-yellow-100 rounded-full mb-4">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Connection Lost
            </h2>
            
            <p className="text-sm text-gray-600 mb-6">
              You're currently offline. Please check your internet connection and try again.
            </p>

            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
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

// Error boundary provider
export const ErrorBoundaryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <CriticalErrorBoundary componentName="App">
      <NetworkErrorBoundary>
        {children}
      </NetworkErrorBoundary>
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
      userAgent: navigator.userAgent,
      url: window.location.href,
      severity: ErrorSeverity.MEDIUM,
      type: ErrorType.UNKNOWN,
      recoverable: true,
      ...context
    };

    errorHandler.handleError(error, fullContext);
  };

  return { handleError };
}

// Export ErrorBoundary as default
export { BaseErrorBoundary as ErrorBoundary };
