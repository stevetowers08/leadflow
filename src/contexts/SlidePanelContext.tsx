'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

type PanelType = 'notifications' | 'activity' | 'notes' | null;

interface SlidePanelContextType {
  openPanel: PanelType;
  setOpenPanel: (panel: PanelType) => void;
  closePanel: () => void;
}

const SlidePanelContext = createContext<SlidePanelContextType | undefined>(
  undefined
);

export function SlidePanelProvider({ children }: { children: React.ReactNode }) {
  const [openPanel, setOpenPanelState] = useState<PanelType>(null);

  const setOpenPanel = useCallback((panel: PanelType) => {
    setOpenPanelState(panel);
  }, []);

  const closePanel = useCallback(() => {
    setOpenPanelState(null);
  }, []);

  return (
    <SlidePanelContext.Provider value={{ openPanel, setOpenPanel, closePanel }}>
      {children}
    </SlidePanelContext.Provider>
  );
}

export function useSlidePanel() {
  const context = useContext(SlidePanelContext);
  if (context === undefined) {
    throw new Error('useSlidePanel must be used within SlidePanelProvider');
  }
  return context;
}






