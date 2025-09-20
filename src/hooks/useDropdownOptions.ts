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

// Hook for enum-based dropdowns
export const useEnumOptions = (enumType: string) => {
  const [options, setOptions] = useState<DropdownOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnumOptions = async () => {
      try {
        const { data, error } = await supabase
          .rpc('get_enum_values', { enum_type: enumType });
        
        if (error) {
          console.error('Error fetching enum options:', error);
          return;
        }

        const formattedOptions = data?.map((value: string) => ({
          value,
          label: value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, ' ')
        })) || [];

        setOptions(formattedOptions);
      } catch (error) {
        console.error('Error fetching enum options:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEnumOptions();
  }, [enumType]);

  return { options, loading };
};

// Hook for reference table dropdowns
export const useReferenceOptions = (tableName: string) => {
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

        setOptions(data || []);
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