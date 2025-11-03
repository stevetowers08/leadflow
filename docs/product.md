---
owner: product-team
last-reviewed: 2025-01-27
status: final
---

# Product Overview & Status Campaigns

**Last Updated:** January 2025

## What is Empowr CRM?

Empowr CRM is an AI-powered recruitment platform that helps recruitment agencies identify, qualify, and convert companies into clients.

**Flow:** Jobs → Companies → People → Automation → Responses → Deals

## Core Entities

### Jobs

- **Status**: `new` | `qualify` | `skip`
- **Database Field**: `jobs.qualification_status`

### Companies

- **Pipeline Stages**: `new_lead` → `message_sent` → `replied` → `meeting_scheduled` → `proposal_sent` → `negotiation` → `closed_won`/`closed_lost` → `on_hold`
- **Database Field**: `companies.pipeline_stage`

### People

- **Stages**: `new_lead` → `message_sent` → `replied` → `interested` → `meeting_scheduled` → `meeting_completed` → `follow_up` → `not_interested`
- **Database Field**: `people.people_stage`

## Technology Stack

- **Frontend:** Next.js 16, React 18, TypeScript, Tailwind CSS, Radix UI
- **Backend:** Next.js API Routes, Supabase (PostgreSQL) with RLS
- **Deploy:** Vercel

## Status Campaigns

### Job Qualification

- **`new`** - Newly discovered job awaiting review
- **`qualify`** - Job meets criteria and should be pursued
- **`skip`** - Job to skip for now

### People Stages

- **`new_lead`** - New contact to review
- **`message_sent`** - Initial outreach completed
- **`replied`** - Contact responded
- **`interested`** - Contact shows interest
- **`meeting_scheduled`** - Meeting booked
- **`meeting_completed`** - Meeting held
- **`follow_up`** - Post-meeting follow-up
- **`not_interested`** - Contact declined

### Company Pipeline

- **`new_lead`** - Company identified as prospect
- **`qualified`** - Company meets criteria
- **`message_sent`** - Initial outreach made
- **`replied`** - Company responded
- **`meeting_scheduled`** - Meeting booked
- **`proposal_sent`** - Formal proposal delivered
- **`negotiation`** - Active discussions
- **`closed_won`** - Secured as client
- **`closed_lost`** - Deal lost
- **`on_hold`** - Temporarily paused

## Status Utilities

Use `src/utils/statusUtils.ts` for consistent status handling:

```typescript
import { getStatusDisplayText } from '@/utils/statusUtils';
const displayText = getStatusDisplayText('new_lead'); // "New Lead"
```

## Important Notes

**LinkedIn automation removed** (October 2025) - Only profile syncing remains.

---

**Related:** [Development Guide](development.md) | [Database Reference](database.md)
