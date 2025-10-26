# Feature PRD: Job Filtering Settings Page

**Feature ID**: F007  
**Priority**: P1 (High)  
**Estimated Effort**: 12-16 hours  
**Status**: ⚪ Not Started  
**Dependencies**: n8n Integration (F006), Job Qualification Workflow (F001)  
**Owner**: TBD  
**Sprint**: TBD

---

## Executive Summary

### Problem Statement

Currently, RecruitEdge users receive all discovered jobs without the ability to configure filtering criteria. This leads to:

- **Information Overload**: Users see irrelevant job postings
- **Manual Filtering**: Users must manually qualify/skip jobs that don't match their criteria
- **Inefficient Workflow**: Time wasted reviewing unsuitable opportunities
- **Poor User Experience**: No personalization of job discovery

### Solution Overview

Implement a comprehensive job filtering settings page that allows users to configure automated filtering criteria for job discovery, similar to LinkedIn and Seek's advanced search filters.

**Key Capabilities**:

1. **Location-Based Filtering**: Geographic preferences and remote work options
2. **Job Title & Industry Filtering**: Include/exclude specific roles and sectors
3. **Experience Level Filtering**: Target appropriate seniority levels
4. **Company Size Filtering**: Filter by company size preferences
5. **Salary Range Filtering**: Set minimum/maximum compensation expectations
6. **Keyword Filtering**: Include/exclude specific keywords in job descriptions
7. **Date Posted Filtering**: Focus on recent job postings
8. **Multiple Configurations**: Save different filter sets for different markets

### Success Metrics

- **Relevance Improvement**: 80% of discovered jobs match user criteria (vs 30% currently)
- **Time Savings**: Reduce manual qualification time by 70%
- **User Adoption**: 90% of users configure filtering settings within first week
- **Job Discovery Efficiency**: 3x more qualified jobs per hour of review time

---

## Business Context

### User Story

**As a** recruitment agency owner  
**I want** to configure automated job filtering criteria  
**So that** I only receive job opportunities that match my target market and client needs

**Acceptance Criteria**:

- ✅ I can create multiple job discovery configurations for different markets
- ✅ I can set location preferences (cities, states, remote options)
- ✅ I can specify target job titles and exclude unwanted roles
- ✅ I can filter by company size, industry, and experience level
- ✅ I can set salary range preferences
- ✅ I can include/exclude specific keywords
- ✅ My configurations automatically filter incoming jobs
- ✅ I can edit, duplicate, or delete configurations

### Value Proposition

**For Recruitment Agencies**:

- **Targeted Discovery**: Only see jobs matching their specialization
- **Time Efficiency**: Reduce manual filtering by 70%
- **Market Segmentation**: Different configs for different client types
- **Competitive Advantage**: Faster response to relevant opportunities

**For RecruitEdge Platform**:

- **User Retention**: Personalized experience increases platform stickiness
- **Data Quality**: Better job-client matching improves success rates
- **Scalability**: Automated filtering reduces manual overhead
- **Premium Feature**: Advanced filtering can be a paid tier feature

### Business Model Impact

- **User Productivity**: 3x more qualified opportunities per hour
- **Client Satisfaction**: Better job matches improve placement success
- **Platform Differentiation**: Advanced filtering vs competitors
- **Revenue Opportunity**: Premium filtering features for enterprise clients

---

## Technical Architecture

### System Design

