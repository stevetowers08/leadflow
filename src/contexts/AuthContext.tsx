import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '../integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  userProfile: any | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<{ error: AuthError | null }>;
  signInWithLinkedIn: () => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  updateProfile: (updates: { full_name?: string; avatar_url?: string }) => Promise<{ error: AuthError | null }>;
  clearAuthState: () => Promise<boolean>;
  forceReAuth: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  retryAuth: () => Promise<void>;
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

// Robust error handling and retry mechanism
const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 1000; // 1 second

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [lastProcessedUserId, setLastProcessedUserId] = useState<string | null>(null);

  // Simplified profile loading with timeout
  const loadUserProfile = useCallback(async (userId: string): Promise<any> => {
    try {
      console.log(`🔍 Loading user profile for: ${userId}`);

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.log(`ℹ️ No existing profile found for user: ${userId}`);
        return null; // Return null instead of throwing error
      }

      console.log('✅ Profile loaded successfully:', {
        id: data.id,
        email: data.email,
        full_name: data.full_name,
        role: data.role
      });
      
      setError(null);
      return data;
    } catch (error) {
      console.log(`ℹ️ Profile loading failed, will create new profile:`, error);
      return null; // Return null instead of throwing error
    }
  }, []);

  // Retry authentication mechanism
  const retryAuth = useCallback(async () => {
    if (retryCount >= MAX_RETRY_ATTEMPTS) {
      console.error('❌ Max retry attempts reached');
      setError('Authentication failed after multiple attempts. Please refresh the page.');
      setLoading(false);
      return;
    }

    console.log(`🔄 Retrying authentication (attempt ${retryCount + 1})`);
    setRetryCount(prev => prev + 1);
    setError(null);
    setLoading(true);

    try {
      // Clear existing state
      setUser(null);
      setUserProfile(null);
      setSession(null);

      // Wait a bit before retrying
      await new Promise(resolve => {
        const timeoutId = setTimeout(resolve, RETRY_DELAY);
        // Store timeout ID for potential cleanup
        (resolve as any).timeoutId = timeoutId;
      });

      // Get fresh session
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        throw error;
      }

      if (session?.user) {
        setUser(session.user);
        setSession(session);
        
        const profile = await loadUserProfile(session.user.id);
        setUserProfile(profile);
      }
    } catch (error) {
      console.error('❌ Retry auth error:', error);
      setError(`Authentication retry failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  }, [retryCount]);

  // Initialize authentication with robust error handling
  useEffect(() => {
    let isMounted = true;
    let authStateSubscription: any = null;
    let timeoutId: any = null;

    const initializeAuth = async () => {
      try {
        console.log('🔐 Initializing authentication...');
        setError(null);

        // Set a timeout to force loading to complete after 2 seconds
        timeoutId = setTimeout(() => {
          if (isMounted) {
            console.log('⏰ Auth initialization timeout - forcing loading to false');
            setLoading(false);
          }
        }, 2000);

        // Check if supabase client is properly initialized
        if (!supabase || !supabase.auth) {
          throw new Error('Supabase client not properly initialized. Check environment variables.');
        }

        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('❌ Error getting initial session:', error);
          throw error;
        }

        console.log('📋 Initial session:', {
          hasSession: !!session,
          hasUser: !!session?.user,
          userEmail: session?.user?.email
        });

        if (isMounted) {
          setUser(session?.user ?? null);
          setSession(session);

          if (session?.user) {
            console.log('🔍 Loading user profile for:', session.user.id);
            if (isMounted) {
              // Create fallback profile immediately
              console.log('🔧 Creating fallback profile for user');
              const fallbackProfile = {
                id: session.user.id,
                email: session.user.email,
                full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || 'User',
                role: 'recruiter',
                user_limit: 100,
                is_active: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              };
              setUserProfile(fallbackProfile);
              console.log('✅ Fallback profile created');
              
              setLoading(false);
              clearTimeout(timeoutId);
            }
          } else {
            if (isMounted) {
              setLoading(false);
              clearTimeout(timeoutId);
              console.log('✅ Loading set to false - no user');
            }
          }
        }
      } catch (error) {
        console.error('❌ Auth initialization error:', error);
        if (isMounted) {
          setError(`Authentication initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
          setLoading(false);
          clearTimeout(timeoutId);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          clearTimeout(timeoutId);
        }
      }
    };

    // Set up auth state listener
    const setupAuthListener = () => {
      if (!supabase || !supabase.auth) {
        console.error('❌ Cannot setup auth listener - Supabase client not initialized');
        return;
      }

      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (!isMounted) return;

          console.log('🔄 Auth state change:', event, session?.user?.id);

          try {
            setUser(session?.user ?? null);
            setSession(session);
            setError(null); // Clear errors on successful auth change

            if (session?.user) {
              // Prevent duplicate profile creation for the same user
              if (lastProcessedUserId !== session.user.id) {
                console.log('🔄 Auth state change - loading user profile');
                if (isMounted) {
                  // Create fallback profile immediately
                  console.log('🔧 Creating fallback profile for user');
                  const fallbackProfile = {
                    id: session.user.id,
                    email: session.user.email,
                    full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || 'User',
                    role: 'recruiter',
                    user_limit: 100,
                    is_active: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                  };
                  setUserProfile(fallbackProfile);
                  setLastProcessedUserId(session.user.id);
                  console.log('✅ Fallback profile created');
                  
                  setLoading(false);
                }
              } else {
                console.log('🔄 Auth state change - user already processed, skipping profile creation');
                setLoading(false);
              }
            } else {
              if (isMounted) {
                setUserProfile(null);
                setLoading(false);
              }
            }
          } catch (error) {
            console.error('❌ Auth state change error:', error);
            if (isMounted) {
              setError(`Authentication state change failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
          }

          if (isMounted) {
            setLoading(false);
          }
        }
      );

      authStateSubscription = subscription;
    };

    // Initialize auth and set up listener
    initializeAuth();
    setupAuthListener();

    return () => {
      isMounted = false;
      if (authStateSubscription) {
        authStateSubscription.unsubscribe();
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []); // ✅ Empty dependency array to prevent infinite loops

  // Refresh profile function
  const refreshProfile = useCallback(async () => {
    if (user) {
      console.log('🔄 Refreshing profile...');
      const profile = await loadUserProfile(user.id);
      setUserProfile(profile);
    }
  }, [user]);

  const signInWithGoogle = async () => {
    try {
      setError(null);
      
      // Check if Google OAuth is configured
      const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      if (!googleClientId || googleClientId.includes('your-google-client-id')) {
        const authError = new Error('Google OAuth is not configured. Please contact your administrator.');
        setError(authError.message);
        return { error: authError };
      }

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      return { error };
    } catch (error) {
      const authError = error as AuthError;
      setError(`Google sign-in failed: ${authError.message}`);
      return { error: authError };
    }
  };

  const signInWithLinkedIn = async () => {
    try {
      setError(null);
      
      // Check if LinkedIn OAuth is configured
      const linkedinClientId = import.meta.env.LINKEDIN_CLIENT_ID;
      if (!linkedinClientId || linkedinClientId.includes('your-linkedin-client-id')) {
        const authError = new Error('LinkedIn OAuth is not configured. Please contact your administrator.');
        setError(authError.message);
        return { error: authError };
      }

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'linkedin',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      return { error };
    } catch (error) {
      const authError = error as AuthError;
      setError(`LinkedIn sign-in failed: ${authError.message}`);
      return { error: authError };
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      console.log('🚪 Signing out...');
      console.log('🔍 Current user before sign out:', user?.email);
      
      // Clear all state first
      setUser(null);
      setUserProfile(null);
      setSession(null);
      setLoading(false);
      
      // Clear storage
      localStorage.clear();
      sessionStorage.clear();
      
      // Then sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.warn('⚠️ Supabase sign out error (but state cleared):', error);
      }
      
      console.log('✅ Sign out successful - state cleared');
      return { error: null };
    } catch (error) {
      const authError = error as AuthError;
      console.error('❌ Sign out error:', authError);
      
      // Force clear state even if sign out fails
      setUser(null);
      setUserProfile(null);
      setSession(null);
      setLoading(false);
      localStorage.clear();
      sessionStorage.clear();
      
      console.log('✅ State cleared despite sign out error');
      return { error: null }; // Return success since state is cleared
    }
  };

  const updateProfile = async (updates: { full_name?: string; avatar_url?: string }) => {
    try {
      setError(null);
      const { error } = await supabase.auth.updateUser({
        data: updates,
      });
      return { error };
    } catch (error) {
      const authError = error as AuthError;
      setError(`Profile update failed: ${authError.message}`);
      return { error: authError };
    }
  };

  const clearAuthState = async () => {
    try {
      setError(null);
      await supabase.auth.signOut();
      localStorage.clear();
      sessionStorage.clear();
      setUser(null);
      setUserProfile(null);
      setSession(null);
      return true;
    } catch (error) {
      console.error('❌ Clear auth state error:', error);
      setError(`Failed to clear auth state: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false;
    }
  };

  const forceReAuth = async () => {
    try {
      console.log('🔄 Forcing re-authentication...');
      setError(null);
      
      await supabase.auth.signOut();
      localStorage.clear();
      sessionStorage.clear();
      
      // Reset retry count
      setRetryCount(0);
      
      // Reload page to start fresh
      window.location.reload();
    } catch (error) {
      console.error('❌ Error during force re-auth:', error);
      setError(`Force re-authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      window.location.reload();
    }
  };

  const value = {
    user,
    userProfile,
    session,
    loading,
    error,
    signInWithGoogle,
    signInWithLinkedIn,
    signOut,
    updateProfile,
    clearAuthState,
    forceReAuth,
    refreshProfile,
    retryAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};