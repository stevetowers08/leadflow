import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Loader2 } from 'lucide-react';
import { AuthModal } from './AuthModal';

interface AuthGuardProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  isLoading?: boolean;
  onSignIn?: () => void;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  title = 'Authentication Required',
  description = 'Please sign in to access this feature',
  isLoading = false,
  onSignIn,
}) => {
  const [showAuthModal, setShowAuthModal] = React.useState(false);

  const handleSignInClick = () => {
    if (onSignIn) {
      onSignIn();
    } else {
      setShowAuthModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowAuthModal(false);
  };

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center p-4'>
        <div className='text-center'>
          <Loader2 className='h-12 w-12 animate-spin text-primary mx-auto mb-4' />
          <p className='text-sm text-muted-foreground'>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className='min-h-screen flex items-center justify-center p-4'>
        <div className='w-full max-w-md'>
          <Card className='shadow-lg border-0 rounded-xl'>
            <CardHeader className='text-center pb-6'>
              <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted'>
                <Lock className='h-6 w-6 text-muted-foreground' />
              </div>
              <CardTitle className='text-xl font-semibold'>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className='px-8 pb-8'>
              <div className='space-y-4'>
                <div className='text-center'>
                  <p className='text-sm text-muted-foreground mb-6'>
                    Sign in to access your professional recruitment dashboard
                    and manage your leads, jobs, and companies.
                  </p>
                </div>

                <Button onClick={handleSignInClick} className='w-full h-10'>
                  Sign In to Continue
                </Button>

                <div className='text-center'>
                  <p className='text-xs text-muted-foreground'>
                    By signing in, you agree to our terms of service and privacy
                    policy.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={handleCloseModal}
        title='Sign in to continue'
        description='Access your professional recruitment dashboard'
      />
    </>
  );
};
