import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import {
  ConfirmationDialog,
  ConfirmationConfig,
  ConfirmationType,
} from '@/components/ui/confirmation-dialog';

interface ConfirmationState {
  isOpen: boolean;
  config: ConfirmationConfig | null;
  onConfirm: (() => void) | null;
  onCancel: (() => void) | null;
  isLoading: boolean;
  customContent: ReactNode | null;
}

interface ConfirmationContextType {
  showConfirmation: (
    config: ConfirmationConfig,
    onConfirm: () => void | Promise<void>,
    onCancel?: () => void,
    customContent?: ReactNode
  ) => void;
  showQuickConfirmation: (
    type: ConfirmationType,
    onConfirm: () => void | Promise<void>,
    options?: {
      customTitle?: string;
      customDescription?: string;
      customConfirmText?: string;
      customCancelText?: string;
      customContent?: ReactNode;
    }
  ) => void;
  hideConfirmation: () => void;
  setLoading: (loading: boolean) => void;
}

const ConfirmationContext = createContext<ConfirmationContextType | undefined>(
  undefined
);

interface ConfirmationProviderProps {
  children: ReactNode;
}

export function ConfirmationProvider({ children }: ConfirmationProviderProps) {
  const [state, setState] = useState<ConfirmationState>({
    isOpen: false,
    config: null,
    onConfirm: null,
    onCancel: null,
    isLoading: false,
    customContent: null,
  });

  const showConfirmation = useCallback(
    (
      config: ConfirmationConfig,
      onConfirm: () => void | Promise<void>,
      onCancel?: () => void,
      customContent?: ReactNode
    ) => {
      setState({
        isOpen: true,
        config,
        onConfirm: async () => {
          try {
            await onConfirm();
            setState(prev => ({ ...prev, isOpen: false }));
          } catch (error) {
            console.error('Confirmation action failed:', error);
            // Keep dialog open on error, let the calling component handle the error
          }
        },
        onCancel: () => {
          onCancel?.();
          setState(prev => ({ ...prev, isOpen: false }));
        },
        isLoading: false,
        customContent: customContent || null,
      });
    },
    []
  );

  const showQuickConfirmation = useCallback(
    (
      type: ConfirmationType,
      onConfirm: () => void | Promise<void>,
      options?: {
        customTitle?: string;
        customDescription?: string;
        customConfirmText?: string;
        customCancelText?: string;
        customContent?: ReactNode;
      }
    ) => {
      const {
        confirmationConfigs,
      } = require('@/components/ui/confirmation-dialog');
      const baseConfig = confirmationConfigs[type];

      const config: ConfirmationConfig = {
        ...baseConfig,
        title: options?.customTitle || baseConfig.title,
        description: options?.customDescription || baseConfig.description,
        confirmText: options?.customConfirmText || baseConfig.confirmText,
        cancelText: options?.customCancelText || baseConfig.cancelText,
      };

      showConfirmation(config, onConfirm, undefined, options?.customContent);
    },
    [showConfirmation]
  );

  const hideConfirmation = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: false }));
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, isLoading: loading }));
  }, []);

  const handleConfirm = useCallback(async () => {
    if (state.onConfirm) {
      setState(prev => ({ ...prev, isLoading: true }));
      try {
        await state.onConfirm();
      } finally {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    }
  }, [state.onConfirm]);

  const handleCancel = useCallback(() => {
    if (state.onCancel) {
      state.onCancel();
    }
  }, [state.onCancel]);

  const contextValue: ConfirmationContextType = {
    showConfirmation,
    showQuickConfirmation,
    hideConfirmation,
    setLoading,
  };

  return (
    <ConfirmationContext.Provider value={contextValue}>
      {children}
      {state.config && (
        <ConfirmationDialog
          isOpen={state.isOpen}
          onClose={handleCancel}
          onConfirm={handleConfirm}
          config={state.config}
          isLoading={state.isLoading}
          customContent={state.customContent}
        />
      )}
    </ConfirmationContext.Provider>
  );
}

