/**
 * Custom hook for handling swipe gestures
 * Implements mobile-first swipe detection with proper touch handling
 */

import { useCallback, useRef } from 'react';

interface SwipeGestureOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number; // Minimum distance for swipe detection
  velocityThreshold?: number; // Minimum velocity for swipe detection
  preventDefault?: boolean;
}

interface TouchPoint {
  x: number;
  y: number;
  timestamp: number;
}

export const useSwipeGestures = (options: SwipeGestureOptions = {}) => {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    threshold = 50,
    velocityThreshold = 0.3,
    preventDefault = true,
  } = options;

  const touchStartRef = useRef<TouchPoint | null>(null);
  const touchEndRef = useRef<TouchPoint | null>(null);
  const isDraggingRef = useRef(false);

  const handleTouchStart = useCallback((event: TouchEvent) => {
    if (event.touches.length !== 1) return;

    const touch = event.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now(),
    };
    touchEndRef.current = null;
    isDraggingRef.current = false;
  }, []);

  const handleTouchMove = useCallback(
    (event: TouchEvent) => {
      if (!touchStartRef.current || event.touches.length !== 1) return;

      const touch = event.touches[0];
      const deltaX = Math.abs(touch.clientX - touchStartRef.current.x);
      const deltaY = Math.abs(touch.clientY - touchStartRef.current.y);

      // Start dragging if movement exceeds threshold
      if (deltaX > 10 || deltaY > 10) {
        isDraggingRef.current = true;
        if (preventDefault) {
          event.preventDefault();
        }
      }
    },
    [preventDefault]
  );

  const handleTouchEnd = useCallback(
    (event: TouchEvent) => {
      if (!touchStartRef.current || event.changedTouches.length !== 1) return;

      const touch = event.changedTouches[0];
      touchEndRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        timestamp: Date.now(),
      };

      const start = touchStartRef.current;
      const end = touchEndRef.current;

      if (!start || !end) return;

      const deltaX = end.x - start.x;
      const deltaY = end.y - start.y;
      const deltaTime = end.timestamp - start.timestamp;

      // Calculate velocity
      const velocityX = Math.abs(deltaX) / deltaTime;
      const velocityY = Math.abs(deltaY) / deltaTime;

      // Determine if it's a valid swipe
      const isValidSwipe =
        Math.abs(deltaX) > threshold || Math.abs(deltaY) > threshold;
      const hasEnoughVelocity =
        velocityX > velocityThreshold || velocityY > velocityThreshold;

      if (!isValidSwipe || !hasEnoughVelocity) return;

      // Determine swipe direction
      const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY);

      if (isHorizontalSwipe) {
        if (deltaX > 0) {
          onSwipeRight?.();
        } else {
          onSwipeLeft?.();
        }
      } else {
        if (deltaY > 0) {
          onSwipeDown?.();
        } else {
          onSwipeUp?.();
        }
      }

      // Reset
      touchStartRef.current = null;
      touchEndRef.current = null;
      isDraggingRef.current = false;
    },
    [
      threshold,
      velocityThreshold,
      onSwipeLeft,
      onSwipeRight,
      onSwipeUp,
      onSwipeDown,
    ]
  );

  const attachListeners = useCallback(
    (element: HTMLElement) => {
      element.addEventListener('touchstart', handleTouchStart, {
        passive: false,
      });
      element.addEventListener('touchmove', handleTouchMove, {
        passive: false,
      });
      element.addEventListener('touchend', handleTouchEnd, { passive: true });

      return () => {
        element.removeEventListener('touchstart', handleTouchStart);
        element.removeEventListener('touchmove', handleTouchMove);
        element.removeEventListener('touchend', handleTouchEnd);
      };
    },
    [handleTouchStart, handleTouchMove, handleTouchEnd]
  );

  return { attachListeners };
};
