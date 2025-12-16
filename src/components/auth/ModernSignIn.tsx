import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import React, { useState } from 'react';
import { LeadFlowLogoHorizontal } from '@/components/RecruitEdgeLogo';
import { Loader2, EyeOff, Eye } from 'lucide-react';

export const SignIn: React.FC = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signInWithGoogle, signInWithPassword } = useAuth();

  const handleGoogleSignIn = async () => {
    setLoading('google');
    setError(null);

    try {
      // Check if Google OAuth is configured
      const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
      if (!googleClientId || googleClientId.includes('your-google-client-id')) {
        setError(
          'Google OAuth is not configured. Please contact your administrator.'
        );
        setLoading(null);
        return;
      }

      const { error } = await signInWithGoogle();

      if (error) {
        setError(error.message);
        setLoading(null);
      }
    } catch (err) {
      console.error('Google sign-in error:', err);
      const errorMessage =
        err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      setLoading(null);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading('email');
    setError(null);

    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(null);
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      setLoading(null);
      return;
    }

    try {
      const { error } = await signInWithPassword(email, password);

      if (error) {
        setError(error.message);
        setLoading(null);
      }
      // Success will be handled by the auth context
    } catch (err) {
      console.error('Email sign-in error:', err);
      setError('An unexpected error occurred. Please try again.');
      setLoading(null);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center p-4'>
      {/* Company Logo - Top Left */}
      <div className='absolute top-6 left-6'>
        <LeadFlowLogoHorizontal size={32} />
      </div>

      {/* Main Login Card */}
      <div className='w-full max-w-md'>
        <Card className='bg-white shadow-xl border-0 rounded-xl'>
          <CardContent className='p-8'>
            {/* Login Title */}
            <div className='text-center mb-8'>
              <h1 className='text-3xl font-bold text-foreground mb-2'>
                Welcome back
              </h1>
              <p className='text-muted-foreground'>
                Sign in to your professional dashboard
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <Alert
                variant='destructive'
                className='mb-6 border-red-200 bg-destructive/10'
              >
                <AlertDescription className='text-destructive'>
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {/* Social Login Buttons */}
            <div className='space-y-3 mb-6'>
              {/* Google Button */}
              <Button
                onClick={handleGoogleSignIn}
                variant='outline'
                className='w-full h-12 font-medium text-foreground hover:bg-muted border-border rounded-lg flex items-center justify-center'
                disabled={loading !== null}
              >
                {loading === 'google' ? (
                  <>
                    <Loader2 className='mr-3 h-5 w-5 animate-spin' />
                    Signing in with Google...
                  </>
                ) : (
                  <>
                    <svg className='mr-3 h-5 w-5' viewBox='0 0 24 24'>
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
            </div>

            {/* Divider */}
            <div className='relative my-6'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-border'></div>
              </div>
              <div className='relative flex justify-center text-sm'>
                <span className='px-2 bg-white text-muted-foreground'>or</span>
              </div>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleEmailSignIn} className='space-y-4'>
              <div className='space-y-2'>
                <Label
                  htmlFor='email'
                  className='text-sm font-medium text-foreground'
                >
                  Email address
                </Label>
                <Input
                  id='email'
                  type='email'
                  placeholder='Enter your email'
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className='h-12 border-border focus:border-sidebar-primary focus:ring-sidebar-primary rounded-lg'
                  disabled={loading !== null}
                  required
                />
              </div>

              <div className='space-y-2'>
                <Label
                  htmlFor='password'
                  className='text-sm font-medium text-foreground'
                >
                  Password
                </Label>
                <div className='relative'>
                  <Input
                    id='password'
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Enter your password'
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className='h-12 pr-12 border-border focus:border-sidebar-primary focus:ring-sidebar-primary rounded-lg'
                    disabled={loading !== null}
                    required
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-muted-foreground'
                    disabled={loading !== null}
                  >
                    {showPassword ? (
                      <EyeOff className='h-5 w-5' />
                    ) : (
                      <Eye className='h-5 w-5' />
                    )}
                  </button>
                </div>
              </div>

              <div className='flex items-center justify-start'>
                <button
                  type='button'
                  className='text-sm text-sidebar-primary hover:text-sidebar-primary/80 font-medium'
                  disabled={loading !== null}
                >
                  Forgot password?
                </button>
              </div>

              <Button
                type='submit'
                className='w-full h-12 bg-sidebar-primary hover:bg-sidebar-primary/90 text-white font-medium rounded-lg'
                disabled={loading !== null}
              >
                {loading === 'email' ? (
                  <>
                    <Loader2 className='mr-2 h-5 w-5 animate-spin' />
                    Signing in...
                  </>
                ) : (
                  'Log in'
                )}
              </Button>
            </form>

            {/* Additional Links */}
            <div className='mt-8 space-y-3 text-center'>
              <button className='block w-full text-sm text-sidebar-primary hover:text-sidebar-primary/80 font-medium'>
                Can&apos;t Access Your Account?
              </button>
              <div className='text-sm text-muted-foreground'>
                Don&apos;t have an account?{' '}
                <button className='text-sidebar-primary hover:text-sidebar-primary/80 font-medium'>
                  Sign Up
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
