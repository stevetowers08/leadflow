# Grouped People View Implementation Plan

**Date:** January 31, 2025  
**Status:** Research Complete - Ready for Implementation  
**Source Research:** Web search for 2025 best practices

---

## 📊 Research Findings

### 1. Grouped Table View (Company-Grouped)

**Best Practices:**

- ✅ Use expandable/collapsible rows for grouped data
- ✅ Hierarchical structure: Company → People
- ✅ Visual indentation for nested data
- ✅ Show summary statistics per group (e.g., "5 contacts, 3 decision makers")
- ✅ Breadcrumb navigation for clarity

**Libraries:**

- `react-table` (TanStack Table v8) - Most flexible
- `react-data-grid` - Excel-like grouping
- Custom implementation for full control

**UX Patterns:**

- Chevron icons to indicate expand/collapse state
- Accordion-style interaction
- Lazy loading for better performance
- Persist expand/collapse state in localStorage

### 2. View Toggle (Flat ↔ Grouped)

**Best Practices:**

- ✅ Icon-based toggle (List ↔ Blocks/Grid)
- ✅ State managed with `useState`
- ✅ Immediate view switch (no delay)
- ✅ Visual feedback when switching
- ✅ Remember preference in localStorage

**Toggle Options:**

```
[📋 List View] [🏢 Grouped View]  ← Button group
or
[List] [Grouped]                 ← Segmented control
or
[☰] [⊞]                          ← Icon toggle
```

**Implementation Pattern:**

```typescript
const [viewMode, setViewMode] = useState<'flat' | 'grouped'>('grouped');

<ToggleGroup>
  <Toggle value="flat" onClick={() => setViewMode('flat')}>
    <List className="h-4 w-4" />
  </Toggle>
  <Toggle value="grouped" onClick={() => setViewMode('grouped')}>
    <LayoutGrid className="h-4 w-4" />
  </Toggle>
</ToggleGroup>
```

### 3. Decision Maker Badges

**Best Practices:**

- ✅ Crown icon (👑) or "DM" badge
- ✅ Color-coded (amber/gold) to stand out
- ✅ Tooltip on hover: "Decision Maker - [Level]"
- ✅ Right of name (inline)
- ✅ Accessible with ARIA labels

**Design:**

```
John Smith (👑)                     ← Simple crown icon
John Smith [DM: VP]              ← Badge with level
John Smith ⭐ Decision Maker      ← Star + text
```

**Implementation:**

```tsx
{
  person.is_decision_maker && (
    <Badge variant='secondary' className='ml-2'>
      <Crown className='h-3 w-3' />
      {person.decision_maker_level && (
        <span className='ml-1 text-xs'>{person.decision_maker_level}</span>
      )}
    </Badge>
  );
}
```

---

## 🎯 Implementation Strategy

### **Phase 1: Data Transformation**

Transform flat people array into grouped structure:

```typescript
interface GroupedData {
  companies: {
    id: string;
    name: string;
    industry: string;
    website: string;
    people: Person[];
  }[];
}

function groupByCompany(people: Person[]): GroupedData {
  const grouped = people.reduce(
    (acc, person) => {
      const companyId = person.company_id || 'unassigned';

      if (!acc[companyId]) {
        acc[companyId] = {
          id: companyId,
          name: person.company_name || 'Unassigned',
          industry: person.company_industry || '',
          website: person.company_website || '',
          people: [],
        };
      }

      acc[companyId].people.push(person);
      return acc;
    },
    {} as Record<string, GroupedData['companies'][0]>
  );

  return { companies: Object.values(grouped) };
}
```

### **Phase 2: Grouped View Component**

```typescript
// src/components/people/GroupedPeopleTable.tsx

interface GroupedPeopleTableProps {
  companies: Company[];
  selectedIds: Set<string>;
  onToggleItem: (id: string) => void;
  onRefresh: () => void;
}

export function GroupedPeopleTable({
  companies,
  selectedIds,
  onToggleItem,
  onRefresh,
}: GroupedPeopleTableProps) {
  const [expandedCompanies, setExpandedCompanies] = useState<Set<string>>(
    new Set(companies.map(c => c.id))
  );

  // ... expand/collapse logic
  // ... render grouped rows with expand/collapse
}
```

**Features:**

- Default to all companies expanded
- Expand/collapse all button
- Checkbox for selecting all people in a company
- Decision maker badges on people rows
- Status dropdowns work in grouped view

### **Phase 3: View Toggle Component**

