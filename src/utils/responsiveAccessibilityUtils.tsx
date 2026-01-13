/**
 * Responsive Design and Accessibility Fixes
 * Addresses mobile layout issues, browser compatibility, touch interactions, and accessibility
 */

import React, { useState, useEffect, useRef, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Menu } from 'lucide-react';

// 1. Enhanced Mobile Detection Hook
export const useMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [screenSize, setScreenSize] = useState('desktop');

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      const isMobileDevice = width < 768;
      const isTabletDevice = width >= 768 && width < 1024;

      setIsMobile(isMobileDevice);
      setIsTablet(isTabletDevice);

      if (isMobileDevice) {
        setScreenSize('mobile');
      } else if (isTabletDevice) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return { isMobile, isTablet, screenSize };
};

// 2. Enhanced Touch Interaction Component
interface EnhancedTouchProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onTap?: () => void;
  onLongPress?: () => void;
  threshold?: number;
  longPressDelay?: number;
  className?: string;
  disabled?: boolean;
}

export const EnhancedTouchComponent: React.FC<EnhancedTouchProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  onTap,
  onLongPress,
  threshold = 50,
  longPressDelay = 500,
  className,
  disabled = false,
}) => {
  const [startX, setStartX] = useState<number | null>(null);
  const [startY, setStartY] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(
    null
  );
  const elementRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled) return;

    const touch = e.touches[0];
    setStartX(touch.clientX);
    setStartY(touch.clientY);
    setIsDragging(false);

    // Start long press timer
    if (onLongPress) {
      const timer = setTimeout(() => {
        onLongPress();
      }, longPressDelay);
      setLongPressTimer(timer);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (disabled || !startX || !startY) return;

    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - startX);
    const deltaY = Math.abs(touch.clientY - startY);

    // Cancel long press if user starts moving
    if (longPressTimer && (deltaX > 10 || deltaY > 10)) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }

    // Mark as dragging if movement exceeds threshold
    if (deltaX > 10 || deltaY > 10) {
      setIsDragging(true);
    }

    // Prevent default scrolling for horizontal swipes
    if (deltaX > deltaY && deltaX > 10) {
      e.preventDefault();
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (disabled || !startX || !startY) return;

    // Clear long press timer
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - startX;
    const deltaY = touch.clientY - startY;

    // Handle tap (if not dragging)
    if (!isDragging && onTap) {
      onTap();
    }

    // Handle swipes
    if (isDragging) {
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (Math.abs(deltaX) > threshold) {
          if (deltaX > 0 && onSwipeRight) {
            onSwipeRight();
          } else if (deltaX < 0 && onSwipeLeft) {
            onSwipeLeft();
          }
        }
      } else {
        // Vertical swipe
        if (Math.abs(deltaY) > threshold) {
          if (deltaY > 0 && onSwipeDown) {
            onSwipeDown();
          } else if (deltaY < 0 && onSwipeUp) {
            onSwipeUp();
          }
        }
      }
    }

    setStartX(null);
    setStartY(null);
    setIsDragging(false);
  };

  const handleTouchCancel = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
    setStartX(null);
    setStartY(null);
    setIsDragging(false);
  };

  return (
    <div
      ref={elementRef}
      className={cn(
        'touch-manipulation select-none',
        isDragging && 'cursor-grabbing',
        disabled && 'pointer-events-none opacity-50',
        className
      )}
      style={{
        touchAction: 'pan-y pinch-zoom', // Allow vertical scroll and pinch zoom
        WebkitTouchCallout: 'none', // Disable iOS callout
        WebkitUserSelect: 'none', // Disable text selection
        userSelect: 'none',
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
    >
      {children}
    </div>
  );
};

// 3. Enhanced Mobile Card with Better Touch Support
interface EnhancedMobileCardProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  leftAction?: React.ReactNode;
  rightAction?: React.ReactNode;
  onTap?: () => void;
  className?: string;
  disabled?: boolean;
  ariaLabel?: string;
}

