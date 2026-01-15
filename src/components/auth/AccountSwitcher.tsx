import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface AccountSwitcherProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccountSwitcher: React.FC<AccountSwitcherProps> = ({
  isOpen,
  onClose,
}) => {
  const { user, signOut } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      onClose();
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsSigningOut(false);
    }
  };

  const handleSwitchAccount = () => {
    // Clear current session and redirect to Google OAuth
    supabase.auth.signOut().then(() => {
      window.location.href = '/';
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Account Management</DialogTitle>
        </DialogHeader>

        <div className='space-y-4'>
          <div>
            <p className='text-sm text-muted-foreground mb-2'>
              Currently signed in as:
            </p>
            <div className='bg-muted rounded-md p-3'>
              <p className='font-medium text-foreground'>{user?.email}</p>
              <p className='text-sm text-muted-foreground'>
                {user?.user_metadata?.full_name || 'No name available'}
              </p>
            </div>
          </div>

          <div className='space-y-3'>
            <Button onClick={handleSwitchAccount} className='w-full'>
              Switch Google Account
            </Button>

            <Button
              onClick={handleSignOut}
              disabled={isSigningOut}
              variant='destructive'
              className='w-full'
            >
              {isSigningOut ? 'Signing Out...' : 'Sign Out'}
            </Button>

            <Button onClick={onClose} variant='outline' className='w-full'>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
