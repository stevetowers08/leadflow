import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import React from 'react';

interface MultiSelectDropdownOption {
  label: string;
  value: string;
}

interface MultiSelectDropdownProps {
  options: MultiSelectDropdownOption[];
  value: string[];
  onValueChange: (values: string[]) => void;
  placeholder?: string;
  className?: string;
}

export const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  options,
  value,
  onValueChange,
  placeholder = 'Select...',
  className,
}) => {
  const handleCheckedChange = (optionValue: string, checked: boolean) => {
    if (checked) {
      onValueChange([...value, optionValue]);
    } else {
      onValueChange(value.filter(v => v !== optionValue));
    }
  };

  const displayText =
    value.length === 0
      ? placeholder
      : value.length === 1
        ? options.find(o => o.value === value[0])?.label || value[0]
        : `${value.length} selected`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          'h-8 px-3 text-sm border border-gray-200 rounded-md hover:border-gray-300 hover:bg-gray-100 transition-colors flex items-center justify-between max-w-[180px] bg-white',
          className
        )}
      >
        <span className='truncate'>{displayText}</span>
        <ChevronDown className='h-4 w-4 ml-2 flex-shrink-0' />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className='bg-white border border-gray-300 shadow-lg'
        align='start'
      >
        {options.map(option => {
          const isChecked = value.includes(option.value);
          return (
            <DropdownMenuCheckboxItem
              key={option.value}
              checked={isChecked}
              onCheckedChange={checked =>
                handleCheckedChange(option.value, checked as boolean)
              }
              className='cursor-pointer'
            >
              {option.label}
            </DropdownMenuCheckboxItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
