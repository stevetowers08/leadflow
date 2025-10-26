# Feature PRD: Shared Intelligence & Duplicate Detection

**Feature ID**: F003  
**Priority**: P1 (High)  
**Estimated Effort**: 8-12 hours  
**Status**: Partially Implemented (database schema exists, detection logic needed)  
**Dependencies**: n8n Integration (F006), Cost Tracking (F002)  
**Owner**: TBD  
**Sprint**: TBD

---

## Executive Summary

### Problem Statement

RecruitEdge's core value proposition is **shared intelligence** - when Client A discovers a company, Clients B, C, D can reuse that research for 81% cost savings. However, the system currently lacks:

**Current Pain Points**:

- No automatic duplicate detection when n8n tries to research an already-discovered company
- Risk of duplicate research costs if two clients discover the same company simultaneously
- No visibility into which companies are already in the shared database
- Cannot showcase shared intelligence ROI to prospective clients
- Difficult to track cost attribution (who paid for discovery vs who benefited)

**Real-World Example**:

- Client A's n8n workflow discovers "Acme Corp" via job posting → Pays $0.80 for Clay enrichment
- Client B's workflow finds the same "Acme Corp" job posting 2 days later → Should pay $0.15 cache lookup instead of $0.80 full research
- Without duplicate detection → Client B pays $0.80 again (wasted $0.65)

### Solution Overview

Implement intelligent duplicate detection that checks if a company already exists in the shared database **before** triggering expensive Clay enrichment, and routes to either full research or cache lookup path.

**Key Capabilities**:

1. **Pre-Research Duplicate Check**: Query shared database before Clay enrichment
2. **Fuzzy Matching**: Match companies by domain, name, LinkedIn URL (handle variations)
3. **Cache Lookup Path**: Return existing data for 81% cost savings
4. **Cost Attribution**: Track `discovered_by_client_id` for proper billing
5. **Savings Calculator**: Display real-time savings dashboard per client
6. **Discovery Credit**: Show which client discovered each company

### Success Metrics

- **Duplicate Detection Rate**: 95% of duplicate companies detected before research
- **False Positive Rate**: <2% (incorrectly matching different companies)
- **Cost Savings**: 81% average savings on cached company lookups
- **Attribution Accuracy**: 100% of discoveries correctly attributed to discovering client
- **Response Time**: <500ms for duplicate check query

---

## Business Context

### User Story

**As a** RecruitEdge platform  
**When** a client's n8n workflow discovers a company  
**I want** to check if that company already exists in the shared database  
**So that** I can route to cache lookup path and save 81% on research costs

**Acceptance Criteria**:

- ✅ Before Clay enrichment, query companies table for existing match
- ✅ Match by company domain (primary), company name (fuzzy), LinkedIn URL
- ✅ If match found, return cached data + log savings event
- ✅ If no match, proceed with full Clay research + mark as discoverer
- ✅ Log cost event with proper attribution (`discovered_by_client_id`)

### Value Proposition

**For RecruitEdge Clients**:

- Save 81% on company research costs via shared intelligence
- Get instant access to companies already researched by others
- Contribute to network effect (your discoveries help others)
- See transparent savings metrics in dashboard

**For RecruitEdge Business**:

- **Network Effect**: Platform becomes more valuable with each client
- **Lower CAC**: Shared intelligence ROI is compelling sales demo
- **Higher Margins**: Reduce duplicate Clay API calls
- **Competitive Moat**: Unique dataset grows with client base

**ROI Example**:

```
Without Shared Intelligence (Traditional Model):
- 10 clients each discover 100 companies/month
- 1,000 total discoveries × $0.80 = $800/month platform cost
- Each client: $80/month

With Shared Intelligence (RecruitEdge Model):
- Client 1 discovers 100 companies: 100 × $0.80 = $80
- Clients 2-10 reuse 70% of those companies: 9 × 70 × $0.15 = $94.50
- New unique discoveries by Clients 2-10: 9 × 30 × $0.80 = $216
- Total: $80 + $94.50 + $216 = $390.50 (51% savings vs $800)
- Average per client: $39/month (vs $80)
```

### Business Model Impact

- **Client LTV**: Lower costs → higher ROI → longer retention
- **Viral Growth**: Clients incentivized to invite others (more shared data)
- **Pricing Power**: Demonstrate 50%+ cost savings vs traditional models
- **Margin Expansion**: Cost per client decreases as network grows

---

## Technical Architecture

### System Design

