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
  // Mobile-first responsive width classes
  // On mobile: full width with safe area support
  // On tablet (md): appropriate percentage widths
  // On desktop (lg+): original percentage widths
  const widthClasses =
    width === 'wide'
      ? 'w-full md:w-[85vw] lg:w-[75vw] max-w-none md:max-w-[85vw] lg:max-w-[75vw]'
      : width === 'medium'
        ? 'w-full md:w-[75vw] lg:w-[60vw] max-w-none md:max-w-[75vw] lg:max-w-[60vw]'
        : 'w-full md:w-[70vw] lg:w-[50vw] max-w-none md:max-w-[70vw] lg:max-w-[50vw]';
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
          {/* Overlay - matches page background with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className='fixed inset-0 bg-background/80 backdrop-blur-sm z-[10000]'
            onClick={onClose}
          />

          {/* Panel */}
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
              // Base positioning - full height on mobile, offset from nav on larger screens
              'fixed inset-0 md:top-12 md:-mt-px md:left-auto right-0 bottom-0',
              'bg-background z-[10001] flex flex-col',
              // Safe area padding for notched devices
              'pb-[env(safe-area-inset-bottom)]',
              widthClasses
            )}
            style={{
              boxShadow: '-2px 0 15px rgba(0, 0, 0, 0.1)',
            }}
          >
            {/* Header - responsive padding and touch targets */}
            <div className='flex items-center justify-between px-4 py-3 md:px-6 md:py-4 border-b border-border flex-shrink-0 pt-[max(0.75rem,env(safe-area-inset-top))] md:pt-4'>
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
              {/* Close button - minimum 44x44 touch target for mobile accessibility */}
              <button
                onClick={onClose}
                className='ml-2 md:ml-4 p-2.5 md:p-2 min-w-[44px] min-h-[44px] md:min-w-0 md:min-h-0 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent active:bg-accent/80 rounded-lg transition-colors flex-shrink-0 touch-manipulation'
                aria-label='Close panel'
              >
                <X className='h-5 w-5' />
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