export const EnhancedMobileCard: React.FC<EnhancedMobileCardProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  leftAction,
  rightAction,
  onTap,
  className,
  disabled = false,
  ariaLabel,
}) => {
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwipeActive, setIsSwipeActive] = useState(false);

  const handleSwipeLeft = () => {
    if (disabled || !onSwipeLeft) return;

    setSwipeOffset(-100);
    setIsSwipeActive(true);

    setTimeout(() => {
      onSwipeLeft();
      setSwipeOffset(0);
      setIsSwipeActive(false);
    }, 200);
  };

  const handleSwipeRight = () => {
    if (disabled || !onSwipeRight) return;

    setSwipeOffset(100);
    setIsSwipeActive(true);

    setTimeout(() => {
      onSwipeRight();
      setSwipeOffset(0);
      setIsSwipeActive(false);
    }, 200);
  };

  return (
    <div
      className='relative overflow-hidden'
      role='button'
      tabIndex={disabled ? -1 : 0}
      aria-label={ariaLabel}
      onKeyDown={e => {
        if (disabled) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onTap?.();
        }
      }}
    >
      {/* Background actions */}
      <div className='absolute inset-0 flex'>
        {leftAction && (
          <div className='flex-1 bg-primary flex items-center justify-center text-white'>
            {leftAction}
          </div>
        )}
        {rightAction && (
          <div className='flex-1 bg-destructive flex items-center justify-center text-white'>
            {rightAction}
          </div>
        )}
      </div>

      {/* Main content */}
      <EnhancedTouchComponent
        onSwipeLeft={handleSwipeLeft}
        onSwipeRight={handleSwipeRight}
        onTap={onTap}
        disabled={disabled}
        className={cn(
          'relative bg-card transition-transform duration-200 border shadow-sm',
          'min-h-[44px]', // Ensure minimum touch target
          className
        )}
        style={{
          transform: `translateX(${swipeOffset}px)`,
        }}
      >
        {children}
      </EnhancedTouchComponent>
    </div>
  );
};

// 4. Enhanced Mobile Button with Better Accessibility
interface EnhancedMobileButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const EnhancedMobileButton: React.FC<EnhancedMobileButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  className,
  disabled,
  ...props
}) => {
  const baseClasses =
    'touch-manipulation select-none font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';

  const variantClasses = {
    primary:
      'bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary',
    secondary:
      'bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:ring-secondary',
    danger:
      'bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:ring-destructive',
    ghost: 'hover:bg-accent hover:text-accent-foreground focus:ring-accent',
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm min-h-[44px] min-w-[44px]', // Minimum touch target
    md: 'px-4 py-3 text-base min-h-[48px]',
    lg: 'px-6 py-4 text-lg min-h-[52px]',
  };

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      {...props}
    >
      <div className='flex items-center justify-center gap-2'>
        {loading && (
          <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-current' />
        )}
        {!loading && leftIcon && (
          <span className='flex-shrink-0'>{leftIcon}</span>
        )}
        <span className={loading ? 'opacity-0' : ''}>{children}</span>
        {!loading && rightIcon && (
          <span className='flex-shrink-0'>{rightIcon}</span>
        )}
      </div>
    </button>
  );
};

// 5. Enhanced Layout with Better Responsive Behavior
interface EnhancedLayoutProps {
  children: ReactNode;
}

export const EnhancedLayout: React.FC<EnhancedLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isMobile, isTablet } = useMobile();

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobile && sidebarOpen) {
        const sidebar = document.querySelector('.sidebar');
        const menuButton = document.querySelector('[data-menu-button]');

        if (
          sidebar &&
          !sidebar.contains(event.target as Node) &&
          menuButton &&
          !menuButton.contains(event.target as Node)
        ) {
          setSidebarOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, sidebarOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [sidebarOpen]);

  return (
    <div className='flex min-h-screen w-full'>
      {/* Mobile sidebar overlay */}
      {isMobile && sidebarOpen && (
        <div
          className='fixed inset-0 z-40 bg-black/50 lg:hidden'
          onClick={() => setSidebarOpen(false)}
          aria-hidden='true'
        />
      )}

      {/* Sidebar - Placeholder for sidebar component */}
      {isMobile && sidebarOpen && (
        <div
          className={cn(
            'fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out translate-x-0',
            'sidebar bg-background border-r'
          )}
        >
          {/* Sidebar content would go here */}
          <button
            onClick={() => setSidebarOpen(false)}
            className='p-4 text-foreground'
            aria-label='Close sidebar'
          >
            Close
          </button>
        </div>
      )}

      {/* Main content */}
      <main
        className={cn(
          'flex-1 overflow-auto transition-all duration-300',
          !isMobile && 'ml-64'
        )}
      >
        {/* Mobile header */}
        {isMobile && (
          <div className='sticky top-0 z-30 flex items-center justify-between bg-background border-b px-4 py-3 lg:hidden'>
            <EnhancedMobileButton
              variant='ghost'
              size='sm'
              onClick={() => setSidebarOpen(true)}
              className='p-3 min-h-[44px] min-w-[44px]'
              data-menu-button
              aria-label='Open navigation menu'
            >
              <Menu className='h-5 w-5' />
            </EnhancedMobileButton>
            <h1 className='text-lg font-normal text-foreground'>Empowr CRM</h1>
            <div className='w-11' /> {/* Spacer for centering */}
          </div>
        )}

        {/* Content */}
        <div
          className={cn(
            'min-h-screen',
            isMobile ? 'p-4 pb-20' : 'p-8' // Add bottom padding for mobile nav
          )}
        >
          {children}
        </div>
      </main>

      {/* Mobile bottom navigation - Placeholder for mobile nav component */}
      {isMobile && (
        <div className='fixed bottom-0 left-0 right-0 z-40 bg-background border-t lg:hidden'>
          {/* Mobile navigation content would go here */}
        </div>
      )}
    </div>
  );
};

