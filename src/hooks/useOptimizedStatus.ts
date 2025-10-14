import { supabase } from '@/integrations/supabase/client';
import { CompanyStatus, JobStatus } from '@/utils/statusCalculator';
import { useCallback, useEffect, useState } from 'react';

interface StatusInfo {
  status: JobStatus | CompanyStatus;
  leadCount: number;
  lastUpdated: Date;
}

interface StatusMap {
  [key: string]: StatusInfo;
}

/**
 * Optimized hook for managing job and company statuses
 * Uses single batch queries instead of individual requests
 */
export const useOptimizedStatus = () => {
  const [jobStatuses, setJobStatuses] = useState<StatusMap>({});
  const [companyStatuses, setCompanyStatuses] = useState<StatusMap>({});
  const [isLoading, setIsLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const refreshAllStatuses = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // Single query to get all leads with their job and company associations
      const { data: leads, error } = await supabase
        .from('People')
        .select(`
          id,
          Stage,
          stage_enum,
          Company,
          Jobs
        `);

      if (error) throw error;

      // Process job statuses
      const jobStatusMap: StatusMap = {};
      const companyStatusMap: StatusMap = {};

      // Group leads by job and company
      const leadsByJob: { [jobId: string]: any[] } = {};
      const leadsByCompany: { [companyName: string]: any[] } = {};

      leads?.forEach(lead => {
        // Group by job (if Jobs field contains job info)
        if (lead.Jobs) {
          const jobId = lead.Jobs; // Assuming Jobs field contains job ID
          if (!leadsByJob[jobId]) leadsByJob[jobId] = [];
          leadsByJob[jobId].push(lead);
        }

        // Group by company
        if (lead.Company) {
          if (!leadsByCompany[lead.Company]) leadsByCompany[lead.Company] = [];
          leadsByCompany[lead.Company].push(lead);
        }
      });

      // Calculate job statuses
      Object.entries(leadsByJob).forEach(([jobId, jobLeads]) => {
        const status = calculateStatusFromLeads(jobLeads);
        jobStatusMap[jobId] = {
          status,
          leadCount: jobLeads.length,
          lastUpdated: new Date()
        };
      });

      // Calculate company statuses
      Object.entries(leadsByCompany).forEach(([companyName, companyLeads]) => {
        const status = calculateStatusFromLeads(companyLeads);
        companyStatusMap[companyName] = {
          status,
          leadCount: companyLeads.length,
          lastUpdated: new Date()
        };
      });

      setJobStatuses(jobStatusMap);
      setCompanyStatuses(companyStatusMap);
      setLastRefresh(new Date());

    } catch (error) {
      console.error('Error refreshing statuses:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const calculateStatusFromLeads = (leads: any[]): JobStatus | CompanyStatus => {
    if (!leads || leads.length === 0) return 'new';

    const statuses = leads.map(lead => {
      const status = lead.stage_enum || lead.Stage?.toLowerCase();
      return status;
    }).filter(Boolean);

    if (statuses.length === 0) return 'new';

    // Determine status based on lead progression
    if (statuses.includes('hired')) return 'completed';
    if (statuses.includes('lead lost')) return 'failed';
    if (statuses.includes('replied') || statuses.includes('connected')) return 'active';
    if (statuses.includes('msg sent') || statuses.includes('connect sent')) return 'active';
    if (statuses.includes('paused')) return 'paused';
    
    return 'new';
  };

  const getJobStatus = useCallback((jobId: string): StatusInfo => {
    return jobStatuses[jobId] || {
      status: 'new',
      leadCount: 0,
      lastUpdated: new Date()
    };
  }, [jobStatuses]);

  const getCompanyStatus = useCallback((companyName: string): StatusInfo => {
    return companyStatuses[companyName] || {
      status: 'new',
      leadCount: 0,
      lastUpdated: new Date()
    };
  }, [companyStatuses]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    refreshAllStatuses();
    
    const interval = setInterval(() => {
      refreshAllStatuses();
    }, 30000);

    return () => clearInterval(interval);
  }, [refreshAllStatuses]);

  return {
    jobStatuses,
    companyStatuses,
    isLoading,
    lastRefresh,
    refreshAllStatuses,
    getJobStatus,
    getCompanyStatus
  };
};

/**
 * Hook for real-time status updates
 * Automatically refreshes when data changes
 */
export const useRealTimeStatus = () => {
  const { refreshAllStatuses } = useOptimizedStatus();

  useEffect(() => {
    // Set up real-time subscription for People table changes
    const subscription = supabase
      .channel('people-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'People' 
        }, 
        () => {
          // Debounce the refresh to avoid too many updates
          setTimeout(() => {
            refreshAllStatuses();
          }, 1000);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [refreshAllStatuses]);

  return {
    refreshAllStatuses
  };
};


