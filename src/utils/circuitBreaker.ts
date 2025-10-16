/**
 * Circuit Breaker Pattern Implementation
 * Provides fault tolerance for external service calls
 */

import {
  CircuitBreakerState,
  CircuitBreakerConfig,
  Result,
  ResultBuilder,
  AppError,
  ErrorType,
  ErrorSeverity,
  ErrorCategory,
  ErrorFactory,
} from '@/types/errors';

export class CircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private state: CircuitBreakerState = CircuitBreakerState.CLOSED;
  private nextAttemptTime = 0;

  constructor(
    private config: CircuitBreakerConfig = {
      failureThreshold: 5,
      timeout: 60000, // 1 minute
      monitoringPeriod: 300000, // 5 minutes
    }
  ) {}

  async execute<T>(
    operation: () => Promise<T>,
    operationName: string = 'unknown'
  ): Promise<Result<T, AppError>> {
    // Check if circuit breaker should allow the operation
    if (this.state === CircuitBreakerState.OPEN) {
      if (Date.now() - this.lastFailureTime > this.config.timeout) {
        this.state = CircuitBreakerState.HALF_OPEN;
        this.nextAttemptTime = Date.now();
      } else {
        const error = ErrorFactory.create(
          ErrorType.EXTERNAL_SERVICE_ERROR,
          'CIRCUIT_BREAKER_OPEN',
          `Circuit breaker is OPEN for ${operationName}`,
          'Service is temporarily unavailable. Please try again later.',
          {
            severity: ErrorSeverity.HIGH,
            category: ErrorCategory.EXTERNAL_SERVICE,
            context: {
              operation: operationName,
              state: this.state,
              failures: this.failures,
              lastFailureTime: this.lastFailureTime,
            },
          }
        );
        return ResultBuilder.failure(error);
      }
    }

    try {
      const result = await operation();
      this.onSuccess();
      return ResultBuilder.success(result);
    } catch (error) {
      this.onFailure();

      // Convert error to AppError if it isn't already
      const appError =
        error instanceof Error && 'type' in error
          ? (error as AppError)
          : ErrorFactory.fromError(
              error as Error,
              ErrorType.EXTERNAL_SERVICE_ERROR
            );

      return ResultBuilder.failure(appError);
    }
  }

  private onSuccess(): void {
    this.failures = 0;
    this.state = CircuitBreakerState.CLOSED;
  }

  private onFailure(): void {
    this.failures++;
    this.lastFailureTime = Date.now();

    if (this.failures >= this.config.failureThreshold) {
      this.state = CircuitBreakerState.OPEN;
      this.nextAttemptTime = Date.now() + this.config.timeout;
    }
  }

  getState(): CircuitBreakerState {
    return this.state;
  }

  getFailureCount(): number {
    return this.failures;
  }

  getLastFailureTime(): number {
    return this.lastFailureTime;
  }

  reset(): void {
    this.failures = 0;
    this.state = CircuitBreakerState.CLOSED;
    this.lastFailureTime = 0;
    this.nextAttemptTime = 0;
  }

  isOpen(): boolean {
    return this.state === CircuitBreakerState.OPEN;
  }

  isHalfOpen(): boolean {
    return this.state === CircuitBreakerState.HALF_OPEN;
  }

  isClosed(): boolean {
    return this.state === CircuitBreakerState.CLOSED;
  }
}

// Circuit breaker manager for multiple services
export class CircuitBreakerManager {
  private breakers = new Map<string, CircuitBreaker>();

  getBreaker(
    serviceName: string,
    config?: CircuitBreakerConfig
  ): CircuitBreaker {
    if (!this.breakers.has(serviceName)) {
      this.breakers.set(serviceName, new CircuitBreaker(config));
    }
    return this.breakers.get(serviceName)!;
  }

  async executeWithBreaker<T>(
    serviceName: string,
    operation: () => Promise<T>,
    operationName?: string,
    config?: CircuitBreakerConfig
  ): Promise<Result<T, AppError>> {
    const breaker = this.getBreaker(serviceName, config);
    return breaker.execute(operation, operationName);
  }

  getBreakerState(serviceName: string): CircuitBreakerState | null {
    const breaker = this.breakers.get(serviceName);
    return breaker ? breaker.getState() : null;
  }

  resetBreaker(serviceName: string): void {
    const breaker = this.breakers.get(serviceName);
    if (breaker) {
      breaker.reset();
    }
  }

  getAllBreakerStates(): Record<string, CircuitBreakerState> {
    const states: Record<string, CircuitBreakerState> = {};
    for (const [name, breaker] of this.breakers) {
      states[name] = breaker.getState();
    }
    return states;
  }
}

// Singleton instance for global circuit breaker management
export const circuitBreakerManager = new CircuitBreakerManager();
