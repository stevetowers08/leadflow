import React, {
  createContext,
  useContext,
  useCallback,
  ReactNode,
} from 'react';
import {
  validatePopupState,
  debugPopupState,
  safeStateUpdate,
  isValidEntityType,
  isValidEntityId,
} from '@/utils/popupStateValidation';

/**
 * Centralized navigation context for all popup interactions
 * Follows best practices for:
 * - Single responsibility principle
 * - Centralized state management
 * - Type safety
 * - Accessibility
 * - Performance optimization
 */

export interface NavigationState {
  currentEntity: {
    type: 'lead' | 'company' | 'job' | null;
    id: string | null;
    name: string | null;
  };
  popupState: {
    isOpen: boolean;
  };
  navigationHistory: Array<{
    type: 'lead' | 'company' | 'job';
    id: string;
    name: string;
    timestamp: number;
  }>;
}

export interface NavigationActions {
  navigateToEntity: (
    type: 'lead' | 'company' | 'job',
    id: string,
    name: string
  ) => void;
  navigateBack: () => void;
  clearHistory: () => void;
  canNavigateBack: () => boolean;
  openPopup: (
    type: 'lead' | 'company' | 'job',
    id: string,
    name: string
  ) => void;
  closePopup: () => void;
}

interface PopupNavigationContextType
  extends NavigationState,
    NavigationActions {
  onAssignmentChange?: () => void;
}

const PopupNavigationContext = createContext<
  PopupNavigationContextType | undefined
>(undefined);

interface PopupNavigationProviderProps {
  children: ReactNode;
  onEntityChange?: (
    type: 'lead' | 'company' | 'job',
    id: string,
    name: string
  ) => void;
  onAssignmentChange?: () => void;
}

export const PopupNavigationProvider: React.FC<
  PopupNavigationProviderProps
> = ({ children, onEntityChange, onAssignmentChange }) => {
  const [currentEntity, setCurrentEntity] = React.useState<
    NavigationState['currentEntity']
  >({
    type: null,
    id: null,
    name: null,
  });

  const [popupState, setPopupState] = React.useState<
    NavigationState['popupState']
  >({
    isOpen: false,
  });

  const [navigationHistory, setNavigationHistory] = React.useState<
    NavigationState['navigationHistory']
  >([]);

  const navigateToEntity = useCallback(
    (type: 'lead' | 'company' | 'job', id: string, name: string) => {
      // Add current entity to history if it exists
      if (currentEntity.type && currentEntity.id && currentEntity.name) {
        setNavigationHistory(prev => [
          ...prev,
          {
            type: currentEntity.type,
            id: currentEntity.id,
            name: currentEntity.name,
            timestamp: Date.now(),
          },
        ]);
      }

      // Update current entity
      setCurrentEntity({ type, id, name });

      // Notify parent component
      onEntityChange?.(type, id, name);
    },
    [currentEntity, onEntityChange]
  );

  const openPopup = useCallback(
    (type: 'lead' | 'company' | 'job', id: string, name: string) => {
      // Validate inputs
      if (!isValidEntityType(type)) {
        console.error('Invalid entity type:', type);
        return;
      }

      if (!isValidEntityId(id)) {
        console.error('Invalid entity ID:', id);
        return;
      }

      // Set the entity data first
      navigateToEntity(type, id, name);

      // Open the popup immediately after setting entity data
      setPopupState({ isOpen: true });
    },
    [navigateToEntity]
  );

  const closePopup = useCallback(() => {
    setPopupState({ isOpen: false });
    setCurrentEntity({ type: null, id: null, name: null });
  }, []);

  const navigateBack = useCallback(() => {
    if (navigationHistory.length > 0) {
      const previousEntity = navigationHistory[navigationHistory.length - 1];
      setNavigationHistory(prev => prev.slice(0, -1));
      setCurrentEntity({
        type: previousEntity.type,
        id: previousEntity.id,
        name: previousEntity.name,
      });
      onEntityChange?.(
        previousEntity.type,
        previousEntity.id,
        previousEntity.name
      );
    }
  }, [navigationHistory, onEntityChange]);

  const clearHistory = useCallback(() => {
    setNavigationHistory([]);
  }, []);

  const canNavigateBack = useCallback(() => {
    return navigationHistory.length > 0;
  }, [navigationHistory]);

  const value: PopupNavigationContextType = {
    currentEntity,
    popupState,
    navigationHistory,
    navigateToEntity,
    navigateBack,
    clearHistory,
    canNavigateBack,
    openPopup,
    closePopup,
    onAssignmentChange,
  };

  return (
    <PopupNavigationContext.Provider value={value}>
      {children}
    </PopupNavigationContext.Provider>
  );
};

/**
 * Hook to access popup navigation context
 * Provides type safety and error handling
 */
export const usePopupNavigation = (): PopupNavigationContextType => {
  const context = useContext(PopupNavigationContext);

  if (context === undefined) {
    throw new Error(
      'usePopupNavigation must be used within a PopupNavigationProvider'
    );
  }

  return context;
};

/**
 * Hook for entity-specific navigation actions
 * Provides convenient methods for common navigation patterns
 */
export const useEntityNavigation = () => {
  const { navigateToEntity, navigateBack, canNavigateBack } =
    usePopupNavigation();

  return {
    navigateToLead: useCallback(
      (id: string, name: string) => {
        navigateToEntity('lead', id, name);
      },
      [navigateToEntity]
    ),

    navigateToCompany: useCallback(
      (id: string, name: string) => {
        navigateToEntity('company', id, name);
      },
      [navigateToEntity]
    ),

    navigateToJob: useCallback(
      (id: string, name: string) => {
        navigateToEntity('job', id, name);
      },
      [navigateToEntity]
    ),

    navigateBack,
    canNavigateBack,
  };
};
