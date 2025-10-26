# Database Schema Documentation

## Overview

The Empowr CRM uses Supabase (PostgreSQL) as its backend database. This document provides comprehensive information about the database structure, relationships, and how to properly query data.

**Last Updated:** January 27, 2025  
**Database Version:** Simplified Job & Company Architecture (Industry Standard)

## Database Connection

### Environment Variables

```bash
VITE_SUPABASE_URL=https://jedfundfhzytpnbjkspn.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_ACCESS_TOKEN=your_service_role_key_here
```

### Connection Setup

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);
```

## Database Management Tools

The application includes built-in database management components for monitoring and exploration:

### DatabaseInfoCard Component

**Location:** `src/components/DatabaseInfoCard.tsx`

**Purpose:** Provides a dashboard overview of database health and data volume.

**Features:**

- Real-time table statistics (row counts, column counts)
- Covers core tables: people, companies, jobs, conversations
- Refresh functionality for live updates
- Visual indicators for data volume

**Usage:**

```typescript
import { DatabaseInfoCard } from '@/components/DatabaseInfoCard';

// Use in admin dashboard or monitoring pages
<DatabaseInfoCard />
```

### DatabaseExplorer Component

**Location:** `src/components/DatabaseExplorer.tsx`

**Purpose:** Comprehensive database exploration and schema management tool.

**Features:**

- Browse all database tables with search/filter
- View detailed table schemas (columns, types, constraints)
- Export database schema to markdown format
- Sample data viewing capabilities
- Real-time table information updates

**Usage:**

```typescript
import { DatabaseExplorer } from '@/components/DatabaseExplorer';

