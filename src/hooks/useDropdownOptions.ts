import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface DropdownOption {
  value: string;
  label: string;
  color?: string;
}

export interface ReferenceOption {
  id: string;
  name: string;
}

// Hook for database-driven enum dropdowns
export const useDatabaseDropdowns = (dropdownType: string) => {
  const [options, setOptions] = useState<DropdownOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDropdownOptions = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase.rpc(
          'get_dropdown_options' as never,
          {
            dropdown_type: dropdownType,
          } as never
        );

        if (error) throw error;

        setOptions((data as DropdownOption[]) || []);
      } catch (err) {
        console.error(`Error fetching ${dropdownType} options:`, err);
        setError(
          err instanceof Error ? err.message : 'Failed to fetch options'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDropdownOptions();
  }, [dropdownType]);

  return { options, loading, error };
};

// Convenience hooks for specific dropdown types
export const useCompanyStatusDropdown = () =>
  useDatabaseDropdowns('company_status');
export const useLeadStageDropdown = () => useDatabaseDropdowns('lead_stage');
export const usePriorityLevelDropdown = () =>
  useDatabaseDropdowns('priority_level');
export const useAutomationStatusDropdown = () =>
  useDatabaseDropdowns('automation_status');
export const useConfidenceLevelDropdown = () =>
  useDatabaseDropdowns('confidence_level');
export const useLeadSourceDropdown = () => useDatabaseDropdowns('lead_source');

// Hook for reference table dropdowns (if still needed)
export const useReferenceOptions = (
  tableName: 'industries' | 'job_functions' | 'company_sizes'
) => {
  const [options, setOptions] = useState<ReferenceOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReferenceOptions = async () => {
      try {
        const { data, error } = await supabase
          .from(tableName as never)
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

// Fallback options for when database is unavailable (keep as backup)
export const FALLBACK_LEAD_STAGE_OPTIONS: DropdownOption[] = [
  { value: 'new', label: 'New Lead' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'interview', label: 'Interview' },
  { value: 'offer', label: 'Offer' },
  { value: 'hired', label: 'Hired' },
  { value: 'lost', label: 'Lost' },
];

export const FALLBACK_PRIORITY_OPTIONS: DropdownOption[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

export const FALLBACK_COMPANY_STATUS_OPTIONS: DropdownOption[] = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'prospect', label: 'Prospect' },
];

export const FALLBACK_AUTOMATION_STATUS_OPTIONS: DropdownOption[] = [
  { value: 'idle', label: 'Idle' },
  { value: 'queued', label: 'Queued' },
  { value: 'running', label: 'Running' },
  { value: 'paused', label: 'Paused' },
  { value: 'completed', label: 'Completed' },
  { value: 'failed', label: 'Failed' },
];

export const FALLBACK_CONFIDENCE_LEVEL_OPTIONS: DropdownOption[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'very-high', label: 'Very High' },
];

export const FALLBACK_LEAD_SOURCE_OPTIONS: DropdownOption[] = [
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'email', label: 'Email' },
  { value: 'referral', label: 'Referral' },
  { value: 'website', label: 'Website' },
  { value: 'event', label: 'Event' },
  { value: 'other', label: 'Other' },
];
