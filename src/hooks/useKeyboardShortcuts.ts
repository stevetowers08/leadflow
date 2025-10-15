import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  action: () => void;
  description: string;
}

export const useKeyboardShortcuts = () => {
  const navigate = useNavigate();

  const shortcuts: KeyboardShortcut[] = [
    {
      key: 'k',
      ctrlKey: true,
      action: () => {
        // Focus search input
        const searchInput = document.querySelector(
          'input[type="search"], input[placeholder*="search" i]'
        ) as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
      },
      description: 'Focus search',
    },
    {
      key: 'n',
      ctrlKey: true,
      action: () => {
        // Navigate to create new lead (if on leads page)
        if (window.location.pathname.includes('/leads')) {
          // Trigger add lead action
          const addButton = document.querySelector(
            '[data-action="add-lead"]'
          ) as HTMLButtonElement;
          if (addButton) {
            addButton.click();
          }
        }
      },
      description: 'Create new lead',
    },
    {
      key: '1',
      ctrlKey: true,
      action: () => navigate('/'),
      description: 'Go to Dashboard',
    },
    {
      key: '2',
      ctrlKey: true,
      action: () => navigate('/leads'),
      description: 'Go to Leads',
    },
    {
      key: '3',
      ctrlKey: true,
      action: () => navigate('/companies'),
      description: 'Go to Companies',
    },
    {
      key: '4',
      ctrlKey: true,
      action: () => navigate('/jobs'),
      description: 'Go to Jobs',
    },
    {
      key: '5',
      ctrlKey: true,
      action: () => navigate('/pipeline'),
      description: 'Go to Pipeline',
    },
    {
      key: '6',
      ctrlKey: true,
      action: () => navigate('/reporting'),
      description: 'Go to Reporting',
    },
    {
      key: ',',
      ctrlKey: true,
      action: () => navigate('/settings'),
      description: 'Go to Settings',
    },
    {
      key: 'Escape',
      action: () => {
        // Close any open modals
        const modals = document.querySelectorAll('[role="dialog"]');
        modals.forEach(modal => {
          const closeButton = modal.querySelector(
            '[data-dialog-close]'
          ) as HTMLButtonElement;
          if (closeButton) {
            closeButton.click();
          }
        });
      },
      description: 'Close modal',
    },
    {
      key: '?',
      ctrlKey: true,
      action: () => {
        // Show keyboard shortcuts help
        alert(`Keyboard Shortcuts:
Ctrl+K - Focus search
Ctrl+N - Create new lead
Ctrl+1 - Dashboard
Ctrl+2 - Leads
Ctrl+3 - Companies
Ctrl+4 - Jobs
Ctrl+5 - Pipeline
Ctrl+6 - Reporting
Ctrl+, - Settings
Escape - Close modal`);
      },
      description: 'Show keyboard shortcuts',
    },
  ];

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement ||
        (event.target as HTMLElement)?.contentEditable === 'true'
      ) {
        return;
      }

      const matchingShortcut = shortcuts.find(shortcut => {
        return (
          shortcut.key.toLowerCase() === event.key.toLowerCase() &&
          !!shortcut.ctrlKey === event.ctrlKey &&
          !!shortcut.metaKey === event.metaKey &&
          !!shortcut.altKey === event.altKey &&
          !!shortcut.shiftKey === event.shiftKey
        );
      });

      if (matchingShortcut) {
        event.preventDefault();
        matchingShortcut.action();
      }
    },
    [shortcuts]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return shortcuts;
};

// Hook for focus management
export const useFocusManagement = () => {
  const trapFocus = useCallback((element: HTMLElement) => {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    element.addEventListener('keydown', handleTabKey);

    return () => {
      element.removeEventListener('keydown', handleTabKey);
    };
  }, []);

  const focusFirstElement = useCallback((element: HTMLElement) => {
    const focusableElement = element.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as HTMLElement;

    if (focusableElement) {
      focusableElement.focus();
    }
  }, []);

  return { trapFocus, focusFirstElement };
};

// Hook for screen reader announcements
export const useScreenReaderAnnouncement = () => {
  const announce = useCallback(
    (message: string, priority: 'polite' | 'assertive' = 'polite') => {
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', priority);
      announcement.setAttribute('aria-atomic', 'true');
      announcement.className = 'sr-only';
      announcement.textContent = message;

      document.body.appendChild(announcement);

      // Remove after announcement
      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);
    },
    []
  );

  return announce;
};