```typescript
// src/components/people/ViewModeToggle.tsx

interface ViewModeToggleProps {
  mode: 'flat' | 'grouped';
  onChange: (mode: 'flat' | 'grouped') => void;
}

export function ViewModeToggle({ mode, onChange }: ViewModeToggleProps) {
  return (
    <div className="flex items-center gap-1 border rounded-md p-1">
      <Button
        variant={mode === 'flat' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onChange('flat')}
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        variant={mode === 'grouped' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onChange('grouped')}
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>
    </div>
  );
}
```

### **Phase 4: Integration into People Page**

```typescript
// src/pages/People.tsx

const [viewMode, setViewMode] = useState<'flat' | 'grouped'>('grouped');

// Group people data
const groupedData = useMemo(() => {
  if (viewMode === 'grouped') {
    return groupByCompany(filteredPeople);
  }
  return null;
}, [filteredPeople, viewMode]);

// Render appropriate view
{viewMode === 'grouped' ? (
  <GroupedPeopleTable
    companies={groupedData.companies}
    selectedIds={bulkSelection.selectedIds}
    onToggleItem={bulkSelection.toggleItem}
    onRefresh={handlePersonUpdate}
  />
) : (
  <UnifiedTable
    data={paginatedPeople}
    columns={columns}
    // ... existing props
  />
)}
```

---

## 🎨 UI/UX Enhancements

### 1. View Toggle Placement

```
[Filter Controls] [View Toggle] [Search]
```

### 2. Company Row Design

```
┌─ Acme Corp ─────────────────────────────────────────┐
│  5 contacts  • 3 decision makers  • Manufacturing   │
│  [▶ Expanded to show contacts]                        │
└─────────────────────────────────────────────────────┘
```

### 3. Decision Maker Badge

- Use Crown icon (👑) from lucide-react
- Amber/gold color to stand out
- Tooltip: "Decision Maker - VP Level"
- Position: right of name

### 4. Expand/Collapse Icons

- ChevronRight (►) when collapsed
- ChevronDown (▼) when expanded
- Smooth animation

---

## 🚀 Performance Considerations

**For 660+ records:**

1. **Virtualization** (if needed)
   - Use `react-window` or `react-virtuoso`
   - Only render visible rows
   - Reduces DOM nodes

2. **Memoization**
   - Memoize grouped data transformation
   - Memoize row components
   - Use `React.memo` for list items

3. **Lazy Expansion**
   - Only expand/collapse first few companies by default
   - Load people on-demand for companies

4. **Pagination**
   - Apply to both views
   - Keep pagination state separate

---

## ✅ Implementation Checklist

### **Phase 1: Core Components** (2-3 hours)

- [ ] Create `groupByCompany()` utility function
- [ ] Create `GroupedPeopleTable.tsx` component
- [ ] Implement expand/collapse logic
- [ ] Add checkbox selection support
- [ ] Integrate status dropdowns

### **Phase 2: View Toggle** (1 hour)

- [ ] Create `ViewModeToggle.tsx` component
- [ ] Add toggle to People page header
- [ ] Implement state management
- [ ] Persist preference to localStorage

### **Phase 3: Decision Maker Badges** (30 min)

- [ ] Create `DecisionMakerBadge.tsx` component
- [ ] Add Crown icon
- [ ] Add tooltips
- [ ] Test accessibility

### **Phase 4: Polish & Performance** (1 hour)

- [ ] Add smooth animations
- [ ] Add "Expand All" / "Collapse All" buttons
- [ ] Optimize with memoization
- [ ] Test with full 660 records
- [ ] Add loading states

### **Phase 5: Testing** (1 hour)

- [ ] Test bulk operations in grouped view
- [ ] Test keyboard navigation
- [ ] Test accessibility (screen reader)
- [ ] Test responsive design
- [ ] Performance testing

**Total Estimated Time:** 5-6 hours

---

## 📚 References

- [Building Interactive Grouped Tables in React](https://medium.com/@vishals9711/building-an-interactive-grouped-table-component-in-react-f9ba2db0ca9b)
- [React Table Best Practices](https://telerik.com/blogs/details/tutorial-how-to-build-accessible-react-table-data-grid)
- [Performance Optimization for Large Tables](https://code-b.dev/blog/detailed-guide-on-react-tables)
- [Material-UI Grouped Table](https://medium.com/@vishals9711/building-an-interactive-grouped-table-component-in-react-f9ba2db0ca9b)

---

## 🎯 Next Steps

1. Start with Phase 1 (Core Components)
2. Test with subset of data first
3. Gradually add features
4. Performance test with full dataset
5. Get user feedback on UX
