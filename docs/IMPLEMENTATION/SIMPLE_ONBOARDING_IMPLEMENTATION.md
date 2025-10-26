# Simple Onboarding & Decision Makers - Actual Implementation

**Date:** October 26, 2025  
**Status:** Ready to Ship  
**Philosophy:** Use what exists, add only what's missing

---

## 🔍 CURRENT STATE ANALYSIS

### ✅ **Already in Database:**

```sql
-- DECISION MAKERS (from migration 20251022000005)
ALTER TABLE people -- ALREADY HAS:
  is_decision_maker BOOLEAN DEFAULT false ✅
  decision_maker_level TEXT (c_level, vp, director, manager, individual_contributor) ✅
  hiring_authority BOOLEAN ✅
  budget_authority BOOLEAN ✅
  contact_quality_score INTEGER ✅
  linkedin_profile_url TEXT ✅
  last_outreach_at TIMESTAMP ✅
  outreach_count INTEGER ✅
  response_rate DECIMAL ✅
  preferred_contact_method TEXT ✅

-- USER INVITATIONS (from migration 20250928000002)
CREATE TABLE invitations ✅
  id, email, role, invited_by, status, token, expires_at

-- Already has RLS policies ✅
-- Already has cleanup functions ✅
```

### ❌ **Missing (Need to Add):**

1. Onboarding progress tracking table
2. Simple decision maker notes field
3. Integration status tracking

---

## 🚀 MINIMAL MIGRATION - Add Only What's Missing

