/**
 * Background Logo Refresh Service
 * Runs periodically to refresh stale company logos
 */

import { refreshStaleLogos, getLogoStats } from '@/services/logoService';

class LogoRefreshService {
  private intervalId: NodeJS.Timeout | null = null;
  private isRunning = false;

  /**
   * Start the background refresh service
   */
  start(intervalMinutes: number = 60): void {
    if (this.intervalId) {
      console.log('Logo refresh service already running');
      return;
    }

    console.log(
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
      console.log('Logo refresh service stopped');
    }
  }

  /**
   * Run the refresh process
   */
  private async runRefresh(): Promise<void> {
    if (this.isRunning) {
      console.log('Logo refresh already in progress, skipping...');
      return;
    }

    this.isRunning = true;

    try {
      console.log('🔄 Starting logo refresh...');

      // Get stats before refresh
      const statsBefore = await getLogoStats();
      console.log('📊 Logo stats before refresh:', statsBefore);

      // Run refresh
      await refreshStaleLogos();

      // Get stats after refresh
      const statsAfter = await getLogoStats();
      console.log('📊 Logo stats after refresh:', statsAfter);

      console.log('✅ Logo refresh completed');
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
