/**
 * Database Schema Reference
 *
 * This file serves as the central source of truth for all database operations.
 * Always reference this file when writing database queries to ensure field names
 * and types are correct.
 *
 * 🔧 Query utilities: src/utils/databaseQueries.ts
 */

export const DATABASE_SCHEMA = {
  // Table names - Only existing tables (verified via Supabase MCP)
  TABLES: {
    COMPANIES: 'companies',
    SHOWS: 'shows',
    SHOW_COMPANIES: 'show_companies',
    LEADS: 'leads',
    USER_PROFILES: 'user_profiles',
    USER_SETTINGS: 'user_settings',
    WORKFLOWS: 'workflows',
    ACTIVITY_LOG: 'activity_log',
    // Campaign sequences, clients, jobs removed - not in PDR
    // Use workflows table instead of campaign_sequences
  },

  // Field definitions for each table - Only existing tables
  FIELDS: {
    companies: {
      id: 'uuid',
      name: 'text',
      website: 'text',
      domain: 'text',
      linkedin_url: 'text',
      head_office: 'text',
      industry: 'text',
      company_size: 'text',
      confidence_level: 'confidence_level_enum',
      lead_score: 'text',
      score_reason: 'text',
      is_favourite: 'boolean',
      priority: 'text',
      logo_url: 'text',
      logo_cached_at: 'timestamp',
      pipeline_stage: 'text',
      last_activity: 'timestamptz',
      estimated_arr: 'numeric',
      description: 'text',
      enrichment_status: 'enrichment_status_enum',
      created_at: 'timestamptz',
      updated_at: 'timestamptz',
    },
    clients: {
      id: 'uuid',
      name: 'text',
      company_name: 'text',
      industry: 'text',
      contact_email: 'text',
      contact_phone: 'text',
      subscription_tier: 'text',
      subscription_status: 'text',
      monthly_budget: 'numeric',
      settings: 'jsonb',
      is_active: 'boolean',
      created_at: 'timestamptz',
      updated_at: 'timestamptz',
    },
    client_users: {
      id: 'uuid',
      client_id: 'uuid',
      user_id: 'uuid',
      role: 'text',
      is_primary_contact: 'boolean',
      joined_at: 'timestamptz',
    },
    client_decision_maker_outreach: {
      id: 'uuid',
      client_id: 'uuid',
      decision_maker_id: 'uuid',
      job_id: 'uuid',
      status: 'text',
      outreach_method: 'text',
      first_contact_at: 'timestamptz',
      last_contact_at: 'timestamptz',
      next_action_at: 'timestamptz',
      notes: 'text',
      created_at: 'timestamptz',
      updated_at: 'timestamptz',
    },
    campaign_sequences: {
      id: 'uuid',
      name: 'text',
      description: 'text',
      status: 'text',
      created_by: 'uuid',
      total_leads: 'integer',
      active_leads: 'integer',
      created_at: 'timestamptz',
      updated_at: 'timestamptz',
    },
    campaign_sequence_steps: {
      id: 'uuid',
      sequence_id: 'uuid',
      order_position: 'integer',
      step_type: 'text',
      name: 'text',
      email_subject: 'text',
      email_body: 'text',
      email_template_id: 'uuid',
      send_immediately: 'text',
      send_time: 'time',
      wait_duration: 'integer',
      wait_unit: 'text',
      business_hours_only: 'boolean',
      timezone: 'text',
      condition_type: 'text',
      condition_wait_duration: 'integer',
      true_next_step_id: 'uuid',
      false_next_step_id: 'uuid',
      created_at: 'timestamptz',
      updated_at: 'timestamptz',
    },
    campaign_sequence_leads: {
      id: 'uuid',
      sequence_id: 'uuid',
      lead_id: 'uuid',
      status: 'text',
      current_step_id: 'uuid',
      started_at: 'timestamptz',
      completed_at: 'timestamptz',
      exited_at: 'timestamptz',
      last_activity_at: 'timestamptz',
      created_at: 'timestamptz',
      updated_at: 'timestamptz',
    },
    campaign_sequence_executions: {
      id: 'uuid',
      sequence_lead_id: 'uuid',
      step_id: 'uuid',
      lead_id: 'uuid',
      sequence_id: 'uuid',
      status: 'text',
      scheduled_at: 'timestamptz',
      executed_at: 'timestamptz',
      email_send_id: 'uuid',
      email_subject: 'text',
      email_body: 'text',
      opened_at: 'timestamptz',
      clicked_at: 'timestamptz',
      replied_at: 'timestamptz',
      bounced_at: 'timestamptz',
      error_message: 'text',
      retry_count: 'integer',
      created_at: 'timestamptz',
      updated_at: 'timestamptz',
    },
    user_profiles: {
      id: 'uuid',
      email: 'text',
      full_name: 'text',
      role: 'text',
      user_limit: 'integer',
      is_active: 'boolean',
      default_client_id: 'uuid',
      metadata: 'jsonb',
      created_at: 'timestamptz',
      updated_at: 'timestamptz',
    },
    user_settings: {
      id: 'uuid',
      user_id: 'uuid',
      preferences: 'jsonb',
      notifications: 'jsonb',
      security: 'jsonb',
      created_at: 'timestamptz',
      updated_at: 'timestamptz',
    },
    shows: {
      id: 'uuid',
      owner_id: 'uuid',
      name: 'text',
      start_date: 'date',
      end_date: 'date',
      city: 'text',
      venue: 'text',
      timezone: 'text',
      status: 'text',
      created_at: 'timestamptz',
      updated_at: 'timestamptz',
    },
    show_companies: {
      id: 'uuid',
      show_id: 'uuid',
      company_id: 'uuid',
      created_at: 'timestamptz',
    },
    leads: {
      id: 'uuid',
      first_name: 'text',
      last_name: 'text',
      email: 'text',
      phone: 'text',
      company: 'text',
      company_id: 'uuid',
      show_id: 'uuid',
      job_title: 'text',
      quality_rank: 'text',
      scan_image_url: 'text',
      notes: 'text',
      ai_summary: 'text',
      ai_icebreaker: 'text',
      status: 'text',
      workflow_id: 'uuid',
      workflow_status: 'text',
      enrichment_data: 'jsonb',
      enrichment_timestamp: 'timestamptz',
      gmail_thread_id: 'text',
      show_name: 'text',
      show_date: 'date',
      user_id: 'uuid',
      owner_id: 'uuid',
      created_at: 'timestamptz',
      updated_at: 'timestamptz',
    },
    workflows: {
      id: 'uuid',
      name: 'text',
      description: 'text',
      created_by: 'uuid',
      email_provider: 'text',
      gmail_sequence: 'jsonb',
      lemlist_campaign_id: 'text',
      pause_rules: 'jsonb',
      created_at: 'timestamptz',
      updated_at: 'timestamptz',
    },
    activity_log: {
      id: 'uuid',
      lead_id: 'uuid',
      activity_type: 'text',
      timestamp: 'timestamptz',
      metadata: 'jsonb',
      created_at: 'timestamptz',
    },
  },

  // Enum values
  ENUMS: {
    confidence_level_enum: ['low', 'medium', 'high'],
    company_pipeline_stage_enum: [
      'new_lead',
      'qualified',
      'message_sent',
      'replied',
      'meeting_scheduled',
      'proposal_sent',
      'negotiation',
      'closed_won',
      'closed_lost',
      'on_hold',
    ],
    reply_type: ['interested', 'not_interested', 'maybe'],
  },

  // Foreign key relationships - Only existing tables
  FOREIGN_KEYS: {
    'companies.client_id': 'clients.id',
    'leads.company_id': 'companies.id', // Leads can be linked to companies
    'leads.show_id': 'shows.id', // Leads can be linked to shows
    'show_companies.show_id': 'shows.id', // Show companies junction table
    'show_companies.company_id': 'companies.id', // Show companies junction table
    'leads.workflow_id': 'workflows.id',
    'leads.user_id': 'auth.users.id',
    'shows.owner_id': 'auth.users.id',
    'activity_log.lead_id': 'leads.id',
    'campaign_sequence_leads.lead_id': 'leads.id',
    'campaign_sequence_leads.sequence_id': 'campaign_sequences.id',
    'campaign_sequence_leads.current_step_id': 'campaign_sequence_steps.id',
    'campaign_sequence_steps.sequence_id': 'campaign_sequences.id',
    'campaign_sequence_steps.true_next_step_id': 'campaign_sequence_steps.id',
    'campaign_sequence_steps.false_next_step_id': 'campaign_sequence_steps.id',
    'campaign_sequence_executions.sequence_lead_id':
      'campaign_sequence_leads.id',
    'campaign_sequence_executions.step_id': 'campaign_sequence_steps.id',
    'campaign_sequence_executions.lead_id': 'leads.id',
    'campaign_sequence_executions.sequence_id': 'campaign_sequences.id',
    'workflows.created_by': 'auth.users.id',
    'user_profiles.id': 'auth.users.id',
    'user_settings.user_id': 'auth.users.id',
    'client_users.client_id': 'clients.id',
    'client_users.user_id': 'auth.users.id',
    'client_decision_maker_outreach.client_id': 'clients.id',
    'client_decision_maker_outreach.decision_maker_id': 'leads.id',
    'campaign_sequences.created_by': 'auth.users.id',
  },
} as const;

