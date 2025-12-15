/**
 * Database Types - Generated from Supabase Schema
 * Based on actual database structure from Supabase MCP
 */

// AI and key info types
export interface AiInfo {
  summary?: string;
  insights?: string[];
  confidence?: number;
  lastAnalyzed?: string;
}

export interface KeyInfoRaw {
  extractedData?: Record<string, unknown>;
  source?: string;
  extractedAt?: string;
}

// Common metadata and config types
export interface Metadata {
  [key: string]: unknown;
}

export interface Config {
  [key: string]: unknown;
}

export interface Settings {
  [key: string]: unknown;
}

export interface OperationDetails {
  [key: string]: unknown;
}

export interface ExecutionDetails {
  [key: string]: unknown;
}

// Specific types for automation settings

export interface LeadScoringRules {
  [key: string]: unknown;
}

export interface AutomationPreferences {
  [key: string]: unknown;
}

export interface CustomFilters {
  [key: string]: unknown;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  role: 'admin' | 'user';
  user_limit: number | null;
  is_active: boolean | null;
  // default_client_id removed - multi-tenant not in PDR
  created_at: string | null;
  updated_at: string | null;
}

export interface Company {
  id: string;
  name: string;
  website: string | null;
  linkedin_url: string | null;
  head_office: string | null;
  industry: string | null;
  company_size: string | null;
  confidence_level: 'low' | 'medium' | 'high' | null;
  lead_score: string | null;
  score_reason: string | null;
  is_favourite: boolean | null;
  priority: string | null;
  logo_url: string | null;
  logo_cached_at: string | null;
  owner_id: string | null;
  // client_id removed - not in PDR
  lead_source: string | null;
  source_details: string | null;
  source_date: string | null;
  pipeline_stage: string | null;
  last_activity: string | null;
  funding_raised: number | null;
  estimated_arr: number | null;
  ai_company_intelligence: Metadata | null;
  ai_marketi_info: Metadata | null;
  ai_funding: Metadata | null;
  ai_new_location: Metadata | null;
  key_info_raw: KeyInfoRaw | null;
  loxo_company_id: string | null;
  created_at: string | null;
  updated_at: string | null;
}

/**
 * Database Types - Generated from Supabase Schema
 * Based on actual database structure from Supabase MCP
 * Updated: February 2025 - LeadFlow Cleanup (Recruitment features removed)
 */

// Lead interface matching PDR Section 7 - leads table structure
export interface Lead {
  id: string;
  user_id: string | null;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  company: string | null; // Company name string
  company_id: string | null; // Foreign key to companies table
  job_title: string | null;
  scan_image_url: string | null;
  quality_rank: 'hot' | 'warm' | 'cold' | null;
  ai_summary: string | null;
  ai_icebreaker: string | null;
  status:
    | 'processing'
    | 'active'
    | 'replied_manual'
    | 'new'
    | 'qualified'
    | 'proceed'
    | 'skip'
    | 'message_sent'
    | 'replied'
    | 'interested'
    | 'meeting_scheduled'
    | 'meeting_completed'
    | 'follow_up'
    | 'not_interested'
    | 'draft'
    | 'completed'
    | 'paused_replied'; // Consolidated statuses
  workflow_id: string | null;
  workflow_status: 'active' | 'paused' | 'completed' | null;
  enrichment_data: Metadata | null;
  enrichment_timestamp: string | null;
  enrichment_status: 'pending' | 'enriching' | 'completed' | 'failed' | null;
  gmail_thread_id: string | null;
  show_name: string | null; // Exhibition/show name where lead was captured
  show_date: string | null; // Exhibition/show date (ISO date string)
  notes: string | null;
  // owner_id and client_id removed - not in PDR (multi-tenant removed)
  employee_location: string | null; // From Contact
  company_role: string | null; // From Contact
  score: number | null; // From Contact
  last_interaction_at: string | null; // From Contact
  last_activity: string | null; // From Contact
  confidence_level: 'low' | 'medium' | 'high' | null; // From Contact (using Lead's enum)
  email_draft: string | null; // From Contact
  is_favourite: boolean | null; // From Contact
  lead_source: string | null; // From Contact
  source_details: string | null; // From Contact
  source_date: string | null; // From Contact
  reply_type: 'interested' | 'not_interested' | 'maybe' | null; // From Contact
  decision_maker_notes: string | null; // From Contact
  ai_user_message: string | null; // From Contact
  email_ai_message: string | null; // From Contact
  linkedin_ai_message: string | null; // From Contact
  email_sent: boolean | null; // From Contact
  last_reply_at: string | null; // From Contact
  last_reply_channel: string | null; // From Contact
  last_reply_message: string | null; // From Contact
  stage_updated: string | null; // From Contact
  linkedin_url: string | null; // From Contact
  lemlist_lead_id: string | null; // From LeadflowLead
  created_at: string | null;
  updated_at: string | null;
  // Computed fields for display
  name?: string; // Computed from first_name + last_name
}

