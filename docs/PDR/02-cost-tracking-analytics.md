# Feature PRD: Cost Tracking & Analytics Dashboard

**Feature ID**: F002  
**Priority**: P2 (Deferred to v2)  
**Estimated Effort**: 12-16 hours  
**Status**: Partially Implemented (backend tables exist, frontend UI needed)  
**Dependencies**: Shared Intelligence (F003), n8n Integration (F006)  
**Owner**: TBD  
**Sprint**: v2 Release

**Note**: Cost tracking implementation deferred to v2. Focus on core shared intelligence functionality first.

---

## Executive Summary

### Problem Statement

RecruitEdge incurs costs for Clay enrichment ($0.50-$1.50 per company) and AI operations (job summarization, sentiment analysis). These costs are **shared across clients** via the shared intelligence model - the first client to discover a company pays full research cost, subsequent clients reuse cached data for 81% savings.

**Current Pain Points**:

- No visibility into cost allocation per client
- Cannot track ROI (cost per placement, cost per client won)
- Cannot forecast monthly spend based on usage patterns
- Cannot prove shared intelligence savings to justify pricing
- No budget alerts to prevent overspending
- Difficult to optimize cost efficiency

### Solution Overview

Build comprehensive cost tracking and analytics dashboard that provides real-time visibility into platform costs, shared intelligence savings, client-level attribution, and ROI metrics.

**Key Capabilities**:

1. **Cost Event Logging**: Track every billable operation (Clay calls, AI requests)
2. **Shared Intelligence Savings**: Calculate and display savings from cached data reuse
3. **Client-Level Attribution**: Show cost per client, cost per opportunity, cost per placement
4. **Budget Management**: Set budgets, alert thresholds, automatic spending controls
5. **ROI Analytics**: Cost per placement, cost per closed deal, platform efficiency metrics
6. **Cost Forecasting**: Predict monthly costs based on usage trends

### Success Metrics

- **Cost Visibility**: 100% of billable operations tracked in real-time
- **Attribution Accuracy**: >95% of costs correctly attributed to clients
- **Savings Calculation**: Shared intelligence savings displayed for every client
- **Budget Alerts**: Notifications sent when 80%, 90%, 100% of budget consumed
- **ROI Insights**: Cost per placement visible for all closed deals
- **User Adoption**: 100% of clients review cost dashboard weekly

---

## Business Context

### User Stories

**Story 1: Client Owner Reviews Monthly Costs**
**As a** RecruitEdge client owner  
**I want** to see my total monthly platform costs and breakdown by operation type  
**So that** I can understand what I'm paying for and optimize usage

**Acceptance Criteria**:

- ✅ See total costs for current month, previous month, YTD
- ✅ Breakdown by cost type (Clay enrichment, AI summarization, AI sentiment analysis)
- ✅ Cost per opportunity, cost per company researched
- ✅ Shared intelligence savings displayed prominently
- ✅ Export cost report as CSV for accounting

**Story 2: Admin Sets Budget Alerts**
**As an** admin  
**I want** to set monthly budget limits and alert thresholds  
**So that** I can prevent cost overruns and get notified before hitting limits

**Acceptance Criteria**:

- ✅ Set monthly budget cap (hard limit stops processing)
- ✅ Set alert thresholds (80%, 90%, 100%)
- ✅ Receive email/in-app notifications at thresholds
- ✅ Optionally pause automation when budget exceeded

**Story 3: Recruiter Sees Opportunity Research Costs**
**As a** recruiter  
**I want** to see the research cost for each opportunity before qualifying it  
**So that** I can prioritize high-value opportunities and avoid wasting budget

**Acceptance Criteria**:

- ✅ See "Research Cost" badge on each opportunity card
- ✅ See "Cached (Free)" badge for opportunities using shared intelligence
- ✅ Filter opportunities by cost (free only, <$1, <$2)
- ✅ Tooltip explains cost breakdown

**Story 4: CEO Analyzes Platform ROI**
**As a** CEO  
**I want** to see cost per placement and platform efficiency metrics  
**So that** I can justify platform investment and identify optimization opportunities

