import { authService } from '@/services/authService';

export interface AuthDebugInfo {
  timestamp: string;
  isAuthenticated: boolean;
  user: any;
  session: any;
  tokenInfo: any;
  localStorage: Record<string, any>;
  sessionStorage: Record<string, any>;
  urlParams: Record<string, string>;
  errors: string[];
}

export class AuthDebugger {
  /**
   * Run comprehensive authentication debugging
   */
  static async runFullDiagnostic(): Promise<AuthDebugInfo> {
    const errors: string[] = [];
    const timestamp = new Date().toISOString();

    try {
      // Get authentication status
      const authStatus = await authService.getAuthStatus();
      
      // Check localStorage
      const localStorage: Record<string, any> = {};
      Object.keys(localStorage).forEach(key => {
        if (key.includes('supabase') || key.includes('auth') || key.includes('token')) {
          localStorage[key] = localStorage.getItem(key);
        }
      });

      // Check sessionStorage
      const sessionStorage: Record<string, any> = {};
      Object.keys(sessionStorage).forEach(key => {
        sessionStorage[key] = sessionStorage.getItem(key);
      });

      // Check URL parameters
      const urlParams: Record<string, string> = {};
      const url = new URL(window.location.href);
      const authParams = ['code', 'state', 'error', 'error_description', 'access_token', 'refresh_token'];
      authParams.forEach(param => {
        if (url.searchParams.has(param)) {
          urlParams[param] = url.searchParams.get(param) || '';
        }
      });

      // Validate token
      if (authStatus.token) {
        if (!authStatus.token.isValid) {
          errors.push('JWT token is malformed or invalid');
        }
        if (authStatus.token.isExpired) {
          errors.push('JWT token has expired');
        }
        if (!authStatus.token.userId) {
          errors.push('JWT token missing user ID');
        }
        if (!authStatus.token.email) {
          errors.push('JWT token missing email');
        }
      } else {
        errors.push('No JWT token found');
      }

      // Check session persistence
      if (!authStatus.isAuthenticated) {
        errors.push('User is not authenticated');
      }

      // Check for auth bypass
      if (localStorage['auth_bypass'] || sessionStorage['auth_bypass']) {
        errors.push('Authentication bypass detected - this should not be in production');
      }

      return {
        timestamp,
        isAuthenticated: authStatus.isAuthenticated,
        user: authStatus.user,
        session: authStatus.session,
        tokenInfo: authStatus.token,
        localStorage,
        sessionStorage,
        urlParams,
        errors
      };

    } catch (error) {
      errors.push(`Debug error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      return {
        timestamp,
        isAuthenticated: false,
        user: null,
        session: null,
        tokenInfo: null,
        localStorage: {},
        sessionStorage: {},
        urlParams: {},
        errors
      };
    }
  }

  /**
   * Log authentication debug info to console
   */
  static async logDebugInfo(): Promise<void> {
    const debugInfo = await this.runFullDiagnostic();
    
    console.group('🔍 Authentication Debug Info');
    console.log('Timestamp:', debugInfo.timestamp);
    console.log('Authenticated:', debugInfo.isAuthenticated);
    console.log('User:', debugInfo.user);
    console.log('Session:', debugInfo.session);
    console.log('Token Info:', debugInfo.tokenInfo);
    console.log('LocalStorage Auth Items:', debugInfo.localStorage);
    console.log('SessionStorage Auth Items:', debugInfo.sessionStorage);
    console.log('URL Auth Params:', debugInfo.urlParams);
    
    if (debugInfo.errors.length > 0) {
      console.group('❌ Errors Found');
      debugInfo.errors.forEach(error => console.error(error));
      console.groupEnd();
    } else {
      console.log('✅ No errors found');
    }
    
    console.groupEnd();
  }

  /**
   * Check if authentication is working properly
   */
  static async isAuthWorking(): Promise<boolean> {
    const debugInfo = await this.runFullDiagnostic();
    return debugInfo.isAuthenticated && debugInfo.errors.length === 0;
  }

  /**
   * Get authentication health score (0-100)
   */
  static async getAuthHealthScore(): Promise<number> {
    const debugInfo = await this.runFullDiagnostic();
    let score = 100;

    // Deduct points for each issue
    if (!debugInfo.isAuthenticated) score -= 50;
    if (!debugInfo.tokenInfo?.isValid) score -= 30;
    if (debugInfo.tokenInfo?.isExpired) score -= 20;
    if (debugInfo.errors.length > 0) score -= debugInfo.errors.length * 10;

    return Math.max(0, score);
  }

  /**
   * Export debug info as JSON
   */
  static async exportDebugInfo(): Promise<string> {
    const debugInfo = await this.runFullDiagnostic();
    return JSON.stringify(debugInfo, null, 2);
  }
}

// Make it available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).authDebugger = AuthDebugger;
}