```
┌─────────────────────────────────────────────────────────────────┐
│              Job Filtering Settings Architecture                  │
└─────────────────────────────────────────────────────────────────┘

1. USER CONFIGURES FILTERS
   ┌──────────────────────────┐
   │ Settings Page UI          │ Location, Job Titles, Salary, etc.
   └──────┬───────────────────┘
          │
          ▼

2. FILTER CONFIGURATION STORED
   ┌──────────────────────────┐
   │ job_filter_configs table │ Store user preferences
   └──────┬───────────────────┘
          │
          ▼

3. n8n WORKFLOW INTEGRATION
   ┌──────────────────────────┐
   │ n8n Job Discovery        │ Apply filters during scraping
   │ Workflow                 │ • LinkedIn scraper
   └──────┬───────────────────┘ • Indeed scraper
          │                     • Apply user filters
          ▼

4. FILTERED JOBS INSERTED
   ┌──────────────────────────┐
   │ Supabase Database        │ Only matching jobs stored
   │ jobs table               │ • Pre-filtered results
   └──────┬───────────────────┘ • Reduced noise
          │
          ▼

5. USER SEES RELEVANT JOBS
   ┌──────────────────────────┐
   │ RecruitEdge Frontend     │ Dashboard shows filtered jobs
   │ Job Qualification UI     │ • Higher relevance
   └──────────────────────────┘ • Faster qualification
```

### Database Schema

#### New Table: `job_filter_configs`

```sql
-- User-defined job filtering configurations
CREATE TABLE job_filter_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Configuration metadata
  config_name TEXT NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('linkedin', 'indeed', 'seek')),
  is_active BOOLEAN DEFAULT true,

  -- Location filtering
  primary_location TEXT,
  search_radius INTEGER DEFAULT 25, -- miles/km
  remote_options TEXT[] DEFAULT '{}', -- ['remote', 'hybrid', 'onsite']

  -- Job criteria
  target_job_titles TEXT[] DEFAULT '{}',
  excluded_job_titles TEXT[] DEFAULT '{}',
  seniority_levels TEXT[] DEFAULT '{}', -- ['entry', 'mid', 'senior', 'executive']
  work_arrangements TEXT[] DEFAULT '{}', -- ['full_time', 'part_time', 'contract']

  -- Company filtering
  company_size_preferences TEXT[] DEFAULT '{}', -- ['startup', 'small', 'medium', 'large']
  included_industries TEXT[] DEFAULT '{}',
  excluded_industries TEXT[] DEFAULT '{}',
  included_companies TEXT[] DEFAULT '{}',
  excluded_companies TEXT[] DEFAULT '{}',

  -- Compensation filtering
  min_salary INTEGER,
  max_salary INTEGER,
  salary_currency TEXT DEFAULT 'USD',

  -- Keyword filtering
  required_keywords TEXT[] DEFAULT '{}',
  excluded_keywords TEXT[] DEFAULT '{}',

  -- Time filtering
  max_days_old INTEGER DEFAULT 7, -- Only jobs posted within X days

  -- Advanced options
  easy_apply_only BOOLEAN DEFAULT false,
  verified_companies_only BOOLEAN DEFAULT false,

  -- Additional filtering options from screenshot
  job_functions TEXT[] DEFAULT '{}', -- ['engineering', 'marketing', 'sales', 'finance', 'hr']
  experience_levels TEXT[] DEFAULT '{}', -- ['entry', 'associate', 'mid-senior', 'director', 'executive']
  company_types TEXT[] DEFAULT '{}', -- ['public', 'private', 'nonprofit', 'government']
  benefits TEXT[] DEFAULT '{}', -- ['health_insurance', 'dental', 'vision', '401k', 'pto']
  languages TEXT[] DEFAULT '{}', -- ['english', 'spanish', 'french', 'german', 'mandarin']
  certifications TEXT[] DEFAULT '{}', -- ['pmp', 'aws', 'google_cloud', 'salesforce']
  education_levels TEXT[] DEFAULT '{}', -- ['high_school', 'associates', 'bachelors', 'masters', 'phd']
  visa_sponsorship BOOLEAN DEFAULT false,
  equity_offered BOOLEAN DEFAULT false,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Constraints
  UNIQUE(client_id, config_name)
);

-- Indexes
CREATE INDEX idx_job_filter_configs_client_id ON job_filter_configs(client_id);
CREATE INDEX idx_job_filter_configs_user_id ON job_filter_configs(user_id);
CREATE INDEX idx_job_filter_configs_active ON job_filter_configs(is_active) WHERE is_active = true;

-- RLS
ALTER TABLE job_filter_configs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their client's filter configs"
  ON job_filter_configs FOR ALL
  USING (
    client_id IN (
      SELECT client_id FROM client_users WHERE user_id = auth.uid()
    )
  );
```

