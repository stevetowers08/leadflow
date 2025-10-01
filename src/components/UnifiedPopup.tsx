import React from 'react';
import { EntityDetailPopup } from '@/components/crm/EntityDetailPopup';
import { usePopupNavigation } from '@/contexts/PopupNavigationContext';

const UnifiedPopupComponent: React.FC = () => {
  try {
    const { currentEntity, popupState, closePopup, navigateToEntity } = usePopupNavigation();

    if (!popupState.isOpen) {
      return null;
    }

    if (!currentEntity.type) {
      return null;
    }

    if (!currentEntity.id) {
      return null;
    }

    return (
      <EntityDetailPopup
        entityType={currentEntity.type}
        entityId={currentEntity.id}
        isOpen={popupState.isOpen}
        onClose={closePopup}
        onNavigateToEntity={navigateToEntity}
      />
    );
  } catch (error) {
    console.error('UnifiedPopup error:', error);
    return null;
  }
};

export const UnifiedPopup = React.memo(UnifiedPopupComponent);
