'use client';

import React, { useState } from 'react';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ActionSlidePanel, type ActionItem } from './ActionSlidePanel';
import { cn } from '@/lib/utils';

interface ActionSlideTriggerProps {
  actions: ActionItem[];
  title?: string;
  variant?: 'default' | 'ghost' | 'outline' | 'secondary';
  size?: 'sm' | 'md';
  className?: string;
  children?: React.ReactNode;
}

export const ActionSlideTrigger: React.FC<ActionSlideTriggerProps> = ({
  actions,
  title,
  variant = 'outline',
  size = 'sm',
  className,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  if (actions.length === 0) return null;

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => setIsOpen(true)}
        className={cn('gap-2', className)}
      >
        {children || (
          <>
            <span>More</span>
            <MoreHorizontal className='h-4 w-4' />
          </>
        )}
      </Button>

      <ActionSlidePanel
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={title || 'Actions'}
        actions={actions}
      />
    </>
  );
};