// Analytics Types
export interface ReplyAnalytics {
  people_stage: string;
  total_contacts: number;
  total_replies: number;
  reply_rate_percent: number;
  interested_count: number;
  not_interested_count: number;
  maybe_count: number;
}

export interface ReplyIntentBreakdown {
  reply_type: 'interested' | 'not_interested' | 'maybe' | 'no_reply';
  count: number;
  percentage: number;
}

export interface StageReplyAnalytics {
  stage: string;
  total_contacts: number;
  total_replies: number;
  reply_rate_percent: number;
  intent_breakdown: ReplyIntentBreakdown[];
}

export interface OverallReplyMetrics {
  total_contacts: number;
  total_people?: number; // Legacy alias
  total_replies: number;
  overall_reply_rate: number;
  interested_count: number;
  not_interested_count: number;
  maybe_count: number;
  interested_rate: number;
  not_interested_rate: number;
  maybe_rate: number;
}

export interface ReplyTrendData {
  date: string;
  replies_count: number;
  interested_count: number;
  not_interested_count: number;
  maybe_count: number;
}

export interface ContactReplyAnalytics {
  total_replies: number;
  last_reply_at: string | null;
  last_reply_type: string | null;
  reply_history: Array<{
    reply_type: string;
    reply_date: string;
    reply_message: string;
  }>;
}

// Legacy alias for backward compatibility during migration
export type PersonReplyAnalytics = ContactReplyAnalytics;

export interface ReplyAnalyticsSummary {
  overall: OverallReplyMetrics;
  by_stage: ReplyAnalytics[];
  trends: ReplyTrendData[];
  top_performing: ReplyAnalytics[];
}

export interface EmailReply {
  id: string;
  interaction_id: string | null;
  lead_id: string | null; // Changed from contact_id
  company_id: string | null;
  gmail_message_id: string;
  gmail_thread_id: string;
  from_email: string;
  reply_subject: string | null;
  reply_body_plain: string | null;
  reply_body_html: string | null;
  received_at: string;
  sentiment: string | null;
  sentiment_confidence: number | null;
  sentiment_reasoning: string | null;
  analyzed_at: string | null;
  triggered_stage_change: boolean | null;
  previous_stage: string | null;
  new_stage: string | null;
  detected_at: string;
  processed_at: string | null;
  processing_error: string | null;
  created_at: string;
  updated_at: string;
}

// Activity log for tracking lead activities
export interface ActivityLog {
  id: string;
  lead_id: string | null;
  timestamp: string | null;
  activity_type:
    | 'email_sent'
    | 'email_opened'
    | 'email_clicked'
    | 'email_replied'
    | 'workflow_paused'
    | 'workflow_resumed'
    | 'lead_created'
    | 'lead_updated'
    | 'workflow_assigned'
    | 'manual_note';
  metadata: Metadata | null;
  created_at: string | null;
}

// Multi-tenant client organizations - REMOVED (not in PDR)
// export interface Client { ... }
// export interface ClientDecisionMakerOutreach { ... }
// export interface ClientUser { ... }

// Campaign interfaces - complete definitions are below (line 403+)
// Removed duplicates to avoid type conflicts

