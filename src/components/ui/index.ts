/**
 * Reusable UI Components Index
 * 2025 Best Practices - Accessibility, Performance, Modern Design
 * 
 * These components extend and work alongside shadcn/ui components:
 * - Uses shadcn's Badge, Input, Label, Card primitives
 * - Follows shadcn patterns (forwardRef, CVA, Radix UI)
 * - Compatible with existing shadcn form components
 */

// Status & Badges (extends shadcn Badge)
export { StatusBadge, statusBadgeVariants } from './status-badge';
export type { StatusBadgeProps } from './status-badge';

// Empty States
export { EmptyState } from './empty-state';
export type { EmptyStateProps } from './empty-state';

// Loading States (uses shadcn Skeleton)
export { SkeletonLoader } from './skeleton-loader';
export type { SkeletonLoaderProps } from './skeleton-loader';

// Action Components (uses shadcn Button)
export { ActionButtonGroup } from './action-button-group';
export type { ActionButtonGroupProps, ActionButton } from './action-button-group';

// Interactive Components (uses shadcn Card)
export { InteractiveCard } from './interactive-card';
export type { InteractiveCardProps } from './interactive-card';

// Search Components (extends shadcn Input)
export { EnhancedSearchInput } from './enhanced-search-input';
export type { EnhancedSearchInputProps } from './enhanced-search-input';

// Data Display (uses shadcn Card)
export { StatCard } from './stat-card';
export type { StatCardProps } from './stat-card';

// Form Components (uses shadcn Label, works alongside shadcn FormField)
export { FieldWrapper, FormFieldWrapper } from './form-field';
export type { FieldWrapperProps } from './form-field';

// Layout Components
export { Container, Section } from './container';
export type { ContainerProps, SectionProps } from './container';

