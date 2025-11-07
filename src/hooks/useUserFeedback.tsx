import React, { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface UserFeedbackState {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  dismissible?: boolean;
}

export interface UserFeedbackOptions {
  showToast?: boolean;
  showInline?: boolean;
  autoHide?: boolean;
  duration?: number;
  position?:
    | 'top-right'
    | 'top-left'
    | 'bottom-right'
    | 'bottom-left'
    | 'top-center'
    | 'bottom-center';
}

export function useUserFeedback(options: UserFeedbackOptions = {}) {
  const {
    showToast = true,
    showInline = false,
    autoHide = true,
    duration = 5000,
    position = 'top-right',
  } = options;

  const [feedback, setFeedback] = useState<UserFeedbackState | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { toast } = useToast();

  const showFeedback = useCallback(
    (state: UserFeedbackState) => {
      setFeedback(state);
      setIsVisible(true);

      if (showToast) {
        toast({
          title: state.title,
          description: state.message,
          variant: state.type === 'error' ? 'destructive' : 'default',
          duration: state.duration || duration,
        });
      }

      if (autoHide && (state.duration || duration)) {
        setTimeout(() => {
          setIsVisible(false);
          setTimeout(() => setFeedback(null), 300); // Wait for animation
        }, state.duration || duration);
      }
    },
    [showToast, autoHide, duration, toast]
  );

  const hideFeedback = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => setFeedback(null), 300);
  }, []);

  const showSuccess = useCallback(
    (title: string, message: string, options?: Partial<UserFeedbackState>) => {
      showFeedback({
        type: 'success',
        title,
        message,
        ...options,
      });
    },
    [showFeedback]
  );

  const showError = useCallback(
    (title: string, message: string, options?: Partial<UserFeedbackState>) => {
      showFeedback({
        type: 'error',
        title,
        message,
        ...options,
      });
    },
    [showFeedback]
  );

  const showWarning = useCallback(
    (title: string, message: string, options?: Partial<UserFeedbackState>) => {
      showFeedback({
        type: 'warning',
        title,
        message,
        ...options,
      });
    },
    [showFeedback]
  );

  const showInfo = useCallback(
    (title: string, message: string, options?: Partial<UserFeedbackState>) => {
      showFeedback({
        type: 'info',
        title,
        message,
        ...options,
      });
    },
    [showFeedback]
  );

  return {
    feedback,
    isVisible,
    showFeedback,
    hideFeedback,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
}

// Inline feedback component
export interface InlineFeedbackProps {
  feedback: UserFeedbackState | null;
  isVisible: boolean;
  onDismiss?: () => void;
  className?: string;
}

export const InlineFeedback: React.FC<InlineFeedbackProps> = ({
  feedback,
  isVisible,
  onDismiss,
  className,
}) => {
  if (!feedback || !isVisible) return null;

  const getFeedbackConfig = () => {
    switch (feedback.type) {
      case 'success':
        return {
          icon: CheckCircle,
          bgColor: 'bg-success/10',
          borderColor: 'border-green-200',
          iconColor: 'text-green-500',
          textColor: 'text-success',
          titleColor: 'text-green-900',
        };
      case 'error':
        return {
          icon: XCircle,
          bgColor: 'bg-destructive/10',
          borderColor: 'border-red-200',
          iconColor: 'text-destructive',
          textColor: 'text-red-800',
          titleColor: 'text-red-900',
        };
      case 'warning':
        return {
          icon: AlertCircle,
          bgColor: 'bg-warning/10',
          borderColor: 'border-yellow-200',
          iconColor: 'text-yellow-500',
          textColor: 'text-yellow-800',
          titleColor: 'text-yellow-900',
        };
      case 'info':
        return {
          icon: Info,
          bgColor: 'bg-primary/10',
          borderColor: 'border-primary/20',
          iconColor: 'text-primary',
          textColor: 'text-primary',
          titleColor: 'text-blue-900',
        };
    }
  };

  const config = getFeedbackConfig();
  const IconComponent = config.icon;

  return (
    <div
      className={cn(
        'p-4 rounded-lg border transition-all duration-300 ease-in-out',
        config.bgColor,
        config.borderColor,
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2',
        className
      )}
    >
      <div className='flex items-start space-x-3'>
        <IconComponent className={cn('h-5 w-5 mt-0.5', config.iconColor)} />

        <div className='flex-1 min-w-0'>
          <h4 className={cn('text-sm font-medium', config.titleColor)}>
            {feedback.title}
          </h4>
          <p className={cn('text-sm mt-1', config.textColor)}>
            {feedback.message}
          </p>

          {feedback.action && (
            <button
              onClick={feedback.action.onClick}
              className={cn(
                'mt-2 text-sm font-medium underline hover:no-underline',
                config.textColor
              )}
            >
              {feedback.action.label}
            </button>
          )}
        </div>

        {feedback.dismissible && onDismiss && (
          <button
            onClick={onDismiss}
            className={cn(
              'text-muted-foreground hover:text-muted-foreground transition-colors',
              config.textColor
            )}
          >
            <X className='h-4 w-4' />
          </button>
        )}
      </div>
    </div>
  );
};

