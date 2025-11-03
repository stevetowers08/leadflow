# Automation: AI Fields To Populate (Field Names & Shapes)

> **⚠️ DO NOT DELETE** - This document is a reference for automation development. It lists all AI fields that need to be populated when creating automations.

Purpose: Quick reference when building automations that write AI outputs into the database. Keep names in sync with `src/types/databaseSchema.ts` and `src/types/database.ts`.

## Companies (table: `companies`)

- **ai_company_intelligence** (jsonb)
  - Shape: `{ summary: string, products: string[], markets: string[], risks: string[], sources?: string[] }`
- **ai_marketi_info** (jsonb)
  - Shape: `{ category: string, competitors: string[], trends: string[], differentiators: string[] }`
- **ai_funding** (jsonb)
  - Shape: `{ rounds: [{ type: string, amount: string, date: string, lead_investors?: string[] }], total_raised?: string }`
- **ai_new_location** (jsonb)
  - Shape: `{ is_opening: boolean, city?: string, region?: string, country?: string, source?: string }`
- **key_info_raw** (jsonb)
  - Any JSON payload of raw facts; add provenance (url, captured_at) when possible
- **lead_score** (text)
  - Examples: "A" | "B" | "C" or "High" | "Medium" | "Low"
- **score_reason** (text)
  - Short rationale explaining the score
- **confidence_level** (confidence_level_enum)
  - Values: `low` | `medium` | `high`
- **priority** (text)
  - Values: `low` | `medium` | `high` | `urgent`

## People (table: `people` / `contacts`)

- **score** (smallint)
  - Range: 1-10 numeric score
- **confidence_level** (text)
  - Values: `low` | `medium` | `high`
- **decision_maker_notes** (text)
  - Brief justification/context on decision-maker likelihood
- **reply_type** (reply_type_enum)
  - Values: `interested` | `not_interested` | `maybe`
- **email_draft** (text)
  - Last AI-generated email draft content for this contact

## Notes

- Prefer compact JSON with arrays of primitives
- Include provenance in JSON when feasible (url(s), timestamps)
- Avoid storing extremely large blobs; keep payloads concise
- Always reference `src/types/databaseSchema.ts` for exact field names and types
