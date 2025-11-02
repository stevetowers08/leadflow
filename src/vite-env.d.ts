/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly MODE: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly SSR: boolean;
  // Next.js compatibility - NEXT_PUBLIC_* variables
  readonly NEXT_PUBLIC_SUPABASE_URL?: string;
  readonly NEXT_PUBLIC_SUPABASE_ANON_KEY?: string;
  readonly NEXT_PUBLIC_GOOGLE_CLIENT_ID?: string;
  readonly NEXT_PUBLIC_BYPASS_AUTH?: string;
  readonly NEXT_PUBLIC_ADMIN_EMAIL?: string;
  readonly NEXT_PUBLIC_MOCK_USER_ID?: string;
  readonly NEXT_PUBLIC_MOCK_USER_EMAIL?: string;
  readonly NEXT_PUBLIC_MOCK_USER_ROLE?: string;
  readonly NEXT_PUBLIC_MOCK_USER_NAME?: string;
  readonly NEXT_PUBLIC_VERBOSE_LOGS?: string;
  readonly NEXT_PUBLIC_SITE_URL?: string;
  readonly NEXT_PUBLIC_HUBSPOT_CLIENT_ID?: string;
  readonly NEXT_PUBLIC_HUBSPOT_CLIENT_SECRET?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
