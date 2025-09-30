/**
 * Mobile Testing and Debugging Component
 * Provides tools for testing mobile functionality
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useIsMobile, useIsTablet, useDeviceType } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface MobileTestProps {
  className?: string;
}

export function MobileTestPanel({ className }: MobileTestProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [testResults, setTestResults] = useState<Record<string, boolean>>({});
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const deviceType = useDeviceType();

  // Only show in development
  if (import.meta.env.DEV !== true) {
    return null;
  }

  const runTests = () => {
    const tests = {
      'Touch Targets': checkTouchTargets(),
      'Viewport Meta': checkViewportMeta(),
      'Responsive Images': checkResponsiveImages(),
      'Mobile Navigation': checkMobileNavigation(),
      'Form Inputs': checkFormInputs(),
      'Performance': checkPerformance(),
    };

    setTestResults(tests);
  };

  const checkTouchTargets = (): boolean => {
    const buttons = document.querySelectorAll('button, [role="button"], input[type="button"]');
    let allValid = true;

    buttons.forEach(button => {
      const rect = button.getBoundingClientRect();
      if (rect.height < 44 || rect.width < 44) {
        allValid = false;
      }
    });

    return allValid;
  };

  const checkViewportMeta = (): boolean => {
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    return viewportMeta !== null;
  };

  const checkResponsiveImages = (): boolean => {
    const images = document.querySelectorAll('img');
    let allResponsive = true;

    images.forEach(img => {
      if (!img.style.maxWidth && !img.classList.contains('w-full')) {
        allResponsive = false;
      }
    });

    return allResponsive;
  };

  const checkMobileNavigation = (): boolean => {
    const mobileNav = document.querySelector('[data-mobile-nav]');
    const hamburgerMenu = document.querySelector('[data-menu-button]');
    return mobileNav !== null || hamburgerMenu !== null;
  };

  const checkFormInputs = (): boolean => {
    const inputs = document.querySelectorAll('input, textarea, select');
    let allValid = true;

    inputs.forEach(input => {
      const rect = input.getBoundingClientRect();
      if (rect.height < 44) {
        allValid = false;
      }
    });

    return allValid;
  };

  const checkPerformance = (): boolean => {
    const loadTime = performance.now();
    return loadTime < 3000; // Less than 3 seconds
  };

  return (
    <>
      {/* Toggle Button */}
      <Button
        onClick={() => setIsVisible(!isVisible)}
        className={cn(
          "fixed bottom-20 right-4 z-50 lg:hidden",
          "bg-primary text-primary-foreground",
          "min-h-[44px] min-w-[44px] rounded-full shadow-lg",
          className
        )}
        aria-label="Toggle mobile test panel"
      >
        📱
      </Button>

      {/* Test Panel */}
      {isVisible && (
        <Card className={cn(
          "fixed bottom-20 right-4 z-50 w-80 max-h-96 overflow-auto",
          "lg:hidden shadow-2xl border-2"
        )}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center justify-between">
              Mobile Test Panel
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsVisible(false)}
                className="h-6 w-6 p-0"
              >
                ×
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Device Info */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-muted-foreground">Device Info</h4>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span>Type:</span>
                  <Badge variant="secondary" className="text-xs">
                    {deviceType || 'unknown'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Mobile:</span>
                  <Badge variant={isMobile ? "default" : "secondary"} className="text-xs">
                    {isMobile ? 'Yes' : 'No'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Tablet:</span>
                  <Badge variant={isTablet ? "default" : "secondary"} className="text-xs">
                    {isTablet ? 'Yes' : 'No'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Screen:</span>
                  <span className="text-xs">{window.innerWidth}×{window.innerHeight}</span>
                </div>
              </div>
            </div>

            {/* Test Results */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-muted-foreground">Tests</h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={runTests}
                  className="h-6 text-xs px-2"
                >
                  Run Tests
                </Button>
              </div>
              
              {Object.keys(testResults).length > 0 && (
                <div className="space-y-1">
                  {Object.entries(testResults).map(([test, passed]) => (
                    <div key={test} className="flex items-center justify-between text-xs">
                      <span>{test}</span>
                      <Badge 
                        variant={passed ? "default" : "destructive"} 
                        className="text-xs h-4"
                      >
                        {passed ? '✓' : '✗'}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-muted-foreground">Quick Actions</h4>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    document.body.style.transform = 'scale(0.5)';
                    document.body.style.transformOrigin = 'top left';
                    document.body.style.width = '200%';
                  }}
                  className="text-xs h-6"
                >
                  Zoom Test
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    document.body.style.transform = '';
                    document.body.style.transformOrigin = '';
                    document.body.style.width = '';
                  }}
                  className="text-xs h-6"
                >
                  Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}

// Mobile-specific error boundary
interface MobileErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export class MobileErrorBoundary extends React.Component<
  MobileErrorBoundaryProps,
  { hasError: boolean; error?: Error }
> {
  constructor(props: MobileErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Mobile Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <Card className="m-4">
          <CardContent className="p-4 text-center">
            <h3 className="text-lg font-semibold text-destructive mb-2">
              Something went wrong
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              There was an error loading this content on mobile.
            </p>
            <Button
              onClick={() => this.setState({ hasError: false })}
              variant="outline"
              size="sm"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}
