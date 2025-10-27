# PDR: Client-Scoped Notes with Lead Association

**Date:** October 22, 2025  
**Status:** Planning  
**Related Issues:** TBD

## Overview

This PDR outlines the implementation of client-scoped notes for companies with the ability to associate notes with specific leads (people) within those companies. This ensures data isolation between clients while allowing flexible note-taking that can be either company-wide or lead-specific.

## Problem Statement

Currently, notes are created directly on companies without client scoping:

- **Current**: Notes are global - any note on Microsoft is visible to all clients
- **Problem**: Client A's confidential notes about Microsoft become visible to Client B
- **Need**: Client-specific notes with optional lead association

### Current Architecture

```
notes table:
- entity_id (company_id)
- entity_type ('company')
- content
- author_id
❌ NO client_id - notes are global/shared
```

### Example Problem

```
Company: Microsoft
  - Note by Client A: "Partnered with us on Q4 project"
  - Note by Client B: "Budget constraints, not pursuing"

Both clients see EACH OTHER'S notes! ❌
```

## Proposed Solution

Implement an association table pattern that:

1. **Links notes to specific clients** (via `client_company_notes`)
2. **Optionally links notes to specific leads** (via `related_lead_id`)
3. **Maintains separation** using RLS policies
4. **Follows existing patterns** consistent with `client_companies` and `client_jobs`

### New Architecture

```
notes (shared content)
    ↓
client_company_notes (association: client + company + note)
    ↓
Optionally link to specific lead
```

### Database Schema

#### Add columns to existing `notes` table

```sql
-- Add client_id for tenant isolation
ALTER TABLE notes ADD COLUMN client_id UUID REFERENCES clients(id) ON DELETE CASCADE;

-- Add optional lead association
ALTER TABLE notes ADD COLUMN related_lead_id UUID REFERENCES people(id) ON DELETE SET NULL;

-- Indexes for performance
CREATE INDEX idx_notes_client_id ON notes(client_id);
CREATE INDEX idx_notes_client_company ON notes(client_id, entity_id) WHERE entity_type = 'company';
CREATE INDEX idx_notes_related_lead ON notes(related_lead_id);
```

This approach is **simpler** because:

- No new association table needed
- Direct foreign keys for referential integrity
- Fewer queries when fetching notes
- Easier to maintain and understand

### Data Flow

#### Creating a Note (Client A on Microsoft)

```typescript
// Create note with client scoping (single query)
const { data: note } = await supabase
  .from('notes')
  .insert({
    entity_id: 'microsoft-company-id',
    entity_type: 'company',
    content: 'Budget confirmed for Q4 project',
    author_id: user.id,
    client_id: 'client-a-id', // ← Client scoping
    related_lead_id: 'decision-maker-id', // ← Optional lead
  })
  .select()
  .single();
```

#### Reading Notes (Client A)

```typescript
// Get notes for Microsoft, scoped to Client A (simple direct query)
const { data: notes } = await supabase
  .from('notes')
  .select(
    `
    *,
    author:user_profiles!notes_author_id_fkey (full_name),
    lead:people (name, company_role)
  `
  )
  .eq('client_id', 'client-a-id')
  .eq('entity_id', 'microsoft-company-id')
  .eq('entity_type', 'company')
  .order('created_at', { ascending: false });
```

### Use Cases

#### 1. Company-Wide Note (General)

```typescript
// Note about the company in general
{
  id: 'note-123',
  entity_id: 'microsoft',
  entity_type: 'company',
  content: 'Budget confirmed for Q4 project',
  client_id: 'client-a',
  related_lead_id: null  // ← No specific lead
}
```

#### 2. Lead-Specific Note

```typescript
// Note about a specific person at the company
{
  id: 'note-124',
  entity_id: 'microsoft',
  entity_type: 'company',
  content: 'Decision maker prefers email over LinkedIn',
  client_id: 'client-a',
  related_lead_id: 'decision-maker-person-id'  // ← Specific person
}
```

#### 3. Multiple Notes on Same Company

```typescript
// Client A can have multiple notes on Microsoft
[
  {
    id: 'note-123',
    entity_id: 'microsoft',
    entity_type: 'company',
    content: 'Budget confirmed',
    client_id: 'client-a',
    related_lead_id: null,
  },
  {
    id: 'note-124',
    entity_id: 'microsoft',
    entity_type: 'company',
    content: 'Decision maker prefers email',
    client_id: 'client-a',
    related_lead_id: 'person-id',
  },
];
```

## Implementation Plan

### Phase 1: Database Migration (✅ Done)

- [x] Create `client_company_notes` table
- [x] Add RLS policies
- [x] Create indexes
- [x] Add update trigger

### Phase 2: Backend Logic

1. **Update Note Creation Flow**

   Modify the note creation logic to:
   - Create note in `notes` table
   - Create association in `client_company_notes` table
   - Include optional `related_lead_id`

2. **Update Note Fetching Logic**

   Modify note fetching to:
   - Filter by `client_id` via `client_company_notes`
   - Join with `notes` table for content
   - Join with `people` table if `related_lead_id` exists

3. **Update Note Deletion Logic**
   - Handle cascade deletes properly
   - Ensure client-scoped deletion

### Phase 3: Frontend Changes

#### Update `NotesSection.tsx`

