/**
 * Managed Cache Utility
 * Provides size-limited, TTL-based caching with automatic cleanup
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  accessCount: number;
}

interface CacheOptions {
  maxSize?: number;
  maxAge?: number;
  cleanupInterval?: number;
}

export class ManagedCache<T = any> {
  private cache = new Map<string, CacheEntry<T>>();
  private maxSize: number;
  private maxAge: number;
  private cleanupInterval: number;
  private cleanupTimer?: NodeJS.Timeout;

  constructor(options: CacheOptions = {}) {
    this.maxSize = options.maxSize ?? 100;
    this.maxAge = options.maxAge ?? 2 * 60 * 1000; // 2 minutes default
    this.cleanupInterval = options.cleanupInterval ?? 60 * 1000; // 1 minute cleanup interval
    
    // Start automatic cleanup
    this.startCleanup();
  }

  /**
   * Get data from cache
   */
  get(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Check if expired
    if (Date.now() - entry.timestamp > this.maxAge) {
      this.cache.delete(key);
      return null;
    }

    // Update access count for LRU
    entry.accessCount++;
    return entry.data;
  }

  /**
   * Set data in cache
   */
  set(key: string, data: T): void {
    // Clean expired entries first
    this.cleanup();

    // Remove oldest entries if at capacity
    if (this.cache.size >= this.maxSize) {
      this.evictOldest();
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      accessCount: 1
    });
  }

  /**
   * Check if key exists and is not expired
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Delete specific key
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const entries = Array.from(this.cache.entries());
    const totalSize = entries.reduce((size, [key, entry]) => {
      return size + JSON.stringify(entry.data).length + key.length;
    }, 0);

    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      totalSizeBytes: totalSize,
      oldestEntry: Math.min(...entries.map(([, entry]) => entry.timestamp)),
      newestEntry: Math.max(...entries.map(([, entry]) => entry.timestamp)),
      averageAccessCount: entries.reduce((sum, [, entry]) => sum + entry.accessCount, 0) / entries.length
    };
  }

  /**
   * Remove expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.maxAge) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Evict oldest entry (LRU)
   */
  private evictOldest(): void {
    let oldestKey = '';
    let oldestAccess = Infinity;
    let oldestTime = Infinity;

    for (const [key, entry] of this.cache.entries()) {
      // Prioritize by access count, then by timestamp
      if (entry.accessCount < oldestAccess || 
          (entry.accessCount === oldestAccess && entry.timestamp < oldestTime)) {
        oldestKey = key;
        oldestAccess = entry.accessCount;
        oldestTime = entry.timestamp;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  /**
   * Start automatic cleanup timer
   */
  private startCleanup(): void {
    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, this.cleanupInterval);
  }

  /**
   * Stop automatic cleanup timer
   */
  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = undefined;
    }
    this.clear();
  }
}

// Global cache instances for different purposes
export const dashboardCache = new ManagedCache({
  maxSize: 50,
  maxAge: 2 * 60 * 1000, // 2 minutes
  cleanupInterval: 30 * 1000 // 30 seconds
});

export const userProfileCache = new ManagedCache({
  maxSize: 20,
  maxAge: 5 * 60 * 1000, // 5 minutes
  cleanupInterval: 60 * 1000 // 1 minute
});

export const searchCache = new ManagedCache({
  maxSize: 100,
  maxAge: 10 * 60 * 1000, // 10 minutes
  cleanupInterval: 2 * 60 * 1000 // 2 minutes
});

// Cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    dashboardCache.destroy();
    userProfileCache.destroy();
    searchCache.destroy();
  });
}
