'use client';

import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();

  // Calculate width - full width on mobile, percentage on desktop
  const panelWidth = isMobile
    ? '100%'
    : width === 'wide'
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
              // Mobile: full screen overlay, Desktop: respect sidebar
              ...(isMobile
                ? { left: 0 }
                : { left: 'var(--sidebar-width, 14rem)' }),
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
              // Mobile: full width, Desktop: calculated width
              ...(isMobile
                ? { width: '100%', left: 0, right: 0 }
                : {
                    right: 0,
                    width: panelWidth,
                    left: 'auto',
                  }),
              boxShadow: '-2px 0 15px rgba(0, 0, 0, 0.1)',
            }}
          >
            {/* Header - compact padding, vertically centered */}
            <div
              className='flex items-center justify-between px-3 md:px-4 border-b border-border flex-shrink-0'
              style={{
                paddingTop: `max(0.5rem, env(safe-area-inset-top, 0.5rem))`,
                paddingBottom: `max(0.5rem, env(safe-area-inset-bottom, 0px))`,
              }}
            >
              <div className='flex-1 min-w-0 flex items-center'>
                {customHeader || (
                  <div className='flex items-center gap-2'>
                    <h2 className='text-base md:text-lg font-semibold text-foreground truncate leading-tight'>
                      {title}
                    </h2>
                    {subtitle && (
                      <p className='text-xs md:text-sm text-muted-foreground truncate leading-tight'>
                        {subtitle}
                      </p>
                    )}
                  </div>
                )}
              </div>
              {/* Close button - minimum 44x44 touch target for mobile */}
              <button
                onClick={onClose}
                className='ml-2 md:ml-3 p-2 md:p-1 min-w-[44px] min-h-[44px] md:min-w-[32px] md:min-h-[32px] flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent dark:hover:bg-muted/60 active:bg-accent/80 dark:active:bg-muted/70 rounded-lg transition-colors flex-shrink-0 touch-manipulation'
                aria-label='Close panel'
                title='Close'
              >
                <X className='h-5 w-5 md:h-4 md:w-4' />
              </button>
            </div>

            {/* Content - compact padding with momentum scrolling */}
            <div
              className={cn(
                'flex-1 overflow-y-auto overflow-x-hidden px-3 pb-3 md:px-4 md:pb-4 slide-out-scroll',
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

            {/* Footer - compact with safe area */}
            {footer && (
              <div className='px-3 py-2 md:px-4 md:py-3 border-t border-border bg-muted flex-shrink-0 pb-[max(0.75rem,env(safe-area-inset-bottom))]'>
                {footer}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
