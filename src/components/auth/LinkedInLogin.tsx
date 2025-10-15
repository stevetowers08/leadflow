import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

export const LinkedInLogin: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signInWithLinkedIn } = useAuth();

  const handleLinkedInSignIn = async () => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await signInWithLinkedIn();

      if (error) {
        setError(error.message);
        setLoading(false);
      } else {
        // Success - user will be redirected, so we don't reset loading
        // The redirect will happen automatically
      }
    } catch (err) {
      console.error('LinkedIn sign-in error:', err);
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Card className='w-full max-w-md mx-auto'>
      <CardHeader className='space-y-1'>
        <CardTitle className='text-2xl text-center'>
          Welcome to 4Twenty CRM
        </CardTitle>
        <CardDescription className='text-center'>
          Sign in with your LinkedIn account to get started
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        {error && (
          <Alert variant='destructive'>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button
          onClick={handleLinkedInSignIn}
          className='w-full'
          disabled={loading}
          variant='outline'
        >
          {loading ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Signing in...
            </>
          ) : (
            <>
              <svg
                className='mr-2 h-4 w-4'
                viewBox='0 0 24 24'
                fill='currentColor'
              >
                <path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' />
              </svg>
              Continue with LinkedIn
            </>
          )}
        </Button>

        <div className='text-center text-xs text-muted-foreground'>
          By signing in, you agree to our terms of service and privacy policy
        </div>
      </CardContent>
    </Card>
  );
};
