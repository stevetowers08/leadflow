import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { clearOAuthState, hasOAuthError, getOAuthError, cleanOAuthErrorFromUrl } from '@/utils/auth';
import { authService } from '@/services/authService';
import { AuthDebugger } from '@/utils/authDebugger';

type UserProfile = Database['public']['Tables']['user_profiles']['Row'];

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<{ error: AuthError | null }>;
  signInWithLinkedIn: () => Promise<{ error: AuthError | null }>;
  signInWithEmail: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUpWithEmail: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  updateProfile: (updates: { full_name?: string; avatar_url?: string }) => Promise<{ error: AuthError | null }>;
  clearAuthState: () => Promise<boolean>;
  refreshUserProfile: () => Promise<void>;
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
  console.log('🔍 AuthProvider rendering...');
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Race condition prevention
  const pendingRequests = useRef<Map<string, Promise<any>>>(new Map());
  const isInitializing = useRef<boolean>(false);


  // Create the context value
  const contextValue: AuthContextType = {
    user,
    session,
    userProfile,
    loading,
    signInWithGoogle: async () => {
      try {
        console.log('🔍 Attempting Google OAuth...');
        console.log('🔍 Current URL:', window.location.href);
        console.log('🔍 Origin:', window.location.origin);
        
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/`,
            queryParams: {
              access_type: 'offline',
              prompt: 'consent',
            },
          },
        });
        
        console.log('🔍 Google OAuth response:', { data, error });
        
        if (error) {
          console.error('❌ OAuth error:', error);
          return { error };
        }
        
        // OAuth should redirect, so we shouldn't reach here
        console.log('🔍 OAuth initiated, should redirect...');
        return { error: null };
      } catch (err) {
        console.error('❌ Google OAuth error:', err);
        return { 
          error: { 
            message: `Google OAuth failed: ${err instanceof Error ? err.message : 'Unknown error'}` 
          } as AuthError 
        };
      }
    },
    signInWithLinkedIn: async () => {
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'linkedin_oidc',
          options: {
            redirectTo: window.location.origin,
          },
        });
        return { error };
      } catch (err) {
        return { 
          error: { 
            message: 'LinkedIn OAuth provider is not enabled. Please contact your administrator to configure LinkedIn authentication.' 
          } as AuthError 
        };
      }
    },
    signInWithEmail: async (email: string, password: string) => {
      try {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        return { error };
      } catch (err) {
        return { 
          error: { 
            message: 'Email/password authentication failed. Please check your credentials.' 
          } as AuthError 
        };
      }
    },
    signUpWithEmail: async (email: string, password: string) => {
      try {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        return { error };
      } catch (err) {
        return { 
          error: { 
            message: 'Email/password signup failed. Please try again.' 
          } as AuthError 
        };
      }
    },
    updateProfile: async (updates: { full_name?: string; avatar_url?: string }) => {
      const { error } = await supabase.auth.updateUser({
        data: updates,
      });
      return { error };
    },
    clearAuthState: async () => {
      return await clearOAuthState();
    },
    refreshUserProfile: async () => {
      if (user?.id) {
        const profile = await fetchUserProfile(user.id);
        setUserProfile(profile);
      }
    }
  };

  const createUserProfile = useCallback(async (user: any): Promise<UserProfile | null> => {
    // Prevent duplicate profile creation
    const requestKey = `create_profile_${user.id}`;
    if (pendingRequests.current.has(requestKey)) {
      return pendingRequests.current.get(requestKey);
    }

    const promise = (async () => {
      try {
        console.log('Creating user profile for:', user.email);
        
        const newProfile = {
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || user.user_metadata?.name || 'Unknown User',
          role: 'recruiter', // Default role for new users
          user_limit: 100, // Default user limit
          is_active: true
        };

        const { data, error } = await supabase
          .from('user_profiles')
          .insert(newProfile)
          .select()
          .single();

        if (error) {
          console.error('Error creating user profile:', error);
          // Don't throw error, just return null to prevent app crash
          return null;
        }

        console.log('User profile created successfully:', data?.email);
        return data;
      } catch (error) {
        console.error('Error creating user profile:', error);
        // Don't throw error, just return null to prevent app crash
        return null;
      } finally {
        pendingRequests.current.delete(requestKey);
      }
    })();

    pendingRequests.current.set(requestKey, promise);
    return promise;
  }, []);

  const fetchUserProfile = useCallback(async (userId: string): Promise<UserProfile | null> => {
    // Prevent duplicate requests for the same user
    const requestKey = `profile_${userId}`;
    if (pendingRequests.current.has(requestKey)) {
      return pendingRequests.current.get(requestKey);
    }

    const promise = (async () => {
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) {
          console.error('Error fetching user profile:', error);
          return null;
        }

        return data;
      } catch (error) {
        console.error('Error fetching user profile:', error);
        return null;
      } finally {
        pendingRequests.current.delete(requestKey);
      }
    })();

    pendingRequests.current.set(requestKey, promise);
    return promise;
  }, []);

  const refreshUserProfile = async (): Promise<void> => {
    if (user?.id) {
      const profile = await fetchUserProfile(user.id);
      setUserProfile(profile);
    }
  };

  useEffect(() => {
    // Prevent multiple initializations
    if (isInitializing.current) return;
    isInitializing.current = true;

    console.log('🔍 Starting authentication initialization...');

    // Set a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      console.log('⏰ Authentication timeout - forcing loading to false');
      setLoading(false);
      isInitializing.current = false;
    }, 3000); // Reduced timeout to 3 seconds

    // Get initial session with error handling
    supabase.auth.getSession()
      .then(async ({ data: { session }, error }) => {
        clearTimeout(timeoutId);
        
        if (error) {
          console.error('❌ Error getting session:', error);
          setLoading(false);
          isInitializing.current = false;
          return;
        }
        
        console.log('📡 Session received:', session ? 'User logged in' : 'No user');
        
        // Debug authentication state
        if (session) {
          const tokenInfo = authService.analyzeToken(session.access_token);
          console.log('🔍 Token analysis:', {
            isValid: tokenInfo.isValid,
            isExpired: tokenInfo.isExpired,
            expiresAt: tokenInfo.expiresAt,
            userId: tokenInfo.userId,
            email: tokenInfo.email,
            role: tokenInfo.role
          });
          
          if (tokenInfo.isExpired) {
            console.warn('⚠️ Token is expired, attempting refresh...');
            const { session: refreshedSession } = await authService.refreshSession();
            if (refreshedSession) {
              console.log('✅ Token refreshed successfully');
              setSession(refreshedSession);
              setUser(refreshedSession.user);
            } else {
              console.error('❌ Token refresh failed');
            }
          } else {
            setSession(session);
            setUser(session.user);
          }
        } else {
          setSession(null);
          setUser(null);
        }
        
        if (session?.user?.id) {
          try {
            const profile = await fetchUserProfile(session.user.id);
            if (!profile) {
              const newProfile = await createUserProfile(session.user);
              setUserProfile(newProfile);
            } else {
              setUserProfile(profile);
            }
          } catch (error) {
            console.error('Error handling user profile:', error);
          }
        }
        
        console.log('✅ Authentication initialization complete');
        setLoading(false);
        isInitializing.current = false;
      })
      .catch((error) => {
        clearTimeout(timeoutId);
        console.error('❌ Error getting session:', error);
        setLoading(false);
        isInitializing.current = false;
      });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state changed:', event, 'Session:', session ? 'Present' : 'None');
      console.log('🔄 User:', session?.user ? `${session.user.email} (${session.user.id})` : 'None');
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user?.id) {
        console.log('🔍 User authenticated, fetching profile...');
        try {
          const profile = await fetchUserProfile(session.user.id);
          if (!profile) {
            console.log('🔍 No profile found, creating new one...');
            const newProfile = await createUserProfile(session.user);
            setUserProfile(newProfile);
          } else {
            console.log('🔍 Profile found:', profile.email);
            setUserProfile(profile);
          }
        } catch (error) {
          console.error('Error handling user profile:', error);
        }
      } else {
        console.log('🔍 No user, clearing profile');
        setUserProfile(null);
      }
      
      console.log('🔍 Auth state change complete, setting loading to false');
      setLoading(false);
    });

    return () => {
      clearTimeout(timeoutId);
      subscription.unsubscribe();
      isInitializing.current = false;
    };
  }, [fetchUserProfile, createUserProfile]);

  console.log('🔍 AuthProvider providing context:', { user: !!user, loading });
  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
