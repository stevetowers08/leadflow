import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

export interface AuthTokenInfo {
  isValid: boolean;
  isExpired: boolean;
  expiresAt: Date | null;
  userId: string | null;
  email: string | null;
  role: string | null;
}

export class AuthService {
  private static instance: AuthService;
  private tokenCheckInterval: NodeJS.Timeout | null = null;

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Get current session and validate token
   */
  async getCurrentSession(): Promise<{ session: Session | null; user: User | null }> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error);
        return { session: null, user: null };
      }

      return { session, user: session?.user ?? null };
    } catch (error) {
      console.error('Error getting session:', error);
      return { session: null, user: null };
    }
  }

  /**
   * Analyze JWT token and return detailed information
   */
  analyzeToken(token?: string): AuthTokenInfo {
    if (!token) {
      return {
        isValid: false,
        isExpired: true,
        expiresAt: null,
        userId: null,
        email: null,
        role: null
      };
    }

    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return {
          isValid: false,
          isExpired: true,
          expiresAt: null,
          userId: null,
          email: null,
          role: null
        };
      }

      const payload = JSON.parse(atob(parts[1]));
      const now = Math.floor(Date.now() / 1000);
      const isExpired = payload.exp < now;

      return {
        isValid: true,
        isExpired,
        expiresAt: new Date(payload.exp * 1000),
        userId: payload.sub || null,
        email: payload.email || null,
        role: payload.role || null
      };
    } catch (error) {
      console.error('Error analyzing token:', error);
      return {
        isValid: false,
        isExpired: true,
        expiresAt: null,
        userId: null,
        email: null,
        role: null
      };
    }
  }

  /**
   * Get current access token from Supabase
   */
  async getAccessToken(): Promise<string | null> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return session?.access_token || null;
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  }

  /**
   * Refresh the current session
   */
  async refreshSession(): Promise<{ session: Session | null; user: User | null }> {
    try {
      const { data: { session }, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('Error refreshing session:', error);
        return { session: null, user: null };
      }

      return { session, user: session?.user ?? null };
    } catch (error) {
      console.error('Error refreshing session:', error);
      return { session: null, user: null };
    }
  }

  /**
   * Check if user has specific role
   */
  async hasRole(role: string): Promise<boolean> {
    try {
      const { user } = await this.getCurrentSession();
      if (!user) return false;

      // Check JWT token for role
      const token = await this.getAccessToken();
      if (token) {
        const tokenInfo = this.analyzeToken(token);
        return tokenInfo.role === role;
      }

      return false;
    } catch (error) {
      console.error('Error checking role:', error);
      return false;
    }
  }

  /**
   * Check if user is owner
   */
  async isOwner(): Promise<boolean> {
    return this.hasRole('owner');
  }

  /**
   * Check if user is admin
   */
  async isAdmin(): Promise<boolean> {
    return this.hasRole('admin');
  }

  /**
   * Get user permissions from database
   */
  async getUserPermissions(userId: string) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('role, permissions')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error getting user permissions:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error getting user permissions:', error);
      return null;
    }
  }

  /**
   * Start token monitoring
   */
  startTokenMonitoring(intervalMs: number = 60000) {
    if (this.tokenCheckInterval) {
      clearInterval(this.tokenCheckInterval);
    }

    this.tokenCheckInterval = setInterval(async () => {
      const token = await this.getAccessToken();
      if (token) {
        const tokenInfo = this.analyzeToken(token);
        if (tokenInfo.isExpired) {
          console.log('Token expired, attempting refresh...');
          await this.refreshSession();
        }
      }
    }, intervalMs);
  }

  /**
   * Stop token monitoring
   */
  stopTokenMonitoring() {
    if (this.tokenCheckInterval) {
      clearInterval(this.tokenCheckInterval);
      this.tokenCheckInterval = null;
    }
  }

  /**
   * Clear all authentication data
   */
  async clearAuthData(): Promise<void> {
    try {
      await supabase.auth.signOut();
      
      // Clear localStorage auth items
      const authKeys = Object.keys(localStorage).filter(key => 
        key.includes('supabase') || key.includes('auth') || key.includes('token')
      );
      
      authKeys.forEach(key => {
        localStorage.removeItem(key);
      });
      
      // Clear sessionStorage
      sessionStorage.clear();
      
      console.log('Authentication data cleared');
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  }

  /**
   * Get authentication status
   */
  async getAuthStatus() {
    const { session, user } = await this.getCurrentSession();
    const token = await this.getAccessToken();
    const tokenInfo = this.analyzeToken(token);

    return {
      isAuthenticated: !!user,
      user,
      session,
      token: tokenInfo,
      needsRefresh: tokenInfo.isValid && tokenInfo.isExpired
    };
  }
}

export const authService = AuthService.getInstance();
