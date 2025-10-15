# Database Schema Documentation

## Overview

The Empowr CRM uses Supabase (PostgreSQL) as its backend database. This document provides comprehensive information about the database structure, relationships, and how to properly query data.

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

### 2. **People** (`people`)

Individual contacts and leads.

```sql
CREATE TABLE people (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email_address TEXT,
  company_id UUID REFERENCES companies(id),
  company_role TEXT,
  linkedin_url TEXT,
  linkedin_profile_id TEXT,
  linkedin_connected TEXT,
  linkedin_connected_message TEXT,
  linkedin_request_message TEXT,
  linkedin_follow_up_message TEXT,
  linkedin_responded TEXT,
  connection_request_date TIMESTAMP WITH TIME ZONE,
  connection_accepted_date TIMESTAMP WITH TIME ZONE,
  connection_request_sent TEXT,
  message_sent TEXT,
  message_sent_date TIMESTAMP WITH TIME ZONE,
  email_sent TEXT,
  email_sent_date TIMESTAMP WITH TIME ZONE,
  email_reply TEXT,
  email_reply_date TIMESTAMP WITH TIME ZONE,
  email_draft TEXT,
  meeting_booked BOOLEAN DEFAULT FALSE,
  meeting_date TIMESTAMP WITH TIME ZONE,
  connected_at TIMESTAMP WITH TIME ZONE,
  response_date TIMESTAMP WITH TIME ZONE,
  last_interaction_at TIMESTAMP WITH TIME ZONE,
  last_reply_at TIMESTAMP WITH TIME ZONE,
  last_reply_channel TEXT,
  last_reply_message TEXT,
  lead_score TEXT,
  confidence_level TEXT CHECK (confidence_level IN ('low', 'medium', 'high')),
  stage stage_enum,
  stage_updated TIMESTAMP WITH TIME ZONE,
  campaign_finished TEXT,
  automation_started_at TIMESTAMP WITH TIME ZONE,
  favourite BOOLEAN DEFAULT FALSE,
  is_favourite TEXT,
  jobs TEXT,
  employee_location TEXT,
  owner_id UUID,
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
- `linkedin_url`: LinkedIn profile URL
- `linkedin_profile_id`: LinkedIn internal ID
- `stage`: Current lead stage (enum)
- `lead_score`: Calculated lead score
- `confidence_level`: Confidence in lead quality
- `meeting_booked`: Whether meeting is scheduled
- `automation_started_at`: When automation began
- `owner_id`: Assigned user/owner

### 3. **Jobs** (`jobs`)

Job postings and opportunities.

```sql
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  company_id UUID REFERENCES companies(id),
  description TEXT,
  summary TEXT,
  location TEXT,
  salary TEXT,
  employment_type TEXT,
  function TEXT,
  seniority_level TEXT,
  job_url TEXT,
  linkedin_job_id TEXT,
  logo_url TEXT,
  posted_date TIMESTAMP WITH TIME ZONE,
  valid_through TIMESTAMP WITH TIME ZONE,
  lead_score_job INTEGER,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  automation_active BOOLEAN,
  automation_started_at TIMESTAMP WITH TIME ZONE,
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
- `lead_score_job`: Calculated job lead score
- `priority`: Priority level for outreach
- `automation_active`: Whether automation is running

### 4. **Conversations** (`conversations`)

Chat and communication history.

```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  person_id UUID REFERENCES people(id),
  type TEXT DEFAULT 'chat',
  subject TEXT,
  content TEXT,
  direction TEXT, -- 'inbound' or 'outbound'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

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

### **Campaign Status** (`campaign_status_enum`)

- `draft`: Campaign is being prepared
- `active`: Campaign is running
- `paused`: Campaign is temporarily stopped

### **Confidence Level** (`confidence_level_enum`)

- `low`: Low confidence in lead quality
- `medium`: Medium confidence in lead quality
- `high`: High confidence in lead quality

### **Stage** (`stage_enum`)

Lead progression stages:

- `new`: Newly added lead
- `connection_requested`: LinkedIn connection request sent
- `connected`: LinkedIn connection accepted
- `messaged`: Initial message sent
- `replied`: Lead has replied
- `meeting_booked`: Meeting scheduled
- `meeting_held`: Meeting completed
- `disqualified`: Lead disqualified
- `note`: Additional notes added

### **Interaction Type** (`interaction_type_enum`)

Types of interactions tracked:

- `linkedin_connection_request_sent`
- `linkedin_connected`
- `linkedin_message_sent`
- `linkedin_message_reply`
- `email_sent`
- `email_reply`
- `meeting_booked`
- `meeting_held`
- `disqualified`
- `note`

## Relationships

### Primary Relationships

```
Companies (1) ←→ (Many) People
Companies (1) ←→ (Many) Jobs
People (1) ←→ (Many) Conversations
Campaigns (1) ←→ (Many) Campaign Participants ←→ (Many) People
```

### Foreign Key Constraints

- `people.company_id` → `companies.id`
- `jobs.company_id` → `companies.id`
- `conversations.person_id` → `people.id`
- `campaign_participants.campaign_id` → `campaigns.id`
- `campaign_participants.person_id` → `people.id`

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

#### Get People with Company Info

```typescript
const { data: people, error } = await supabase.from('people').select(`
    *,
    companies (
      id,
      name,
      website
    )
  `);
```

#### Get Jobs by Company

```typescript
const { data: jobs, error } = await supabase
  .from('jobs')
  .select(
    `
    *,
    companies (
      name,
      website
    )
  `
  )
  .eq('company_id', companyId);
```

### Advanced Queries

#### Search with Filters

```typescript
const { data, error } = await supabase
  .from('people')
  .select(
    `
    *,
    companies (name, industry)
  `
  )
  .ilike('first_name', `%${searchTerm}%`)
  .eq('status', 'new')
  .order('created_at', { ascending: false })
  .limit(20);
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
-- Common indexes for performance
CREATE INDEX idx_people_company_id ON people(company_id);
CREATE INDEX idx_jobs_company_id ON jobs(company_id);
CREATE INDEX idx_conversations_person_id ON conversations(person_id);
CREATE INDEX idx_people_status ON people(status);
CREATE INDEX idx_jobs_status ON jobs(status);
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
