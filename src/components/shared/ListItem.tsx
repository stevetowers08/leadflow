import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Clickable } from '@/components/shared/Clickable';

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
  className = '',
}) => {
  return (
    <Clickable
      onClick={onClick}
      variant='card'
      size='md'
      aria-label={`View ${title} details`}
      aria-describedby={subtitle ? `${id}-subtitle` : undefined}
      className={className}
    >
      <div className='flex items-center gap-3'>
        {showCheckbox && (
          <Checkbox
            id={`item-${id}`}
            checked={isSelected}
            onCheckedChange={checked => onSelect?.(id, checked as boolean)}
            onClick={e => e.stopPropagation()}
          />
        )}
        {icon && <div className='flex-shrink-0'>{icon}</div>}
        <div className='flex-1 min-w-0'>
          <div className='font-semibold text-sm truncate'>{title}</div>
          {subtitle && (
            <div
              id={`${id}-subtitle`}
              className='text-xs text-gray-500 truncate'
            >
              {subtitle}
            </div>
          )}
        </div>
        {badge && <div className='flex items-center gap-2'>{badge}</div>}
      </div>
    </Clickable>
  );
};
