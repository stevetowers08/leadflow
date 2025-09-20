import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface DropdownOption {
  value: string;
  label: string;
}

export interface ReferenceOption {
  id: string;
  name: string;
}

// Hook for reference table dropdowns
export const useReferenceOptions = (tableName: 'industries' | 'job_functions' | 'company_sizes') => {
  const [options, setOptions] = useState<ReferenceOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReferenceOptions = async () => {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('id, name')
          .order('name');

        if (error) {
          console.error(`Error fetching ${tableName} options:`, error);
          return;
        }

        if (data) {
          setOptions(data);
        }
      } catch (error) {
        console.error(`Error fetching ${tableName} options:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchReferenceOptions();
  }, [tableName]);

  return { options, loading };
};

// Static enum options for immediate use
export const LEAD_STAGE_OPTIONS: DropdownOption[] = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'interview', label: 'Interview' },
  { value: 'offer', label: 'Offer' },
  { value: 'hired', label: 'Hired' },
  { value: 'lost', label: 'Lost' }
];

export const PRIORITY_OPTIONS: DropdownOption[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' }
];

export const COMPANY_STATUS_OPTIONS: DropdownOption[] = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'prospect', label: 'Prospect' }
];

export const JOB_STATUS_OPTIONS: DropdownOption[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'active', label: 'Active' },
  { value: 'paused', label: 'Paused' },
  { value: 'filled', label: 'Filled' },
  { value: 'cancelled', label: 'Cancelled' }
];

export const EMPLOYMENT_TYPE_OPTIONS: DropdownOption[] = [
  { value: 'full-time', label: 'Full Time' },
  { value: 'part-time', label: 'Part Time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' },
  { value: 'freelance', label: 'Freelance' }
];

export const SENIORITY_LEVEL_OPTIONS: DropdownOption[] = [
  { value: 'entry', label: 'Entry Level' },
  { value: 'junior', label: 'Junior' },
  { value: 'mid', label: 'Mid Level' },
  { value: 'senior', label: 'Senior' },
  { value: 'lead', label: 'Lead' },
  { value: 'manager', label: 'Manager' },
  { value: 'director', label: 'Director' },
  { value: 'executive', label: 'Executive' }
];

export const CONFIDENCE_LEVEL_OPTIONS: DropdownOption[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'very-high', label: 'Very High' }
];

export const AUTOMATION_STATUS_OPTIONS: DropdownOption[] = [
  { value: 'idle', label: 'Idle' },
  { value: 'queued', label: 'Queued' },
  { value: 'running', label: 'Running' },
  { value: 'paused', label: 'Paused' },
  { value: 'completed', label: 'Completed' },
  { value: 'failed', label: 'Failed' }
];

export const LEAD_SOURCE_OPTIONS: DropdownOption[] = [
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'email', label: 'Email' },
  { value: 'referral', label: 'Referral' },
  { value: 'website', label: 'Website' },
  { value: 'event', label: 'Event' },
  { value: 'other', label: 'Other' }
];