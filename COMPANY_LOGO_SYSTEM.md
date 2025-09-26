# Company Logo System Documentation

## Overview

The 4Twenty CRM uses a **hybrid logo management system** that combines Clearbit Logo API with intelligent database caching for optimal performance and reliability.

## Architecture

### Logo Sources (Priority Order)
1. **Cached Database URLs** - Previously successful Clearbit URLs (30-day cache)
2. **Clearbit API** - Real-time logo fetching using company domains
3. **Fallback Initials** - Generated initials when logos unavailable

### Core Components

#### `src/utils/logoService.ts`
Enhanced service with caching:
- `getCompanyLogoUrl()` - Async function with smart caching
- `getCompanyLogoUrlSync()` - Synchronous version for UI components
- `getClearbitLogo()` - Generate Clearbit API URLs
- `testLogoUrl()` - Validate logo accessibility
- `refreshStaleLogos()` - Batch refresh stale logos
- `getLogoStats()` - Get caching statistics

#### `src/services/logoRefreshService.ts`
Background service for automatic logo refresh:
- Runs every hour in production
- Refreshes stale logos (older than 30 days)
- Provides service status and controls

#### `src/components/admin/LogoManagement.tsx`
Admin interface for logo management:
- View caching statistics
- Manual logo refresh
- Background service controls
- Real-time status monitoring

## Database Schema

### Companies Table
```sql
-- Logo caching fields
logo_url TEXT,                    -- Cached Clearbit URL
logo_cached_at TIMESTAMP,         -- Cache timestamp
website TEXT                       -- Used for Clearbit logo generation
```

## Logo URL Generation

### Smart Caching Strategy
```typescript
// 1. Check cached URL (if valid and < 30 days old)
if (cachedUrl && isCacheValid(cachedAt)) {
  return cachedUrl;
}

// 2. Generate new Clearbit URL
const clearbitUrl = getClearbitLogo(companyName, website);

// 3. Test URL accessibility
if (await testLogoUrl(clearbitUrl)) {
  // 4. Cache successful URL
  await cacheLogoUrl(companyId, clearbitUrl);
  return clearbitUrl;
}

// 5. Return null (fallback to initials)
return null;
```

### Clearbit API Strategy
```typescript
// Primary: Use website domain
https://logo.clearbit.com/example.com

// Domain Processing:
// 1. Remove protocol (https://, http://)
// 2. Remove www. prefix
// 3. Extract domain only (remove paths)
// 4. Remove query parameters
```

## Usage Examples

### Getting Company Logo in Components
```typescript
// Synchronous (recommended for UI components)
const logoUrl = getCompanyLogoUrlSync(company.name, company.website);

// Asynchronous (for data processing)
const logoUrl = await getCompanyLogoUrl(company.id, company.name, company.website);

// Use in JSX with fallback
<img
  src={logoUrl || ''}
  alt={company.name}
  onError={(e) => {
    e.currentTarget.style.display = 'none';
    // Show initials fallback
  }}
/>
```

## Performance Benefits

### Hybrid Approach Advantages
- **Fast Loading**: Cached URLs load instantly
- **Always Current**: Stale logos automatically refreshed
- **Reduced API Calls**: 30-day cache reduces Clearbit requests
- **High Availability**: Fallback to real-time generation
- **Background Processing**: Non-blocking logo refresh
- **Smart Caching**: Only cache successful URLs

### Caching Strategy
- **Cache Duration**: 30 days for successful URLs
- **Background Refresh**: Automatic stale logo updates
- **Batch Processing**: Process logos in batches of 50
- **Rate Limiting**: 100ms delay between API calls
- **Error Handling**: Graceful fallback on failures

## Logo Display Patterns

- **Small (32px)**: Dashboard cards, compact views
- **Medium (40px)**: Table rows, standard cards
- **Large (48px)**: Company listings, detail views
- **Extra Large (64px)**: Headers, modal views

## Error Handling

### Logo Loading Failures
```typescript
// Automatic fallback in components
<img
  src={logoUrl || ''}
  onError={(e) => {
    // Hide broken image, show initials
    e.currentTarget.style.display = 'none';
    const initialsDiv = e.currentTarget.nextElementSibling;
    if (initialsDiv) initialsDiv.style.display = 'flex';
  }}
/>
```

## Admin Management

### Logo Statistics Dashboard
- Total companies count
- Cached logos percentage
- Stale logos count
- Missing logos count
- Cache coverage visualization

### Manual Controls
- **Refresh Now**: Immediate stale logo refresh
- **Background Service**: Toggle automatic refresh
- **Service Status**: Real-time service monitoring

## Integration Points

### Pages Using Logos
- Dashboard company cards
- Jobs page company columns
- Companies page listings
- Lead detail modals
- Company detail modals

## Troubleshooting

### Common Issues
1. **Slow initial loading**: Normal for uncached logos, cached thereafter
2. **Missing logos**: Check website field population
3. **Stale logos**: Background service will refresh automatically
4. **Service not running**: Check admin dashboard status

