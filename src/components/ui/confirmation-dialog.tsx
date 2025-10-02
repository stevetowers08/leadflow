import * as React from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { designTokens } from "@/design-system/tokens";
import { 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Trash2, 
  User, 
  Building2,
  Briefcase,
  MessageSquare,
  Settings,
  LogOut,
  Save,
  X
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Confirmation Types
export type ConfirmationType = 
  | 'delete' 
  | 'assignment' 
  | 'signout' 
  | 'save' 
  | 'automation' 
  | 'bulk-action'
  | 'custom';

export interface ConfirmationConfig {
  type: ConfirmationType;
  title: string;
  description: string;
  icon?: React.ComponentType<any>;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive' | 'warning';
  showIcon?: boolean;
}

// Predefined confirmation configurations
export const confirmationConfigs: Record<ConfirmationType, ConfirmationConfig> = {
  delete: {
    type: 'delete',
    title: 'Delete Item',
    description: 'Are you sure you want to delete this item? This action cannot be undone.',
    icon: Trash2,
    confirmText: 'Delete',
    cancelText: 'Cancel',
    variant: 'destructive',
    showIcon: true,
  },
  assignment: {
    type: 'assignment',
    title: 'Change Assignment',
    description: 'Are you sure you want to change the assignment for this item?',
    icon: User,
    confirmText: 'Assign',
    cancelText: 'Cancel',
    variant: 'default',
    showIcon: true,
  },
  signout: {
    type: 'signout',
    title: 'Sign Out',
    description: 'Are you sure you want to sign out? You will need to sign in again to access your account.',
    icon: LogOut,
    confirmText: 'Sign Out',
    cancelText: 'Cancel',
    variant: 'default',
    showIcon: true,
  },
  save: {
    type: 'save',
    title: 'Save Changes',
    description: 'Are you sure you want to save these changes?',
    icon: Save,
    confirmText: 'Save',
    cancelText: 'Cancel',
    variant: 'default',
    showIcon: true,
  },
  automation: {
    type: 'automation',
    title: 'Start Automation',
    description: 'Are you sure you want to start the automation process? This will begin contacting the selected leads.',
    icon: MessageSquare,
    confirmText: 'Start Automation',
    cancelText: 'Cancel',
    variant: 'default',
    showIcon: true,
  },
  'bulk-action': {
    type: 'bulk-action',
    title: 'Bulk Action',
    description: 'Are you sure you want to perform this action on the selected items?',
    icon: Settings,
    confirmText: 'Continue',
    cancelText: 'Cancel',
    variant: 'default',
    showIcon: true,
  },
  custom: {
    type: 'custom',
    title: 'Confirm Action',
    description: 'Are you sure you want to proceed?',
    icon: Info,
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    variant: 'default',
    showIcon: true,
  },
};

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  config: ConfirmationConfig;
  isLoading?: boolean;
  customContent?: React.ReactNode;
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  config,
  isLoading = false,
  customContent,
}: ConfirmationDialogProps) {
  const IconComponent = config.icon;

  const getIconColor = () => {
    switch (config.variant) {
      case 'destructive':
        return 'text-destructive';
      case 'warning':
        return 'text-warning';
      default:
        return 'text-sidebar-primary';
    }
  };

  const getConfirmVariant = () => {
    switch (config.variant) {
      case 'destructive':
        return 'destructive';
      case 'warning':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            {config.showIcon && IconComponent && (
              <div className={cn("flex-shrink-0", getIconColor())}>
                <IconComponent className="h-5 w-5" />
              </div>
            )}
            <AlertDialogTitle className="text-left">
              {config.title}
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-left">
            {config.description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {customContent && (
          <div className="py-2">
            {customContent}
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel 
            onClick={onClose}
            disabled={isLoading}
          >
            {config.cancelText || 'Cancel'}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            variant={getConfirmVariant()}
            disabled={isLoading}
            className={cn(
              isLoading && "opacity-50 cursor-not-allowed"
            )}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Processing...
              </div>
            ) : (
              config.confirmText || 'Confirm'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Convenience component for quick confirmations
interface QuickConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  type: ConfirmationType;
  customTitle?: string;
  customDescription?: string;
  customConfirmText?: string;
  customCancelText?: string;
  isLoading?: boolean;
  customContent?: React.ReactNode;
}

export function QuickConfirmation({
  isOpen,
  onClose,
  onConfirm,
  type,
  customTitle,
  customDescription,
  customConfirmText,
  customCancelText,
  isLoading = false,
  customContent,
}: QuickConfirmationProps) {
  const baseConfig = confirmationConfigs[type];
  
  const config: ConfirmationConfig = {
    ...baseConfig,
    title: customTitle || baseConfig.title,
    description: customDescription || baseConfig.description,
    confirmText: customConfirmText || baseConfig.confirmText,
    cancelText: customCancelText || baseConfig.cancelText,
  };

  return (
    <ConfirmationDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      config={config}
      isLoading={isLoading}
      customContent={customContent}
    />
  );
}

