'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log critical error to monitoring service
    console.error('Global error:', error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <h1 className="text-xl font-semibold text-foreground mb-2">
              Critical Error
            </h1>
            <p className="text-sm text-gray-600 mb-4">
              A critical error occurred. Please reload the application.
            </p>
            {error.digest && (
              <p className="text-xs text-gray-500 mb-4">Error ID: {error.digest}</p>
            )}
            <div className="flex gap-2 justify-center">
              <Button onClick={reset} variant="default">
                Try again
              </Button>
              <Button
                onClick={() => (window.location.href = '/')}
                variant="outline"
              >
                Reload
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}



