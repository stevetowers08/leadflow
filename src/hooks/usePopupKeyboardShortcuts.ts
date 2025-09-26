import { useEffect } from 'react';
import { usePopup } from '@/contexts/PopupContext';

export const usePopupKeyboardShortcuts = () => {
  const { activePopup, closePopup } = usePopup();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle shortcuts when popup is open
      if (!activePopup) return;

      // Escape to close
      if (e.key === 'Escape') {
        closePopup();
        return;
      }

      // Ctrl/Cmd + K to close (common shortcut)
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        closePopup();
        return;
      }

      // Arrow keys for navigation (if applicable)
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        // Handle navigation within popup content
        e.preventDefault();
        // Implementation depends on popup content
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [activePopup, closePopup]);
};