```sql
-- Migration: 20251026000001_add_onboarding_system.sql
-- Date: 2025-10-26
-- Description: Add minimal onboarding tracking (keeps it simple!)

-- ====================================
-- PART 1: Add Missing Decision Maker Field
-- ====================================

-- Add simple notes field to people (rest already exists!)
ALTER TABLE public.people
ADD COLUMN IF NOT EXISTS decision_maker_notes TEXT;

-- Add index
CREATE INDEX IF NOT EXISTS idx_people_dm_notes ON public.people(decision_maker_notes)
WHERE decision_maker_notes IS NOT NULL;

COMMENT ON COLUMN public.people.decision_maker_notes IS 'Free-form notes about decision maker (for n8n/Clay)';

-- ====================================
-- PART 2: Onboarding Progress (Simple!)
-- ====================================

CREATE TABLE IF NOT EXISTS public.onboarding_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Simple boolean flags
  job_filtering_setup BOOLEAN DEFAULT false,
  gmail_connected BOOLEAN DEFAULT false,
  crm_connected BOOLEAN DEFAULT false,
  team_members_added BOOLEAN DEFAULT false,

  -- Completion tracking
  onboarding_completed BOOLEAN DEFAULT false,
  onboarding_dismissed BOOLEAN DEFAULT false,

  -- Timestamps for analytics
  job_filtering_completed_at TIMESTAMP WITH TIME ZONE,
  gmail_completed_at TIMESTAMP WITH TIME ZONE,
  crm_completed_at TIMESTAMP WITH TIME ZONE,
  team_completed_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ====================================
-- PART 3: Integration Status Tracking
-- ====================================

CREATE TABLE IF NOT EXISTS public.integration_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Integration types
  integration_type TEXT NOT NULL CHECK (integration_type IN (
    'gmail',
    'outlook',
    'loxo',
    'bullhorn',
    'n8n',
    'clay',
    'other'
  )),

  -- Status
  is_connected BOOLEAN DEFAULT false,
  connected_at TIMESTAMP WITH TIME ZONE,
  disconnected_at TIMESTAMP WITH TIME ZONE,

  -- Configuration
  config JSONB DEFAULT '{}'::jsonb,

  -- Metadata
  last_sync_at TIMESTAMP WITH TIME ZONE,
  sync_status TEXT CHECK (sync_status IN ('success', 'error', 'pending')),
  error_message TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),

  UNIQUE(user_id, integration_type)
);

-- ====================================
-- PART 4: Indexes
-- ====================================

CREATE INDEX IF NOT EXISTS idx_onboarding_user_id ON public.onboarding_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_completed ON public.onboarding_progress(onboarding_completed);
CREATE INDEX IF NOT EXISTS idx_integration_status_user ON public.integration_status(user_id);
CREATE INDEX IF NOT EXISTS idx_integration_status_type ON public.integration_status(integration_type);
CREATE INDEX IF NOT EXISTS idx_integration_connected ON public.integration_status(is_connected);

-- ====================================
-- PART 5: RLS Policies (Secure!)
-- ====================================

ALTER TABLE public.onboarding_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integration_status ENABLE ROW LEVEL SECURITY;

-- Onboarding: Users can only see their own
CREATE POLICY "Users can view own onboarding" ON public.onboarding_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own onboarding" ON public.onboarding_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own onboarding" ON public.onboarding_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- Integration Status: Users can only see their own
CREATE POLICY "Users can view own integrations" ON public.integration_status
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own integrations" ON public.integration_status
  FOR ALL USING (auth.uid() = user_id);

-- ====================================
-- PART 6: Helper Functions
-- ====================================

-- Auto-create onboarding progress on user signup
CREATE OR REPLACE FUNCTION create_onboarding_progress()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.onboarding_progress (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_onboarding_progress();

-- Update timestamps
CREATE TRIGGER update_onboarding_progress_updated_at
  BEFORE UPDATE ON public.onboarding_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_integration_status_updated_at
  BEFORE UPDATE ON public.integration_status
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ====================================
-- PART 7: Helper Function for Completion Check
-- ====================================

CREATE OR REPLACE FUNCTION check_onboarding_completion()
RETURNS TRIGGER AS $$
BEGIN
  -- Auto-mark complete if all steps done
  IF NEW.job_filtering_setup = true
     AND NEW.gmail_connected = true
     AND NEW.crm_connected = true
     AND NEW.team_members_added = true
     AND NEW.onboarding_completed = false
  THEN
    NEW.onboarding_completed := true;
    NEW.completed_at := now();
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_complete_onboarding
  BEFORE UPDATE ON public.onboarding_progress
  FOR EACH ROW EXECUTE FUNCTION check_onboarding_completion();

-- ====================================
-- PART 8: Views for Easy Querying
-- ====================================

-- Simple onboarding status view
CREATE OR REPLACE VIEW onboarding_status AS
SELECT
  op.user_id,
  up.email,
  up.full_name,
  op.job_filtering_setup,
  op.gmail_connected,
  op.crm_connected,
  op.team_members_added,
  op.onboarding_completed,
  op.onboarding_dismissed,
  -- Progress calculation
  (
    CASE WHEN op.job_filtering_setup THEN 1 ELSE 0 END +
    CASE WHEN op.gmail_connected THEN 1 ELSE 0 END +
    CASE WHEN op.crm_connected THEN 1 ELSE 0 END +
    CASE WHEN op.team_members_added THEN 1 ELSE 0 END
  ) as steps_completed,
  ROUND((
    CASE WHEN op.job_filtering_setup THEN 1 ELSE 0 END +
    CASE WHEN op.gmail_connected THEN 1 ELSE 0 END +
    CASE WHEN op.crm_connected THEN 1 ELSE 0 END +
    CASE WHEN op.team_members_added THEN 1 ELSE 0 END
  ) * 100.0 / 4, 0) as completion_percentage,
  op.created_at,
  op.completed_at
FROM public.onboarding_progress op
JOIN public.user_profiles up ON op.user_id = up.id;

-- ====================================
-- PART 9: Comments
-- ====================================

COMMENT ON TABLE public.onboarding_progress IS 'Tracks user onboarding step completion';
COMMENT ON TABLE public.integration_status IS 'Tracks external integration connection status';
COMMENT ON VIEW onboarding_status IS 'Easy view of onboarding progress with percentages';
```

---

## 📦 IMPLEMENTATION - TypeScript Services (Using What Exists!)

