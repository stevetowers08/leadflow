import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  action: () => void;
  description: string;
  category: 'navigation' | 'actions' | 'data' | 'ui';
}

export interface KeyboardShortcutsConfig {
  onExport?: () => void;
  onSave?: () => void;
  onNew?: () => void;
  onSearch?: () => void;
  onRefresh?: () => void;
  onSelectAll?: () => void;
  onClearSelection?: () => void;
  onBulkAction?: () => void;
  customShortcuts?: KeyboardShortcut[];
}

export function useKeyboardShortcuts(config: KeyboardShortcutsConfig = {}) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    onExport,
    onSave,
    onNew,
    onSearch,
    onRefresh,
    onSelectAll,
    onClearSelection,
    onBulkAction,
    customShortcuts = []
  } = config;

  // Default shortcuts
  const defaultShortcuts: KeyboardShortcut[] = [
    // Navigation shortcuts
    {
      key: '1',
      metaKey: true,
      action: () => navigate('/'),
      description: 'Go to Dashboard',
      category: 'navigation'
    },
    {
      key: '2',
      metaKey: true,
      action: () => navigate('/jobs'),
      description: 'Go to Jobs',
      category: 'navigation'
    },
    {
      key: '3',
      metaKey: true,
      action: () => navigate('/leads'),
      description: 'Go to Leads',
      category: 'navigation'
    },
    {
      key: '4',
      metaKey: true,
      action: () => navigate('/companies'),
      description: 'Go to Companies',
      category: 'navigation'
    },
    {
      key: '5',
      metaKey: true,
      action: () => navigate('/opportunities'),
      description: 'Go to Opportunities',
      category: 'navigation'
    },
    {
      key: '6',
      metaKey: true,
      action: () => navigate('/campaigns'),
      description: 'Go to Campaigns',
      category: 'navigation'
    },
    {
      key: '7',
      metaKey: true,
      action: () => navigate('/automations'),
      description: 'Go to Automations',
      category: 'navigation'
    },
    {
      key: '8',
      metaKey: true,
      action: () => navigate('/reporting'),
      description: 'Go to Reporting',
      category: 'navigation'
    },
    {
      key: '9',
      metaKey: true,
      action: () => navigate('/settings'),
      description: 'Go to Settings',
      category: 'navigation'
    },

    // Action shortcuts
    {
      key: 'n',
      metaKey: true,
      action: () => onNew?.(),
      description: 'Create New',
      category: 'actions'
    },
    {
      key: 's',
      metaKey: true,
      action: () => onSave?.(),
      description: 'Save',
      category: 'actions'
    },
    {
      key: 'f',
      metaKey: true,
      action: () => onSearch?.(),
      description: 'Focus Search',
      category: 'actions'
    },
    {
      key: 'r',
      metaKey: true,
      action: () => onRefresh?.(),
      description: 'Refresh Data',
      category: 'actions'
    },

    // Data shortcuts
    {
      key: 'e',
      metaKey: true,
      action: () => onExport?.(),
      description: 'Export Data',
      category: 'data'
    },
    {
      key: 'a',
      metaKey: true,
      action: () => onSelectAll?.(),
      description: 'Select All',
      category: 'data'
    },
    {
      key: 'Escape',
      action: () => onClearSelection?.(),
      description: 'Clear Selection',
      category: 'data'
    },
    {
      key: 'b',
      metaKey: true,
      action: () => onBulkAction?.(),
      description: 'Bulk Actions',
      category: 'data'
    },

    // UI shortcuts
    {
      key: 'b',
      metaKey: true,
      shiftKey: true,
      action: () => {
        // Toggle sidebar (this is handled by the sidebar component)
        const event = new KeyboardEvent('keydown', {
          key: 'b',
          metaKey: true,
          shiftKey: true
        });
        window.dispatchEvent(event);
      },
      description: 'Toggle Sidebar',
      category: 'ui'
    },
    {
      key: '?',
      metaKey: true,
      action: () => {
        toast({
          title: "Keyboard Shortcuts",
          description: "Press Cmd+? to see all available shortcuts",
        });
      },
      description: 'Show Help',
      category: 'ui'
    }
  ];

  // Combine default and custom shortcuts
  const allShortcuts = [...defaultShortcuts, ...customShortcuts];

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Don't trigger shortcuts when typing in inputs
    const target = event.target as HTMLElement;
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.contentEditable === 'true' ||
      target.closest('[contenteditable="true"]')
    ) {
      return;
    }

    // Find matching shortcut
    const matchingShortcut = allShortcuts.find(shortcut => {
      return (
        shortcut.key.toLowerCase() === event.key.toLowerCase() &&
        !!shortcut.ctrlKey === event.ctrlKey &&
        !!shortcut.metaKey === event.metaKey &&
        !!shortcut.shiftKey === event.shiftKey &&
        !!shortcut.altKey === event.altKey
      );
    });

    if (matchingShortcut) {
      event.preventDefault();
      matchingShortcut.action();
    }
  }, [allShortcuts]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Return shortcuts for help display
  return {
    shortcuts: allShortcuts,
    getShortcutsByCategory: (category: KeyboardShortcut['category']) =>
      allShortcuts.filter(s => s.category === category)
  };
}

// Hook for showing keyboard shortcuts help
export function useKeyboardShortcutsHelp() {
  const { shortcuts } = useKeyboardShortcuts();

  const showHelp = () => {
    const categories = ['navigation', 'actions', 'data', 'ui'] as const;
    const helpText = categories.map(category => {
      const categoryShortcuts = shortcuts.filter(s => s.category === category);
      if (categoryShortcuts.length === 0) return '';
      
      const shortcutsText = categoryShortcuts.map(s => {
        const modifiers = [];
        if (s.metaKey) modifiers.push('Cmd');
        if (s.ctrlKey) modifiers.push('Ctrl');
        if (s.shiftKey) modifiers.push('Shift');
        if (s.altKey) modifiers.push('Alt');
        
        const keyCombo = modifiers.length > 0 
          ? `${modifiers.join('+')}+${s.key}`
          : s.key;
        
        return `${keyCombo}: ${s.description}`;
      }).join('\n');
      
      return `${category.toUpperCase()}:\n${shortcutsText}`;
    }).filter(Boolean).join('\n\n');

    alert(`KEYBOARD SHORTCUTS\n\n${helpText}`);
  };

  return { showHelp, shortcuts };
}

