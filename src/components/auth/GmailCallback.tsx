import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { secureGmailService } from '../../../services/secureGmailService';

export const GmailCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading'
  );
  const [message, setMessage] = useState('');

  const handleGmailCallback = useCallback(async () => {
    try {
      const code = searchParams.get('code');
      const error = searchParams.get('error');
      const state = searchParams.get('state');

      if (error) {
        throw new Error(`Gmail authentication failed: ${error}`);
      }

      if (!code) {
        throw new Error('No authorization code received');
      }

      setStatus('loading');
      setMessage('Processing Gmail authentication...');

      // Handle the callback with state validation
      await secureGmailService.handleGmailCallback(code, state);

      setStatus('success');
      setMessage('Gmail connected successfully!');

      // Redirect to email dashboard after 2 seconds
      setTimeout(() => {
        navigate('/crm/communications');
      }, 2000);
    } catch (error) {
      console.error('Gmail callback error:', error);
      setStatus('error');
      setMessage(
        error instanceof Error ? error.message : 'Authentication failed'
      );
    }
  }, [searchParams, navigate]);

  useEffect(() => {
    handleGmailCallback();
  }, [handleGmailCallback]);

  const handleRetry = () => {
    navigate('/crm/communications');
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className='h-8 w-8 animate-spin text-blue-500' />;
      case 'success':
        return <CheckCircle className='h-8 w-8 text-green-500' />;
      case 'error':
        return <XCircle className='h-8 w-8 text-red-500' />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'loading':
        return 'text-blue-600';
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
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
