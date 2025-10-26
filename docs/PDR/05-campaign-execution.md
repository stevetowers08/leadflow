# Feature PRD: Campaign Execution & Batch Email Processing

**Feature ID**: F005  
**Priority**: P2 (Medium)  
**Estimated Effort**: 16-20 hours  
**Status**: Not Started  
**Dependencies**: Gmail Reply Detection (F001), Pipeline Automation (F004)  
**Owner**: TBD  
**Sprint**: TBD

---

## Executive Summary

### Problem Statement

RecruitEdge currently supports **individual email sending** (one decision maker at a time), but lacks **campaign execution** capabilities to send batches of emails to multiple decision makers simultaneously with intelligent scheduling, personalization, and follow-up automation.

**Current Pain Points**:

- Recruiters must manually send emails one-by-one (time-consuming)
- No ability to schedule campaigns for optimal send times
- No multi-step follow-up sequences (first touch → follow-up 1 → follow-up 2)
- Cannot personalize emails at scale (must edit each one individually)
- Risk of hitting Gmail sending limits (500 emails/day per account)
- Difficult to track campaign performance (open rates, reply rates, conversion)

**Real-World Example**:

- Recruiter qualifies 50 opportunities as "ready to contact"
- Wants to send initial outreach email to all 50 decision makers
- Follow up with non-responders after 3 days
- Follow up again after 7 days if still no response
- **Current Reality**: Must manually compose and send 150 total emails (50 initial + 100 follow-ups)

### Solution Overview

Build comprehensive campaign execution system that automates batch email sending, multi-step sequences, intelligent scheduling, AI-powered personalization, and campaign performance analytics.

**Key Capabilities**:

1. **Batch Email Campaigns**: Select multiple opportunities, send to all at once
2. **Multi-Step Sequences**: Define follow-up cadence (Day 0, Day 3, Day 7)
3. **Smart Scheduling**: Distribute sends over time to respect Gmail limits
4. **AI Personalization**: Auto-personalize emails using company/job context
5. **Campaign Analytics**: Track open rates, reply rates, conversion by stage
6. **Auto-Pause on Reply**: Stop follow-ups when decision maker replies

### Success Metrics

- **Campaign Execution**: Send 1,000+ emails/week via campaigns (vs 100/week manual)
- **Personalization Rate**: 100% of campaign emails AI-personalized
- **Gmail Compliance**: 0 accounts flagged for spam (stay under 500/day)
- **Reply Rate**: Achieve 15%+ reply rate (vs 8% manual)
- **Time Saved**: Reduce email sending time by 80% (4 hours/day → 48 minutes/day)
- **Follow-Up Consistency**: 95% of non-responders receive follow-ups (vs 30% manual)

---

## Business Context

### User Stories

**Story 1: Recruiter Creates Campaign**
**As a** recruiter  
**I want** to select 50 qualified opportunities and send initial outreach emails to all  
**So that** I can reach more prospects in less time

**Acceptance Criteria**:

- ✅ Select multiple opportunities from list view (checkbox selection)
- ✅ Click "Start Campaign" button
- ✅ Choose email template (or compose custom)
- ✅ Preview AI-personalized emails for each recipient
- ✅ Set send schedule (send now, or schedule for specific time)
- ✅ Campaign queued and begins sending

**Story 2: Recruiter Configures Follow-Up Sequence**
**As a** recruiter  
**I want** to define a 3-step follow-up sequence with 3-day intervals  
**So that** non-responders receive automated follow-ups without manual work

**Acceptance Criteria**:

- ✅ Define sequence: Day 0 (initial), Day 3 (follow-up 1), Day 7 (follow-up 2)
- ✅ Choose different email template for each step
- ✅ System automatically sends follow-ups to non-responders
- ✅ Follow-ups stop if decision maker replies
- ✅ Can pause/stop campaign at any time

**Story 3: Admin Reviews Campaign Performance**
**As an** admin  
**I want** to see campaign analytics (sent, opened, replied, converted)  
**So that** I can optimize email templates and timing

**Acceptance Criteria**:

- ✅ See campaign list with performance metrics
- ✅ Click campaign to see detailed analytics
- ✅ Breakdown by sequence step (Day 0 vs Day 3 vs Day 7)
- ✅ Identify best-performing templates
- ✅ Export campaign data to CSV

