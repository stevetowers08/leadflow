'use client';

import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect } from 'react';

interface SmallSlidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  headerActions?: React.ReactNode;
  footer?: React.ReactNode;
}

export const SmallSlidePanel: React.FC<SmallSlidePanelProps> = ({
  isOpen,
  onClose,
  title,
  children,
  headerActions,
  footer,
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

          {/* Panel - Slides from right edge like company slider */}
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
              width: '400px',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className='flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0'>
              <h2 className='text-lg font-semibold text-foreground'>{title}</h2>
              <div className='flex items-center gap-2'>
                {headerActions}
                <button
                  onClick={onClose}
                  className='ml-2 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0'
                  aria-label='Close panel'
                >
                  <X className='h-5 w-5' />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className='flex-1 overflow-hidden flex flex-col px-6 pb-6'>
              {children}
            </div>

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

