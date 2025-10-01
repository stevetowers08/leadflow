/**
 * Simplified Popup Context - Optimized for Performance
 * 
 * This replaces the complex PopupNavigationContext with a minimal, efficient system
 * that only manages essential popup state without unnecessary complexity.
 */

import React, { createContext, useContext, useCallback, ReactNode } from 'react';

export type EntityType = 'lead' | 'company' | 'job';

interface PopupState {
  isOpen: boolean;
  entityType: EntityType | null;
  entityId: string | null;
  entityName: string | null;
}

interface PopupActions {
  openPopup: (type: EntityType, id: string, name: string) => void;
  closePopup: () => void;
}

interface PopupContextType extends PopupState, PopupActions {}

const PopupContext = createContext<PopupContextType | undefined>(undefined);

export const usePopup = () => {
  const context = useContext(PopupContext);
  if (context === undefined) {
    throw new Error('usePopup must be used within a PopupProvider');
  }
  return context;
};

interface PopupProviderProps {
  children: ReactNode;
}

export const PopupProvider: React.FC<PopupProviderProps> = ({ children }) => {
  const [popupState, setPopupState] = React.useState<PopupState>({
    isOpen: false,
    entityType: null,
    entityId: null,
    entityName: null
  });

  const openPopup = useCallback((type: EntityType, id: string, name: string) => {
    setPopupState({
      isOpen: true,
      entityType: type,
      entityId: id,
      entityName: name
    });
  }, []);

  const closePopup = useCallback(() => {
    setPopupState({
      isOpen: false,
      entityType: null,
      entityId: null,
      entityName: null
    });
  }, []);

  const value: PopupContextType = {
    ...popupState,
    openPopup,
    closePopup
  };

  return (
    <PopupContext.Provider value={value}>
      {children}
    </PopupContext.Provider>
  );
};
