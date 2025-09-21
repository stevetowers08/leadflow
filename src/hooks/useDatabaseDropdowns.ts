import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface DatabaseDropdownOption {
  value: string;
  label: string;
}

export type DropdownType = 
  | 'company_status'
  | 'lead_stage' 
  | 'job_status'
  | 'priority_level'
  | 'automation_status'
  | 'confidence_level'
  | 'lead_source'
  | 'employment_type'
  | 'seniority_level';

export const useDatabaseDropdowns = (dropdownType: DropdownType) => {
  const [options, setOptions] = useState<DatabaseDropdownOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDropdownOptions = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase.rpc('get_dropdown_options', {
          dropdown_type: dropdownType
        });

        if (error) throw error;

        setOptions(data || []);
      } catch (err) {
        console.error(`Error fetching ${dropdownType} options:`, err);
        setError(err instanceof Error ? err.message : 'Failed to fetch options');
      } finally {
        setLoading(false);
      }
    };

    fetchDropdownOptions();
  }, [dropdownType]);

  return { options, loading, error };
};

// Convenience hooks for specific dropdown types
export const useCompanyStatusDropdown = () => useDatabaseDropdowns('company_status');
export const useLeadStageDropdown = () => useDatabaseDropdowns('lead_stage');
export const useJobStatusDropdown = () => useDatabaseDropdowns('job_status');
export const usePriorityLevelDropdown = () => useDatabaseDropdowns('priority_level');
export const useAutomationStatusDropdown = () => useDatabaseDropdowns('automation_status');
export const useConfidenceLevelDropdown = () => useDatabaseDropdowns('confidence_level');
export const useLeadSourceDropdown = () => useDatabaseDropdowns('lead_source');
export const useEmploymentTypeDropdown = () => useDatabaseDropdowns('employment_type');
export const useSeniorityLevelDropdown = () => useDatabaseDropdowns('seniority_level');
