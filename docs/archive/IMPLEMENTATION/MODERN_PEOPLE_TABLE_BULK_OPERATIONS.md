# Modern People Table - 2025 Best Practices

**Date:** October 26, 2025  
**Philosophy:** Company-grouped view, modern bulk operations, clickable status dropdowns

---

## 🎯 User Flow Understanding

### **Your Business Model:**

```
Target: Companies (Organizations)
   ↓
Through: Decision Makers (People at those companies)
   ↓
Goal: Get jobs filled
```

### **User Mental Model:**

1. "I'm targeting **Acme Corp**"
2. "I need to reach their **hiring manager and VP Engineering**" (decision makers)
3. "I'll send them info about this **Software Engineer role**"

---

## 📊 People Table View Options

### **Option 1: Grouped by Company** ⭐ **RECOMMENDED**

**Why:** Matches your mental model - you're targeting companies through their people.

```
┌─ Acme Corp ──────────────────────────────────────┐
│  ☐ John Smith - VP Engineering (Decision Maker)  │
│  ☐ Sarah Johnson - HR Manager (Decision Maker)   │
│  ☐ Mike Davis - Recruiter                        │
└───────────────────────────────────────────────────┘

┌─ TechStart Inc ──────────────────────────────────┐
│  ☐ Emily Chen - CEO (Decision Maker)             │
│  ☐ David Lee - CTO (Decision Maker)              │
└───────────────────────────────────────────────────┘
```

**Benefits:**

- ✅ See all contacts at a company together
- ✅ Identify which companies have decision makers
- ✅ Easy to target entire company
- ✅ Matches user workflow

**Implementation:**

- Group people by `company_id`
- Expandable/collapsible company rows
- Show decision maker badge
- Bulk actions work across groups

---

### **Option 2: Flat List with Company Column**

**For:** Quick scanning, filtering, sorting

```
┌──────────────┬─────────────────┬──────────────────┐
│ Name         │ Company         │ Role             │
├──────────────┼─────────────────┼──────────────────┤
│ John Smith   │ Acme Corp       │ VP Engineering   │
│ Emily Chen   │ TechStart Inc   │ CEO              │
│ Sarah Johnson│ Acme Corp       │ HR Manager       │
└──────────────┴─────────────────┴──────────────────┘
```

**Benefits:**

- ✅ Traditional CRM view
- ✅ Easy to sort/filter
- ✅ Simple implementation

---

### **Recommendation: Hybrid Approach** 🎯

**Toggle between views:**

- **Grouped view** (default) - for targeting campaigns
- **Flat view** - for quick filtering/sorting

Like Gmail's grouped inbox toggle!

---

## 🎨 Bulk Operations - 2025 Best Practices

### **Research Findings:**

From NN/g and modern SaaS:

1. **Select All** - Must have checkbox in header
2. **Floating Action Bar** - Appears at bottom when items selected
3. **Clear Feedback** - Show count of selected items
4. **Undo Support** - For destructive actions
5. **Keyboard Shortcuts** - Power users love ⌘A, ⌘D, etc.

---

## 💻 Implementation - Modern Bulk Operations

### **1. Selection State Management**

