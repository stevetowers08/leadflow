/**
 * Graceful Error Boundary - For Recoverable Errors
 *
 * This error boundary catches component errors but allows the app to continue functioning.
 * It shows a toast notification instead of blocking the entire interface.
 */

import { Component, ErrorInfo, ReactNode } from 'react';
import { toast } from 'sonner';

interface GracefulErrorBoundaryProps {
  children: ReactNode;
  componentName?: string;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface GracefulErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class GracefulErrorBoundary extends Component<
  GracefulErrorBoundaryProps,
  GracefulErrorBoundaryState
> {
  constructor(props: GracefulErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): GracefulErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const { componentName } = this.props;

    // Show user-friendly toast instead of crashing
    this.showErrorToast(error, componentName);

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
  }

  getErrorMessage(error: Error): string {
    const errorMessage = error.message.toLowerCase();

    if (
      errorMessage.includes('not defined') ||
      errorMessage.includes('undefined')
    ) {
      return 'This section needs to be refreshed. The rest of the app is still working.';
    }

    if (errorMessage.includes('fetch') || errorMessage.includes('network')) {
      return 'Having trouble connecting. Check your internet connection.';
    }

    if (errorMessage.includes('null') || errorMessage.includes('cannot read')) {
      return 'Data loading issue in this section. Other features still work.';
    }

    return 'This section encountered an issue, but you can continue using other parts of the app.';
  }

  showErrorToast(error: Error, componentName?: string): void {
    const message = this.getErrorMessage(error);
    const title = componentName ? `${componentName} Error` : 'Component Error';

    toast.error(title, {
      description: message,
      duration: 5000,
      action: {
        label: 'Reload Section',
        onClick: () => {
          this.setState({ hasError: false, error: null });
        },
      },
    });

    // Log detailed error for developers
    console.error('Graceful Error Boundary caught:', error);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Optionally render a small inline error UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Minimal fallback - just show nothing or a small placeholder
      return (
        <div className='p-4 border border-red-200 rounded-lg bg-destructive/10'>
          <p className='text-sm text-destructive'>
            {this.state.error && this.getErrorMessage(this.state.error)}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className='mt-2 text-xs text-destructive underline hover:text-destructive'
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
