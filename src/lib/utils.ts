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