### Value Proposition

**For Recruiters**:

- Send 10x more emails in same time (50 emails in 15 minutes vs 5 hours)
- Never miss follow-ups (automated sequences)
- Higher reply rates via AI personalization
- Focus on high-value activities (selling) instead of email admin

**For RecruitEdge Business**:

- 3x increase in outbound volume per recruiter
- Higher conversion rates (consistent follow-up)
- Data-driven optimization (campaign analytics)
- Competitive advantage (automation vs manual competitors)

### Business Model Impact

- **Recruiter Productivity**: Each recruiter can manage 3x more pipeline
- **Close Rate**: +25% from consistent follow-up
- **Client Satisfaction**: Professional, timely outreach builds trust
- **Platform Stickiness**: Campaign automation creates dependency

---

## Technical Architecture

### System Design

```
┌─────────────────────────────────────────────────────────────────┐
│                    Campaign Execution Flow                       │
└─────────────────────────────────────────────────────────────────┘

1. CAMPAIGN CREATION
   ┌──────────────────────────┐
   │ Frontend: Campaign       │ Recruiter configures:
   │ Builder UI               │ • Target opportunities
   └──────┬───────────────────┘ • Email templates per step
          │                     • Follow-up cadence
          │                     • Send schedule
          ▼
   ┌──────────────────────────┐
   │ INSERT campaigns table   │ Create campaign record
   │ Status: 'scheduled'      │
   └──────┬───────────────────┘
          │
          ▼
   ┌──────────────────────────┐
   │ INSERT campaign_emails   │ Create email job for each recipient
   │ Status: 'queued'         │ • One row per recipient per step
   └──────────────────────────┘ • Total: 50 opps × 3 steps = 150 jobs

2. CAMPAIGN SCHEDULER (Cron Job - Runs Every 5 Minutes)
   ┌──────────────────────────┐
   │ Supabase Edge Function   │ SELECT * FROM campaign_emails
   │ campaign-scheduler       │ WHERE status = 'queued'
   └──────┬───────────────────┘ AND scheduled_at <= NOW()
          │                     LIMIT 50 (Gmail limit protection)
          │
          ▼
   ┌──────────────────────────┐
   │ Batch Process            │ For each queued email:
   │                          │ • Check if reply received (skip if yes)
   └──────┬───────────────────┘ • Generate personalized content (AI)
          │                     • Send via Gmail API
          │                     • Update status to 'sent'
          ▼

3. EMAIL SENDING
   ┌──────────────────────────┐
   │ AI Personalization       │ Generate custom email using:
   │ (Gemini API)             │ • Company context
   └──────┬───────────────────┘ • Job description
          │                     • Decision maker profile
          ▼                     • Template + variables
   ┌──────────────────────────┐
   │ Gmail API Send           │ POST /gmail/v1/users/me/messages/send
   │                          │ • Track thread_id for replies
   └──────┬───────────────────┘ • Log to sent_emails table
          │
          ▼
   ┌──────────────────────────┐
   │ Update campaign_emails   │ UPDATE campaign_emails
   │ Status: 'sent'           │ SET status = 'sent', sent_at = NOW()
   └──────┬───────────────────┘
          │
          ▼

4. FOLLOW-UP SCHEDULING
   ┌──────────────────────────┐
   │ Campaign Follow-Up Job   │ For each 'sent' email in step 1:
   │ (Runs Daily)             │ • Check if reply received
   └──────┬───────────────────┘ • If no reply after 3 days:
          │                       CREATE campaign_email (step 2, queued)
          ▼
   ┌──────────────────────────┐
   │ Repeat for Step 2 → 3    │ Continue sequence until:
   │                          │ • All steps completed
   └──────────────────────────┘ • Or reply received (auto-pause)

5. REPLY DETECTION (Auto-Pause)
   ┌──────────────────────────┐
   │ Email Reply Received     │ Trigger: email_replies INSERT
   │                          │
   └──────┬───────────────────┘
          │
          ▼
   ┌──────────────────────────┐
   │ Cancel Future Steps      │ UPDATE campaign_emails
   │                          │ SET status = 'cancelled'
   └──────────────────────────┘ WHERE opportunity_id = X
                                AND status = 'queued'
```

