# Simple Notes Architecture

**Date:** October 22, 2025

## One Table for Everything

### `notes` table

```sql
CREATE TABLE notes (
  id UUID PRIMARY KEY,
  entity_id UUID,           -- Company ID
  entity_type TEXT,         -- 'company'
  content TEXT,
  author_id UUID,
  client_id UUID,           -- Which client owns this note
  related_lead_id UUID,      -- Optional: specific person
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);
```

**That's it!** One table handles:

- Company notes
- Job notes
- Person notes
- Qualification notes
- Follow-up notes
- All notes ever written

---

## Usage

### Add a Note

```typescript
await supabase.from('notes').insert({
  entity_id: companyId,
  entity_type: 'company',
  content: 'Budget confirmed for Q4',
  client_id: currentClientId,
  author_id: userId,
  related_lead_id: personId, // Optional
});
```

### Get Notes for a Company

```typescript
const { data: notes } = await supabase
  .from('notes')
  .select('*, user_profiles:author_id (full_name)')
  .eq('entity_id', companyId)
  .eq('entity_type', 'company')
  .eq('client_id', currentClientId);
```

---

## Benefits

- ✅ Simple - One table, one query
- ✅ Efficient - No joins needed for notes
- ✅ Flexible - Add as many notes as you want
- ✅ Client-scoped - Each client sees only their notes
- ✅ Lead association - Link notes to specific people

---

## No More Duplication

- ❌ No `qualification_notes` in `client_companies`
- ❌ No separate tables
- ❌ No complex joins

Just notes. That's it.