```
┌─────────────────────────────────────────────────────────────────┐
│           Shared Intelligence Flow (n8n → Supabase)             │
└─────────────────────────────────────────────────────────────────┘

1. JOB DISCOVERED BY N8N WORKFLOW
   ┌──────────────────────────┐
   │ n8n LinkedIn Scraper     │ Finds job: "Senior Engineer at Acme Corp"
   └──────┬───────────────────┘ Extract: company_name, company_domain, company_linkedin
          │
          ▼

2. DUPLICATE CHECK (Critical Step!)
   ┌──────────────────────────┐
   │ Supabase Query           │ SELECT * FROM companies
   │ Check if company exists  │ WHERE domain = 'acme.com'
   └──────┬───────────────────┘ OR linkedin_url = 'linkedin.com/company/acme'
          │                     OR similarity(name, 'Acme Corp') > 0.85
          │
          ├─── FOUND (Cache Hit) ───────────────────────────┐
          │                                                  │
          ▼                                                  ▼
   ┌──────────────────────────┐                    ┌─────────────────────┐
   │ CACHE LOOKUP PATH        │                    │ FULL RESEARCH PATH  │
   │ (81% cost savings)       │                    │ (First discovery)   │
   └──────┬───────────────────┘                    └─────────┬───────────┘
          │                                                  │
          │ Return existing company data                     │ Call Clay API
          │ Cost: $0.15 (cache lookup)                       │ Cost: $0.80 (full enrichment)
          │                                                  │
          ▼                                                  ▼
   ┌──────────────────────────┐                    ┌─────────────────────┐
   │ Log Cost Event           │                    │ Insert companies    │
   │                          │                    │ row (new discovery) │
   │ operation_type:          │                    └─────────┬───────────┘
   │   'clay_company_lookup'  │                              │
   │ cost_amount: 0.15        │                              │
   │ discovered_by_client_id: │                              ▼
   │   [original_discoverer]  │                    ┌─────────────────────┐
   └──────┬───────────────────┘                    │ Log Cost Event      │
          │                                         │                     │
          ▼                                         │ operation_type:     │
   ┌──────────────────────────┐                    │  'clay_company_enr' │
   │ Log Savings Event        │                    │ cost_amount: 0.80   │
   │                          │                    │ discovered_by: ME   │
   │ INSERT INTO              │                    └─────────────────────┘
   │ shared_intelligence_     │
   │   savings                │
   │                          │
   │ savings_amount: 0.65     │
   │ full_research_cost: 0.80 │
   │ actual_cost_paid: 0.15   │
   └──────────────────────────┘

3. RETURN DATA TO N8N
   ┌──────────────────────────┐
   │ Company record           │ • Basic info (name, domain, size, industry)
   │ + enrichment metadata    │ • Decision makers (if already discovered)
   └──────────────────────────┘ • Discovery attribution
```

### Duplicate Matching Strategy

**Matching Hierarchy** (in order of priority):

1. **Exact Domain Match** (Primary Key)

   ```sql
   SELECT * FROM companies WHERE domain = 'acme.com'
   ```

   - Most reliable matching method
   - Handles subdomains: Extract root domain using `regexp_replace(domain, '^www\.', '')`
   - Example: `www.acme.com` → `acme.com`

2. **LinkedIn URL Match** (Secondary Key)

   ```sql
   SELECT * FROM companies WHERE linkedin_url = 'https://linkedin.com/company/acme-corp'
   ```

   - Reliable for companies with LinkedIn presence
   - Normalize URLs: Remove trailing slashes, convert to lowercase
   - Handle variations: `/company/acme-corp` vs `/company/acme-corp/`

3. **Fuzzy Name Match** (Tertiary - Use with Caution)
   ```sql
   SELECT * FROM companies
   WHERE similarity(name, 'Acme Corporation') > 0.85
   ORDER BY similarity(name, 'Acme Corporation') DESC
   LIMIT 1
   ```

   - Uses PostgreSQL `pg_trgm` extension for trigram similarity
   - Threshold: 0.85 (85% similarity) to avoid false positives
   - **Warning**: Can produce false positives (e.g., "Acme Corp" vs "Acme Foods Corp")
   - **Recommendation**: Only use if domain AND LinkedIn URL are missing

### Edge Cases & Handling

**Edge Case 1: Simultaneous Discovery**

- Problem: Two clients discover same company within seconds
- Solution: Use database-level UNIQUE constraint on `domain` + conflict resolution

```sql
INSERT INTO companies (domain, name, ..., discovered_by_client_id)
VALUES ('acme.com', 'Acme Corp', ..., 'client_a_id')
ON CONFLICT (domain) DO UPDATE
SET updated_at = NOW()
RETURNING id, discovered_by_client_id;

-- If discovered_by_client_id != my_client_id, log savings
```

