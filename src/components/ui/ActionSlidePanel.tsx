'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect } from 'react';

export interface ActionItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  variant?: 'default' | 'destructive' | 'secondary';
  disabled?: boolean;
  divider?: boolean;
}

interface ActionSlidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  actions: ActionItem[];
}

export const ActionSlidePanel: React.FC<ActionSlidePanelProps> = ({
  isOpen,
  onClose,
  title = 'Actions',
  actions,
}) => {
  // Handle ESC key
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Subtle overlay - excludes header and sidebar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className='fixed top-12 left-56 right-0 bottom-0 bg-black/20 z-[10002] max-md:left-0'
            onClick={onClose}
          />

          {/* Action Panel - Slides from right edge like company slider */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{
              type: 'tween',
              duration: 0.3,
              ease: [0.4, 0, 0.2, 1],
            }}
            className='fixed top-12 -mt-px right-0 bottom-0 bg-white z-[10003] flex flex-col'
            style={{
              width: '320px',
              boxShadow: '-2px 0 15px rgba(0, 0, 0, 0.1)',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Minimal Header */}
            <div className='flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0'>
              <h2 className='text-lg font-semibold text-foreground'>{title}</h2>
              <button
                onClick={onClose}
                className='ml-4 p-2 text-muted-foreground hover:text-muted-foreground hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0'
                aria-label='Close actions'
              >
                <X className='h-5 w-5' />
              </button>
            </div>

            {/* Actions List */}
            <div className='flex-1 overflow-y-auto px-6 py-4 space-y-1'>
              {actions.map((action, index) => {
                const Icon = action.icon;
                const isDestructive = action.variant === 'destructive';
                const isSecondary = action.variant === 'secondary';

                return (
                  <React.Fragment key={action.id}>
                    {action.divider && index > 0 && (
                      <div className='my-3 border-t border-border' />
                    )}
                    <Button
                      onClick={() => {
                        if (!action.disabled) {
                          action.onClick();
                          onClose();
                        }
                      }}
                      disabled={action.disabled}
                      variant={isDestructive ? 'destructive' : isSecondary ? 'secondary' : 'ghost'}
                      className={cn(
                        'w-full justify-start gap-3 px-4 py-3 h-auto text-sm',
                        isDestructive && 'hover:bg-destructive/10',
                        isSecondary && 'text-muted-foreground'
                      )}
                    >
                      <Icon
                        className={cn(
                          'h-5 w-5 flex-shrink-0',
                          isDestructive && 'text-destructive',
                          !isDestructive && !isSecondary && 'text-muted-foreground'
                        )}
                      />
                      <span className='flex-1 text-left font-medium'>{action.label}</span>
                    </Button>
                  </React.Fragment>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