**Acceptance Criteria**:

- ✅ Cost per placement (total costs / closed deals)
- ✅ Cost per client won (research costs / new clients)
- ✅ Shared intelligence savings % (savings / total potential costs)
- ✅ Cost trends over time (monthly chart)
- ✅ Comparison vs manual research costs

### Value Proposition

**For Client Owners**:

- Understand exactly what they're paying for (no surprise bills)
- Optimize usage to reduce costs (prioritize cached opportunities)
- Justify platform ROI to leadership (cost per placement metrics)
- Budget effectively with forecasting and alerts

**For RecruitEdge Business**:

- Transparent cost model builds trust with clients
- Shared intelligence savings justify pricing model
- Cost per placement metrics prove platform value
- Budget alerts prevent overspending and improve margins
- Usage analytics inform pricing strategy

### Business Model Impact

- **Client Retention**: Transparent costs → higher trust → lower churn
- **Pricing Power**: Demonstrable savings → justify premium pricing
- **Margin Protection**: Budget controls → prevent cost overruns
- **Sales Tool**: Shared intelligence ROI → compelling demo for prospects

---

## Technical Architecture

### System Design

```
┌─────────────────────────────────────────────────────────────────┐
│                    Cost Tracking Flow                            │
└─────────────────────────────────────────────────────────────────┘

1. BILLABLE EVENT OCCURS
   ┌──────────────────────────┐
   │ Operation                │ Examples:
   │ • Clay enrichment        │ - Company research via Clay
   │ • AI summarization       │ - Job description summarization
   │ • AI sentiment analysis  │ - Reply sentiment classification
   └──────┬───────────────────┘
          │
          ▼

2. LOG COST EVENT
   ┌──────────────────────────┐
   │ Insert cost_events       │ INSERT INTO cost_events (
   │                          │   client_id,
   └──────┬───────────────────┘   operation_type,
          │                       cost_amount,
          │                       metadata)
          ▼

3. CHECK SHARED INTELLIGENCE
   ┌──────────────────────────┐
   │ Query cache              │ Is this company already researched?
   │                          │ • YES → Calculate savings
   └──────┬───────────────────┘ • NO → Full cost, mark as discoverer
          │
          ▼
   ┌──────────────────────────┐
   │ Insert savings record    │ IF cached:
   │ (if applicable)          │   INSERT INTO shared_intelligence_savings
   └──────┬───────────────────┘
          │
          ▼

4. UPDATE CLIENT TOTALS
   ┌──────────────────────────┐
   │ Aggregate costs          │ UPDATE client_cost_summary
   │                          │ SET total_costs = total_costs + cost_amount
   └──────┬───────────────────┘
          │
          ▼

5. CHECK BUDGET ALERTS
   ┌──────────────────────────┐
   │ Compare to budget        │ IF total_costs > budget_threshold:
   │                          │   • Send notification
   └──────┬───────────────────┘   • Optionally pause automation
          │
          ▼

6. REAL-TIME DASHBOARD UPDATE
   ┌──────────────────────────┐
   │ Supabase Realtime        │ Broadcast to connected clients
   │ Broadcast update         │ • Update cost widgets
   └──────────────────────────┘ • Show budget alerts
```

### Cost Event Types

| Operation Type                | Cost Per Unit | Triggered By                 | Metadata                                                 |
| ----------------------------- | ------------- | ---------------------------- | -------------------------------------------------------- |
| `clay_company_enrichment`     | $0.80         | n8n company research         | `company_id`, `clay_table_id`, `discovered_by_client_id` |
| `clay_person_enrichment`      | $0.30         | n8n decision maker discovery | `person_id`, `company_id`, `clay_table_id`               |
| `ai_job_summarization`        | $0.02         | Job qualification page       | `job_id`, `model: gemini-flash`, `tokens_used`           |
| `ai_reply_sentiment`          | $0.01         | Gmail reply received         | `reply_id`, `model: gemini-flash`, `tokens_used`         |
| `ai_outreach_personalization` | $0.03         | Email composition            | `email_id`, `model: gemini-pro`, `tokens_used`           |