### Campaign Sequence Configuration

**Example 3-Step Sequence**:

```json
{
  "campaign_id": "campaign_123",
  "steps": [
    {
      "step_number": 1,
      "delay_days": 0,
      "template_id": "template_initial_outreach",
      "subject": "Quick question about {company_name}'s hiring",
      "body_template": "Hi {first_name},\n\nI noticed {company_name} is hiring for {job_title}..."
    },
    {
      "step_number": 2,
      "delay_days": 3,
      "template_id": "template_follow_up_1",
      "subject": "Re: Quick question about {company_name}'s hiring",
      "body_template": "Hi {first_name},\n\nJust following up on my previous email..."
    },
    {
      "step_number": 3,
      "delay_days": 7,
      "template_id": "template_follow_up_2",
      "subject": "Last follow-up: {company_name} recruiting support",
      "body_template": "Hi {first_name},\n\nLast email from me! I understand you're busy..."
    }
  ]
}
```

---

## Database Schema

### New Table: `campaigns`

```sql
-- Campaign configuration and metadata
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,

  -- Campaign details
  name TEXT NOT NULL,
  description TEXT,

  -- Sequence configuration
  steps JSONB NOT NULL, -- Array of step configs (see example above)
  -- Example: [{ step_number: 1, delay_days: 0, template_id: "...", ... }]

  -- Targeting
  total_recipients INT NOT NULL, -- Count of opportunities targeted

  -- Status
  status TEXT NOT NULL DEFAULT 'draft',
  -- 'draft', 'scheduled', 'active', 'paused', 'completed', 'cancelled'

  -- Schedule
  scheduled_start_at TIMESTAMPTZ, -- When to begin sending
  completed_at TIMESTAMPTZ, -- When all emails sent

  -- Performance metrics (denormalized for quick access)
  total_sent INT DEFAULT 0,
  total_opened INT DEFAULT 0,
  total_replied INT DEFAULT 0,
  total_converted INT DEFAULT 0, -- Opportunities that progressed past 'replied'

  -- Metadata
  created_by_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_campaigns_client_id ON campaigns(client_id);
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaigns_created_at ON campaigns(created_at DESC);

-- RLS
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their client's campaigns"
  ON campaigns FOR SELECT
  USING (
    client_id IN (
      SELECT client_id FROM user_clients WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Recruiters can create campaigns"
  ON campaigns FOR INSERT
  WITH CHECK (
    client_id IN (
      SELECT client_id FROM user_clients
      WHERE user_id = auth.uid()
      AND role IN ('owner', 'admin', 'recruiter')
    )
  );

-- Trigger
CREATE TRIGGER update_campaigns_updated_at
  BEFORE UPDATE ON campaigns
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### New Table: `campaign_emails`

```sql
-- Individual email jobs within a campaign
CREATE TABLE campaign_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,

  -- Sequence step
  step_number INT NOT NULL, -- 1, 2, 3 (corresponds to campaign.steps array)

  -- Recipient
  opportunity_id UUID NOT NULL REFERENCES client_job_opportunities(id) ON DELETE CASCADE,
  decision_maker_id UUID NOT NULL REFERENCES decision_makers(id) ON DELETE CASCADE,

  -- Email content
  subject TEXT NOT NULL,
  body_html TEXT NOT NULL,
  body_plain TEXT NOT NULL,

  -- Status
  status TEXT NOT NULL DEFAULT 'queued',
  -- 'queued', 'sending', 'sent', 'failed', 'cancelled', 'skipped_replied'

  -- Schedule
  scheduled_at TIMESTAMPTZ NOT NULL, -- When to send this email
  sent_at TIMESTAMPTZ, -- When actually sent

  -- Result
  sent_email_id UUID REFERENCES sent_emails(id) ON DELETE SET NULL, -- Link to sent email record
  error_message TEXT, -- If status = 'failed'

  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_campaign_emails_campaign_id ON campaign_emails(campaign_id);
CREATE INDEX idx_campaign_emails_status ON campaign_emails(status);
CREATE INDEX idx_campaign_emails_scheduled_at ON campaign_emails(scheduled_at);
CREATE INDEX idx_campaign_emails_opportunity_id ON campaign_emails(opportunity_id);

