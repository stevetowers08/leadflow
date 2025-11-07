---
owner: product-team
last-reviewed: 2025-01-27
status: final
product-area: core
---

# Status Campaigns

**Last Updated:** January 2025

## Overview

Empowr CRM uses simple, purpose-driven status enums for Jobs and People. These campaigns guide users through clear workflows.

## Job Qualification Campaign

**Database Field:** `jobs.qualification_status`

**Enum:** `new` | `qualify` | `skip`

### Status Definitions

- **`new`** - Newly discovered job awaiting review
- **`qualify`** - Job meets criteria and should be pursued
- **`skip`** - Job to skip for now

### Workflow

```
New Job → Review → [Qualify] or [Skip]
```

### Usage in Code

```typescript
// Update job qualification status
await supabase
  .from('jobs')
  .update({ qualification_status: 'qualify' })
  .eq('id', jobId);

// Query qualified jobs
const { data } = await supabase
  .from('jobs')
  .select('*')
  .eq('qualification_status', 'qualify');
```

## People Status Campaign

**Database Field:** `people.people_stage`

**Enum:** Conversation-based stages

### Status Definitions

- **`new_lead`** - New contact to review
- **`message_sent`** - Initial outreach completed
- **`replied`** - Contact responded
- **`interested`** - Contact shows interest
- **`meeting_scheduled`** - Meeting booked
- **`meeting_completed`** - Meeting held
- **`follow_up`** - Post-meeting follow-up
- **`not_interested`** - Contact declined

### Workflow

```
New Lead → Message Sent → [Replied] → Interested → Meeting Scheduled → Meeting Completed → Follow-up
                                           ↓
                                    Not Interested
```

### Usage in Code

```typescript
// Update people stage
await supabase
  .from('people')
  .update({ people_stage: 'message_sent' })
  .eq('id', personId);

// Query by stage
const { data } = await supabase
  .from('people')
  .select('*')
  .eq('people_stage', 'new_lead');
```

## Company Pipeline Stages

**Database Field:** `companies.pipeline_stage`

**Enum:** Business pipeline stages

### Status Definitions

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

### Workflow

```
New Lead → Qualified → Message Sent → Replied → Meeting Scheduled → Proposal Sent → Negotiation → [Closed Won | Closed Lost]
                                                                                                            ↓
                                                                                                      On Hold
```

## Status Utilities

Use `src/utils/statusUtils.ts` for consistent status handling:

```typescript
import { getStatusDisplayText, normalizePeopleStage } from '@/utils/statusUtils';

// Get display text
const displayText = getStatusDisplayText('new_lead'); // "New Lead"

// Normalize status (maps old values to new)
const normalized = normalizePeopleStage('NEW'); // "new_lead"
```

## Migration from Old Statuses

The codebase includes automatic mapping from legacy statuses:

```typescript
// Old → New mapping
'NEW' → 'new_lead'
'qualified' → 'interested'
'proceed' → 'meeting_scheduled'
'skip' → 'not_interested'
```

See `src/utils/statusUtils.ts` for complete mapping.

## Best Practices

1. **Always use enum values** - Don't create custom statuses
2. **Use status utilities** - Don't hardcode display text
3. **Validate statuses** - Check enum validity before saving
4. **Document transitions** - Log status changes in interactions table

## Database Constraints

Status fields should use database enums where possible:

```sql
-- Example enum creation (if not already exists)
CREATE TYPE people_stage_enum AS ENUM (
  'new_lead',
  'message_sent',
  'replied',
  'interested',
  'meeting_scheduled',
  'meeting_completed',
  'follow_up',
  'not_interested'
);
```

---

**Related Docs:**
- [Product Overview](product-overview.md) - Overall product context
- [Database Schema](../06-reference/database/schema.md) - Complete schema reference







