import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';

interface ListItemProps {
  id: string;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  onClick?: () => void;
  onSelect?: (id: string, checked: boolean) => void;
  isSelected?: boolean;
  showCheckbox?: boolean;
  className?: string;
}

export const ListItem: React.FC<ListItemProps> = ({
  id,
  title,
  subtitle,
  icon,
  badge,
  onClick,
  onSelect,
  isSelected = false,
  showCheckbox = false,
  className = ""
}) => {
  return (
    <div 
      className={`px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 cursor-pointer group ${className}`}
    >
      <div className="flex items-center gap-3">
        {showCheckbox && (
          <Checkbox
            id={`item-${id}`}
            checked={isSelected}
            onCheckedChange={(checked) => onSelect?.(id, checked as boolean)}
            onClick={(e) => e.stopPropagation()}
          />
        )}
        {icon && (
          <div className="flex-shrink-0">
            {icon}
          </div>
        )}
        <div 
          className="flex-1 min-w-0 cursor-pointer"
          onClick={onClick}
        >
          <div className="font-semibold text-sm truncate">{title}</div>
          {subtitle && (
            <div className="text-xs text-gray-500 truncate">{subtitle}</div>
          )}
        </div>
        {badge && (
          <div className="flex items-center gap-2">
            {badge}
          </div>
        )}
      </div>
    </div>
  );
};

