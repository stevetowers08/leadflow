/**
 * String Constants
 * Centralized user-facing strings, error messages, and labels
 * Use these instead of hardcoded strings throughout the app
 */

export const ERROR_MESSAGES = {
  GENERIC: 'An error occurred. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION: 'Please check your input and try again.',
  SERVER: 'Server error. Please try again later.',
  TIMEOUT: 'Request timed out. Please try again.',
} as const;

export const SUCCESS_MESSAGES = {
  SAVED: 'Changes saved successfully.',
  DELETED: 'Item deleted successfully.',
  CREATED: 'Item created successfully.',
  UPDATED: 'Item updated successfully.',
  ASSIGNED: 'Assignment updated successfully.',
} as const;

export const LOADING_MESSAGES = {
  DEFAULT: 'Loading...',
  SAVING: 'Saving...',
  DELETING: 'Deleting...',
  LOADING_DATA: 'Loading data...',
  PROCESSING: 'Processing...',
} as const;

export const PLACEHOLDER_TEXT = {
  SEARCH: 'Search...',
  EMAIL: 'Enter email address',
  NAME: 'Enter name',
  COMPANY: 'Enter company name',
  WEBSITE: 'https://example.com',
  LOGO: 'https://example.com/logo.png',
  WEBHOOK: 'https://your-webhook-url.com/chat',
} as const;

export const LABELS = {
  // Common actions
  SAVE: 'Save',
  CANCEL: 'Cancel',
  DELETE: 'Delete',
  EDIT: 'Edit',
  ADD: 'Add',
  REMOVE: 'Remove',
  CLOSE: 'Close',
  RETRY: 'Retry',
  RELOAD: 'Reload Page',
  
  // Status labels
  ALL_STAGES: 'All Stages',
  SORT_BY: 'Sort by',
  ALL: 'All',
  
  // Time periods
  LAST_7_DAYS: 'Last 7 days',
  LAST_30_DAYS: 'Last 30 days',
  LAST_90_DAYS: 'Last 90 days',
  
  // Reporting
  EXPORT_CSV: 'Export to CSV',
  REFRESH: 'Refresh',
  
  // Errors
  FAILED_TO_LOAD: 'Failed to Load',
  TRY_AGAIN: 'Please try again.',
} as const;

export const CONFIRMATION_MESSAGES = {
  DELETE: 'Are you sure you want to delete this item? This action cannot be undone.',
  ASSIGNMENT: 'Are you sure you want to change the assignment for this item?',
  SIGNOUT: 'Are you sure you want to sign out? You will need to sign in again to access your account.',
  SAVE: 'Are you sure you want to save these changes?',
  AUTOMATION: 'Are you sure you want to start the automation process? This will begin contacting the selected leads.',
} as const;








