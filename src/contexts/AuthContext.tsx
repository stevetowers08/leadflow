/**
 * Refactored AuthContext
 *
 * Uses smaller, focused hooks for better maintainability
 * Fixes memory leaks and consolidates duplicate logic
 */

import { useAuthState } from '@/hooks/useAuthState';
import { useUserProfile } from '@/hooks/useUserProfile';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { AuthError, Session, User } from '@supabase/supabase-js';
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react';

type UserProfile = Database['public']['Tables']['user_profiles']['Row'];

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<{ error: AuthError | null }>;
  signInWithPassword: (
    email: string,
    password: string
  ) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  updateProfile: (updates: {
    full_name?: string;
    avatar_url?: string;
  }) => Promise<{ error: AuthError | null }>;
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

// Retry mechanism constants
const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 1000; // 1 second

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const authState = useAuthState();
  const userProfile = useUserProfile();

  // Refs for cleanup and preventing duplicate processing
  const isMountedRef = useRef(true);
  const lastProcessedUserIdRef = useRef<string | null>(null);
  const retryCountRef = useRef(0);
  const timeoutRefsRef = useRef<Set<NodeJS.Timeout>>(new Set());

  // Cleanup function for timeouts
  const clearAllTimeouts = () => {
    timeoutRefsRef.current.forEach(timeout => clearTimeout(timeout));
    timeoutRefsRef.current.clear();
  };

  // Safe timeout setter that tracks timeouts for cleanup
  const setSafeTimeout = (callback: () => void, delay: number) => {
    const timeoutId = setTimeout(() => {
      timeoutRefsRef.current.delete(timeoutId);
      if (isMountedRef.current) {
        callback();
      }
    }, delay);
    timeoutRefsRef.current.add(timeoutId);
    return timeoutId;
  };

  // Retry authentication mechanism
  const retryAuth = async () => {
    if (retryCountRef.current >= MAX_RETRY_ATTEMPTS) {
      console.error('❌ Max retry attempts reached');
      authState.setError(
        'Authentication failed after multiple attempts. Please refresh the page.'
      );
      authState.setLoading(false);
      return;
    }

    console.log(
      `🔄 Retrying authentication (attempt ${retryCountRef.current + 1})`
    );
    retryCountRef.current += 1;
    authState.setError(null);
    authState.setLoading(true);

    try {
      // Clear existing state
      authState.setUser(null);
      userProfile.setUserProfile(null);
      authState.setSession(null);

      // Wait a bit before retrying
      await new Promise(resolve => {
        setSafeTimeout(resolve, RETRY_DELAY);
      });

      // Get fresh session
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        throw error;
      }

      if (session?.user) {
        authState.setUser(session.user);
        authState.setSession(session);

        const profile = await userProfile.loadUserProfile(session.user.id);
        userProfile.setUserProfile(profile);
      }
    } catch (error) {
      console.error('❌ Retry auth error:', error);
      authState.setError(
        `Authentication retry failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    } finally {
      authState.setLoading(false);
    }
  };

  // Initialize authentication with robust error handling
  useEffect(() => {
    let authStateSubscription: any = null;

    const initializeAuth = async () => {
      try {
        console.log('🔐 Initializing authentication...');
        authState.setError(null);

        // Set a timeout to force loading to complete after 5 seconds
        setSafeTimeout(() => {
          if (isMountedRef.current) {
            console.log(
              '⏰ Auth initialization timeout - forcing loading to false'
            );
            authState.setLoading(false);
          }
        }, 5000);

        // Check if supabase client is properly initialized
        if (!supabase || !supabase.auth) {
          throw new Error(
            'Supabase client not properly initialized. Check environment variables.'
          );
        }

        // Get initial session
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error('❌ Error getting initial session:', error);
          throw error;
        }

        console.log('📋 Initial session:', {
          hasSession: !!session,
          hasUser: !!session?.user,
          userEmail: session?.user?.email,
        });

        if (isMountedRef.current) {
          authState.setUser(session?.user ?? null);
          authState.setSession(session);

          if (session?.user) {
            console.log('🔍 Loading user profile for:', session.user.id);
            if (isMountedRef.current) {
              // Try to fetch actual user profile from database first
              try {
                const { data: existingProfile, error: profileError } =
                  await supabase
                    .from('user_profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();

                if (existingProfile && !profileError) {
                  console.log(
                    '✅ Found existing user profile:',
                    existingProfile
                  );
                  console.log(
                    '🔍 User role from database:',
                    existingProfile.role
                  );
                  userProfile.setUserProfile(existingProfile);
                } else {
                  console.log(
                    '🔧 No existing profile found, creating fallback profile'
                  );
                  const fallbackProfile = userProfile.createFallbackProfile(
                    session.user
                  );
                  userProfile.setUserProfile(fallbackProfile);
                }
              } catch (error) {
                console.error('❌ Error fetching user profile:', error);
                // Fallback to creating a profile
                const fallbackProfile = userProfile.createFallbackProfile(
                  session.user
                );
                userProfile.setUserProfile(fallbackProfile);
              }

              authState.setLoading(false);
            }
          } else {
            if (isMountedRef.current) {
              authState.setLoading(false);
              console.log('✅ Loading set to false - no user');
            }
          }
        }
      } catch (error) {
        console.error('❌ Auth initialization error:', error);
        if (isMountedRef.current) {
          authState.setError(
            `Authentication initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`
          );
          authState.setLoading(false);
        }
      }
    };

    // Set up auth state listener
    const setupAuthListener = () => {
      if (!supabase || !supabase.auth) {
        console.error(
          '❌ Cannot setup auth listener - Supabase client not initialized'
        );
        return;
      }

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (!isMountedRef.current) return;

        console.log('🔄 Auth state change:', event, session?.user?.id);

        try {
          authState.setUser(session?.user ?? null);
          authState.setSession(session);
          authState.setError(null); // Clear errors on successful auth change

          if (session?.user) {
            // Prevent duplicate profile creation for the same user
            if (lastProcessedUserIdRef.current !== session.user.id) {
              console.log('🔄 Auth state change - loading user profile');
              if (isMountedRef.current) {
                // Try to fetch actual user profile from database first
                try {
                  const { data: existingProfile, error: profileError } =
                    await supabase
                      .from('user_profiles')
                      .select('*')
                      .eq('id', session.user.id)
                      .single();

                  if (existingProfile && !profileError) {
                    console.log(
                      '✅ Found existing user profile:',
                      existingProfile
                    );
                    console.log(
                      '🔍 User role from database:',
                      existingProfile.role
                    );
                    userProfile.setUserProfile(existingProfile);
                  } else {
                    console.log(
                      '🔧 No existing profile found, creating fallback profile'
                    );
                    const fallbackProfile = userProfile.createFallbackProfile(
                      session.user
                    );
                    userProfile.setUserProfile(fallbackProfile);
                  }
                } catch (error) {
                  console.error('❌ Error fetching user profile:', error);
                  // Fallback to creating a profile
                  const fallbackProfile = userProfile.createFallbackProfile(
                    session.user
                  );
                  userProfile.setUserProfile(fallbackProfile);
                }

                lastProcessedUserIdRef.current = session.user.id;
                console.log('✅ User profile loaded');
                authState.setLoading(false);
              }
            } else {
              console.log(
                '🔄 Auth state change - user already processed, skipping profile creation'
              );
              authState.setLoading(false);
            }
          } else {
            if (isMountedRef.current) {
              userProfile.setUserProfile(null);
              authState.setLoading(false);
            }
          }
        } catch (error) {
          console.error('❌ Auth state change error:', error);
          if (isMountedRef.current) {
            authState.setError(
              `Authentication state change failed: ${error instanceof Error ? error.message : 'Unknown error'}`
            );
          }
        }

        if (isMountedRef.current) {
          authState.setLoading(false);
        }
      });

      authStateSubscription = subscription;
    };

    // Initialize auth and set up listener
    initializeAuth();
    setupAuthListener();

    return () => {
      isMountedRef.current = false;
      if (authStateSubscription) {
        authStateSubscription.unsubscribe();
      }
      clearAllTimeouts();
    };
  }, []); // Empty dependency array to prevent infinite loops

  // Refresh profile function - also refreshes auth state
  const refreshProfile = async () => {
    try {
      console.log('🔄 Refreshing auth state and profile...');

      // First, get the current session to ensure we have the latest auth state
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        console.error('❌ Error getting session:', sessionError);
        return;
      }

      if (session?.user) {
        console.log('✅ Session found during refresh:', session.user.email);

        // Update auth state
        authState.setUser(session.user);
        authState.setSession(session);
        authState.setError(null);

        // Then fetch/update profile
        const profile = await userProfile.loadUserProfile(session.user.id);
        userProfile.setUserProfile(profile);
      } else {
        console.log('⚠️ No session found during refresh');
        // No session, clear auth state
        authState.setUser(null);
        authState.setSession(null);
        userProfile.setUserProfile(null);
      }
    } catch (error) {
      console.error('❌ Error in refreshProfile:', error);
    }
  };

  const value = useMemo(
    () => ({
      user: authState.user,
      userProfile: userProfile.userProfile,
      session: authState.session,
      loading: authState.loading || userProfile.profileLoading,
      error: authState.error || userProfile.profileError,
      signInWithGoogle: authState.signInWithGoogle,
      signInWithPassword: authState.signInWithPassword,
      signOut: authState.signOut,
      updateProfile: authState.updateProfile,
      clearAuthState: authState.clearAuthState,
      forceReAuth: authState.forceReAuth,
      refreshProfile,
      retryAuth,
    }),
    [
      authState.user,
      authState.session,
      authState.loading,
      authState.error,
      authState.signInWithGoogle,
      authState.signInWithPassword,
      authState.signOut,
      authState.updateProfile,
      authState.clearAuthState,
      authState.forceReAuth,
      userProfile.userProfile,
      userProfile.profileLoading,
      userProfile.profileError,
      refreshProfile,
      retryAuth,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