// Use in admin panel for database management
<DatabaseExplorer />
```

**Key Functions:**

- `loadTables()` - Loads all available tables
- `loadTableInfo(tableName)` - Gets detailed schema for specific table
- `handleExportSchema()` - Exports complete schema to markdown file
- `handleTableSelect(tableName)` - Switches between table views

**Dependencies:**

- `@/utils/databaseSchema` - Schema utilities
- `@/utils/databaseQuery` - Query utilities
- `@/hooks/use-toast` - Toast notifications

## Core Tables

### 1. **Companies** (`companies`)

Primary entity for company information.

```sql
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  website TEXT,
  industry TEXT,
  industry_id TEXT,
  company_size TEXT,
  head_office TEXT,
  linkedin_url TEXT,
  ai_info JSONB,
  key_info_raw JSONB,
  lead_score TEXT,
  score_reason TEXT,
  confidence_level confidence_level_enum,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  is_favourite BOOLEAN DEFAULT FALSE,
  automation_active BOOLEAN,
  automation_started_at TIMESTAMP WITH TIME ZONE,
  loxo_company_id TEXT,
  airtable_id TEXT,
  added_by_client_id UUID REFERENCES clients(id),
  added_manually BOOLEAN DEFAULT false,
  source_job_id UUID REFERENCES jobs(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

**Key Fields:**

- `id`: Unique identifier
- `name`: Company name (required)
- `website`: Company website URL
- `industry`: Company industry classification
- `company_size`: Company size (e.g., "1-10", "11-50", "51-200")
- `head_office`: Primary office location
- `linkedin_url`: LinkedIn company page
- `ai_info`: AI-generated insights (JSONB)
- `lead_score`: Calculated lead score
- `priority`: Priority level for outreach
- `is_favourite`: User-favorited companies
- `automation_active`: Whether automation is running
- `airtable_id`: Airtable integration ID
- `added_by_client_id`: Which client added this company
- `added_manually`: Whether company was added manually vs from job qualification
- `source_job_id`: Job that led to this company being added

### 2. **People** (`people`)

Individual contacts and leads with simplified status workflow.

```sql
CREATE TABLE people (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email_address TEXT,
  company_id UUID REFERENCES companies(id),
  company_role TEXT,
  employee_location TEXT,
  linkedin_url TEXT,
  lead_score TEXT,
  confidence_level TEXT CHECK (confidence_level IN ('low', 'medium', 'high')),
  stage stage_enum DEFAULT 'new',
  stage_updated TIMESTAMP WITH TIME ZONE,
  email_draft TEXT,
  last_reply_at TIMESTAMP WITH TIME ZONE,
  last_reply_channel TEXT,
  last_reply_message TEXT,
  last_interaction_at TIMESTAMP WITH TIME ZONE,
  reply_type reply_type_enum,
  is_favourite BOOLEAN DEFAULT FALSE,
  favourite BOOLEAN DEFAULT FALSE,
  jobs TEXT,
  lead_source TEXT,
  owner_id UUID REFERENCES user_profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

**Key Fields:**

- `id`: Unique identifier
- `name`: Contact full name (required)
- `email_address`: Primary email address
- `company_id`: Foreign key to companies table
- `company_role`: Job title/role at company
- `linkedin_url`: LinkedIn profile URL (restored after cleanup)
- `stage`: Current lead stage (simplified enum: new, qualified, proceed, skip)
- `lead_score`: Calculated lead score
- `confidence_level`: Confidence in lead quality
- `email_draft`: Draft email content for outreach
- `last_reply_at`: Timestamp of most recent reply
- `last_reply_channel`: Channel of last reply (email, linkedin, etc.)
- `last_reply_message`: Content of last reply
- `reply_type`: Type of reply (interested, not_interested, maybe)
- `owner_id`: Assigned user/owner

### 3. **Jobs** (`jobs`)

Job postings and opportunities with qualification workflow.

```sql
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  company_id UUID REFERENCES companies(id),
  job_url TEXT,
  posted_date DATE,
  valid_through DATE,
  location TEXT,
  description TEXT,
  summary TEXT,
  employment_type TEXT,
  seniority_level TEXT,
  linkedin_job_id TEXT,
  automation_active BOOLEAN DEFAULT FALSE,
  automation_started_at TIMESTAMP WITH TIME ZONE,
  priority TEXT,
  lead_score_job INTEGER,
  salary TEXT,
  function TEXT,
  logo_url TEXT,
  owner_id UUID REFERENCES user_profiles(id),
  airtable_id TEXT,
  qualification_status TEXT DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

**Key Fields:**

- `id`: Unique identifier
- `title`: Job title (required)
- `company_id`: Foreign key to companies table
- `description`: Full job description
- `summary`: Job summary
- `location`: Job location
- `salary`: Salary information
- `employment_type`: Full-time, part-time, contract, etc.
- `function`: Job function/department
- `seniority_level`: Entry, mid, senior, executive
- `job_url`: Original job posting URL
- `linkedin_job_id`: LinkedIn job ID
- `qualification_status`: Job qualification status (new, qualify, skip)
- `lead_score_job`: Calculated job lead score
- `priority`: Priority level for outreach
- `automation_active`: Whether automation is running
- `owner_id`: Assigned user/owner

### 4. **Client Jobs** (`client_jobs`)

Industry-standard client-specific job management table for multi-tenant architecture.

```sql
CREATE TABLE client_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'qualify', 'skip')),
  priority_level TEXT DEFAULT 'medium' CHECK (priority_level IN ('low', 'medium', 'high', 'urgent')),
  notes TEXT,
  qualified_at TIMESTAMPTZ,
  qualified_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(client_id, job_id)
);
```

**Key Fields:**

- `id`: Unique identifier
- `client_id`: Foreign key to clients table (multi-tenant)
- `job_id`: Foreign key to jobs table (shared canonical data)
- `status`: Job qualification status (new, qualify, skip)
- `priority_level`: Client-specific priority (low, medium, high, urgent)
- `notes`: Optional qualification notes
- `qualified_at`: When job was qualified (timestamp)
- `qualified_by`: User who qualified the job
- `created_at`: When qualification was created
- `updated_at`: When qualification was last updated

**Industry Standard Architecture:**

- **Global Jobs**: All jobs stored in `jobs` table (shared across clients)
- **Client Filtering**: Jobs filtered into `client_jobs` based on client criteria
- **Qualified Companies**: When jobs are qualified, companies added to `companies` table
- **RLS Policies**: Row-level security ensures client data isolation
- **Unique Constraint**: Prevents duplicate qualifications per client-job pair

### 5. **Clients** (`clients`)

Multi-tenant client organizations using the platform.

```sql
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  email VARCHAR,
  company VARCHAR,
  accounts JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

**Key Fields:**

- `id`: Unique identifier
- `name`: Client organization name
- `email`: Primary contact email
- `company`: Company name
- `accounts`: JSON configuration for integrations
- `created_at`: When client was created
- `updated_at`: When client was last updated

### 6. **Client Users** (`client_users`)

User-client mapping with roles for multi-tenant access control.

```sql
CREATE TABLE client_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('owner', 'admin', 'recruiter', 'viewer')) DEFAULT 'recruiter',
  is_primary_contact BOOLEAN DEFAULT false,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(client_id, user_id)
);
```

**Key Fields:**

- `id`: Unique identifier
- `client_id`: Foreign key to clients table
- `user_id`: Foreign key to auth.users table
- `role`: User role within client (owner, admin, recruiter, viewer)
- `is_primary_contact`: Whether user is primary contact for client
- `joined_at`: When user joined the client

### 7. **Email Replies** (`email_replies`)

Gmail reply detection and AI sentiment analysis.

```sql
CREATE TABLE email_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  interaction_id UUID REFERENCES interactions(id),
  person_id UUID REFERENCES people(id),
  company_id UUID REFERENCES companies(id),
  gmail_message_id TEXT NOT NULL,
  gmail_thread_id TEXT NOT NULL,
  from_email TEXT NOT NULL,
  reply_subject TEXT,
  reply_body_plain TEXT,
  reply_body_html TEXT,
  received_at TIMESTAMP WITH TIME ZONE NOT NULL,
  sentiment TEXT,
  sentiment_confidence NUMERIC,
  sentiment_reasoning TEXT,
  analyzed_at TIMESTAMP WITH TIME ZONE,
  triggered_stage_change BOOLEAN DEFAULT FALSE,
  previous_stage TEXT,
  new_stage TEXT,
  detected_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE,
  processing_error TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

