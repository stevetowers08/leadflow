/**
 * Type Definitions for Missing Database Tables/Views
 *
 * These tables/views exist in the database but are not in the generated Supabase types.
 * This file provides proper type definitions to replace `as never` assertions.
 *
 * TODO: Add these to Supabase schema and regenerate types
 */

import type { Json } from '@/integrations/supabase/types';

// ============================================================================
// EMAIL TABLES
// ============================================================================

export interface EmailThread {
  id: string;
  gmail_thread_id: string;
  person_id: string | null;
  lead_id: string | null;
  subject: string | null;
  last_message_at: string;
  is_read: boolean;
  created_at: string | null;
  updated_at: string | null;
}

export interface EmailMessage {
  id: string;
  thread_id: string;
  gmail_message_id: string;
  person_id: string | null;
  lead_id: string | null;
  from_email: string;
  to_emails: string[] | null;
  cc_emails: string[] | null;
  bcc_emails: string[] | null;
  subject: string | null;
  body_text: string | null;
  body_html: string | null;
  is_sent: boolean;
  is_read: boolean;
  sent_at: string | null;
  received_at: string;
  attachments: Json | null;
  sync_status: 'synced' | 'pending' | 'error';
  created_at: string | null;
  updated_at: string | null;
}

// ============================================================================
// SHOW TABLES
// ============================================================================

export interface Show {
  id: string;
  owner_id: string | null;
  name: string;
  start_date: string | null;
  end_date: string | null;
  city: string | null;
  venue: string | null;
  timezone: string | null;
  status: 'upcoming' | 'live' | 'ended';
  created_at: string | null;
  updated_at: string | null;
}

export interface ShowCompany {
  id: string;
  show_id: string;
  company_id: string;
  created_at: string | null;
}

// ============================================================================
// ERROR LOGGING TABLES
// ============================================================================

export interface ErrorSettings {
  id: string;
  user_id: string;
  email_notifications: boolean;
  notification_severity: 'low' | 'medium' | 'high' | 'critical';
  notification_email: string | null;
  slack_webhook_url: string | null;
  webhook_url: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface ErrorNotification {
  id: string;
  error_log_id: string;
  notification_type: 'email' | 'slack' | 'webhook';
  recipient: string | null;
  status: 'pending' | 'sent' | 'failed';
  error_message: string | null;
  sent_at: string | null;
  created_at: string | null;
}

// ============================================================================
// VIEWS
// ============================================================================

export interface UserAssignmentStats {
  user_id: string;
  total_leads: number;
  total_companies: number;
  unassigned_leads: number;
  unassigned_companies: number;
}

export interface LeadAssignmentWithUser {
  id: string;
  lead_id: string;
  owner_id: string | null;
  owner_email: string | null;
  owner_name: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface CompanyAssignmentWithUser {
  id: string;
  company_id: string;
  owner_id: string | null;
  owner_email: string | null;
  owner_name: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface DashboardMetrics {
  total_leads: number;
  active_leads: number;
  total_companies: number;
  active_companies: number;
  recent_activity_count: number;
  updated_at: string;
}

// ============================================================================
// ENTITY TAGS
// ============================================================================

export interface EntityTag {
  id: string;
  entity_id: string;
  entity_type: 'lead' | 'company';
  tag_id: string;
  created_at: string | null;
}

// ============================================================================
// CONVERSATIONS (Legacy - may be removed)
// ============================================================================

export interface Conversation {
  id: string;
  person_id: string | null;
  lead_id: string | null;
  platform: 'linkedin' | 'email' | 'sms';
  status: 'active' | 'archived' | 'closed';
  last_message_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface ConversationMessage {
  id: string;
  conversation_id: string;
  message_text: string;
  sender_id: string | null;
  is_from_user: boolean;
  sent_at: string;
  created_at: string | null;
}

// ============================================================================
// CLIENT USERS
// ============================================================================

export interface ClientUser {
  id: string;
  user_id: string;
  client_id: string;
  role: string | null;
  created_at: string | null;
  updated_at: string | null;
}

// ============================================================================
// CAMPAIGN SEQUENCES (Legacy - may be removed)
// ============================================================================

export interface CampaignSequence {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'completed';
  created_at: string | null;
  updated_at: string | null;
}

export interface CampaignSequenceLead {
  id: string;
  sequence_id: string;
  lead_id: string;
  person_id: string | null;
  status: 'active' | 'completed' | 'paused';
  created_at: string | null;
  updated_at: string | null;
}

// ============================================================================
// INTEGRATIONS TABLE (exists but needs proper typing)
// ============================================================================

export interface Integration {
  id: string;
  user_id: string;
  platform: 'gmail' | 'linkedin' | 'salesforce' | 'hubspot' | string;
  connected: boolean;
  config: Json | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface GmailIntegrationConfig {
  access_token: string;
  refresh_token: string;
  token_expires_at: string;
  scope?: string;
  email: string;
}
