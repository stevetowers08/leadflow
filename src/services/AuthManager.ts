import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import {
  validateEnvironment,
  logEnvironmentStatus,
  safeSupabaseOperation,
} from '@/utils/environmentValidation';

type UserProfile = Database['public']['Tables']['user_profiles']['Row'];

export interface AuthState {
  user: User | null;
  userProfile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

export class AuthManager {
  private static instance: AuthManager;
  private state: AuthState = {
    user: null,
    userProfile: null,
    session: null,
    loading: true,
    error: null,
    initialized: false,
  };

  private listeners: ((state: AuthState) => void)[] = [];

  private constructor() {
    this.initialize();
  }

  static getInstance(): AuthManager {
    if (!AuthManager.instance) {
      AuthManager.instance = new AuthManager();
    }
    return AuthManager.instance;
  }

  private async initialize(): Promise<void> {
    try {
      console.log('🚀 Initializing AuthManager...');

      // Validate environment first
      const envConfig = validateEnvironment();
      if (!envConfig.isValid) {
        throw new Error(
          `Environment validation failed: ${envConfig.errors.join(', ')}`
        );
      }

      logEnvironmentStatus();

      // Initialize auth state
      await this.initializeAuth();

      // Set up auth state listener
      this.setupAuthListener();

      this.setState({ initialized: true, loading: false });
      console.log('✅ AuthManager initialized successfully');
    } catch (error) {
      console.error('❌ AuthManager initialization failed:', error);
      this.setState({
        error: error instanceof Error ? error.message : 'Unknown error',
        loading: false,
        initialized: true,
      });
    }
  }

  private async initializeAuth(): Promise<void> {
    try {
      // Try to get existing session
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.warn('⚠️ Session retrieval failed:', error);
        return;
      }

      if (session?.user) {
        console.log('👤 Found existing session for:', session.user.email);
        this.setState({ user: session.user, session });

        // Fetch user profile
        const profile = await this.fetchUserProfile(session.user.id);
        this.setState({ userProfile: profile });
      } else {
        console.log('📝 No existing session found');
      }
    } catch (error) {
      console.error('❌ Auth initialization error:', error);
      throw error;
    }
  }

  private setupAuthListener(): void {
    supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state changed:', event, session?.user?.email);

      this.setState({
        user: session?.user ?? null,
        session: session ?? null,
      });

      if (session?.user) {
        // Fetch or create profile
        const profile = await this.fetchUserProfile(session.user.id);
        this.setState({ userProfile: profile });
      } else {
        this.setState({ userProfile: null });
      }
    });
  }

  private async fetchUserProfile(userId: string): Promise<UserProfile | null> {
    return await safeSupabaseOperation(async () => {
      // Try admin client first
      if (supabaseAdmin) {
        try {
          const { data, error } = await supabaseAdmin
            .from('user_profiles')
            .select('*')
            .eq('id', userId)
            .single();

          if (!error && data) {
            console.log('✅ Profile fetched with admin client');
            return data;
          }
        } catch (err) {
          console.warn('⚠️ Admin client failed:', err);
        }
      }

      // Try regular client
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('❌ Profile fetch failed:', error);
        return null;
      }

      console.log('✅ Profile fetched with regular client');
      return data;
    }, 'fetchUserProfile');
  }

  private setState(updates: Partial<AuthState>): void {
    this.state = { ...this.state, ...updates };
    this.notifyListeners();
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.state));
  }

  // Public API
  subscribe(listener: (state: AuthState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  getState(): AuthState {
    return { ...this.state };
  }

  async signOut(): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      this.setState({ user: null, userProfile: null, session: null });
      return { error };
    } catch (error) {
      console.error('❌ Sign out error:', error);
      return { error };
    }
  }

  async signInWithGoogle(): Promise<{ error: AuthError | null }> {
    try {
      // Get redirect URL - prefer environment variable, fallback to window.location.origin
      // IMPORTANT: NEXT_PUBLIC_SITE_URL must be set in Vercel for production
      const siteUrl =
        process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
      const redirectTo = `${siteUrl.replace(/\/$/, '')}/auth/callback`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
        },
      });
      return { error };
    } catch (error) {
      console.error('❌ Google sign in error:', error);
      return { error };
    }
  }
}
