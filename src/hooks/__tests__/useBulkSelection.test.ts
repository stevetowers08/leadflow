/**
 * useBulkSelection Hook Tests
 * Tests for bulk selection functionality
 */

import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useBulkSelection } from '../useBulkSelection';

describe('useBulkSelection', () => {
  it('should initialize with empty selection', () => {
    const { result } = renderHook(() => useBulkSelection());

    expect(result.current.selectedIds.size).toBe(0);
    expect(result.current.isAllSelected).toBe(false);
    expect(result.current.selectedCount).toBe(0);
  });

  it('should select a single item', () => {
    const { result } = renderHook(() => useBulkSelection());

    act(() => {
      result.current.selectItem('item-1');
    });

    expect(result.current.isSelected('item-1')).toBe(true);
    expect(result.current.selectedCount).toBe(1);
  });

  it('should deselect a single item', () => {
    const { result } = renderHook(() => useBulkSelection());

    act(() => {
      result.current.selectItem('item-1');
      result.current.deselectItem('item-1');
    });

    expect(result.current.isSelected('item-1')).toBe(false);
    expect(result.current.selectedCount).toBe(0);
  });

  it('should toggle item selection', () => {
    const { result } = renderHook(() => useBulkSelection());

    act(() => {
      result.current.toggleItem('item-1');
    });

    expect(result.current.isSelected('item-1')).toBe(true);

    act(() => {
      result.current.toggleItem('item-1');
    });

    expect(result.current.isSelected('item-1')).toBe(false);
  });

  it('should select all items', () => {
    const { result } = renderHook(() => useBulkSelection());
    const allIds = ['item-1', 'item-2', 'item-3'];

    act(() => {
      result.current.selectAll(allIds);
    });

    expect(result.current.isAllSelected).toBe(true);
    expect(result.current.selectedCount).toBe(-1); // -1 indicates "all selected"
    expect(result.current.isSelected('item-1')).toBe(true);
    expect(result.current.isSelected('item-2')).toBe(true);
    expect(result.current.isSelected('item-3')).toBe(true);
  });

  it('should exclude items when in select-all mode', () => {
    const { result } = renderHook(() => useBulkSelection());
    const allIds = ['item-1', 'item-2', 'item-3'];

    act(() => {
      result.current.selectAll(allIds);
      result.current.deselectItem('item-2');
    });

    expect(result.current.isAllSelected).toBe(true);
    expect(result.current.isSelected('item-1')).toBe(true);
    expect(result.current.isSelected('item-2')).toBe(false);
    expect(result.current.isSelected('item-3')).toBe(true);
  });

  it('should get selected IDs correctly in normal mode', () => {
    const { result } = renderHook(() => useBulkSelection());
    const allIds = ['item-1', 'item-2', 'item-3'];

    act(() => {
      result.current.selectItem('item-1');
      result.current.selectItem('item-3');
    });

    const selectedIds = result.current.getSelectedIds(allIds);
    expect(selectedIds).toEqual(['item-1', 'item-3']);
  });

  it('should get selected IDs correctly in select-all mode', () => {
    const { result } = renderHook(() => useBulkSelection());
    const allIds = ['item-1', 'item-2', 'item-3'];

    act(() => {
      result.current.selectAll(allIds);
      result.current.deselectItem('item-2');
    });

    const selectedIds = result.current.getSelectedIds(allIds);
    expect(selectedIds).toEqual(['item-1', 'item-3']);
  });

  it('should deselect all items', () => {
    const { result } = renderHook(() => useBulkSelection());
    const allIds = ['item-1', 'item-2', 'item-3'];

    act(() => {
      result.current.selectAll(allIds);
      result.current.deselectAll();
    });

    expect(result.current.isAllSelected).toBe(false);
    expect(result.current.selectedCount).toBe(0);
    expect(result.current.isSelected('item-1')).toBe(false);
  });
});
