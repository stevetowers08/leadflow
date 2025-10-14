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

### ✅ **UPDATED: Unified Design Principle**

#### **WORDS = StatusBadge, NUMBERS = Custom Styling**

#### 1. **StatusBadge Design** (Words Only)
- **Used for**: People AI Scores (High/Medium/Low), Job Priorities (VERY HIGH/HIGH/MEDIUM/LOW)
- **Style**: Colored badge with borders and padding
- **Classes**: `text-xs font-medium rounded-md border` + color classes
- **Implementation**: `<StatusBadge status={value} size="sm" />`
- **Full badge styling**: Background colors, borders, rounded corners

#### 2. **Custom Badge Design** (Numbers Only)
- **Used for**: Company AI Scores (0-100), Job Scores (0-100), Count columns
- **Style**: Colored badge with borders and padding
- **Classes**: `text-xs font-medium px-2 py-1 rounded-md border` + color classes
- **Implementation**: Custom span with `getScoreBadgeClasses()` or gray styling
- **Full badge styling**: Background colors, borders, rounded corners

### ✅ **UPDATED: Design Examples**

#### StatusBadge Design (People AI Score)
```
AI SCORE: [High]  (red badge with border, rounded-md)
```
- Uses StatusBadge component
- Text-based values: "High", "Medium", "Low"

#### StatusBadge Design (Jobs Priority)
```
PRIORITY: [HIGH]  (orange badge with border, rounded-md)
```
- Uses StatusBadge component
- Text-based values: "VERY HIGH", "HIGH", "MEDIUM", "LOW"

#### Custom Badge Design (Companies AI Score)
```
AI SCORE: [82]  (colored badge with border, rounded-md)
```
- Uses custom styling with `getScoreBadgeClasses()`
- Numeric values: "0", "36", "50", "82", "100" etc.

#### Custom Badge Design (Jobs AI Score)
```
AI SCORE: [82]  (colored badge with border, rounded-md)
```
- Uses custom styling with `getScoreBadgeClasses()`
- Numeric values: 0, 36, 44, 50, 82, 100 etc.

## ✅ **UPDATED: Color Scheme**

### StatusBadge Colors (Words Only)
- **VERY HIGH:** `bg-red-50 text-red-700 border-red-200`
- **HIGH:** `bg-orange-50 text-orange-700 border-orange-200`
- **MEDIUM:** `bg-yellow-50 text-yellow-700 border-yellow-200`
- **LOW:** `bg-green-50 text-green-700 border-green-200`

### Custom Badge Colors (Numbers Only)
- **Score ≥85:** `bg-green-50 text-green-700 border-green-200`
- **Score ≥70:** `bg-blue-50 text-blue-700 border-blue-200`
- **Score ≥50:** `bg-yellow-50 text-yellow-700 border-yellow-200`
- **Score <50:** `bg-red-50 text-red-700 border-red-200`
- **Count Columns:** `bg-gray-50 text-gray-500 border-gray-200`

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
// Returns: { label: 'High', badge: 'High', color: 'bg-orange-50...', value: 'HIGH' }
```

## Summary

The scoring system provides a unified interface for displaying different types of scores across the CRM:

- **People:** AI Score (High/Medium/Low)
- **Companies:** AI Score (0-100 numeric)
- **Jobs:** Priority (VERY HIGH/HIGH/MEDIUM/LOW)

All scoring displays use consistent color schemes and badge styling for a cohesive user experience.
