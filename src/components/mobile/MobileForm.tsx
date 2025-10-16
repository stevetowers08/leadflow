/**
 * Mobile-Optimized Form Components
 * Provides touch-friendly form elements for mobile devices
 */

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface MobileFormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function MobileFormField({
  label,
  error,
  required = false,
  children,
  className,
}: MobileFormFieldProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <Label className='text-sm font-medium text-foreground'>
        {label}
        {required && <span className='text-destructive ml-1'>*</span>}
      </Label>
      {children}
      {error && <p className='text-sm text-destructive'>{error}</p>}
    </div>
  );
}

interface MobileInputProps extends React.ComponentProps<typeof Input> {
  label: string;
  error?: string;
  required?: boolean;
}

export function MobileInput({
  label,
  error,
  required = false,
  className,
  ...props
}: MobileInputProps) {
  return (
    <MobileFormField label={label} error={error} required={required}>
      <Input
        className={cn(
          'w-full min-h-[48px] text-base', // Larger touch target and text
          'touch-manipulation', // Better touch handling
          className
        )}
        {...props}
      />
    </MobileFormField>
  );
}

interface MobileTextareaProps extends React.ComponentProps<typeof Textarea> {
  label: string;
  error?: string;
  required?: boolean;
}

export function MobileTextarea({
  label,
  error,
  required = false,
  className,
  ...props
}: MobileTextareaProps) {
  return (
    <MobileFormField label={label} error={error} required={required}>
      <Textarea
        className={cn(
          'w-full min-h-[48px] text-base resize-none', // Larger touch target and text
          'touch-manipulation', // Better touch handling
          className
        )}
        {...props}
      />
    </MobileFormField>
  );
}

interface MobileSelectProps {
  label: string;
  error?: string;
  required?: boolean;
  placeholder?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  className?: string;
}

export function MobileSelect({
  label,
  error,
  required = false,
  placeholder = 'Select an option',
  value,
  onValueChange,
  options,
  className,
}: MobileSelectProps) {
  return (
    <MobileFormField label={label} error={error} required={required}>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger
          className={cn(
            'w-full min-h-[48px] text-base', // Larger touch target and text
            'touch-manipulation', // Better touch handling
            className
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map(option => (
            <SelectItem
              key={option.value}
              value={option.value}
              className='min-h-[44px] text-base' // Larger touch targets
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </MobileFormField>
  );
}

interface MobileButtonProps extends React.ComponentProps<typeof Button> {
  fullWidth?: boolean;
}

export function MobileButton({
  fullWidth = false,
  className,
  children,
  ...props
}: MobileButtonProps) {
  return (
    <Button
      className={cn(
        'min-h-[48px] text-base font-medium', // Larger touch target and text
        'touch-manipulation', // Better touch handling
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
}

// Mobile-optimized form layout
interface MobileFormProps {
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  className?: string;
}

export function MobileForm({ children, onSubmit, className }: MobileFormProps) {
  return (
    <form onSubmit={onSubmit} className={cn('space-y-6', className)}>
      {children}
    </form>
  );
}

// Mobile-optimized form actions
interface MobileFormActionsProps {
  children: React.ReactNode;
  className?: string;
}

export function MobileFormActions({
  children,
  className,
}: MobileFormActionsProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 pt-4',
        'sm:flex-row sm:justify-end',
        className
      )}
    >
      {children}
    </div>
  );
}
