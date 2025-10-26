/**
 * Development Validation Hook
 *
 * Provides runtime validation utilities for development mode
 */

import { devValidation } from '@/utils/runtimeValidation';
import { useEffect } from 'react';

/**
 * Hook for validating component props in development mode
 */
export function useDevValidation(
  componentName: string,
  props: Record<string, unknown>,
  validationConfig?: {
    requiredProps?: string[];
    propTypes?: Record<string, string>;
  }
) {
  useEffect(() => {
    if (import.meta.env.NODE_ENV !== 'development') return;

    if (validationConfig?.requiredProps) {
      devValidation.validateComponentProps(
        componentName,
        props,
        validationConfig.requiredProps
      );
    }

    if (validationConfig?.propTypes) {
      devValidation.validatePropTypes(
        componentName,
        props,
        validationConfig.propTypes
      );
    }
  }, [componentName, props, validationConfig]);
}

/**
 * Hook for running development validation checks
 */
export function useDevValidationRunner() {
  useEffect(() => {
    if (import.meta.env.NODE_ENV !== 'development') return;

    // Run validation checks on component mount in development
    devValidation.runDevValidation();
  }, []);
}

/**
 * Hook for validating data consistency
 */
export function useDataValidation(
  data: Record<string, unknown>,
  validationRules?: {
    required?: string[];
    types?: Record<string, string>;
    custom?: (data: Record<string, unknown>) => boolean;
  }
) {
  useEffect(() => {
    if (import.meta.env.NODE_ENV !== 'development') return;
    if (!validationRules) return;

    // Validate required fields
    if (validationRules.required) {
      const missingFields = validationRules.required.filter(
        field =>
          !(field in data) || data[field] === undefined || data[field] === null
      );

      if (missingFields.length > 0) {
        console.warn(`⚠️ Missing required fields: ${missingFields.join(', ')}`);
      }
    }

    // Validate field types
    if (validationRules.types) {
      const typeErrors = Object.entries(validationRules.types).filter(
        ([field, expectedType]) => {
          if (!(field in data)) return false;
          return typeof data[field] !== expectedType;
        }
      );

      if (typeErrors.length > 0) {
        console.warn(
          `⚠️ Type errors:`,
          typeErrors.map(
            ([field, expected]) =>
              `${field} (expected ${expected}, got ${typeof data[field]})`
          )
        );
      }
    }

    // Run custom validation
    if (validationRules.custom) {
      try {
        const isValid = validationRules.custom(data);
        if (!isValid) {
          console.warn(`⚠️ Custom validation failed for data:`, data);
        }
      } catch (error) {
        console.warn(`⚠️ Custom validation error:`, error);
      }
    }
  }, [data, validationRules]);
}
