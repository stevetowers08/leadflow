'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function AcceptInvitePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshProfile } = useAuth();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [invitation, setInvitation] = useState<{
    email: string;
    role: string;
  } | null>(null);

  useEffect(() => {
    if (!token) {
      setError('Invalid invitation link. No token provided.');
      return;
    }

    // Verify invitation token
    const verifyInvitation = async () => {
      try {
        const { data, error: inviteError } = await supabase
          .from('invitations')
          .select('email, role, status, expires_at')
          .eq('token', token)
          .eq('status', 'pending')
          .maybeSingle();

        if (inviteError || !data) {
          setError('Invalid or expired invitation link.');
          return;
        }

        // Check if invitation has expired
        if (data.expires_at && new Date(data.expires_at) < new Date()) {
          setError(
            'This invitation has expired. Please contact your administrator.'
          );
          return;
        }

        setInvitation({
          email: data.email,
          role: data.role,
        });

        // Check if user already has a session from magic link
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user && session.user.email === data.email) {
          // User already authenticated via magic link, just needs to set password
          // This happens when Supabase magic link auto-creates the session
        }
      } catch (err) {
        console.error('Error verifying invitation:', err);
        setError('Failed to verify invitation. Please try again.');
      }
    };

    verifyInvitation();
  }, [token]);

  const handleAcceptInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!password || password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!fullName.trim()) {
      setError('Full name is required');
      return;
    }

    setLoading(true);

    try {
      // Get the session from the magic link (Supabase handles this)
      let {
        data: { session },
      } = await supabase.auth.getSession();

      // If no session, check if we need to wait for magic link
      if (!session?.user) {
        // Check URL hash for magic link tokens (Supabase redirects here)
        const hashParams = new URLSearchParams(
          window.location.hash.substring(1)
        );
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');

        if (accessToken && refreshToken) {
          // Set session from hash
          const { data: sessionData, error: sessionError } =
            await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

          if (sessionError) throw sessionError;
          session = sessionData.session;
        } else {
          // No session and no hash - user needs to click magic link
          setError(
            'Please check your email and click the invitation link to continue. The link will automatically authenticate you.'
          );
          setLoading(false);
          return;
        }
      }

      // Verify email matches invitation
      if (
        session?.user?.email?.toLowerCase() !== invitation?.email.toLowerCase()
      ) {
        setError(
          'Email mismatch. Please use the invitation link sent to your email.'
        );
        setLoading(false);
        return;
      }

      // Update password and user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        password,
        data: {
          full_name: fullName,
        },
      });

      if (updateError) throw updateError;

      // Update invitation status
      if (token && session?.user) {
        await supabase
          .from('invitations')
          .update({
            status: 'accepted',
            accepted_at: new Date().toISOString(),
            accepted_by: session.user.id,
          })
          .eq('token', token);
      }

      // Refresh profile
      await refreshProfile();

      // Redirect to dashboard
      router.push('/');
    } catch (err) {
      console.error('Error accepting invitation:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to accept invitation. Please try again.'
      );
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className='min-h-screen flex items-center justify-center p-4'>
        <Card className='w-full max-w-md'>
          <CardHeader>
            <CardTitle>Invalid Invitation</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant='destructive'>
              <AlertDescription>
                This invitation link is invalid. Please contact your
                administrator.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!invitation) {
    return (
      <div className='min-h-screen flex items-center justify-center p-4'>
        <Card className='w-full max-w-md'>
          <CardHeader>
            <CardTitle>Verifying Invitation...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex items-center justify-center py-8'>
              <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 via-white to-gray-50'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle className='text-2xl'>Accept Invitation</CardTitle>
          <p className='text-muted-foreground'>
            Complete your account setup for {invitation.email}
          </p>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant='destructive' className='mb-4'>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleAcceptInvitation} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                value={invitation.email}
                disabled
                className='bg-muted'
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='fullName'>Full Name</Label>
              <Input
                id='fullName'
                type='text'
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder='Enter your full name'
                required
                disabled={loading}
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='password'>Password</Label>
              <div className='relative'>
                <Input
                  id='password'
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder='Enter password (min 8 characters)'
                  required
                  disabled={loading}
                  minLength={8}
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground'
                >
                  {showPassword ? (
                    <EyeOff className='h-4 w-4' />
                  ) : (
                    <Eye className='h-4 w-4' />
                  )}
                </button>
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='confirmPassword'>Confirm Password</Label>
              <Input
                id='confirmPassword'
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder='Confirm your password'
                required
                disabled={loading}
              />
            </div>

            <Button type='submit' className='w-full' disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Creating Account...
                </>
              ) : (
                'Accept Invitation & Create Account'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
