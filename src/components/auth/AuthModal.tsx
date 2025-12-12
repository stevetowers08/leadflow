import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Loader2, Shield } from 'lucide-react';
import React, { useState } from 'react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  title = 'Sign in to continue',
  description = 'Access your professional recruitment dashboard',
}) => {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [headline, setHeadline] = useState('');
  const [role, setRole] = useState<'mentor' | 'mentee' | 'both'>('both');

  const { signInWithGoogle, signInWithPassword } = useAuth();

  const handleGoogleSignIn = async () => {
    setLoading('google');
    setError(null);

    try {
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

  const handleLinkedInSignIn = async () => {
    setLoading('linkedin');
    setError(null);

    try {
      const linkedinClientId = import.meta.env.LINKEDIN_CLIENT_ID;
      if (
        !linkedinClientId ||
        linkedinClientId.includes('your-linkedin-client-id')
      ) {
        setError(
          'LinkedIn OAuth is not configured. Please contact your administrator.'
        );
        setLoading(null);
        return;
      }

      // LinkedIn sign-in removed - feature not available
      const error: Error = new Error('LinkedIn sign-in is not available');

      if (error) {
        setError(error.message);
        setLoading(null);
      }
    } catch (err) {
      console.error('LinkedIn sign-in error:', err);
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
      } else {
        // Success - close modal
        onClose();
        setEmail('');
        setPassword('');
        setLoading(null);
      }
    } catch (err) {
      console.error('Email sign-in error:', err);
      setError('An unexpected error occurred. Please try again.');
      setLoading(null);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading('signup');
    setError(null);

    if (!email || !password || !fullName) {
      setError('Please fill in all required fields');
      setLoading(null);
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      setLoading(null);
      return;
    }

    try {
      const { registerNewClient } = await import(
        '@/services/clientRegistrationService'
      );

      const result = await registerNewClient({
        email,
        password,
        name: fullName,
        companyName: headline || fullName,
        fullName,
        headline,
      });

      if (!result.success) {
        setError(result.error || 'Failed to create account');
        setLoading(null);
        return;
      }

      // Success - close modal and show success message
      onClose();
      setEmail('');
      setPassword('');
      setFullName('');
      setHeadline('');
      setLoading(null);

      // TODO: Show success toast
    } catch (err) {
      console.error('Email sign-up error:', err);
      setError('An unexpected error occurred. Please try again.');
      setLoading(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm'>
      <div className='w-full max-w-md'>
        <Card className='bg-white shadow-xl border-0 rounded-xl'>
          <CardHeader className='text-center pb-6'>
            <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-sidebar-primary/10'>
              <Shield className='h-6 w-6 text-sidebar-primary' />
            </div>
            <CardTitle className='text-lg font-semibold text-foreground'>
              {title}
            </CardTitle>
            <CardDescription className='text-muted-foreground'>
              {description}
            </CardDescription>
          </CardHeader>

          <CardContent className='px-8 pb-8'>
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

            <Tabs defaultValue='signin' className='w-full'>
              <TabsList className='grid w-full grid-cols-2 mb-6'>
                <TabsTrigger value='signin'>Sign In</TabsTrigger>
                <TabsTrigger value='signup'>Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value='signin' className='space-y-6'>
                {/* Social Login Buttons */}
                <div className='space-y-3'>
                  {/* Google Button */}
                  <Button
                    onClick={handleGoogleSignIn}
                    variant='outline'
                    className='w-full h-10 font-medium text-foreground hover:bg-muted border-border rounded-md flex items-center justify-center'
                    disabled={loading !== null}
                  >
                    {loading === 'google' ? (
                      <>
                        <Loader2 className='mr-3 h-4 w-4 animate-spin' />
                        Signing in...
                      </>
                    ) : (
                      <>
                        <svg className='mr-3 h-4 w-4' viewBox='0 0 24 24'>
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

                  {/* LinkedIn Button */}
                  <Button
                    onClick={handleLinkedInSignIn}
                    className='w-full h-10 bg-linkedin-blue hover:bg-linkedin-blue-dark text-white font-medium rounded-md flex items-center justify-center'
                    disabled={loading !== null}
                  >
                    {loading === 'linkedin' ? (
                      <>
                        <Loader2 className='mr-3 h-4 w-4 animate-spin' />
                        Signing in...
                      </>
                    ) : (
                      <>
                        <svg
                          className='mr-3 h-4 w-4'
                          viewBox='0 0 24 24'
                          fill='currentColor'
                        >
                          <path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' />
                        </svg>
                        Continue with LinkedIn
                      </>
                    )}
                  </Button>
                </div>

                {/* Divider */}
                <div className='relative'>
                  <div className='absolute inset-0 flex items-center'>
                    <div className='w-full border-t border-border'></div>
                  </div>
                  <div className='relative flex justify-center text-sm'>
                    <span className='px-2 bg-white text-muted-foreground'>
                      or
                    </span>
                  </div>
                </div>

                {/* Email/Password Form */}
                <form onSubmit={handleEmailSignIn} className='space-y-4'>
                  <div className='space-y-2'>
                    <Label
                      htmlFor='signin-email'
                      className='text-sm font-medium text-foreground'
                    >
                      Email address
                    </Label>
                    <Input
                      id='signin-email'
                      type='email'
                      placeholder='Enter your email'
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className='h-10 border-border focus:border-sidebar-primary focus:ring-sidebar-primary rounded-md'
                      disabled={loading !== null}
                      required
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label
                      htmlFor='signin-password'
                      className='text-sm font-medium text-foreground'
                    >
                      Password
                    </Label>
                    <div className='relative'>
                      <Input
                        id='signin-password'
                        type={showPassword ? 'text' : 'password'}
                        placeholder='Enter your password'
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className='h-10 pr-12 border-border focus:border-sidebar-primary focus:ring-sidebar-primary rounded-md'
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
                          <EyeOff className='h-4 w-4' />
                        ) : (
                          <Eye className='h-4 w-4' />
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
                    className='w-full h-10 bg-sidebar-primary hover:bg-sidebar-primary/90 text-white font-medium rounded-md'
                    disabled={loading !== null}
                  >
                    {loading === 'email' ? (
                      <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        Signing in...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value='signup' className='space-y-6'>
                {/* Social Sign Up Buttons */}
                <div className='space-y-3'>
                  {/* Google Button */}
                  <Button
                    onClick={handleGoogleSignIn}
                    variant='outline'
                    className='w-full h-10 font-medium text-foreground hover:bg-muted border-border rounded-md flex items-center justify-center'
                    disabled={loading !== null}
                  >
                    {loading === 'google' ? (
                      <>
                        <Loader2 className='mr-3 h-4 w-4 animate-spin' />
                        Signing up...
                      </>
                    ) : (
                      <>
                        <svg className='mr-3 h-4 w-4' viewBox='0 0 24 24'>
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

                  {/* LinkedIn Button */}
                  <Button
                    onClick={handleLinkedInSignIn}
                    className='w-full h-10 bg-linkedin-blue hover:bg-linkedin-blue-dark text-white font-medium rounded-md flex items-center justify-center'
                    disabled={loading !== null}
                  >
                    {loading === 'linkedin' ? (
                      <>
                        <Loader2 className='mr-3 h-4 w-4 animate-spin' />
                        Signing up...
                      </>
                    ) : (
                      <>
                        <svg
                          className='mr-3 h-4 w-4'
                          viewBox='0 0 24 24'
                          fill='currentColor'
                        >
                          <path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' />
                        </svg>
                        Continue with LinkedIn
                      </>
                    )}
                  </Button>
                </div>

                {/* Divider */}
                <div className='relative'>
                  <div className='absolute inset-0 flex items-center'>
                    <div className='w-full border-t border-border'></div>
                  </div>
                  <div className='relative flex justify-center text-sm'>
                    <span className='px-2 bg-white text-muted-foreground'>
                      or
                    </span>
                  </div>
                </div>

                {/* Sign Up Form */}
                <form onSubmit={handleEmailSignUp} className='space-y-4'>
                  <div className='space-y-2'>
                    <Label
                      htmlFor='signup-name'
                      className='text-sm font-medium text-foreground'
                    >
                      Full Name *
                    </Label>
                    <Input
                      id='signup-name'
                      type='text'
                      placeholder='Enter your full name'
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      className='h-10 border-border focus:border-sidebar-primary focus:ring-sidebar-primary rounded-md'
                      disabled={loading !== null}
                      required
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label
                      htmlFor='signup-email'
                      className='text-sm font-medium text-foreground'
                    >
                      Email Address *
                    </Label>
                    <Input
                      id='signup-email'
                      type='email'
                      placeholder='Enter your email'
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className='h-10 border-border focus:border-sidebar-primary focus:ring-sidebar-primary rounded-md'
                      disabled={loading !== null}
                      required
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label
                      htmlFor='signup-headline'
                      className='text-sm font-medium text-foreground'
                    >
                      Professional Headline
                    </Label>
                    <Input
                      id='signup-headline'
                      type='text'
                      placeholder='e.g., Senior Software Engineer'
                      value={headline}
                      onChange={e => setHeadline(e.target.value)}
                      className='h-10 border-border focus:border-sidebar-primary focus:ring-sidebar-primary rounded-md'
                      disabled={loading !== null}
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label
                      htmlFor='signup-role'
                      className='text-sm font-medium text-foreground'
                    >
                      Role
                    </Label>
                    <select
                      id='signup-role'
                      value={role}
                      onChange={e =>
                        setRole(e.target.value as 'mentor' | 'mentee' | 'both')
                      }
                      className='w-full h-10 px-3 border border-border rounded-md focus:border-sidebar-primary focus:ring-sidebar-primary'
                      disabled={loading !== null}
                    >
                      <option value='both'>Both Mentor &amp; Mentee</option>
                      <option value='mentor'>Mentor</option>
                      <option value='mentee'>Mentee</option>
                    </select>
                  </div>

                  <div className='space-y-2'>
                    <Label
                      htmlFor='signup-password'
                      className='text-sm font-medium text-foreground'
                    >
                      Password *
                    </Label>
                    <div className='relative'>
                      <Input
                        id='signup-password'
                        type={showPassword ? 'text' : 'password'}
                        placeholder='Create a password'
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className='h-10 pr-12 border-border focus:border-sidebar-primary focus:ring-sidebar-primary rounded-md'
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
                          <EyeOff className='h-4 w-4' />
                        ) : (
                          <Eye className='h-4 w-4' />
                        )}
                      </button>
                    </div>
                  </div>

                  <Button
                    type='submit'
                    className='w-full h-10 bg-sidebar-primary hover:bg-sidebar-primary/90 text-white font-medium rounded-md'
                    disabled={loading !== null}
                  >
                    {loading === 'signup' ? (
                      <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        Creating account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
