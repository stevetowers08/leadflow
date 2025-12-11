import * as React from 'react';
import { cn } from '@/lib/utils';
import { Input, type InputProps } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { designTokens } from '@/design-system/tokens';
import { Search, X, Loader2 } from 'lucide-react';

export interface EnhancedSearchInputProps
  extends Omit<InputProps, 'onChange' | 'value'> {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  showClearButton?: boolean;
  loading?: boolean;
  containerClassName?: string;
}

export const EnhancedSearchInput = React.forwardRef<
  HTMLInputElement,
  EnhancedSearchInputProps
>(
  (
    {
      value,
      onChange,
      onClear,
      placeholder = 'Search...',
      showClearButton = true,
      loading = false,
      className,
      containerClassName,
      ...props
    },
    ref
  ) => {
    const handleClear = React.useCallback(() => {
      onChange('');
      onClear?.();
    }, [onChange, onClear]);

    return (
      <div
        className={cn(
          'relative flex items-center w-full',
          containerClassName
        )}
      >
        <Search
          className={cn(
            'absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none z-10',
            loading && 'animate-pulse'
          )}
          aria-hidden="true"
        />
        <Input
          ref={ref}
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            'pl-9',
            showClearButton && value && 'pr-9',
            loading && 'pr-9',
            designTokens.transitions.fast,
            className
          )}
          aria-label={placeholder}
          {...props}
        />
        {showClearButton && value && !loading && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleClear}
            className={cn(
              'absolute right-1 h-6 w-6 rounded-full hover:bg-muted',
              designTokens.transitions.fast
            )}
            aria-label="Clear search"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
        {loading && (
          <div
            className="absolute right-3 flex items-center justify-center"
            aria-label="Loading"
            role="status"
          >
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>
    );
  }
);
EnhancedSearchInput.displayName = 'EnhancedSearchInput';