#### Updated Table: `jobs`

```sql
-- Add fields to track filtering
ALTER TABLE jobs ADD COLUMN filter_config_id UUID REFERENCES job_filter_configs(id);
ALTER TABLE jobs ADD COLUMN match_score DECIMAL(3,2); -- 0.00 to 1.00
ALTER TABLE jobs ADD COLUMN filter_reason TEXT; -- Why this job matched
```

### n8n Workflow Integration

#### Enhanced Job Discovery Workflow

```javascript
// n8n workflow node: Apply User Filters
const applyUserFilters = (jobData, filterConfig) => {
  const matches = [];

  // Location filtering
  if (filterConfig.primary_location) {
    const locationMatch = checkLocationMatch(
      jobData.location,
      filterConfig.primary_location,
      filterConfig.search_radius
    );
    if (!locationMatch) return null;
  }

  // Job title filtering
  if (filterConfig.target_job_titles.length > 0) {
    const titleMatch = filterConfig.target_job_titles.some(title =>
      jobData.title.toLowerCase().includes(title.toLowerCase())
    );
    if (!titleMatch) return null;
  }

  // Excluded titles
  if (filterConfig.excluded_job_titles.length > 0) {
    const excludedMatch = filterConfig.excluded_job_titles.some(title =>
      jobData.title.toLowerCase().includes(title.toLowerCase())
    );
    if (excludedMatch) return null;
  }

  // Salary filtering
  if (filterConfig.min_salary && jobData.salary) {
    if (parseInt(jobData.salary) < filterConfig.min_salary) return null;
  }

  // Keyword filtering
  if (filterConfig.required_keywords.length > 0) {
    const keywordMatch = filterConfig.required_keywords.every(keyword =>
      jobData.description.toLowerCase().includes(keyword.toLowerCase())
    );
    if (!keywordMatch) return null;
  }

  // Calculate match score
  const matchScore = calculateMatchScore(jobData, filterConfig);

  return {
    ...jobData,
    filter_config_id: filterConfig.id,
    match_score: matchScore,
    filter_reason: generateFilterReason(jobData, filterConfig),
  };
};
```

---

## Frontend Implementation

### Component: `JobFilteringSettingsPage`