**Edge Case 2: Company Name Variations**

- Problem: "Acme Corp" vs "Acme Corporation" vs "Acme Inc."
- Solution: Normalize company names before fuzzy matching

```javascript
function normalizeCompanyName(name) {
  return name
    .toLowerCase()
    .replace(/\b(corp|corporation|inc|incorporated|llc|ltd|limited)\b/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .trim();
}

// "Acme Corporation" → "acme"
// "Acme Inc." → "acme"
```

**Edge Case 3: Missing Domain**

- Problem: Job post doesn't include company domain
- Solution: Fallback to LinkedIn URL match, then fuzzy name match
- **Recommendation**: Improve n8n scraper to extract domain from company website

**Edge Case 4: Acquired/Merged Companies**

- Problem: Company domain changes after acquisition
- Solution: Manual merge tool (Phase 2 feature)
- Store historical domains in `companies.metadata.previous_domains[]`

---

## Database Schema

### Updated Table: `companies`

```sql
-- Add discovered_by_client_id to track attribution
ALTER TABLE companies ADD COLUMN discovered_by_client_id UUID REFERENCES clients(id) ON DELETE SET NULL;

-- Add discovery timestamp
ALTER TABLE companies ADD COLUMN discovered_at TIMESTAMPTZ DEFAULT NOW();

-- Add unique constraint on domain (prevent duplicates)
CREATE UNIQUE INDEX idx_companies_domain_unique ON companies(LOWER(domain));

-- Add index for LinkedIn URL matching
CREATE INDEX idx_companies_linkedin_url ON companies(linkedin_url);

-- Add trigram index for fuzzy name matching (PostgreSQL pg_trgm extension)
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX idx_companies_name_trgm ON companies USING gin(name gin_trgm_ops);
```

### Database Function: `find_or_create_company`

