import React from 'react';
import { BulkActions, BulkAction } from '../utils/BulkActions';

interface TableBulkActionsProps<T> {
  selectedItems: T[];
  onSelectionChange: (items: T[]) => void;
  allItems: T[];
  onSelectAll: () => void;
  onClearSelection: () => void;
  actions: BulkAction<T>[];
  itemName: string;
  itemNamePlural: string;
  enableBulkActions: boolean;
}

export function TableBulkActions<T extends Record<string, any> & { id: string }>({
  selectedItems,
  onSelectionChange,
  allItems,
  onSelectAll,
  onClearSelection,
  actions,
  itemName,
  itemNamePlural,
  enableBulkActions
}: TableBulkActionsProps<T>) {
  if (!enableBulkActions) return null;

  return (
    <BulkActions
      selectedItems={selectedItems}
      onSelectionChange={onSelectionChange}
      allItems={allItems}
      onSelectAll={onSelectAll}
      onClearSelection={onClearSelection}
      actions={actions}
      itemName={itemName}
      itemNamePlural={itemNamePlural}
    />
  );
}
