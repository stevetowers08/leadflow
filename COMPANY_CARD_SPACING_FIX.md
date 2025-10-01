# Company Card Spacing and DOM Nesting Fix

## Issues Fixed

### 1. DOM Nesting Warning
- **Problem**: `<div> cannot appear as a descendant of <p>` warning
- **Cause**: Clickable component was creating nested div structure inside paragraph elements
- **Solution**: Replaced Clickable component with direct div element with conditional styling

### 2. Spacing Issues
- **Problem**: Extra spacing above company logo and name
- **Cause**: Clickable component's `size="md"` was adding `p-3` (12px) padding
- **Solution**: Replaced with minimal `p-2` padding only when clickable

## Changes Made

### Before (Problematic):
```tsx
<Clickable
  onClick={handleCompanyClick}
  variant="card"
  size="md"  // This added p-3 padding
  aria-label={`View ${company.name} company details`}
>
  <div>...</div>  // Nested div causing DOM warning
</Clickable>
```

### After (Fixed):
```tsx
<div 
  className={`flex items-center gap-3 ${handleCompanyClick ? 'cursor-pointer hover:bg-gray-50 transition-colors duration-200 rounded-lg p-2' : ''}`}
  onClick={handleCompanyClick}
  role={handleCompanyClick ? 'button' : undefined}
  tabIndex={handleCompanyClick ? 0 : undefined}
  aria-label={handleCompanyClick ? `View ${company.name} company details` : undefined}
>
  {/* Direct content without nested Clickable */}
</div>
```

## Benefits

1. ✅ **Eliminated DOM nesting warning** - No more nested divs inside paragraphs
2. ✅ **Reduced spacing** - Changed from `p-3` (12px) to `p-2` (8px) padding
3. ✅ **Maintained accessibility** - Kept all ARIA attributes and keyboard navigation
4. ✅ **Preserved functionality** - Click handlers and hover effects still work
5. ✅ **Better alignment** - Now matches lead card spacing exactly

## Files Modified
- `src/components/popup/CompanyInfoCard.tsx`

## Result
The company card now has:
- ✅ No DOM nesting warnings
- ✅ Proper spacing alignment with lead card
- ✅ Website and LinkedIn icons next to company name
- ✅ Same logo size as lead card (48px x 48px)
- ✅ Same text size as lead name (18px)
- ✅ Clean, accessible click functionality
