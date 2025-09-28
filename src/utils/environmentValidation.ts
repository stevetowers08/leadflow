// Environment validation and error handling
export interface EnvironmentConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  googleClientId?: string;
  isValid: boolean;
  errors: string[];
}

export function validateEnvironment(): EnvironmentConfig {
  const errors: string[] = [];
  
  // Safely check for required CLIENT-SIDE environment variables only
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

  // Only validate if we have values to validate
  if (supabaseUrl) {
    if (!supabaseUrl.startsWith('https://') || !supabaseUrl.includes('.supabase.co')) {
      errors.push('VITE_SUPABASE_URL must be a valid Supabase URL');
    }
  } else {
    errors.push('VITE_SUPABASE_URL is required');
  }

  if (supabaseAnonKey) {
    if (!supabaseAnonKey.startsWith('eyJ')) {
      errors.push('VITE_SUPABASE_ANON_KEY appears to be invalid');
    }
  } else {
    errors.push('VITE_SUPABASE_ANON_KEY is required');
  }

  // Service role key should NOT be exposed to client-side
  // It's only used server-side and should not be validated here

  // Google client ID is optional
  if (googleClientId && !googleClientId.includes('.apps.googleusercontent.com')) {
    errors.push('VITE_GOOGLE_CLIENT_ID appears to be invalid');
  }

  return {
    supabaseUrl,
    supabaseAnonKey,
    googleClientId,
    isValid: errors.length === 0,
    errors
  };
}

export function logEnvironmentStatus(): void {
  const config = validateEnvironment();
  
  console.group('🔧 Environment Configuration');
  console.log('Supabase URL:', config.supabaseUrl ? '✅ Set' : '❌ Missing');
  console.log('Supabase Anon Key:', config.supabaseAnonKey ? '✅ Set' : '❌ Missing');
  console.log('Google Client ID:', config.googleClientId ? '✅ Set' : '❌ Missing');
  console.log('ℹ️ Service Role Key: Not exposed to client-side (server-only)');
  
  if (!config.isValid) {
    console.error('❌ Environment validation failed:');
    config.errors.forEach(error => console.error(`  - ${error}`));
  } else {
    console.log('✅ All environment variables are valid');
  }
  console.groupEnd();
}

// Error handling utilities
export function handleSupabaseError(error: any, context: string): void {
  console.group(`🚨 Supabase Error in ${context}`);
  console.error('Error:', error);
  
  if (error?.code) {
    console.error('Error Code:', error.code);
  }
  
  if (error?.message) {
    console.error('Error Message:', error.message);
  }
  
  if (error?.details) {
    console.error('Error Details:', error.details);
  }
  
  if (error?.hint) {
    console.error('Error Hint:', error.hint);
  }
  
  console.groupEnd();
}

// Safe async wrapper for Supabase operations
export async function safeSupabaseOperation<T>(
  operation: () => Promise<T>,
  context: string,
  fallback?: T
): Promise<T | null> {
  try {
    return await operation();
  } catch (error) {
    handleSupabaseError(error, context);
    return fallback || null;
  }
}