### Shared Intelligence Savings Calculation

**Scenario 1: Client A discovers new company**

```
Cost Event:
- operation_type: clay_company_enrichment
- cost_amount: $0.80
- client_id: client_a
- company_id: acme_corp
- discovered_by_client_id: client_a (same as client_id)

Savings: $0.00 (full cost for discovery)
```

**Scenario 2: Client B reuses cached company data**

```
Cost Event:
- operation_type: clay_company_enrichment
- cost_amount: $0.15 (cache lookup cost)
- client_id: client_b
- company_id: acme_corp
- discovered_by_client_id: client_a (discoverer pays full cost)

Savings: $0.65 ($0.80 full cost - $0.15 cache cost)

Insert into shared_intelligence_savings:
- client_id: client_b
- company_id: acme_corp
- savings_amount: $0.65
- full_research_cost: $0.80
- actual_cost_paid: $0.15
- discovered_by_client_id: client_a
```

---

## Database Schema

### Existing Table: `cost_events` (Already Implemented ✅)

```sql
-- Logs every billable operation on the platform
CREATE TABLE cost_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,

  -- Cost details
  operation_type TEXT NOT NULL, -- 'clay_company_enrichment', 'ai_job_summarization', etc.
  cost_amount DECIMAL(10,4) NOT NULL, -- e.g., 0.8000 for $0.80
  currency TEXT NOT NULL DEFAULT 'USD',

  -- Resource attribution
  job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  person_id UUID REFERENCES people(id) ON DELETE SET NULL,
  opportunity_id UUID REFERENCES client_job_opportunities(id) ON DELETE SET NULL,

  -- Metadata
  metadata JSONB, -- Flexible storage for operation-specific data
  -- Example: { "clay_table_id": "...", "tokens_used": 1200, "model": "gemini-flash" }

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_cost_events_client_id ON cost_events(client_id);
CREATE INDEX idx_cost_events_operation_type ON cost_events(operation_type);
CREATE INDEX idx_cost_events_created_at ON cost_events(created_at DESC);
CREATE INDEX idx_cost_events_company_id ON cost_events(company_id);
CREATE INDEX idx_cost_events_job_id ON cost_events(job_id);

-- RLS
ALTER TABLE cost_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their client's cost events"
  ON cost_events FOR SELECT
  USING (
    client_id IN (
      SELECT client_id FROM user_clients WHERE user_id = auth.uid()
    )
  );

-- Service role can insert
CREATE POLICY "Service role can insert cost events"
  ON cost_events FOR INSERT
  WITH CHECK (true);
```

### Existing Table: `shared_intelligence_savings` (Already Implemented ✅)

```sql
-- Tracks cost savings when clients reuse cached company data
CREATE TABLE shared_intelligence_savings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,

  -- Shared resource
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,

  -- Savings calculation
  full_research_cost DECIMAL(10,4) NOT NULL, -- What it would have cost without cache
  actual_cost_paid DECIMAL(10,4) NOT NULL, -- What client actually paid (cache lookup)
  savings_amount DECIMAL(10,4) NOT NULL, -- full_research_cost - actual_cost_paid

  -- Attribution
  discovered_by_client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,

  -- Metadata
  cost_event_id UUID REFERENCES cost_events(id) ON DELETE CASCADE,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_savings_client_id ON shared_intelligence_savings(client_id);
CREATE INDEX idx_savings_company_id ON shared_intelligence_savings(company_id);
CREATE INDEX idx_savings_created_at ON shared_intelligence_savings(created_at DESC);

-- RLS
ALTER TABLE shared_intelligence_savings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their client's savings"
  ON shared_intelligence_savings FOR SELECT
  USING (
    client_id IN (
      SELECT client_id FROM user_clients WHERE user_id = auth.uid()
    )
  );
```

### New Table: `client_budgets` (To Be Created)

