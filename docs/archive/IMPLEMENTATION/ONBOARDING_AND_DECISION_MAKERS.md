# Onboarding & Decision Makers - Simple & Efficient Implementation

**Date:** October 26, 2025  
**Status:** Ready for Implementation  
**Philosophy:** Keep it simple, follow best practices, ship fast

---

## 🎯 Core Requirements

### **Onboarding Flow:**

1. Setup job filtering
2. Integrate Gmail
3. Integrate CRM (n8n/Clay handles external workflow)
4. Add users

### **Decision Makers:**

- Mark contacts as decision makers
- n8n/Clay pulls this data via API
- Keep it simple - just a flag/label

---

## 📊 Database Schema - Minimal & Efficient

### **1. Decision Makers - Simple Flag Approach** ⭐ RECOMMENDED

**Why this is better than association table:**

- ✅ **Simpler** - No joins needed
- ✅ **Faster** - Direct column access
- ✅ **Easier for n8n/Clay** - Simple boolean filter
- ✅ **Less code** - Fewer tables to maintain

```sql
-- Add to existing `people` table (SIMPLE!)
ALTER TABLE people
ADD COLUMN is_decision_maker boolean DEFAULT false,
ADD COLUMN decision_maker_role text, -- 'hiring_manager', 'vp_engineering', 'ceo'
ADD COLUMN decision_maker_notes text;

-- Index for fast queries
CREATE INDEX idx_people_decision_maker ON people(is_decision_maker) WHERE is_decision_maker = true;
```

**That's it!** No extra tables needed. ✨

---

### **2. Onboarding Checklist - Single Table**

```sql
-- Track onboarding progress per organization/account
CREATE TABLE onboarding_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Simple boolean flags
  job_filtering_setup boolean DEFAULT false,
  gmail_connected boolean DEFAULT false,
  crm_connected boolean DEFAULT false,
  team_members_added boolean DEFAULT false,

  -- Timestamps
  job_filtering_completed_at timestamp,
  gmail_completed_at timestamp,
  crm_completed_at timestamp,
  team_completed_at timestamp,

  -- Progress tracking
  onboarding_completed boolean DEFAULT false,
  onboarding_completed_at timestamp,
  onboarding_dismissed boolean DEFAULT false,

  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now(),

  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE onboarding_progress ENABLE ROW LEVEL SECURITY;

-- User can only see their own progress
CREATE POLICY "Users can view own onboarding" ON onboarding_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own onboarding" ON onboarding_progress
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own onboarding" ON onboarding_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

---

### **3. Team Invitations - Simple Table**

```sql
-- Simple user invitations
CREATE TABLE user_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  invited_by uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role text DEFAULT 'member', -- 'admin', 'member', 'viewer'
  status text DEFAULT 'pending', -- 'pending', 'accepted', 'expired'
  invitation_token text UNIQUE,
  expires_at timestamp DEFAULT (now() + interval '7 days'),
  accepted_at timestamp,
  created_at timestamp DEFAULT now(),

  UNIQUE(email, invited_by)
);

-- Enable RLS
ALTER TABLE user_invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view invitations they sent" ON user_invitations
  FOR SELECT USING (auth.uid() = invited_by);

CREATE POLICY "Users can create invitations" ON user_invitations
  FOR INSERT WITH CHECK (auth.uid() = invited_by);
```

---

## 🚀 Implementation - TypeScript Services

### **1. Decision Maker Service (Simple)**

```typescript
// src/services/decisionMakerService.ts

import { supabase } from '@/integrations/supabase/client';

