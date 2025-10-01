# Company Card Alignment Updates

## Changes Made

### 1. Logo Size Alignment
- **Before**: `w-20 h-20` (80px x 80px) with `w-12 h-12` icon
- **After**: `w-12 h-12` (48px x 48px) with `w-8 h-8` icon
- **Reason**: Match the lead card logo dimensions exactly

### 2. Company Name Text Size Alignment  
- **Before**: `text-xl` (20px)
- **After**: `text-lg` (18px)
- **Reason**: Match the lead name text size exactly

### 3. Website and LinkedIn Icons
- **Added**: Website icon using `Globe` from lucide-react
- **Added**: LinkedIn icon next to company name
- **Position**: Directly next to company name, same as lead card pattern
- **Layout**: Changed from 3-column to 2-column grid

## Visual Consistency Achieved

The company card now has:
- ✅ Same logo size as lead card (48px x 48px)
- ✅ Same company name text size as lead name (18px)
- ✅ Website and LinkedIn icons positioned next to company name
- ✅ Consistent spacing and alignment with lead card
- ✅ Proper website icon (Globe) instead of generic image

## Files Modified
- `src/components/popup/CompanyInfoCard.tsx`

## Result
The company card now perfectly aligns with the lead card in terms of:
- Logo dimensions
- Text sizing
- Icon positioning
- Overall visual hierarchy