-- RLS
ALTER TABLE campaign_emails ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their client's campaign emails"
  ON campaign_emails FOR SELECT
  USING (
    client_id IN (
      SELECT client_id FROM user_clients WHERE user_id = auth.uid()
    )
  );

-- Trigger
CREATE TRIGGER update_campaign_emails_updated_at
  BEFORE UPDATE ON campaign_emails
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### New Table: `email_templates`

```sql
-- Reusable email templates for campaigns
CREATE TABLE email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,

  -- Template details
  name TEXT NOT NULL,
  description TEXT,
  category TEXT, -- 'initial_outreach', 'follow_up', 'proposal', etc.

  -- Content
  subject_template TEXT NOT NULL, -- Can include variables: {company_name}, {job_title}
  body_template TEXT NOT NULL, -- Can include variables: {first_name}, {company_name}, etc.

  -- Variables (for documentation)
  available_variables TEXT[], -- ['first_name', 'company_name', 'job_title', etc.]

  -- Performance tracking
  total_sent INT DEFAULT 0,
  avg_open_rate DECIMAL(5,2), -- Percentage
  avg_reply_rate DECIMAL(5,2), -- Percentage

  -- Metadata
  is_default BOOLEAN DEFAULT false, -- System-provided template
  created_by_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_email_templates_client_id ON email_templates(client_id);
CREATE INDEX idx_email_templates_category ON email_templates(category);

-- RLS
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their client's templates"
  ON email_templates FOR SELECT
  USING (
    client_id IN (
      SELECT client_id FROM user_clients WHERE user_id = auth.uid()
    )
    OR is_default = true -- System templates visible to all
  );

-- Trigger
CREATE TRIGGER update_email_templates_updated_at
  BEFORE UPDATE ON email_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

---

## API Reference

### Supabase Edge Function: `campaign-scheduler`

**Purpose**: Cron job that processes queued campaign emails

**Schedule**: Runs every 5 minutes

**Implementation**:

```typescript
// supabase/functions/campaign-scheduler/index.ts

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async req => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  // 1. Get queued emails ready to send (limit 50 to stay under Gmail limit)
  const { data: queuedEmails, error } = await supabase
    .from('campaign_emails')
    .select(
      `
      *,
      campaigns (*),
      opportunities:client_job_opportunities (*),
      decision_makers (*)
    `
    )
    .eq('status', 'queued')
    .lte('scheduled_at', new Date().toISOString())
    .limit(50);

  if (error) {
    console.error('Error fetching queued emails:', error);
    return new Response('Error', { status: 500 });
  }

  console.log(`Processing ${queuedEmails.length} queued emails`);

  // 2. Process each email
  for (const email of queuedEmails) {
    try {
      // Check if decision maker already replied (skip if yes)
      const { data: reply } = await supabase
        .from('email_replies')
        .select('id')
        .eq('opportunity_id', email.opportunity_id)
        .single();

      if (reply) {
        // Skip and cancel remaining emails for this opportunity
        await supabase
          .from('campaign_emails')
          .update({ status: 'skipped_replied' })
          .eq('id', email.id);

        console.log(`Skipped email ${email.id} - reply already received`);
        continue;
      }

      // Mark as sending
      await supabase
        .from('campaign_emails')
        .update({ status: 'sending' })
        .eq('id', email.id);

      // Personalize email content using AI (if not already personalized)
      const personalizedBody = await personalizeEmail(
        email.body_plain,
        email.opportunities,
        email.decision_makers
      );

      // Send via Gmail API
      const gmailResult = await sendGmailEmail(
        email.opportunities.user_email, // Recruiter's email
        email.decision_makers.email, // Recipient
        email.subject,
        personalizedBody
      );

      // Create sent_emails record
      const { data: sentEmail } = await supabase
        .from('sent_emails')
        .insert({
          client_id: email.client_id,
          opportunity_id: email.opportunity_id,
          decision_maker_id: email.decision_maker_id,
          subject: email.subject,
          body_html: email.body_html,
          body_plain: personalizedBody,
          gmail_message_id: gmailResult.id,
          gmail_thread_id: gmailResult.threadId,
          sent_at: new Date().toISOString(),
        })
        .select()
        .single();

      // Update campaign_email status
      await supabase
        .from('campaign_emails')
        .update({
          status: 'sent',
          sent_at: new Date().toISOString(),
          sent_email_id: sentEmail.id,
        })
        .eq('id', email.id);

      // Update campaign metrics
      await supabase.rpc('increment_campaign_sent', {
        p_campaign_id: email.campaign_id,
      });

      console.log(`Sent email ${email.id} successfully`);
    } catch (error) {
      console.error(`Failed to send email ${email.id}:`, error);

      // Mark as failed
      await supabase
        .from('campaign_emails')
        .update({
          status: 'failed',
          error_message: error.message,
        })
        .eq('id', email.id);
    }
  }

  return new Response('OK', { status: 200 });
});

