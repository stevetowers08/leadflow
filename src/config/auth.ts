/**
 * Authentication Configuration
 *
 * Centralized configuration for authentication behavior
 * Easy to switch between authenticated and bypass modes
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
 */
export const getAuthConfig = (): AuthConfig => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const bypassAuth = process.env.NEXT_PUBLIC_BYPASS_AUTH === 'true';

  // Force bypass in development for now, or when explicitly enabled in production
  // For demo purposes, always bypass in production
  const shouldBypass =
    isDevelopment || bypassAuth || process.env.NODE_ENV === 'production';

  // Debug logging removed - only log in verbose mode via NEXT_PUBLIC_VERBOSE_LOGS

  return {
    bypassAuth: shouldBypass,
    mockUser: {
      id:
        process.env.NEXT_PUBLIC_MOCK_USER_ID ||
        '8fecfbaf-34e3-4106-9dd8-2cadeadea100',
      email: process.env.NEXT_PUBLIC_MOCK_USER_EMAIL || 'test@example.com',
      role: process.env.NEXT_PUBLIC_MOCK_USER_ROLE || 'owner',
      full_name: process.env.NEXT_PUBLIC_MOCK_USER_NAME || 'Test User',
    },
    environments: {
      development: isDevelopment,
      production: process.env.NODE_ENV === 'production',
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
 * Get mock user data
 */
export const getMockUser = () => {
  const config = getAuthConfig();
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
 */
export const getMockUserProfile = () => {
  const config = getAuthConfig();
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
