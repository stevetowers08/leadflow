/**
 * Database Types - Generated from Supabase Schema
 * Based on actual database structure from Supabase MCP
 */

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  role: 'owner' | 'admin' | 'recruiter' | 'viewer';
  user_limit: number | null;
  is_active: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface Company {
  id: string;
  name: string;
  website: string | null;
  linkedin_url: string | null;
  head_office: string | null;
  industry_id: string | null;
  confidence_level: 'low' | 'medium' | 'high' | null;
  lead_score: string | null;
  score_reason: string | null;
  automation_active: boolean | null;
  automation_started_at: string | null;
  is_favourite: boolean | null;
  ai_info: any | null;
  key_info_raw: any | null;
  loxo_company_id: string | null;
  created_at: string | null;
  updated_at: string | null;
  industry: string | null;
  company_size: string | null;
  priority: string | null;
  logo_url: string | null;
  logo_cached_at: string | null;
  owner_id: string | null;
  lead_source: string | null;
  source_details: string | null;
  source_date: string | null;
  pipeline_stage:
    | 'new_lead'
    | 'automated'
    | 'replied'
    | 'meeting_scheduled'
    | 'proposal_sent'
    | 'negotiation'
    | 'closed_won'
    | 'closed_lost'
    | 'on_hold'
    | null;
  airtable_id: string | null;
}

export interface Job {
  id: string;
  title: string;
  company_id: string | null;
  job_url: string | null;
  posted_date: string | null;
  valid_through: string | null;
  location: string | null;
  description: string | null;
  summary: string | null;
  employment_type: string | null;
  seniority_level: string | null;
  linkedin_job_id: string | null;
  automation_active: boolean | null;
  automation_started_at: string | null;
  created_at: string | null;
  updated_at: string | null;
  priority: string | null;
  lead_score_job: number | null;
  salary: string | null;
  function: string | null;
  logo_url: string | null;
  owner_id: string | null;
  airtable_id: string | null;
  // Joined fields
  companies?: Company;
  assigned_to?: string | null;
  is_favorite?: boolean | null;
  total_leads?: number | null;
}

export interface Person {
  id: string;
  name: string;
  company_id: string | null;
  email_address: string | null;
  linkedin_url: string | null;
  employee_location: string | null;
  company_role: string | null;
  lead_score: string | null;
  stage:
    | 'new'
    | 'connection_requested'
    | 'connected'
    | 'messaged'
    | 'replied'
    | 'meeting_booked'
    | 'meeting_held'
    | 'disqualified'
    | 'in queue'
    | 'lead_lost';
  automation_started_at: string | null;
  linkedin_request_message: string | null;
  linkedin_follow_up_message: string | null;
  linkedin_connected_message: string | null;
  connected_at: string | null;
  last_reply_at: string | null;
  last_reply_channel: string | null;
  last_reply_message: string | null;
  last_interaction_at: string | null;
  owner_id: string | null;
  created_at: string | null;
  updated_at: string | null;
  confidence_level: string | null;
  email_draft: string | null;
  connection_request_date: string | null;
  connection_accepted_date: string | null;
  message_sent_date: string | null;
  response_date: string | null;
  meeting_booked: boolean | null;
  meeting_date: string | null;
  email_sent_date: string | null;
  email_reply_date: string | null;
  stage_updated: string | null;
  is_favourite: boolean | null;
  connection_request_sent: boolean | null;
  message_sent: boolean | null;
  linkedin_connected: boolean | null;
  linkedin_responded: boolean | null;
  campaign_finished: string | null;
  favourite: boolean | null;
  jobs: string | null;
  email_sent: boolean | null;
  email_reply: boolean | null;
  linkedin_profile_id: string | null;
  lead_source: string | null;
  source_details: string | null;
  source_date: string | null;
  reply_type: 'interested' | 'not_interested' | 'maybe' | null;
  airtable_id: string | null;
  // Joined fields
  company_name?: string | null;
  company_website?: string | null;
}

export interface Interaction {
  id: string;
  person_id: string;
  interaction_type:
    | 'linkedin_connection_request_sent'
    | 'linkedin_connected'
    | 'linkedin_message_sent'
    | 'linkedin_message_reply'
    | 'email_sent'
    | 'email_reply'
    | 'meeting_booked'
    | 'meeting_held'
    | 'disqualified'
    | 'note';
  occurred_at: string;
  subject: string | null;
  content: string | null;
  template_id: string | null;
  metadata: any | null;
  created_at: string | null;
  owner_id: string | null;
}

