/**
 * Mobile-Optimized Image Component
 * 2025 Best Practices: Lazy loading, responsive sizes, modern formats
 */

'use client';

import { cn } from '@/lib/utils';
import { useState, useEffect, useRef } from 'react';

export interface MobileImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
  fallback?: React.ReactNode;
  aspectRatio?: string;
}

/**
 * Mobile-optimized image component with lazy loading and responsive sizing
 * Uses Intersection Observer for performance
 */
export function MobileImage({
  src,
  alt,
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  className,
  fallback,
  aspectRatio,
  ...props
}: MobileImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (priority || shouldLoad) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before entering viewport
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [priority, shouldLoad]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
  };

  if (hasError && fallback) {
    return <>{fallback}</>;
  }

  return (
    <div
      className={cn('relative overflow-hidden', className)}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {!isLoaded && !hasError && (
        <div className='absolute inset-0 bg-muted animate-pulse' />
      )}
      <img
        ref={imgRef}
        src={shouldLoad ? src : undefined}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding='async'
        className={cn(
          'w-full h-full object-cover transition-opacity duration-300',
          isLoaded ? 'opacity-100' : 'opacity-0',
          'touch-manipulation'
        )}
        onLoad={handleLoad}
        onError={handleError}
        sizes={sizes}
        {...props}
      />
    </div>
  );
}