// 6. Enhanced Mobile Navigation - Now handled by MobileNav component

// 7. Browser Compatibility Utilities
export const BrowserCompatibility = {
  // Check if CSS Grid is supported
  supportsCSSGrid: (): boolean => {
    if (typeof window === 'undefined') return false;
    const test = document.createElement('div');
    test.style.display = 'grid';
    return test.style.display === 'grid';
  },

  // Check if Flexbox is supported
  supportsFlexbox: (): boolean => {
    if (typeof window === 'undefined') return false;
    const test = document.createElement('div');
    test.style.display = 'flex';
    return test.style.display === 'flex';
  },

  // Check if CSS Custom Properties are supported
  supportsCustomProperties: (): boolean => {
    if (typeof window === 'undefined') return false;
    const test = document.createElement('div');
    test.style.setProperty('--test', 'value');
    return test.style.getPropertyValue('--test') === 'value';
  },

  // Check if Intersection Observer is supported
  supportsIntersectionObserver: (): boolean => {
    return typeof window !== 'undefined' && 'IntersectionObserver' in window;
  },

  // Check if ResizeObserver is supported
  supportsResizeObserver: (): boolean => {
    return typeof window !== 'undefined' && 'ResizeObserver' in window;
  },

  // Get browser information
  getBrowserInfo: () => {
    if (typeof window === 'undefined') return null;

    const userAgent = navigator.userAgent;
    const browsers = {
      chrome: /Chrome/.test(userAgent) && /Google Inc/.test(navigator.vendor),
      firefox: /Firefox/.test(userAgent),
      safari:
        /Safari/.test(userAgent) && /Apple Computer/.test(navigator.vendor),
      edge: /Edg/.test(userAgent),
      ie: /Trident/.test(userAgent),
    };

    return {
      userAgent,
      browsers,
      isMobile: /Mobi|Android/i.test(userAgent),
      isTablet: /Tablet|iPad/i.test(userAgent),
    };
  },
};

// 8. Accessibility Utilities
export const AccessibilityUtils = {
  // Announce to screen readers
  announce: (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (typeof window === 'undefined') return;

    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  },

  // Focus management
  focusFirstElement: (container: HTMLElement) => {
    const focusableElement = container.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as HTMLElement;

    if (focusableElement) {
      focusableElement.focus();
    }
  },

  // Trap focus within an element
  trapFocus: (element: HTMLElement) => {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    element.addEventListener('keydown', handleTabKey);

    return () => {
      element.removeEventListener('keydown', handleTabKey);
    };
  },

  // Check color contrast
  checkColorContrast: (foreground: string, background: string): number => {
    // Simplified contrast calculation
    const getLuminance = (color: string) => {
      const rgb = color.match(/\d+/g);
      if (!rgb) return 0;

      const [r, g, b] = rgb.map(colorValue => {
        const val = parseInt(colorValue) / 255;
        return val <= 0.03928
          ? val / 12.92
          : Math.pow((val + 0.055) / 1.055, 2.4);
      });

      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };

    const fgLuminance = getLuminance(foreground);
    const bgLuminance = getLuminance(background);

    const lighter = Math.max(fgLuminance, bgLuminance);
    const darker = Math.min(fgLuminance, bgLuminance);

    return (lighter + 0.05) / (darker + 0.05);
  },
};

// 9. CSS Utilities for Better Responsive Design
export const responsiveCSS = `
/* Enhanced responsive utilities */
@media (max-width: 767px) {
  .mobile-hidden {
    display: none !important;
  }
  
  .mobile-full-width {
    width: 100% !important;
  }
  
  .mobile-stack {
    flex-direction: column !important;
  }
  
  .mobile-center {
    text-align: center !important;
  }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .tablet-hidden {
    display: none !important;
  }
}

@media (min-width: 1024px) {
  .desktop-only {
    display: block !important;
  }
}

/* Touch-friendly improvements */
.touch-target {
  min-height: 44px;
  min-width: 44px;
}

.touch-manipulation {
  touch-action: manipulation;
}

/* Better focus indicators */
.focus-visible {
  outline: 2px solid hsl(var(--ring));
  outline-offset: 2px;
}

/* Screen reader only content */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .high-contrast {
    border: 2px solid currentColor;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .no-motion {
    animation: none !important;
    transition: none !important;
  }
}
`;
