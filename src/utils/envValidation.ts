/**
 * Environment variable validation utility
 * Ensures all required environment variables are present
 */

interface RequiredEnvVars {
  // Supabase
  VITE_SUPABASE_URL: string;
  VITE_SUPABASE_ANON_KEY: string;
  
  // Google OAuth (optional for Gmail integration)
  VITE_GOOGLE_CLIENT_ID?: string;
  
  // LinkedIn (optional for LinkedIn integration)
  LINKEDIN_CLIENT_ID?: string;
  LINKEDIN_REDIRECT_URI?: string;
}

interface ValidationResult {
  isValid: boolean;
  missingVars: string[];
  warnings: string[];
}

/**
 * Validates required environment variables
 */
export function validateEnvironment(): ValidationResult {
  const missingVars: string[] = [];
  const warnings: string[] = [];

  // Required variables
  const requiredVars: (keyof RequiredEnvVars)[] = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY'
  ];

  // Check required variables
  for (const varName of requiredVars) {
    if (!import.meta.env[varName]) {
      missingVars.push(varName);
    }
  }

  // Check optional but recommended variables
  if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) {
    warnings.push('VITE_GOOGLE_CLIENT_ID not set - Gmail integration will be disabled');
  }

  if (!import.meta.env.LINKEDIN_CLIENT_ID || !import.meta.env.LINKEDIN_REDIRECT_URI) {
    warnings.push('LinkedIn environment variables not set - LinkedIn integration will be disabled');
  }

  return {
    isValid: missingVars.length === 0,
    missingVars,
    warnings
  };
}

/**
 * Validates Supabase configuration specifically
 */
export function validateSupabaseConfig(): { isValid: boolean; error?: string } {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!url) {
    return { isValid: false, error: 'VITE_SUPABASE_URL is required' };
  }

  if (!key) {
    return { isValid: false, error: 'VITE_SUPABASE_ANON_KEY is required' };
  }

  // Basic URL validation
  try {
    new URL(url);
  } catch {
    return { isValid: false, error: 'VITE_SUPABASE_URL is not a valid URL' };
  }

  // Basic key validation (should be a JWT)
  if (!key.includes('.')) {
    return { isValid: false, error: 'VITE_SUPABASE_ANON_KEY appears to be invalid' };
  }

  return { isValid: true };
}

/**
 * Logs environment validation results
 */
export function logEnvironmentStatus(): void {
  const validation = validateEnvironment();
  
  if (!validation.isValid) {
    console.error('❌ Environment validation failed:');
    validation.missingVars.forEach(varName => {
      console.error(`  - Missing: ${varName}`);
    });
  } else {
    console.log('✅ Environment validation passed');
  }

  if (validation.warnings.length > 0) {
    console.warn('⚠️ Environment warnings:');
    validation.warnings.forEach(warning => {
      console.warn(`  - ${warning}`);
    });
  }
}

/**
 * Gets environment variable with fallback and validation
 */
export function getEnvVar(name: string, fallback?: string): string {
  const value = import.meta.env[name] || fallback;
  
  if (!value) {
    throw new Error(`Environment variable ${name} is required but not set`);
  }
  
  return value;
}

/**
 * Gets optional environment variable
 */
export function getOptionalEnvVar(name: string, fallback?: string): string | undefined {
  return import.meta.env[name] || fallback;
}
