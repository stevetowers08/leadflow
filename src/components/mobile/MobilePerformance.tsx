/**
 * Mobile Performance Optimizations
 * Provides performance enhancements specifically for mobile devices
 */

import React, { useEffect, useMemo } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

// Lazy loading component for mobile
interface LazyLoadProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  threshold?: number;
}

export function MobileLazyLoad({ children, fallback, threshold = 0.1 }: LazyLoadProps) {
  const [isVisible, setIsVisible] = React.useState(false);
  const [hasLoaded, setHasLoaded] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isMobile || hasLoaded) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setHasLoaded(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [isMobile, hasLoaded, threshold]);

  if (!isMobile) {
    return <>{children}</>;
  }

  return (
    <div ref={ref}>
      {isVisible ? children : (fallback || <div className="animate-pulse bg-gray-200 h-32 rounded" />)}
    </div>
  );
}

// Virtual scrolling for mobile lists
interface VirtualScrollProps {
  items: any[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: any, index: number) => React.ReactNode;
  className?: string;
}

export function MobileVirtualScroll({ 
  items, 
  itemHeight, 
  containerHeight, 
  renderItem, 
  className 
}: VirtualScrollProps) {
  const [scrollTop, setScrollTop] = React.useState(0);
  const isMobile = useIsMobile();

  const visibleItems = useMemo(() => {
    if (!isMobile) return items;

    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 1,
      items.length
    );

    return items.slice(startIndex, endIndex).map((item, index) => ({
      item,
      index: startIndex + index
    }));
  }, [items, scrollTop, itemHeight, containerHeight, isMobile]);

  const totalHeight = items.length * itemHeight;
  const offsetY = Math.floor(scrollTop / itemHeight) * itemHeight;

  if (!isMobile) {
    return (
      <div className={className}>
        {items.map((item, index) => renderItem(item, index))}
      </div>
    );
  }

  return (
    <div 
      className={cn("overflow-auto", className)}
      style={{ height: containerHeight }}
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map(({ item, index }) => (
            <div key={index} style={{ height: itemHeight }}>
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Image optimization for mobile
interface MobileImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallback?: string;
  lazy?: boolean;
}

export function MobileImage({ 
  src, 
  alt, 
  fallback, 
  lazy = true, 
  className,
  ...props 
}: MobileImageProps) {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);
  const isMobile = useIsMobile();

  const handleLoad = () => setIsLoaded(true);
  const handleError = () => setHasError(true);

  const imageSrc = hasError && fallback ? fallback : src;

  if (lazy && isMobile) {
    return (
      <MobileLazyLoad>
        <img
          src={imageSrc}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            "transition-opacity duration-200",
            isLoaded ? "opacity-100" : "opacity-0",
            className
          )}
          {...props}
        />
      </MobileLazyLoad>
    );
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      onLoad={handleLoad}
      onError={handleError}
      className={cn(
        "transition-opacity duration-200",
        isLoaded ? "opacity-100" : "opacity-0",
        className
      )}
      {...props}
    />
  );
}

// Debounced search for mobile
export function useMobileSearch<T>(
  items: T[],
  searchFn: (items: T[], query: string) => T[],
  delay: number = 300
) {
  const [query, setQuery] = React.useState('');
  const [debouncedQuery, setDebouncedQuery] = React.useState('');
  const isMobile = useIsMobile();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, isMobile ? delay : 0); // No delay on desktop

    return () => clearTimeout(timer);
  }, [query, delay, isMobile]);

  const filteredItems = useMemo(() => {
    if (!debouncedQuery) return items;
    return searchFn(items, debouncedQuery);
  }, [items, debouncedQuery, searchFn]);

  return {
    query,
    setQuery,
    filteredItems,
    isSearching: query !== debouncedQuery
  };
}

// Touch gesture handler
interface TouchGestureProps {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
  children: React.ReactNode;
  className?: string;
}

export function TouchGestureHandler({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50,
  children,
  className
}: TouchGestureProps) {
  const [touchStart, setTouchStart] = React.useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = React.useState<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    });
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const deltaX = touchStart.x - touchEnd.x;
    const deltaY = touchStart.y - touchEnd.y;

    const isLeftSwipe = deltaX > threshold;
    const isRightSwipe = deltaX < -threshold;
    const isUpSwipe = deltaY > threshold;
    const isDownSwipe = deltaY < -threshold;

    if (isLeftSwipe && onSwipeLeft) onSwipeLeft();
    if (isRightSwipe && onSwipeRight) onSwipeRight();
    if (isUpSwipe && onSwipeUp) onSwipeUp();
    if (isDownSwipe && onSwipeDown) onSwipeDown();
  };

  return (
    <div
      className={cn("touch-none", className)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {children}
    </div>
  );
}

// Performance monitoring for mobile
export function useMobilePerformance() {
  const [performanceMetrics, setPerformanceMetrics] = React.useState({
    loadTime: 0,
    memoryUsage: 0,
    isSlowConnection: false
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Monitor load time
    const loadTime = performance.now();
    setPerformanceMetrics(prev => ({ ...prev, loadTime }));

    // Monitor memory usage (if available)
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      setPerformanceMetrics(prev => ({ 
        ...prev, 
        memoryUsage: memory.usedJSHeapSize / memory.totalJSHeapSize 
      }));
    }

    // Monitor connection speed
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      const isSlowConnection = connection.effectiveType === 'slow-2g' || 
                              connection.effectiveType === '2g' ||
                              connection.saveData;
      setPerformanceMetrics(prev => ({ ...prev, isSlowConnection }));
    }
  }, []);

  return performanceMetrics;
}