**Key Fields:**

- `id`: Unique identifier
- `person_id`: Foreign key to people table
- `company_id`: Foreign key to companies table
- `gmail_message_id`: Gmail message identifier
- `gmail_thread_id`: Gmail thread identifier
- `from_email`: Sender email address
- `reply_subject`: Email subject line
- `reply_body_plain`: Plain text content
- `reply_body_html`: HTML content
- `received_at`: When reply was received
- `sentiment`: AI-analyzed sentiment (positive, negative, neutral, out_of_office)
- `sentiment_confidence`: Confidence score (0-1)
- `sentiment_reasoning`: AI reasoning for sentiment
- `triggered_stage_change`: Whether reply triggered stage progression
- `previous_stage`: Stage before auto-progression
- `new_stage`: Stage after auto-progression

### 5. **Interactions** (`interactions`)

Activity tracking and communication history.

```sql
CREATE TABLE interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  person_id UUID NOT NULL REFERENCES people(id),
  interaction_type interaction_type_enum NOT NULL,
  occurred_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  subject TEXT,
  content TEXT,
  template_id UUID,
  metadata JSONB,
  owner_id UUID REFERENCES user_profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

**Key Fields:**

- `id`: Unique identifier
- `person_id`: Foreign key to people table
- `interaction_type`: Type of interaction (email_sent, email_reply, meeting_booked, etc.)
- `occurred_at`: When interaction occurred
- `subject`: Interaction subject
- `content`: Interaction content
- `metadata`: Additional data (JSONB)
- `owner_id`: User who created the interaction

## Supporting Tables

### **Campaigns** (`campaigns`)

Marketing campaigns and outreach.

```sql
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  status campaign_status_enum,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### **Campaign Participants** (`campaign_participants`)

Many-to-many relationship between campaigns and people.

```sql
CREATE TABLE campaign_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id),
  person_id UUID REFERENCES people(id),
  joined_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE
);
```

### **Email Integration Tables**

#### **Email Messages** (`email_messages`)

Individual email messages from Gmail integration.

