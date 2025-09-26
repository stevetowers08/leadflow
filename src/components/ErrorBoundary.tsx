import React, { Component, ErrorInfo, ReactNode, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { useErrorHandler } from '@/hooks/useErrorHandler';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetOnPropsChange?: boolean;
  resetKeys?: Array<string | number>;
  level?: 'page' | 'component' | 'feature';
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  retryCount: number;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private resetTimeoutId?: number;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { 
      hasError: false, 
      retryCount: 0 
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ error, errorInfo });
    
    // Check for common provider-related errors
    const isProviderError = this.detectProviderError(error);
    if (isProviderError) {
      console.error('🚨 Provider Error Detected:', {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        suggestions: this.getProviderErrorSuggestions(error)
      });
    }
    
    // Log error using the error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error Boundary caught an error:', error, errorInfo);
    }
  }

  private detectProviderError(error: Error): boolean {
    const providerErrorPatterns = [
      'usePopup must be used within a PopupProvider',
      'useAuth must be used within an AuthProvider',
      'useQuery must be used within a QueryClientProvider',
      'useNavigate must be used within a Router',
      'Browser history needs a DOM',
      'Cannot read properties of undefined',
      'Context is undefined'
    ];
    
    return providerErrorPatterns.some(pattern => 
      error.message.includes(pattern) || error.stack?.includes(pattern)
    );
  }

  private getProviderErrorSuggestions(error: Error): string[] {
    const suggestions: string[] = [];
    
    if (error.message.includes('usePopup')) {
      suggestions.push('Ensure PopupProvider wraps components using usePopup');
    }
    if (error.message.includes('useAuth')) {
      suggestions.push('Ensure AuthProvider wraps components using useAuth');
    }
    if (error.message.includes('useQuery')) {
      suggestions.push('Ensure QueryClientProvider wraps components using useQuery');
    }
    if (error.message.includes('useNavigate') || error.message.includes('Router')) {
      suggestions.push('Ensure BrowserRouter wraps components using routing hooks');
    }
    
    return suggestions;
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    const { resetKeys, resetOnPropsChange } = this.props;
    const { hasError, retryCount } = this.state;

    if (hasError && prevProps.resetKeys !== resetKeys) {
      if (resetKeys && prevProps.resetKeys) {
        const hasResetKeyChanged = resetKeys.some((key, index) => 
          key !== prevProps.resetKeys![index]
        );
        if (hasResetKeyChanged) {
          this.resetErrorBoundary();
        }
      }
    }

    if (resetOnPropsChange && hasError && prevProps.children !== this.props.children) {
      this.resetErrorBoundary();
    }
  }

  componentWillUnmount() {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }
  }

  resetErrorBoundary = () => {
    this.setState({ 
      hasError: false, 
      error: undefined, 
      errorInfo: undefined,
      retryCount: 0 
    });
  };

  handleRetry = () => {
    const { retryCount } = this.state;
    const maxRetries = 3;
    
    if (retryCount < maxRetries) {
      this.setState(prev => ({ retryCount: prev.retryCount + 1 }));
      this.resetErrorBoundary();
    } else {
      // After max retries, reload the page
      window.location.reload();
    }
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { level = 'component' } = this.props;
      const { error, retryCount } = this.state;

      return (
        <ErrorFallback
          error={error}
          retryCount={retryCount}
          level={level}
          onRetry={this.handleRetry}
          onReload={this.handleReload}
          onGoHome={this.handleGoHome}
        />
      );
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error?: Error;
  retryCount: number;
  level: 'page' | 'component' | 'feature';
  onRetry: () => void;
  onReload: () => void;
  onGoHome: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  retryCount,
  level,
  onRetry,
  onReload,
  onGoHome
}) => {
  const getErrorConfig = () => {
    switch (level) {
      case 'page':
        return {
          title: 'Something went wrong',
          description: 'We encountered an unexpected error. This might be due to a network issue or data problem.',
          icon: AlertTriangle,
          iconSize: 'h-12 w-12',
          containerClass: 'min-h-screen flex items-center justify-center p-8'
        };
      case 'feature':
        return {
          title: 'Feature unavailable',
          description: 'This feature encountered an error and is temporarily unavailable.',
          icon: AlertTriangle,
          iconSize: 'h-8 w-8',
          containerClass: 'flex flex-col items-center justify-center p-6 space-y-4'
        };
      default: // component
        return {
          title: 'Component error',
          description: 'This component encountered an error while loading.',
          icon: AlertTriangle,
          iconSize: 'h-6 w-6',
          containerClass: 'flex flex-col items-center justify-center p-4 space-y-3'
        };
    }
  };

  const config = getErrorConfig();
  const IconComponent = config.icon;
  const maxRetries = 3;

  return (
    <div className={config.containerClass}>
      <div className="text-center max-w-md">
        <div className={`${config.iconSize} text-red-500 mx-auto mb-4`}>
          <IconComponent className="w-full h-full" />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {config.title}
        </h3>
        
        <p className="text-sm text-gray-600 mb-4">
          {config.description}
        </p>

        {retryCount > 0 && (
          <p className="text-xs text-gray-500 mb-4">
            Retry attempt {retryCount} of {maxRetries}
          </p>
        )}

        <div className="flex flex-wrap gap-2 justify-center">
          {retryCount < maxRetries && (
            <Button
              onClick={onRetry}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Try Again</span>
            </Button>
          )}
          
          <Button
            onClick={onReload}
            variant="outline"
            size="sm"
            className="flex items-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Reload Page</span>
          </Button>

          {level === 'page' && (
            <Button
              onClick={onGoHome}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
            >
              <Home className="h-4 w-4" />
              <span>Go Home</span>
            </Button>
          )}
        </div>

        {process.env.NODE_ENV === 'development' && error && (
          <details className="mt-6 p-4 bg-gray-100 rounded-lg max-w-md mx-auto">
            <summary className="cursor-pointer font-medium text-sm flex items-center space-x-2">
              <Bug className="h-4 w-4" />
              <span>Error Details (Development)</span>
            </summary>
            <pre className="mt-2 text-xs text-gray-700 whitespace-pre-wrap text-left">
              {error.message}
              {error.stack && `\n\nStack trace:\n${error.stack}`}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
};

// Hook-based error boundary for functional components
export function useErrorBoundary() {
  const { captureError } = useErrorHandler();
  
  const resetErrorBoundary = useCallback(() => {
    // This would be implemented with a state reset mechanism
    // For now, we'll use the class-based boundary
  }, []);

  return { captureError, resetErrorBoundary };
}

// Higher-order component for wrapping components with error boundaries
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

// Specialized error boundaries for different contexts
export const PageErrorBoundary: React.FC<Omit<ErrorBoundaryProps, 'level'>> = (props) => (
  <ErrorBoundary {...props} level="page" />
);

export const FeatureErrorBoundary: React.FC<Omit<ErrorBoundaryProps, 'level'>> = (props) => (
  <ErrorBoundary {...props} level="feature" />
);

export const ComponentErrorBoundary: React.FC<Omit<ErrorBoundaryProps, 'level'>> = (props) => (
  <ErrorBoundary {...props} level="component" />
);