/**
 * State validation utilities for popup system
 * Prevents invalid states and provides debugging information
 */

export interface PopupState {
  isOpen: boolean;
}

export interface EntityState {
  type: 'lead' | 'company' | 'job' | null;
  id: string | null;
  name: string | null;
}

export interface NavigationState {
  currentEntity: EntityState;
  popupState: PopupState;
}

/**
 * Validates popup state for consistency
 */
export const validatePopupState = (state: NavigationState): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check for invalid combinations
  if (state.popupState.isOpen && !state.currentEntity.type) {
    errors.push('Popup is open but entity type is null');
  }

  if (state.popupState.isOpen && !state.currentEntity.id) {
    errors.push('Popup is open but entity ID is null');
  }

  if (state.currentEntity.type && !state.currentEntity.id) {
    errors.push('Entity type is set but ID is null');
  }

  if (state.currentEntity.id && !state.currentEntity.type) {
    errors.push('Entity ID is set but type is null');
  }

  // Check for warnings
  if (state.currentEntity.type && !state.currentEntity.name) {
    warnings.push('Entity type and ID are set but name is null');
  }

  if (state.popupState.isOpen && state.currentEntity.type === null) {
    warnings.push('Popup is open but no entity is selected');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

/**
 * Debug utility for popup state
 */
export const debugPopupState = (state: NavigationState, context: string = 'Unknown') => {
  const validation = validatePopupState(state);
  
  console.group(`🔍 Popup State Debug - ${context}`);
  console.log('State:', state);
  console.log('Validation:', validation);
  
  if (validation.errors.length > 0) {
    console.error('❌ Errors:', validation.errors);
  }
  
  if (validation.warnings.length > 0) {
    console.warn('⚠️ Warnings:', validation.warnings);
  }
  
  if (validation.isValid && validation.warnings.length === 0) {
    console.log('✅ State is valid');
  }
  
  console.groupEnd();
};

/**
 * Safe state update utility
 */
export const safeStateUpdate = <T>(
  currentState: T,
  updates: Partial<T>,
  validator?: (newState: T) => boolean
): T => {
  const newState = { ...currentState, ...updates };
  
  if (validator && !validator(newState)) {
    console.warn('🔍 State update rejected by validator:', { currentState, updates, newState });
    return currentState;
  }
  
  return newState;
};

/**
 * Entity type validation
 */
export const isValidEntityType = (type: string): type is 'lead' | 'company' | 'job' => {
  return ['lead', 'company', 'job'].includes(type);
};

/**
 * Entity ID validation
 */
export const isValidEntityId = (id: string | null): boolean => {
  if (!id) return false;
  // Check if it's a valid UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};