```sql
CREATE TABLE email_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gmail_message_id TEXT NOT NULL,
  thread_id TEXT,
  from_email TEXT NOT NULL,
  to_emails TEXT[] NOT NULL,
  cc_emails TEXT[],
  bcc_emails TEXT[],
  subject TEXT,
  body_text TEXT,
  body_html TEXT,
  attachments JSONB,
  person_id UUID REFERENCES people(id),
  is_read BOOLEAN DEFAULT FALSE,
  is_sent BOOLEAN DEFAULT FALSE,
  sent_at TIMESTAMP WITH TIME ZONE,
  received_at TIMESTAMP WITH TIME ZONE,
  sync_status TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

#### **Email Threads** (`email_threads`)

Email conversation threads.

```sql
CREATE TABLE email_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gmail_thread_id TEXT NOT NULL,
  person_id UUID REFERENCES people(id),
  subject TEXT,
  last_message_at TIMESTAMP WITH TIME ZONE,
  message_count INTEGER DEFAULT 0,
  sync_status TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

#### **Email Templates** (`email_templates`)

Reusable email templates.

```sql
CREATE TABLE email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subject TEXT,
  body_html TEXT,
  body_text TEXT,
  template_type TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### **LinkedIn Integration Tables**

#### **LinkedIn User Tokens** (`linkedin_user_tokens`)

LinkedIn OAuth tokens for users.

#### **LinkedIn User Settings** (`linkedin_user_settings`)

LinkedIn integration settings per user.

#### **LinkedIn Webhook Events** (`linkedin_user_webhook_events`)

LinkedIn webhook event logs.

### **User Management Tables**

#### **User Profiles** (`user_profiles`)

Extended user profile information.

#### **User Settings** (`user_settings`)

User-specific application settings.

### **System Tables**

#### **System Settings** (`system_settings`)

Application configuration and settings.

#### **Interactions** (`interactions`)

Track user interactions and activities.

#### **Email Sync Logs** (`email_sync_logs`)

Logs for email synchronization processes.

## Database Enums

The database uses several enums to ensure data consistency:

### **Stage** (`stage_enum`) - Simplified People Workflow

Lead progression stages (simplified from complex LinkedIn automation):

- `new`: Newly added lead awaiting review
- `qualified`: Lead meets criteria and should be pursued
- `proceed`: Ready for CRM integration or email outreach
- `skip`: Not pursuing at this time

### **Reply Type** (`reply_type`)

Email reply sentiment classification:

- `interested`: Positive response indicating interest
- `not_interested`: Negative response indicating disinterest
- `maybe`: Neutral response requiring follow-up

### **Campaign Status** (`campaign_status_enum`)

- `draft`: Campaign is being prepared
- `active`: Campaign is running
- `paused`: Campaign is temporarily stopped

### **Confidence Level** (`confidence_level_enum`)

- `low`: Low confidence in lead quality
- `medium`: Medium confidence in lead quality
- `high`: High confidence in lead quality

### **Company Pipeline Stage** (`company_pipeline_stage`)

Company progression stages:

- `new_lead`: Newly discovered company
- `automated`: Automation process started
- `replied`: Company has responded
- `meeting_scheduled`: Meeting scheduled with company
- `proposal_sent`: Proposal sent to company
- `negotiation`: In negotiation phase
- `closed_won`: Successfully closed deal
- `closed_lost`: Deal lost
- `on_hold`: Deal temporarily on hold

### **Interaction Type** (`interaction_type_enum`)

Types of interactions tracked:

- `linkedin_connection_request_sent`: LinkedIn connection request sent
- `linkedin_connected`: LinkedIn connection accepted
- `linkedin_message_sent`: LinkedIn message sent
- `linkedin_message_reply`: LinkedIn message reply received
- `email_sent`: Email sent
- `email_reply`: Email reply received
- `meeting_booked`: Meeting scheduled
- `meeting_held`: Meeting completed
- `disqualified`: Lead disqualified
- `note`: Additional notes added

## Relationships

### Primary Relationships

```
Companies (1) ←→ (Many) People
Companies (1) ←→ (Many) Jobs
People (1) ←→ (Many) Interactions
People (1) ←→ (Many) Email Replies
Interactions (1) ←→ (Many) Email Replies
Campaigns (1) ←→ (Many) Campaign Participants ←→ (Many) People
User Profiles (1) ←→ (Many) People (owner)
User Profiles (1) ←→ (Many) Companies (owner)
User Profiles (1) ←→ (Many) Jobs (owner)
```

### Foreign Key Constraints

**Core Entity Relationships:**

- `people.company_id` → `companies.id`
- `jobs.company_id` → `companies.id`
- `people.owner_id` → `user_profiles.id`
- `companies.owner_id` → `user_profiles.id`
- `jobs.owner_id` → `user_profiles.id`

**Activity Tracking:**

- `interactions.person_id` → `people.id`
- `interactions.owner_id` → `user_profiles.id`
- `email_replies.person_id` → `people.id`
- `email_replies.company_id` → `companies.id`
- `email_replies.interaction_id` → `interactions.id`

**Campaign Management:**

- `campaign_participants.campaign_id` → `campaigns.id`
- `campaign_participants.person_id` → `people.id`
- `campaign_analytics.campaign_id` → `campaigns.id`
- `campaign_messages.campaign_id` → `campaigns.id`

**Client Management:**

- `client_users.client_id` → `clients.id`
- `client_job_opportunities.client_id` → `clients.id`
- `client_job_opportunities.company_id` → `companies.id`
- `client_job_opportunities.job_id` → `jobs.id`
- `client_decision_maker_outreach.client_id` → `clients.id`
- `client_decision_maker_outreach.decision_maker_id` → `people.id`
- `client_decision_maker_outreach.job_id` → `jobs.id`

## Row Level Security (RLS)

All tables have Row Level Security enabled with policies:

### Authentication Required

```sql
-- Example policy for companies table
CREATE POLICY "Allow authenticated users to manage companies"
ON companies
FOR ALL
USING (auth.uid() IS NOT NULL);
```

### Role-Based Access

- **Owner**: Full access to all data
- **Admin**: Full access to all data
- **User**: Limited access based on assignments

## Querying Data

### Basic Queries

#### Get All Companies

```typescript
const { data: companies, error } = await supabase
  .from('companies')
  .select('*')
  .order('created_at', { ascending: false });
