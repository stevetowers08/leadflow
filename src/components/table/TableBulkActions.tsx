import { BulkAction, BulkActions } from '../shared/BulkActions';

interface TableBulkActionsProps<
  T extends Record<string, unknown> & { id: string },
> {
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

export function TableBulkActions<
  T extends Record<string, unknown> & { id: string },
>({
  selectedItems,
  onSelectionChange,
  allItems,
  onSelectAll,
  onClearSelection,
  actions,
  itemName,
  itemNamePlural,
  enableBulkActions,
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