// Floating feedback component
export interface FloatingFeedbackProps {
  feedback: UserFeedbackState | null;
  isVisible: boolean;
  onDismiss?: () => void;
  position?:
    | 'top-right'
    | 'top-left'
    | 'bottom-right'
    | 'bottom-left'
    | 'top-center'
    | 'bottom-center';
  className?: string;
}

export const FloatingFeedback: React.FC<FloatingFeedbackProps> = ({
  feedback,
  isVisible,
  onDismiss,
  position = 'top-right',
  className,
}) => {
  if (!feedback || !isVisible) return null;

  const getPositionClasses = () => {
    switch (position) {
      case 'top-right':
        return 'top-4 right-4';
      case 'top-left':
        return 'top-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'top-center':
        return 'top-4 left-1/2 transform -translate-x-1/2';
      case 'bottom-center':
        return 'bottom-4 left-1/2 transform -translate-x-1/2';
      default:
        return 'top-4 right-4';
    }
  };

  const getFeedbackConfig = () => {
    switch (feedback.type) {
      case 'success':
        return {
          icon: CheckCircle,
          bgColor: 'bg-white',
          borderColor: 'border-green-200',
          iconColor: 'text-green-500',
          textColor: 'text-foreground',
          shadowColor: 'shadow-green-100',
        };
      case 'error':
        return {
          icon: XCircle,
          bgColor: 'bg-white',
          borderColor: 'border-red-200',
          iconColor: 'text-destructive',
          textColor: 'text-foreground',
          shadowColor: 'shadow-red-100',
        };
      case 'warning':
        return {
          icon: AlertCircle,
          bgColor: 'bg-white',
          borderColor: 'border-yellow-200',
          iconColor: 'text-yellow-500',
          textColor: 'text-foreground',
          shadowColor: 'shadow-yellow-100',
        };
      case 'info':
        return {
          icon: Info,
          bgColor: 'bg-white',
          borderColor: 'border-primary/20',
          iconColor: 'text-primary',
          textColor: 'text-foreground',
          shadowColor: 'shadow-blue-100',
        };
    }
  };

  const config = getFeedbackConfig();
  const IconComponent = config.icon;

  return (
    <div
      className={cn(
        'fixed z-50 max-w-sm w-full mx-4 transition-all duration-300 ease-in-out',
        getPositionClasses(),
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2',
        className
      )}
    >
      <div
        className={cn(
          'p-4 rounded-lg border shadow-lg',
          config.bgColor,
          config.borderColor,
          config.shadowColor
        )}
      >
        <div className='flex items-start space-x-3'>
          <IconComponent className={cn('h-5 w-5 mt-0.5', config.iconColor)} />

          <div className='flex-1 min-w-0'>
            <h4 className={cn('text-sm font-medium', config.textColor)}>
              {feedback.title}
            </h4>
            <p className={cn('text-sm mt-1 text-muted-foreground')}>
              {feedback.message}
            </p>

            {feedback.action && (
              <button
                onClick={feedback.action.onClick}
                className='mt-2 text-sm font-medium text-primary hover:text-primary underline hover:no-underline'
              >
                {feedback.action.label}
              </button>
            )}
          </div>

          {feedback.dismissible && onDismiss && (
            <button
              onClick={onDismiss}
              className='text-muted-foreground hover:text-muted-foreground transition-colors'
            >
              <X className='h-4 w-4' />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Action feedback hook for common operations
export function useActionFeedback() {
  const { showSuccess, showError, showWarning, showInfo } = useUserFeedback();

  const handleSave = useCallback(
    (success: boolean, message?: string) => {
      if (success) {
        showSuccess(
          'Saved',
          message || 'Your changes have been saved successfully'
        );
      } else {
        showError(
          'Save Failed',
          message || 'Failed to save your changes. Please try again.'
        );
      }
    },
    [showSuccess, showError]
  );

  const handleDelete = useCallback(
    (success: boolean, message?: string) => {
      if (success) {
        showSuccess('Deleted', message || 'Item deleted successfully');
      } else {
        showError(
          'Delete Failed',
          message || 'Failed to delete the item. Please try again.'
        );
      }
    },
    [showSuccess, showError]
  );

  const handleUpdate = useCallback(
    (success: boolean, message?: string) => {
      if (success) {
        showSuccess('Updated', message || 'Item updated successfully');
      } else {
        showError(
          'Update Failed',
          message || 'Failed to update the item. Please try again.'
        );
      }
    },
    [showSuccess, showError]
  );

  const handleCreate = useCallback(
    (success: boolean, message?: string) => {
      if (success) {
        showSuccess('Created', message || 'Item created successfully');
      } else {
        showError(
          'Create Failed',
          message || 'Failed to create the item. Please try again.'
        );
      }
    },
    [showSuccess, showError]
  );

  const handleSync = useCallback(
    (success: boolean, message?: string) => {
      if (success) {
        showSuccess('Synced', message || 'Data synchronized successfully');
      } else {
        showError(
          'Sync Failed',
          message || 'Failed to synchronize data. Please try again.'
        );
      }
    },
    [showSuccess, showError]
  );

  return {
    handleSave,
    handleDelete,
    handleUpdate,
    handleCreate,
    handleSync,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
}
