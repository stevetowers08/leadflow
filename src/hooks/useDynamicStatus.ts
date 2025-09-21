import { useState, useEffect, useCallback } from 'react';
import { 
  getJobStatus, 
  getCompanyStatus, 
  getBatchJobStatuses, 
  getBatchCompanyStatuses,
  JobStatus,
  CompanyStatus,
  Job,
  Company
} from '@/utils/statusCalculator';

interface StatusInfo {
  status: JobStatus | CompanyStatus;
  leadCount: number;
  isLoading: boolean;
  lastUpdated: Date | null;
}

interface BatchStatusMap {
  [key: string]: StatusInfo;
}

/**
 * Hook for managing dynamic job status
 */
export const useJobStatus = (job: Job | null) => {
  const [statusInfo, setStatusInfo] = useState<StatusInfo>({
    status: 'new',
    leadCount: 0,
    isLoading: false,
    lastUpdated: null
  });

  const refreshStatus = useCallback(async () => {
    if (!job) return;
    
    setStatusInfo(prev => ({ ...prev, isLoading: true }));
    
    try {
      const { status, leadCount } = await getJobStatus(job);
      setStatusInfo({
        status,
        leadCount,
        isLoading: false,
        lastUpdated: new Date()
      });
    } catch (error) {
      console.error('Error refreshing job status:', error);
      setStatusInfo(prev => ({ ...prev, isLoading: false }));
    }
  }, [job]);

  useEffect(() => {
    refreshStatus();
  }, [refreshStatus]);

  return {
    ...statusInfo,
    refreshStatus
  };
};

/**
 * Hook for managing dynamic company status
 */
export const useCompanyStatus = (company: Company | null) => {
  const [statusInfo, setStatusInfo] = useState<StatusInfo>({
    status: 'new',
    leadCount: 0,
    isLoading: false,
    lastUpdated: null
  });

  const refreshStatus = useCallback(async () => {
    if (!company) return;
    
    setStatusInfo(prev => ({ ...prev, isLoading: true }));
    
    try {
      const { status, leadCount } = await getCompanyStatus(company);
      setStatusInfo({
        status,
        leadCount,
        isLoading: false,
        lastUpdated: new Date()
      });
    } catch (error) {
      console.error('Error refreshing company status:', error);
      setStatusInfo(prev => ({ ...prev, isLoading: false }));
    }
  }, [company]);

  useEffect(() => {
    refreshStatus();
  }, [refreshStatus]);

  return {
    ...statusInfo,
    refreshStatus
  };
};

/**
 * Hook for managing batch job statuses
 */
export const useBatchJobStatuses = (jobs: Job[]) => {
  const [statusMap, setStatusMap] = useState<BatchStatusMap>({});
  const [isLoading, setIsLoading] = useState(false);

  const refreshAllStatuses = useCallback(async () => {
    if (jobs.length === 0) return;
    
    setIsLoading(true);
    
    try {
      const batchStatuses = await getBatchJobStatuses(jobs);
      const newStatusMap: BatchStatusMap = {};
      
      batchStatuses.forEach((statusInfo, jobId) => {
        newStatusMap[jobId] = {
          ...statusInfo,
          isLoading: false,
          lastUpdated: new Date()
        };
      });
      
      setStatusMap(newStatusMap);
    } catch (error) {
      console.error('Error refreshing batch job statuses:', error);
    } finally {
      setIsLoading(false);
    }
  }, [jobs]);

  useEffect(() => {
    refreshAllStatuses();
  }, [refreshAllStatuses]);

  const getJobStatus = useCallback((jobId: string): StatusInfo => {
    return statusMap[jobId] || {
      status: 'new',
      leadCount: 0,
      isLoading: true,
      lastUpdated: null
    };
  }, [statusMap]);

  return {
    statusMap,
    isLoading,
    getJobStatus,
    refreshAllStatuses
  };
};

/**
 * Hook for managing batch company statuses
 */
export const useBatchCompanyStatuses = (companies: Company[]) => {
  const [statusMap, setStatusMap] = useState<BatchStatusMap>({});
  const [isLoading, setIsLoading] = useState(false);

  const refreshAllStatuses = useCallback(async () => {
    if (companies.length === 0) return;
    
    setIsLoading(true);
    
    try {
      const batchStatuses = await getBatchCompanyStatuses(companies);
      const newStatusMap: BatchStatusMap = {};
      
      batchStatuses.forEach((statusInfo, companyId) => {
        newStatusMap[companyId] = {
          ...statusInfo,
          isLoading: false,
          lastUpdated: new Date()
        };
      });
      
      setStatusMap(newStatusMap);
    } catch (error) {
      console.error('Error refreshing batch company statuses:', error);
    } finally {
      setIsLoading(false);
    }
  }, [companies]);

  useEffect(() => {
    refreshAllStatuses();
  }, [refreshAllStatuses]);

  const getCompanyStatus = useCallback((companyId: string): StatusInfo => {
    return statusMap[companyId] || {
      status: 'new',
      leadCount: 0,
      isLoading: true,
      lastUpdated: null
    };
  }, [statusMap]);

  return {
    statusMap,
    isLoading,
    getCompanyStatus,
    refreshAllStatuses
  };
};

/**
 * Hook for real-time status updates
 */
export const useRealTimeStatus = (refreshInterval: number = 30000) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [refreshCallbacks, setRefreshCallbacks] = useState<Set<() => void>>(new Set());

  const registerRefreshCallback = useCallback((callback: () => void) => {
    setRefreshCallbacks(prev => new Set([...prev, callback]));
    return () => {
      setRefreshCallbacks(prev => {
        const newSet = new Set(prev);
        newSet.delete(callback);
        return newSet;
      });
    };
  }, []);

  useEffect(() => {
    if (!isEnabled || refreshCallbacks.size === 0) return;

    const interval = setInterval(() => {
      refreshCallbacks.forEach(callback => callback());
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [isEnabled, refreshCallbacks, refreshInterval]);

  const enableRealTime = useCallback(() => setIsEnabled(true), []);
  const disableRealTime = useCallback(() => setIsEnabled(false), []);

  return {
    isEnabled,
    enableRealTime,
    disableRealTime,
    registerRefreshCallback
  };
};

