import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SwipeableProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
  className?: string;
}

export const SwipeableComponent: React.FC<SwipeableProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50,
  className,
}) => {
  const [startX, setStartX] = useState<number | null>(null);
  const [startY, setStartY] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setStartX(touch.clientX);
    setStartY(touch.clientY);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !startX || !startY) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - startX;
    const deltaY = touch.clientY - startY;

    // Prevent default scrolling if we're swiping horizontally
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      e.preventDefault();
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging || !startX || !startY) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - startX;
    const deltaY = touch.clientY - startY;

    // Determine swipe direction
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

    setStartX(null);
    setStartY(null);
    setIsDragging(false);
  };

  const handleTouchCancel = () => {
    setStartX(null);
    setStartY(null);
    setIsDragging(false);
  };

  return (
    <div
      ref={elementRef}
      className={cn(
        'touch-none select-none',
        isDragging && 'cursor-grabbing',
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

// Mobile-optimized card component with swipe actions
interface MobileCardProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  leftAction?: React.ReactNode;
  rightAction?: React.ReactNode;
  className?: string;
}

export const MobileCard: React.FC<MobileCardProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  leftAction,
  rightAction,
  className,
}) => {
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwipeActive, setIsSwipeActive] = useState(false);

  const handleSwipeLeft = () => {
    if (onSwipeLeft) {
      setSwipeOffset(-100);
      setTimeout(() => {
        onSwipeLeft();
        setSwipeOffset(0);
      }, 200);
    }
  };

  const handleSwipeRight = () => {
    if (onSwipeRight) {
      setSwipeOffset(100);
      setTimeout(() => {
        onSwipeRight();
        setSwipeOffset(0);
      }, 200);
    }
  };

  return (
    <div className='relative overflow-hidden'>
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
      <SwipeableComponent
        onSwipeLeft={handleSwipeLeft}
        onSwipeRight={handleSwipeRight}
        className={cn(
          'relative bg-card transition-transform duration-200 border shadow-sm',
          className
        )}
        style={{
          transform: `translateX(${swipeOffset}px)`,
        }}
      >
        {children}
      </SwipeableComponent>
    </div>
  );
};

// Hook for mobile detection
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

// Re-export Button with mobile-optimized defaults
export const MobileButton = Button;
