import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Eye, EyeOff, Mail, Lock, ArrowRight, Shield, Users } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export const ModernSignIn: React.FC = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signInWithGoogle, signInWithLinkedIn } = useAuth();

  const handleGoogleSignIn = async () => {
    setLoading('google');
    setError(null);

    try {
      // Check if Google OAuth is configured
      const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      if (!googleClientId || googleClientId.includes('your-google-client-id')) {
        setError('Google OAuth is not configured. Please contact your administrator.');
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
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      setLoading(null);
    }
  };

  const handleLinkedInSignIn = async () => {
    setLoading('linkedin');
    setError(null);

    try {
      // Check if LinkedIn OAuth is configured
      const linkedinClientId = import.meta.env.LINKEDIN_CLIENT_ID;
      if (!linkedinClientId || linkedinClientId.includes('your-linkedin-client-id')) {
        setError('LinkedIn OAuth is not configured. Please contact your administrator.');
        setLoading(null);
        return;
      }

      const { error } = await signInWithLinkedIn();
      
      if (error) {
        setError(error.message);
        setLoading(null);
      }
    } catch (err) {
      console.error('LinkedIn sign-in error:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
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
      // TODO: Implement email/password authentication
      setError('Email/password authentication not yet implemented');
      setLoading(null);
    } catch (err) {
      console.error('Email sign-in error:', err);
      setError('An unexpected error occurred. Please try again.');
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center p-4">
      {/* Company Logo - Top Left */}
      <div className="absolute top-6 left-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-800">EMPOWR</span>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md">
        <Card className="bg-white shadow-xl border-0 rounded-xl">
          <CardContent className="p-8">
            {/* Login Title */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
              <p className="text-gray-600">Sign in to your professional dashboard</p>
            </div>

            {/* Error Alert */}
            {error && (
              <Alert variant="destructive" className="mb-6 border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {/* Social Login Buttons */}
            <div className="space-y-3 mb-6">
              {/* Google Button */}
              <Button 
                onClick={handleGoogleSignIn} 
                variant="outline"
                className="w-full h-12 font-medium text-gray-700 hover:bg-gray-50 border-gray-200 rounded-lg flex items-center justify-center"
                disabled={loading !== null}
              >
                {loading === 'google' ? (
                  <>
                    <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                    Signing in with Google...
                  </>
                ) : (
                  <>
                    <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </>
                )}
              </Button>

              {/* LinkedIn Button */}
              <Button 
                onClick={handleLinkedInSignIn}
                className="w-full h-12 bg-linkedin-blue hover:bg-linkedin-blue-dark text-white font-medium rounded-lg flex items-center justify-center"
                disabled={loading !== null}
              >
                {loading === 'linkedin' ? (
                  <>
                    <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                    Signing in with LinkedIn...
                  </>
                ) : (
                  <>
                    <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    Continue with LinkedIn
                  </>
                )}
              </Button>

              {/* GitHub Button */}
              <Button 
                className="w-full h-12 bg-gray-800 hover:bg-gray-900 text-white font-medium rounded-lg flex items-center justify-center"
                disabled={loading !== null}
              >
                <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                Continue with GitHub
              </Button>
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleEmailSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 border-gray-200 focus:border-sidebar-primary focus:ring-sidebar-primary rounded-lg"
                  disabled={loading !== null}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 pr-12 border-gray-200 focus:border-sidebar-primary focus:ring-sidebar-primary rounded-lg"
                    disabled={loading !== null}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={loading !== null}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-start">
                <button
                  type="button"
                  className="text-sm text-sidebar-primary hover:text-sidebar-primary/80 font-medium"
                  disabled={loading !== null}
                >
                  Forgot password?
                </button>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-sidebar-primary hover:bg-sidebar-primary/90 text-white font-medium rounded-lg"
                disabled={loading !== null}
              >
                {loading === 'email' ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Log in'
                )}
              </Button>
            </form>

            {/* Additional Links */}
            <div className="mt-8 space-y-3 text-center">
              <button className="block w-full text-sm text-sidebar-primary hover:text-sidebar-primary/80 font-medium">
                Can't Access Your Account?
              </button>
              <div className="text-sm text-gray-600">
                Don't have an account?{' '}
                <button className="text-sidebar-primary hover:text-sidebar-primary/80 font-medium">
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