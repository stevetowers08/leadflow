/**
 * useBulkSelection Hook
 *
 * Modern bulk selection hook following NN/g best practices:
 * - Select All with exclusion list (efficient for large datasets)
 * - Clear selection state management
 * - Keyboard shortcuts support
 * - Optimized for performance
 */

import { useCallback, useState } from 'react';

export interface BulkSelectionState {
  selectedIds: Set<string>;
  isAllSelected: boolean;
  excludedIds: Set<string>;
}

export interface UseBulkSelectionReturn {
  selectedIds: Set<string>;
  isAllSelected: boolean;
  selectedCount: number;

  // Actions
  selectItem: (id: string) => void;
  deselectItem: (id: string) => void;
  toggleItem: (id: string) => void;
  selectAll: (allIds: string[]) => void;
  deselectAll: () => void;
  isSelected: (id: string) => boolean;

  // Utilities
  getSelectedIds: (allIds: string[]) => string[];
}

export const useBulkSelection = (): UseBulkSelectionReturn => {
  const [state, setState] = useState<BulkSelectionState>({
    selectedIds: new Set(),
    isAllSelected: false,
    excludedIds: new Set(),
  });

  // Calculate selected count
  const selectedCount = state.isAllSelected
    ? -1 // Return -1 to indicate "all selected" mode
    : state.selectedIds.size;

  // Select a single item
  const selectItem = useCallback((id: string) => {
    setState(prev => {
      if (prev.isAllSelected) {
        // In "select all" mode, remove from exclusion list
        const newExcluded = new Set(prev.excludedIds);
        newExcluded.delete(id);
        return { ...prev, excludedIds: newExcluded };
      } else {
        // Normal mode, add to selection
        const newSelected = new Set(prev.selectedIds);
        newSelected.add(id);
        return { ...prev, selectedIds: newSelected };
      }
    });
  }, []);

  // Deselect a single item
  const deselectItem = useCallback((id: string) => {
    setState(prev => {
      if (prev.isAllSelected) {
        // In "select all" mode, add to exclusion list
        const newExcluded = new Set(prev.excludedIds);
        newExcluded.add(id);
        return { ...prev, excludedIds: newExcluded };
      } else {
        // Normal mode, remove from selection
        const newSelected = new Set(prev.selectedIds);
        newSelected.delete(id);
        return { ...prev, selectedIds: newSelected };
      }
    });
  }, []);

  // Toggle item selection
  const toggleItem = useCallback((id: string) => {
    setState(prev => {
      const isCurrentlySelected = prev.isAllSelected
        ? !prev.excludedIds.has(id)
        : prev.selectedIds.has(id);

      if (isCurrentlySelected) {
        // Deselect
        if (prev.isAllSelected) {
          const newExcluded = new Set(prev.excludedIds);
          newExcluded.add(id);
          return { ...prev, excludedIds: newExcluded };
        } else {
          const newSelected = new Set(prev.selectedIds);
          newSelected.delete(id);
          return { ...prev, selectedIds: newSelected };
        }
      } else {
        // Select
        if (prev.isAllSelected) {
          const newExcluded = new Set(prev.excludedIds);
          newExcluded.delete(id);
          return { ...prev, excludedIds: newExcluded };
        } else {
          const newSelected = new Set(prev.selectedIds);
          newSelected.add(id);
          return { ...prev, selectedIds: newSelected };
        }
      }
    });
  }, []);

  // Select all items
  const selectAll = useCallback((allIds: string[]) => {
    setState({
      selectedIds: new Set(allIds),
      isAllSelected: true,
      excludedIds: new Set(),
    });
  }, []);

  // Deselect all items
  const deselectAll = useCallback(() => {
    setState({
      selectedIds: new Set(),
      isAllSelected: false,
      excludedIds: new Set(),
    });
  }, []);

  // Check if item is selected
  const isSelected = useCallback(
    (id: string): boolean => {
      return state.isAllSelected
        ? !state.excludedIds.has(id)
        : state.selectedIds.has(id);
    },
    [state]
  );

  // Get actual selected IDs (resolves "select all" mode)
  const getSelectedIds = useCallback(
    (allIds: string[]): string[] => {
      if (state.isAllSelected) {
        return allIds.filter(id => !state.excludedIds.has(id));
      }
      return Array.from(state.selectedIds);
    },
    [state]
  );

  return {
    selectedIds: state.selectedIds,
    isAllSelected: state.isAllSelected,
    selectedCount,
    selectItem,
    deselectItem,
    toggleItem,
    selectAll,
    deselectAll,
    isSelected,
    getSelectedIds,
  };
};
