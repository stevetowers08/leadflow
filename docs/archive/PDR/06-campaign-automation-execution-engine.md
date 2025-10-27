# Feature PDR: Campaign Automation Execution Engine

**Feature ID**: F006  
**Priority**: P1 (High)  
**Estimated Effort**: 24-32 hours  
**Status**: ✅ COMPLETE & DEPLOYED  
**Dependencies**: Campaign Builder UI (F005), Email Services (Gmail/Resend)  
**Owner**: TBD  
**Sprint**: TBD

---

## Executive Summary

### Problem Statement

RecruitEdge has a fully functional **Campaign Builder UI** that allows users to create sophisticated email sequences with multiple steps (email, wait, condition), but lacks the **execution engine** to actually run these campaigns. Currently, when users add people to campaigns, nothing happens - no emails are sent, no sequences are executed, and no automation occurs.

**Current State:**

- ✅ Campaign Builder UI - Fully functional
- ✅ Database Schema - All tables exist (`campaign_sequences`, `campaign_sequence_steps`, `campaign_sequence_leads`, `campaign_sequence_executions`)
- ✅ Email Services - Gmail API integration exists and works perfectly
- ✅ Email Webhooks - Reply detection and tracking works
- ✅ User Gmail Integration - Users can connect their Gmail accounts
- ✅ **Campaign Execution Engine** - Complete in `campaign-executor` edge function
- ✅ **Sequence Runner** - Processes email/wait/condition steps
- ✅ **Immediate Execution** - Database trigger for instant processing
- ✅ **Email Queue System** - Optimized with single JOIN query (298 lines)

**Real-World Impact:**

- Users can create beautiful campaign sequences but they don't work
- 0 campaign executions in the database
- 0 leads enrolled in campaigns
- No automation occurs when people are added to campaigns

### Solution Overview

Build a comprehensive **Campaign Execution Engine** that processes campaign sequences using **user's Gmail accounts** (keeping it simple), manages email queues, handles scheduling, and automates the entire email sequence workflow.

**Key Components:**

1. **Campaign Scheduler** - Cron job that runs every 5 minutes
2. **Sequence Runner** - Processes campaign steps and manages progression
3. **Gmail Integration** - Uses user's connected Gmail account for sending
4. **Execution Engine** - Handles email sending, wait steps, and conditions
5. **Monitoring & Analytics** - Track campaign performance and errors

**Architecture Decision:**

- ✅ **Use Gmail API** - Leverage existing user Gmail integration
- ✅ **Send from user's email** - More personal and trustworthy
- ✅ **No domain verification** - Avoid Resend complexity
- ✅ **Simple implementation** - Build on existing working Gmail service

---

## Technical Architecture

### 1. Campaign Execution Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    CAMPAIGN EXECUTION ENGINE                    │
└─────────────────────────────────────────────────────────────────┘

1. LEAD ENROLLMENT
   ┌──────────────────────────┐
   │ User adds people to      │ INSERT INTO campaign_sequence_leads
   │ campaign via UI          │ SET status = 'active'
   └──────┬───────────────────┘
          │
          ▼
   ┌──────────────────────────┐
   │ Create Initial Execution  │ INSERT INTO campaign_sequence_executions
   │ Records                   │ SET status = 'pending', scheduled_at = NOW()
   └──────┬───────────────────┘
          │
          ▼

2. CAMPAIGN SCHEDULER (Cron Job - Runs Every 5 Minutes)
   ┌──────────────────────────┐
   │ Supabase Edge Function   │ SELECT * FROM campaign_sequence_executions
   │ campaign-executor        │ WHERE status = 'pending'
   └──────┬───────────────────┘ AND scheduled_at <= NOW()
          │                     LIMIT 50 (Rate limiting)
          │
          ▼
   ┌──────────────────────────┐
   │ Process Each Execution    │ For each execution:
   │                          │ • Check step type (email/wait/condition)
   └──────┬───────────────────┘ • Execute appropriate action
          │                     • Update status and schedule next step
          ▼