export function useConfirmation(): ConfirmationContextType {
  const context = useContext(ConfirmationContext);
  if (context === undefined) {
    throw new Error(
      'useConfirmation must be used within a ConfirmationProvider'
    );
  }
  return context;
}

// Convenience hooks for common confirmation types
export function useDeleteConfirmation() {
  const { showQuickConfirmation } = useConfirmation();

  return useCallback(
    (
      onConfirm: () => void | Promise<void>,
      options?: {
        customTitle?: string;
        customDescription?: string;
        itemName?: string;
      }
    ) => {
      const title = options?.customTitle || 'Delete Item';
      const description =
        options?.customDescription ||
        `Are you sure you want to delete ${options?.itemName ? `this ${options.itemName}` : 'this item'}? This action cannot be undone.`;

      showQuickConfirmation('delete', onConfirm, {
        customTitle: title,
        customDescription: description,
      });
    },
    [showQuickConfirmation]
  );
}

export function useAssignmentConfirmation() {
  const { showQuickConfirmation } = useConfirmation();

  return useCallback(
    (
      onConfirm: () => void | Promise<void>,
      options?: {
        customTitle?: string;
        customDescription?: string;
        itemName?: string;
        newAssignee?: string;
      }
    ) => {
      const title = options?.customTitle || 'Change Assignment';
      const description =
        options?.customDescription ||
        `Are you sure you want to ${options?.newAssignee ? `assign this ${options.itemName || 'item'} to ${options.newAssignee}` : 'change the assignment for this item'}?`;

      showQuickConfirmation('assignment', onConfirm, {
        customTitle: title,
        customDescription: description,
        customConfirmText: options?.newAssignee
          ? 'Assign'
          : 'Change Assignment',
      });
    },
    [showQuickConfirmation]
  );
}

export function useSignOutConfirmation() {
  const { showQuickConfirmation } = useConfirmation();

  return useCallback(
    (onConfirm: () => void | Promise<void>) => {
      showQuickConfirmation('signout', onConfirm);
    },
    [showQuickConfirmation]
  );
}

export function useSaveConfirmation() {
  const { showQuickConfirmation } = useConfirmation();

  return useCallback(
    (
      onConfirm: () => void | Promise<void>,
      options?: {
        customTitle?: string;
        customDescription?: string;
      }
    ) => {
      showQuickConfirmation('save', onConfirm, options);
    },
    [showQuickConfirmation]
  );
}

export function useAutomationConfirmation() {
  const { showQuickConfirmation } = useConfirmation();

  return useCallback(
    (
      onConfirm: () => void | Promise<void>,
      options?: {
        customTitle?: string;
        customDescription?: string;
        leadCount?: number;
      }
    ) => {
      const title = options?.customTitle || 'Start Automation';
      const description =
        options?.customDescription ||
        `Are you sure you want to start the automation process? ${options?.leadCount ? `This will begin contacting ${options.leadCount} lead${options.leadCount !== 1 ? 's' : ''}.` : 'This will begin contacting the selected leads.'}`;

      showQuickConfirmation('automation', onConfirm, {
        customTitle: title,
        customDescription: description,
      });
    },
    [showQuickConfirmation]
  );
}

export function useBulkActionConfirmation() {
  const { showQuickConfirmation } = useConfirmation();

  return useCallback(
    (
      onConfirm: () => void | Promise<void>,
      options?: {
        customTitle?: string;
        customDescription?: string;
        actionName?: string;
        itemCount?: number;
      }
    ) => {
      const title = options?.customTitle || 'Bulk Action';
      const description =
        options?.customDescription ||
        `Are you sure you want to ${options?.actionName || 'perform this action'} ${options?.itemCount ? `on ${options.itemCount} selected item${options.itemCount !== 1 ? 's' : ''}` : 'on the selected items'}?`;

      showQuickConfirmation('bulk-action', onConfirm, {
        customTitle: title,
        customDescription: description,
        customConfirmText: options?.actionName || 'Continue',
      });
    },
    [showQuickConfirmation]
  );
}