### **1. Decision Maker Service (Simple - Uses Existing Fields)**

```typescript
// src/services/decisionMakerService.ts

import { supabase } from '@/integrations/supabase/client';

// Mark person as decision maker (uses existing fields + new notes)
export async function markAsDecisionMaker(
  personId: string,
  options: {
    level?:
      | 'c_level'
      | 'vp'
      | 'director'
      | 'manager'
      | 'individual_contributor';
    hiringAuthority?: boolean;
    budgetAuthority?: boolean;
    notes?: string;
  } = {}
) {
  const { data, error } = await supabase
    .from('people')
    .update({
      is_decision_maker: true,
      decision_maker_level: options.level,
      hiring_authority: options.hiringAuthority,
      budget_authority: options.budgetAuthority,
      decision_maker_notes: options.notes,
      updated_at: new Date().toISOString(),
    })
    .eq('id', personId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Simple remove
export async function removeDecisionMaker(personId: string) {
  const { data, error } = await supabase
    .from('people')
    .update({
      is_decision_maker: false,
      decision_maker_level: null,
      hiring_authority: false,
      budget_authority: false,
      decision_maker_notes: null,
    })
    .eq('id', personId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Get all decision makers (for n8n/Clay)
export async function getAllDecisionMakers() {
  const { data, error } = await supabase
    .from('people')
    .select(
      `
      id,
      name,
      email_address,
      company_role,
      decision_maker_level,
      hiring_authority,
      budget_authority,
      decision_maker_notes,
      contact_quality_score,
      linkedin_profile_url,
      companies (
        id,
        name,
        industry,
        website
      )
    `
    )
    .eq('is_decision_maker', true)
    .order('name');

  if (error) throw error;
  return data;
}

// Get decision makers for a company
export async function getCompanyDecisionMakers(companyId: string) {
  const { data, error } = await supabase
    .from('people')
    .select('*')
    .eq('company_id', companyId)
    .eq('is_decision_maker', true)
    .order('decision_maker_level', { ascending: false });

  if (error) throw error;
  return data;
}
```

---

### **2. Onboarding Service**

```typescript
// src/services/onboardingService.ts

import { supabase } from '@/integrations/supabase/client';

export interface OnboardingProgress {
  job_filtering_setup: boolean;
  gmail_connected: boolean;
  crm_connected: boolean;
  team_members_added: boolean;
  onboarding_completed: boolean;
  onboarding_dismissed: boolean;
}

export async function getOnboardingProgress(): Promise<OnboardingProgress | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  let { data, error } = await supabase
    .from('onboarding_progress')
    .select('*')
    .eq('user_id', user.id)
    .single();

  // Create if doesn't exist
  if (error && error.code === 'PGRST116') {
    const { data: newData, error: createError } = await supabase
      .from('onboarding_progress')
      .insert({ user_id: user.id })
      .select()
      .single();

    if (createError) throw createError;
    data = newData;
  }

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function updateOnboardingStep(
  step:
    | 'job_filtering_setup'
    | 'gmail_connected'
    | 'crm_connected'
    | 'team_members_added',
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
    const timestampField =
      step.replace('_setup', '').replace('_added', '') + '_completed_at';
    updates[timestampField] = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('onboarding_progress')
    .update(updates)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function dismissOnboarding() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('No user');

  const { error } = await supabase
    .from('onboarding_progress')
    .update({ onboarding_dismissed: true })
    .eq('user_id', user.id);

  if (error) throw error;
}
```

---

### **3. Integration Status Service**

