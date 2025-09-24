import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

interface SyncQueueItem {
  id: string;
  action: 'create' | 'update' | 'delete';
  table: string;
  data: any;
  timestamp: number;
  retries: number;
}

interface OfflineSupportOptions {
  cacheExpiry?: number; // in milliseconds
  maxRetries?: number;
  retryDelay?: number;
  enableSync?: boolean;
}

export function useOfflineSupport<T>(
  key: string,
  options: OfflineSupportOptions = {}
) {
  const {
    cacheExpiry = 5 * 60 * 1000, // 5 minutes
    maxRetries = 3,
    retryDelay = 1000,
    enableSync = true
  } = options;

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [syncQueue, setSyncQueue] = useState<SyncQueueItem[]>([]);
  const { toast } = useToast();
  
  const cacheRef = useRef<Map<string, CacheEntry<any>>>(new Map());
  const syncQueueRef = useRef<SyncQueueItem[]>([]);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: "Back Online",
        description: "Connection restored. Syncing pending changes...",
      });
      if (enableSync) {
        processSyncQueue();
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: "Offline Mode",
        description: "You're offline. Changes will be synced when connection is restored.",
        variant: "destructive",
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast, enableSync]);

  // Load data from cache
  const getCachedData = useCallback(<T>(cacheKey: string): T | null => {
    const entry = cacheRef.current.get(cacheKey);
    if (!entry) return null;

    if (Date.now() > entry.expiry) {
      cacheRef.current.delete(cacheKey);
      return null;
    }

    return entry.data;
  }, []);

  // Save data to cache
  const setCachedData = useCallback(<T>(cacheKey: string, data: T): void => {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      expiry: Date.now() + cacheExpiry
    };
    cacheRef.current.set(cacheKey, entry);
  }, [cacheExpiry]);

  // Add item to sync queue
  const addToSyncQueue = useCallback((
    action: SyncQueueItem['action'],
    table: string,
    data: any
  ) => {
    const item: SyncQueueItem = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      action,
      table,
      data,
      timestamp: Date.now(),
      retries: 0
    };

    setSyncQueue(prev => [...prev, item]);
    syncQueueRef.current = [...syncQueueRef.current, item];
  }, []);

  // Process sync queue
  const processSyncQueue = useCallback(async () => {
    if (!isOnline || syncQueueRef.current.length === 0) return;

    setIsSyncing(true);
    const queue = [...syncQueueRef.current];
    const successful: string[] = [];
    const failed: SyncQueueItem[] = [];

    for (const item of queue) {
      try {
        // Simulate API call - replace with actual Supabase calls
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // In a real implementation, you would call the appropriate Supabase method:
        // switch (item.action) {
        //   case 'create':
        //     await supabase.from(item.table).insert(item.data);
        //     break;
        //   case 'update':
        //     await supabase.from(item.table).update(item.data).eq('id', item.data.id);
        //     break;
        //   case 'delete':
        //     await supabase.from(item.table).delete().eq('id', item.data.id);
        //     break;
        // }
        
        successful.push(item.id);
      } catch (error) {
        if (item.retries < maxRetries) {
          item.retries++;
          failed.push(item);
        } else {
          console.error('Failed to sync item after max retries:', item);
        }
      }
    }

    // Update sync queue
    setSyncQueue(failed);
    syncQueueRef.current = failed;
    setLastSync(new Date());

    if (successful.length > 0) {
      toast({
        title: "Sync Complete",
        description: `Successfully synced ${successful.length} changes`,
      });
    }

    setIsSyncing(false);
  }, [isOnline, maxRetries, toast]);

  // Retry failed syncs
  const retrySync = useCallback(() => {
    if (isOnline) {
      processSyncQueue();
    }
  }, [isOnline, processSyncQueue]);

  // Clear cache
  const clearCache = useCallback(() => {
    cacheRef.current.clear();
    toast({
      title: "Cache Cleared",
      description: "All cached data has been cleared",
    });
  }, [toast]);

  // Get cache info
  const getCacheInfo = useCallback(() => {
    const entries = Array.from(cacheRef.current.entries());
    const totalSize = entries.reduce((size, [key, entry]) => {
      return size + JSON.stringify(entry.data).length;
    }, 0);

    return {
      entryCount: entries.length,
      totalSize,
      oldestEntry: Math.min(...entries.map(([, entry]) => entry.timestamp)),
      newestEntry: Math.max(...entries.map(([, entry]) => entry.timestamp))
    };
  }, []);

  return {
    isOnline,
    isSyncing,
    lastSync,
    syncQueue,
    getCachedData,
    setCachedData,
    addToSyncQueue,
    retrySync,
    clearCache,
    getCacheInfo
  };
}

// Hook for managing offline data with automatic sync
export function useOfflineData<T extends { id: string }>(
  tableName: string,
  options: OfflineSupportOptions = {}
) {
  const {
    isOnline,
    isSyncing,
    syncQueue,
    getCachedData,
    setCachedData,
    addToSyncQueue
  } = useOfflineSupport(tableName, options);

  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data from cache or API
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Try to get cached data first
      const cachedData = getCachedData<T[]>(`${tableName}_list`);
      
      if (cachedData && !isOnline) {
        setData(cachedData);
        setLoading(false);
        return;
      }

      // If online, fetch fresh data
      if (isOnline) {
        // TODO: Replace with actual Supabase call
        // For now, return empty array
        const freshData: T[] = [];
        
        setData(freshData);
        setCachedData(`${tableName}_list`, freshData);
      } else {
        // Use cached data when offline
        setData(cachedData || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
      
      // Fallback to cached data
      const cachedData = getCachedData<T[]>(`${tableName}_list`);
      if (cachedData) {
        setData(cachedData);
      }
    } finally {
      setLoading(false);
    }
  }, [tableName, isOnline, getCachedData, setCachedData]);

  // Create new item
  const createItem = useCallback(async (itemData: Omit<T, 'id'>) => {
    const newItem = {
      ...itemData,
      id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    } as T;

    // Add to local data immediately
    setData(prev => [newItem, ...prev]);
    setCachedData(`${tableName}_list`, [newItem, ...data]);

    // Add to sync queue
    addToSyncQueue('create', tableName, itemData);

    return newItem;
  }, [tableName, data, setCachedData, addToSyncQueue]);

  // Update item
  const updateItem = useCallback(async (id: string, updates: Partial<T>) => {
    const updatedData = data.map(item => 
      item.id === id ? { ...item, ...updates } : item
    );

    setData(updatedData);
    setCachedData(`${tableName}_list`, updatedData);

    // Add to sync queue
    addToSyncQueue('update', tableName, { id, ...updates });
  }, [data, setCachedData, addToSyncQueue]);

  // Delete item
  const deleteItem = useCallback(async (id: string) => {
    const filteredData = data.filter(item => item.id !== id);
    setData(filteredData);
    setCachedData(`${tableName}_list`, filteredData);

    // Add to sync queue
    addToSyncQueue('delete', tableName, { id });
  }, [data, setCachedData, addToSyncQueue]);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    data,
    loading,
    error,
    isOnline,
    isSyncing,
    syncQueue,
    createItem,
    updateItem,
    deleteItem,
    refresh: loadData
  };
}

// Service Worker registration for offline support
export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('SW registered: ', registration);
        })
        .catch(registrationError => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }
}