### Debug Commands
```typescript
// Get logo statistics
const stats = await getLogoStats();
console.log('Logo stats:', stats);

// Manual refresh
await refreshStaleLogos();

// Test specific logo URL
const logoUrl = `https://logo.clearbit.com/example.com`;
const isValid = await testLogoUrl(logoUrl);
```

## Best Practices

1. **Use sync version** for UI components (`getCompanyLogoUrlSync`)
2. **Use async version** for data processing (`getCompanyLogoUrl`)
3. **Always provide fallbacks** for logo display
4. **Keep website fields updated** for better Clearbit matching
5. **Monitor cache statistics** via admin dashboard
6. **Let background service handle** stale logo refresh

## API Limits & Performance

- **Clearbit**: Free tier, no authentication required
- **Rate Limiting**: 100ms delay between requests
- **Batch Processing**: 50 logos per batch
- **Cache Hit Rate**: Typically 80-90% after initial population
- **Background Refresh**: Every hour in production

This hybrid system provides the best balance of performance, reliability, and maintainability for company logo management.

### Core Components

#### `src/utils/logoService.ts`
Main service for logo operations:
- `getClearbitLogo()` - Generate Clearbit API URLs
- `testLogoUrl()` - Validate logo accessibility
- `updateCompanyLogo()` - Update database with new logo
- `batchUpdateLogos()` - Bulk logo updates
- `getCompanyLogoUrl()` - Get logo with fallback chain

#### `src/components/LogoManager.tsx`
Admin interface for logo management:
- Auto-update all company logos
- Replace LinkedIn logos with Clearbit URLs
- Manual logo URL updates
- Progress tracking for bulk operations

#### `src/utils/logoUtils.ts`
Utility functions:
- URL validation and image format checking
- Company initial generation
- UI-avatars.com fallback generation

## Database Schema

### Companies Table
```sql
profile_image_url TEXT -- Stores the logo URL
```

## Logo URL Generation

### Clearbit API Strategy
```typescript
// Primary: Use website domain
https://logo.clearbit.com/example.com

// Fallback: Use company name
https://logo.clearbit.com/companyname.com
```

### Domain Processing
1. Remove protocol (`https://`, `http://`)
2. Remove `www.` prefix
3. Extract domain only (remove paths)
4. Remove query parameters

## Usage Examples

### Getting Company Logo in Components
```typescript
import { getCompanyLogoUrl } from '@/utils/logoService';

// In component
const logoUrl = getCompanyLogoUrl(company.name, company.website, company.profile_image_url);

// Use in JSX
<img 
  src={logoUrl || getCompanyLogoFallback(company.name)} 
  alt={company.name}
  onError={(e) => {
    // Fallback to initials
    e.currentTarget.style.display = 'none';
    // Show initials div
  }}
/>
```

### Batch Logo Updates
```typescript
import { batchUpdateLogos } from '@/utils/logoService';

const companies = [
  { id: '1', name: 'Company A', website: 'https://companya.com' },
  { id: '2', name: 'Company B', website: 'https://companyb.com' }
];

await batchUpdateLogos(companies);
```

### Manual Logo Updates
```typescript
import { setCompanyLogoManually } from '@/utils/logoService';

await setCompanyLogoManually('company-id', 'https://example.com/logo.png');
```

## Admin Features

### Logo Manager Interface
Access via Admin → Logos tab:
- **Auto-Update All Logos**: Fetches logos for all companies
- **Replace LinkedIn Logos**: Replaces problematic LinkedIn URLs
- **Manual Updates**: Set custom logo URLs
- **Progress Tracking**: Real-time progress for bulk operations

### Bulk Operations
- Processes companies sequentially with 100ms delays
- Tests logo accessibility before saving
- Provides detailed success/failure reporting
- Skips companies that already have Clearbit logos

## Error Handling

### Logo Loading Failures
```typescript
// Automatic fallback in components
<img 
  src={logoUrl} 
  onError={(e) => {
    // Hide broken image, show initials
    e.currentTarget.style.display = 'none';
    const initialsDiv = e.currentTarget.nextElementSibling;
    if (initialsDiv) initialsDiv.style.display = 'flex';
  }}
/>
```

### URL Validation
- Validates URL format before saving
- Tests accessibility with HEAD requests
- Provides clear error messages for invalid URLs

## Performance Considerations

### Caching Strategy
- Existing URLs are assumed valid (no re-testing)
- Clearbit URLs are generated synchronously
- Logo testing happens asynchronously for bulk operations

### Rate Limiting
- 100ms delays between bulk operations
- HEAD requests for URL validation (lighter than full image loads)
- Sequential processing to avoid overwhelming APIs

## Fallback Chain

1. **Database URL** → Use if exists
2. **Clearbit URL** → Generate from website/name
3. **UI-Avatars** → Generated initials with random colors
4. **Local Initials** → Simple text fallback

## Integration Points

### Pages Using Logos
- Dashboard company cards
- Jobs page company columns
- Companies page listings
- Lead detail modals
- Company detail modals

### Logo Display Patterns
- **Small (32px)**: Table rows, compact cards
- **Medium (48px)**: Standard cards, lists
- **Large (64px+)**: Detail views, headers

## Troubleshooting

### Common Issues
1. **Clearbit URLs not loading**: Check domain format and accessibility
2. **LinkedIn URLs broken**: Use "Replace LinkedIn Logos" feature
3. **Slow bulk updates**: Normal behavior due to rate limiting
4. **Missing logos**: Run auto-update or check website field

### Debug Commands
```typescript
// Test specific logo URL
const isValid = await testLogoUrl('https://logo.clearbit.com/example.com');

// Generate Clearbit URL
const url = getClearbitLogo('Company Name', 'https://company.com');

// Check company data
const { data } = await supabase
  .from('companies')
  .select('name, website, profile_image_url')
  .eq('id', 'company-id');
```

## Best Practices

1. **Always provide fallbacks** for logo display
2. **Test URLs before saving** to database
3. **Use batch operations** for multiple companies
4. **Monitor logo loading** with error handlers
5. **Keep website fields updated** for better Clearbit matching

## API Limits

- **Clearbit**: Free tier, no authentication required
- **Rate Limiting**: Built-in delays prevent overwhelming
- **Caching**: Existing URLs not re-tested for performance

This system provides reliable, automatic logo management with multiple fallback strategies to ensure companies always have visual representation in the CRM.
