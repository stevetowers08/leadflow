/**
 * Robust Storage Utility
 * Provides safe localStorage/sessionStorage operations with fallbacks
 */

interface StorageOptions {
  fallbackToMemory?: boolean;
  fallbackToSession?: boolean;
  maxRetries?: number;
  retryDelay?: number;
}

interface StorageStats {
  totalOperations: number;
  successfulOperations: number;
  failedOperations: number;
  fallbackOperations: number;
}

class RobustStorage {
  private memoryFallback = new Map<string, string>();
  private stats: StorageStats = {
    totalOperations: 0,
    successfulOperations: 0,
    failedOperations: 0,
    fallbackOperations: 0
  };

  constructor(
    private storage: Storage,
    private options: StorageOptions = {}
  ) {
    this.options = {
      fallbackToMemory: true,
      fallbackToSession: true,
      maxRetries: 3,
      retryDelay: 100,
      ...options
    };
  }

  /**
   * Get item from storage with fallbacks
   */
  getItem(key: string): string | null {
    this.stats.totalOperations++;

    try {
      const value = this.storage.getItem(key);
      this.stats.successfulOperations++;
      return value;
    } catch (error) {
      console.warn(`Failed to read from ${this.storage.constructor.name}:`, error);
      this.stats.failedOperations++;
      
      // Try memory fallback
      if (this.options.fallbackToMemory && this.memoryFallback.has(key)) {
        this.stats.fallbackOperations++;
        return this.memoryFallback.get(key) || null;
      }

      return null;
    }
  }

  /**
   * Set item in storage with retries and fallbacks
   */
  setItem(key: string, value: string): boolean {
    this.stats.totalOperations++;

    // Try primary storage with retries
    for (let attempt = 0; attempt < (this.options.maxRetries || 1); attempt++) {
      try {
        this.storage.setItem(key, value);
        this.stats.successfulOperations++;
        
        // Also store in memory fallback for reliability
        if (this.options.fallbackToMemory) {
          this.memoryFallback.set(key, value);
        }
        
        return true;
      } catch (error) {
        console.warn(`Attempt ${attempt + 1} failed to write to ${this.storage.constructor.name}:`, error);
        
        // Wait before retry
        if (attempt < (this.options.maxRetries || 1) - 1) {
          this.sleep(this.options.retryDelay || 100);
        }
      }
    }

    this.stats.failedOperations++;

    // Fallback to memory storage
    if (this.options.fallbackToMemory) {
      try {
        this.memoryFallback.set(key, value);
        this.stats.fallbackOperations++;
        console.warn(`Using memory fallback for key: ${key}`);
        return true;
      } catch (error) {
        console.error('Memory fallback also failed:', error);
      }
    }

    // Fallback to sessionStorage if using localStorage
    if (this.options.fallbackToSession && this.storage === localStorage) {
      try {
        sessionStorage.setItem(key, value);
        this.stats.fallbackOperations++;
        console.warn(`Using sessionStorage fallback for key: ${key}`);
        return true;
      } catch (error) {
        console.error('SessionStorage fallback also failed:', error);
      }
    }

    return false;
  }

  /**
   * Remove item from storage
   */
  removeItem(key: string): boolean {
    this.stats.totalOperations++;

    try {
      this.storage.removeItem(key);
      this.stats.successfulOperations++;
      
      // Also remove from memory fallback
      if (this.options.fallbackToMemory) {
        this.memoryFallback.delete(key);
      }
      
      return true;
    } catch (error) {
      console.warn(`Failed to remove from ${this.storage.constructor.name}:`, error);
      this.stats.failedOperations++;
      
      // Remove from memory fallback anyway
      if (this.options.fallbackToMemory) {
        this.memoryFallback.delete(key);
        this.stats.fallbackOperations++;
      }
      
      return false;
    }
  }

  /**
   * Clear all storage
   */
  clear(): boolean {
    this.stats.totalOperations++;

    try {
      this.storage.clear();
      this.stats.successfulOperations++;
      
      // Clear memory fallback
      if (this.options.fallbackToMemory) {
        this.memoryFallback.clear();
      }
      
      return true;
    } catch (error) {
      console.warn(`Failed to clear ${this.storage.constructor.name}:`, error);
      this.stats.failedOperations++;
      
      // Clear memory fallback anyway
      if (this.options.fallbackToMemory) {
        this.memoryFallback.clear();
        this.stats.fallbackOperations++;
      }
      
      return false;
    }
  }

  /**
   * Get storage statistics
   */
  getStats(): StorageStats {
    return { ...this.stats };
  }

  /**
   * Reset statistics
   */
  resetStats(): void {
    this.stats = {
      totalOperations: 0,
      successfulOperations: 0,
      failedOperations: 0,
      fallbackOperations: 0
    };
  }

  /**
   * Check if storage is available
   */
  isAvailable(): boolean {
    try {
      const testKey = '__storage_test__';
      this.storage.setItem(testKey, 'test');
      this.storage.removeItem(testKey);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get available storage space (approximate)
   */
  getAvailableSpace(): number {
    try {
      if (this.storage === localStorage) {
        // Estimate based on existing data
        let totalSize = 0;
        for (let i = 0; i < this.storage.length; i++) {
          const key = this.storage.key(i);
          if (key) {
            const value = this.storage.getItem(key);
            if (value) {
              totalSize += key.length + value.length;
            }
          }
        }
        
        // Most browsers have 5-10MB limit
        const estimatedLimit = 5 * 1024 * 1024; // 5MB
        return Math.max(0, estimatedLimit - totalSize);
      }
    } catch (error) {
      console.warn('Could not estimate storage space:', error);
    }
    
    return 0;
  }

  private sleep(ms: number): void {
    const start = Date.now();
    while (Date.now() - start < ms) {
      // Busy wait
    }
  }
}

// Create robust storage instances
export const robustLocalStorage = new RobustStorage(localStorage, {
  fallbackToMemory: true,
  fallbackToSession: true,
  maxRetries: 3,
  retryDelay: 100
});

export const robustSessionStorage = new RobustStorage(sessionStorage, {
  fallbackToMemory: true,
  fallbackToSession: false,
  maxRetries: 2,
  retryDelay: 50
});

/**
 * JSON storage utilities with error handling
 */
export const jsonStorage = {
  getItem: <T>(key: string, defaultValue: T | null = null): T | null => {
    try {
      const value = robustLocalStorage.getItem(key);
      return value ? JSON.parse(value) : defaultValue;
    } catch (error) {
      console.warn(`Failed to parse JSON for key ${key}:`, error);
      return defaultValue;
    }
  },

  setItem: <T>(key: string, value: T): boolean => {
    try {
      const jsonString = JSON.stringify(value);
      return robustLocalStorage.setItem(key, jsonString);
    } catch (error) {
      console.warn(`Failed to stringify JSON for key ${key}:`, error);
      return false;
    }
  },

  removeItem: (key: string): boolean => {
    return robustLocalStorage.removeItem(key);
  }
};

/**
 * Hook for using robust storage in React components
 */
export function useRobustStorage() {
  return {
    localStorage: robustLocalStorage,
    sessionStorage: robustSessionStorage,
    jsonStorage,
    stats: {
      localStorage: robustLocalStorage.getStats(),
      sessionStorage: robustSessionStorage.getStats()
    }
  };
}
