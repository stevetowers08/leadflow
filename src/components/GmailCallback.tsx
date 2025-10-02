import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { gmailService } from '../services/gmailService';

export const GmailCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      setStatus('error');
      setError('Authentication was cancelled or failed');
      return;
    }

    if (code) {
      handleGmailCallback(code);
    } else {
      setStatus('error');
      setError('No authorization code received');
    }
  }, [searchParams]);

  const handleGmailCallback = async (code: string) => {
    try {
      setStatus('loading');
      await gmailService.handleGmailCallback(code);
      setStatus('success');
      
      // Instant redirect for seamless experience
      navigate('/email');
    } catch (error) {
      setStatus('error');
      setError(error instanceof Error ? error.message : 'Authentication failed');
    }
  };

  const handleRetry = () => {
    navigate('/email');
  };

  // Minimal loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 bg-sidebar-primary rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-sidebar-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-sidebar-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    );
  }

  // Error state - minimal and clean
  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-12 h-12 mx-auto mb-4 bg-red-50 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-lg font-medium text-gray-900 mb-2">Gmail Connection Failed</h2>
          <p className="text-gray-600 text-sm mb-6">
            {error || 'An error occurred during authentication'}
          </p>
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-sidebar-primary text-white text-sm font-medium rounded-md hover:bg-sidebar-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Success state - should rarely be seen due to instant redirect
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <span className="text-sm text-gray-600">Redirecting...</span>
      </div>
    </div>
  );
};





