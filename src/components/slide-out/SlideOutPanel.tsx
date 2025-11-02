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
  width?: 'default' | 'wide';
  customHeader?: React.ReactNode;
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
}) => {
  // Calculate width classes based on width prop
  const widthClasses = width === 'wide' ? 'w-[75vw]' : 'w-[50vw]';
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
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className='fixed inset-0 bg-black/50 z-[10000]'
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className={cn(
              'fixed top-12 -mt-px right-0 bottom-0 bg-white z-[10001] flex flex-col',
              widthClasses
            )}
            style={{
              boxShadow: '-2px 0 15px rgba(0, 0, 0, 0.1)',
            }}
          >
            {/* Header */}
            <div className='flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0'>
              <div className='flex-1 min-w-0'>
                {customHeader || (
                  <>
                    <h2 className='text-lg font-semibold text-gray-900 truncate'>
                      {title}
                    </h2>
                    {subtitle && (
                      <p className='text-sm text-gray-500 mt-0.5 truncate'>
                        {subtitle}
                      </p>
                    )}
                  </>
                )}
              </div>
              <button
                onClick={onClose}
                className='ml-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0'
                aria-label='Close panel'
              >
                <X className='h-5 w-5' />
              </button>
            </div>

            {/* Content */}
            <div className='flex-1 overflow-y-auto px-6 py-6 slide-out-scroll'>{children}</div>

            {/* Footer */}
            {footer && (
              <div className='px-6 py-4 border-t border-gray-200 bg-gray-50 flex-shrink-0'>
                {footer}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