export async function markAsDecisionMaker(
  personId: string,
  role?: string,
  notes?: string
) {
  const { data, error } = await supabase
    .from('people')
    .update({
      is_decision_maker: true,
      decision_maker_role: role,
      decision_maker_notes: notes,
      updated_at: new Date().toISOString(),
    })
    .eq('id', personId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function removeDecisionMaker(personId: string) {
  const { data, error } = await supabase
    .from('people')
    .update({
      is_decision_maker: false,
      decision_maker_role: null,
      decision_maker_notes: null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', personId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getDecisionMakers(companyId: string) {
  const { data, error } = await supabase
    .from('people')
    .select(
      'id, name, email_address, company_role, decision_maker_role, decision_maker_notes'
    )
    .eq('company_id', companyId)
    .eq('is_decision_maker', true)
    .order('name');

  if (error) throw error;
  return data;
}

export async function getAllDecisionMakers() {
  const { data, error } = await supabase
    .from('people')
    .select(
      `
      id,
      name,
      email_address,
      company_role,
      decision_maker_role,
      decision_maker_notes,
      companies (
        id,
        name,
        industry
      )
    `
    )
    .eq('is_decision_maker', true)
    .order('name');

  if (error) throw error;
  return data;
}
```

---

### **2. Onboarding Service (Simple)**

```typescript
// src/services/onboardingService.ts

import { supabase } from '@/integrations/supabase/client';

export interface OnboardingProgress {
  job_filtering_setup: boolean;
  gmail_connected: boolean;
  crm_connected: boolean;
  team_members_added: boolean;
  onboarding_completed: boolean;
}

export async function getOnboardingProgress(): Promise<OnboardingProgress | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('onboarding_progress')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error && error.code !== 'PGRST116') throw error;

  // Create if doesn't exist
  if (!data) {
    return await createOnboardingProgress();
  }

  return data;
}

async function createOnboardingProgress(): Promise<OnboardingProgress> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('No user');

  const { data, error } = await supabase
    .from('onboarding_progress')
    .insert({
      user_id: user.id,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateOnboardingStep(
  step: keyof OnboardingProgress,
  completed: boolean = true
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('No user');

  const updates: any = {
    [step]: completed,
    updated_at: new Date().toISOString(),
  };

  // Add timestamp if completing
  if (completed) {
    updates[`${step}_completed_at`] = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('onboarding_progress')
    .update(updates)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) throw error;

  // Check if all steps completed
  await checkOnboardingCompletion();

  return data;
}

async function checkOnboardingCompletion() {
  const progress = await getOnboardingProgress();
  if (!progress) return;

  const allCompleted =
    progress.job_filtering_setup &&
    progress.gmail_connected &&
    progress.crm_connected &&
    progress.team_members_added;

  if (allCompleted && !progress.onboarding_completed) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from('onboarding_progress')
      .update({
        onboarding_completed: true,
        onboarding_completed_at: new Date().toISOString(),
      })
      .eq('user_id', user.id);
  }
}

export async function dismissOnboarding() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('No user');

  const { error } = await supabase
    .from('onboarding_progress')
    .update({
      onboarding_dismissed: true,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', user.id);

  if (error) throw error;
}
```

---

### **3. Team Invitation Service (Simple)**

```typescript
// src/services/teamService.ts

import { supabase } from '@/integrations/supabase/client';

export async function inviteUser(email: string, role: string = 'member') {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('No user');

  // Generate invitation token
  const token = crypto.randomUUID();

  const { data, error } = await supabase
    .from('user_invitations')
    .insert({
      email,
      invited_by: user.id,
      role,
      invitation_token: token,
    })
    .select()
    .single();

  if (error) throw error;

  // Send invitation email (implement based on your email service)
  await sendInvitationEmail(email, token);

  return data;
}

export async function getInvitations() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('No user');

  const { data, error } = await supabase
    .from('user_invitations')
    .select('*')
    .eq('invited_by', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

async function sendInvitationEmail(email: string, token: string) {
  const inviteUrl = `${window.location.origin}/accept-invite?token=${token}`;

  // TODO: Implement with your email service
  console.log(`Send invitation to ${email}: ${inviteUrl}`);
}
```

---

## 🎨 UI Components - Simple & Clean

### **1. Onboarding Checklist Widget**

```typescript
// src/components/onboarding/OnboardingChecklist.tsx

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { dismissOnboarding, getOnboardingProgress } from '@/services/onboardingService';
import { Check, ChevronRight, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  route: string;
}

export function OnboardingChecklist() {
  const [progress, setProgress] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    const data = await getOnboardingProgress();
    setProgress(data);

    // Hide if completed or dismissed
    if (data?.onboarding_completed || data?.onboarding_dismissed) {
      setIsVisible(false);
    }
  };

  const handleDismiss = async () => {
    await dismissOnboarding();
    setIsVisible(false);
  };

  if (!isVisible || !progress) return null;

  const steps: OnboardingStep[] = [
    {
      id: 'job_filtering',
      title: 'Setup Job Filtering',
      description: 'Configure filters to automatically discover relevant jobs',
      completed: progress.job_filtering_setup,
      route: '/settings/job-filtering',
    },
    {
      id: 'gmail',
      title: 'Connect Gmail',
      description: 'Enable automatic reply detection and tracking',
      completed: progress.gmail_connected,
      route: '/settings/integrations',
    },
    {
      id: 'crm',
      title: 'Connect Your CRM',
      description: 'Integrate with your existing workflow',
      completed: progress.crm_connected,
      route: '/settings/integrations',
    },
    {
      id: 'team',
      title: 'Invite Team Members',
      description: 'Add your colleagues to collaborate',
      completed: progress.team_members_added,
      route: '/settings/team',
    },
  ];

  const completedCount = steps.filter(s => s.completed).length;
  const progressPercent = (completedCount / steps.length) * 100;

  return (
    <Card className="border-2 border-blue-200 bg-blue-50/50">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-3">
          <CardTitle className="text-lg">Getting Started</CardTitle>
          <Badge variant="secondary">
            {completedCount}/{steps.length} Complete
          </Badge>
        </div>
        <Button variant="ghost" size="icon" onClick={handleDismiss}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={progressPercent} className="h-2" />

        <div className="space-y-2">
          {steps.map(step => (
            <div
              key={step.id}
              className={`
                flex items-center justify-between p-3 rounded-lg border
                transition-all cursor-pointer hover:shadow-md
                ${step.completed
                  ? 'bg-green-50 border-green-200'
                  : 'bg-white border-gray-200 hover:border-blue-300'
                }
              `}
              onClick={() => !step.completed && navigate(step.route)}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`
                    w-6 h-6 rounded-full flex items-center justify-center
                    ${step.completed
                      ? 'bg-green-500'
                      : 'bg-gray-200'
                    }
                  `}
                >
                  {step.completed ? (
                    <Check className="h-4 w-4 text-white" />
                  ) : (
                    <span className="text-xs text-gray-600">
                      {steps.indexOf(step) + 1}
                    </span>
                  )}
                </div>
                <div>
                  <div className="font-medium text-sm">{step.title}</div>
                  <div className="text-xs text-gray-600">{step.description}</div>
                </div>
              </div>
              {!step.completed && (
                <ChevronRight className="h-4 w-4 text-gray-400" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
```

---

### **2. Decision Maker Toggle (Simple)**

```typescript
// src/components/people/DecisionMakerToggle.tsx

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { markAsDecisionMaker, removeDecisionMaker } from '@/services/decisionMakerService';
import { Crown } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface DecisionMakerToggleProps {
  person: {
    id: string;
    name: string;
    is_decision_maker?: boolean;
    decision_maker_role?: string;
    decision_maker_notes?: string;
  };
  onUpdate?: () => void;
}

export function DecisionMakerToggle({ person, onUpdate }: DecisionMakerToggleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [role, setRole] = useState(person.decision_maker_role || '');
  const [notes, setNotes] = useState(person.decision_maker_notes || '');
  const [isDecisionMaker, setIsDecisionMaker] = useState(person.is_decision_maker || false);

  const handleToggle = async (checked: boolean) => {
    if (checked) {
      // Open dialog to add details
      setIsOpen(true);
    } else {
      // Remove decision maker
      try {
        await removeDecisionMaker(person.id);
        setIsDecisionMaker(false);
        toast.success('Decision maker status removed');
        onUpdate?.();
      } catch (error) {
        toast.error('Failed to remove decision maker status');
      }
    }
  };

  const handleSave = async () => {
    try {
      await markAsDecisionMaker(person.id, role, notes);
      setIsDecisionMaker(true);
      setIsOpen(false);
      toast.success(`${person.name} marked as decision maker`);
      onUpdate?.();
    } catch (error) {
      toast.error('Failed to mark as decision maker');
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Switch
          checked={isDecisionMaker}
          onCheckedChange={handleToggle}
        />
        <Label className="text-sm cursor-pointer" onClick={() => handleToggle(!isDecisionMaker)}>
          Decision Maker
        </Label>
        {isDecisionMaker && (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Crown className="h-3 w-3" />
            {role || 'Decision Maker'}
          </Badge>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark as Decision Maker</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Role (Optional)</Label>
              <Input
                placeholder="e.g., Hiring Manager, VP Engineering"
                value={role}
                onChange={e => setRole(e.target.value)}
              />
            </div>

            <div>
              <Label>Notes (Optional)</Label>
              <Textarea
                placeholder="Any additional context..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={3}
              />
            </div>

            <Button onClick={handleSave} className="w-full">
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
```

---

### **3. Team Invitation Page**

```typescript
// src/pages/TeamSettings.tsx

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Page } from '@/design-system/components';
import { getInvitations, inviteUser } from '@/services/teamService';
import { updateOnboardingStep } from '@/services/onboardingService';
import { Mail, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export function TeamSettings() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('member');
  const [invitations, setInvitations] = useState<any[]>([]);

  useEffect(() => {
    loadInvitations();
  }, []);

  const loadInvitations = async () => {
    const data = await getInvitations();
    setInvitations(data || []);
  };

  const handleInvite = async () => {
    if (!email) {
      toast.error('Please enter an email address');
      return;
    }

    try {
      await inviteUser(email, role);
      toast.success(`Invitation sent to ${email}`);
      setEmail('');
      loadInvitations();

      // Mark onboarding step complete
      await updateOnboardingStep('team_members_added', true);
    } catch (error) {
      toast.error('Failed to send invitation');
    }
  };

  return (
    <Page title="Team Management" icon={Users}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Invite Team Members
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Email Address</Label>
                <Input
                  type="email"
                  placeholder="colleague@company.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
              <div>
                <Label>Role</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleInvite} className="w-full">
              Send Invitation
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Invitations</CardTitle>
          </CardHeader>
          <CardContent>
            {invitations.length === 0 ? (
              <p className="text-gray-500 text-sm">No pending invitations</p>
            ) : (
              <div className="space-y-2">
                {invitations.map(inv => (
                  <div
                    key={inv.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <div className="font-medium">{inv.email}</div>
                      <div className="text-sm text-gray-600">
                        Role: {inv.role} • Status: {inv.status}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(inv.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Page>
  );
}
```

---

## 🔌 n8n/Clay Integration - Simple API Queries

### **Get Decision Makers (n8n/Clay can query this)**

```sql
-- Query for n8n/Clay to pull decision makers
SELECT
  p.id,
  p.name,
  p.email_address,
  p.company_role,
  p.decision_maker_role,
  p.decision_maker_notes,
  c.id as company_id,
  c.name as company_name,
  c.industry,
  c.website
FROM people p
JOIN companies c ON p.company_id = c.id
WHERE p.is_decision_maker = true
  AND p.email_address IS NOT NULL;
```

### **Get Qualified Jobs with Decision Makers**

```sql
-- Query for n8n/Clay to get jobs ready for outreach
SELECT
  j.id as job_id,
  j.title as job_title,
  j.location,
  j.qualification_status,
  j.qualified_at,
  c.id as company_id,
  c.name as company_name,
  c.website,
  ARRAY_AGG(
    json_build_object(
      'name', p.name,
      'email', p.email_address,
      'role', p.decision_maker_role
    )
  ) as decision_makers
FROM jobs j
JOIN companies c ON j.company_id = c.id
LEFT JOIN people p ON p.company_id = c.id AND p.is_decision_maker = true
WHERE j.qualification_status = 'qualify'
  AND j.qualified_at >= NOW() - INTERVAL '7 days'
GROUP BY j.id, c.id;
```

---

## 📋 Implementation Checklist

### **Phase 1: Database Setup (30 min)**

- [ ] Run SQL migration to add decision maker columns to `people`
- [ ] Create `onboarding_progress` table
- [ ] Create `user_invitations` table
- [ ] Set up RLS policies
- [ ] Create indexes

### **Phase 2: Services (1 hour)**

- [ ] Create `decisionMakerService.ts`
- [ ] Create `onboardingService.ts`
- [ ] Create `teamService.ts`
- [ ] Test services in browser console

### **Phase 3: UI Components (2 hours)**

- [ ] Create `OnboardingChecklist` component
- [ ] Create `DecisionMakerToggle` component
- [ ] Create `TeamSettings` page
- [ ] Integrate components into existing pages

### **Phase 4: Integration (1 hour)**

- [ ] Add onboarding checklist to dashboard
- [ ] Add decision maker toggle to People page
- [ ] Add team settings to navigation
- [ ] Hook up onboarding step tracking

### **Phase 5: Testing (30 min)**

- [ ] Test onboarding flow
- [ ] Test decision maker marking
- [ ] Test team invitations
- [ ] Test n8n/Clay can query data

---

## 🎯 Key Design Decisions

### **Why Simple Boolean Flag vs Association Table?**

✅ **Boolean is better for your use case:**

- One person = one company (in your recruitment context)
- n8n/Clay queries are simpler
- No extra joins needed
- Faster queries
- Less code to maintain

### **Why Single Onboarding Table?**

✅ **Centralized tracking:**

- All progress in one place
- Easy to query completion percentage
- Simple to update
- No complex state management

### **Why Minimal UI?**

✅ **Best practices:**

- Progressive disclosure (show checklist, hide when done)
- Non-intrusive (can dismiss anytime)
- Clear progress indicator
- Direct navigation to tasks

---

## 🚀 Ready to Ship!

This design is:

- ✅ **Simple** - Minimal tables, straightforward logic
- ✅ **Efficient** - Fast queries, indexed columns
- ✅ **Best Practice** - Follows SaaS onboarding patterns
- ✅ **n8n/Clay Ready** - Easy API queries
- ✅ **Maintainable** - Clean code, clear structure

**Estimated Implementation Time:** 4-5 hours total

Ready to start? Let's implement this! 🚀
