/**
 * Design Tokens Index
 * Central export for all design tokens
 *
 * Usage:
 * import { colorTokens, spacingTokens, typographyTokens } from '@/lib/design-tokens';
 */

export * from './colors';
export * from './spacing';
export * from './typography';
export * from './borders';
export * from './shadows';
export * from './animations';
export * from './accessibility';

// Re-export all tokens for convenience
export { colorTokens } from './colors';
export { spacingTokens } from './spacing';
export { typographyTokens } from './typography';
export { borderTokens } from './borders';
export { shadowTokens } from './shadows';
export { animationTokens } from './animations';
export { accessibilityTokens } from './accessibility';