async function personalizeEmail(
  template: string,
  opportunity: any,
  decisionMaker: any
): Promise<string> {
  // Replace variables in template
  let personalized = template
    .replace(/{first_name}/g, decisionMaker.name.split(' ')[0])
    .replace(/{last_name}/g, decisionMaker.name.split(' ').slice(-1)[0])
    .replace(/{company_name}/g, opportunity.company_name)
    .replace(/{job_title}/g, opportunity.job_title);

  // Optionally: Call Gemini AI for advanced personalization
  // const aiEnhanced = await callGeminiAPI(personalized, opportunity)

  return personalized;
}

async function sendGmailEmail(
  from: string,
  to: string,
  subject: string,
  body: string
): Promise<{ id: string; threadId: string }> {
  // Implementation: Call Gmail API (see Gmail Reply Detection PRD)
  // Returns message ID and thread ID
}
```

### React Query Hook: `useCampaigns`

```typescript
// src/hooks/useCampaigns.ts

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useActiveClient } from './useActiveClient';

export function useCampaigns() {
  const { activeClientId } = useActiveClient();

  return useQuery({
    queryKey: ['campaigns', activeClientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('client_id', activeClientId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!activeClientId,
  });
}
```

### React Query Mutation: `useCreateCampaign`

```typescript
// src/hooks/useCreateCampaign.ts

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useActiveClient } from './useActiveClient';

export function useCreateCampaign() {
  const { activeClientId } = useActiveClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      description,
      steps,
      opportunityIds,
      scheduledStartAt,
    }: {
      name: string;
      description?: string;
      steps: any[];
      opportunityIds: string[];
      scheduledStartAt?: Date;
    }) => {
      // 1. Create campaign
      const { data: campaign, error: campaignError } = await supabase
        .from('campaigns')
        .insert({
          client_id: activeClientId,
          name,
          description,
          steps,
          total_recipients: opportunityIds.length,
          status: scheduledStartAt ? 'scheduled' : 'active',
          scheduled_start_at: scheduledStartAt?.toISOString(),
          created_by_user_id: (await supabase.auth.getUser()).data.user?.id,
        })
        .select()
        .single();

      if (campaignError) throw campaignError;

      // 2. Create campaign_emails for each opportunity × each step
      const campaignEmails = [];

      for (const opportunityId of opportunityIds) {
        // Get decision maker for this opportunity
        const { data: opp } = await supabase
          .from('client_job_opportunities')
          .select('decision_maker_id')
          .eq('id', opportunityId)
          .single();

        if (!opp?.decision_maker_id) continue;

        // Create email job for each step
        for (const step of steps) {
          const scheduledAt = new Date(scheduledStartAt || new Date());
          scheduledAt.setDate(scheduledAt.getDate() + step.delay_days);

          campaignEmails.push({
            campaign_id: campaign.id,
            client_id: activeClientId,
            step_number: step.step_number,
            opportunity_id: opportunityId,
            decision_maker_id: opp.decision_maker_id,
            subject: step.subject,
            body_html: step.body_template,
            body_plain: step.body_template,
            scheduled_at: scheduledAt.toISOString(),
          });
        }
      }

      const { error: emailsError } = await supabase
        .from('campaign_emails')
        .insert(campaignEmails);

      if (emailsError) throw emailsError;

      return campaign;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });
}
```

---

## Frontend Implementation

### Component: `CampaignBuilder`

```typescript
// src/components/CampaignBuilder.tsx

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCreateCampaign } from '@/hooks/useCreateCampaign'
import { toast } from 'sonner'