export interface Note {
  id: string;
  entity_id: string;
  entity_type: 'lead' | 'company' | 'job' | 'person';
  content: string;
  author_id: string;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string | null;
  description: string | null;
  is_active: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface EntityTag {
  id: string;
  entity_id: string;
  entity_type: 'company' | 'person' | 'job';
  tag_id: string;
  created_at: string | null;
}

export interface Campaign {
  id: string;
  name: string;
  description: string | null;
  campaign_type:
    | 'linkedin'
    | 'email'
    | 'cold_call'
    | 'social_media'
    | 'referral'
    | 'event'
    | 'other';
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
  target_audience: string | null;
  messaging_template: string | null;
  linkedin_message: string | null;
  email_subject: string | null;
  email_template: string | null;
  follow_up_message: string | null;
  call_script: string | null;
  start_date: string | null;
  end_date: string | null;
  created_by: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface CampaignParticipant {
  id: string;
  campaign_id: string;
  person_id: string;
  status:
    | 'pending'
    | 'sent'
    | 'delivered'
    | 'opened'
    | 'clicked'
    | 'replied'
    | 'connected'
    | 'meeting_booked'
    | 'converted'
    | 'unsubscribed'
    | 'bounced'
    | 'failed';
  sent_at: string | null;
  delivered_at: string | null;
  opened_at: string | null;
  clicked_at: string | null;
  replied_at: string | null;
  connected_at: string | null;
  meeting_booked_at: string | null;
  converted_at: string | null;
  notes: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface CampaignMessage {
  id: string;
  campaign_id: string;
  step_number: number;
  channel: 'email' | 'linkedin' | 'call';
  subject: string | null;
  body: string;
  delay_days: number | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface BusinessProfile {
  id: string;
  company_name: string;
  industry: string | null;
  company_size: string | null;
  target_company_size: string[] | null;
  target_industries: string[] | null;
  target_job_titles: string[] | null;
  target_seniority_levels: string[] | null;
  target_locations: string[] | null;
  ideal_customer_profile: string | null;
  pain_points: string[] | null;
  budget_range: string | null;
  decision_makers: string[] | null;
  sales_process_stages: string[] | null;
  qualification_criteria: any | null;
  lead_scoring_rules: any | null;
  automation_preferences: any | null;
  created_by: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface AssignmentLog {
  id: string;
  entity_type: string;
  entity_id: string;
  old_owner_id: string | null;
  new_owner_id: string | null;
  assigned_by: string;
  assigned_at: string | null;
  notes: string | null;
}

export interface ErrorLog {
  id: string;
  message: string;
  stack: string | null;
  timestamp: string | null;
  user_agent: string | null;
  url: string | null;
  type:
    | 'unhandled'
    | 'promise'
    | 'resource'
    | 'render'
    | 'network'
    | 'validation'
    | 'permission'
    | 'data'
    | 'unknown'
    | null;
  severity: 'low' | 'medium' | 'high' | 'critical' | null;
  component_name: string | null;
  user_id: string | null;
  session_id: string | null;
  metadata: any | null;
  created_at: string | null;
}

export interface Integration {
  id: string;
  platform: string;
  connected: boolean | null;
  config: any | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface SystemSetting {
  id: string;
  key: string;
  value: any;
  description: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface LeadSource {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface Invitation {
  id: string;
  email: string;
  role: 'admin' | 'manager' | 'recruiter' | 'viewer';
  invited_by: string;
  invited_at: string | null;
  expires_at: string | null;
  status: 'pending' | 'accepted' | 'expired' | 'cancelled';
  accepted_at: string | null;
  accepted_by: string | null;
  token: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface Client {
  id: string;
  name: string;
  email: string | null;
  company: string | null;
  accounts: any | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface ErrorSetting {
  id: string;
  user_id: string | null;
  email_notifications: boolean | null;
  notification_severity: 'low' | 'medium' | 'high' | 'critical' | null;
  notification_email: string | null;
  slack_webhook_url: string | null;
  webhook_url: string | null;
  created_at: string | null;
  updated_at: string | null;
}
