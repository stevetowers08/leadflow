/**
 * Search Modal Component
 *
 * A reusable modal that opens when clicking a search icon,
 * providing a clean search interface for table pages.
 */

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Search, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onSearch?: (value: string) => void;
  className?: string;
}

export const SearchModal = ({
  isOpen,
  onClose,
  placeholder = 'Search...',
  value,
  onChange,
  onSearch,
  className,
}: SearchModalProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [localValue, setLocalValue] = useState(value);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isOpen]);

  // Sync local value with prop value
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onChange(localValue);
    onSearch?.(localValue);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      {/* Backdrop */}
      <div
        className='absolute inset-0 bg-black/50 backdrop-blur-sm'
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={cn(
          'relative bg-white rounded-lg shadow-xl border border-border/60 w-full max-w-md mx-4',
          className
        )}
      >
        <form onSubmit={handleSubmit} className='p-6'>
          {/* Header */}
          <div className='flex items-center justify-between mb-4'>
            <h3 className='text-lg font-semibold text-foreground'>Search</h3>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={onClose}
              className='h-8 w-8 p-0'
            >
              <X className='h-4 w-4' />
            </Button>
          </div>

          {/* Search Input */}
          <div className='relative mb-4'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
            <Input
              ref={inputRef}
              type='text'
              placeholder={placeholder}
              value={localValue}
              onChange={e => setLocalValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className='pl-10 pr-4 h-8'
            />
          </div>

          {/* Actions */}
          <div className='flex justify-end gap-3'>
            <Button type='button' variant='outline' onClick={onClose}>
              Cancel
            </Button>
            <Button type='submit' disabled={!localValue.trim()}>
              Search
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

/**
 * Search Icon Button Component
 *
 * A clickable search icon that opens the search modal
 */
interface SearchIconButtonProps {
  onClick: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const SearchIconButton = ({
  onClick,
  className,
  size = 'md',
}: SearchIconButtonProps) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-7 w-7', // Standard height for all action elements
    lg: 'h-8 w-8',
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'action-bar action-bar--icon',
        sizeClasses[size],
        className
      )}
      title='Search'
    >
      <Search className='h-5 w-5 text-muted-foreground' />
    </button>
  );
};
