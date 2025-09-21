import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  MoreHorizontal, 
  Download, 
  Trash2, 
  Edit, 
  Mail, 
  Users, 
  Tag, 
  Archive,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

export interface BulkAction<T = any> {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  action: (items: T[]) => Promise<void>;
  variant?: 'default' | 'destructive' | 'secondary';
  requiresConfirmation?: boolean;
  confirmationMessage?: string;
}

interface BulkActionsProps<T> {
  selectedItems: T[];
  onSelectionChange: (items: T[]) => void;
  allItems: T[];
  onSelectAll: () => void;
  onClearSelection: () => void;
  actions: BulkAction<T>[];
  itemName?: string;
  itemNamePlural?: string;
  className?: string;
}

export function BulkActions<T extends { id: string }>({
  selectedItems,
  onSelectionChange,
  allItems,
  onSelectAll,
  onClearSelection,
  actions,
  itemName = 'item',
  itemNamePlural = 'items',
  className = ''
}: BulkActionsProps<T>) {
  const [isExecuting, setIsExecuting] = useState(false);
  const { toast } = useToast();

  const selectedCount = selectedItems.length;
  const totalCount = allItems.length;
  const isAllSelected = selectedCount === totalCount && totalCount > 0;
  const isPartiallySelected = selectedCount > 0 && selectedCount < totalCount;

  const handleSelectAll = () => {
    if (isAllSelected) {
      onClearSelection();
    } else {
      onSelectAll();
    }
  };

  const executeAction = async (action: BulkAction<T>) => {
    if (selectedCount === 0) return;

    setIsExecuting(true);
    try {
      await action.action(selectedItems);
      toast({
        title: "Success",
        description: `Action completed for ${selectedCount} ${selectedCount === 1 ? itemName : itemNamePlural}`,
      });
      onClearSelection();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to execute action: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const handleActionClick = async (action: BulkAction<T>) => {
    if (action.requiresConfirmation) {
      const confirmed = window.confirm(
        action.confirmationMessage || 
        `Are you sure you want to ${action.label.toLowerCase()} ${selectedCount} ${selectedCount === 1 ? itemName : itemNamePlural}?`
      );
      if (!confirmed) return;
    }
    await executeAction(action);
  };

  if (totalCount === 0) return null;

  return (
    <div className={`flex items-center gap-3 p-3 bg-muted/50 border-b ${className}`}>
      {/* Selection Controls */}
      <div className="flex items-center gap-2">
        <Checkbox
          checked={isAllSelected}
          ref={(el) => {
            if (el) el.indeterminate = isPartiallySelected;
          }}
          onCheckedChange={handleSelectAll}
        />
        <span className="text-sm text-muted-foreground">
          {selectedCount > 0 ? (
            <>
              <Badge variant="secondary" className="mr-2">
                {selectedCount} selected
              </Badge>
              {selectedCount} of {totalCount} {itemNamePlural}
            </>
          ) : (
            `Select ${itemNamePlural}`
          )}
        </span>
      </div>

      {/* Bulk Actions */}
      {selectedCount > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Actions:</span>
          
          {/* Quick Actions */}
          {actions.slice(0, 3).map((action) => (
            <Button
              key={action.id}
              variant={action.variant || 'outline'}
              size="sm"
              onClick={() => handleActionClick(action)}
              disabled={isExecuting}
              className="h-8"
            >
              <action.icon className="h-3 w-3 mr-1" />
              {action.label}
            </Button>
          ))}

          {/* More Actions Dropdown */}
          {actions.length > 3 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" disabled={isExecuting} className="h-8">
                  <MoreHorizontal className="h-3 w-3 mr-1" />
                  More
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {actions.slice(3).map((action) => (
                  <DropdownMenuItem
                    key={action.id}
                    onClick={() => handleActionClick(action)}
                    className={action.variant === 'destructive' ? 'text-destructive' : ''}
                  >
                    <action.icon className="h-3 w-3 mr-2" />
                    {action.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Clear Selection */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            className="h-8 text-muted-foreground hover:text-foreground"
          >
            Clear
          </Button>
        </div>
      )}
    </div>
  );
}

// Pre-built bulk actions for common operations
export const createBulkActions = <T extends { id: string }>(
  onExport?: (items: T[]) => Promise<void>,
  onDelete?: (items: T[]) => Promise<void>,
  onUpdateStatus?: (items: T[], status: string) => Promise<void>,
  onAssign?: (items: T[], assignee: string) => Promise<void>,
  onArchive?: (items: T[]) => Promise<void>
): BulkAction<T>[] => {
  const actions: BulkAction<T>[] = [];

  if (onExport) {
    actions.push({
      id: 'export',
      label: 'Export',
      icon: Download,
      action: onExport,
      variant: 'secondary'
    });
  }

  if (onUpdateStatus) {
    actions.push(
      {
        id: 'mark-active',
        label: 'Mark Active',
        icon: CheckCircle,
        action: (items) => onUpdateStatus(items, 'active'),
        variant: 'secondary'
      },
      {
        id: 'mark-inactive',
        label: 'Mark Inactive',
        icon: XCircle,
        action: (items) => onUpdateStatus(items, 'inactive'),
        variant: 'secondary'
      }
    );
  }

  if (onAssign) {
    actions.push({
      id: 'assign',
      label: 'Assign',
      icon: Users,
      action: (items) => {
        const assignee = prompt('Enter assignee name:');
        if (assignee) onAssign(items, assignee);
      },
      variant: 'secondary'
    });
  }

  if (onArchive) {
    actions.push({
      id: 'archive',
      label: 'Archive',
      icon: Archive,
      action: onArchive,
      variant: 'secondary'
    });
  }

  if (onDelete) {
    actions.push({
      id: 'delete',
      label: 'Delete',
      icon: Trash2,
      action: onDelete,
      variant: 'destructive',
      requiresConfirmation: true,
      confirmationMessage: 'Are you sure you want to delete the selected items? This action cannot be undone.'
    });
  }

  return actions;
};

