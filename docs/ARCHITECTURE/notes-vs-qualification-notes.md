# Notes vs Qualification Notes

**Date:** October 22, 2025

## The Distinction

### `client_companies.qualification_notes`

**Purpose**: Single note about WHY the company was qualified  
**Example**: "Fast-growing SaaS, 50 employees, Series A funded"

**When it's set**: During qualification (one-time)  
**Who can edit**: User who qualified it

### `notes` table (company notes)

**Purpose**: Multiple ongoing notes about the company  
**Examples**:

- "Had a good conversation with CEO about budget"
- "Follow up next week"
- "Sent proposal for $50K deal"

**When it's set**: Anytime after qualification (ongoing)  
**Who can edit**: Any team member  
**How many**: Unlimited notes per company

---

## Real-World Example

### Microsoft (Qualified by Client A)

**Qualification Note** (`client_companies.qualification_notes`):

> "Microsoft has urgent hiring needs in their Azure division, budget confirmed for Q4"

**Regular Notes** (`notes` table):

1. "Contacted John Smith (CTO) on Oct 15"
2. "Meeting scheduled for Oct 20 at 2pm"
3. "Sent proposal for 5 engineers"
4. "Followed up on proposal Oct 25"

---

## Database Schema

### client_companies

```sql
CREATE TABLE client_companies (
  id UUID PRIMARY KEY,
  client_id UUID,
  company_id UUID,
  qualification_status TEXT,
  qualified_at TIMESTAMPTZ,
  qualified_by UUID,
  qualification_notes TEXT,  ← Single qualification note
  priority TEXT,
  ...
);
```

### notes

```sql
CREATE TABLE notes (
  id UUID PRIMARY KEY,
  entity_id UUID,           ← Company ID
  entity_type TEXT,          ← 'company'
  content TEXT,
  author_id UUID,
  client_id UUID,            ← Which client owns this note
  related_lead_id UUID,      ← Optional: specific person
  created_at TIMESTAMPTZ,
  ...
);
```

---

## UI Implementation

### Show Qualification Note

Displayed on the company card as a brief summary:

```tsx
<CompanyCard>
  <QualificationNote>{client_companies.qualification_notes}</QualificationNote>
  ...
</CompanyCard>
```

### Show Regular Notes

Displayed in the notes section:

```tsx
<NotesSection>
  {notes.map(note => (
    <Note>
      {note.content}
      <Author>{note.author_name}</Author>
      <Date>{note.created_at}</Date>
    </Note>
  ))}
</NotesSection>
```

---

## Best Practice

1. **`qualification_notes`**: Brief, factual, set once
2. **`notes` table**: Detailed, ongoing, multiple entries
3. **Keep them separate**: Different purposes, different queries