```sql
-- Smart upsert function with duplicate detection
CREATE OR REPLACE FUNCTION find_or_create_company(
  p_client_id UUID,
  p_domain TEXT,
  p_name TEXT,
  p_linkedin_url TEXT DEFAULT NULL,
  p_enrichment_data JSONB DEFAULT NULL
) RETURNS TABLE(
  company_id UUID,
  is_cached BOOLEAN,
  discovered_by_client_id UUID,
  savings_amount DECIMAL(10,4)
) AS $$
DECLARE
  v_existing_company RECORD;
  v_company_id UUID;
  v_is_cached BOOLEAN := false;
  v_savings_amount DECIMAL(10,4) := 0;
  v_full_research_cost DECIMAL(10,4) := 0.80;
  v_cache_lookup_cost DECIMAL(10,4) := 0.15;
BEGIN
  -- Normalize domain (remove www, convert to lowercase)
  p_domain := LOWER(TRIM(regexp_replace(p_domain, '^www\.', '')));

  -- 1. Try exact domain match
  IF p_domain IS NOT NULL AND p_domain != '' THEN
    SELECT * INTO v_existing_company
    FROM companies
    WHERE LOWER(domain) = p_domain;
  END IF;

  -- 2. If no domain match, try LinkedIn URL match
  IF v_existing_company IS NULL AND p_linkedin_url IS NOT NULL THEN
    SELECT * INTO v_existing_company
    FROM companies
    WHERE linkedin_url = p_linkedin_url;
  END IF;

  -- 3. If still no match, try fuzzy name match (use with caution)
  IF v_existing_company IS NULL AND p_name IS NOT NULL THEN
    SELECT * INTO v_existing_company
    FROM companies
    WHERE similarity(name, p_name) > 0.85
    ORDER BY similarity(name, p_name) DESC
    LIMIT 1;
  END IF;

  -- CACHE HIT: Company exists
  IF v_existing_company IS NOT NULL THEN
    v_company_id := v_existing_company.id;
    v_is_cached := true;
    v_savings_amount := v_full_research_cost - v_cache_lookup_cost;

    -- Log cache lookup cost event
    INSERT INTO cost_events (
      client_id,
      operation_type,
      cost_amount,
      company_id,
      metadata
    ) VALUES (
      p_client_id,
      'clay_company_lookup',
      v_cache_lookup_cost,
      v_company_id,
      jsonb_build_object(
        'cached', true,
        'discovered_by_client_id', v_existing_company.discovered_by_client_id
      )
    );

    -- Log shared intelligence savings
    INSERT INTO shared_intelligence_savings (
      client_id,
      company_id,
      full_research_cost,
      actual_cost_paid,
      savings_amount,
      discovered_by_client_id
    ) VALUES (
      p_client_id,
      v_company_id,
      v_full_research_cost,
      v_cache_lookup_cost,
      v_savings_amount,
      v_existing_company.discovered_by_client_id
    );

  -- CACHE MISS: New company, full research needed
  ELSE
    -- Insert new company
    INSERT INTO companies (
      domain,
      name,
      linkedin_url,
      discovered_by_client_id,
      discovered_at,
      metadata
    ) VALUES (
      p_domain,
      p_name,
      p_linkedin_url,
      p_client_id,
      NOW(),
      p_enrichment_data
    )
    RETURNING id INTO v_company_id;

    -- Log full research cost event
    INSERT INTO cost_events (
      client_id,
      operation_type,
      cost_amount,
      company_id,
      metadata
    ) VALUES (
      p_client_id,
      'clay_company_enrichment',
      v_full_research_cost,
      v_company_id,
      jsonb_build_object(
        'cached', false,
        'discovered_by_client_id', p_client_id
      )
    );
  END IF;

  -- Return result
  RETURN QUERY SELECT
    v_company_id,
    v_is_cached,
    COALESCE(v_existing_company.discovered_by_client_id, p_client_id),
    v_savings_amount;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## API Reference

### n8n Workflow: Company Discovery with Duplicate Check

**n8n Node Configuration**:

```json
{
  "nodes": [
    {
      "name": "LinkedIn Job Scraper",
      "type": "n8n-nodes-base.httpRequest",
      "position": [250, 300],
      "parameters": {
        "url": "https://www.linkedin.com/jobs/search/",
        "method": "GET"
      }
    },
    {
      "name": "Extract Company Info",
      "type": "n8n-nodes-base.function",
      "position": [450, 300],
      "parameters": {
        "functionCode": "const job = $input.item.json;\nreturn {\n  company_name: job.company,\n  company_domain: extractDomain(job.company_website),\n  company_linkedin: job.company_linkedin_url,\n  job_title: job.title,\n  job_url: job.url\n};"
      }
    },
    {
      "name": "Check for Duplicate (Supabase Function)",
      "type": "n8n-nodes-base.supabase",
      "position": [650, 300],
      "parameters": {
        "operation": "executeFunction",
        "function": "find_or_create_company",
        "parameters": {
          "p_client_id": "={{ $('Get Client ID').item.json.client_id }}",
          "p_domain": "={{ $json.company_domain }}",
          "p_name": "={{ $json.company_name }}",
          "p_linkedin_url": "={{ $json.company_linkedin }}"
        }
      }
    },
    {
      "name": "If Cached",
      "type": "n8n-nodes-base.if",
      "position": [850, 300],
      "parameters": {
        "conditions": {
          "boolean": [
            {
              "value1": "={{ $json.is_cached }}",
              "value2": true
            }
          ]
        }
      }
    },
    {
      "name": "Skip Clay Enrichment (Use Cached Data)",
      "type": "n8n-nodes-base.noOp",
      "position": [1050, 200],
      "parameters": {}
    },
    {
      "name": "Call Clay API (Full Research)",
      "type": "n8n-nodes-base.httpRequest",
      "position": [1050, 400],
      "parameters": {
        "url": "https://api.clay.com/v1/enrich",
        "method": "POST",
        "body": {
          "company_domain": "={{ $json.company_domain }}"
        }
      }
    }
  ]
}
```

### React Query Hook: `useSharedIntelligence`

```typescript
// src/hooks/useSharedIntelligence.ts

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useActiveClient } from './useActiveClient';

export function useSharedIntelligence() {
  const { activeClientId } = useActiveClient();

  return useQuery({
    queryKey: ['shared-intelligence', activeClientId],
    queryFn: async () => {
      // Get total savings
      const { data: savings, error: savingsError } = await supabase
        .from('shared_intelligence_savings')
        .select('savings_amount, created_at')
        .eq('client_id', activeClientId);

      if (savingsError) throw savingsError;

      const totalSavings = savings.reduce(
        (sum, s) => sum + Number(s.savings_amount),
        0
      );
      const savingsThisMonth = savings
        .filter(
          s => new Date(s.created_at).getMonth() === new Date().getMonth()
        )
        .reduce((sum, s) => sum + Number(s.savings_amount), 0);

      // Get companies discovered by this client
      const { data: discovered, error: discoveredError } = await supabase
        .from('companies')
        .select('id, name, domain')
        .eq('discovered_by_client_id', activeClientId);

      if (discoveredError) throw discoveredError;

      // Get companies benefited from (cached lookups)
      const { data: benefited, error: benefitedError } = await supabase
        .from('shared_intelligence_savings')
        .select(
          `
          id,
          companies (
            id,
            name,
            domain,
            discovered_by_client_id
          )
        `
        )
        .eq('client_id', activeClientId);

      if (benefitedError) throw benefitedError;

      return {
        totalSavings,
        savingsThisMonth,
        companiesDiscovered: discovered.length,
        companiesBenefited: benefited.length,
        discoveredCompanies: discovered,
        benefitedCompanies: benefited,
      };
    },
    enabled: !!activeClientId,
  });
}
```

---

## Frontend Implementation

### Component: `SharedIntelligenceDashboard`

```typescript
// src/components/SharedIntelligenceDashboard.tsx

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Sparkles, TrendingUp, Users } from 'lucide-react'
import { useSharedIntelligence } from '@/hooks/useSharedIntelligence'
import { formatCurrency } from '@/lib/utils'

