import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
}

export class SupabaseErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Generate unique error ID for tracking
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
      hasError: true,
      error,
      errorInfo: null,
      errorId,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.group('🚨 Supabase Error Boundary Caught Error');
    console.error('Error:', error);
    console.error('Error Info:', errorInfo);
    console.error('Error ID:', this.state.errorId);
    console.groupEnd();

    this.setState({
      error,
      errorInfo,
    });

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  isSupabaseError = (error: Error): boolean => {
    const supabaseErrorPatterns = [
      'supabase',
      'auth',
      'database',
      'connection',
      'environment',
      'VITE_SUPABASE',
      'fetch',
    ];

    const errorMessage = error.message.toLowerCase();
    const errorStack = error.stack?.toLowerCase() || '';

    return supabaseErrorPatterns.some(
      pattern => errorMessage.includes(pattern) || errorStack.includes(pattern)
    );
  };

  getErrorType = (error: Error): string => {
    if (this.isSupabaseError(error)) {
      if (
        error.message.includes('environment') ||
        error.message.includes('VITE_SUPABASE')
      ) {
        return 'Environment Configuration Error';
      }
      if (error.message.includes('auth') || error.message.includes('session')) {
        return 'Authentication Error';
      }
      if (
        error.message.includes('database') ||
        error.message.includes('connection')
      ) {
        return 'Database Connection Error';
      }
      return 'Supabase Service Error';
    }

    if (
      error.message.includes('ChunkLoadError') ||
      error.message.includes('Loading chunk')
    ) {
      return 'Code Loading Error';
    }

    if (error.message.includes('Network') || error.message.includes('fetch')) {
      return 'Network Error';
    }

    return 'Application Error';
  };

  getErrorSuggestions = (error: Error): string[] => {
    const suggestions: string[] = [];

    if (this.isSupabaseError(error)) {
      if (
        error.message.includes('environment') ||
        error.message.includes('VITE_SUPABASE')
      ) {
        suggestions.push('Check your .env file configuration');
        suggestions.push('Verify Supabase URL and API keys are correct');
        suggestions.push('Ensure environment variables start with VITE_');
      }
      if (error.message.includes('auth')) {
        suggestions.push('Check your authentication configuration');
        suggestions.push('Verify user session is valid');
        suggestions.push('Try signing out and back in');
      }
      if (error.message.includes('database')) {
        suggestions.push('Check your database connection');
        suggestions.push('Verify RLS policies are correct');
        suggestions.push('Check if your Supabase project is active');
      }
    }

    if (error.message.includes('ChunkLoadError')) {
      suggestions.push('Clear browser cache and reload');
      suggestions.push('Check your internet connection');
      suggestions.push('Try refreshing the page');
    }

    if (suggestions.length === 0) {
      suggestions.push('Try refreshing the page');
      suggestions.push('Clear browser cache');
      suggestions.push('Check browser console for more details');
    }

    return suggestions;
  };

  render() {
    if (this.state.hasError && this.state.error) {
      const errorType = this.getErrorType(this.state.error);
      const suggestions = this.getErrorSuggestions(this.state.error);
      const isSupabaseError = this.isSupabaseError(this.state.error);

      return (
        <div className='min-h-screen bg-gray-50 flex items-center justify-center p-5 font-sans'>
          <div className='bg-white rounded-lg shadow-md p-6 max-w-[600px] w-full'>
            {/* Error Header */}
            <div className='flex items-center gap-2 mb-4 text-destructive'>
              <span className='text-xl'>⚠️</span>
              <h1 className='m-0 text-lg font-bold'>{errorType}</h1>
            </div>

            {/* Error Message */}
            <div className='bg-red-50 border border-red-200 rounded-md p-4 mb-4'>
              <h3 className='m-0 mb-2 text-red-900 text-sm font-bold'>Error Details:</h3>
              <p className='text-red-800 text-xs font-mono m-0 break-words'>
                {this.state.error.message}
              </p>
              {this.state.errorId && (
                <p className='text-destructive text-[10px] mt-2 mb-0'>
                  Error ID: {this.state.errorId}
                </p>
              )}
            </div>

            {/* Supabase-specific help */}
            {isSupabaseError && (
              <div className='bg-blue-50 border border-blue-200 rounded-md p-4 mb-4'>
                <h3 className='m-0 mb-2 text-blue-900 text-sm font-bold'>
                  🔧 Supabase Setup Help:
                </h3>
                <div className='text-blue-800 text-xs'>
                  <p className='m-0 mb-2'>
                    This appears to be a Supabase configuration issue. Here's
                    how to fix it:
                  </p>
                  <ol className='m-0 pl-4'>
                    <li>
                      Create a{' '}
                      <code className='bg-blue-100 px-1 py-0.5 rounded text-xs'>
                        .env
                      </code>{' '}
                      file in your project root
                    </li>
                    <li>
                      Copy the template from{' '}
                      <code className='bg-blue-100 px-1 py-0.5 rounded text-xs'>
                        env.example
                      </code>
                    </li>
                    <li>
                      Replace placeholder values with your actual Supabase
                      credentials
                    </li>
                    <li>
                      Get credentials from:{' '}
                      <a
                        href='https://supabase.com/dashboard'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-blue-900 underline'
                      >
                        Supabase Dashboard
                      </a>
                    </li>
                  </ol>
                </div>
              </div>
            )}

            {/* Suggestions */}
            <div className='bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4'>
              <h3 className='m-0 mb-2 text-yellow-900 text-sm font-bold'>
                💡 Suggested Solutions:
              </h3>
              <ul className='m-0 pl-4 text-yellow-900 text-xs'>
                {suggestions.map((suggestion, index) => (
                  <li key={index} className='mb-1'>
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className='flex gap-3 flex-wrap'>
              <button
                onClick={this.handleRetry}
                className='bg-blue-600 text-white border-none rounded-md px-4 py-2 cursor-pointer text-sm font-bold hover:bg-blue-700 transition-colors'
              >
                🔄 Try Again
              </button>
              <button
                onClick={this.handleReload}
                className='bg-transparent text-gray-700 border border-gray-300 rounded-md px-4 py-2 cursor-pointer text-sm font-bold hover:bg-gray-50 transition-colors'
              >
                🔄 Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default SupabaseErrorBoundary;