```typescript
// src/pages/JobFilteringSettingsPage.tsx

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Copy, Play } from 'lucide-react';

interface FilterConfig {
  id?: string;
  config_name: string;
  platform: 'linkedin' | 'indeed' | 'seek';
  primary_location: string;
  search_radius: number;
  target_job_titles: string[];
  excluded_job_titles: string[];
  seniority_levels: string[];
  work_arrangements: string[];
  company_size_preferences: string[];
  included_industries: string[];
  excluded_industries: string[];
  min_salary?: number;
  max_salary?: number;
  required_keywords: string[];
  excluded_keywords: string[];
  max_days_old: number;
  remote_options: string[];
  is_active: boolean;
  // Additional filtering options from screenshot
  job_functions: string[];
  experience_levels: string[];
  company_types: string[];
  benefits: string[];
  languages: string[];
  certifications: string[];
  education_levels: string[];
  visa_sponsorship: boolean;
  equity_offered: boolean;
}

export function JobFilteringSettingsPage() {
  const [configs, setConfigs] = useState<FilterConfig[]>([]);
  const [activeConfig, setActiveConfig] = useState<FilterConfig | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleSaveConfig = async (config: FilterConfig) => {
    // Save configuration to database
    const { data, error } = await supabase
      .from('job_filter_configs')
      .upsert(config)
      .select()
      .single();

    if (error) throw error;

    setConfigs(prev =>
      prev.map(c => c.id === config.id ? data : c)
    );
  };

  const handleTestConfig = async (config: FilterConfig) => {
    // Test configuration against recent jobs
    const { data: testJobs } = await supabase
      .from('jobs')
      .select('*')
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .limit(10);

    // Apply filters and show results
    const filteredJobs = testJobs?.filter(job =>
      applyFilters(job, config)
    );

    // Show test results modal
    showTestResults(filteredJobs);
  };

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Job Discovery Configuration</h1>
        <p className="text-muted-foreground mt-2">
          Set up automated job posting monitoring for LinkedIn, Indeed, or Seek.
          Configure search parameters, targeting criteria, and AI processing rules
          to discover relevant executive opportunities in your market.
        </p>
      </div>

      {/* Configuration List */}
      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Active Configurations</h2>
          <Button onClick={() => setIsEditing(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Configuration
          </Button>
        </div>

        <div className="space-y-3">
          {configs.map(config => (
            <div key={config.id} className="flex items-center justify-between p-3 border rounded">
              <div className="flex items-center gap-3">
                <Badge variant={config.is_active ? "default" : "secondary"}>
                  {config.platform}
                </Badge>
                <div>
                  <h3 className="font-medium">{config.config_name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {config.primary_location} • {config.target_job_titles.length} job titles
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => handleTestConfig(config)}>
                  <Play className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => setActiveConfig(config)}>
                  Edit
                </Button>
                <Button size="sm" variant="outline" onClick={() => duplicateConfig(config)}>
                  <Copy className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="destructive" onClick={() => deleteConfig(config.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Configuration Form */}
      {isEditing && (
        <JobFilteringForm
          config={activeConfig}
          onSave={handleSaveConfig}
          onCancel={() => setIsEditing(false)}
        />
      )}
    </div>
  );
}
```

### Component: `JobFilteringForm`

