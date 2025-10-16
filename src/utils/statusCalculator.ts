import { supabase } from '@/integrations/supabase/client';
import { getUnifiedStatusClass } from './colorScheme';

// Lead status types from the database
export type LeadStatus =
  | 'new'
  | 'in queue'
  | 'connect sent'
  | 'msg sent'
  | 'connected'
  | 'replied'
  | 'hired'
  | 'lead lost'
  | 'paused';

// Job status types
export type JobStatus = 'new' | 'active' | 'paused' | 'completed' | 'failed';

// Company status types
export type CompanyStatus =
  | 'new'
  | 'active'
  | 'paused'
  | 'completed'
  | 'failed';

export interface Lead {
  id: string;
  Stage: string | null;
  stage_enum: LeadStatus | null;
  Company: string | null;
  company_id: string | null;
  Jobs: string | null;
}

export interface Job {
  id: string;
  'Job Title': string;
  Company: string;
  [key: string]: any;
}

export interface Company {
  id: string;
  'Company Name': string;
  [key: string]: any;
}

/**
 * Calculate job status based on associated leads
 */
export const calculateJobStatus = (leads: Lead[]): JobStatus => {
  if (!leads || leads.length === 0) {
    return 'new';
  }

  // Get all lead statuses, prioritizing stage_enum over Stage
  const leadStatuses = leads
    .map(lead => {
      const status =
        lead.stage_enum || (lead.Stage?.toLowerCase() as LeadStatus);
      return status;
    })
    .filter(Boolean);

  if (leadStatuses.length === 0) {
    return 'new';
  }

  // Status priority logic
  const hasActiveLeads = leadStatuses.some(status =>
    ['in queue', 'connect sent', 'msg sent', 'connected'].includes(status)
  );

  const hasCompletedLeads = leadStatuses.some(status =>
    ['replied', 'hired'].includes(status)
  );

  const hasFailedLeads = leadStatuses.some(status =>
    ['lead lost'].includes(status)
  );

  const hasPausedLeads = leadStatuses.some(status =>
    ['paused'].includes(status)
  );

  // Determine overall status
  if (hasActiveLeads) {
    return 'active';
  }

  if (hasPausedLeads && !hasActiveLeads) {
    return 'paused';
  }

  if (hasCompletedLeads && !hasActiveLeads && !hasPausedLeads) {
    return 'completed';
  }

  if (
    hasFailedLeads &&
    !hasActiveLeads &&
    !hasPausedLeads &&
    !hasCompletedLeads
  ) {
    return 'failed';
  }

  // Default to new if all leads are new
  return 'new';
};

/**
 * Calculate company status based on associated leads
 */
export const calculateCompanyStatus = (leads: Lead[]): CompanyStatus => {
  return calculateJobStatus(leads); // Same logic applies to companies
};

/**
 * Get leads associated with a job
 */
export const getJobLeads = async (job: Job): Promise<Lead[]> => {
  try {
    const { data, error } = await supabase
      .from('People')
      .select('id, Stage, stage_enum, Company, company_id, Jobs')
      .or(`Company.ilike.%${job.Company}%,Jobs.ilike.%${job['Job Title']}%`);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching job leads:', error);
    return [];
  }
};

/**
 * Get leads associated with a company
 */
export const getCompanyLeads = async (company: Company): Promise<Lead[]> => {
  try {
    const { data, error } = await supabase
      .from('People')
      .select('id, Stage, stage_enum, Company, company_id, Jobs')
      .ilike('Company', `%${company['Company Name']}%`);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching company leads:', error);
    return [];
  }
};

/**
 * Calculate and return job status with associated leads
 */
export const getJobStatus = async (
  job: Job
): Promise<{ status: JobStatus; leadCount: number; leads: Lead[] }> => {
  const leads = await getJobLeads(job);
  const status = calculateJobStatus(leads);

  return {
    status,
    leadCount: leads.length,
    leads,
  };
};

/**
 * Calculate and return company status with associated leads
 */
export const getCompanyStatus = async (
  company: Company
): Promise<{ status: CompanyStatus; leadCount: number; leads: Lead[] }> => {
  const leads = await getCompanyLeads(company);
  const status = calculateCompanyStatus(leads);

  return {
    status,
    leadCount: leads.length,
    leads,
  };
};

/**
 * Batch calculate statuses for multiple jobs
 */
export const getBatchJobStatuses = async (
  jobs: Job[]
): Promise<Map<string, { status: JobStatus; leadCount: number }>> => {
  const statusMap = new Map();

  // Process jobs in batches to avoid overwhelming the database
  const batchSize = 10;
  for (let i = 0; i < jobs.length; i += batchSize) {
    const batch = jobs.slice(i, i + batchSize);

    const promises = batch.map(async job => {
      const { status, leadCount } = await getJobStatus(job);
      return { jobId: job.id, status, leadCount };
    });

    const results = await Promise.all(promises);
    results.forEach(({ jobId, status, leadCount }) => {
      statusMap.set(jobId, { status, leadCount });
    });
  }

  return statusMap;
};

/**
 * Batch calculate statuses for multiple companies
 */
export const getBatchCompanyStatuses = async (
  companies: Company[]
): Promise<Map<string, { status: CompanyStatus; leadCount: number }>> => {
  const statusMap = new Map();

  // Process companies in batches to avoid overwhelming the database
  const batchSize = 10;
  for (let i = 0; i < companies.length; i += batchSize) {
    const batch = companies.slice(i, i + batchSize);

    const promises = batch.map(async company => {
      const { status, leadCount } = await getCompanyStatus(company);
      return { companyId: company.id, status, leadCount };
    });

    const results = await Promise.all(promises);
    results.forEach(({ companyId, status, leadCount }) => {
      statusMap.set(companyId, { status, leadCount });
    });
  }

  return statusMap;
};

/**
 * Get status color and styling information
 * Now uses unified color scheme for consistency
 */
export const getStatusInfo = (status: JobStatus | CompanyStatus) => {
  const statusInfo = {
    new: {
      color: getUnifiedStatusClass('new'),
      label: 'New Lead',
      description: 'Just entered the system',
    },
    active: {
      color: getUnifiedStatusClass('active'),
      label: 'Active',
      description: 'Automation running',
    },
    paused: {
      color: getUnifiedStatusClass('paused'),
      label: 'Paused',
      description: 'Automation stopped',
    },
    completed: {
      color: getUnifiedStatusClass('completed'),
      label: 'Completed',
      description: 'Recruitment finished',
    },
    failed: {
      color: getUnifiedStatusClass('failed'),
      label: 'Failed',
      description: 'Automation issues',
    },
  };

  return statusInfo[status] || statusInfo.new;
};
