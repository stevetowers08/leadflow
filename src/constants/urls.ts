/**
 * URL Constants
 * Centralized URL definitions for API endpoints and external services
 * Use environment variables where possible, provide sensible defaults
 */

// Base URLs
export const API_URLS = {
  // Google APIs
  GOOGLE_OAUTH: 'https://accounts.google.com/o/oauth2/v2/auth',
  GOOGLE_TOKEN: 'https://oauth2.googleapis.com/token',
  GOOGLE_USERINFO: 'https://www.googleapis.com/oauth2/v2/userinfo',
  GMAIL_API: 'https://gmail.googleapis.com/gmail/v1',
  GEMINI_API: 'https://generativelanguage.googleapis.com/v1beta',

  // Third-party services
  RETELL_AI: 'https://api.retellai.com/v2',
  TWILIO: (accountSid: string) =>
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}`,
  RESEND_API: 'https://api.resend.com',
  OPENAI_API: 'https://api.openai.com/v1',

  // Logo services
  LOGO_DEV: (domain: string, apiKey: string) =>
    `https://img.logo.dev/${domain}?apikey=${apiKey}`,
  CLEARBIT_LOGO: (domain: string) => `https://logo.clearbit.com/${domain}`,
  // Brandfetch CDN - direct hotlinking (recommended by Brandfetch)
  // Format: https://cdn.brandfetch.io/{domain}?c={clientId}
  BRANDFETCH_LOGO: (domain: string, clientId?: string) => {
    const baseUrl = `https://cdn.brandfetch.io/${domain}`;
    return clientId ? `${baseUrl}?c=${clientId}` : baseUrl;
  },
  UI_AVATARS: (name: string, size: number, bg: string, color: string) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=${size}&background=${bg}&color=${color}&format=png`,
} as const;

// Site URL helpers
export const getSiteUrl = (): string => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) {
    if (process.env.NODE_ENV === 'development') {
      return 'http://localhost:3000';
    }
    throw new Error(
      'NEXT_PUBLIC_SITE_URL environment variable is required in production'
    );
  }
  return siteUrl;
};

// Callback URL helpers
export const getCallbackUrl = (type: 'gmail' | 'invite' = 'gmail'): string => {
  const siteUrl = getSiteUrl();
  const path =
    type === 'gmail' ? '/auth/gmail-callback' : '/auth/callback?type=invite';
  return `${siteUrl}${path}`;
};

// Gmail OAuth scopes
export const GMAIL_SCOPES = [
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.readonly',
].join(' ');
