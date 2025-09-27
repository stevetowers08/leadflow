/**
 * Label utility functions for consistent text across the application
 */

export const getLabel = (category: string, key: string): string => {
  const labels: Record<string, Record<string, string>> = {
    table: {
      ai_score: 'AI Score',
      lead_score: 'Lead Score',
      company_name: 'Company',
      job_title: 'Job Title',
      person_name: 'Name',
      status: 'Status',
      priority: 'Priority',
      created_at: 'Created',
      updated_at: 'Updated',
    },
    sort: {
      ai_score: 'AI Score',
      lead_score: 'Lead Score',
      company_name: 'Company Name',
      job_title: 'Job Title',
      person_name: 'Person Name',
      status: 'Status',
      priority: 'Priority',
      created_at: 'Created Date',
      updated_at: 'Updated Date',
    },
    status: {
      new: 'New',
      qualified: 'Qualified',
      prospect: 'Prospect',
      active: 'Active',
      inactive: 'Inactive',
      closed: 'Closed',
    },
    priority: {
      low: 'Low',
      medium: 'Medium',
      high: 'High',
      urgent: 'Urgent',
    },
  };

  return labels[category]?.[key] || key;
};