```typescript
// src/components/JobFilteringForm.tsx

export function JobFilteringForm({
  config,
  onSave,
  onCancel
}: {
  config: FilterConfig | null;
  onSave: (config: FilterConfig) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<FilterConfig>(
    config || getDefaultConfig()
  );

  // Modal state management
  const [showSeniorityModal, setShowSeniorityModal] = useState(false);
  const [showWorkArrangementsModal, setShowWorkArrangementsModal] = useState(false);
  const [showJobTitlesModal, setShowJobTitlesModal] = useState(false);
  const [showExcludedModal, setShowExcludedModal] = useState(false);

  return (
    <Card className="p-6">
      <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }}>
        {/* Basic Configuration */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-5 h-5 bg-gray-400 rounded"></div>
            <h3 className="text-lg font-semibold">Basic Configuration</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Platform selection, naming, and activation settings for this monitoring setup.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="config_name">Configuration Name *</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Choose a descriptive name that identifies the platform, location, and focus. Examples: 'Albany Executive Jobs - LinkedIn', 'Boston Tech Leadership - Indeed', 'NYC Finance Directors - LinkedIn'
              </p>
              <Input
                id="config_name"
                value={formData.config_name}
                onChange={(e) => setFormData(prev => ({ ...prev, config_name: e.target.value }))}
                placeholder="e.g., 'Albany Executive Jobs - LinkedIn'"
                required
              />
            </div>

            <div>
              <Label htmlFor="platform">Platform *</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Job board platform for this configuration. Each platform requires specific query format and scraper configuration. Supports multi-platform strategies with separate configs per platform.
              </p>
              <Select
                value={formData.platform}
                onValueChange={(value) => setFormData(prev => ({ ...prev, platform: value as any }))}
              >
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="indeed">Indeed</SelectItem>
                <SelectItem value="seek">Seek</SelectItem>
              </Select>
            </div>
          </div>
        </div>

         {/* Targeting & Location */}
         <div className="mb-8">
           <div className="flex items-center gap-2 mb-4">
             <div className="w-5 h-5 bg-gray-400 rounded"></div>
             <h3 className="text-lg font-semibold">Targeting & Location</h3>
           </div>
           <p className="text-sm text-muted-foreground mb-4">
             Define geographic scope, job titles, experience levels, and role requirements.
           </p>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
             <div>
               <Label htmlFor="primary_location">Primary Location *</Label>
               <Input
                 id="primary_location"
                 value={formData.primary_location}
                 onChange={(e) => setFormData(prev => ({ ...prev, primary_location: e.target.value }))}
                 placeholder="e.g., San Francisco, CA"
                 required
               />
             </div>

             <div>
               <Label htmlFor="search_radius">Search Radius</Label>
               <Input
                 id="search_radius"
                 type="number"
                 value={formData.search_radius}
                 onChange={(e) => setFormData(prev => ({ ...prev, search_radius: parseInt(e.target.value) }))}
                 placeholder="25"
               />
             </div>

             <div>
               <Label htmlFor="compensation">Compensation</Label>
               <Input
                 id="compensation"
                 value={formData.min_salary ? `${formData.min_salary} - ${formData.max_salary || ''}` : ''}
                 onChange={(e) => {
                   const value = e.target.value;
                   const [min, max] = value.split(' - ').map(v => parseInt(v) || '');
                   setFormData(prev => ({
                     ...prev,
                     min_salary: min || undefined,
                     max_salary: max || undefined
                   }));
                 }}
                 placeholder="e.g., 80000 - 150000"
               />
             </div>

             <div>
               <Label>Seniority Levels</Label>
               <Button
                 type="button"
                 variant="outline"
                 size="sm"
                 onClick={() => setShowSeniorityModal(true)}
               >
                 <Plus className="h-4 w-4 mr-2" />
                 Add Seniority Levels
               </Button>
             </div>

             <div>
               <Label>Work Arrangements</Label>
               <Button
                 type="button"
                 variant="outline"
                 size="sm"
                 onClick={() => setShowWorkArrangementsModal(true)}
               >
                 <Plus className="h-4 w-4 mr-2" />
                 Add Work Arrangements
               </Button>
             </div>

             <div>
               <Label>Target Job Titles *</Label>
               <Button
                 type="button"
                 variant="outline"
                 size="sm"
                 onClick={() => setShowJobTitlesModal(true)}
               >
                 <Plus className="h-4 w-4 mr-2" />
                 Add Job Titles
               </Button>
             </div>

             <div>
               <Label>Excluded Industries / Keywords</Label>
               <Button
                 type="button"
                 variant="outline"
                 size="sm"
                 onClick={() => setShowExcludedModal(true)}
               >
                 <Plus className="h-4 w-4 mr-2" />
                 Add Exclusions
               </Button>
             </div>
           </div>
         </div>

        {/* Modals for complex field management */}
        {showSeniorityModal && (
          <SeniorityLevelsModal
            selectedLevels={formData.seniority_levels}
            onSave={(levels) => {
              setFormData(prev => ({ ...prev, seniority_levels: levels }));
              setShowSeniorityModal(false);
            }}
            onCancel={() => setShowSeniorityModal(false)}
          />
        )}

        {showWorkArrangementsModal && (
          <WorkArrangementsModal
            selectedArrangements={formData.work_arrangements}
            onSave={(arrangements) => {
              setFormData(prev => ({ ...prev, work_arrangements: arrangements }));
              setShowWorkArrangementsModal(false);
            }}
            onCancel={() => setShowWorkArrangementsModal(false)}
          />
        )}

        {showJobTitlesModal && (
          <JobTitlesModal
            selectedTitles={formData.target_job_titles}
            onSave={(titles) => {
              setFormData(prev => ({ ...prev, target_job_titles: titles }));
              setShowJobTitlesModal(false);
            }}
            onCancel={() => setShowJobTitlesModal(false)}
          />
        )}

        {showExcludedModal && (
          <ExcludedItemsModal
            excludedIndustries={formData.excluded_industries}
            excludedKeywords={formData.excluded_keywords}
            onSave={(industries, keywords) => {
              setFormData(prev => ({
                ...prev,
                excluded_industries: industries,
                excluded_keywords: keywords
              }));
              setShowExcludedModal(false);
            }}
            onCancel={() => setShowExcludedModal(false)}
          />
        )}

        {/* Form Actions */}
        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => testConfiguration(formData)}>
              Test Configuration
            </Button>
            <Button type="submit">
              Save Configuration
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
}
```