```sql
-- Client budget configuration and tracking
CREATE TABLE client_budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL UNIQUE REFERENCES clients(id) ON DELETE CASCADE,

  -- Budget settings
  monthly_budget_cap DECIMAL(10,2), -- e.g., 500.00 for $500/month
  currency TEXT NOT NULL DEFAULT 'USD',

  -- Alert thresholds (percentage of budget)
  alert_threshold_1 DECIMAL(3,2) DEFAULT 0.80, -- 80%
  alert_threshold_2 DECIMAL(3,2) DEFAULT 0.90, -- 90%
  alert_threshold_3 DECIMAL(3,2) DEFAULT 1.00, -- 100%

  -- Alert status tracking
  alert_1_triggered_at TIMESTAMPTZ,
  alert_2_triggered_at TIMESTAMPTZ,
  alert_3_triggered_at TIMESTAMPTZ,

  -- Automation control
  pause_automation_on_budget_exceeded BOOLEAN DEFAULT false,
  automation_paused_at TIMESTAMPTZ,

  -- Notification preferences
  notification_emails TEXT[], -- Array of email addresses

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_client_budgets_client_id ON client_budgets(client_id);

-- RLS
ALTER TABLE client_budgets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their client's budgets"
  ON client_budgets FOR SELECT
  USING (
    client_id IN (
      SELECT client_id FROM user_clients WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can update their client's budgets"
  ON client_budgets FOR UPDATE
  USING (
    client_id IN (
      SELECT client_id FROM user_clients
      WHERE user_id = auth.uid()
      AND role IN ('owner', 'admin')
    )
  );

-- Trigger
CREATE TRIGGER update_client_budgets_updated_at
  BEFORE UPDATE ON client_budgets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### New Materialized View: `client_cost_summary` (To Be Created)

```sql
-- Pre-aggregated cost summary for fast dashboard queries
CREATE MATERIALIZED VIEW client_cost_summary AS
SELECT
  client_id,

  -- Total costs
  SUM(cost_amount) AS total_costs_all_time,

  -- Current month
  SUM(CASE
    WHEN created_at >= date_trunc('month', CURRENT_DATE)
    THEN cost_amount
    ELSE 0
  END) AS total_costs_current_month,

  -- Previous month
  SUM(CASE
    WHEN created_at >= date_trunc('month', CURRENT_DATE - INTERVAL '1 month')
    AND created_at < date_trunc('month', CURRENT_DATE)
    THEN cost_amount
    ELSE 0
  END) AS total_costs_previous_month,

  -- Year to date
  SUM(CASE
    WHEN created_at >= date_trunc('year', CURRENT_DATE)
    THEN cost_amount
    ELSE 0
  END) AS total_costs_ytd,

  -- Breakdown by operation type (current month)
  SUM(CASE
    WHEN operation_type = 'clay_company_enrichment'
    AND created_at >= date_trunc('month', CURRENT_DATE)
    THEN cost_amount
    ELSE 0
  END) AS clay_company_costs_current_month,

  SUM(CASE
    WHEN operation_type = 'clay_person_enrichment'
    AND created_at >= date_trunc('month', CURRENT_DATE)
    THEN cost_amount
    ELSE 0
  END) AS clay_person_costs_current_month,

  SUM(CASE
    WHEN operation_type LIKE 'ai_%'
    AND created_at >= date_trunc('month', CURRENT_DATE)
    THEN cost_amount
    ELSE 0
  END) AS ai_costs_current_month,

  -- Shared intelligence savings (current month)
  COALESCE(
    (SELECT SUM(savings_amount)
     FROM shared_intelligence_savings s
     WHERE s.client_id = c.client_id
     AND s.created_at >= date_trunc('month', CURRENT_DATE)),
    0
  ) AS shared_intelligence_savings_current_month,

  -- Counts
  COUNT(*) AS total_operations,
  COUNT(DISTINCT company_id) AS unique_companies_researched,
  COUNT(DISTINCT job_id) AS unique_jobs_processed

FROM cost_events c
GROUP BY client_id;

-- Index
CREATE UNIQUE INDEX idx_client_cost_summary_client_id ON client_cost_summary(client_id);