// Type definitions for TypeScript
export type TableName = keyof typeof DATABASE_SCHEMA.FIELDS;
export type FieldName<T extends TableName> =
  keyof (typeof DATABASE_SCHEMA.FIELDS)[T];

// Utility functions
export const getTableFields = (table: TableName): string[] => {
  return Object.keys(DATABASE_SCHEMA.FIELDS[table]);
};

export const getFieldType = <T extends TableName>(
  table: T,
  field: FieldName<T>
): string => {
  return DATABASE_SCHEMA.FIELDS[table][field];
};

export const isValidField = <T extends TableName>(
  table: T,
  field: string
): field is FieldName<T> => {
  return field in DATABASE_SCHEMA.FIELDS[table];
};

// Common field selections for queries
export const COMMON_SELECTIONS = {
  companies:
    'id, name, website, linkedin_url, head_office, industry_id, industry, company_size, confidence_level, lead_score, score_reason, is_favourite, ai_company_intelligence, ai_marketi_info, ai_funding, ai_new_location, key_info_raw, loxo_company_id, created_at, updated_at, priority, logo_url, logo_cached_at, lead_source, source_details, source_date, pipeline_stage, last_activity, funding_raised, estimated_arr',

  clients:
    'id, name, company_name, industry, contact_email, contact_phone, subscription_tier, subscription_status, monthly_budget, settings, is_active, created_at, updated_at',
  client_users: 'id, client_id, user_id, role, is_primary_contact, joined_at',
  client_decision_maker_outreach:
    'id, client_id, decision_maker_id, job_id, status, outreach_method, first_contact_at, last_contact_at, next_action_at, notes, created_at, updated_at',
  campaign_sequences:
    'id, name, description, status, created_by, total_leads, active_leads, created_at, updated_at',
  campaign_sequence_steps:
    'id, sequence_id, order_position, step_type, name, email_subject, email_body, email_template_id, send_immediately, send_time, wait_duration, wait_unit, business_hours_only, timezone, condition_type, condition_wait_duration, true_next_step_id, false_next_step_id, created_at, updated_at',
  campaign_sequence_leads:
    'id, sequence_id, lead_id, status, current_step_id, started_at, completed_at, exited_at, last_activity_at, created_at, updated_at',
  campaign_sequence_executions:
    'id, sequence_lead_id, step_id, lead_id, sequence_id, status, scheduled_at, executed_at, email_send_id, email_subject, email_body, opened_at, clicked_at, replied_at, bounced_at, error_message, retry_count, created_at, updated_at',

  user_profiles:
    'id, email, full_name, role, user_limit, is_active, created_at, updated_at, default_client_id',
  shows:
    'id, owner_id, name, start_date, end_date, city, venue, timezone, status, created_at, updated_at',
  show_companies: 'id, show_id, company_id, created_at',
  leads:
    'id, first_name, last_name, email, phone, company, company_id, show_id, job_title, quality_rank, scan_image_url, notes, ai_summary, ai_icebreaker, status, workflow_id, workflow_status, enrichment_data, enrichment_timestamp, gmail_thread_id, user_id, owner_id, created_at, updated_at',
  workflows:
    'id, name, description, created_by, email_provider, gmail_sequence, lemlist_campaign_id, pause_rules, created_at, updated_at',
  activity_log: 'id, lead_id, activity_type, timestamp, metadata, created_at',
} as const;
