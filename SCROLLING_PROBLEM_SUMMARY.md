# Scrolling Problem Summary

## The Core Issue

The Jobs Feed page (and other table pages) is not scrolling vertically. The table content is expanding beyond the viewport instead of being constrained and scrollable.

## Root Cause

The Page Component (`src/design-system/components.tsx`) is expanding beyond its parent container:

- **Parent (Padding Container)**: `height: 731.2px` ✅
- **Page Component**: `height: 779.2px` ❌ (48px too tall)
- **UnifiedTable Outer**: `height: 1273.6px` ❌ (way too tall, should be ~650px)

The Page Component uses `flex-1` which allows it to grow to fit content instead of being constrained by its parent. This breaks the height chain, allowing UnifiedTable to expand to full content height instead of being scrollable.

## Why It Happens

1. **Layout Structure**: Fixed positioning with `top/bottom` creates a constrained `main` element (731.2px)
2. **Padding Container**: Has `h-full flex flex-col overflow-hidden` which should constrain children
3. **Page Component**: Uses `flex-1 min-h-0` which should work, but `flex-1` in flex containers can still expand if content is larger
4. **Height Chain Break**: When Page Component expands to 779px, UnifiedTable gets no height constraint, so it grows to fit all rows (1273px)

## What Was Attempted

- Added `overflow-hidden` to Page Component
- Added `max-h-full` to Page Component
- Changed from `h-full` to `flex-1` and back
- Added `min-h-0` throughout the chain
- Simplified to match People.tsx pattern

## Current State

Console logs show:

- Padding Container: `height: 731.2px, firstChild height: 779.2px, overflow: hidden`
- UnifiedTable Scroll Container: `height: 1272px, scrollHeight: 1261px, canScroll: false`

The Page Component is still expanding, preventing UnifiedTable from being properly constrained and scrollable.

## Solution Needed

The Page Component needs to be absolutely constrained to its parent's height (731.2px - padding = ~683px), not allowed to expand. UnifiedTable should then receive a constrained height and enable scrolling when content exceeds that height.