-- Refresh strategy: Refresh every hour via cron job
-- Or: Refresh on-demand when user views dashboard
```

### Database Functions

**Function: Log Cost Event**

```sql
-- Convenience function to log cost events with automatic attribution
CREATE OR REPLACE FUNCTION log_cost_event(
  p_client_id UUID,
  p_operation_type TEXT,
  p_cost_amount DECIMAL(10,4),
  p_job_id UUID DEFAULT NULL,
  p_company_id UUID DEFAULT NULL,
  p_person_id UUID DEFAULT NULL,
  p_opportunity_id UUID DEFAULT NULL,
  p_metadata JSONB DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  v_cost_event_id UUID;
BEGIN
  -- Insert cost event
  INSERT INTO cost_events (
    client_id,
    operation_type,
    cost_amount,
    job_id,
    company_id,
    person_id,
    opportunity_id,
    metadata
  ) VALUES (
    p_client_id,
    p_operation_type,
    p_cost_amount,
    p_job_id,
    p_company_id,
    p_person_id,
    p_opportunity_id,
    p_metadata
  ) RETURNING id INTO v_cost_event_id;

  -- Check budget and trigger alerts if needed
  PERFORM check_budget_alerts(p_client_id);

  RETURN v_cost_event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Function: Check Budget Alerts**

```sql
-- Check if client has exceeded budget thresholds and send alerts
CREATE OR REPLACE FUNCTION check_budget_alerts(p_client_id UUID)
RETURNS VOID AS $$
DECLARE
  v_budget RECORD;
  v_current_spend DECIMAL(10,2);
  v_budget_percentage DECIMAL(5,2);
BEGIN
  -- Get client budget config
  SELECT * INTO v_budget
  FROM client_budgets
  WHERE client_id = p_client_id;

  IF NOT FOUND OR v_budget.monthly_budget_cap IS NULL THEN
    RETURN; -- No budget configured
  END IF;

  -- Calculate current month spend
  SELECT COALESCE(SUM(cost_amount), 0) INTO v_current_spend
  FROM cost_events
  WHERE client_id = p_client_id
  AND created_at >= date_trunc('month', CURRENT_DATE);

  -- Calculate percentage
  v_budget_percentage := (v_current_spend / v_budget.monthly_budget_cap) * 100;

  -- Check threshold 1 (80%)
  IF v_budget_percentage >= (v_budget.alert_threshold_1 * 100)
     AND v_budget.alert_1_triggered_at IS NULL THEN

    UPDATE client_budgets
    SET alert_1_triggered_at = NOW()
    WHERE client_id = p_client_id;

    -- Send notification (handled by Edge Function via webhook)
    PERFORM http_post(
      'https://[PROJECT_ID].supabase.co/functions/v1/send-budget-alert',
      jsonb_build_object(
        'client_id', p_client_id,
        'threshold', 1,
        'percentage', v_budget_percentage,
        'current_spend', v_current_spend,
        'budget_cap', v_budget.monthly_budget_cap
      )
    );
  END IF;

  -- Check threshold 2 (90%)
  IF v_budget_percentage >= (v_budget.alert_threshold_2 * 100)
     AND v_budget.alert_2_triggered_at IS NULL THEN

    UPDATE client_budgets
    SET alert_2_triggered_at = NOW()
    WHERE client_id = p_client_id;

    PERFORM http_post(
      'https://[PROJECT_ID].supabase.co/functions/v1/send-budget-alert',
      jsonb_build_object(
        'client_id', p_client_id,
        'threshold', 2,
        'percentage', v_budget_percentage,
        'current_spend', v_current_spend,
        'budget_cap', v_budget.monthly_budget_cap
      )
    );
  END IF;

  -- Check threshold 3 (100%)
  IF v_budget_percentage >= (v_budget.alert_threshold_3 * 100)
     AND v_budget.alert_3_triggered_at IS NULL THEN

    UPDATE client_budgets
    SET
      alert_3_triggered_at = NOW(),
      automation_paused_at = CASE
        WHEN pause_automation_on_budget_exceeded THEN NOW()
        ELSE NULL
      END
    WHERE client_id = p_client_id;

    PERFORM http_post(
      'https://[PROJECT_ID].supabase.co/functions/v1/send-budget-alert',
      jsonb_build_object(
        'client_id', p_client_id,
        'threshold', 3,
        'percentage', v_budget_percentage,
        'current_spend', v_current_spend,
        'budget_cap', v_budget.monthly_budget_cap,
        'automation_paused', v_budget.pause_automation_on_budget_exceeded
      )
    );
  END IF;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## API Reference

### React Query Hook: `useCostSummary`

```typescript
// src/hooks/useCostSummary.ts

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useActiveClient } from './useActiveClient';

