import * as React from 'react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { designTokens } from '@/design-system/tokens';

export interface FieldWrapperProps {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
  labelClassName?: string;
  htmlFor?: string;
  description?: string;
}

/**
 * FieldWrapper - A simple wrapper component for form fields
 * Works alongside shadcn's FormField (react-hook-form) for simpler use cases
 * Uses Radix UI Label primitive for accessibility
 */
export const FieldWrapper = React.forwardRef<HTMLDivElement, FieldWrapperProps>(
  (
    {
      label,
      error,
      hint,
      description,
      required,
      children,
      className,
      labelClassName,
      htmlFor,
    },
    ref
  ) => {
    const generatedId = React.useId();
    const fieldId = htmlFor || generatedId;
    
    return (
      <div ref={ref} className={cn('space-y-2', className)}>
        {label && (
          <Label
            htmlFor={fieldId}
            className={cn(
              error && 'text-destructive',
              labelClassName
            )}
          >
            {label}
            {required && (
              <span className="text-destructive ml-1" aria-label="required">
                *
              </span>
            )}
          </Label>
        )}
        {description && !error && (
          <p
            className={cn(
              'text-sm text-muted-foreground',
              designTokens.typography.body.small
            )}
            id={`${fieldId}-description`}
          >
            {description}
          </p>
        )}
        {React.isValidElement(children) 
          ? React.cloneElement(children, { 
              id: fieldId,
              'aria-describedby': description ? `${fieldId}-description` : undefined,
              'aria-invalid': error ? true : undefined,
            } as any)
          : children}
        {error && (
          <p
            className={cn(
              'text-sm font-medium text-destructive',
              designTokens.typography.body.small
            )}
            role="alert"
            aria-live="polite"
            id={`${fieldId}-error`}
          >
            {error}
          </p>
        )}
        {hint && !error && !description && (
          <p
            className={cn(
              'text-sm text-muted-foreground',
              designTokens.typography.body.small
            )}
          >
            {hint}
          </p>
        )}
      </div>
    );
  }
);
FieldWrapper.displayName = 'FieldWrapper';

// Export as FormFieldWrapper for clarity, but keep FieldWrapper as main export
export const FormFieldWrapper = FieldWrapper;