```typescript
// src/hooks/useBulkSelection.ts

import { useState, useCallback } from 'react';

export interface BulkSelectionState {
  selectedIds: Set<string>;
  selectAll: boolean;
  excludedIds: Set<string>; // For "Select All except..."
}

export function useBulkSelection(totalItems: number) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [excludedIds, setExcludedIds] = useState<Set<string>>(new Set());

  const toggleSelectAll = useCallback(() => {
    if (selectAll) {
      // Deselect all
      setSelectAll(false);
      setSelectedIds(new Set());
      setExcludedIds(new Set());
    } else {
      // Select all
      setSelectAll(true);
      setExcludedIds(new Set());
    }
  }, [selectAll]);

  const toggleItem = useCallback(
    (id: string) => {
      if (selectAll) {
        // If "select all" is active, use exclusion list
        setExcludedIds(prev => {
          const next = new Set(prev);
          if (next.has(id)) {
            next.delete(id);
          } else {
            next.add(id);
          }
          return next;
        });
      } else {
        // Normal selection
        setSelectedIds(prev => {
          const next = new Set(prev);
          if (next.has(id)) {
            next.delete(id);
          } else {
            next.add(id);
          }
          return next;
        });
      }
    },
    [selectAll]
  );

  const isSelected = useCallback(
    (id: string) => {
      if (selectAll) {
        return !excludedIds.has(id);
      }
      return selectedIds.has(id);
    },
    [selectAll, selectedIds, excludedIds]
  );

  const getSelectedCount = useCallback(() => {
    if (selectAll) {
      return totalItems - excludedIds.size;
    }
    return selectedIds.size;
  }, [selectAll, totalItems, excludedIds, selectedIds]);

  const clearSelection = useCallback(() => {
    setSelectAll(false);
    setSelectedIds(new Set());
    setExcludedIds(new Set());
  }, []);

  const getSelectedIds = useCallback(
    (allIds: string[]) => {
      if (selectAll) {
        return allIds.filter(id => !excludedIds.has(id));
      }
      return Array.from(selectedIds);
    },
    [selectAll, selectedIds, excludedIds]
  );

  return {
    selectedIds,
    selectAll,
    excludedIds,
    toggleSelectAll,
    toggleItem,
    isSelected,
    getSelectedCount,
    clearSelection,
    getSelectedIds,
  };
}
```

---

### **2. Bulk Actions Service**

```typescript
// src/services/bulkPeopleService.ts

import { supabase } from '@/integrations/supabase/client';

export interface BulkActionResult {
  success: boolean;
  successCount: number;
  failCount: number;
  errors: Array<{ id: string; error: string }>;
}

// Bulk delete
export async function bulkDeletePeople(
  personIds: string[]
): Promise<BulkActionResult> {
  const result: BulkActionResult = {
    success: true,
    successCount: 0,
    failCount: 0,
    errors: [],
  };

  // Batch delete in chunks of 50
  const chunks = chunkArray(personIds, 50);

  for (const chunk of chunks) {
    const { error } = await supabase.from('people').delete().in('id', chunk);

    if (error) {
      result.failCount += chunk.length;
      result.errors.push(...chunk.map(id => ({ id, error: error.message })));
    } else {
      result.successCount += chunk.length;
    }
  }

  result.success = result.failCount === 0;
  return result;
}

// Bulk favourite
export async function bulkFavouritePeople(
  personIds: string[],
  isFavourite: boolean
): Promise<BulkActionResult> {
  const result: BulkActionResult = {
    success: true,
    successCount: 0,
    failCount: 0,
    errors: [],
  };

  const chunks = chunkArray(personIds, 50);

  for (const chunk of chunks) {
    const { error } = await supabase
      .from('people')
      .update({ is_favourite: isFavourite })
      .in('id', chunk);

    if (error) {
      result.failCount += chunk.length;
      result.errors.push(...chunk.map(id => ({ id, error: error.message })));
    } else {
      result.successCount += chunk.length;
    }
  }

  result.success = result.failCount === 0;
  return result;
}

// Bulk export to CSV
export async function bulkExportPeople(personIds: string[]): Promise<Blob> {
  const { data, error } = await supabase
    .from('people')
    .select(
      `
      id,
      name,
      email_address,
      company_role,
      people_stage,
      is_decision_maker,
      decision_maker_level,
      companies (
        name,
        industry,
        website
      )
    `
    )
    .in('id', personIds);

  if (error) throw error;

  // Convert to CSV
  const headers = [
    'Name',
    'Email',
    'Role',
    'Stage',
    'Decision Maker',
    'DM Level',
    'Company',
    'Industry',
    'Website',
  ];

  const rows = data.map(person => [
    person.name,
    person.email_address || '',
    person.company_role || '',
    person.people_stage,
    person.is_decision_maker ? 'Yes' : 'No',
    person.decision_maker_level || '',
    person.companies?.name || '',
    person.companies?.industry || '',
    person.companies?.website || '',
  ]);

  const csv = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n');

  return new Blob([csv], { type: 'text/csv' });
}

// Bulk sync to CRM (n8n webhook)
export async function bulkSyncToCRM(
  personIds: string[]
): Promise<BulkActionResult> {
  const result: BulkActionResult = {
    success: true,
    successCount: 0,
    failCount: 0,
    errors: [],
  };

  // Get data
  const { data: people, error } = await supabase
    .from('people')
    .select('*, companies(*)')
    .in('id', personIds);

  if (error) {
    result.success = false;
    result.failCount = personIds.length;
    return result;
  }

  // Send to n8n webhook (replace with your webhook URL)
  const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_CRM_SYNC_WEBHOOK;

  if (!N8N_WEBHOOK_URL) {
    throw new Error('N8N webhook URL not configured');
  }

  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ people }),
    });

    if (!response.ok) {
      throw new Error(`Webhook failed: ${response.status}`);
    }

    result.successCount = personIds.length;
  } catch (error) {
    result.success = false;
    result.failCount = personIds.length;
    result.errors = personIds.map(id => ({
      id,
      error: error.message,
    }));
  }

  return result;
}

// Bulk add to campaign
export async function bulkAddToCampaign(
  personIds: string[],
  campaignId: string
): Promise<BulkActionResult> {
  const result: BulkActionResult = {
    success: true,
    successCount: 0,
    failCount: 0,
    errors: [],
  };

  // Create campaign participant records
  const participants = personIds.map(personId => ({
    campaign_id: campaignId,
    person_id: personId,
  }));

  const chunks = chunkArray(participants, 50);

  for (const chunk of chunks) {
    const { error } = await supabase
      .from('campaign_participants')
      .insert(chunk);

    if (error) {
      result.failCount += chunk.length;
      result.errors.push(
        ...chunk.map((p, i) => ({
          id: chunk[i].person_id,
          error: error.message,
        }))
      );
    } else {
      result.successCount += chunk.length;
    }
  }

  result.success = result.failCount === 0;
  return result;
}

// Helper function
function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}
```

