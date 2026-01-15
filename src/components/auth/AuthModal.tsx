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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
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
  description = 'Access your LeadFlow dashboard',
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
      // Check if public sign-ups are disabled (invitation-only mode)
      const normalizedEmail = email.trim().toLowerCase();
      const { data: invitation } = await supabase
        .from('invitations')
        .select('*')
        .eq('email', normalizedEmail)
        .eq('status', 'pending')
        .maybeSingle();

      if (!invitation) {
        setError(
          'Sign-ups are invitation-only. Please contact your administrator for an invitation.'
        );
        setLoading(null);
        return;
      }

      const { registerNewClient } =
        await import('@/services/clientRegistrationService');

      const result = await registerNewClient({
        email,
        password,
        name: fullName,
        companyName: headline || fullName,
        fullName,
      });

      if (!result.success) {
        setError(result.error || 'Failed to create account');
        setLoading(null);
        return;
      }

      // Update invitation status if account created successfully
      if (invitation) {
        await supabase
          .from('invitations')
          .update({
            status: 'accepted',
            accepted_at: new Date().toISOString(),
            accepted_by: result.userProfile?.id,
          })
          .eq('id', invitation.id);
      }

      // Success - close modal and show success message
      onClose();
      setEmail('');
      setPassword('');
      setFullName('');
      setHeadline('');
      setLoading(null);

      // Success toast can be shown here using toast() from sonner
    } catch (err) {
      console.error('Email sign-up error:', err);
      setError('An unexpected error occurred. Please try again.');
      setLoading(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm'>
      <div className='w-full max-w-md'>
        <Card className='shadow-xl border-0 rounded-xl'>
          <CardHeader className='text-center pb-6'>
            <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted'>
              <Shield className='h-6 w-6 text-muted-foreground' />
            </div>
            <CardTitle className='text-lg font-semibold'>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>

          <CardContent className='px-8 pb-8'>
            {/* Error Alert */}
            {error && (
              <Alert variant='destructive' className='mb-6'>
                <AlertDescription>{error}</AlertDescription>
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
                    className='w-full h-10 font-medium'
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
                </div>

                {/* Divider */}
                <div className='relative'>
                  <div className='absolute inset-0 flex items-center'>
                    <div className='w-full border-t border-border'></div>
                  </div>
                  <div className='relative flex justify-center text-sm'>
                    <span className='px-2 bg-card text-muted-foreground'>
                      or
                    </span>
                  </div>
                </div>

                {/* Email/Password Form */}
                <form onSubmit={handleEmailSignIn} className='space-y-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='signin-email'>Email address</Label>
                    <Input
                      id='signin-email'
                      type='email'
                      placeholder='Enter your email'
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      disabled={loading !== null}
                      required
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='signin-password'>Password</Label>
                    <div className='relative'>
                      <Input
                        id='signin-password'
                        type={showPassword ? 'text' : 'password'}
                        placeholder='Enter your password'
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className='pr-12'
                        disabled={loading !== null}
                        required
                      />
                      <button
                        type='button'
                        onClick={() => setShowPassword(!showPassword)}
                        className='absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground'
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
                      className='text-sm text-muted-foreground hover:text-foreground font-medium'
                      disabled={loading !== null}
                    >
                      Forgot password?
                    </button>
                  </div>

                  <Button
                    type='submit'
                    className='w-full h-10'
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
                    className='w-full h-10 font-medium'
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
                </div>

                {/* Divider */}
                <div className='relative'>
                  <div className='absolute inset-0 flex items-center'>
                    <div className='w-full border-t border-border'></div>
                  </div>
                  <div className='relative flex justify-center text-sm'>
                    <span className='px-2 bg-card text-muted-foreground'>
                      or
                    </span>
                  </div>
                </div>

                {/* Sign Up Form */}
                <form onSubmit={handleEmailSignUp} className='space-y-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='signup-name'>Full Name *</Label>
                    <Input
                      id='signup-name'
                      type='text'
                      placeholder='Enter your full name'
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      disabled={loading !== null}
                      required
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='signup-email'>Email Address *</Label>
                    <Input
                      id='signup-email'
                      type='email'
                      placeholder='Enter your email'
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      disabled={loading !== null}
                      required
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='signup-headline'>
                      Professional Headline
                    </Label>
                    <Input
                      id='signup-headline'
                      type='text'
                      placeholder='e.g., Senior Software Engineer'
                      value={headline}
                      onChange={e => setHeadline(e.target.value)}
                      disabled={loading !== null}
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='signup-role'>Role</Label>
                    <Select
                      value={role}
                      onValueChange={(value: 'mentor' | 'mentee' | 'both') =>
                        setRole(value)
                      }
                      disabled={loading !== null}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Select a role' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='both'>
                          Both Mentor &amp; Mentee
                        </SelectItem>
                        <SelectItem value='mentor'>Mentor</SelectItem>
                        <SelectItem value='mentee'>Mentee</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='signup-password'>Password *</Label>
                    <div className='relative'>
                      <Input
                        id='signup-password'
                        type={showPassword ? 'text' : 'password'}
                        placeholder='Create a password'
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className='pr-12'
                        disabled={loading !== null}
                        required
                      />
                      <button
                        type='button'
                        onClick={() => setShowPassword(!showPassword)}
                        className='absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground'
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
                    className='w-full h-10'
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
