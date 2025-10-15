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
        <div
          style={{
            minHeight: '100vh',
            backgroundColor: '#f9fafb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            fontFamily: 'Arial, sans-serif',
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              padding: '24px',
              maxWidth: '600px',
              width: '100%',
            }}
          >
            {/* Error Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '16px',
                color: '#dc2626',
              }}
            >
              <span style={{ fontSize: '20px' }}>⚠️</span>
              <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>
                {errorType}
              </h1>
            </div>

            {/* Error Message */}
            <div
              style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '6px',
                padding: '16px',
                marginBottom: '16px',
              }}
            >
              <h3
                style={{
                  margin: '0 0 8px 0',
                  color: '#991b1b',
                  fontSize: '14px',
                  fontWeight: 'bold',
                }}
              >
                Error Details:
              </h3>
              <p
                style={{
                  color: '#7f1d1d',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  margin: 0,
                  wordBreak: 'break-word',
                }}
              >
                {this.state.error.message}
              </p>
              {this.state.errorId && (
                <p
                  style={{
                    color: '#dc2626',
                    fontSize: '10px',
                    margin: '8px 0 0 0',
                  }}
                >
                  Error ID: {this.state.errorId}
                </p>
              )}
            </div>

            {/* Supabase-specific help */}
            {isSupabaseError && (
              <div
                style={{
                  backgroundColor: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  borderRadius: '6px',
                  padding: '16px',
                  marginBottom: '16px',
                }}
              >
                <h3
                  style={{
                    margin: '0 0 8px 0',
                    color: '#1e40af',
                    fontSize: '14px',
                    fontWeight: 'bold',
                  }}
                >
                  🔧 Supabase Setup Help:
                </h3>
                <div style={{ color: '#1e3a8a', fontSize: '12px' }}>
                  <p style={{ margin: '0 0 8px 0' }}>
                    This appears to be a Supabase configuration issue. Here's
                    how to fix it:
                  </p>
                  <ol style={{ margin: 0, paddingLeft: '16px' }}>
                    <li>
                      Create a{' '}
                      <code
                        style={{
                          backgroundColor: '#dbeafe',
                          padding: '2px 4px',
                          borderRadius: '2px',
                        }}
                      >
                        .env
                      </code>{' '}
                      file in your project root
                    </li>
                    <li>
                      Copy the template from{' '}
                      <code
                        style={{
                          backgroundColor: '#dbeafe',
                          padding: '2px 4px',
                          borderRadius: '2px',
                        }}
                      >
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
                        style={{
                          color: '#1e40af',
                          textDecoration: 'underline',
                        }}
                      >
                        Supabase Dashboard
                      </a>
                    </li>
                  </ol>
                </div>
              </div>
            )}

            {/* Suggestions */}
            <div
              style={{
                backgroundColor: '#fffbeb',
                border: '1px solid #fed7aa',
                borderRadius: '6px',
                padding: '16px',
                marginBottom: '16px',
              }}
            >
              <h3
                style={{
                  margin: '0 0 8px 0',
                  color: '#92400e',
                  fontSize: '14px',
                  fontWeight: 'bold',
                }}
              >
                💡 Suggested Solutions:
              </h3>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: '16px',
                  color: '#92400e',
                  fontSize: '12px',
                }}
              >
                {suggestions.map((suggestion, index) => (
                  <li key={index} style={{ marginBottom: '4px' }}>
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={this.handleRetry}
                style={{
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                }}
              >
                🔄 Try Again
              </button>
              <button
                onClick={this.handleReload}
                style={{
                  backgroundColor: 'transparent',
                  color: '#374151',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                }}
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