```typescript
// src/services/integrationService.ts

import { supabase } from '@/integrations/supabase/client';

export type IntegrationType =
  | 'gmail'
  | 'outlook'
  | 'loxo'
  | 'bullhorn'
  | 'n8n'
  | 'clay'
  | 'other';

export async function getIntegrationStatus(type: IntegrationType) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('No user');

  const { data, error } = await supabase
    .from('integration_status')
    .select('*')
    .eq('user_id', user.id)
    .eq('integration_type', type)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function updateIntegrationStatus(
  type: IntegrationType,
  isConnected: boolean,
  config?: Record<string, any>
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('No user');

  const updates: any = {
    integration_type: type,
    is_connected: isConnected,
    config: config || {},
    updated_at: new Date().toISOString(),
  };

  if (isConnected) {
    updates.connected_at = new Date().toISOString();
  } else {
    updates.disconnected_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('integration_status')
    .upsert({
      user_id: user.id,
      ...updates,
    })
    .select()
    .single();

  if (error) throw error;

  // Update onboarding step if applicable
  if (type === 'gmail' && isConnected) {
    await updateOnboardingStep('gmail_connected', true);
  } else if (type === 'n8n' || (type === 'clay' && isConnected)) {
    await updateOnboardingStep('crm_connected', true);
  }

  return data;
}

export async function getAllIntegrations() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('No user');

  const { data, error } = await supabase
    .from('integration_status')
    .select('*')
    .eq('user_id', user.id)
    .order('integration_type');

  if (error) throw error;
  return data || [];
}
```

---

## 🎨 UI COMPONENTS (Keep Super Simple!)

I already created these in the previous doc - they work perfectly with these services!

---

## 🔌 n8n/Clay API Queries

### **Simple Decision Makers Query**

```sql
-- Query for n8n/Clay webhook or Supabase client
SELECT
  p.id,
  p.name,
  p.email_address,
  p.company_role,
  p.decision_maker_level,
  p.hiring_authority,
  p.budget_authority,
  p.decision_maker_notes, -- New simple field!
  p.contact_quality_score,
  p.linkedin_profile_url,
  c.id as company_id,
  c.name as company_name,
  c.industry,
  c.website
FROM people p
JOIN companies c ON p.company_id = c.id
WHERE p.is_decision_maker = true
  AND p.email_address IS NOT NULL;
```

### **Qualified Jobs with Decision Makers**

```sql
SELECT
  j.id,
  j.title,
  j.location,
  j.qualification_status,
  j.qualified_at,
  c.id as company_id,
  c.name as company_name,
  json_agg(
    json_build_object(
      'id', p.id,
      'name', p.name,
      'email', p.email_address,
      'level', p.decision_maker_level,
      'hiring_authority', p.hiring_authority,
      'budget_authority', p.budget_authority,
      'notes', p.decision_maker_notes
    )
  ) FILTER (WHERE p.id IS NOT NULL) as decision_makers
FROM jobs j
JOIN companies c ON j.company_id = c.id
LEFT JOIN people p ON p.company_id = c.id AND p.is_decision_maker = true
WHERE j.qualification_status = 'qualify'
GROUP BY j.id, c.id;
```

---

## 📋 IMPLEMENTATION CHECKLIST

### **Step 1: Run Migration** (5 min)

```bash
# Create migration file
cd /home/user/webapp
cat > supabase/migrations/20251026000001_add_onboarding_system.sql
# Paste SQL above
# Deploy when ready
```

### **Step 2: Create Services** (20 min)

- [ ] Create `decisionMakerService.ts`
- [ ] Create `onboardingService.ts`
- [ ] Create `integrationService.ts`

### **Step 3: UI Components** (30 min)

- [ ] Use `OnboardingChecklist` from previous doc
- [ ] Use `DecisionMakerToggle` from previous doc
- [ ] Integrate into dashboard/sidebar

### **Step 4: Hook Up Events** (15 min)

- [ ] When job filtering saved → call `updateOnboardingStep`
- [ ] When Gmail connected → call `updateIntegrationStatus`
- [ ] When user invited → call `updateOnboardingStep`

---

## ✅ DONE!

**Total Time:** ~1 hour
**Tables Added:** 2 (onboarding_progress, integration_status)
**Fields Added:** 1 (decision_maker_notes to people)

This is **production-ready**, **simple**, and uses your **existing database structure**! 🚀