---

## API Reference

### React Query Hooks

```typescript
// src/hooks/useJobFilterConfigs.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export function useJobFilterConfigs() {
  return useQuery({
    queryKey: ['job-filter-configs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('job_filter_configs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
}

export function useCreateJobFilterConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (config: Partial<FilterConfig>) => {
      const { data, error } = await supabase
        .from('job_filter_configs')
        .insert(config)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-filter-configs'] });
    },
  });
}

export function useUpdateJobFilterConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: { id: string } & Partial<FilterConfig>) => {
      const { data, error } = await supabase
        .from('job_filter_configs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-filter-configs'] });
    },
  });
}
```

### Supabase Edge Function: `test-job-filters`

```typescript
// supabase/functions/test-job-filters/index.ts

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async req => {
  try {
    const { filterConfig, testJobs } = await req.json();

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Apply filters to test jobs
    const filteredJobs = testJobs.filter(job => {
      return applyJobFilters(job, filterConfig);
    });

    // Calculate match scores
    const jobsWithScores = filteredJobs.map(job => ({
      ...job,
      match_score: calculateMatchScore(job, filterConfig),
      filter_reason: generateFilterReason(job, filterConfig),
    }));

    return new Response(
      JSON.stringify({
        success: true,
        total_jobs: testJobs.length,
        filtered_jobs: jobsWithScores.length,
        match_rate: (jobsWithScores.length / testJobs.length) * 100,
        results: jobsWithScores,
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});

function applyJobFilters(job: any, config: any): boolean {
  // Location filtering
  if (
    config.primary_location &&
    !checkLocationMatch(
      job.location,
      config.primary_location,
      config.search_radius
    )
  ) {
    return false;
  }

  // Job title filtering
  if (config.target_job_titles.length > 0) {
    const titleMatch = config.target_job_titles.some(title =>
      job.title.toLowerCase().includes(title.toLowerCase())
    );
    if (!titleMatch) return false;
  }

  // Excluded titles
  if (config.excluded_job_titles.length > 0) {
    const excludedMatch = config.excluded_job_titles.some(title =>
      job.title.toLowerCase().includes(title.toLowerCase())
    );
    if (excludedMatch) return false;
  }

  // Salary filtering
  if (config.min_salary && job.salary) {
    if (parseInt(job.salary) < config.min_salary) return false;
  }

  // Keyword filtering
  if (config.required_keywords.length > 0) {
    const keywordMatch = config.required_keywords.every(keyword =>
      job.description.toLowerCase().includes(keyword.toLowerCase())
    );
    if (!keywordMatch) return false;
  }

  // Job function filtering
  if (config.job_functions.length > 0) {
    const functionMatch = config.job_functions.some(
      func =>
        job.job_function?.toLowerCase().includes(func.toLowerCase()) ||
        job.title.toLowerCase().includes(func.toLowerCase())
    );
    if (!functionMatch) return false;
  }

  // Experience level filtering
  if (config.experience_levels.length > 0) {
    const experienceMatch = config.experience_levels.some(
      level =>
        job.experience_level?.toLowerCase().includes(level.toLowerCase()) ||
        job.title.toLowerCase().includes(level.toLowerCase())
    );
    if (!experienceMatch) return false;
  }

  // Company type filtering
  if (config.company_types.length > 0) {
    const companyTypeMatch = config.company_types.some(type =>
      job.company_type?.toLowerCase().includes(type.toLowerCase())
    );
    if (!companyTypeMatch) return false;
  }

  // Benefits filtering
  if (config.benefits.length > 0) {
    const benefitsMatch = config.benefits.some(benefit =>
      job.benefits?.toLowerCase().includes(benefit.toLowerCase())
    );
    if (!benefitsMatch) return false;
  }

  // Language filtering
  if (config.languages.length > 0) {
    const languageMatch = config.languages.some(
      lang =>
        job.languages?.toLowerCase().includes(lang.toLowerCase()) ||
        job.description.toLowerCase().includes(lang.toLowerCase())
    );
    if (!languageMatch) return false;
  }

  // Certification filtering
  if (config.certifications.length > 0) {
    const certMatch = config.certifications.some(
      cert =>
        job.certifications?.toLowerCase().includes(cert.toLowerCase()) ||
        job.description.toLowerCase().includes(cert.toLowerCase())
    );
    if (!certMatch) return false;
  }

  // Education level filtering
  if (config.education_levels.length > 0) {
    const educationMatch = config.education_levels.some(
      edu =>
        job.education_level?.toLowerCase().includes(edu.toLowerCase()) ||
        job.description.toLowerCase().includes(edu.toLowerCase())
    );
    if (!educationMatch) return false;
  }

  // Visa sponsorship filtering
  if (config.visa_sponsorship && !job.visa_sponsorship) {
    return false;
  }

  // Equity filtering
  if (config.equity_offered && !job.equity_offered) {
    return false;
  }

  return true;
}

function calculateMatchScore(job: any, config: any): number {
  let score = 0;
  let totalChecks = 0;

  // Location match (20% weight)
  if (config.primary_location) {
    totalChecks += 20;
    if (
      checkLocationMatch(
        job.location,
        config.primary_location,
        config.search_radius
      )
    ) {
      score += 20;
    }
  }

  // Title match (15% weight)
  if (config.target_job_titles.length > 0) {
    totalChecks += 15;
    const titleMatch = config.target_job_titles.some(title =>
      job.title.toLowerCase().includes(title.toLowerCase())
    );
    if (titleMatch) score += 15;
  }

  // Salary match (15% weight)
  if (config.min_salary && job.salary) {
    totalChecks += 15;
    if (parseInt(job.salary) >= config.min_salary) {
      score += 15;
    }
  }

  // Keyword match (15% weight)
  if (config.required_keywords.length > 0) {
    totalChecks += 15;
    const keywordMatch = config.required_keywords.every(keyword =>
      job.description.toLowerCase().includes(keyword.toLowerCase())
    );
    if (keywordMatch) score += 15;
  }

  // Job function match (10% weight)
  if (config.job_functions.length > 0) {
    totalChecks += 10;
    const functionMatch = config.job_functions.some(
      func =>
        job.job_function?.toLowerCase().includes(func.toLowerCase()) ||
        job.title.toLowerCase().includes(func.toLowerCase())
    );
    if (functionMatch) score += 10;
  }

  // Experience level match (10% weight)
  if (config.experience_levels.length > 0) {
    totalChecks += 10;
    const experienceMatch = config.experience_levels.some(
      level =>
        job.experience_level?.toLowerCase().includes(level.toLowerCase()) ||
        job.title.toLowerCase().includes(level.toLowerCase())
    );
    if (experienceMatch) score += 10;
  }

  // Company type match (5% weight)
  if (config.company_types.length > 0) {
    totalChecks += 5;
    const companyTypeMatch = config.company_types.some(type =>
      job.company_type?.toLowerCase().includes(type.toLowerCase())
    );
    if (companyTypeMatch) score += 5;
  }

  // Benefits match (5% weight)
  if (config.benefits.length > 0) {
    totalChecks += 5;
    const benefitsMatch = config.benefits.some(benefit =>
      job.benefits?.toLowerCase().includes(benefit.toLowerCase())
    );
    if (benefitsMatch) score += 5;
  }

  // Language match (3% weight)
  if (config.languages.length > 0) {
    totalChecks += 3;
    const languageMatch = config.languages.some(
      lang =>
        job.languages?.toLowerCase().includes(lang.toLowerCase()) ||
        job.description.toLowerCase().includes(lang.toLowerCase())
    );
    if (languageMatch) score += 3;
  }

  // Certification match (2% weight)
  if (config.certifications.length > 0) {
    totalChecks += 2;
    const certMatch = config.certifications.some(
      cert =>
        job.certifications?.toLowerCase().includes(cert.toLowerCase()) ||
        job.description.toLowerCase().includes(cert.toLowerCase())
    );
    if (certMatch) score += 2;
  }

  // Education level match (2% weight)
  if (config.education_levels.length > 0) {
    totalChecks += 2;
    const educationMatch = config.education_levels.some(
      edu =>
        job.education_level?.toLowerCase().includes(edu.toLowerCase()) ||
        job.description.toLowerCase().includes(edu.toLowerCase())
    );
    if (educationMatch) score += 2;
  }

  // Visa sponsorship match (1% weight)
  if (config.visa_sponsorship) {
    totalChecks += 1;
    if (job.visa_sponsorship) {
      score += 1;
    }
  }

  // Equity match (1% weight)
  if (config.equity_offered) {
    totalChecks += 1;
    if (job.equity_offered) {
      score += 1;
    }
  }

  return totalChecks > 0 ? score / totalChecks : 0;
}
```