export function SharedIntelligenceDashboard() {
  const { data, isLoading } = useSharedIntelligence()

  if (isLoading) {
    return <div>Loading shared intelligence data...</div>
  }

  if (!data) {
    return <div>No shared intelligence data available</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Shared Intelligence</h2>
        <p className="text-muted-foreground">
          Benefit from companies researched by other clients
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Savings</CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(data.totalSavings)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              All-time savings from shared intelligence
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Companies Discovered</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.companiesDiscovered}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              You contributed to the network
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Companies Benefited</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.companiesBenefited}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Reused from other clients
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Companies Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Companies You Discovered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.discoveredCompanies.map(company => (
                <div key={company.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{company.name}</p>
                    <p className="text-sm text-muted-foreground">{company.domain}</p>
                  </div>
                  <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                    Discoverer
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Companies You Benefited From</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.benefitedCompanies.map(item => (
                <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{item.companies.name}</p>
                    <p className="text-sm text-muted-foreground">{item.companies.domain}</p>
                  </div>
                  <Badge variant="secondary" className="bg-green-50 text-green-700">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Saved
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
```

---

## Testing Strategy

### Unit Tests

- ✅ `find_or_create_company` correctly detects duplicates by domain
- ✅ `find_or_create_company` correctly detects duplicates by LinkedIn URL
- ✅ Fuzzy name matching achieves >85% accuracy
- ✅ Cost attribution is correct (discovered_by_client_id)
- ✅ Savings calculation is accurate

### Integration Tests

- ✅ n8n workflow → duplicate check → cache hit path
- ✅ n8n workflow → duplicate check → full research path
- ✅ Simultaneous discovery by two clients (race condition)
- ✅ Savings recorded in shared_intelligence_savings table

### Performance Tests

- Duplicate check query: <500ms
- Fuzzy name matching: <1 second
- Concurrent duplicate checks: Handle 10 simultaneous requests

---

## Rollout Plan

### Phase 1: Database Setup (2 hours)

- [ ] Add `discovered_by_client_id` column to companies table
- [ ] Create unique index on domain
- [ ] Enable pg_trgm extension for fuzzy matching
- [ ] Deploy `find_or_create_company` database function

### Phase 2: n8n Integration (4 hours)

- [ ] Update n8n workflows to call `find_or_create_company`
- [ ] Add conditional logic for cache hit vs full research paths
- [ ] Test duplicate detection with sample companies

### Phase 3: Frontend Dashboard (4 hours)

- [ ] Build `SharedIntelligenceDashboard` component
- [ ] Add shared intelligence route
- [ ] Display savings metrics and company lists

### Phase 4: Testing & Launch (2 hours)

- [ ] Manual testing with duplicate companies
- [ ] Performance testing
- [ ] Production deployment

---

## Success Criteria

**Must Have (P1)**:

- ✅ 95% duplicate detection rate
- ✅ <2% false positive rate
- ✅ 81% average cost savings on cached lookups
- ✅ Correct cost attribution tracking

**Should Have (P2)**:

- ✅ Shared intelligence dashboard
- ✅ Savings trends over time
- ✅ Discovery credit badges

**Could Have (P3)**:

- ⏸️ Manual company merge tool
- ⏸️ Historical domain tracking
- ⏸️ Network effect visualization

---

## References

- [PostgreSQL pg_trgm Documentation](https://www.postgresql.org/docs/current/pgtrgm.html)
- [Fuzzy String Matching in PostgreSQL](https://www.postgresql.org/docs/current/fuzzystrmatch.html)
- [Supabase Database Functions](https://supabase.com/docs/guides/database/functions)

---

**Document Version**: 1.0  
**Last Updated**: 2025-01-15  
**Author**: RecruitEdge Product Team  
**Status**: Ready for Implementation