---

### **3. Floating Action Bar Component**

```typescript
// src/components/people/BulkActionBar.tsx

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Download,
  Heart,
  MoreHorizontal,
  Send,
  Trash2,
  X
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  bulkDeletePeople,
  bulkExportPeople,
  bulkFavouritePeople,
  bulkSyncToCRM,
  bulkAddToCampaign,
} from '@/services/bulkPeopleService';

interface BulkActionBarProps {
  selectedCount: number;
  selectedIds: string[];
  onClearSelection: () => void;
  onActionComplete: () => void;
}

export function BulkActionBar({
  selectedCount,
  selectedIds,
  onClearSelection,
  onActionComplete,
}: BulkActionBarProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Delete ${selectedCount} people? This cannot be undone.`)) {
      return;
    }

    setIsProcessing(true);
    try {
      const result = await bulkDeletePeople(selectedIds);

      if (result.success) {
        toast.success(`Deleted ${result.successCount} people`);
      } else {
        toast.error(`Deleted ${result.successCount}, failed ${result.failCount}`);
      }

      onActionComplete();
      onClearSelection();
    } catch (error) {
      toast.error('Failed to delete people');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFavourite = async () => {
    setIsProcessing(true);
    try {
      const result = await bulkFavouritePeople(selectedIds, true);

      if (result.success) {
        toast.success(`Added ${result.successCount} to favourites`);
      } else {
        toast.error(`Added ${result.successCount}, failed ${result.failCount}`);
      }

      onActionComplete();
      onClearSelection();
    } catch (error) {
      toast.error('Failed to favourite people');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExport = async () => {
    setIsProcessing(true);
    try {
      const blob = await bulkExportPeople(selectedIds);

      // Download file
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `people-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success(`Exported ${selectedCount} people`);
      onClearSelection();
    } catch (error) {
      toast.error('Failed to export people');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSyncToCRM = async () => {
    setIsProcessing(true);
    try {
      const result = await bulkSyncToCRM(selectedIds);

      if (result.success) {
        toast.success(`Synced ${result.successCount} people to CRM`);
      } else {
        toast.error(`Synced ${result.successCount}, failed ${result.failCount}`);
      }

      onActionComplete();
      onClearSelection();
    } catch (error) {
      toast.error('Failed to sync to CRM');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddToCampaign = async () => {
    // TODO: Show campaign selector modal
    toast.info('Campaign selector coming soon');
  };

  if (selectedCount === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
      >
        <div className="bg-gray-900 text-white rounded-full shadow-2xl px-6 py-4 flex items-center gap-4">
          {/* Selection Count */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-semibold">
              {selectedCount}
            </div>
            <span className="font-medium">
              {selectedCount === 1 ? '1 person' : `${selectedCount} people`} selected
            </span>
          </div>

          {/* Divider */}
          <div className="w-px h-6 bg-gray-700" />

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleFavourite}
              disabled={isProcessing}
              className="text-white hover:bg-gray-800"
            >
              <Heart className="h-4 w-4 mr-2" />
              Favourite
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleExport}
              disabled={isProcessing}
              className="text-white hover:bg-gray-800"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleSyncToCRM}
              disabled={isProcessing}
              className="text-white hover:bg-gray-800"
            >
              <Send className="h-4 w-4 mr-2" />
              Sync to CRM
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-gray-800"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleAddToCampaign}>
                  Add to Campaign
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClearSelection}
            className="text-white hover:bg-gray-800"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
```

---

### **4. Clickable Status Dropdowns**

```typescript
// src/components/people/StatusDropdown.tsx

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { ChevronDown } from 'lucide-react';
import { toast } from 'sonner';

interface StatusDropdownProps {
  personId: string;
  currentStatus: 'new' | 'qualified' | 'proceed' | 'skip';
  onUpdate?: () => void;
}

const STATUS_OPTIONS = [
  { value: 'new', label: 'New', color: 'bg-gray-100 text-gray-800' },
  { value: 'qualified', label: 'Qualified', color: 'bg-blue-100 text-blue-800' },
  { value: 'proceed', label: 'Proceed', color: 'bg-green-100 text-green-800' },
  { value: 'skip', label: 'Skip', color: 'bg-red-100 text-red-800' },
] as const;

export function StatusDropdown({
  personId,
  currentStatus,
  onUpdate
}: StatusDropdownProps) {
  const handleStatusChange = async (newStatus: string) => {
    try {
      const { error } = await supabase
        .from('people')
        .update({
          people_stage: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', personId);

      if (error) throw error;

      toast.success('Status updated');
      onUpdate?.();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const currentOption = STATUS_OPTIONS.find(opt => opt.value === currentStatus);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="inline-flex items-center gap-1 hover:opacity-80 transition-opacity">
          <Badge className={currentOption?.color}>
            {currentOption?.label}
          </Badge>
          <ChevronDown className="h-3 w-3 text-gray-400" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {STATUS_OPTIONS.map(option => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => handleStatusChange(option.value)}
            className={currentStatus === option.value ? 'bg-gray-50' : ''}
          >
            <Badge className={option.color}>
              {option.label}
            </Badge>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

---

### **5. Grouped Company View Component**

```typescript
// src/components/people/GroupedPeopleTable.tsx

import { Checkbox } from '@/components/ui/checkbox';
import { ChevronDown, ChevronRight, Crown } from 'lucide-react';
import { useState } from 'react';
import { StatusDropdown } from './StatusDropdown';

interface Person {
  id: string;
  name: string;
  email_address: string;
  company_role: string;
  people_stage: 'new' | 'qualified' | 'proceed' | 'skip';
  is_decision_maker: boolean;
  decision_maker_level?: string;
}

interface Company {
  id: string;
  name: string;
  industry: string;
  people: Person[];
}

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

  const toggleCompany = (companyId: string) => {
    setExpandedCompanies(prev => {
      const next = new Set(prev);
      if (next.has(companyId)) {
        next.delete(companyId);
      } else {
        next.add(companyId);
      }
      return next;
    });
  };

  return (
    <div className="space-y-2">
      {companies.map(company => {
        const isExpanded = expandedCompanies.has(company.id);
        const decisionMakers = company.people.filter(p => p.is_decision_maker);

        return (
          <div key={company.id} className="border rounded-lg overflow-hidden">
            {/* Company Header */}
            <div
              className="bg-gray-50 px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-gray-100"
              onClick={() => toggleCompany(company.id)}
            >
              <div className="flex items-center gap-3">
                <button className="p-1">
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-gray-600" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-600" />
                  )}
                </button>
                <div>
                  <h3 className="font-semibold text-gray-900">{company.name}</h3>
                  <p className="text-sm text-gray-600">
                    {company.industry} • {company.people.length} contacts
                    {decisionMakers.length > 0 && (
                      <span className="ml-2 text-amber-600 font-medium">
                        • {decisionMakers.length} decision maker{decisionMakers.length > 1 ? 's' : ''}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* People Rows */}
            {isExpanded && (
              <div className="divide-y">
                {company.people.map(person => (
                  <div
                    key={person.id}
                    className="px-4 py-3 hover:bg-gray-50 flex items-center gap-4"
                  >
                    <Checkbox
                      checked={selectedIds.has(person.id)}
                      onCheckedChange={() => onToggleItem(person.id)}
                    />

                    <div className="flex-1 grid grid-cols-4 gap-4 items-center">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{person.name}</span>
                          {person.is_decision_maker && (
                            <Crown className="h-4 w-4 text-amber-500" />
                          )}
                        </div>
                        <div className="text-sm text-gray-600">{person.email_address}</div>
                      </div>

                      <div>
                        <div className="text-sm text-gray-900">{person.company_role}</div>
                        {person.decision_maker_level && (
                          <div className="text-xs text-gray-600 capitalize">
                            {person.decision_maker_level.replace('_', ' ')}
                          </div>
                        )}
                      </div>

                      <div>
                        <StatusDropdown
                          personId={person.id}
                          currentStatus={person.people_stage}
                          onUpdate={onRefresh}
                        />
                      </div>

                      <div className="text-right">
                        {/* Actions */}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
```

---

## 📋 Implementation Checklist

### **Phase 1: Database** (5 min)

- [ ] Add `decision_maker_notes` to people table
- [ ] Verify enum values for status dropdowns

### **Phase 2: Services** (30 min)

- [ ] Create `useBulkSelection.ts` hook
- [ ] Create `bulkPeopleService.ts`
- [ ] Add n8n webhook URL to env

### **Phase 3: Components** (2 hours)

- [ ] Create `BulkActionBar.tsx`
- [ ] Create `StatusDropdown.tsx`
- [ ] Create `GroupedPeopleTable.tsx`
- [ ] Add keyboard shortcuts (⌘A, etc.)

### **Phase 4: Integration** (1 hour)

- [ ] Update People page with bulk selection
- [ ] Add floating action bar
- [ ] Test all 5 bulk operations
- [ ] Add undo support for delete

---

## 🎯 Final Recommendation

**For People Table:**

- ✅ **Grouped by Company (default)**
- ✅ **Toggle to flat view**
- ✅ **Decision maker badges**
- ✅ **Floating bulk action bar**
- ✅ **Clickable status dropdowns everywhere**

**Bulk Operations (People Only):**

1. ✅ Delete (with confirmation + undo)
2. ✅ Favourite (add/remove)
3. ✅ Export CSV
4. ✅ Sync to CRM (n8n)
5. ✅ Add to Campaign

Want me to implement any of these components?
