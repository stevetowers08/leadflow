'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { HubSpotAuthService } from '@/services/hubspot/hubspotAuthService';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function IntegrationCallback() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading'
  );
  const [message, setMessage] = useState('');
  const [mounted, setMounted] = useState(false);
  const auth = useAuth();
  const user = auth.user;
  const [searchParams] = useSearchParams();
  const router = useRouter();
  
  // Ensure component only runs auth logic on client
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCallback = useCallback(async () => {
    // Don't run auth-dependent logic during SSR
    if (!mounted) return;
    
    try {
      const code = searchParams.get('code');
      const error = searchParams.get('error');

      if (error) {
        setStatus('error');
        setMessage(error);
        return;
      }

      if (!code) {
        setStatus('error');
        setMessage('No authorization code received');
        return;
      }

      if (!user?.id) {
        setStatus('error');
        setMessage('User not authenticated');
        return;
      }

      const clientId = process.env.NEXT_PUBLIC_HUBSPOT_CLIENT_ID;
      const clientSecret = process.env.NEXT_PUBLIC_HUBSPOT_CLIENT_SECRET;
      const redirectUri = `${window.location.origin}/integrations/callback`;

      if (!clientId || !clientSecret) {
        setStatus('error');
        setMessage('HubSpot credentials not configured');
        return;
      }

      const tokens = await HubSpotAuthService.exchangeCodeForTokens(
        code,
        clientId,
        clientSecret,
        redirectUri
      );

      await HubSpotAuthService.saveConnection(user.id, tokens);

      setStatus('success');
      setMessage('Successfully connected to HubSpot');

      setTimeout(() => {
        router.push('/integrations');
      }, 2000);
    } catch (error) {
      console.error('Callback error:', error);
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Failed to connect');
    }
  }, [mounted, searchParams, user?.id, router]);

  useEffect(() => {
    if (mounted) {
      void handleCallback();
    }
  }, [mounted, handleCallback]);

  return (
    <div className='flex items-center justify-center min-h-screen p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle className='text-center'>
            {status === 'loading' && 'Connecting...'}
            {status === 'success' && 'Success!'}
            {status === 'error' && 'Connection Failed'}
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex justify-center'>
            {status === 'loading' && (
              <Loader2 className='h-8 w-8 animate-spin' />
            )}
            {status === 'success' && (
              <CheckCircle className='h-8 w-8 text-green-500' />
            )}
            {status === 'error' && <XCircle className='h-8 w-8 text-red-500' />}
          </div>
          <p className='text-center text-sm text-gray-600'>{message}</p>
        </CardContent>
      </Card>
    </div>
  );
}
