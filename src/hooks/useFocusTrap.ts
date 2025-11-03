/**
 * Focus trap hook for accessibility
 * Traps focus within a container element (e.g., sidebar, modal)
 */

import { useEffect, useRef } from 'react';

interface UseFocusTrapOptions {
  enabled?: boolean;
  initialFocusRef?: React.RefObject<HTMLElement>;
  returnFocusRef?: React.RefObject<HTMLElement>;
}

export const useFocusTrap = ({
  enabled = true,
  initialFocusRef,
  returnFocusRef,
}: UseFocusTrapOptions = {}) => {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    const container = containerRef.current;

    // Check if container is still in DOM
    if (!document.body.contains(container)) return;

    // Focus initial element or first focusable element
    const focusInitial = () => {
      // Small delay to ensure DOM is ready
      requestAnimationFrame(() => {
        if (!document.body.contains(container)) return;

        if (
          initialFocusRef?.current &&
          container.contains(initialFocusRef.current)
        ) {
          initialFocusRef.current.focus();
          return;
        }

        // Find first focusable element
        const firstFocusable = container.querySelector(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        ) as HTMLElement;

        if (firstFocusable) {
          firstFocusable.focus();
        }
      });
    };

    // Get all focusable elements
    const getFocusableElements = (): HTMLElement[] => {
      const selector =
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
      return Array.from(container.querySelectorAll<HTMLElement>(selector));
    };

    // Handle Tab key navigation
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      const focusableElements = getFocusableElements();

      // Handle edge case: no focusable elements
      if (focusableElements.length === 0) {
        event.preventDefault();
        return;
      }

      // Handle edge case: only one focusable element
      if (focusableElements.length === 1) {
        event.preventDefault();
        focusableElements[0].focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      // Shift + Tab: reverse tab
      if (event.shiftKey) {
        if (
          document.activeElement === firstElement ||
          !container.contains(document.activeElement)
        ) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab: forward tab
        if (
          document.activeElement === lastElement ||
          !container.contains(document.activeElement)
        ) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    // Focus initial element
    focusInitial();

    // Add event listener
    container.addEventListener('keydown', handleKeyDown);

    // Store ref value to avoid stale closure
    const returnFocusElement = returnFocusRef?.current;

    return () => {
      container.removeEventListener('keydown', handleKeyDown);

      // Return focus to previous element
      if (returnFocusElement) {
        returnFocusElement.focus();
      } else if (returnFocusRef?.current) {
        // Fallback if ref was updated
        returnFocusRef.current.focus();
      }
    };
  }, [enabled, initialFocusRef, returnFocusRef]);

  return containerRef;
};
