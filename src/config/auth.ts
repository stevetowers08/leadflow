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
 * Supports bypass via:
 * 1. Environment variable: NEXT_PUBLIC_BYPASS_AUTH=true
 * 2. URL query parameter: ?bypass=true (stored in localStorage) - FOR FUTURE USE
 */
export const getAuthConfig = (): AuthConfig => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const envBypass = process.env.NEXT_PUBLIC_BYPASS_AUTH === 'true';

  // FUTURE: URL parameter support (currently disabled - will be enabled in future)
  // Check URL parameter (client-side only)
  let urlBypass = false;
  // Disabled for now - uncomment to enable URL parameter bypass
  // if (typeof window !== 'undefined') {
  //   const urlParams = new URLSearchParams(window.location.search);
  //   if (urlParams.get('bypass') === 'true') {
  //     urlBypass = true;
  //     // Store in localStorage for future sessions
  //     localStorage.setItem('bypassAuth', 'true');
  //   }
  // }

  // Check localStorage for persisted bypass
  let storedBypass = false;
  if (typeof window !== 'undefined') {
    storedBypass = localStorage.getItem('bypassAuth') === 'true';
    urlBypass = urlBypass || storedBypass;
  }

  // Bypass if env var OR URL param/localStorage is set
  const shouldBypass = envBypass || urlBypass;

  // Debug logging removed - only log in verbose mode via NEXT_PUBLIC_VERBOSE_LOGS

  return {
    bypassAuth: shouldBypass,
    mockUser: {
      id:
        process.env.NEXT_PUBLIC_MOCK_USER_ID ||
        '8fecfbaf-34e3-4106-9dd8-2cadeadea100',
      email: process.env.NEXT_PUBLIC_MOCK_USER_EMAIL || 'test@example.com',
      // FUTURE: Default to 'admin' when bypassing - currently uses 'owner'
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
 * Clear bypass auth (useful for testing)
 */
export const clearBypassAuth = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('bypassAuth');
    // Reload to apply changes
    window.location.href = window.location.pathname;
  }
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
