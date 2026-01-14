'use client';

import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect } from 'react';

interface SlideOutPanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: 'default' | 'medium' | 'wide';
  customHeader?: React.ReactNode;
  className?: string;
}

export const SlideOutPanel: React.FC<SlideOutPanelProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  width = 'default',
  customHeader,
  className,
}) => {
  // Calculate width - simple and explicit
  const panelWidth =
    width === 'wide'
      ? 'min(85vw, calc(100vw - var(--sidebar-width, 14rem)))'
      : width === 'medium'
        ? 'min(75vw, calc(100vw - var(--sidebar-width, 14rem)))'
        : 'min(70vw, calc(100vw - var(--sidebar-width, 14rem)))';

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
          {/* Overlay - matches page background with blur, respects sidebar and header */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={cn(
              // Mobile: full screen
              'fixed inset-0',
              // Desktop: respect sidebar and header
              'md:top-12 md:right-0 md:bottom-0',
              'bg-background/80 backdrop-blur-sm z-[10000]'
            )}
            style={{
              // Use CSS variable for sidebar width, fallback to 14rem (expanded)
              left: 'var(--sidebar-width, 14rem)',
            }}
            onClick={onClose}
          />

          {/* Panel - Simplified: right-aligned, never covers sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{
              type: 'tween',
              duration: 0.3,
              ease: [0.4, 0, 0.2, 1],
            }}
            className={cn(
              'fixed bg-background z-[10001] flex flex-col',
              // Mobile: full screen
              'inset-0',
              // Desktop: positioned from top and bottom, right-aligned
              'md:top-12 md:bottom-0',
              // Safe area padding
              'pb-[env(safe-area-inset-bottom)]',
              className
            )}
            style={{
              // RIGHT ALIGNED - no left positioning
              right: 0,
              // Width constrained to never cover sidebar
              width: panelWidth,
              // Ensure no left positioning
              left: 'auto',
              boxShadow: '-2px 0 15px rgba(0, 0, 0, 0.1)',
            }}
          >
            {/* Header - compact padding, same text size */}
            <div className='flex items-center justify-between px-4 py-2 md:px-6 md:py-2.5 border-b border-border flex-shrink-0 pt-[max(0.5rem,env(safe-area-inset-top))] md:pt-2.5'>
              <div className='flex-1 min-w-0'>
                {customHeader || (
                  <>
                    <h2 className='text-base md:text-lg font-semibold text-foreground truncate'>
                      {title}
                    </h2>
                    {subtitle && (
                      <p className='text-xs md:text-sm text-muted-foreground mt-0.5 truncate'>
                        {subtitle}
                      </p>
                    )}
                  </>
                )}
              </div>
              {/* Close button - more visible, minimum 44x44 touch target for mobile */}
              <button
                onClick={onClose}
                className='ml-2 md:ml-4 p-2 md:p-1.5 min-w-[44px] min-h-[44px] md:min-w-[36px] md:min-h-[36px] flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent dark:hover:bg-muted/60 active:bg-accent/80 dark:active:bg-muted/70 rounded-lg transition-colors flex-shrink-0 touch-manipulation'
                aria-label='Close panel'
                title='Close'
              >
                <X className='h-5 w-5 md:h-4 md:w-4' />
              </button>
            </div>

            {/* Content - responsive padding with momentum scrolling */}
            <div
              className={cn(
                'flex-1 overflow-y-auto overflow-x-hidden px-4 pb-4 md:px-6 md:pb-6 slide-out-scroll',
                // iOS momentum scrolling
                '-webkit-overflow-scrolling-touch',
                // Smooth scroll behavior
                'scroll-smooth',
                // Overscroll behavior for native feel
                'overscroll-behavior-y-contain',
                className
              )}
            >
              {children}
            </div>

            {/* Footer - responsive with safe area */}
            {footer && (
              <div className='px-4 py-3 md:px-6 md:py-4 border-t border-border bg-muted flex-shrink-0 pb-[max(0.75rem,env(safe-area-inset-bottom))]'>
                {footer}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
