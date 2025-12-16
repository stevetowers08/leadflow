import { toast as sonnerToast } from 'sonner';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastOptions {
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  cancel?: {
    label: string;
    onClick?: () => void;
  };
}

const toast = {
  success: (message: string, options?: ToastOptions) => {
    return sonnerToast.success(message, {
      description: options?.description,
      duration: options?.duration || 5000,
      action: options?.action
        ? {
            label: options.action.label,
            onClick: options.action.onClick,
          }
        : undefined,
      cancel: options?.cancel
        ? options.cancel.onClick
          ? {
              label: options.cancel.label,
              onClick: options.cancel.onClick,
            }
          : undefined
        : undefined,
    });
  },

  error: (message: string, options?: ToastOptions) => {
    return sonnerToast.error(message, {
      description: options?.description,
      duration: options?.duration || 7000,
      action: options?.action
        ? {
            label: options.action.label,
            onClick: options.action.onClick,
          }
        : undefined,
      cancel: options?.cancel
        ? options.cancel.onClick
          ? {
              label: options.cancel.label,
              onClick: options.cancel.onClick,
            }
          : undefined
        : undefined,
    });
  },

  warning: (message: string, options?: ToastOptions) => {
    return sonnerToast.warning(message, {
      description: options?.description,
      duration: options?.duration || 5000,
      action: options?.action
        ? {
            label: options.action.label,
            onClick: options.action.onClick,
          }
        : undefined,
      cancel: options?.cancel
        ? options.cancel.onClick
          ? {
              label: options.cancel.label,
              onClick: options.cancel.onClick,
            }
          : undefined
        : undefined,
    });
  },

  info: (message: string, options?: ToastOptions) => {
    return sonnerToast.info(message, {
      description: options?.description,
      duration: options?.duration || 5000,
      action: options?.action
        ? {
            label: options.action.label,
            onClick: options.action.onClick,
          }
        : undefined,
      cancel: options?.cancel
        ? options.cancel.onClick
          ? {
              label: options.cancel.label,
              onClick: options.cancel.onClick,
            }
          : undefined
        : undefined,
    });
  },

  message: (message: string, options?: ToastOptions) => {
    return sonnerToast(message, {
      description: options?.description,
      duration: options?.duration || 5000,
      action: options?.action
        ? {
            label: options.action.label,
            onClick: options.action.onClick,
          }
        : undefined,
      cancel: options?.cancel
        ? options.cancel.onClick
          ? {
              label: options.cancel.label,
              onClick: options.cancel.onClick,
            }
          : undefined
        : undefined,
    });
  },

  promise: <T>(
    promise: Promise<T>,
    {
      loading,
      success,
      error,
    }: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: unknown) => string);
    }
  ) => {
    return sonnerToast.promise(promise, {
      loading,
      success,
      error,
    });
  },

  dismiss: (toastId?: string | number) => {
    sonnerToast.dismiss(toastId);
  },
};

export { toast };
