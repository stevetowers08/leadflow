// Environment validation and error handling
export interface EnvironmentConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  googleClientId?: string;
  tokenEncryptionKey?: boolean; // Server-side only, check existence
  gmailPubsubTopic?: boolean; // Server-side only, check existence
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validate CLIENT-SIDE environment variables only
 * Server-side variables should be validated in API routes
 */
export function validateEnvironment(): EnvironmentConfig {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Safely check for required CLIENT-SIDE environment variables only
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

  // Only validate if we have values to validate
  if (supabaseUrl) {
    if (
      !supabaseUrl.startsWith('https://') ||
      !supabaseUrl.includes('.supabase.co')
    ) {
      errors.push('NEXT_PUBLIC_SUPABASE_URL must be a valid Supabase URL');
    }
  } else {
    errors.push('NEXT_PUBLIC_SUPABASE_URL is required');
  }

  if (supabaseAnonKey) {
    if (!supabaseAnonKey.startsWith('eyJ')) {
      errors.push('NEXT_PUBLIC_SUPABASE_ANON_KEY appears to be invalid');
    }
  } else {
    errors.push('NEXT_PUBLIC_SUPABASE_ANON_KEY is required');
  }

  // Google client ID is optional
  if (
    googleClientId &&
    !googleClientId.includes('.apps.googleusercontent.com')
  ) {
    warnings.push('NEXT_PUBLIC_GOOGLE_CLIENT_ID appears to be invalid');
  }

  // Server-side variables cannot be checked here (process.env access)
  // They are validated at runtime when used in API routes

  return {
    supabaseUrl,
    supabaseAnonKey,
    googleClientId,
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate SERVER-SIDE environment variables
 * Use this in API routes and server components
 */
export function validateServerEnvironment(): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check required server-side variables
  const tokenEncryptionKey = process.env.TOKEN_ENCRYPTION_KEY;
  if (!tokenEncryptionKey) {
    errors.push(
      'TOKEN_ENCRYPTION_KEY is required for token encryption (server-side)'
    );
  }

  // Gmail Pub/Sub topic is required for Gmail watch functionality
  const gmailPubsubTopic = process.env.GMAIL_PUBSUB_TOPIC;
  if (!gmailPubsubTopic) {
    warnings.push(
      'GMAIL_PUBSUB_TOPIC is recommended for Gmail watch functionality (server-side)'
    );
  }

  // Validate format if set
  if (gmailPubsubTopic && !gmailPubsubTopic.startsWith('projects/')) {
    errors.push(
      'GMAIL_PUBSUB_TOPIC must be in format: projects/{PROJECT_ID}/topics/{TOPIC_NAME}'
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

export function logEnvironmentStatus(): void {
  // Only log in development
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  const config = validateEnvironment();

  console.group('🔧 Environment Configuration (Client-Side)');
  console.log('Supabase URL:', config.supabaseUrl ? '✅ Set' : '❌ Missing');
  console.log(
    'Supabase Anon Key:',
    config.supabaseAnonKey ? '✅ Set' : '❌ Missing'
  );
  console.log(
    'Google Client ID:',
    config.googleClientId ? '✅ Set' : '❌ Missing'
  );
  console.log('ℹ️ Server-side variables: Validated at runtime in API routes');

  if (config.warnings.length > 0) {
    console.warn('⚠️ Warnings:');
    config.warnings.forEach(warning => console.warn(`  - ${warning}`));
  }

  if (!config.isValid) {
    console.error('❌ Environment validation failed:');
    config.errors.forEach(error => console.error(`  - ${error}`));
  } else {
    console.log('✅ All client-side environment variables are valid');
  }
  console.groupEnd();
}

// Error handling utilities
export function handleSupabaseError(error: any, context: string): void {
  // Only log in development
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

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
