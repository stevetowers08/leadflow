/**
 * Enhanced Error Handling Types for 2025
 * Implements modern error handling patterns with Result types and comprehensive error classification
 */

// Result type pattern for functional error handling
export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

// Enhanced error classification system
export enum ErrorType {
  // Expected errors (business logic)
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  BUSINESS_RULE_VIOLATION = 'BUSINESS_RULE_VIOLATION',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  USER_INPUT_ERROR = 'USER_INPUT_ERROR',

  // Unexpected errors (system issues)
  NETWORK_ERROR = 'NETWORK_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  SYSTEM_ERROR = 'SYSTEM_ERROR',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',

  // UI/UX errors
  RENDER_ERROR = 'RENDER_ERROR',
  COMPONENT_ERROR = 'COMPONENT_ERROR',
  STATE_ERROR = 'STATE_ERROR',
}

export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum ErrorCategory {
  AUTHENTICATION = 'authentication',
  DATABASE = 'database',
  NETWORK = 'network',
  VALIDATION = 'validation',
  UI = 'ui',
  BUSINESS_LOGIC = 'business_logic',
  EXTERNAL_SERVICE = 'external_service',
  UNKNOWN = 'unknown',
}

export interface AppError {
  type: ErrorType;
  code: string;
  message: string;
  userMessage: string;
  recoverable: boolean;
  severity: ErrorSeverity;
  category: ErrorCategory;
  context?: Record<string, any>;
  timestamp: Date;
  stack?: string;
  originalError?: Error;
}

export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  sessionId?: string;
  userAgent?: string;
  url?: string;
  metadata?: Record<string, any>;
  timestamp?: Date;
}

// Result builder utility class
export class ResultBuilder {
  static success<T>(data: T): Result<T> {
    return { success: true, data };
  }

  static failure<E>(error: E): Result<never, E> {
    return { success: false, error };
  }

  static async fromPromise<T>(promise: Promise<T>): Promise<Result<T, Error>> {
    try {
      const data = await promise;
      return ResultBuilder.success(data);
    } catch (error) {
      return ResultBuilder.failure(error as Error);
    }
  }

  static fromValue<T>(
    value: T | null | undefined,
    errorMessage: string
  ): Result<T> {
    if (value === null || value === undefined) {
      return ResultBuilder.failure(new Error(errorMessage));
    }
    return ResultBuilder.success(value);
  }
}

// Error factory for creating consistent AppError instances
export class ErrorFactory {
  static create(
    type: ErrorType,
    code: string,
    message: string,
    userMessage: string,
    options: {
      recoverable?: boolean;
      severity?: ErrorSeverity;
      category?: ErrorCategory;
      context?: Record<string, any>;
      originalError?: Error;
    } = {}
  ): AppError {
    return {
      type,
      code,
      message,
      userMessage,
      recoverable: options.recoverable ?? true,
      severity: options.severity ?? ErrorSeverity.MEDIUM,
      category: options.category ?? ErrorCategory.UNKNOWN,
      context: options.context,
      timestamp: new Date(),
      stack: options.originalError?.stack,
      originalError: options.originalError,
    };
  }

  static fromError(
    error: Error,
    type: ErrorType = ErrorType.SYSTEM_ERROR
  ): AppError {
    return ErrorFactory.create(
      type,
      'UNKNOWN_ERROR',
      error.message,
      'Something went wrong. Please try again.',
      {
        originalError: error,
        severity: ErrorSeverity.MEDIUM,
        recoverable: true,
      }
    );
  }
}

// Circuit breaker states
export enum CircuitBreakerState {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
  HALF_OPEN = 'HALF_OPEN',
}

export interface CircuitBreakerConfig {
  failureThreshold: number;
  timeout: number;
  monitoringPeriod: number;
}

// Retry configuration
export interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
  jitter: boolean;
}

// Error monitoring configuration
export interface ErrorMonitoringConfig {
  enableConsoleLogging: boolean;
  enableRemoteLogging: boolean;
  enableAlerts: boolean;
  alertThresholds: Record<ErrorSeverity, number>;
  samplingRate: number;
}

// Type guards for Result types
export function isSuccess<T, E>(
  result: Result<T, E>
): result is { success: true; data: T } {
  return result.success === true;
}

export function isFailure<T, E>(
  result: Result<T, E>
): result is { success: false; error: E } {
  return result.success === false;
}

// Utility functions for working with Results
export function mapResult<T, U, E>(
  result: Result<T, E>,
  mapper: (data: T) => U
): Result<U, E> {
  if (isSuccess(result)) {
    try {
      return ResultBuilder.success(mapper(result.data));
    } catch (error) {
      return ResultBuilder.failure(error as E);
    }
  }
  return result;
}

export function flatMapResult<T, U, E>(
  result: Result<T, E>,
  mapper: (data: T) => Result<U, E>
): Result<U, E> {
  if (isSuccess(result)) {
    return mapper(result.data);
  }
  return result;
}

export function getOrElse<T, E>(result: Result<T, E>, defaultValue: T): T {
  return isSuccess(result) ? result.data : defaultValue;
}

export function getOrThrow<T, E>(result: Result<T, E>): T {
  if (isSuccess(result)) {
    return result.data;
  }
  throw result.error;
}
