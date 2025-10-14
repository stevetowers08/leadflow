import { StatusBadge } from '@/components/StatusBadge';
import { LoadingState } from '@/components/loading/LoadingStates';
import { DropdownOption } from '@/hooks/useDropdownOptions';
import { cn } from '@/lib/utils';
import { getStatusDisplayText } from '@/utils/statusUtils';
import { X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { UserAssignmentDisplay } from './UserAssignmentDisplay';

interface PopupModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: (() => void) | null;
  companyLogo?: string;
  companyName?: string;
  actionButton?: React.ReactNode;
  // Company-specific props
  entityType?: 'company' | 'lead' | 'job';
  entityId?: string;
  currentStatus?: string;
  currentPriority?: string;
  currentPipelineStage?: string;
  onStatusChange?: (status: string) => void;
  onPriorityChange?: (priority: string) => void;
  onPipelineStageChange?: (stage: string) => void;
  // Favorite icon props
  favoriteButton?: React.ReactNode;
  // Automation badge props
  automationStatus?: 'automated' | 'pending' | 'manual';
  // Pipeline stage restrictions
  canChangeStage?: boolean;
  // User assignment props
  ownerId?: string | null;
  onAssignmentChange?: () => void;
}

export const PopupModal: React.FC<PopupModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  children,
  className = "",
  isLoading = false,
  error = null,
  onRetry = null,
  companyLogo,
  companyName,
  actionButton,
  entityType,
  entityId,
  currentStatus,
  currentPriority,
  currentPipelineStage,
  onStatusChange,
  onPriorityChange,
  onPipelineStageChange,
  favoriteButton,
  automationStatus,
  canChangeStage,
  ownerId,
  onAssignmentChange
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Company status options (aligned with pipeline)
  const companyStatusOptions: DropdownOption[] = [
    { value: 'new', label: 'New' },
    { value: 'prospect', label: 'Prospect' },
    { value: 'qualified', label: 'Qualified' },
    { value: 'active', label: getStatusDisplayText('active') },
    { value: 'inactive', label: getStatusDisplayText('inactive') }
  ];

  const pipelineStageOptions: DropdownOption[] = [
    { value: 'new_lead', label: getStatusDisplayText('new_lead') },
    { value: 'automated', label: getStatusDisplayText('automated') },
    { value: 'replied', label: getStatusDisplayText('replied') },
    { value: 'meeting_scheduled', label: getStatusDisplayText('meeting_scheduled') },
    { value: 'proposal_sent', label: getStatusDisplayText('proposal_sent') },
    { value: 'negotiation', label: getStatusDisplayText('negotiation') },
    { value: 'closed_won', label: getStatusDisplayText('closed_won') },
    { value: 'closed_lost', label: getStatusDisplayText('closed_lost') },
    { value: 'on_hold', label: getStatusDisplayText('on_hold') }
  ];

  // Priority options
  const priorityOptions: DropdownOption[] = [
    { value: 'LOW', label: getStatusDisplayText('LOW') },
    { value: 'MEDIUM', label: getStatusDisplayText('MEDIUM') },
    { value: 'HIGH', label: getStatusDisplayText('HIGH') },
    { value: 'VERY HIGH', label: getStatusDisplayText('VERY HIGH') }
  ];

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
        "bg-gray-100 rounded-xl shadow-2xl w-full max-h-[90vh] overflow-hidden flex flex-col",
        // Mobile-first responsive sizing
        "max-w-[95vw] sm:max-w-[90vw] md:max-w-[85vw] lg:max-w-5xl",
        "transition-all duration-200 ease-in-out transform",
        isAnimating ? "scale-100 opacity-100" : "scale-95 opacity-0",
        className
      )}>
        {/* Modern Header Design */}
        <div className="pl-4 pr-4 sm:pl-8 sm:pr-8 py-4 sm:py-6 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            {/* Left Side - Entity Info */}
            <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
              {/* Company Logo - Square */}
              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center">
                {isLoading ? (
                  <div className="w-10 h-10 bg-gray-200 rounded animate-pulse" />
                ) : companyLogo ? (
                  <img 
                    src={companyLogo} 
                    alt={`${companyName} logo`}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <span className="text-xs text-gray-400 font-medium">Logo</span>
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h2 id="popup-title" className="text-sm font-semibold text-gray-900 leading-tight truncate">
                  {isLoading ? (
                    <div className="h-5 bg-gray-200 rounded animate-pulse w-40" />
                  ) : (
                    title
                  )}
                </h2>
                {subtitle && (
                  <p id="popup-description" className="text-xs font-medium text-gray-400 leading-tight truncate">
                    {isLoading ? (
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-56" />
                    ) : (
                      subtitle
                    )}
                  </p>
                )}
              </div>
              
              {/* User Assignment Display (for all entity types except leads) */}
              {entityType && entityType !== 'lead' && (
                <div className="flex-shrink-0 h-8 flex items-center">
                  <UserAssignmentDisplay
                    ownerId={ownerId}
                    entityId={entityId || ''}
                    entityType={entityType}
                    onAssignmentChange={onAssignmentChange}
                  />
                </div>
              )}
              

              {/* Favorite Button - Same height as dropdowns */}
              <div className="flex-shrink-0 h-8 flex items-center">
                {favoriteButton}
              </div>
            </div>
            
            {/* Remove the separate favorite button container */}

            {/* Center - Status Badge for leads */}
            {entityType === 'lead' && (
              <div className="flex items-center gap-3">
                <StatusBadge status={currentStatus || "new"} size="sm" />
              </div>
            )}

            {/* Center - Pipeline Stage, Priority Dropdowns and Automation Badge (only for companies) */}
            {entityType === 'company' && (
              <div className="flex items-center gap-3">
                {/* Pipeline Stage Badge - Always visible, clickable only when allowed */}
                <div className={cn(
                  "w-40 px-3 py-2 rounded-md text-xs font-medium h-8 flex items-center justify-center cursor-pointer transition-colors border",
                  canChangeStage 
                    ? "bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-800" 
                    : "bg-gray-100 border-gray-200 text-gray-600 cursor-default"
                )}
                onClick={canChangeStage ? () => {
                  // Logical stage progression based on current stage
                  const stageMap = {
                    'new_lead': getStatusDisplayText('new_lead'),
                    'automated': getStatusDisplayText('automated'), 
                    'replied': getStatusDisplayText('replied'),
                    'meeting_scheduled': getStatusDisplayText('meeting_scheduled'),
                    'proposal_sent': getStatusDisplayText('proposal_sent'),
                    'negotiation': getStatusDisplayText('negotiation'),
                    'closed_won': getStatusDisplayText('closed_won'),
                    'closed_lost': getStatusDisplayText('closed_lost'),
                    'on_hold': getStatusDisplayText('on_hold')
                  };
                  
                  const currentStage = currentPipelineStage || 'new_lead';
                  let nextStage = '';
                  
                  // Define logical next stages
                  switch (currentStage) {
                    case 'new_lead':
                      nextStage = 'replied'; // Skip automated, go directly to replied
                      break;
                    case 'automated':
                      nextStage = 'replied';
                      break;
                    case 'replied':
                      nextStage = 'meeting_scheduled';
                      break;
                    case 'meeting_scheduled':
                      nextStage = 'proposal_sent';
                      break;
                    case 'proposal_sent':
                      nextStage = 'negotiation';
                      break;
                    case 'negotiation':
                      nextStage = 'closed_won';
                      break;
                    default:
                      return; // Don't allow changes from advanced stages
                  }
                  
                  if (window.confirm(`Move from "${stageMap[currentStage]}" to "${stageMap[nextStage]}"?`)) {
                    onPipelineStageChange?.(nextStage);
                  }
                } : undefined}
                >
                  {getStatusDisplayText(currentPipelineStage || 'new_lead')}
                </div>
              </div>
            )}

            {/* Right Side - Actions */}
            <div className="flex items-center gap-2 ml-4">
              {actionButton}
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
                aria-label="Close dialog"
                disabled={isLoading}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Content with responsive padding */}
        <div className="px-4 sm:px-8 lg:px-10 py-4 sm:py-8 space-y-4 flex-1 overflow-y-auto min-h-[300px] sm:min-h-[400px]">
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

