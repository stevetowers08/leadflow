import { format } from 'date-fns';

export interface ExportOptions {
  filename?: string;
  includeHeaders?: boolean;
  dateFormat?: string;
  columns?: string[];
  excludeColumns?: string[];
}

export interface ExportableItem {
  [key: string]: any;
}

// CSV Export functionality
export function exportToCSV<T extends ExportableItem>(
  data: T[],
  options: ExportOptions = {}
): void {
  const {
    filename = `export-${format(new Date(), 'yyyy-MM-dd-HH-mm-ss')}.csv`,
    includeHeaders = true,
    columns,
    excludeColumns = ['id', 'created_at', 'updated_at']
  } = options;

  if (data.length === 0) {
    throw new Error('No data to export');
  }

  // Determine which columns to export
  const allColumns = Object.keys(data[0]);
  const exportColumns = columns || allColumns.filter(col => !excludeColumns.includes(col));

  // Create CSV content
  let csvContent = '';

  // Add headers
  if (includeHeaders) {
    csvContent += exportColumns.map(col => `"${col}"`).join(',') + '\n';
  }

  // Add data rows
  data.forEach(item => {
    const row = exportColumns.map(col => {
      const value = item[col];
      if (value === null || value === undefined) {
        return '""';
      }
      // Escape quotes and wrap in quotes
      const stringValue = String(value).replace(/"/g, '""');
      return `"${stringValue}"`;
    }).join(',');
    csvContent += row + '\n';
  });

  // Download file
  downloadFile(csvContent, filename, 'text/csv');
}

// Excel Export functionality (using CSV format with .xlsx extension for simplicity)
export function exportToExcel<T extends ExportableItem>(
  data: T[],
  options: ExportOptions = {}
): void {
  const {
    filename = `export-${format(new Date(), 'yyyy-MM-dd-HH-mm-ss')}.xlsx`,
    includeHeaders = true,
    columns,
    excludeColumns = ['id', 'created_at', 'updated_at']
  } = options;

  if (data.length === 0) {
    throw new Error('No data to export');
  }

  // Determine which columns to export
  const allColumns = Object.keys(data[0]);
  const exportColumns = columns || allColumns.filter(col => !excludeColumns.includes(col));

  // Create Excel content (simplified - in a real app you'd use a library like xlsx)
  let excelContent = '';

  // Add headers
  if (includeHeaders) {
    excelContent += exportColumns.join('\t') + '\n';
  }

  // Add data rows
  data.forEach(item => {
    const row = exportColumns.map(col => {
      const value = item[col];
      if (value === null || value === undefined) {
        return '';
      }
      return String(value).replace(/\t/g, ' '); // Replace tabs to avoid Excel issues
    }).join('\t');
    excelContent += row + '\n';
  });

  // Download file
  downloadFile(excelContent, filename, 'application/vnd.ms-excel');
}

// JSON Export functionality
export function exportToJSON<T extends ExportableItem>(
  data: T[],
  options: ExportOptions = {}
): void {
  const {
    filename = `export-${format(new Date(), 'yyyy-MM-dd-HH-mm-ss')}.json`,
    columns,
    excludeColumns = ['id', 'created_at', 'updated_at']
  } = options;

  if (data.length === 0) {
    throw new Error('No data to export');
  }

  // Determine which columns to export
  const allColumns = Object.keys(data[0]);
  const exportColumns = columns || allColumns.filter(col => !excludeColumns.includes(col));

  // Filter data to only include selected columns
  const filteredData = data.map(item => {
    const filteredItem: any = {};
    exportColumns.forEach(col => {
      filteredItem[col] = item[col];
    });
    return filteredItem;
  });

  // Create JSON content
  const jsonContent = JSON.stringify(filteredData, null, 2);

  // Download file
  downloadFile(jsonContent, filename, 'application/json');
}

// Generic file download utility
function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

// Export all formats
export function exportData<T extends ExportableItem>(
  data: T[],
  format: 'csv' | 'excel' | 'json' = 'csv',
  options: ExportOptions = {}
): void {
  switch (format) {
    case 'csv':
      exportToCSV(data, options);
      break;
    case 'excel':
      exportToExcel(data, options);
      break;
    case 'json':
      exportToJSON(data, options);
      break;
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
}

// Utility to format data for export (clean up complex objects)
export function formatDataForExport<T extends ExportableItem>(data: T[]): T[] {
  return data.map(item => {
    const formattedItem: any = {};
    Object.keys(item).forEach(key => {
      const value = item[key];
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        // Convert objects to strings
        formattedItem[key] = JSON.stringify(value);
      } else if (Array.isArray(value)) {
        // Convert arrays to comma-separated strings
        formattedItem[key] = value.join(', ');
      } else {
        formattedItem[key] = value;
      }
    });
    return formattedItem as T;
  });
}

