import React, { useRef, useEffect, useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { LoadingState } from '@/components/LoadingStates';
import { cn } from '@/lib/utils';
import { getScoringInfo } from '@/utils/scoringSystem';
import { StatusBadge } from '@/components/StatusBadge';

interface ScoringDisplay {
  label: string;
  value: string | number;
  type: 'priority' | 'lead_score' | 'company_score' | 'job_score';
}

interface PopupModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  statusBadge?: React.ReactNode;
  statusLabel?: string;
  scoringDisplay?: ScoringDisplay | null;
  className?: string;
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: (() => void) | null;
}

export const PopupModal: React.FC<PopupModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  children,
  statusBadge,
  statusLabel = "Status",
  scoringDisplay,
  className = "",
  isLoading = false,
  error = null,
  onRetry = null
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      // Store previous focus
      previousFocusRef.current = document.activeElement as HTMLElement;
      
      // Focus first focusable element
      const firstFocusable = modalRef.current?.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement;
      
      // Small delay to ensure modal is rendered
      setTimeout(() => {
        firstFocusable?.focus();
      }, 100);
    } else {
      // Restore focus when closing
      previousFocusRef.current?.focus();
    }
  }, [isOpen]);

  // Escape key handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  // Focus trapping
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const modal = modalRef.current;
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          lastElement?.focus();
          e.preventDefault();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          firstElement?.focus();
          e.preventDefault();
        }
      }
    };

    modal.addEventListener('keydown', handleTabKey);
    return () => modal.removeEventListener('keydown', handleTabKey);
  }, [isOpen]);

  // Animation handling
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 200); // Match animation duration
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={modalRef}
      className={cn(
        "fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 sm:p-8",
        "transition-all duration-200 ease-in-out",
        isAnimating ? "opacity-100" : "opacity-0"
      )}
      role="dialog"
      aria-modal="true"
      aria-labelledby="popup-title"
      aria-describedby="popup-description"
      onClick={(e) => {
        // Close on backdrop click
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div className={cn(
        "bg-gray-100 rounded-xl shadow-2xl w-full max-h-[95vh] overflow-hidden flex flex-col",
        "max-w-4xl", // Default size
        "sm:max-w-4xl", // Small screens
        "md:max-w-5xl", // Medium screens
        "lg:max-w-6xl", // Large screens
        "transition-all duration-200 ease-in-out transform",
        isAnimating ? "scale-100 opacity-100" : "scale-95 opacity-0",
        className
      )}>
        {/* Header with responsive padding */}
        <div className="px-4 sm:px-6 py-3 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="flex-shrink-0" aria-hidden="true">
                {isLoading ? (
                  <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
                ) : (
                  icon
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h2 id="popup-title" className="text-lg font-semibold text-black mb-0.5">
                  {isLoading ? (
                    <div className="h-6 bg-gray-200 rounded animate-pulse w-32" />
                  ) : (
                    title
                  )}
                </h2>
                {subtitle && (
                  <p id="popup-description" className="text-sm font-medium text-gray-600">
                    {isLoading ? (
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-48" />
                    ) : (
                      subtitle
                    )}
                  </p>
                )}
              </div>
            </div>

            {/* Status and AI Score - responsive layout */}
            <div className="flex items-center gap-2 sm:gap-4 ml-3 sm:ml-6">
              {isLoading ? (
                <>
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-16" />
                  <div className="h-8 bg-gray-200 rounded animate-pulse w-20" />
                </>
              ) : (
                <>
                  {statusBadge && (
                    <div className="flex items-center gap-1 sm:gap-2">
                      <span className="text-xs font-medium text-gray-500 hidden sm:inline">{statusLabel}</span>
                      {statusBadge}
                    </div>
                  )}
                  {scoringDisplay && (() => {
                    const scoringInfo = getScoringInfo(scoringDisplay.type, scoringDisplay.value);
                    const isNumeric = scoringDisplay.type === 'company_score' || scoringDisplay.type === 'job_score';
                    const isLeadScore = scoringDisplay.type === 'lead_score';
                    
                    return (
                      <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2 rounded-lg">
                        <span className="text-xs font-medium text-gray-500 hidden sm:inline">{scoringDisplay.label}</span>
                        {isLeadScore ? (
                          // LEAD SCORE: Use StatusBadge for proper styling
                          <StatusBadge status={scoringDisplay.value as string} size="sm" />
                        ) : isNumeric ? (
                          // NUMERIC DESIGN: Simple number display
                          <span className={cn("text-sm font-bold", scoringInfo.color)}>
                            {scoringInfo.badge}
                          </span>
                        ) : (
                          // BADGE DESIGN: Colored badge for words
                          <span className={cn(
                            "text-sm font-bold px-2 py-1 rounded-md border",
                            scoringInfo.color
                          )}>
                            {scoringInfo.badge}
                          </span>
                        )}
                      </div>
                    );
                  })()}
                </>
              )}
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                aria-label="Close dialog"
                disabled={isLoading}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content with responsive padding */}
        <div className="px-4 sm:px-6 py-4 space-y-5 flex-1 overflow-y-auto min-h-0">
          {error ? (
            <LoadingState
              isLoading={false}
              error={error.message || 'Something went wrong while loading this information.'}
              onRetry={onRetry}
              errorText="Failed to load data"
              className="h-64"
            />
          ) : isLoading ? (
            <LoadingState
              isLoading={true}
              loadingText="Loading data..."
              variant="skeleton"
              className="h-64"
            />
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  );
};

