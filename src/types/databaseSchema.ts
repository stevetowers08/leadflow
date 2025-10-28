/**
 * Database Schema Reference
 *
 * This file serves as the central source of truth for all database operations.
 * Always reference this file when writing database queries to ensure field names
 * and types are correct.
 *
 * 📚 Full documentation: docs/DATABASE_BEST_PRACTICES.md
 * 🔧 Query utilities: src/utils/databaseQueries.ts
 */

export const DATABASE_SCHEMA = {
  // Table names
  TABLES: {
    PEOPLE: 'people',
    COMPANIES: 'companies',
    JOBS: 'jobs',
    USER_PROFILES: 'user_profiles',
    INTERACTIONS: 'interactions',
    NOTES: 'notes',
    TAGS: 'tags',
    ENTITY_TAGS: 'entity_tags',
    CAMPAIGNS: 'campaigns',
    CAMPAIGN_PARTICIPANTS: 'campaign_participants',
    CAMPAIGN_MESSAGES: 'campaign_messages',
    BUSINESS_PROFILES: 'business_profiles',
    ASSIGNMENT_LOGS: 'assignment_logs',
    INVITATIONS: 'invitations',
    SYSTEM_SETTINGS: 'system_settings',
    LEAD_SOURCES: 'lead_sources',
  },

  // Field definitions for each table
  FIELDS: {
    people: {
      id: 'uuid',
      name: 'text',
      company_id: 'uuid',
      email_address: 'text',
      linkedin_url: 'text',
      employee_location: 'text',
      company_role: 'text',
      lead_score: 'text',
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
      ai_info: 'jsonb',
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

  // Foreign key relationships
  FOREIGN_KEYS: {
    'people.company_id': 'companies.id',
    'people.owner_id': 'user_profiles.id',
    'companies.owner_id': 'user_profiles.id',
    'jobs.company_id': 'companies.id',
    'jobs.owner_id': 'user_profiles.id',
    'interactions.person_id': 'people.id',
    'interactions.owner_id': 'user_profiles.id',
    'notes.author_id': 'user_profiles.id',
    'entity_tags.tag_id': 'tags.id',
    'campaigns.created_by': 'auth.users.id',
    'campaign_participants.campaign_id': 'campaigns.id',
    'campaign_participants.person_id': 'people.id',
    'campaign_messages.campaign_id': 'campaigns.id',
    'business_profiles.created_by': 'auth.users.id',
    'invitations.accepted_by': 'user_profiles.id',
    'invitations.invited_by': 'user_profiles.id',
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
    'id, name, company_id, email_address, linkedin_url, employee_location, company_role, lead_score, people_stage, last_interaction_at, last_activity, owner_id, created_at, updated_at, confidence_level, email_draft, is_favourite, lead_source, source_details, source_date',

  companies:
    'id, name, website, linkedin_url, head_office, industry_id, industry, company_size, confidence_level, lead_score, score_reason, is_favourite, ai_info, key_info_raw, loxo_company_id, created_at, updated_at, priority, logo_url, logo_cached_at, owner_id, lead_source, source_details, source_date, pipeline_stage, last_activity, funding_raised, estimated_arr',

  jobs: 'id, title, company_id, job_url, posted_date, valid_through, location, description, summary, employment_type, seniority_level, linkedin_job_id, created_at, updated_at, priority, lead_score_job, salary, function, logo_url, owner_id',

  user_profiles:
    'id, email, full_name, role, user_limit, is_active, created_at, updated_at',
} as const;
