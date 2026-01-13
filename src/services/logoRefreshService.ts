/**
 * Background Logo Refresh Service
 * Runs periodically to refresh stale company logos
 */

import { batchUpdateLogos } from '@/services/logoService';
import { logger } from '@/utils/productionLogger';

class LogoRefreshService {
  private intervalId: NodeJS.Timeout | null = null;
  private isRunning = false;

  /**
   * Start the background refresh service
   */
  start(intervalMinutes: number = 60): void {
    if (this.intervalId) {
      logger.debug('Logo refresh service already running');
      return;
    }

    logger.info(
      `Starting logo refresh service (every ${intervalMinutes} minutes)`
    );

    // Run immediately
    this.runRefresh();

    // Then run on interval
    this.intervalId = setInterval(
      () => {
        this.runRefresh();
      },
      intervalMinutes * 60 * 1000
    );
  }

  /**
   * Stop the background refresh service
   */
  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      logger.debug('Logo refresh service stopped');
    }
  }

  /**
   * Run the refresh process
   */
  private async runRefresh(): Promise<void> {
    if (this.isRunning) {
      logger.debug('Logo refresh already in progress, skipping...');
      return;
    }

    this.isRunning = true;

    try {
      logger.info('Starting logo refresh...');

      // Run batch update for stale logos
      // Note: This is a simplified refresh - batchUpdateLogos handles the refresh logic
      await batchUpdateLogos();

      logger.info('Logo refresh completed');
    } catch (error) {
      console.error('❌ Error during logo refresh:', error);
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Get service status
   */
  getStatus(): { isRunning: boolean; hasInterval: boolean } {
    return {
      isRunning: this.isRunning,
      hasInterval: this.intervalId !== null,
    };
  }
}

// Export singleton instance
export const logoRefreshService = new LogoRefreshService();

// Auto-start in production
if (typeof window === 'undefined' && process.env.NODE_ENV === 'production') {
  logoRefreshService.start(60); // Refresh every hour
}