```typescript
// Current (incorrect):
const { data } = await supabase
  .from('notes')
  .select('*')
  .eq('entity_id', companyId);

// New (client-scoped):
const { data } = await supabase
  .from('client_company_notes')
  .select(
    `
    *,
    note:notes!inner (content, author_id, created_at),
    lead:people (name, company_role)
  `
  )
  .eq('client_id', currentClientId)
  .eq('company_id', companyId)
  .order('created_at', { ascending: false });
```

#### Update `AddNoteModal.tsx`

Add ability to select lead when creating company note:

```typescript
interface NoteData {
  content: string;
  companyId: string;
  clientId: string;
  relatedLeadId?: string; // ← Optional lead
  priority?: 'low' | 'normal' | 'high' | 'urgent';
}
```

### Phase 4: UI/UX Improvements

1. **Note Display**
   - Show note content
   - Show author and timestamp
   - Show related lead (if applicable) with badge
   - Show priority indicator

2. **Note Creation**
   - Text area for note content
   - Dropdown to select lead (optional)
   - Priority selector
   - Client context automatically included

3. **Note Filtering**
   - Filter by: All Notes | Lead-Specific | General
   - Search notes by content
   - Sort by: Date | Priority | Author

### Phase 5: Migration Strategy

For existing notes:

1. No existing notes in production that need migration
2. If notes exist in future, create migration script to:
   - Detect existing notes
   - Create association entries
   - Set default client_id based on note author

## RLS Policies

All policies enforce client-scoped access:

```sql
-- Users can only see notes for their clients
CREATE POLICY "Users can view their client company notes"
  ON client_company_notes FOR SELECT
  USING (
    client_id IN (
      SELECT client_id FROM client_users WHERE user_id = auth.uid()
    )
  );
```

## Edge Cases

### 1. Same Note, Multiple Clients

If Client A and Client B independently create notes on Microsoft:

- Each creates separate entry in `notes` table
- Each creates separate association in `client_company_notes`
- No data sharing

### 2. Lead Changes Company

If a person moves companies:

- Notes are tied to `company_id`, not `person_id`
- Old notes remain on original company
- New notes can be created on new company

### 3. Client Deletes Note

```sql
-- Delete association removes note from client's view
DELETE FROM client_company_notes WHERE id = 'association-id';

-- Delete cascade removes the note content
DELETE FROM notes WHERE id = 'note-id';  -- Auto-deletes associations
```

### 4. Lead Not Associated with Company

If `related_lead_id` points to a person not in that company:

- Allowed by database (no FK constraint on relationship)
- UI should validate this
- Shows warning if lead doesn't belong to company

## Testing Strategy

### Unit Tests

1. **Note Creation**
   - ✅ Creates note in `notes` table
   - ✅ Creates association in `client_company_notes`
   - ✅ Sets `related_lead_id` when provided
   - ✅ Sets priority correctly

2. **Note Reading**
   - ✅ Returns only notes for current client
   - ✅ Excludes notes from other clients
   - ✅ Joins lead information when `related_lead_id` exists
   - ✅ Orders by date correctly

3. **Note Deletion**
   - ✅ Deletes association
   - ✅ Cascades note deletion

### Integration Tests

1. **Multi-Client Scenario**
   - Client A creates note on Microsoft
   - Client B creates note on Microsoft
   - Verify neither sees the other's note

2. **Lead Association**
   - Create note with `related_lead_id`
   - Verify lead appears in UI
   - Verify filtering works

3. **RLS Enforcement**
   - Test that users can only access their client's notes
   - Test that users cannot access other client's notes

## Performance Considerations

- **Indexes**: Created on all lookup columns (`client_id`, `company_id`, `note_id`, `related_lead_id`)
- **Composite Index**: `(client_id, company_id)` for common company feed queries
- **Query Optimization**: Uses INNER JOIN pattern for efficient filtering

## Future Enhancements

1. **Note Templates**: Pre-defined note templates for common scenarios
2. **Note Tagging**: Add tags to notes for categorization
3. **Note Attachments**: File uploads attached to notes
4. **Note Collaboration**: Real-time note editing with multiple users
5. **Note Search**: Full-text search across all client notes
6. **Note Analytics**: Track note-taking patterns and effectiveness

## Rollout Plan

1. **Week 1**: Database migration + basic CRUD operations
2. **Week 2**: Frontend updates for note creation and display
3. **Week 3**: Lead association UI and filtering
4. **Week 4**: Testing and bug fixes
5. **Week 5**: Staged rollout (25% → 50% → 100%)

## Success Metrics

- ✅ Notes are isolated per client
- ✅ Notes can be associated with leads
- ✅ Zero data leakage between clients
- ✅ Performance: < 200ms for note fetching
- ✅ User satisfaction: > 90% adoption rate

## Open Questions

1. Should we support notes on jobs? (Currently only companies)
2. Should we support notes on people directly? (Or only via company association)
3. What should happen to notes when a client is deleted?
4. Should notes be exportable/archived?

## Conclusion

This architecture provides:

- ✅ **Complete client isolation** via association tables
- ✅ **Flexible note-taking** with optional lead association
- ✅ **Scalability** with proper indexing
- ✅ **Consistency** with existing patterns (`client_companies`, `client_jobs`)

The association table pattern ensures that the same company can have different notes for different clients, while maintaining the shared canonical data structure.
