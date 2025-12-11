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
import { Person } from '@/types/database';
import { normalizePeopleStage } from '@/utils/statusUtils';

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
  { csvColumn: 'Name', dbField: 'name', required: true },
  { csvColumn: 'Email', dbField: 'email_address', required: false },
  { csvColumn: 'Email Address', dbField: 'email_address', required: false },
  { csvColumn: 'Role', dbField: 'company_role', required: false },
  { csvColumn: 'Company Role', dbField: 'company_role', required: false },
  { csvColumn: 'Location', dbField: 'employee_location', required: false },
  { csvColumn: 'Employee Location', dbField: 'employee_location', required: false },
  { csvColumn: 'Company', dbField: 'company_name', required: false },
  { csvColumn: 'Company Name', dbField: 'company_name', required: false },
  { csvColumn: 'Company Website', dbField: 'company_website', required: false },
  { csvColumn: 'Website', dbField: 'company_website', required: false },
  { csvColumn: 'LinkedIn', dbField: 'linkedin_url', required: false },
  { csvColumn: 'LinkedIn URL', dbField: 'linkedin_url', required: false },
  { csvColumn: 'Stage', dbField: 'people_stage', required: false },
  { csvColumn: 'Score', dbField: 'score', required: false },
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
    throw new Error('CSV file must have at least a header row and one data row');
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
 * Normalize stage value to match database enum
 * Uses the normalizePeopleStage utility for consistency
 */
function normalizeStage(stage: string | null | undefined): string | null {
  if (!stage) return null;
  
  // Use the centralized utility function for consistency
  const normalized = normalizePeopleStage(stage);
  return normalized || null;
}

/**
 * Find or create company
 */
async function findOrCreateCompany(
  companyName: string,
  website?: string
): Promise<string | null> {
  if (!companyName) return null;

  try {
    // Try to find existing company
    const { data: existing, error: findError } = await supabase
      .from('companies')
      .select('id')
      .ilike('name', companyName)
      .limit(1)
      .single();

    if (existing && !findError) {
      return existing.id;
    }

    // Get current user for owner_id (RLS compliance)
    let ownerId: string | null = null;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      ownerId = user?.id || null;
    } catch {
      // If auth fails, owner_id will be null
    }

    // Create new company
    const { data: newCompany, error: createError } = await supabase
      .from('companies')
      .insert({
        name: companyName,
        website: website || null,
        owner_id: ownerId,
        created_at: new Date().toISOString(),
      })
      .select('id')
      .single();

    if (createError || !newCompany) {
      console.error('Error creating company:', createError);
      return null;
    }

    return newCompany.id;
  } catch (error) {
    console.error('Error in findOrCreateCompany:', error);
    return null;
  }
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
  const personData: Record<string, unknown> = {};

  // Apply field mappings
  for (const mapping of fieldMappings) {
    const csvValue = row[mapping.csvColumn];
    
    if (mapping.required && (!csvValue || csvValue.trim() === '')) {
      errors.push(`Required field "${mapping.csvColumn}" is missing`);
      continue;
    }

    if (csvValue && csvValue.trim() !== '') {
      switch (mapping.dbField) {
        case 'name':
          personData.name = csvValue.trim();
          break;
        case 'email_address':
          if (!isValidEmail(csvValue)) {
            errors.push(`Invalid email format: ${csvValue}`);
          } else {
            personData.email_address = csvValue.trim().toLowerCase();
          }
          break;
        case 'company_role':
          personData.company_role = csvValue.trim();
          break;
        case 'employee_location':
          personData.employee_location = csvValue.trim();
          break;
        case 'linkedin_url':
          personData.linkedin_url = csvValue.trim();
          break;
        case 'people_stage': {
          const normalizedStage = normalizeStage(csvValue);
          if (normalizedStage) {
            personData.people_stage = normalizedStage;
          }
          break;
        }
        case 'score': {
          const score = parseFloat(csvValue);
          if (!isNaN(score)) {
            personData.score = score;
          }
          break;
        }
        case 'company_name':
        case 'company_website':
          // These will be handled separately for company creation
          break;
      }
    }
  }

  // Handle company separately
  const companyName = row['Company'] || row['Company Name'] || '';
  const companyWebsite = row['Company Website'] || row['Website'] || '';
  
  if (companyName) {
    const companyId = await findOrCreateCompany(companyName, companyWebsite);
    if (companyId) {
      personData.company_id = companyId;
    }
  }

  // Set defaults
  if (!personData.name) {
    errors.push('Name is required');
  }

  personData.created_at = new Date().toISOString();
  personData.people_stage = personData.people_stage || 'new_lead';

  // Get current user for owner_id (RLS compliance)
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      personData.owner_id = user.id;
    }
  } catch {
    // If auth fails, owner_id will be null (RLS will handle)
  }

  return {
    data: errors.length === 0 ? personData : null,
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
    if (personData.email_address) {
      const { data } = await supabase
        .from('people')
        .select('id')
        .eq('email_address', personData.email_address as string)
        .limit(1);
      
      if (data && data.length > 0) {
        return true;
      }
    }

    // Also check by name + company if no email
    if (personData.name && personData.company_id) {
      const { data } = await supabase
        .from('people')
        .select('id')
        .eq('name', personData.name as string)
        .eq('company_id', personData.company_id as string)
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
  const errors: Array<{ row: number; error: string; data?: Record<string, unknown> }> = [];
  const warnings: Array<{ row: number; warning: string }> = [];
  let successCount = 0;
  let skippedCount = 0;

  try {
    // Validate file
    if (file.size > MAX_FILE_SIZE) {
      return {
        success: false,
        successCount: 0,
        errorCount: 0,
        skippedCount: 0,
        errors: [{ row: 0, error: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit` }],
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

    // Insert batches
    for (const batch of batches) {
      const { error } = await supabase.from('people').insert(batch);

      if (error) {
        batch.forEach((_, index) => {
          errors.push({
            row: batches.indexOf(batch) * BATCH_SIZE + index + 2,
            error: error.message,
          });
        });
      } else {
        successCount += batch.length;
      }
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
      errors: [
        ...errors,
        { row: 0, error: (error as Error).message },
      ],
      warnings,
      message: `Import failed: ${(error as Error).message}`,
    };
  }
}

