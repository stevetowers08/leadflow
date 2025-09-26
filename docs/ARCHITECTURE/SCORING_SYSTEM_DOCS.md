# Empowr CRM Scoring System Documentation

## Overview
The Empowr CRM uses a unified scoring system across three main entities: **People (Leads)**, **Companies**, and **Jobs**. Each entity has different scoring mechanisms and display formats.

## Database Structure

### 1. People Table (Leads)
**Column:** `lead_score` (TEXT)
**Values:** `'High'`, `'Medium'`, `'Low'`
**Display Label:** "AI SCORE"
**Badge Style:** Colored text badges

```sql
-- Example data
SELECT DISTINCT lead_score FROM people WHERE lead_score IS NOT NULL;
-- Result: 'High', 'Medium', 'Low'
```

### 2. Companies Table
**Columns:** 
- `lead_score` (TEXT) - AI Score: `'0'`, `'36'`, `'50'`, `'82'`, `'100'` etc.
- `priority` (TEXT) - Priority: `'VERY HIGH'`, `'HIGH'`, `'MEDIUM'`, `'LOW'`

**Display Label:** "AI SCORE" (for lead_score)
**Badge Style:** Numeric badges with colors based on score ranges

```sql
-- Example data
SELECT DISTINCT lead_score FROM companies WHERE lead_score IS NOT NULL;
-- Result: '0', '36', '44', '50', '60', '70', '80', '90', '100' etc.

SELECT DISTINCT priority FROM companies WHERE priority IS NOT NULL;
-- Result: 'VERY HIGH', 'HIGH', 'MEDIUM', 'LOW'
```

### 3. Jobs Table
**Columns:**
- `priority` (TEXT) - Priority: `'VERY HIGH'`, `'HIGH'`, `'MEDIUM'`, `'LOW'`
- `lead_score_job` (INTEGER) - Job Score: `0`, `36`, `44`, `50`, `82`, `100` etc.

**Display Label:** "PRIORITY" (for priority)
**Badge Style:** Colored priority badges

```sql
-- Example data
SELECT DISTINCT priority FROM jobs WHERE priority IS NOT NULL;
-- Result: 'VERY HIGH', 'HIGH', 'MEDIUM', 'LOW'

SELECT DISTINCT lead_score_job FROM jobs WHERE lead_score_job IS NOT NULL;
-- Result: 0, 36, 44, 45, 48, 50, 52, 53, 54, 55, 56, 57, 58, 59, 60, etc.
```

## Scoring System Rules

### Core Principles
1. **AI Score is for all entities** - People, Companies, and Jobs all use "AI SCORE" label
2. **People use text-based scores** - People use text-based scores (High/Medium/Low) with "AI SCORE" label
3. **Priority is for jobs** - Jobs have priority levels with "PRIORITY" label
4. **Job scores are separate numeric values** - Jobs have their own scoring system (0-100)

### Display Logic

#### People (Leads) Popups
- **Label:** "AI SCORE"
- **Value:** `lead_score` from people table
- **Badge:** Colored text badge (High=red, Medium=yellow, Low=green)

#### Companies Popups
- **Label:** "AI SCORE" 
- **Value:** `lead_score` from companies table
- **Badge:** Numeric badge with color based on score range
  - 80-100: Red (Very High)
  - 60-79: Orange (High)
  - 40-59: Yellow (Medium)
  - 0-39: Green (Low)

#### Jobs Popups
- **Label:** "PRIORITY"
- **Value:** `priority` from jobs table
- **Badge:** Colored priority badge
  - VERY HIGH: Red
  - HIGH: Orange
  - MEDIUM: Yellow
  - LOW: Green

## Design System

### Two Distinct Design Patterns

#### 1. **NUMERIC DESIGN** (Numbers)
- **Used for**: Company AI Scores (0-100), Job Scores (0-100)
- **Style**: Simple number display with bold text
- **Classes**: `text-sm font-bold text-gray-900`
- **No badge styling**: No borders, padding, or background colors

#### 2. **BADGE DESIGN** (Words)
- **Used for**: People AI Scores (High/Medium/Low), Job Priorities (VERY HIGH/HIGH/MEDIUM/LOW)
- **Style**: Colored badge with borders and padding
- **Classes**: `text-sm font-bold px-2 py-1 rounded-md border` + color classes
- **Full badge styling**: Background colors, borders, rounded corners

### Design Examples

#### Numeric Design (Companies)
```
AI SCORE: 82
```
- Simple bold number, no badge styling

#### Badge Design (People)
```
AI SCORE: [High]  (red badge with border)
```

#### Badge Design (Jobs)
```
PRIORITY: [HIGH]  (orange badge with border)
```

## Color Scheme

### Badge Design Colors (Words Only)
- **VERY HIGH:** `bg-red-100 text-red-800 border-red-200`
- **HIGH:** `bg-orange-100 text-orange-800 border-orange-200`
- **MEDIUM:** `bg-yellow-100 text-yellow-800 border-yellow-200`
- **LOW:** `bg-green-100 text-green-800 border-green-200`

### Numeric Design Colors (Numbers Only)
- **All numeric scores:** `text-gray-900 font-bold`
- **No color coding** for numeric values - simple bold text only

## Implementation

### TypeScript Types
```typescript
export type ScoringType = 'priority' | 'lead_score' | 'company_score' | 'job_score';
export type PriorityLevel = 'VERY HIGH' | 'HIGH' | 'MEDIUM' | 'LOW';
export type LeadScoreLevel = 'High' | 'Medium' | 'Low';
export type CompanyScoreLevel = string; // "50", "60", "82" etc.
export type JobScoreLevel = number; // 0-100
```

### Usage Example
```typescript
import { getScoringInfo, getScoringLabel } from '@/utils/scoringSystem';

// For a job popup
const scoringDisplay = {
  label: 'PRIORITY',
  value: 'HIGH',
  type: 'priority' as const
};

const info = getScoringInfo(scoringDisplay.type, scoringDisplay.value);
// Returns: { label: 'High', badge: 'High', color: 'bg-orange-100...', value: 'HIGH' }
```

## Summary

The scoring system provides a unified interface for displaying different types of scores across the CRM:

- **People:** AI Score (High/Medium/Low)
- **Companies:** AI Score (0-100 numeric)
- **Jobs:** Priority (VERY HIGH/HIGH/MEDIUM/LOW)

All scoring displays use consistent color schemes and badge styling for a cohesive user experience.
