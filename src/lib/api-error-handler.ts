/**
 * Centralized API Error Handling for Next.js API Routes
 * Following Next.js 16 best practices
 */

import { NextResponse } from 'next/server';

export interface APIError {
  message: string;
  code?: string;
  details?: unknown;
}

export class APIErrorHandler {
  /**
   * Handle and format errors for API responses
   */
  static handleError(error: unknown, context?: string): NextResponse<APIError> {
    // Only log errors in development or if they're unexpected
    if (process.env.NODE_ENV === 'development') {
      console.error(`API Error${context ? ` in ${context}` : ''}:`, error);
    }

    // Known error types
    if (error instanceof Error) {
      // Validation errors
      if (error.name === 'ValidationError') {
        return NextResponse.json(
          {
            error: error.message,
            code: 'VALIDATION_ERROR',
          },
          { status: 400 }
        );
      }

      // Authentication errors
      if (error.message.includes('Unauthorized') || error.message.includes('authentication')) {
        return NextResponse.json(
          {
            error: 'Unauthorized',
            code: 'UNAUTHORIZED',
          },
          { status: 401 }
        );
      }

      // Not found errors
      if (error.message.includes('Not found') || error.message.includes('not found')) {
        return NextResponse.json(
          {
            error: error.message,
            code: 'NOT_FOUND',
          },
          { status: 404 }
        );
      }

      // Generic error
      return NextResponse.json(
        {
          error: error.message,
          code: 'INTERNAL_ERROR',
        },
        { status: 500 }
      );
    }

    // Unknown error type
    return NextResponse.json(
      {
        error: 'Internal server error',
        code: 'UNKNOWN_ERROR',
      },
      { status: 500 }
    );
  }

  /**
   * Validate required environment variables
   */
  static validateEnvVars(required: string[]): { missing: string[]; allPresent: boolean } {
    const missing = required.filter(key => !process.env[key]);

    if (missing.length > 0) {
      console.error('Missing environment variables:', missing);
    }

    return {
      missing,
      allPresent: missing.length === 0,
    };
  }

  /**
   * Validate request body structure
   */
  static validateBody<T>(body: unknown, validator: (body: unknown) => body is T): {
    valid: boolean;
    data?: T;
    error?: string;
  } {
    try {
      if (!validator(body)) {
        return {
          valid: false,
          error: 'Invalid request body structure',
        };
      }
      return {
        valid: true,
        data: body,
      };
    } catch (error) {
      return {
        valid: false,
        error: error instanceof Error ? error.message : 'Validation failed',
      };
    }
  }
}


