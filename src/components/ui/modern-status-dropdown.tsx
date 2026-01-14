import { cn } from '@/lib/utils';
import { getUnifiedStatusClass } from '@/utils/colorScheme';
import { Check, ChevronDown } from 'lucide-react';
import React from 'react';

interface ModernStatusOption {
  value: string;
  label: string;
  color?: string;
  count?: number;
}

interface ModernStatusDropdownProps {
  options: ModernStatusOption[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const ModernStatusDropdown: React.FC<ModernStatusDropdownProps> = ({
  options,
  value,
  onValueChange,
  placeholder = 'Select status...',
  className,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');

  const selectedOption = options.find(option => option.value === value);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (optionValue: string) => {
    onValueChange(optionValue);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className={cn('relative overflow-visible p-0.5', className)}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          'flex items-center justify-between w-full px-3 py-2 text-sm',
          'bg-background border border-border rounded-md',
          'shadow-[0_4px_6px_-1px_rgb(0_0_0_/_0.1),0_2px_4px_-2px_rgb(0_0_0_/_0.1)] m-[2px]',
          'hover:border-border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          'transition-all duration-200 ease-in-out',
          'min-h-[36px]',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <div className='flex items-center gap-2'>
          {selectedOption && (
            <>
              {/* Status Indicator */}
              <div
                className={cn(
                  'w-2 h-2 rounded-full flex-shrink-0',
                  getUnifiedStatusClass(selectedOption.value)
                )}
              />
              <span className='text-foreground font-medium'>
                {selectedOption.label}
              </span>
              {selectedOption.count !== undefined && (
                <span className='text-xs text-muted-foreground bg-gray-100 px-2 py-0.5 rounded-full'>
                  {selectedOption.count}
                </span>
              )}
            </>
          )}
          {!selectedOption && (
            <span className='text-muted-foreground'>{placeholder}</span>
          )}
        </div>

        <ChevronDown
          className={cn(
            'h-4 w-4 text-muted-foreground transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className='fixed inset-0 z-10'
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className='absolute top-full left-0 right-0 z-20 mt-1 bg-white border border-border rounded-md shadow-lg max-h-[200px] overflow-hidden'>
            {/* Search Input */}
            <div className='p-2 border-b border-gray-100'>
              <input
                type='text'
                placeholder='Search statuses...'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className='w-full px-3 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                autoFocus
              />
            </div>

            {/* Options List */}
            <div className='max-h-[140px] overflow-y-auto'>
              {filteredOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2 text-sm',
                    'hover:bg-gray-100 transition-colors duration-150',
                    'focus:outline-none focus:bg-gray-100',
                    value === option.value && 'bg-primary/10' // Light blue for selected
                  )}
                >
                  <div className='flex items-center gap-3'>
                    {/* Status Indicator */}
                    <div
                      className={cn(
                        'w-2 h-2 rounded-full flex-shrink-0',
                        getUnifiedStatusClass(option.value)
                      )}
                    />

                    <span
                      className={cn(
                        'font-medium',
                        value === option.value
                          ? 'text-primary'
                          : 'text-foreground'
                      )}
                    >
                      {option.label}
                    </span>

                    {option.count !== undefined && (
                      <span className='text-xs text-muted-foreground bg-gray-100 px-2 py-0.5 rounded-full'>
                        {option.count}
                      </span>
                    )}
                  </div>

                  {value === option.value && (
                    <Check className='h-4 w-4 text-primary' />
                  )}
                </button>
              ))}

              {filteredOptions.length === 0 && (
                <div className='px-3 py-2 text-sm text-muted-foreground text-center'>
                  No statuses found
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Enhanced version with grouped options (like HubSpot)
interface GroupedStatusOption {
  group: string;
  options: ModernStatusOption[];
}

interface GroupedStatusDropdownProps {
  groupedOptions: GroupedStatusOption[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const GroupedStatusDropdown: React.FC<GroupedStatusDropdownProps> = ({
  groupedOptions,
  value,
  onValueChange,
  placeholder = 'Select status...',
  className,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');

  // Flatten options for search
  const allOptions = groupedOptions.flatMap(group => group.options);
  const selectedOption = allOptions.find(option => option.value === value);

  const filteredGroups = groupedOptions
    .map(group => ({
      ...group,
      options: group.options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter(group => group.options.length > 0);

  const handleSelect = (optionValue: string) => {
    onValueChange(optionValue);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className={cn('relative overflow-visible p-0.5', className)}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          'flex items-center justify-between w-full px-3 py-2 text-sm',
          'bg-background border border-border rounded-md',
          'shadow-[0_4px_6px_-1px_rgb(0_0_0_/_0.1),0_2px_4px_-2px_rgb(0_0_0_/_0.1)] m-[2px]',
          'hover:border-border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          'transition-all duration-200 ease-in-out',
          'min-h-[36px]',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <div className='flex items-center gap-2'>
          {selectedOption && (
            <>
              <div
                className={cn(
                  'w-2 h-2 rounded-full flex-shrink-0',
                  getUnifiedStatusClass(selectedOption.value)
                )}
              />
              <span className='text-foreground font-medium'>
                {selectedOption.label}
              </span>
              {selectedOption.count !== undefined && (
                <span className='text-xs text-muted-foreground bg-gray-100 px-2 py-0.5 rounded-full'>
                  {selectedOption.count}
                </span>
              )}
            </>
          )}
          {!selectedOption && (
            <span className='text-muted-foreground'>{placeholder}</span>
          )}
        </div>

        <ChevronDown
          className={cn(
            'h-4 w-4 text-muted-foreground transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div
            className='fixed inset-0 z-10'
            onClick={() => setIsOpen(false)}
          />

          <div className='absolute top-full left-0 right-0 z-20 mt-1 bg-white border border-border rounded-md shadow-lg max-h-[200px] overflow-hidden'>
            {/* Search Input */}
            <div className='p-2 border-b border-gray-100'>
              <input
                type='text'
                placeholder='Search statuses...'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className='w-full px-3 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                autoFocus
              />
            </div>

            {/* Grouped Options */}
            <div className='max-h-[140px] overflow-y-auto'>
              {filteredGroups.map((group, groupIndex) => (
                <div key={group.group}>
                  {/* Group Header */}
                  <div className='px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide bg-muted border-b border-gray-100'>
                    {group.group}
                  </div>

                  {/* Group Options */}
                  {group.options.map(option => (
                    <button
                      key={option.value}
                      onClick={() => handleSelect(option.value)}
                      className={cn(
                        'w-full flex items-center justify-between px-3 py-2 text-sm',
                        'hover:bg-gray-100 transition-colors duration-150',
                        'focus:outline-none focus:bg-gray-100',
                        value === option.value && 'bg-primary/10' // Light blue for selected
                      )}
                    >
                      <div className='flex items-center gap-3'>
                        <div
                          className={cn(
                            'w-2 h-2 rounded-full flex-shrink-0',
                            getUnifiedStatusClass(option.value)
                          )}
                        />
                        <span
                          className={cn(
                            'font-medium',
                            value === option.value
                              ? 'text-blue-900'
                              : 'text-foreground'
                          )}
                        >
                          {option.label}
                        </span>
                        {option.count !== undefined && (
                          <span className='text-xs text-muted-foreground bg-gray-100 px-2 py-0.5 rounded-full'>
                            {option.count}
                          </span>
                        )}
                      </div>

                      {value === option.value && (
                        <Check className='h-4 w-4 text-primary' />
                      )}
                    </button>
                  ))}
                </div>
              ))}

              {filteredGroups.length === 0 && (
                <div className='px-3 py-2 text-sm text-muted-foreground text-center'>
                  No statuses found
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
