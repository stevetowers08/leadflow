import { Button } from '@/components/ui/button';
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
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            'h-8 justify-between min-w-[180px] max-w-[180px]',
            className
          )}
        >
          <span className='truncate'>{displayText}</span>
          <ChevronDown className='h-4 w-4 ml-2 flex-shrink-0 opacity-50' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='start' className="min-w-[180px]">
        {options.map(option => {
          const isChecked = value.includes(option.value);
          return (
            <DropdownMenuCheckboxItem
              key={option.value}
              checked={isChecked}
              onCheckedChange={checked =>
                handleCheckedChange(option.value, checked as boolean)
              }
            >
              {option.label}
            </DropdownMenuCheckboxItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