export function CampaignBuilder({ selectedOpportunityIds }: { selectedOpportunityIds: string[] }) {
  const { mutate: createCampaign, isPending } = useCreateCampaign()

  const [campaignName, setCampaignName] = useState('')
  const [steps, setSteps] = useState([
    { step_number: 1, delay_days: 0, subject: '', body_template: '' },
    { step_number: 2, delay_days: 3, subject: '', body_template: '' },
    { step_number: 3, delay_days: 7, subject: '', body_template: '' }
  ])

  const handleSubmit = () => {
    if (!campaignName) {
      toast.error('Please enter campaign name')
      return
    }

    createCampaign(
      {
        name: campaignName,
        steps,
        opportunityIds: selectedOpportunityIds
      },
      {
        onSuccess: () => {
          toast.success('Campaign created successfully!')
        },
        onError: (error) => {
          toast.error('Failed to create campaign')
          console.error(error)
        }
      }
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Create Campaign</h2>
        <p className="text-muted-foreground">
          Sending to {selectedOpportunityIds.length} decision makers
        </p>
      </div>

      {/* Campaign Name */}
      <div>
        <label className="text-sm font-medium">Campaign Name</label>
        <Input
          value={campaignName}
          onChange={(e) => setCampaignName(e.target.value)}
          placeholder="Q1 2024 Outreach"
        />
      </div>

      {/* Email Steps */}
      <div className="space-y-4">
        {steps.map((step, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>
                Step {step.step_number}: {step.delay_days === 0 ? 'Initial Email' : `Follow-up (Day ${step.delay_days})`}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium">Subject</label>
                <Input
                  value={step.subject}
                  onChange={(e) => {
                    const newSteps = [...steps]
                    newSteps[index].subject = e.target.value
                    setSteps(newSteps)
                  }}
                  placeholder="Quick question about {company_name}"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Body</label>
                <Textarea
                  value={step.body_template}
                  onChange={(e) => {
                    const newSteps = [...steps]
                    newSteps[index].body_template = e.target.value
                    setSteps(newSteps)
                  }}
                  placeholder="Hi {first_name},&#10;&#10;I noticed {company_name} is hiring..."
                  rows={6}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Available variables: {'{first_name}'}, {'{company_name}'}, {'{job_title}'}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Submit */}
      <Button onClick={handleSubmit} disabled={isPending} size="lg" className="w-full">
        {isPending ? 'Creating Campaign...' : 'Launch Campaign'}
      </Button>
    </div>
  )
}
```

---

## Testing Strategy

### Unit Tests

- ✅ Campaign creation with multiple steps
- ✅ Email scheduling calculation (delay_days)
- ✅ Template variable replacement
- ✅ Reply detection pauses follow-ups

### Integration Tests

- ✅ End-to-end: Create campaign → Send emails → Track replies
- ✅ Follow-up sequence automation
- ✅ Gmail rate limiting (stay under 500/day)
- ✅ Campaign analytics accuracy

### Performance Tests

- Campaign creation: <5 seconds for 100 recipients
- Email sending: 50 emails/5 minutes
- Campaign dashboard load: <2 seconds

---

## Rollout Plan

### Phase 1: Database & Backend (6 hours)

- [ ] Create campaigns, campaign_emails, email_templates tables
- [ ] Deploy campaign-scheduler Edge Function
- [ ] Set up cron job (every 5 minutes)

### Phase 2: Frontend UI (8 hours)

- [ ] Build CampaignBuilder component
- [ ] Build CampaignList component
- [ ] Build CampaignAnalytics component
- [ ] Integrate into opportunities page

### Phase 3: Testing & Launch (2 hours)

- [ ] Manual testing with small campaign
- [ ] Performance testing (100+ recipients)
- [ ] Production deployment

---

## Success Criteria

**Must Have (P2)**:

- ✅ Send batch emails to 50+ recipients
- ✅ 3-step follow-up sequences
- ✅ Auto-pause on reply
- ✅ Basic campaign analytics

**Should Have (P3)**:

- ✅ AI-powered email personalization
- ✅ Template library
- ✅ A/B testing different templates
- ✅ Advanced campaign analytics

---

**Document Version**: 1.0  
**Last Updated**: 2025-01-15  
**Author**: RecruitEdge Product Team  
**Status**: Ready for Implementation
