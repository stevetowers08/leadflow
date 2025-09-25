import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { DropdownOption, ReferenceOption } from "@/hooks/useDropdownOptions";

interface DropdownSelectProps {
  options: DropdownOption[] | ReferenceOption[];
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  loading?: boolean;
}

export const DropdownSelect = ({
  options,
  value,
  onValueChange,
  placeholder = "Select an option...",
  disabled = false,
  className,
  loading = false
}: DropdownSelectProps) => {
  const isReferenceOption = (option: DropdownOption | ReferenceOption): option is ReferenceOption => {
    return 'id' in option;
  };

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled || loading}>
      <SelectTrigger className={cn("w-full", className)}>
        <SelectValue placeholder={loading ? "Loading..." : placeholder} />
      </SelectTrigger>
      <SelectContent className="bg-background/95 backdrop-blur-sm border border-border/50 shadow-lg">
        {options.map((option) => {
          const optionValue = isReferenceOption(option) ? option.id : option.value;
          const optionLabel = isReferenceOption(option) ? option.name : option.label;
          
          // Ensure optionValue is never an empty string
          if (!optionValue || optionValue === "") {
            return null;
          }
          
          return (
            <SelectItem
              key={optionValue}
              value={optionValue}
              className="cursor-pointer hover:bg-accent/50 focus:bg-accent/50"
            >
              {optionLabel}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};