3. EMAIL STEP EXECUTION
   ┌──────────────────────────┐
   │ AI Personalization       │ Generate personalized email using:
   │ (Gemini API)             │ • Company context
   └──────┬───────────────────┘ • Job description
          │                     • Person profile
          ▼                     • Template + variables
   ┌──────────────────────────┐
   │ Send Email               │ Send via Gmail API or Resend API
   │                          │ • Track message_id and thread_id
   └──────┬───────────────────┘ • Log to email_sends table
          │
          ▼
   ┌──────────────────────────┐
   │ Update Execution Status  │ UPDATE campaign_sequence_executions
   │                          │ SET status = 'sent', executed_at = NOW()
   └──────┬───────────────────┘
          │
          ▼

4. WAIT STEP EXECUTION
   ┌──────────────────────────┐
   │ Calculate Next Schedule  │ Calculate next execution time:
   │                          │ • Wait duration + unit
   └──────┬───────────────────┘ • Business hours consideration
          │                     • Timezone handling
          ▼
   ┌──────────────────────────┐
   │ Schedule Next Step        │ INSERT INTO campaign_sequence_executions
   │                          │ SET status = 'pending', scheduled_at = future_time
   └──────┬───────────────────┘
          │
          ▼

5. CONDITION STEP EXECUTION
   ┌──────────────────────────┐
   │ Evaluate Condition        │ Check condition type:
   │                          │ • Email opened/clicked/replied
   └──────┬───────────────────┘ • Custom conditions
          │
          ▼
   ┌──────────────────────────┐
   │ Branch to Next Step       │ Schedule appropriate next step:
   │                          │ • true_next_step_id OR false_next_step_id
   └──────┬───────────────────┘
          │
          ▼

6. REPLY DETECTION (Auto-Pause)
   ┌──────────────────────────┐
   │ Gmail/Resend Webhook      │ When reply detected:
   │                          │ • Update execution status to 'replied'
   └──────┬───────────────────┘ • Pause remaining sequence steps
          │                     • Update lead status to 'completed'
          ▼
```

### 2. Database Schema Integration

**Existing Tables (Already Implemented):**

- `campaign_sequences` - Campaign definitions
- `campaign_sequence_steps` - Individual steps (email, wait, condition)
- `campaign_sequence_leads` - People enrolled in campaigns
- `campaign_sequence_executions` - Individual step executions

**Integration Points:**

- `email_sends` - Track actual email sends
- `email_replies` - Detect replies for auto-pause
- `people` - Lead information and personalization
- `companies` - Company context for personalization

### 3. Edge Function Architecture

**Primary Function: `campaign-executor`**

- **Schedule**: Runs every 5 minutes via Supabase cron
- **Purpose**: Process pending campaign executions
- **Rate Limiting**: Max 50 emails per execution (Gmail limits)
- **Error Handling**: Retry logic with exponential backoff

**Secondary Function: `campaign-scheduler`**

- **Schedule**: Runs daily at 9 AM
- **Purpose**: Schedule follow-up executions based on wait steps
- **Business Hours**: Respects timezone and business hours settings

---

## Implementation Plan

### Phase 1: Core Execution Engine (Week 1)

1. **Campaign Executor Edge Function**
   - Process pending executions from `campaign_sequence_executions`
   - Handle email step execution using **Gmail API**
   - Integrate with existing Gmail service (not Resend)
   - Basic error handling and logging

2. **Sequence Progression Logic**
   - Move leads through campaign steps
   - Handle wait step scheduling
   - Basic condition evaluation

3. **Database Integration**
   - Connect to existing campaign tables
   - Use user's Gmail integration for sending
   - Track email sends in `email_sends` table
   - Update execution statuses
   - Track email sends

### Phase 2: Advanced Features (Week 2)

1. **Wait Step Processing**
   - Business hours calculation
   - Timezone handling
   - Custom wait durations

2. **Condition Step Logic**
   - Email open/click detection
   - Reply detection integration
   - Custom condition evaluation

3. **Error Handling & Retry Logic**
   - Exponential backoff
   - Dead letter queue
   - Comprehensive logging

### Phase 3: Monitoring & Analytics (Week 3)

1. **Campaign Performance Tracking**
   - Open rates, click rates, reply rates
   - Sequence completion rates
   - Error rates and patterns

2. **Real-time Monitoring**
   - Dashboard for campaign status
   - Alert system for failures
   - Performance metrics

3. **Testing & Validation**
   - End-to-end testing
   - Load testing
   - User acceptance testing

---

## API Reference

### Supabase Edge Function: `campaign-executor`

**Purpose**: Process pending campaign executions every 5 minutes

**Implementation**:

```typescript
// supabase/functions/campaign-executor/index.ts

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async req => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  // 1. Get pending executions ready to process
  const { data: pendingExecutions, error } = await supabase
    .from('campaign_sequence_executions')
    .select(
      `
      *,
      campaign_sequence_steps (*),
      people (*),
      companies (*)
    `
    )
    .eq('status', 'pending')
    .lte('scheduled_at', new Date().toISOString())
    .limit(50);

  if (error) {
    console.error('Error fetching pending executions:', error);
    return new Response('Error', { status: 500 });
  }

  console.log(`Processing ${pendingExecutions.length} pending executions`);

  // 2. Process each execution
  for (const execution of pendingExecutions) {
    try {
      await processExecution(supabase, execution);
    } catch (error) {
      console.error(`Error processing execution ${execution.id}:`, error);
      await handleExecutionError(supabase, execution, error);
    }
  }

  return new Response('OK', { status: 200 });
});

