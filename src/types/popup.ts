/**
 * TypeScript interfaces for popup components
 * Replaces any[] types with proper type definitions
 */

import { Tables } from '@/integrations/supabase/types';

// Base types from Supabase
export type Company = Tables<'companies'>;
export type Contact = Tables<'contacts'>;
export type Job = Tables<'jobs'>;
// Interaction type removed - table no longer exists
// export type Interaction = Tables<'interactions'>;

// Legacy alias for backward compatibility during migration
export type Person = Contact;

// Popup-specific types
export interface PopupLead extends Contact {
  company?: Company;
  // interactions?: Interaction[]; // Removed - interactions table no longer exists
}

export interface PopupJob extends Job {
  company?: Company;
  relatedLeads?: PopupLead[];
}

export interface PopupCompany extends Company {
  relatedLeads?: PopupLead[];
  relatedJobs?: PopupJob[];
}

// Selected items for bulk operations
export interface SelectedLead extends PopupLead {
  selected?: boolean;
}

export interface SelectedJob extends PopupJob {
  selected?: boolean;
}

// Popup data interfaces
export interface PopupData {
  company?: PopupCompany;
  lead?: PopupLead;
  job?: PopupJob;
  relatedLeads?: PopupLead[];
  relatedJobs?: PopupJob[];
  relatedCompanies?: PopupCompany[];
  errorRelatedLeads?: Error | null;
  errorRelatedJobs?: Error | null;
  errorRelatedCompanies?: Error | null;
}

// Column definitions for tables
export interface TableColumn<T = unknown> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
  minWidth?: number;
  maxWidth?: number;
}

// Bulk action types
export interface BulkAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick: (selectedItems: unknown[]) => void;
  variant?: 'default' | 'destructive' | 'outline';
  disabled?: boolean;
}

// Filter types
export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface FilterState {
  [key: string]: string | string[];
}

// Search and filter hooks
export interface SearchFilterState {
  searchTerm: string;
  filters: FilterState;
  debouncedSearchTerm: string;
  hasActiveFilters: boolean;
}

// Performance metrics
export interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  itemCount: number;
  errorCount: number;
  totalTime?: number;
}

// Error handling
export interface ErrorInfo {
  id: string;
  message: string;
  stack?: string;
  timestamp: Date;
  context?: Record<string, unknown>;
  severity: 'low' | 'medium' | 'high' | 'critical';
  resolved?: boolean;
}

// API response types
export interface ApiResponse<T = unknown> {
  data: T | null;
  error: Error | null;
  loading: boolean;
}

// Pagination
export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

// Virtual scrolling
export interface VirtualScrollOptions {
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
  threshold?: number;
}

// Realtime subscription
export interface RealtimeSubscription {
  table: string;
  event: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  filter?: string;
  callback: (payload: unknown) => void;
}

// Automation types
export interface AutomationMessage {
  id: string;
  content: string;
  type: 'linkedin' | 'email';
  template?: string;
}

export interface AutomationActivity {
  id: string;
  leadId: string;
  type: string;
  status: 'pending' | 'completed' | 'failed';
  message?: string;
  timestamp: Date;
}

// AI optimization types
export interface LeadOptimization {
  leadId: string;
  estimated_response_rate: number;
  suggested_actions: string[];
  confidence_score: number;
  reasoning: string;
}

export interface OptimizationStats {
  totalLeads: number;
  optimizedLeads: number;
  avgResponseRate: number;
  topPerformingActions: string[];
  aiInsights: string[];
}
