/**
 * Bulk People Import Service
 *
 * Handles CSV import for people (leads):
 * - CSV parsing with validation
 * - Field mapping and normalization
 * - Batch processing for performance
 * - Duplicate detection
 * - Company creation/linking
 * - Error reporting with row-level details
 *
 * Best Practices (2025):
 * - UTF-8 BOM support for Excel compatibility
 * - Flexible column mapping
 * - Progress tracking
 * - Partial success handling
 * - Data validation before insert
 */

import { supabase } from '@/integrations/supabase/client';
import { Lead } from '@/types/database';
import { findOrCreateCompany } from '@/services/companiesService';

const BATCH_SIZE = 50;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export interface ImportResult {
  success: boolean;
  successCount: number;
  errorCount: number;
  skippedCount: number;
  errors: Array<{ row: number; error: string; data?: Record<string, unknown> }>;
  warnings: Array<{ row: number; warning: string }>;
  message: string;
}

export interface CSVRow {
  [key: string]: string;
}

export interface FieldMapping {
  csvColumn: string;
  dbField: string;
  required?: boolean;
}

// Standard field mappings (flexible - user can override)
const DEFAULT_FIELD_MAPPINGS: FieldMapping[] = [
  { csvColumn: 'First Name', dbField: 'first_name', required: false },
  { csvColumn: 'Last Name', dbField: 'last_name', required: false },
  { csvColumn: 'Name', dbField: 'name', required: false }, // Will be split into first/last
  { csvColumn: 'Email', dbField: 'email', required: false },
  { csvColumn: 'Email Address', dbField: 'email', required: false },
  { csvColumn: 'Phone', dbField: 'phone', required: false },
  { csvColumn: 'Job Title', dbField: 'job_title', required: false },
  { csvColumn: 'Role', dbField: 'job_title', required: false },
  { csvColumn: 'Company', dbField: 'company', required: false },
  { csvColumn: 'Company Name', dbField: 'company', required: false },
  { csvColumn: 'Show name', dbField: 'show_name', required: false },
  { csvColumn: 'Show Name', dbField: 'show_name', required: false },
  { csvColumn: 'Show', dbField: 'show_name', required: false },
  { csvColumn: 'LinkedIn', dbField: 'linkedin_url', required: false },
  { csvColumn: 'LinkedIn URL', dbField: 'linkedin_url', required: false },
  { csvColumn: 'Status', dbField: 'status', required: false },
  { csvColumn: 'Stage', dbField: 'status', required: false },
  { csvColumn: 'Quality Rank', dbField: 'quality_rank', required: false },
];

/**
 * Parse CSV file content
 * Supports UTF-8 BOM, quoted fields, and various line endings
 */
export function parseCSV(content: string): CSVRow[] {
  // Remove UTF-8 BOM if present (Excel compatibility)
  const cleanContent = content.replace(/^\uFEFF/, '');

  const lines = cleanContent.split(/\r?\n/).filter(line => line.trim());
  if (lines.length < 2) {
    throw new Error(
      'CSV file must have at least a header row and one data row'
    );
  }

  // Parse header row
  const headers = parseCSVLine(lines[0]);

  // Parse data rows
  const rows: CSVRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length === 0) continue; // Skip empty rows

    const row: CSVRow = {};
    headers.forEach((header, index) => {
      row[header.trim()] = values[index]?.trim() || '';
    });
    rows.push(row);
  }

  return rows;
}

/**
 * Parse a single CSV line, handling quoted fields
 */
function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  // Add last field
  values.push(current);

  return values;
}

/**
 * Validate email address format
 */
