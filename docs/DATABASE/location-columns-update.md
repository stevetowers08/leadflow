# Location Columns Update

## Summary

Added granular location tracking to the `jobs` table with separate columns for country, city, and region.

## Migration

**File:** `supabase/migrations/20251027000000_add_location_columns_to_jobs.sql`

### Changes:

1. Added three new columns to `jobs` table:
   - `country` (TEXT) - ISO country code (e.g., AU, US, UK)
   - `city` (TEXT) - City name (e.g., Melbourne, Sydney)
   - `region` (TEXT) - State/region (e.g., VIC, NSW, CA)

2. Created indexes for efficient location filtering:
   - `idx_jobs_country`
   - `idx_jobs_city`
   - `idx_jobs_region`
   - `idx_jobs_location_combo` (composite index)

### Old vs New:

- **Old:** Single `location` field (text)
- **New:** Structured `country`, `city`, `region` columns

## TypeScript Updates

### Database Types

**File:** `src/types/database.ts`

Added to `Job` interface:

```typescript
country: string | null;
city: string | null;
region: string | null;
```

## Frontend Display

### Location Display Utility

**File:** `src/utils/locationDisplay.ts`

Created utility functions:

- **`formatLocation(loc)`** - Smart location display
  - Priority: city, region, country
  - Hides country if it's obvious (e.g., major Australian cities)
  - Fallback to old `location` field
- **`formatLocationShort(loc)`** - Compact display (City, Region)
- **`formatLocationFull(loc)`** - Full display (City, Region, Country)
- **`isAustraliaLocation(loc)`** - Check if location is in Australia

### Usage in Jobs Page

**File:** `src/pages/Jobs.tsx`

Updated location column render:

```typescript
render: (_, job) => {
  const location = formatLocation({
    country: job.country,
    city: job.city,
    region: job.region,
    location: job.location, // Fallback
  });
  return <div>{location}</div>;
}
```

## Display Examples

### Examples:

- **AU** + Melbourne + VIC → `"Melbourne, VIC"`
- **AU** + Sydney + NSW → `"Sydney, NSW"`
- **US** + San Francisco + CA → `"San Francisco, CA, US"`
- **UK** + London + England → `"London, England, UK"`

## Benefits

1. **Better filtering** - Can filter by country, city, or region
2. **Structured data** - Parsed location instead of free text
3. **Smart display** - Hides obvious country names
4. **Backwards compatible** - Falls back to old `location` field

## Next Steps

1. Update job scrapers to populate new columns
2. Add location parsing logic (extract from description if needed)
3. Update filtering to use new columns
4. Consider adding `postal_code` column for enhanced filtering
