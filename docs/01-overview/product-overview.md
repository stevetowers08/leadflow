---
owner: product-team
last-reviewed: 2025-01-27
status: final
product-area: core
---

# Empowr CRM - Product Overview

**Last Updated:** January 2025

## What is Empowr CRM?

Empowr CRM is an AI-powered recruitment platform that helps recruitment agencies identify, qualify, and convert companies into clients. It streamlines the process from job discovery to client acquisition.

## Business Model

**Flow:** Jobs → Companies → People → Automation → Responses → Deals

1. **Jobs** identify companies that are hiring
2. **Companies** become prospects in the sales pipeline
3. **People** at those companies are decision-makers we contact
4. **Automation** handles outreach and tracking
5. **Responses** indicate interest level
6. **Deals** are closed with interested companies

## Core Entities

### Jobs

Job postings that signal companies are hiring.

- **Status**: `new` | `qualify` | `skip` (see [Status Campaigns](status-campaigns.md))
- **Key Fields**: `title`, `company_id`, `qualification_status`, `location`, `function`

### Companies

Organizations we're trying to sign as clients.

- **Pipeline Stages**: `new_lead` → `message_sent` → `replied` → `meeting_scheduled` → `proposal_sent` → `negotiation` → `closed_won`/`closed_lost` → `on_hold`
- **Key Fields**: `name`, `industry`, `pipeline_stage`, `logo_url`

### People

Decision-makers and contacts at companies.

- **Stages**: `new_lead` → `message_sent` → `replied` → `interested` → `meeting_scheduled` → `meeting_completed` → `follow_up` → `not_interested`
- **Key Fields**: `name`, `company_id`, `people_stage`, `lead_score`, `reply_type`

## Technology Stack

### Frontend

- **Framework**: Next.js 16.0.1 (App Router)
- **UI**: React 18.2, TypeScript 5.9
- **Styling**: Tailwind CSS 3.4 + Radix UI
- **State**: TanStack Query 5.90 for server state
- **Charts**: Recharts for data visualization

### Backend

- **Database**: Supabase (PostgreSQL) with RLS
- **API**: Next.js API Routes
- **Auth**: Supabase Auth with Google OAuth
- **Real-time**: Supabase real-time subscriptions

### Integrations

- **Gmail**: Email automation and reply tracking
- **n8n**: Backend automation workflows
- **AI**: Google Gemini for lead scoring and analysis

## Key Features

1. **Job Qualification** - Review and qualify job postings
2. **Company Pipeline** - Track companies through sales stages
3. **Lead Management** - Manage contacts and conversations
4. **Campaign Automation** - Email sequences and outreach
5. **AI-Powered Analytics** - Lead scoring and reply analysis
6. **Dashboard & Reporting** - Performance metrics and KPIs

## Important Notes

### LinkedIn Automation Removed

As of October 2025, LinkedIn automation has been **completely removed**:

- ❌ No automation buttons in UI
- ❌ No bulk automation features
- ❌ No automation status tracking

LinkedIn integration exists only for profile syncing and connection tracking.

### Status Campaigns

See [Status Campaigns](status-campaigns.md) for detailed enum definitions and workflows.

## Getting Started

1. **Read** [Status Campaigns](status-campaigns.md) to understand workflows
2. **Follow** [Environment Setup](../03-development/environment-setup.md)
3. **Review** [Architecture Overview](architecture-overview.md)

---

**Related Docs:**
- [Status Campaigns](status-campaigns.md) - Status enums and workflows
- [Architecture Overview](architecture-overview.md) - System design
- [Development Guide](../03-development/local-development.md) - Setup and development