function isValidEmail(email: string): boolean {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Find or create company (delegates to centralized service)
 * @deprecated Use findOrCreateCompany from @/services/companiesService directly
 */
async function findOrCreateCompanyLocal(
  companyName: string,
  website?: string
): Promise<string | null> {
  return findOrCreateCompany(companyName, { website: website || null });
}

/**
 * Validate and transform CSV row to database format
 */
async function transformRow(
  row: CSVRow,
  rowNumber: number,
  fieldMappings: FieldMapping[]
): Promise<{ data: Record<string, unknown> | null; errors: string[] }> {
  const errors: string[] = [];
  const leadData: Record<string, unknown> = {};

  // Apply field mappings
  for (const mapping of fieldMappings) {
    const csvValue = row[mapping.csvColumn];

    if (mapping.required && (!csvValue || csvValue.trim() === '')) {
      errors.push(`Required field "${mapping.csvColumn}" is missing`);
      continue;
    }

    if (csvValue && csvValue.trim() !== '') {
      switch (mapping.dbField) {
        case 'first_name':
          leadData.first_name = csvValue.trim();
          break;
        case 'last_name':
          leadData.last_name = csvValue.trim();
          break;
        case 'name': {
          // Split name into first and last
          const nameParts = csvValue.trim().split(/\s+/);
          leadData.first_name = nameParts[0] || '';
          leadData.last_name = nameParts.slice(1).join(' ') || null;
          break;
        }
        case 'email':
          if (!isValidEmail(csvValue)) {
            errors.push(`Invalid email format: ${csvValue}`);
          } else {
            leadData.email = csvValue.trim().toLowerCase();
          }
          break;
        case 'phone':
          leadData.phone = csvValue.trim();
          break;
        case 'job_title':
          leadData.job_title = csvValue.trim();
          break;
        case 'company':
          leadData.company = csvValue.trim();
          break;
        case 'show_name':
          leadData.show_name = csvValue.trim();
          break;
        case 'linkedin_url':
          leadData.linkedin_url = csvValue.trim();
          break;
        case 'status': {
          // Normalize status to valid enum values
          const status = csvValue.trim().toLowerCase();
          if (['processing', 'active', 'replied_manual'].includes(status)) {
            leadData.status = status;
          } else {
            // Map legacy statuses
            if (['new', 'new_lead'].includes(status)) {
              leadData.status = 'active';
            } else if (['replied', 'replied_manual'].includes(status)) {
              leadData.status = 'replied_manual';
            } else {
              leadData.status = 'active'; // Default
            }
          }
          break;
        }
        case 'quality_rank': {
          const rank = csvValue.trim().toLowerCase();
          if (['hot', 'warm', 'cold'].includes(rank)) {
            leadData.quality_rank = rank;
          }
          break;
        }
      }
    }
  }

  // Handle company separately - store company name in lead, optionally link to companies table
  const companyName = row['Company'] || row['Company Name'] || '';
  const companyWebsite = row['Company Website'] || row['Website'] || '';

  if (companyName && !leadData.company) {
    leadData.company = companyName;
    // Optionally create/link company
    const companyId = await findOrCreateCompanyLocal(
      companyName,
      companyWebsite
    );
    if (companyId) {
      leadData.company_id = companyId;
    }
  }

  // Set defaults
  if (!leadData.first_name && !leadData.last_name) {
    errors.push('First name or last name is required');
  }

  const now = new Date().toISOString();
  leadData.created_at = now;
  leadData.updated_at = now;
  leadData.status = leadData.status || 'active';
  leadData.enrichment_status = 'pending'; // Set to pending for automatic enrichment

  return {
    data: errors.length === 0 ? leadData : null,
    errors,
  };
}

/**
 * Check for duplicate person (by email or name+company)
 */
async function checkDuplicate(
  personData: Record<string, unknown>
): Promise<boolean> {
  try {
    if (personData.email) {
      const { data } = await supabase
        .from('leads')
        .select('id')
        .eq('email', personData.email as string)
        .limit(1);

      if (data && data.length > 0) {
        return true;
      }
    }

    // Also check by first_name + last_name + company if no email
    if (personData.first_name && personData.last_name && personData.company) {
      const { data } = await supabase
        .from('leads')
        .select('id')
        .eq('first_name', personData.first_name as string)
        .eq('last_name', personData.last_name as string)
        .eq('company', personData.company as string)
        .limit(1);

      if (data && data.length > 0) {
        return true;
      }
    }

    return false;
  } catch {
    return false;
  }
}

/**
 * Bulk Import People from CSV
 *
 * @param file - CSV file to import
 * @param fieldMappings - Optional custom field mappings (uses defaults if not provided)
 * @param skipDuplicates - Whether to skip duplicate records
 * @param onProgress - Optional progress callback
 */
export async function bulkImportPeople(
  file: File,
  fieldMappings: FieldMapping[] = DEFAULT_FIELD_MAPPINGS,
  skipDuplicates: boolean = true,
  onProgress?: (progress: { processed: number; total: number }) => void
): Promise<ImportResult> {
  const errors: Array<{
    row: number;
    error: string;
    data?: Record<string, unknown>;
  }> = [];
  const warnings: Array<{ row: number; warning: string }> = [];
  let successCount = 0;
  let skippedCount = 0;

  try {
    // Get current user for user_id assignment
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        successCount: 0,
        errorCount: 0,
        skippedCount: 0,
        errors: [
          {
            row: 0,
            error: 'User not authenticated. Please sign in to import leads.',
          },
        ],
        warnings: [],
        message: 'Authentication required',
      };
    }

    const userId = user.id;
    // Validate file
    if (file.size > MAX_FILE_SIZE) {
      return {
        success: false,
        successCount: 0,
        errorCount: 0,
        skippedCount: 0,
        errors: [
          {
            row: 0,
            error: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`,
          },
        ],
        warnings: [],
        message: 'File too large',
      };
    }

    if (!file.name.endsWith('.csv')) {
      return {
        success: false,
        successCount: 0,
        errorCount: 0,
        skippedCount: 0,
        errors: [{ row: 0, error: 'File must be a CSV file' }],
        warnings: [],
        message: 'Invalid file type',
      };
    }

    // Read file
    const content = await file.text();
    const rows = parseCSV(content);

    if (rows.length === 0) {
      return {
        success: false,
        successCount: 0,
        errorCount: 0,
        skippedCount: 0,
        errors: [{ row: 0, error: 'CSV file is empty or has no data rows' }],
        warnings: [],
        message: 'No data to import',
      };
    }

    // Process rows in batches
    const batches: Record<string, unknown>[][] = [];
    let currentBatch: Record<string, unknown>[] = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNumber = i + 2; // +2 because row 1 is header, and we're 0-indexed

      const { data: personData, errors: rowErrors } = await transformRow(
        row,
        rowNumber,
        fieldMappings
      );

      if (rowErrors.length > 0) {
        errors.push({
          row: rowNumber,
          error: rowErrors.join('; '),
          data: personData || undefined,
        });
        continue;
      }

      if (!personData) {
        errors.push({
          row: rowNumber,
          error: 'Failed to transform row data',
        });
        continue;
      }

      // Check for duplicates
      if (skipDuplicates) {
        const isDuplicate = await checkDuplicate(personData);
        if (isDuplicate) {
          skippedCount++;
          warnings.push({
            row: rowNumber,
            warning: 'Duplicate record skipped',
          });
          continue;
        }
      }

      // Add user_id to each lead
      personData.user_id = userId;
      currentBatch.push(personData);

      if (currentBatch.length >= BATCH_SIZE) {
        batches.push(currentBatch);
        currentBatch = [];
      }

      // Report progress
      if (onProgress) {
        onProgress({ processed: i + 1, total: rows.length });
      }
    }

    // Add remaining batch
    if (currentBatch.length > 0) {
      batches.push(currentBatch);
    }

    // Insert batches and trigger enrichment
    const createdLeads: Array<{
      id: string;
      email: string | null;
      company: string | null;
      first_name: string | null;
      last_name: string | null;
    }> = [];
    for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
      const batch = batches[batchIndex];
      const { data: insertedLeads, error } = await supabase
        .from('leads')
        .insert(batch)
        .select('id, email, company, first_name, last_name');

      if (error) {
        // More accurate row calculation for batch errors
        const startRow = batchIndex * BATCH_SIZE + 2; // +2 for header row and 0-index
        batch.forEach((_, index) => {
          errors.push({
            row: startRow + index,
            error: error.message,
          });
        });
      } else {
        successCount += batch.length;
        // Collect lead data for enrichment
        if (insertedLeads) {
          createdLeads.push(...insertedLeads);
        }
      }
    }

    // Trigger automatic enrichment for all successfully imported leads
    // Batch enrichment triggers for better performance
    if (createdLeads.length > 0) {
      const { triggerEnrichmentWebhook } =
        await import('@/services/enrichLeadWebhook');

      // Trigger enrichment for all leads in parallel (fire-and-forget)
      // Using Promise.allSettled to handle all promises without blocking
      Promise.allSettled(
        createdLeads.map(lead =>
          triggerEnrichmentWebhook({
            lead_id: lead.id,
            company: lead.company || undefined,
            email: lead.email || undefined,
            first_name: lead.first_name || undefined,
            last_name: lead.last_name || undefined,
            linkedin_url: null,
          })
        )
      ).then(results => {
        // Log any failures but don't fail import
        results.forEach((result, index) => {
          if (result.status === 'rejected') {
            console.error(
              `Failed to trigger enrichment for lead ${createdLeads[index]?.id}:`,
              result.reason
            );
          }
        });
      });
    }

    const errorCount = errors.length;
    const hasErrors = errorCount > 0;
    const hasWarnings = warnings.length > 0;

    return {
      success: !hasErrors && successCount > 0,
      successCount,
      errorCount,
      skippedCount,
      errors,
      warnings,
      message: hasErrors
        ? `Imported ${successCount} people with ${errorCount} errors${hasWarnings ? ` and ${warnings.length} warnings` : ''}`
        : `Successfully imported ${successCount} people${hasWarnings ? ` (${warnings.length} skipped as duplicates)` : ''}`,
    };
  } catch (error) {
    return {
      success: false,
      successCount,
      errorCount: errors.length + 1,
      skippedCount,
      errors: [...errors, { row: 0, error: (error as Error).message }],
      warnings,
      message: `Import failed: ${(error as Error).message}`,
    };
  }
}