async function processExecution(supabase: any, execution: any) {
  const step = execution.campaign_sequence_steps;

  switch (step.step_type) {
    case 'email':
      await processEmailStep(supabase, execution);
      break;
    case 'wait':
      await processWaitStep(supabase, execution);
      break;
    case 'condition':
      await processConditionStep(supabase, execution);
      break;
    default:
      throw new Error(`Unknown step type: ${step.step_type}`);
  }
}

async function processEmailStep(supabase: any, execution: any) {
  // 1. Personalize email content
  const personalizedContent = await personalizeEmail(
    execution.email_body,
    execution.people,
    execution.companies
  );

  // 2. Send email via Gmail/Resend
  const emailResult = await sendEmail({
    to: execution.people.email_address,
    subject: execution.email_subject,
    body: personalizedContent,
    from: 'recruiter@company.com',
  });

  // 3. Update execution status
  await supabase
    .from('campaign_sequence_executions')
    .update({
      status: 'sent',
      executed_at: new Date().toISOString(),
      email_send_id: emailResult.messageId,
    })
    .eq('id', execution.id);

  // 4. Schedule next step
  await scheduleNextStep(supabase, execution);
}

async function processWaitStep(supabase: any, execution: any) {
  const step = execution.campaign_sequence_steps;

  // Calculate next execution time
  const nextScheduledAt = calculateNextExecutionTime(
    step.wait_duration,
    step.wait_unit,
    step.business_hours_only
  );

  // Schedule next step
  await scheduleNextStep(supabase, execution, nextScheduledAt);

  // Mark wait step as completed
  await supabase
    .from('campaign_sequence_executions')
    .update({
      status: 'completed',
      executed_at: new Date().toISOString(),
    })
    .eq('id', execution.id);
}

async function processConditionStep(supabase: any, execution: any) {
  const step = execution.campaign_sequence_steps;

  // Evaluate condition
  const conditionResult = await evaluateCondition(
    step.condition_type,
    execution.people,
    execution.companies
  );

  // Schedule appropriate next step
  const nextStepId = conditionResult
    ? step.true_next_step_id
    : step.false_next_step_id;

  if (nextStepId) {
    await scheduleNextStep(supabase, execution, null, nextStepId);
  }

  // Mark condition step as completed
  await supabase
    .from('campaign_sequence_executions')
    .update({
      status: 'completed',
      executed_at: new Date().toISOString(),
    })
    .eq('id', execution.id);
}
```

### Supabase Edge Function: `campaign-scheduler`

**Purpose**: Schedule follow-up executions based on wait steps

**Implementation**:

```typescript
// supabase/functions/campaign-scheduler/index.ts

