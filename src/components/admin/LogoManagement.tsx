/**
 * Logo Management Admin Component
 * Provides interface to manage company logos and view statistics
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, BarChart3, CheckCircle, Clock, XCircle } from 'lucide-react';
import { getLogoStats, refreshStaleLogos } from '@/utils/logoService';
import { logoRefreshService } from '@/services/logoRefreshService';

interface LogoStats {
  totalCompanies: number;
  cachedLogos: number;
  staleLogos: number;
  missingLogos: number;
}

export const LogoManagement: React.FC = () => {
  const [stats, setStats] = useState<LogoStats | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [serviceStatus, setServiceStatus] = useState(logoRefreshService.getStatus());

  const loadStats = async () => {
    try {
      const logoStats = await getLogoStats();
      setStats(logoStats);
    } catch (error) {
      console.error('Error loading logo stats:', error);
    }
  };

  const handleRefreshLogos = async () => {
    setIsRefreshing(true);
    try {
      await refreshStaleLogos();
      await loadStats(); // Reload stats after refresh
    } catch (error) {
      console.error('Error refreshing logos:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleToggleService = () => {
    if (serviceStatus.hasInterval) {
      logoRefreshService.stop();
    } else {
      logoRefreshService.start(60);
    }
    setServiceStatus(logoRefreshService.getStatus());
  };

  useEffect(() => {
    loadStats();
    
    // Update service status every 5 seconds
    const interval = setInterval(() => {
      setServiceStatus(logoRefreshService.getStatus());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!stats) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading logo statistics...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const cachePercentage = stats.totalCompanies > 0 
    ? Math.round((stats.cachedLogos / stats.totalCompanies) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Logo Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.totalCompanies}</div>
              <div className="text-sm text-muted-foreground">Total Companies</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.cachedLogos}</div>
              <div className="text-sm text-muted-foreground">Cached Logos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.staleLogos}</div>
              <div className="text-sm text-muted-foreground">Stale Logos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.missingLogos}</div>
              <div className="text-sm text-muted-foreground">Missing Logos</div>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm">
              <span>Cache Coverage</span>
              <span>{cachePercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${cachePercentage}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Logo Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Manual Refresh</h3>
              <p className="text-sm text-muted-foreground">
                Refresh all stale logos now
              </p>
            </div>
            <Button 
              onClick={handleRefreshLogos}
              disabled={isRefreshing}
              className="flex items-center gap-2"
            >
              {isRefreshing ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              {isRefreshing ? 'Refreshing...' : 'Refresh Now'}
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Background Service</h3>
              <p className="text-sm text-muted-foreground">
                Automatically refresh stale logos every hour
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={serviceStatus.hasInterval ? "default" : "secondary"}>
                {serviceStatus.hasInterval ? (
                  <>
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Running
                  </>
                ) : (
                  <>
                    <XCircle className="h-3 w-3 mr-1" />
                    Stopped
                  </>
                )}
              </Badge>
              <Button 
                variant="outline"
                onClick={handleToggleService}
                disabled={serviceStatus.isRunning}
              >
                {serviceStatus.hasInterval ? 'Stop' : 'Start'}
              </Button>
            </div>
          </div>

          {serviceStatus.isRunning && (
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <Clock className="h-4 w-4" />
              Background refresh in progress...
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              <div>
                <strong>Cached Logos:</strong> Logos stored in database, valid for 30 days
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 text-yellow-600 mt-0.5" />
              <div>
                <strong>Stale Logos:</strong> Cached logos older than 30 days, need refresh
              </div>
            </div>
            <div className="flex items-start gap-2">
              <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
              <div>
                <strong>Missing Logos:</strong> No logo URL cached, will use Clearbit API
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
