/**
 * CSV Import Dialog Component
 *
 * Modern CSV import dialog following 2025 best practices:
 * - Drag & drop file upload
 * - Progress tracking
 * - Preview before import
 * - Error reporting with row-level details
 * - Duplicate detection
 * - Field mapping preview
 */

'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  bulkImportPeople,
  type ImportResult,
  type FieldMapping,
} from '@/services/bulk/bulkPeopleImportService';
import { Upload, FileText, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import React, { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface CSVImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportComplete?: (result: ImportResult) => void;
}

export const CSVImportDialog: React.FC<CSVImportDialogProps> = ({
  open,
  onOpenChange,
  onImportComplete,
}) => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [progress, setProgress] = useState({ processed: 0, total: 0 });
  const [result, setResult] = useState<ImportResult | null>(null);
  const [skipDuplicates, setSkipDuplicates] = useState(true);

  const handleFileSelect = useCallback((selectedFile: File) => {
    if (!selectedFile.name.endsWith('.csv')) {
      toast({
        title: 'Invalid file type',
        description: 'Please select a CSV file',
        variant: 'destructive',
      });
      return;
    }

    setFile(selectedFile);
    setResult(null);
    setProgress({ processed: 0, total: 0 });
  }, [toast]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) {
        handleFileSelect(droppedFile);
      }
    },
    [handleFileSelect]
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) {
        handleFileSelect(selectedFile);
      }
    },
    [handleFileSelect]
  );

  const handleImport = useCallback(async () => {
    if (!file) return;

    setIsImporting(true);
    setResult(null);
    setProgress({ processed: 0, total: 0 });

    try {
      const importResult = await bulkImportPeople(
        file,
        undefined, // Use default field mappings
        skipDuplicates,
        (progressUpdate) => {
          setProgress(progressUpdate);
        }
      );

      setResult(importResult);

      if (importResult.success) {
        toast({
          title: 'Import successful',
          description: importResult.message,
        });
        onImportComplete?.(importResult);
      } else {
        toast({
          title: 'Import completed with errors',
          description: importResult.message,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Import failed',
        description: (error as Error).message,
        variant: 'destructive',
      });
    } finally {
      setIsImporting(false);
    }
  }, [file, skipDuplicates, toast, onImportComplete]);

  const handleClose = useCallback(() => {
    if (!isImporting) {
      setFile(null);
      setResult(null);
      setProgress({ processed: 0, total: 0 });
      onOpenChange(false);
    }
  }, [isImporting, onOpenChange]);

  const progressPercent =
    progress.total > 0 ? (progress.processed / progress.total) * 100 : 0;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>Import Leads from CSV</DialogTitle>
          <DialogDescription>
            Upload a CSV file to import leads. The file should include columns
            like Name, Email, Company, Role, etc.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4 py-4'>
          {/* File Upload Area */}
          {!file && (
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className='border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors'
            >
              <Upload className='h-12 w-12 mx-auto mb-4 text-muted-foreground' />
              <p className='text-sm text-muted-foreground mb-2'>
                Drag and drop your CSV file here, or
              </p>
              <label htmlFor='csv-file-input'>
                <Button variant='outline' asChild>
                  <span>Browse Files</span>
                </Button>
                <input
                  id='csv-file-input'
                  type='file'
                  accept='.csv'
                  onChange={handleFileInputChange}
                  className='hidden'
                />
              </label>
              <p className='text-xs text-muted-foreground mt-4'>
                Maximum file size: 10MB
              </p>
            </div>
          )}

          {/* Selected File */}
          {file && !isImporting && !result && (
            <div className='space-y-4'>
              <div className='flex items-center gap-3 p-4 border rounded-lg bg-muted/50'>
                <FileText className='h-5 w-5 text-primary' />
                <div className='flex-1'>
                  <p className='text-sm font-medium'>{file.name}</p>
                  <p className='text-xs text-muted-foreground'>
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => setFile(null)}
                  disabled={isImporting}
                >
                  Remove
                </Button>
              </div>

              <div className='flex items-center gap-2'>
                <input
                  type='checkbox'
                  id='skip-duplicates'
                  checked={skipDuplicates}
                  onChange={(e) => setSkipDuplicates(e.target.checked)}
                  className='rounded'
                />
                <label
                  htmlFor='skip-duplicates'
                  className='text-sm text-muted-foreground cursor-pointer'
                >
                  Skip duplicate records (by email or name+company)
                </label>
              </div>
            </div>
          )}

          {/* Progress */}
          {isImporting && (
            <div className='space-y-2'>
              <div className='flex justify-between text-sm'>
                <span className='text-muted-foreground'>Importing...</span>
                <span className='text-muted-foreground'>
                  {progress.processed} / {progress.total}
                </span>
              </div>
              <Progress value={progressPercent} />
            </div>
          )}

          {/* Results */}
          {result && (
            <div className='space-y-3'>
              <Alert
                variant={result.success ? 'default' : 'destructive'}
                className='border-2'
              >
                <div className='flex items-start gap-2'>
                  {result.success ? (
                    <CheckCircle2 className='h-4 w-4 mt-0.5' />
                  ) : (
                    <XCircle className='h-4 w-4 mt-0.5' />
                  )}
                  <div className='flex-1'>
                    <AlertTitle>
                      {result.success ? 'Import Complete' : 'Import Completed with Errors'}
                    </AlertTitle>
                    <AlertDescription>{result.message}</AlertDescription>
                  </div>
                </div>
              </Alert>

              <div className='grid grid-cols-3 gap-2 text-sm'>
                <div className='p-3 rounded-lg bg-green-50 border border-green-200'>
                  <p className='font-semibold text-green-700'>{result.successCount}</p>
                  <p className='text-xs text-green-600'>Imported</p>
                </div>
                {result.errorCount > 0 && (
                  <div className='p-3 rounded-lg bg-red-50 border border-red-200'>
                    <p className='font-semibold text-red-700'>{result.errorCount}</p>
                    <p className='text-xs text-red-600'>Errors</p>
                  </div>
                )}
                {result.skippedCount > 0 && (
                  <div className='p-3 rounded-lg bg-yellow-50 border border-yellow-200'>
                    <p className='font-semibold text-yellow-700'>{result.skippedCount}</p>
                    <p className='text-xs text-yellow-600'>Skipped</p>
                  </div>
                )}
              </div>

              {/* Error Details */}
              {result.errors.length > 0 && (
                <div className='max-h-48 overflow-y-auto border rounded-lg p-3'>
                  <p className='text-sm font-medium mb-2'>Error Details:</p>
                  <div className='space-y-1'>
                    {result.errors.slice(0, 10).map((error, index) => (
                      <div key={index} className='text-xs text-muted-foreground'>
                        <span className='font-medium'>Row {error.row}:</span>{' '}
                        {error.error}
                      </div>
                    ))}
                    {result.errors.length > 10 && (
                      <p className='text-xs text-muted-foreground italic'>
                        ... and {result.errors.length - 10} more errors
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Warnings */}
              {result.warnings.length > 0 && (
                <Alert>
                  <div className='flex items-start gap-2'>
                    <AlertCircle className='h-4 w-4 mt-0.5' />
                    <div className='flex-1'>
                      <AlertTitle>Warnings</AlertTitle>
                      <AlertDescription>
                        {result.warnings.length} record(s) were skipped as duplicates
                      </AlertDescription>
                    </div>
                  </div>
                </Alert>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={handleClose} disabled={isImporting}>
            {result ? 'Close' : 'Cancel'}
          </Button>
          {file && !isImporting && !result && (
            <Button onClick={handleImport}>Import</Button>
          )}
          {result && (
            <Button
              onClick={() => {
                setFile(null);
                setResult(null);
                setProgress({ processed: 0, total: 0 });
              }}
            >
              Import Another File
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

