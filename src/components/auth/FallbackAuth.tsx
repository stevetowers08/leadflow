import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import React, { useState } from 'react';
import { RecruitEdgeLogo } from '../RecruitEdgeLogo';
import { Loader2 } from 'lucide-react';

export const FallbackAuth: React.FC = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { signInWithGoogle } = useAuth();

  const handleGoogleSignIn = async () => {
    setLoading('google');
    setError(null);

    try {
      const { error } = await signInWithGoogle();

      if (error) {
        setError(error.message);
        setLoading(null);
      }
    } catch (err) {
      console.error('Google sign-in error:', err);
      setError('An unexpected error occurred. Please try again.');
      setLoading(null);
    }
  };

  const handleLinkedInSignIn = async () => {
    setLoading('linkedin');
    setError(null);

    try {
      // LinkedIn sign-in removed - feature not available
      const error: Error = new Error('LinkedIn sign-in is not available');

      if (error) {
        setError(error.message);
        setLoading(null);
      }
    } catch (err) {
      console.error('LinkedIn sign-in error:', err);
      setError('An unexpected error occurred. Please try again.');
      setLoading(null);
    }
  };

  return (
    <div className='flex flex-col h-screen'>
      <div className='h-20 border-b border-border flex items-center justify-center'>
        <div className='flex items-center gap-3'>
          <RecruitEdgeLogo size={32} />
          <div>
            <h1 className='text-xl font-semibold tracking-tight'>Sign In</h1>
            <p className='text-sm text-muted-foreground mt-1'>
              Sign in to your Leadflow account
            </p>
          </div>
        </div>
      </div>

      <div className='flex-1 overflow-y-auto p-6'>
        <div className='max-w-md mx-auto'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <svg
                  className='h-5 w-5'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1'
                  />
                </svg>
                Authentication
              </CardTitle>
              <CardDescription>
                Choose your preferred sign-in method
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              {/* Error Alert */}
              {error && (
                <Alert variant='destructive'>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Google Sign In */}
              <Button
                onClick={handleGoogleSignIn}
                variant='outline'
                className='w-full h-11 font-medium'
                disabled={loading !== null}
              >
                {loading === 'google' ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Signing in...
                  </>
                ) : (
                  <>
                    <svg className='mr-2 h-4 w-4' viewBox='0 0 24 24'>
                      <path
                        fill='#4285F4'
                        d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                      />
                      <path
                        fill='#34A853'
                        d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                      />
                      <path
                        fill='#FBBC05'
                        d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                      />
                      <path
                        fill='#EA4335'
                        d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                      />
                    </svg>
                    Continue with Google
                  </>
                )}
              </Button>

              {/* LinkedIn Sign In */}
              <Button
                onClick={handleLinkedInSignIn}
                className='w-full h-11 bg-sidebar-primary hover:bg-sidebar-primary/90 text-sidebar-primary-foreground font-medium'
                disabled={loading !== null}
              >
                {loading === 'linkedin' ? (
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
            </CardContent>
          </Card>

          {/* Footer */}
          <div className='text-center mt-6'>
            <p className='text-xs text-muted-foreground'>
              By signing in, you agree to our{' '}
              <a
                href='#'
                className='text-sidebar-primary hover:text-sidebar-primary/80 font-medium underline-offset-4 hover:underline'
              >
                Terms of Service
              </a>{' '}
              and{' '}
              <a
                href='#'
                className='text-sidebar-primary hover:text-sidebar-primary/80 font-medium underline-offset-4 hover:underline'
              >
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
