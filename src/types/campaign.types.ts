// Campaign Sequence Types
export interface CampaignSequence {
  id: string;
  name: string;
  description?: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  pause_on_reply?: boolean; // Control whether to auto-pause on reply
  created_at: string;
  updated_at: string;
  created_by: string;
  total_leads?: number;
  active_leads?: number;
}

export type CampaignStep = EmailStep | WaitStep | ConditionStep;

export interface BaseStep {
  id: string;
  sequence_id: string;
  order_position: number;
  step_type: 'email' | 'wait' | 'condition';
  name: string; // Add name field
  created_at: string;
}

export interface EmailStep extends BaseStep {
  step_type: 'email';
  email_subject: string; // "Hi {{first_name}}"
  email_body: string; // HTML content with variables
  email_template_id?: string;
  send_immediately: string; // Changed to string to match database
  send_time?: string;
}

export interface WaitStep extends BaseStep {
  step_type: 'wait';
  name: string; // "Wait 2 days"
  wait_duration: number; // 2
  wait_unit: 'hours' | 'days' | 'weeks';
  business_hours_only: boolean;
  timezone?: string;
}

export interface ConditionStep extends BaseStep {
  step_type: 'condition';
  name: string; // "If email opened"
  condition_type: 'opened' | 'clicked' | 'replied' | 'custom';
  condition_wait_duration?: number; // hours to wait before checking
  true_next_step_id?: string;
  false_next_step_id?: string;
}

// Variable placeholder system
export interface VariableOption {
  key: string; // "first_name"
  label: string; // "First Name"
  example: string; // "John"
  category: 'contact' | 'company' | 'custom';
}

export const DEFAULT_VARIABLES: VariableOption[] = [
  {
    key: 'first_name',
    label: 'First Name',
    example: 'John',
    category: 'contact',
  },
  { key: 'last_name', label: 'Last Name', example: 'Doe', category: 'contact' },
  {
    key: 'email',
    label: 'Email',
    example: 'john@example.com',
    category: 'contact',
  },
  {
    key: 'company',
    label: 'Company Name',
    example: 'Acme Corp',
    category: 'company',
  },
  { key: 'title', label: 'Job Title', example: 'CEO', category: 'contact' },
  { key: 'phone', label: 'Phone', example: '+1234567890', category: 'contact' },
  {
    key: 'company_size',
    label: 'Company Size',
    example: '50-200',
    category: 'company',
  },
  {
    key: 'industry',
    label: 'Industry',
    example: 'Technology',
    category: 'company',
  },
];

// Campaign sequence lead tracking
export interface CampaignSequenceLead {
  id: string;
  sequence_id: string;
  lead_id: string; // Changed from person_id to match database
  current_step_id?: string;
  status: 'active' | 'completed' | 'paused' | 'exited' | 'bounced';
  started_at: string;
  completed_at?: string;
  exited_at?: string;
  last_activity_at?: string;
}

// Campaign sequence execution tracking
export interface CampaignSequenceExecution {
  id: string;
  sequence_lead_id: string;
  step_id: string;
  executed_at: string;
  status:
    | 'pending'
    | 'sent'
    | 'opened'
    | 'clicked'
    | 'replied'
    | 'bounced'
    | 'failed';
  email_id?: string;
  error_message?: string;
}

// Form data for creating/editing campaigns
export interface CampaignSequenceFormData {
  name: string;
  description: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
}

// Analytics and reporting types
export interface CampaignSequenceAnalytics {
  sequence_id: string;
  total_leads: number;
  active_leads: number;
  completed_leads: number;
  total_sent: number;
  total_opened: number;
  total_clicked: number;
  total_replied: number;
  total_bounced: number;
  open_rate: number;
  click_rate: number;
  reply_rate: number;
  bounce_rate: number;
}

export interface StepAnalytics {
  step_id: string;
  step_name: string;
  step_type: string;
  sent: number;
  opened: number;
  clicked: number;
  replied: number;
  bounced: number;
  open_rate: number;
  click_rate: number;
  reply_rate: number;
  bounce_rate: number;
}

// Validation types
export interface StepValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Campaign settings
export interface CampaignSequenceSettings {
  timezone: string;
  business_hours_start: number; // 9
  business_hours_end: number; // 17
  business_days: number[]; // [1,2,3,4,5] (Mon-Fri)
  max_daily_sends: number;
  bounce_handling: 'pause' | 'remove' | 'continue';
}
