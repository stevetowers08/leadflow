import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '../integrations/supabase/client';

interface RealtimeOptions {
  table: string;
  onUpdate?: (payload: any) => void;
  onInsert?: (payload: any) => void;
  onDelete?: (payload: any) => void;
  debounceMs?: number;
}

/**
 * Optimized real-time subscription hook
 * Only triggers updates for specific record changes, not full refetches
 */
export function useOptimizedRealtime(options: RealtimeOptions) {
  const { table, onUpdate, onInsert, onDelete, debounceMs = 300 } = options;
  const timeoutRef = useRef<NodeJS.Timeout>();
  const pendingUpdates = useRef<Set<string>>(new Set());

  const debouncedUpdate = useCallback((recordId: string) => {
    pendingUpdates.current.add(recordId);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      const updates = Array.from(pendingUpdates.current);
      pendingUpdates.current.clear();
      
      // Batch process updates
      updates.forEach(id => {
        onUpdate?.({ record: { id } });
      });
    }, debounceMs);
  }, [onUpdate, debounceMs]);

  useEffect(() => {
    const channel = supabase
      .channel(`${table}-changes`)
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table 
        }, 
        (payload) => {
          // Only update specific record, not full refetch
          debouncedUpdate(payload.new.id);
        }
      )
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table 
        }, 
        (payload) => {
          onInsert?.(payload);
        }
      )
      .on('postgres_changes', 
        { 
          event: 'DELETE', 
          schema: 'public', 
          table 
        }, 
        (payload) => {
          onDelete?.(payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [table, onUpdate, onInsert, onDelete, debouncedUpdate]);

  return {
    // Return methods for manual updates if needed
    triggerUpdate: debouncedUpdate
  };
}
