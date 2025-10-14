/**
 * Job Status Utility - DEPRECATED
 * 
 * This file is deprecated. Use JobStatus from statusCalculator.ts instead.
 * 
 * Jobs inherit their status from their company's pipeline_stage:
 * - NEW LEAD: Company is in 'new_lead' stage
 * - AUTOMATED: Company is in any other stage (automation has started)
 */

// Re-export the unified JobStatus type
export type { JobStatus } from './statusCalculator';

/**
 * Get job status based on company pipeline stage
 * @deprecated Use calculateJobStatus from statusCalculator.ts instead
 */
export function getJobStatusFromPipeline(companyPipelineStage?: string): JobStatus {
  if (!companyPipelineStage || companyPipelineStage === 'new_lead') {
    return 'new';
  }
  return 'automated';
}

/**
 * Check if a job is automated based on company pipeline stage
 * @deprecated Use calculateJobStatus from statusCalculator.ts instead
 */
export function isJobAutomated(companyPipelineStage?: string): boolean {
  return getJobStatusFromPipeline(companyPipelineStage) === 'automated';
}

/**
 * Get job status display text
 * @deprecated Use getStatusDisplayText from statusUtils.ts instead
 */
export function getJobStatusDisplayText(status: JobStatus): string {
  return status === 'new' ? 'New Lead' : 'Automated';
}

