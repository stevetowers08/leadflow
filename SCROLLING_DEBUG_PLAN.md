# Scrolling Issue - Debug Plan

## Research Findings

**Critical Requirements for Scrolling:**

1. Container MUST have explicit height constraint (not `height: auto`)
2. Content MUST exceed container height
3. No ancestor with `overflow: hidden` blocking scroll
4. `flex-1 min-h-0` chain must be complete in flexbox layouts

## Current Height Chain Analysis

```
1. Layout outer: `h-screen overflow-hidden` ✅
2. Layout main: `h-full flex flex-col` ✅
3. Layout inner: `flex-1 min-h-0` ✅
4. Page outer: `flex flex-col flex-1 min-h-0 overflow-hidden` ✅
5. Page content: `flex-1 overflow-y-auto` ✅

BUT: Content div needs to have constrained height to trigger scroll!
```

## Diagnostic Steps (Do NOT code yet)

### Step 1: Browser DevTools Inspection

Open Dashboard page and inspect:

1. **Check Page outer div:**
   - Computed `height`: Should be a number (e.g., `600px`), NOT `auto`
   - Computed `overflow`: Should be `hidden` (correct)

2. **Check Page content div (the scroll container):**
   - Computed `height`: Should be a number, NOT `auto`
   - Computed `overflow-y`: Should be `auto`
   - Content height vs container height: Content should be taller

3. **Check for conflicts:**
   - Look for any ancestor with `overflow: hidden` (other than Layout outer)
   - Check if `min-h-0` is actually applied (check computed `min-height`)

### Step 2: Verify Content Actually Overflows

Add temporary test to Dashboard.tsx:

```tsx
<div style={{ height: '2000px', background: 'red' }}>
  TEST: This should make page scroll
</div>
```

If this doesn't scroll, the issue is container height constraint.
If this DOES scroll, the issue is actual content not being tall enough.

### Step 3: Check CSS Specificity

- Use DevTools "Computed" tab to see ALL applied styles
- Look for overrides of `overflow`, `height`, `min-height`

## Likely Root Causes (Based on Research)

1. **Missing explicit height**: Container has `flex-1 min-h-0` but browser isn't computing actual height
2. **Ancestor overflow conflict**: Some parent has `overflow: hidden` blocking scroll
3. **Content not actually overflowing**: Content height equals container height (no scroll needed)
4. **CSS specificity**: Some global style overriding our overflow settings

## Next Steps

1. **FIRST**: Run diagnostic steps above
2. **THEN**: Based on findings, apply ONE targeted fix
3. **TEST**: Verify before making more changes

## Proven Pattern from Codebase

Settings.tsx (WORKING):

```
Parent: `flex bg-white h-full overflow-hidden`
Child: `flex-1 overflow-y-auto`
```

Key difference: Settings uses `h-full` on parent, not `flex-1 min-h-0`
