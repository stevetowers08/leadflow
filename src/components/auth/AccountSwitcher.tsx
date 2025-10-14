import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import React, { useState } from 'react';

interface AccountSwitcherProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccountSwitcher: React.FC<AccountSwitcherProps> = ({ isOpen, onClose }) => {
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Management</h3>
        
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Currently signed in as:</p>
          <div className="bg-gray-50 rounded-md p-3">
            <p className="font-medium text-gray-900">{user?.email}</p>
            <p className="text-sm text-gray-500">{user?.user_metadata?.full_name || 'No name available'}</p>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleSwitchAccount}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Switch Google Account
          </button>
          
          <button
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {isSigningOut ? 'Signing Out...' : 'Sign Out'}
          </button>
          
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