export function useCostSummary() {
  const { activeClientId } = useActiveClient();

  return useQuery({
    queryKey: ['cost-summary', activeClientId],
    queryFn: async () => {
      // Refresh materialized view first (or use cached data)
      // await supabase.rpc('refresh_cost_summary')

      const { data, error } = await supabase
        .from('client_cost_summary')
        .select('*')
        .eq('client_id', activeClientId)
        .single();

      if (error) throw error;

      return data;
    },
    enabled: !!activeClientId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

### React Query Hook: `useCostEvents`

```typescript
// src/hooks/useCostEvents.ts

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useActiveClient } from './useActiveClient';

export function useCostEvents(filters?: {
  operationType?: string;
  dateRange?: { start: Date; end: Date };
  companyId?: string;
  jobId?: string;
}) {
  const { activeClientId } = useActiveClient();

  return useQuery({
    queryKey: ['cost-events', activeClientId, filters],
    queryFn: async () => {
      let query = supabase
        .from('cost_events')
        .select(
          `
          *,
          companies (name, website),
          jobs (title, company_name),
          people (name, title)
        `
        )
        .eq('client_id', activeClientId)
        .order('created_at', { ascending: false })
        .limit(100);

      if (filters?.operationType) {
        query = query.eq('operation_type', filters.operationType);
      }

      if (filters?.dateRange) {
        query = query
          .gte('created_at', filters.dateRange.start.toISOString())
          .lte('created_at', filters.dateRange.end.toISOString());
      }

      if (filters?.companyId) {
        query = query.eq('company_id', filters.companyId);
      }

      if (filters?.jobId) {
        query = query.eq('job_id', filters.jobId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    },
    enabled: !!activeClientId,
  });
}
```

### React Query Hook: `useClientBudget`

```typescript
// src/hooks/useClientBudget.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useActiveClient } from './useActiveClient';

export function useClientBudget() {
  const { activeClientId } = useActiveClient();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['client-budget', activeClientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('client_budgets')
        .select('*')
        .eq('client_id', activeClientId)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // Ignore "not found"
      return data;
    },
    enabled: !!activeClientId,
  });

  const updateBudget = useMutation({
    mutationFn: async (budgetConfig: {
      monthly_budget_cap?: number;
      alert_threshold_1?: number;
      alert_threshold_2?: number;
      alert_threshold_3?: number;
      pause_automation_on_budget_exceeded?: boolean;
      notification_emails?: string[];
    }) => {
      const { data, error } = await supabase
        .from('client_budgets')
        .upsert({
          client_id: activeClientId,
          ...budgetConfig,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-budget'] });
    },
  });

  return {
    budget: query.data,
    isLoading: query.isLoading,
    updateBudget,
  };
}
```

---

## Frontend Implementation

### Component: `CostDashboard`

```typescript
// src/components/CostDashboard.tsx

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, DollarSign, Sparkles } from 'lucide-react'
import { useCostSummary } from '@/hooks/useCostSummary'
import { formatCurrency } from '@/lib/utils'
import { CostBreakdownChart } from './CostBreakdownChart'
import { CostTrendChart } from './CostTrendChart'
import { BudgetProgressBar } from './BudgetProgressBar'

export function CostDashboard() {
  const { data: summary, isLoading } = useCostSummary()

  if (isLoading) {
    return <div>Loading cost data...</div>
  }

  if (!summary) {
    return <div>No cost data available</div>
  }

  const monthOverMonthChange = summary.total_costs_current_month - summary.total_costs_previous_month
  const monthOverMonthPercent = (monthOverMonthChange / summary.total_costs_previous_month) * 100

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold">Cost Analytics</h2>
        <p className="text-muted-foreground">
          Track platform costs, shared intelligence savings, and ROI metrics
        </p>
      </div>

      {/* Budget Progress */}
      <BudgetProgressBar />

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Current Month Costs */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(summary.total_costs_current_month)}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              {monthOverMonthChange > 0 ? (
                <>
                  <TrendingUp className="h-3 w-3 text-red-600" />
                  <span className="text-red-600">
                    +{formatCurrency(Math.abs(monthOverMonthChange))} ({monthOverMonthPercent.toFixed(1)}%)
                  </span>
                </>
              ) : (
                <>
                  <TrendingDown className="h-3 w-3 text-green-600" />
                  <span className="text-green-600">
                    -{formatCurrency(Math.abs(monthOverMonthChange))} ({Math.abs(monthOverMonthPercent).toFixed(1)}%)
                  </span>
                </>
              )}
              <span>vs last month</span>
            </div>
          </CardContent>
        </Card>

        {/* Shared Intelligence Savings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Savings This Month</CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(summary.shared_intelligence_savings_current_month)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              From shared intelligence
            </p>
          </CardContent>
        </Card>

        {/* Cost Per Company */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Cost Per Company</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                summary.unique_companies_researched > 0
                  ? summary.total_costs_current_month / summary.unique_companies_researched
                  : 0
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {summary.unique_companies_researched} companies researched
            </p>
          </CardContent>
        </Card>

        {/* Year to Date */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Year to Date</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(summary.total_costs_ytd)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Total platform costs in 2024
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Cost Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <CostBreakdownChart
              clayCompanyCosts={summary.clay_company_costs_current_month}
              clayPersonCosts={summary.clay_person_costs_current_month}
              aiCosts={summary.ai_costs_current_month}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cost Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <CostTrendChart />
          </CardContent>
        </Card>
      </div>

      {/* Cost Events Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Cost Events</CardTitle>
        </CardHeader>
        <CardContent>
          <CostEventsTable />
        </CardContent>
      </Card>
    </div>
  )
}
```

### Component: `BudgetProgressBar`

```typescript
// src/components/BudgetProgressBar.tsx

import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { useClientBudget } from '@/hooks/useClientBudget'
import { useCostSummary } from '@/hooks/useCostSummary'
import { formatCurrency } from '@/lib/utils'

export function BudgetProgressBar() {
  const { budget } = useClientBudget()
  const { data: summary } = useCostSummary()

  if (!budget?.monthly_budget_cap || !summary) {
    return null
  }

  const currentSpend = summary.total_costs_current_month
  const budgetCap = budget.monthly_budget_cap
  const percentage = (currentSpend / budgetCap) * 100

  const getStatusColor = () => {
    if (percentage >= 100) return 'text-red-600'
    if (percentage >= 90) return 'text-orange-600'
    if (percentage >= 80) return 'text-yellow-600'
    return 'text-green-600'
  }

  const getProgressColor = () => {
    if (percentage >= 100) return 'bg-red-600'
    if (percentage >= 90) return 'bg-orange-600'
    if (percentage >= 80) return 'bg-yellow-600'
    return 'bg-green-600'
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium">Monthly Budget</p>
              <p className="text-2xl font-bold">
                {formatCurrency(currentSpend)} <span className="text-muted-foreground">/ {formatCurrency(budgetCap)}</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              {percentage < 100 ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600" />
              )}
              <span className={`text-2xl font-bold ${getStatusColor()}`}>
                {percentage.toFixed(0)}%
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <Progress
            value={Math.min(percentage, 100)}
            className="h-3"
            indicatorClassName={getProgressColor()}
          />

          {/* Alert Messages */}
          {percentage >= 100 && (
            <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <p className="text-sm text-red-600 font-medium">
                Budget exceeded! {budget.pause_automation_on_budget_exceeded && 'Automation paused.'}
              </p>
            </div>
          )}

          {percentage >= 90 && percentage < 100 && (
            <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <p className="text-sm text-orange-600 font-medium">
                Approaching budget limit ({formatCurrency(budgetCap - currentSpend)} remaining)
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
```

### Component: `OpportunityCostBadge`

```typescript
// src/components/OpportunityCostBadge.tsx

import { Badge } from '@/components/ui/badge'
import { Sparkles, DollarSign } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { formatCurrency } from '@/lib/utils'

interface OpportunityCostBadgeProps {
  researchCost: number
  isCached: boolean
  savingsAmount?: number
}

export function OpportunityCostBadge({
  researchCost,
  isCached,
  savingsAmount
}: OpportunityCostBadgeProps) {
  if (isCached) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="secondary" className="gap-1 bg-green-50 text-green-700 hover:bg-green-100">
              <Sparkles className="h-3 w-3" />
              <span>Cached (Free)</span>
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p className="font-semibold">Shared Intelligence Savings</p>
            <p className="text-sm">This company was already researched by another client.</p>
            <p className="text-sm">You saved {formatCurrency(savingsAmount || 0)} in research costs!</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="secondary" className="gap-1">
            <DollarSign className="h-3 w-3" />
            <span>{formatCurrency(researchCost)}</span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-semibold">Research Cost</p>
          <p className="text-sm">Cost to research this company via Clay enrichment</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
```

---

## Testing Strategy

### Unit Tests

- ✅ `log_cost_event` function inserts correctly
- ✅ `check_budget_alerts` triggers at correct thresholds
- ✅ Shared intelligence savings calculation is accurate
- ✅ Materialized view aggregation matches raw data
- ✅ RLS policies enforce client isolation

### Integration Tests

- ✅ Cost event → budget alert → notification pipeline
- ✅ Realtime cost updates to dashboard
- ✅ Budget cap pause automation
- ✅ Cost export to CSV

### Performance Tests

- Query `client_cost_summary`: <100ms
- Refresh materialized view: <5 seconds
- Cost event insert: <50ms
- Dashboard initial load: <2 seconds

---

## Rollout Plan

### Phase 1: Database & Backend (4 hours)

- [ ] Create `client_budgets` table
- [ ] Create `client_cost_summary` materialized view
- [ ] Implement `log_cost_event` function
- [ ] Implement `check_budget_alerts` function
- [ ] Deploy budget alert Edge Function
- [ ] Set up cron job to refresh materialized view

### Phase 2: Frontend Components (6 hours)

- [ ] Build `CostDashboard` component
- [ ] Build `BudgetProgressBar` component
- [ ] Build `CostBreakdownChart` component
- [ ] Build `CostTrendChart` component
- [ ] Build `CostEventsTable` component
- [ ] Build `OpportunityCostBadge` component

### Phase 3: Integration (2 hours)

- [ ] Add cost badges to opportunity cards
- [ ] Add cost dashboard route
- [ ] Integrate budget alerts into notification system
- [ ] Add budget settings page (admin only)

### Phase 4: Testing & Launch (2 hours)

- [ ] Manual testing of all cost flows
- [ ] Performance testing
- [ ] User acceptance testing with beta client
- [ ] Production deployment

---

## Success Criteria

**Must Have (P1)**:

- ✅ Track 100% of billable operations in `cost_events`
- ✅ Display cost summary dashboard
- ✅ Show shared intelligence savings
- ✅ Budget alerts at 80%, 90%, 100%
- ✅ Cost badges on opportunity cards

**Should Have (P2)**:

- ✅ Cost trend charts (line chart over time)
- ✅ Cost breakdown charts (pie chart by operation type)
- ✅ Export cost report to CSV
- ✅ Budget pause automation

**Could Have (P3)**:

- ⏸️ Cost forecasting (predict month-end spend)
- ⏸️ ROI calculator (cost per placement)
- ⏸️ Cost comparison vs manual research

---

## References

- [Supabase Materialized Views](https://supabase.com/docs/guides/database/tables#materialized-views)
- [TanStack Query Mutation](https://tanstack.com/query/latest/docs/framework/react/guides/mutations)
- [Recharts Documentation](https://recharts.org/en-US/)

---

**Document Version**: 1.0  
**Last Updated**: 2025-01-15  
**Author**: RecruitEdge Product Team  
**Status**: Ready for Implementation
