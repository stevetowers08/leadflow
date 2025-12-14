'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { secureGmailService } from '@/services/secureGmailService';

export const GmailCallback: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading'
  );
  const [message, setMessage] = useState('');

  const handleGmailCallback = useCallback(async () => {
    if (!searchParams) {
      setStatus('error');
      setMessage('Unable to read URL parameters');
      return;
    }

    try {
      const code = searchParams.get('code');
      const error = searchParams.get('error');
      const state = searchParams.get('state');

      if (error) {
        // Provide helpful error messages for common OAuth errors
        let errorMessage = `Gmail authentication failed: ${error}`;

        if (error === 'invalid_client') {
          errorMessage =
            'OAuth client not found. Please verify:\n' +
            '1. Client ID is correct in Google Cloud Console\n' +
            '2. No trailing spaces in NEXT_PUBLIC_GOOGLE_CLIENT_ID\n' +
            '3. OAuth client exists and is enabled\n' +
            '4. Redirect URI matches: ' +
            window.location.origin +
            '/auth/gmail-callback';
        } else if (error === 'redirect_uri_mismatch') {
          errorMessage =
            'Redirect URI mismatch. Ensure this URI is registered in Google Cloud Console:\n' +
            window.location.origin +
            '/auth/gmail-callback';
        } else if (error === 'access_denied') {
          errorMessage =
            'Gmail access was denied. Please try again and grant permission.';
        }

        throw new Error(errorMessage);
      }

      if (!code) {
        throw new Error('No authorization code received');
      }

      setStatus('loading');
      setMessage('Processing Gmail authentication...');

      // Handle the callback with state validation
      await secureGmailService.handleGmailCallback(code, state || undefined);

      setStatus('success');
      setMessage('Gmail connected successfully!');

      // Redirect to conversations page after 2 seconds
      setTimeout(() => {
        router.push('/conversations');
      }, 2000);
    } catch (error) {
      console.error('Gmail callback error:', error);
      setStatus('error');
      setMessage(
        error instanceof Error ? error.message : 'Authentication failed'
      );
    }
  }, [searchParams, router]);

  useEffect(() => {
    handleGmailCallback();
  }, [handleGmailCallback]);

  const handleRetry = () => {
    router.push('/conversations');
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className='h-8 w-8 animate-spin text-primary' />;
      case 'success':
        return <CheckCircle className='h-8 w-8 text-green-500' />;
      case 'error':
        return <XCircle className='h-8 w-8 text-destructive' />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'loading':
        return 'text-primary';
      case 'success':
        return 'text-success';
      case 'error':
        return 'text-destructive';
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-muted'>
      <Card className='w-full max-w-md'>
        <CardContent className='p-8 text-center'>
          <div className='mb-6'>{getStatusIcon()}</div>

          <h2 className={`text-xl font-semibold mb-2 ${getStatusColor()}`}>
            {status === 'loading' && 'Connecting Gmail...'}
            {status === 'success' && 'Gmail Connected!'}
            {status === 'error' && 'Connection Failed'}
          </h2>

          <p className='text-muted-foreground mb-6'>{message}</p>

          {status === 'success' && (
            <p className='text-sm text-muted-foreground mb-4'>
              Redirecting to email dashboard...
            </p>
          )}

          {status === 'error' && (
            <Button onClick={handleRetry} className='w-full'>
              Try Again
            </Button>
          )}

          {status === 'loading' && (
            <div className='space-y-2'>
              <div className='text-sm text-muted-foreground'>
                Please wait while we connect your Gmail account...
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
