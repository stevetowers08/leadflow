/**
 * Export Service
 * 
 * PDR Section: Phase 3 - Analytics & Polish
 * Handles exporting leads data to CSV/JSON formats
 */

import { supabase } from '@/integrations/supabase/client';

export interface ExportOptions {
  format: 'csv' | 'json';
  fields?: string[];
  filters?: {
    status?: string;
    qualityRank?: string;
    dateFrom?: string;
    dateTo?: string;
  };
}

/**
 * Export leads to CSV format
 */
export async function exportLeadsToCSV(options: ExportOptions = { format: 'csv' }): Promise<string> {
  let query = supabase.from('leads').select('*');

  // Apply filters
  if (options.filters?.status) {
    query = query.eq('status', options.filters.status);
  }
  if (options.filters?.qualityRank) {
    query = query.eq('quality_rank', options.filters.qualityRank);
  }
  if (options.filters?.dateFrom) {
    query = query.gte('created_at', options.filters.dateFrom);
  }
  if (options.filters?.dateTo) {
    query = query.lte('created_at', options.filters.dateTo);
  }

  const { data: leads, error } = await query.order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to export leads: ${error.message}`);
  }

  if (!leads || leads.length === 0) {
    return 'No leads to export';
  }

  // Define CSV headers
  const headers = options.fields || [
    'first_name',
    'last_name',
    'email',
    'company',
    'job_title',
    'quality_rank',
    'status',
    'created_at',
  ];

  // Create CSV rows
  const csvRows = [
    headers.join(','), // Header row
    ...leads.map((lead) =>
      headers
        .map((field) => {
          const value = (lead as any)[field] || '';
          // Escape commas and quotes in CSV
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        })
        .join(',')
    ),
  ];

  return csvRows.join('\n');
}

/**
 * Export leads to JSON format
 */
export async function exportLeadsToJSON(options: ExportOptions = { format: 'json' }): Promise<string> {
  let query = supabase.from('leads').select('*');

  // Apply filters
  if (options.filters?.status) {
    query = query.eq('status', options.filters.status);
  }
  if (options.filters?.qualityRank) {
    query = query.eq('quality_rank', options.filters.qualityRank);
  }
  if (options.filters?.dateFrom) {
    query = query.gte('created_at', options.filters.dateFrom);
  }
  if (options.filters?.dateTo) {
    query = query.lte('created_at', options.filters.dateTo);
  }

  const { data: leads, error } = await query.order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to export leads: ${error.message}`);
  }

  // Filter fields if specified
  if (options.fields && leads) {
    return JSON.stringify(
      leads.map((lead) => {
        const filtered: any = {};
        options.fields!.forEach((field) => {
          filtered[field] = (lead as any)[field];
        });
        return filtered;
      }),
      null,
      2
    );
  }

  return JSON.stringify(leads || [], null, 2);
}

/**
 * Download exported data as file
 */
export function downloadExport(data: string, filename: string, mimeType: string): void {
  const blob = new Blob([data], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}


