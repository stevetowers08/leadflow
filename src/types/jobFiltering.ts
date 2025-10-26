// src/types/jobFiltering.ts

export interface JobFilterConfig {
  id?: string;
  client_id: string;
  user_id: string;

  // Configuration metadata
  config_name: string;
  platform:
    | 'linkedin'
    | 'indeed'
    | 'seek'
    | 'glassdoor'
    | 'ziprecruiter'
    | 'other';
  is_active: boolean;

  // Location filtering
  primary_location: string;
  search_radius: number;
  remote_options: string[];

  // Job criteria
  target_job_titles: string[];
  excluded_job_titles: string[];
  seniority_levels: string[];
  work_arrangements: string[];

  // Company filtering
  company_size_preferences: string[];
  included_industries: string[];
  excluded_industries: string[];
  included_companies: string[];
  excluded_companies: string[];

  // Keyword filtering
  required_keywords: string[];
  excluded_keywords: string[];

  // Time filtering
  max_days_old: number;

  // Additional filtering options
  job_functions: string[];

  // Timestamps
  created_at?: string;
  updated_at?: string;
}

export interface CreateJobFilterConfigRequest {
  config_name: string;
  platform:
    | 'linkedin'
    | 'indeed'
    | 'seek'
    | 'glassdoor'
    | 'ziprecruiter'
    | 'other';
  primary_location: string;
  search_radius?: number;
  target_job_titles?: string[];
  excluded_job_titles?: string[];
  seniority_levels?: string[];
  work_arrangements?: string[];
  required_keywords?: string[];
  excluded_keywords?: string[];
  excluded_industries?: string[];
  max_days_old?: number;
  is_active?: boolean;
}

export interface JobFilterTestResult {
  total_jobs: number;
  filtered_jobs: number;
  match_rate: number;
  results: Array<{
    id: string;
    title: string;
    company_name: string;
    location: string;
    match_score: number;
    filter_reason: string;
  }>;
}

export interface FilterOption {
  value: string;
  label: string;
  description?: string;
}

export const SENIORITY_LEVELS: FilterOption[] = [
  { value: 'entry', label: 'Entry Level' },
  { value: 'associate', label: 'Associate' },
  { value: 'mid-senior', label: 'Mid-Senior Level' },
  { value: 'director', label: 'Director' },
  { value: 'executive', label: 'Executive' },
];

export const WORK_ARRANGEMENTS: FilterOption[] = [
  { value: 'full_time', label: 'Full-time' },
  { value: 'part_time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' },
  { value: 'temporary', label: 'Temporary' },
];

export const JOB_FUNCTIONS: FilterOption[] = [
  { value: 'engineering', label: 'Engineering' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'sales', label: 'Sales' },
  { value: 'finance', label: 'Finance' },
  { value: 'hr', label: 'Human Resources' },
  { value: 'operations', label: 'Operations' },
  { value: 'design', label: 'Design' },
  { value: 'product', label: 'Product' },
  { value: 'customer_service', label: 'Customer Service' },
  { value: 'data', label: 'Data & Analytics' },
];
