import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
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
      
      // Redirect to email page after successful authentication
      setTimeout(() => {
        navigate('/email');
      }, 2000);
    } catch (error) {
      setStatus('error');
      setError(error instanceof Error ? error.message : 'Authentication failed');
    }
  };

  const handleRetry = () => {
    navigate('/email');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Gmail Authentication</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === 'loading' && (
            <div className="text-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-sidebar-primary" />
              <p>Connecting to Gmail...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center space-y-4">
              <CheckCircle className="h-8 w-8 mx-auto text-green-600" />
              <p className="text-green-600 font-medium">Successfully connected to Gmail!</p>
              <p className="text-sm text-muted-foreground">
                Redirecting to email page...
              </p>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center space-y-4">
              <AlertCircle className="h-8 w-8 mx-auto text-red-600" />
              <p className="text-red-600 font-medium">Authentication Failed</p>
              <p className="text-sm text-muted-foreground">
                {error || 'An error occurred during authentication'}
              </p>
              <Button onClick={handleRetry} className="w-full">
                Try Again
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};