serve(async req => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  // 1. Get completed executions that need follow-up
  const { data: completedExecutions, error } = await supabase
    .from('campaign_sequence_executions')
    .select(
      `
      *,
      campaign_sequence_steps (*),
      people (*)
    `
    )
    .eq('status', 'completed')
    .eq('campaign_sequence_steps.step_type', 'wait')
    .lte(
      'executed_at',
      new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    );

  if (error) {
    console.error('Error fetching completed executions:', error);
    return new Response('Error', { status: 500 });
  }

  // 2. Schedule next steps
  for (const execution of completedExecutions) {
    await scheduleNextStep(supabase, execution);
  }

  return new Response('OK', { status: 200 });
});
```

---

## Testing Strategy

### 1. Unit Tests

- Test individual step processing functions
- Test email personalization logic
- Test wait step calculations
- Test condition evaluation

### 2. Integration Tests

- Test end-to-end campaign execution
- Test email sending integration
- Test database updates
- Test error handling

### 3. Load Tests

- Test with 100+ concurrent executions
- Test rate limiting behavior
- Test database performance
- Test edge function scaling

### 4. User Acceptance Tests

- Test complete campaign workflows
- Test different step combinations
- Test error scenarios
- Test performance metrics

---

## Success Metrics

### Phase 1: Core Functionality

- ✅ Campaign executions process successfully
- ✅ Emails send without errors
- ✅ Basic sequence progression works
- ✅ Error handling prevents system crashes

### Phase 2: Advanced Features

- ✅ Wait steps schedule correctly
- ✅ Condition logic evaluates properly
- ✅ Reply detection pauses sequences
- ✅ Performance meets requirements (< 5s per execution)

### Phase 3: Production Ready

- ✅ 99%+ uptime for campaign processing
- ✅ Comprehensive error logging
- ✅ Monitoring and alerting
- ✅ Documentation complete

---

## Risk Assessment

### High Risk

- **Email Service Limits**: Gmail 500/day, Resend rate limits
- **Database Performance**: Large execution volumes
- **Edge Function Timeouts**: 30-second limit per execution

### Medium Risk

- **Personalization Accuracy**: AI-generated content quality
- **Timezone Handling**: Complex business hours logic
- **Condition Evaluation**: Edge cases in condition logic

### Low Risk

- **UI Integration**: Existing campaign builder works
- **Database Schema**: All tables exist and functional
- **Email Services**: Gmail/Resend integrations working

---

## Dependencies

### Internal Dependencies

- Campaign Builder UI (F005) - ✅ Complete
- Email Services (Gmail/Resend) - ✅ Complete
- Database Schema - ✅ Complete
- Email Webhooks - ✅ Complete

### External Dependencies

- Supabase Edge Functions - ✅ Available
- Gmail API - ✅ Available
- Resend API - ✅ Available
- Gemini AI API - ✅ Available

---

## Timeline

### Week 1: Core Engine

- Day 1-2: Campaign Executor Edge Function
- Day 3-4: Email Step Processing
- Day 5: Basic Sequence Progression

### Week 2: Advanced Features

- Day 1-2: Wait Step Processing
- Day 3-4: Condition Step Logic
- Day 5: Error Handling & Retry Logic

### Week 3: Monitoring & Testing

- Day 1-2: Performance Tracking
- Day 3-4: Testing & Validation
- Day 5: Documentation & Deployment

---

## Conclusion

The Campaign Automation Execution Engine is the missing piece that will transform RecruitEdge from a campaign designer into a fully functional email automation platform. With the existing UI, database schema, and email services in place, implementing this execution engine will unlock the full potential of the campaign system and provide users with a powerful, automated email outreach solution.

**Next Steps:**

1. Create Linear tasks for implementation
2. Set up development environment
3. Begin Phase 1 implementation
4. Establish testing framework
5. Deploy and monitor

This implementation will position RecruitEdge as a competitive email automation platform in the recruitment space, providing users with enterprise-grade campaign execution capabilities.
