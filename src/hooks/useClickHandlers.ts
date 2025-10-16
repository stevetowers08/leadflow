import { useCallback } from 'react';
import { useEntityNavigation } from '@/contexts/PopupNavigationContext';

/**
 * Fallback navigation handlers for when context is not available
 */
const createFallbackHandlers = () => ({
  navigateToLead: (id: string, name: string) => {
    console.warn(
      'PopupNavigationProvider not available, using fallback navigation'
    );
    // Fallback: could open in new tab or show alert
    window.open(`/people/${id}`, '_blank');
  },
  navigateToCompany: (id: string, name: string) => {
    console.warn(
      'PopupNavigationProvider not available, using fallback navigation'
    );
    window.open(`/companies/${id}`, '_blank');
  },
  navigateToJob: (id: string, name: string) => {
    console.warn(
      'PopupNavigationProvider not available, using fallback navigation'
    );
    window.open(`/jobs/${id}`, '_blank');
  },
  navigateBack: () => {
    console.warn(
      'PopupNavigationProvider not available, using fallback navigation'
    );
    window.history.back();
  },
  canNavigateBack: () => window.history.length > 1,
});

/**
 * Standardized click handler hook for popup components
 * Follows best practices for:
 * - Consistent behavior across components
 * - Accessibility compliance
 * - Performance optimization
 * - Error handling
 */

export interface ClickHandlerOptions {
  preventDefault?: boolean;
  stopPropagation?: boolean;
  onError?: (error: Error) => void;
}

export interface EntityClickData {
  id: string;
  name: string;
  type: 'lead' | 'company' | 'job';
}

/**
 * Hook for creating standardized click handlers
 * Provides consistent behavior and error handling
 */
export const useClickHandlers = () => {
  // Try to use the navigation context, fallback if not available
  let navigationHandlers;
  try {
    navigationHandlers = useEntityNavigation();
  } catch (error) {
    console.warn(
      'PopupNavigationProvider not available, using fallback handlers'
    );
    navigationHandlers = createFallbackHandlers();
  }

  const { navigateToLead, navigateToCompany, navigateToJob } =
    navigationHandlers;

  const createEntityClickHandler = useCallback(
    (entityData: EntityClickData, options: ClickHandlerOptions = {}) => {
      return (event?: React.MouseEvent) => {
        try {
          // Handle event options
          if (options.preventDefault && event) {
            event.preventDefault();
          }
          if (options.stopPropagation && event) {
            event.stopPropagation();
          }

          // Navigate based on entity type
          switch (entityData.type) {
            case 'lead':
              navigateToLead(entityData.id, entityData.name);
              break;
            case 'company':
              navigateToCompany(entityData.id, entityData.name);
              break;
            case 'job':
              navigateToJob(entityData.id, entityData.name);
              break;
            default:
              throw new Error(`Unknown entity type: ${entityData.type}`);
          }
        } catch (error) {
          console.error('Navigation error:', error);
          options.onError?.(error as Error);
        }
      };
    },
    [navigateToLead, navigateToCompany, navigateToJob]
  );

  const createCompanyClickHandler = useCallback(
    (
      companyId: string,
      companyName: string,
      options: ClickHandlerOptions = {}
    ) => {
      return createEntityClickHandler(
        {
          id: companyId,
          name: companyName,
          type: 'company',
        },
        options
      );
    },
    [createEntityClickHandler]
  );

  const createLeadClickHandler = useCallback(
    (leadId: string, leadName: string, options: ClickHandlerOptions = {}) => {
      return createEntityClickHandler(
        {
          id: leadId,
          name: leadName,
          type: 'lead',
        },
        options
      );
    },
    [createEntityClickHandler]
  );

  const createJobClickHandler = useCallback(
    (jobId: string, jobTitle: string, options: ClickHandlerOptions = {}) => {
      return createEntityClickHandler(
        {
          id: jobId,
          name: jobTitle,
          type: 'job',
        },
        options
      );
    },
    [createEntityClickHandler]
  );

  return {
    createEntityClickHandler,
    createCompanyClickHandler,
    createLeadClickHandler,
    createJobClickHandler,
  };
};

/**
 * Hook for keyboard navigation support
 * Provides accessibility-compliant keyboard handlers
 */
export const useKeyboardNavigation = () => {
  // Try to use the navigation context, fallback if not available
  let navigationHandlers;
  try {
    navigationHandlers = useEntityNavigation();
  } catch (error) {
    console.warn(
      'PopupNavigationProvider not available, using fallback keyboard handlers'
    );
    navigationHandlers = createFallbackHandlers();
  }

  const { navigateBack, canNavigateBack } = navigationHandlers;

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      switch (event.key) {
        case 'Escape':
          // Close current popup or navigate back
          if (canNavigateBack()) {
            navigateBack();
          }
          break;
        case 'ArrowLeft':
          if (event.altKey && canNavigateBack()) {
            event.preventDefault();
            navigateBack();
          }
          break;
        default:
          // No action for other keys
          break;
      }
    },
    [navigateBack, canNavigateBack]
  );

  return {
    handleKeyDown,
    canNavigateBack,
  };
};