---

## Testing Strategy

### Unit Tests

- ✅ Filter configuration validation
- ✅ Array field management (add/remove)
- ✅ Form submission and validation
- ✅ Match score calculation
- ✅ Location matching logic

### Integration Tests

- ✅ Save/load filter configurations
- ✅ Test configuration against sample jobs
- ✅ n8n workflow integration
- ✅ Database operations and RLS policies

### User Acceptance Tests

- ✅ Create new filter configuration
- ✅ Edit existing configuration
- ✅ Test configuration with sample data
- ✅ Duplicate and delete configurations
- ✅ Apply filters to job discovery

---

## Rollout Plan

### Phase 1: Database & Backend (4 hours)

- [ ] Create `job_filter_configs` table
- [ ] Implement RLS policies
- [ ] Create test-job-filters Edge Function
- [ ] Add filter fields to jobs table

### Phase 2: Frontend Components (6 hours)

- [ ] Build `JobFilteringSettingsPage` component
- [ ] Create `JobFilteringForm` component
- [ ] Implement React Query hooks
- [ ] Add form validation and error handling

### Phase 3: n8n Integration (4 hours)

- [ ] Update n8n workflows to apply user filters
- [ ] Implement filter application logic
- [ ] Add match score calculation
- [ ] Test end-to-end filtering

### Phase 4: Testing & Polish (2 hours)

- [ ] Comprehensive testing
- [ ] UI/UX improvements
- [ ] Performance optimization
- [ ] Documentation updates

---

## Success Criteria

**Must Have (P0)**:

- ✅ Users can create and manage filter configurations
- ✅ Filters are applied during job discovery
- ✅ Match scores are calculated and displayed
- ✅ Configuration testing works correctly

**Should Have (P1)**:

- ✅ Multiple configurations per user
- ✅ Configuration duplication and templates
- ✅ Advanced filtering options (company size, industry)
- ✅ Filter performance analytics

**Could Have (P2)**:

- ⏸️ AI-powered filter suggestions
- ⏸️ Filter configuration sharing between users
- ⏸️ Advanced analytics and reporting
- ⏸️ Filter configuration versioning

---

## References

- [LinkedIn Job Search Filters](https://www.linkedin.com/help/linkedin/answer/a507441/filter-and-sort-job-search-results)
- [Seek Job Search Features](https://www.seek.com.au/)
- [n8n Workflow Documentation](https://docs.n8n.io/)

---

**Document Version**: 1.0  
**Last Updated**: January 27, 2025  
**Author**: RecruitEdge Product Team  
**Status**: Ready for Implementation
