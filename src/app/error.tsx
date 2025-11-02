'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to monitoring service
    console.error('App error:', error);
    
    // Send to error logging service if available
    if (typeof window !== 'undefined') {
      try {
        // Integrate with existing error logging
        const errorLogger = (window as any).errorLogger;
        if (errorLogger?.logError) {
          errorLogger.logError(error.message, 'error', 'app', {
            digest: error.digest,
            stack: error.stack,
            name: error.name,
          });
        }
      } catch (logError) {
        console.error('Failed to log error:', logError);
      }
    }
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <AlertTriangle className="h-6 w-6 text-red-600" />
        </div>
        <h1 className="text-xl font-semibold text-gray-900 mb-2">
          Something went wrong!
        </h1>
        <p className="text-sm text-gray-600 mb-4">
          An unexpected error occurred. Please try again.
        </p>
        {error.digest && (
          <p className="text-xs text-gray-500 mb-4">Error ID: {error.digest}</p>
        )}
        <div className="flex gap-2 justify-center">
          <Button onClick={reset} variant="default">
            Try again
          </Button>
          <Button onClick={() => (window.location.href = '/')} variant="outline">
            Go home
          </Button>
        </div>
      </div>
    </div>
  );
}

