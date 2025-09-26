import React from 'react';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface ModalContainerProps {
  isOpen: boolean;
  onClose: () => void;
  icon?: React.ReactNode;
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  children: React.ReactNode;
}

export const ModalContainer: React.FC<ModalContainerProps> = ({
  isOpen,
  onClose,
  icon,
  isLoading,
  error,
  onRetry,
  children
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto gap-0">
        <DialogHeader className="flex items-start justify-between space-y-0 pb-2">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="flex-shrink-0" aria-hidden="true">
              {icon}
            </div>
            <div className="flex-1 min-w-0">
              {children}
            </div>
          </div>
        </DialogHeader>

        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-sm text-muted-foreground">Loading...</span>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="text-red-500 mb-2">Error loading data</div>
            <p className="text-sm text-muted-foreground mb-4">{error.message}</p>
            {onRetry && (
              <Button variant="outline" onClick={onRetry}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            )}
          </div>
        )}

        {!isLoading && !error && children}
      </DialogContent>
    </Dialog>
  );
};
