import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { clearOAuthState, hasOAuthError, getOAuthError, cleanOAuthErrorFromUrl } from '@/utils/auth';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: () => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  updateProfile: (updates: { full_name?: string; avatar_url?: string }) => Promise<{ error: AuthError | null }>;
  clearAuthState: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ultra-simplified auth initialization
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        // Silent error handling
      }
      setLoading(false);
    };

    // Immediate initialization
    initAuth();

    // Simple auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      
      if (error) {
        // Handle specific error cases
        if (error.message.includes('org_internal')) {
          return { 
            error: { 
              message: 'Access blocked: This Google account is restricted to organization users only. Please use a different Google account or contact your administrator.' 
            } as AuthError 
          };
        }
        
        if (error.message.includes('validation_failed')) {
          return { 
            error: { 
              message: 'Google OAuth provider is not enabled in Supabase. Please contact your administrator to configure Google authentication.' 
            } as AuthError 
          };
        }

        if (error.message.includes('bad_oauth_state') || error.message.includes('invalid_request')) {
          return { 
            error: { 
              message: 'OAuth state mismatch. Please try signing in again. If the issue persists, clear your browser cache and cookies.' 
            } as AuthError 
          };
        }
      }
      
      return { error };
    } catch (err) {
      return { 
        error: { 
          message: 'Google OAuth provider is not enabled. Please contact your administrator to configure Google authentication.' 
        } as AuthError 
      };
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const updateProfile = async (updates: { full_name?: string; avatar_url?: string }) => {
    const { error } = await supabase.auth.updateUser({
      data: updates,
    });
    return { error };
  };

  const clearAuthState = async () => {
    return await clearOAuthState();
  };

  const value = {
    user,
    session,
    loading,
    signInWithGoogle,
    signOut,
    updateProfile,
    clearAuthState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
