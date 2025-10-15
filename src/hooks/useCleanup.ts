/**
 * Custom hook for managing cleanup operations
 * Prevents memory leaks by ensuring proper cleanup of timers, listeners, and subscriptions
 */

import { useEffect, useRef, useCallback } from 'react';

interface CleanupItem {
  id: string;
  cleanup: () => void;
  type: 'timeout' | 'interval' | 'listener' | 'subscription' | 'custom';
}

export function useCleanup() {
  const cleanupItems = useRef<CleanupItem[]>([]);
  const isCleanedUp = useRef(false);

  const addCleanup = useCallback(
    (id: string, cleanup: () => void, type: CleanupItem['type'] = 'custom') => {
      if (isCleanedUp.current) {
        // If already cleaned up, run cleanup immediately
        cleanup();
        return;
      }

      cleanupItems.current.push({ id, cleanup, type });
    },
    []
  );

  const removeCleanup = useCallback((id: string) => {
    const index = cleanupItems.current.findIndex(item => item.id === id);
    if (index !== -1) {
      const item = cleanupItems.current[index];
      item.cleanup();
      cleanupItems.current.splice(index, 1);
    }
  }, []);

  const clearAllCleanup = useCallback(() => {
    cleanupItems.current.forEach(item => {
      try {
        item.cleanup();
      } catch (error) {
        console.warn(`Cleanup failed for ${item.id}:`, error);
      }
    });
    cleanupItems.current = [];
    isCleanedUp.current = true;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearAllCleanup();
    };
  }, [clearAllCleanup]);

  return {
    addCleanup,
    removeCleanup,
    clearAllCleanup,
    cleanupCount: cleanupItems.current.length,
  };
}

/**
 * Hook for managing timeouts with automatic cleanup
 */
export function useTimeout() {
  const { addCleanup, removeCleanup } = useCleanup();
  const timeouts = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const setCleanupTimeout = useCallback(
    (id: string, callback: () => void, delay: number) => {
      // Clear existing timeout with same ID
      const existingTimeout = timeouts.current.get(id);
      if (existingTimeout) {
        clearTimeout(existingTimeout);
      }

      const timeoutId = setTimeout(() => {
        callback();
        timeouts.current.delete(id);
        removeCleanup(id);
      }, delay);

      timeouts.current.set(id, timeoutId);
      addCleanup(
        id,
        () => {
          clearTimeout(timeoutId);
          timeouts.current.delete(id);
        },
        'timeout'
      );

      return timeoutId;
    },
    [addCleanup, removeCleanup]
  );

  const clearTimeout = useCallback(
    (id: string) => {
      const timeoutId = timeouts.current.get(id);
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeouts.current.delete(id);
        removeCleanup(id);
      }
    },
    [removeCleanup]
  );

  return { setCleanupTimeout, clearTimeout };
}

/**
 * Hook for managing intervals with automatic cleanup
 */
export function useInterval() {
  const { addCleanup, removeCleanup } = useCleanup();
  const intervals = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const setCleanupInterval = useCallback(
    (id: string, callback: () => void, delay: number) => {
      // Clear existing interval with same ID
      const existingInterval = intervals.current.get(id);
      if (existingInterval) {
        clearInterval(existingInterval);
      }

      const intervalId = setInterval(callback, delay);
      intervals.current.set(id, intervalId);
      addCleanup(
        id,
        () => {
          clearInterval(intervalId);
          intervals.current.delete(id);
        },
        'interval'
      );

      return intervalId;
    },
    [addCleanup, removeCleanup]
  );

  const clearInterval = useCallback(
    (id: string) => {
      const intervalId = intervals.current.get(id);
      if (intervalId) {
        clearInterval(intervalId);
        intervals.current.delete(id);
        removeCleanup(id);
      }
    },
    [removeCleanup]
  );

  return { setCleanupInterval, clearInterval };
}

/**
 * Hook for managing event listeners with automatic cleanup
 */
export function useEventListener() {
  const { addCleanup, removeCleanup } = useCleanup();
  const listeners = useRef<
    Map<string, { element: EventTarget; event: string; handler: EventListener }>
  >(new Map());

  const addCleanupEventListener = useCallback(
    (
      id: string,
      element: EventTarget,
      event: string,
      handler: EventListener,
      options?: AddEventListenerOptions
    ) => {
      // Remove existing listener with same ID
      const existingListener = listeners.current.get(id);
      if (existingListener) {
        existingListener.element.removeEventListener(
          existingListener.event,
          existingListener.handler
        );
      }

      element.addEventListener(event, handler, options);
      listeners.current.set(id, { element, event, handler });

      addCleanup(
        id,
        () => {
          element.removeEventListener(event, handler, options);
          listeners.current.delete(id);
        },
        'listener'
      );
    },
    [addCleanup, removeCleanup]
  );

  const removeEventListener = useCallback(
    (id: string) => {
      const listener = listeners.current.get(id);
      if (listener) {
        listener.element.removeEventListener(listener.event, listener.handler);
        listeners.current.delete(id);
        removeCleanup(id);
      }
    },
    [removeCleanup]
  );

  return { addCleanupEventListener, removeEventListener };
}

/**
 * Hook for managing Supabase subscriptions with automatic cleanup
 */
export function useSupabaseSubscription() {
  const { addCleanup, removeCleanup } = useCleanup();
  const subscriptions = useRef<Map<string, any>>(new Map());

  const addCleanupSubscription = useCallback(
    (id: string, subscription: any) => {
      // Remove existing subscription with same ID
      const existingSubscription = subscriptions.current.get(id);
      if (existingSubscription) {
        existingSubscription.unsubscribe();
      }

      subscriptions.current.set(id, subscription);
      addCleanup(
        id,
        () => {
          subscription.unsubscribe();
          subscriptions.current.delete(id);
        },
        'subscription'
      );
    },
    [addCleanup, removeCleanup]
  );

  const removeSubscription = useCallback(
    (id: string) => {
      const subscription = subscriptions.current.get(id);
      if (subscription) {
        subscription.unsubscribe();
        subscriptions.current.delete(id);
        removeCleanup(id);
      }
    },
    [removeCleanup]
  );

  return { addCleanupSubscription, removeSubscription };
}
