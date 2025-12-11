import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Extracts a readable error message from various error types
 * Handles Error instances, Supabase errors, and plain objects
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (error && typeof error === 'object') {
    const err = error as Record<string, unknown>;
    // Supabase errors have message, code, details, hint
    if (err.message && typeof err.message === 'string') {
      return err.message;
    }
    if (err.code && typeof err.code === 'string') {
      return `Error ${err.code}${err.details ? `: ${err.details}` : ''}`;
    }
    if (err.error && typeof err.error === 'string') {
      return err.error;
    }
  }
  
  return String(error);
}

/**
 * Checks if a Supabase error has meaningful content
 * Returns true only if error has message, code, details, or hint with actual values
 */
export function hasSupabaseError(error: unknown): error is {
  message?: string;
  code?: string;
  details?: string;
  hint?: string;
} {
  if (!error || typeof error !== 'object') {
    return false;
  }

  const err = error as Record<string, unknown>;
  
  // Check each property exists, is a string, and is not empty
  const hasMessage = typeof err.message === 'string' && err.message.trim().length > 0;
  const hasCode = typeof err.code === 'string' && err.code.trim().length > 0;
  const hasDetails = typeof err.details === 'string' && err.details.trim().length > 0;
  const hasHint = typeof err.hint === 'string' && err.hint.trim().length > 0;
  
  // Only return true if at least one meaningful property exists
  return !!(hasMessage || hasCode || hasDetails || hasHint);
}

/**
 * Safely logs a Supabase error only if it has meaningful content
 * Prevents logging empty error objects {}
 */
export function logSupabaseError(
  error: unknown,
  context: string
): void {
  // Double-check: validate error has meaningful content before logging
  if (!hasSupabaseError(error)) {
    // Empty error object or no meaningful error - don't log
    // This can happen when Supabase returns an error object with all undefined properties
    return;
  }

  // Build error object with only defined properties
  const errorInfo: Record<string, string> = {};
  if (error.message && typeof error.message === 'string') {
    errorInfo.message = error.message;
  }
  if (error.code && typeof error.code === 'string') {
    errorInfo.code = error.code;
  }
  if (error.details && typeof error.details === 'string') {
    errorInfo.details = error.details;
  }
  if (error.hint && typeof error.hint === 'string') {
    errorInfo.hint = error.hint;
  }

  // Only log if we have at least one property
  if (Object.keys(errorInfo).length > 0) {
    console.error(`Error ${context}:`, errorInfo);
  }
}