export interface Integration {
  id: string;
  platform: string;
  connected: boolean | null;
  config: Config | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface Note {
  id: string;
  entity_id: string;
  entity_type: 'lead' | 'company'; // Removed 'contact'
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
  entity_type: 'company' | 'lead'; // Changed from 'contact'
  tag_id: string;
  created_at: string | null;
}

export interface Campaign {
  id: string;
  name: string;
  description: string | null;
  campaign_type:
    | 'email'
    | 'cold_call'
    | 'social_media'
    | 'referral'
    | 'event'
    | 'other';
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
  target_audience: string | null;
  messaging_template: string | null;
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
  lead_id: string; // Changed from contact_id to match current schema
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
  qualification_criteria: QualificationCriteria | null;
  lead_scoring_rules: LeadScoringRules | null;
  automation_preferences: AutomationPreferences | null;
  created_by: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface AssignmentLog {
  id: string;
  entity_type: string;
  entity_id: string;
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
  metadata: Metadata | null;
  created_at: string | null;
}

export interface Integration {
  id: string;
  platform: string;
  connected: boolean | null;
  config: Config | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface SystemSetting {
  id: string;
  key: string;
  value: unknown;
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
  role: 'admin' | 'user';
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

// Multi-tenant client organizations
export interface Client {
  id: string;
  name: string;
  company_name: string | null;
  industry: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  subscription_tier: 'starter' | 'professional' | 'enterprise' | null;
  subscription_status: 'active' | 'inactive' | 'trial' | 'cancelled' | null;
  monthly_budget: number | null;
  settings: Settings | null;
  is_active: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

// Maps users to their client organizations with roles
export interface ClientUser {
  id: string;
  client_id: string;
  user_id: string;
  role: 'admin' | 'recruiter' | 'viewer';
  is_primary_contact: boolean | null;
  joined_at: string | null;
}

// Tracks which decision makers each client is contacting
export interface ClientDecisionMakerOutreach {
  id: string;
  client_id: string;
  decision_maker_id: string;
  job_id: string | null; // Recruitment field - may be null
  status:
    | 'identified'
    | 'researching'
    | 'preparing'
    | 'outreach_scheduled'
    | 'contacted'
    | 'responded'
    | 'meeting_scheduled'
    | 'meeting_held'
    | 'follow_up'
    | 'qualified'
    | 'not_interested'
    | 'no_response'
    | null;
  outreach_method:
    | 'email'
    | 'linkedin'
    | 'phone'
    | 'referral'
    | 'event'
    | 'other'
    | null;
  first_contact_at: string | null;
  last_contact_at: string | null;
  next_action_at: string | null;
  notes: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface CostEvent {
  id: string;
  client_id: string;
  operation_type:
    | 'company_research'
    | 'company_enrichment'
    | 'decision_maker_search'
    | 'contact_enrichment'
    | 'email_sent'
    | 'ai_analysis'
    | 'web_scraping'
    | 'api_call'
    | 'storage'
    | 'other';
  entity_type:
    | 'company'
    | 'decision_maker'
    | 'email'
    | 'campaign'
    | 'other'
    | null;
  entity_id: string | null;
  cost_usd: number;
  cost_provider: string | null;
  credits_consumed: number | null;
  was_cached: boolean | null;
  cache_source: string | null;
  operation_details: OperationDetails | null;
  created_at: string | null;
}

export interface SharedIntelligenceSavings {
  id: string;
  beneficiary_client_id: string;
  original_client_id: string | null;
  data_type:
    | 'company_research'
    | 'decision_maker_contact'
    | 'email_enrichment'
    | 'company_enrichment'
    | 'industry_analysis'
    | 'other';
  entity_type: 'company' | 'decision_maker' | 'other' | null;
  entity_id: string | null;
  estimated_savings_usd: number;
  actual_cost_usd: number | null;
  reuse_count: number | null;
  operation_details: OperationDetails | null;
  created_at: string | null;
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

// User settings table
export interface UserSettings {
  id: string;
  user_id: string | null;
  notifications: Metadata | null;
  preferences: Metadata | null;
  security: Metadata | null;
  created_at: string | null;
  updated_at: string | null;
}

// Workflow table
export interface Workflow {
  id: string;
  name: string;
  description: string | null;
  email_provider: 'lemlist' | 'gmail' | null;
  lemlist_campaign_id: string | null;
  gmail_sequence: Metadata | null;
  pause_rules: Metadata | null;
  created_by: string | null;
  created_at: string | null;
  updated_at: string | null;
}

// Campaign sequence tables - REMOVED (not in PDR. Use workflows table instead)
// All CampaignSequence interfaces removed

// LeadFlow leads table - REMOVED (not in PDR, use leads table)
// LeadflowLead interface removed