```

#### Get People with Company Info and Recent Activity

```typescript
const { data: people, error } = await supabase
  .from('people')
  .select(
    `
    id,
    name,
    email_address,
    stage,
    last_reply_at,
    last_reply_channel,
    companies (
      id,
      name,
      website,
      industry
    )
  `
  )
  .order('last_reply_at', { ascending: false });
```

#### Get Email Replies with Sentiment Analysis

```typescript
const { data: replies, error } = await supabase
  .from('email_replies')
  .select(
    `
    id,
    from_email,
    reply_subject,
    sentiment,
    sentiment_confidence,
    received_at,
    people (
      name,
      stage
    )
  `
  )
  .eq('sentiment', 'positive')
  .order('received_at', { ascending: false });
```

#### Get Jobs by Qualification Status

```typescript
const { data: jobs, error } = await supabase
  .from('jobs')
  .select(
    `
    id,
    title,
    location,
    qualification_status,
    companies (
      name,
      industry
    )
  `
  )
  .eq('qualification_status', 'qualify')
  .order('created_at', { ascending: false });
```

### Advanced Queries

#### Search with Filters

```typescript
const { data, error } = await supabase
  .from('people')
  .select(
    `
    id,
    name,
    email_address,
    stage,
    last_reply_at,
    companies (name, industry)
  `
  )
  .ilike('name', `%${searchTerm}%`)
  .eq('stage', 'qualified')
  .order('last_reply_at', { ascending: false })
  .limit(20);
```

#### Get Full Email Conversation Thread

```typescript
// Get sent emails from interactions
const { data: sentEmails } = await supabase
  .from('interactions')
  .select('id, subject, content, occurred_at')
  .eq('person_id', personId)
  .eq('interaction_type', 'email_sent')
  .order('occurred_at', { ascending: true });

// Get replies from email_replies
const { data: replies } = await supabase
  .from('email_replies')
  .select(
    'id, from_email, reply_subject, reply_body_plain, received_at, sentiment'
  )
  .eq('person_id', personId)
  .order('received_at', { ascending: true });

