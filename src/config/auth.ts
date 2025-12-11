/**
 * Authentication Configuration
 *
 * Centralized configuration for authentication behavior.
 * Security: Bypass is ONLY allowed in development mode by default.
 * Hardcoded user credentials below are DEV-ONLY fallbacks.
 */

export interface AuthConfig {
  bypassAuth: boolean;
  mockUser: {
    id: string;
    email: string;
    role: string;
    full_name: string;
  };
  environments: {
    development: boolean;
    production: boolean;
  };
}

/**
 * Get authentication configuration based on environment
 * 
 * Development: Bypass enabled by default (unless NEXT_PUBLIC_BYPASS_AUTH=false)
 * Production/Unknown: Bypass DISABLED for security (env vars ignored)
 * 
 * Security: Unknown environments (test, staging, etc.) default to production-like behavior
 */
export const getAuthConfig = (): AuthConfig => {
  const nodeEnv = process.env.NODE_ENV;
  const isDevelopment = nodeEnv === 'development';
  const isProduction = nodeEnv === 'production';
  const envDisableBypass = process.env.NEXT_PUBLIC_BYPASS_AUTH === 'false';

  // Security: Default to production mode for unknown environments (test, staging, etc.)
  // This prevents bypass in non-development environments
  if (!isDevelopment) {
    return {
      bypassAuth: false,
      mockUser: {
        // Empty strings are safe - mock user should never be used in production
        id: process.env.NEXT_PUBLIC_MOCK_USER_ID || '',
        email: process.env.NEXT_PUBLIC_MOCK_USER_EMAIL || '',
        role: process.env.NEXT_PUBLIC_MOCK_USER_ROLE || 'admin',
        full_name: process.env.NEXT_PUBLIC_MOCK_USER_NAME || '',
      },
      environments: {
        development: false,
        production: isProduction,
      },
    };
  }

  // Development mode: bypass by default unless explicitly disabled
  const shouldBypass = !envDisableBypass;

  return {
    bypassAuth: shouldBypass,
    mockUser: {
      // DEV-ONLY: Hardcoded fallbacks for development convenience
      // Override via env vars: NEXT_PUBLIC_MOCK_USER_*
      id:
        process.env.NEXT_PUBLIC_MOCK_USER_ID ||
        '79a2f2d5-91ff-485f-ad13-466bcc96666d', // steve@polarislabs.io (actual Supabase user ID)
      email:
        process.env.NEXT_PUBLIC_MOCK_USER_EMAIL || 'steve@polarislabs.io',
      role: process.env.NEXT_PUBLIC_MOCK_USER_ROLE || 'admin',
      full_name: process.env.NEXT_PUBLIC_MOCK_USER_NAME || 'Steve Towers',
    },
    environments: {
      development: true,
      production: false,
    },
  };
};

/**
 * Check if authentication should be bypassed
 */
export const shouldBypassAuth = (): boolean => {
  const config = getAuthConfig();
  return config.bypassAuth;
};

/**
 * Clear bypass auth (development only)
 * Note: localStorage bypass was removed for security
 */
export const clearBypassAuth = (): void => {
  // No-op: localStorage bypass removed for security
  // Use NEXT_PUBLIC_BYPASS_AUTH=false instead
};

/**
 * Get mock user data
 * 
 * Note: Should only be called when bypassAuth is true (development mode)
 * Returns empty/invalid user if called in production for safety
 */
export const getMockUser = () => {
  const config = getAuthConfig();
  
  // Safety check: if bypass is disabled, return invalid user to prevent misuse
  if (!config.bypassAuth) {
    console.warn('getMockUser() called but bypassAuth is disabled. This should not happen in production.');
    return {
      id: '',
      email: '',
      user_metadata: {},
      app_metadata: {},
      aud: 'authenticated',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      email_confirmed_at: null,
      phone: '',
      confirmed_at: null,
      last_sign_in_at: null,
      role: 'authenticated',
      factors: [],
      identities: [],
      recovery_sent_at: null,
      new_email: null,
      invited_at: null,
      action_link: null,
      email_change_sent_at: null,
      new_phone: null,
      phone_change_sent_at: null,
      reauthentication_sent_at: null,
      reauthentication_token: null,
      is_anonymous: false,
    };
  }

  return {
    id: config.mockUser.id,
    email: config.mockUser.email,
    user_metadata: {},
    app_metadata: {},
    aud: 'authenticated',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    email_confirmed_at: new Date().toISOString(),
    phone: '',
    confirmed_at: new Date().toISOString(),
    last_sign_in_at: new Date().toISOString(),
    role: 'authenticated',
    factors: [],
    identities: [],
    recovery_sent_at: null,
    new_email: null,
    invited_at: null,
    action_link: null,
    email_change_sent_at: null,
    new_phone: null,
    phone_change_sent_at: null,
    reauthentication_sent_at: null,
    reauthentication_token: null,
    is_anonymous: false,
  };
};

/**
 * Get mock user profile data
 * 
 * Note: Should only be called when bypassAuth is true (development mode)
 * Returns empty/invalid profile if called in production for safety
 */
export const getMockUserProfile = () => {
  const config = getAuthConfig();
  
  // Safety check: if bypass is disabled, return invalid profile to prevent misuse
  if (!config.bypassAuth) {
    console.warn('getMockUserProfile() called but bypassAuth is disabled. This should not happen in production.');
    return {
      id: '',
      email: '',
      full_name: '',
      role: 'admin',
      user_limit: 0,
      is_active: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  return {
    id: config.mockUser.id,
    email: config.mockUser.email,
    full_name: config.mockUser.full_name,
    role: config.mockUser.role,
    user_limit: 100,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
};
