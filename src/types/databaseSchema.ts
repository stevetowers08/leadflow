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
  // Table names - Only existing tables
  TABLES: {
    PEOPLE: 'people',
    COMPANIES: 'companies',
    JOBS: 'jobs',
    LEADS: 'leads',
    LEADFLOW_LEADS: 'leadflow_leads',
    USER_PROFILES: 'user_profiles',
    USER_SETTINGS: 'user_settings',
    WORKFLOWS: 'workflows',
    ACTIVITY_LOG: 'activity_log',
    CAMPAIGN_SEQUENCES: 'campaign_sequences',
    CAMPAIGN_SEQUENCE_STEPS: 'campaign_sequence_steps',
    CAMPAIGN_SEQUENCE_LEADS: 'campaign_sequence_leads',
    CAMPAIGN_SEQUENCE_EXECUTIONS: 'campaign_sequence_executions',
  },

  // Field definitions for each table - Only existing tables
  FIELDS: {
    people: {
      id: 'uuid',
      name: 'text',
      company_id: 'uuid',
      email_address: 'text',
      linkedin_url: 'text',
      employee_location: 'text',
      company_role: 'text',
      score: 'smallint', // 1-10 numeric score
      stage: 'people_stage_enum',
      last_interaction_at: 'timestamptz',
      last_activity: 'timestamptz',
      owner_id: 'uuid',
      created_at: 'timestamptz',
      updated_at: 'timestamptz',
      confidence_level: 'text',
      email_draft: 'text',
      is_favourite: 'boolean',
      lead_source: 'text',
      source_details: 'text',
      source_date: 'timestamptz',
      reply_type: 'reply_type_enum',
      decision_maker_notes: 'text',
    },
    companies: {
      id: 'uuid',
      name: 'text',
      website: 'text',
      linkedin_url: 'text',
      head_office: 'text',
      industry_id: 'uuid',
      industry: 'text',
      company_size: 'text',
      confidence_level: 'confidence_level_enum',
      lead_score: 'text',
      score_reason: 'text',
      is_favourite: 'boolean',
      ai_company_intelligence: 'jsonb',
      ai_marketi_info: 'jsonb',
      ai_funding: 'jsonb',
      ai_new_location: 'jsonb',
      key_info_raw: 'jsonb',
      loxo_company_id: 'text',
      created_at: 'timestamptz',
      updated_at: 'timestamptz',
      priority: 'text',
      logo_url: 'text',
      logo_cached_at: 'timestamp',
      owner_id: 'uuid',
      lead_source: 'text',
      source_details: 'text',
      source_date: 'timestamptz',
      pipeline_stage: 'company_pipeline_stage_enum',
      last_activity: 'timestamptz',
      funding_raised: 'numeric',
      estimated_arr: 'numeric',
    },
    jobs: {
      id: 'uuid',
      title: 'text',
      company_id: 'uuid',
      job_url: 'text',
      posted_date: 'date',
      valid_through: 'date',
      location: 'text',
      description: 'text',
      summary: 'text',
      employment_type: 'text',
      seniority_level: 'text',
      linkedin_job_id: 'text',
      created_at: 'timestamptz',
      updated_at: 'timestamptz',
      priority: 'text',
      lead_score_job: 'integer',
      salary: 'text',
      function: 'text',
      logo_url: 'text',
      owner_id: 'uuid',
      source: 'text',
    },
    user_profiles: {
      id: 'uuid',
      email: 'text',
      full_name: 'text',
      role: 'text',
      user_limit: 'integer',
      is_active: 'boolean',
      created_at: 'timestamptz',
      updated_at: 'timestamptz',
      default_client_id: 'uuid',
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
    leads: {
      id: 'uuid',
      first_name: 'text',
      last_name: 'text',
      email: 'text',
      phone: 'text',
      company: 'text',
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
      owner_id: 'uuid',
      user_id: 'uuid',
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
    people_stage_enum: [
      'new_lead',
      'message_sent',
      'replied',
      'interested',
      'meeting_scheduled',
      'meeting_completed',
      'follow_up',
      'not_interested',
    ],
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
    'people.company_id': 'companies.id',
    'people.owner_id': 'user_profiles.id',
    'companies.owner_id': 'auth.users.id',
    'jobs.company_id': 'companies.id',
    'jobs.owner_id': 'auth.users.id',
    'leads.workflow_id': 'workflows.id',
    'leads.owner_id': 'auth.users.id',
    'activity_log.lead_id': 'leads.id',
    'campaign_sequence_leads.lead_id': 'leads.id',
    'campaign_sequence_leads.sequence_id': 'campaign_sequences.id',
    'campaign_sequence_steps.sequence_id': 'campaign_sequences.id',
    'campaign_sequence_executions.lead_id': 'leads.id',
    'workflows.created_by': 'auth.users.id',
    'user_profiles.id': 'auth.users.id',
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
  people:
    'id, name, company_id, email_address, linkedin_url, employee_location, company_role, score, people_stage, last_interaction_at, last_activity, owner_id, created_at, updated_at, confidence_level, email_draft, is_favourite, lead_source, source_details, source_date',

  companies:
    'id, name, website, linkedin_url, head_office, industry_id, industry, company_size, confidence_level, lead_score, score_reason, is_favourite, ai_company_intelligence, ai_marketi_info, ai_funding, ai_new_location, key_info_raw, loxo_company_id, created_at, updated_at, priority, logo_url, logo_cached_at, owner_id, lead_source, source_details, source_date, pipeline_stage, last_activity, funding_raised, estimated_arr',

  jobs: 'id, title, company_id, job_url, posted_date, valid_through, location, description, summary, employment_type, seniority_level, linkedin_job_id, created_at, updated_at, priority, lead_score_job, salary, function, logo_url, owner_id',

  user_profiles:
    'id, email, full_name, role, user_limit, is_active, created_at, updated_at, default_client_id',
  leads:
    'id, first_name, last_name, email, phone, company, job_title, quality_rank, scan_image_url, notes, ai_summary, ai_icebreaker, status, workflow_id, workflow_status, enrichment_data, enrichment_timestamp, gmail_thread_id, owner_id, user_id, created_at, updated_at',
  workflows:
    'id, name, description, created_by, email_provider, gmail_sequence, lemlist_campaign_id, pause_rules, created_at, updated_at',
  activity_log:
    'id, lead_id, activity_type, timestamp, metadata, created_at',
} as const;