// Combine and sort chronologically
const conversation = [...sentEmails, ...replies].sort(
  (a, b) =>
    new Date(a.received_at || a.occurred_at).getTime() -
    new Date(b.received_at || b.occurred_at).getTime()
);
```

#### Real-time Subscriptions

```typescript
const subscription = supabase
  .channel('people_changes')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'people' },
    payload => {
      console.log('Change received!', payload);
    }
  )
  .subscribe();
```

## Data Validation

### Constraints

- Email format validation
- Phone number format validation
- URL format validation
- Required field constraints

### Triggers

- Automatic `updated_at` timestamp updates
- Data validation triggers
- Audit logging triggers

## Performance Optimization

### Indexes

```sql
-- Core entity indexes
CREATE INDEX idx_people_company_id ON people(company_id);
CREATE INDEX idx_people_stage ON people(stage);
CREATE INDEX idx_people_owner_id ON people(owner_id);
CREATE INDEX idx_people_last_reply_at ON people(last_reply_at);

CREATE INDEX idx_jobs_company_id ON jobs(company_id);
CREATE INDEX idx_jobs_qualification_status ON jobs(qualification_status);
CREATE INDEX idx_jobs_owner_id ON jobs(owner_id);

CREATE INDEX idx_companies_owner_id ON companies(owner_id);
CREATE INDEX idx_companies_pipeline_stage ON companies(pipeline_stage);

-- Activity tracking indexes
CREATE INDEX idx_interactions_person_id ON interactions(person_id);
CREATE INDEX idx_interactions_type ON interactions(interaction_type);
CREATE INDEX idx_interactions_occurred_at ON interactions(occurred_at);

CREATE INDEX idx_email_replies_person_id ON email_replies(person_id);
CREATE INDEX idx_email_replies_company_id ON email_replies(company_id);
CREATE INDEX idx_email_replies_received_at ON email_replies(received_at);
CREATE INDEX idx_email_replies_sentiment ON email_replies(sentiment);

-- Gmail integration indexes
CREATE INDEX idx_email_replies_gmail_message_id ON email_replies(gmail_message_id);
CREATE INDEX idx_email_replies_gmail_thread_id ON email_replies(gmail_thread_id);
```

### Views

- Performance views for common queries
- Aggregated data views
- Reporting views

## Migration Management

### Running Migrations

```bash
# Apply all pending migrations
npx supabase db push

# Reset database (development only)
npx supabase db reset

# Generate new migration
npx supabase migration new migration_name
```

### Migration Files

Located in `supabase/migrations/`:

- `20250120000001_create_system_settings.sql`
- `20250125000001_enable_security.sql`
- `20250125000002_add_email_integration_tables.sql`
- `20250125000003_add_conversations_tables.sql`

## Backup and Recovery

### Automated Backups

- Supabase handles automated backups
- Point-in-time recovery available
- Cross-region replication

### Manual Backups

```bash
# Export schema
npx supabase db dump --schema-only > schema.sql

# Export data
npx supabase db dump --data-only > data.sql
```

## Monitoring and Analytics

### Database Metrics

- Query performance monitoring
- Connection pool monitoring
- Storage usage tracking
- API usage analytics

### Health Checks

- Database connectivity checks
- Query response time monitoring
- Error rate tracking

## Security Best Practices

### Data Protection

- All data encrypted in transit (HTTPS)
- Database encryption at rest
- Regular security audits
- Access logging and monitoring

### API Security

- Rate limiting on all endpoints
- Input validation and sanitization
- SQL injection prevention
- CORS configuration

## Troubleshooting

### Common Issues

1. **Connection Timeouts**: Check network connectivity and Supabase status
2. **RLS Policy Errors**: Verify user authentication and policy configuration
3. **Query Performance**: Check indexes and query optimization
4. **Data Validation Errors**: Review constraints and validation rules

### Debug Tools

- Supabase Dashboard for query analysis
- Database logs and monitoring
- Performance insights
- Error tracking

## Documentation Generation

### Auto-Generate Docs

```bash
# Generate current database documentation
node scripts/generate-db-docs.js
```

This script creates up-to-date documentation based on the current database schema.

---

_Last updated: January 27, 2025_
