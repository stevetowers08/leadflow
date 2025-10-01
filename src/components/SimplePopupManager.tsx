/**
 * Simple Popup Manager - Replaces UnifiedPopup
 * 
 * This component manages the popup display with minimal complexity.
 * It directly renders the OptimizedPopup when needed.
 */

import React from 'react';
import { OptimizedPopup } from '@/components/OptimizedPopup';
import { usePopup } from '@/contexts/OptimizedPopupContext';

export const SimplePopupManager: React.FC = () => {
  const { isOpen, entityType, entityId, entityName, closePopup } = usePopup();

  if (!isOpen || !entityType || !entityId || !entityName) {
    return null;
  }

  return (
    <OptimizedPopup
      entityType={entityType}
      entityId={entityId}
      isOpen={isOpen}
      onClose={closePopup}
    />
  );
};
