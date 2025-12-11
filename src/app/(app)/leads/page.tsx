'use client';

import { UnifiedTable, ColumnConfig } from '@/components/ui/unified-table';
import { Page } from '@/design-system/components';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { shouldBypassAuth } from '@/config/auth';
import { getLeads, getLeadStats } from '@/services/leadsService';
import { useQuery } from '@tanstack/react-query';
import { Users, Flame, Zap, Snowflake, Download } from 'lucide-react';
import { useMemo, useState, useCallback, useEffect } from 'react';
import type { Lead } from '@/types/database';
import { Button } from '@/components/ui/button';
import { exportLeadsToCSV, exportLeadsToJSON, downloadExport } from '@/services/exportService';
import { toast } from 'sonner';
import { useBulkSelection } from '@/hooks/useBulkSelection';

export default function LeadsPage() {
  const { user, loading: authLoading } = useAuth();
  const [isExporting, setIsExporting] = useState(false);
  const bulkSelection = useBulkSelection();

  const { data: leads = [], isLoading, error } = useQuery({
    queryKey: ['leads'],
    queryFn: () => getLeads({ limit: 1000 }), // Increased limit for export
    enabled: shouldBypassAuth() || (!authLoading && !!user),
  });

  const { data: stats } = useQuery({
    queryKey: ['lead-stats'],
    queryFn: () => getLeadStats(),
    enabled: shouldBypassAuth() || (!authLoading && !!user),
  });

  // Keyboard shortcuts (Cmd/Ctrl+A for select all, Escape to clear)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl+A to select all
      if ((e.metaKey || e.ctrlKey) && e.key === 'a') {
        e.preventDefault();
        const allIds = leads.map(l => l.id);
        if (bulkSelection.selectedCount === allIds.length) {
          bulkSelection.deselectAll();
        } else {
          bulkSelection.selectAll(allIds);
        }
      }
      // Escape to clear selection
      if (e.key === 'Escape' && bulkSelection.selectedCount > 0) {
        bulkSelection.deselectAll();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [bulkSelection, leads]);

  // Calculate actual selected count (resolves select-all against all leads)
  const actualSelectedCount = bulkSelection.getSelectedIds(
    leads.map(l => l.id)
  ).length;

  // Memoized checkbox render to prevent re-renders
  const renderCheckbox = useCallback(
    (lead: Lead) => (
      <div
        className="flex items-center justify-center"
        data-bulk-checkbox
        onClick={e => e.stopPropagation()}
      >
        <Checkbox
          checked={bulkSelection.isSelected(lead.id)}
          onCheckedChange={() => bulkSelection.toggleItem(lead.id)}
          aria-label={`Select ${lead.first_name} ${lead.last_name}`}
        />
      </div>
    ),
    [bulkSelection]
  );

  const columns: ColumnConfig<Lead>[] = useMemo(
    () => [
      {
        key: 'checkbox',
        label: (
          <div className="flex items-center justify-center" data-bulk-checkbox>
            <Checkbox
              checked={
                leads.length > 0 &&
                leads.every(l => bulkSelection.isSelected(l.id))
              }
              onCheckedChange={checked => {
                if (checked) {
                  bulkSelection.selectAll(leads.map(l => l.id));
                } else {
                  bulkSelection.deselectAll();
                }
              }}
              aria-label="Select all leads"
            />
          </div>
        ),
        width: '50px',
        cellType: 'regular',
        align: 'center',
        render: (_, lead) => renderCheckbox(lead),
      },
      {
        key: 'name',
        label: 'Name',
        width: '200px',
        render: (_, lead) => {
          const name = [lead.first_name, lead.last_name].filter(Boolean).join(' ') || 'Unknown';
          return <div className="font-medium">{name}</div>;
        },
      },
      {
        key: 'email',
        label: 'Email',
        width: '250px',
        render: (_, lead) => (
          <div className="text-muted-foreground">{lead.email || '-'}</div>
        ),
      },
      {
        key: 'company',
        label: 'Company',
        width: '200px',
        render: (_, lead) => <div>{lead.company || '-'}</div>,
      },
      {
        key: 'job_title',
        label: 'Position',
        width: '200px',
        render: (_, lead) => (
          <div className="text-muted-foreground">{lead.job_title || '-'}</div>
        ),
      },
      {
        key: 'quality_rank',
        label: 'Quality',
        width: '120px',
        cellType: 'status',
        render: (_, lead) => {
          const quality = lead.quality_rank || 'warm';
          const variants = {
            hot: { icon: Flame, className: 'bg-destructive/10 text-destructive border-destructive/20' },
            warm: { icon: Zap, className: 'bg-warning/10 text-warning border-warning/20' },
            cold: { icon: Snowflake, className: 'bg-muted text-muted-foreground border-border' },
          };
          const variant = variants[quality] || variants.warm;
          const Icon = variant.icon;
          
          return (
            <Badge variant="outline" className={variant.className}>
              <Icon className="h-3 w-3 mr-1" />
              {quality.charAt(0).toUpperCase() + quality.slice(1)}
            </Badge>
          );
        },
      },
      {
        key: 'status',
        label: 'Status',
        width: '120px',
        cellType: 'status',
        render: (_, lead) => {
          const status = lead.status || 'processing';
          const statusColors = {
            processing: 'bg-muted text-muted-foreground',
            active: 'bg-success/10 text-success',
            replied_manual: 'bg-primary/10 text-primary',
          };
          return (
            <Badge variant="outline" className={statusColors[status] || statusColors.processing}>
              {status.replace('_', ' ')}
            </Badge>
          );
        },
      },
      {
        key: 'created_at',
        label: 'Created',
        width: '120px',
        render: (_, lead) => (
          <div className="text-sm text-muted-foreground">
            {lead.created_at
              ? new Date(lead.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })
              : '-'}
          </div>
        ),
      },
    ],
    [bulkSelection, leads, renderCheckbox]
  );

  const pageStats = useMemo(
    () => [
      {
        icon: Users,
        value: stats?.total || leads.length,
        label: 'Total Leads',
      },
      {
        icon: Flame,
        value: stats?.hot || 0,
        label: 'Hot',
      },
      {
        icon: Zap,
        value: stats?.warm || 0,
        label: 'Warm',
      },
      {
        icon: Snowflake,
        value: stats?.cold || 0,
        label: 'Cold',
      },
    ],
    [stats, leads.length]
  );

  const handleExport = async (format: 'csv' | 'json') => {
    try {
      setIsExporting(true);
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `leads-export-${timestamp}.${format}`;

      if (format === 'csv') {
        const csvData = await exportLeadsToCSV({ format: 'csv' });
        downloadExport(csvData, filename, 'text/csv');
      } else {
        const jsonData = await exportLeadsToJSON({ format: 'json' });
        downloadExport(jsonData, filename, 'application/json');
      }

      toast.success('Export successful', {
        description: `Downloaded ${filename}`,
      });
    } catch (error) {
      console.error('Export error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Please try again';
      toast.error('Export failed', {
        description: errorMessage,
      });
    } finally {
      setIsExporting(false);
    }
  };

  if (error) {
    return (
      <Page stats={pageStats} title="Leads">
        <div className="flex items-center justify-center h-64">
          <div className="text-destructive">Error loading leads</div>
        </div>
      </Page>
    );
  }

  return (
    <Page stats={pageStats} title="Leads" loading={isLoading}>
      <div className="flex flex-col min-w-0 w-full">
        <div className="flex items-center justify-between gap-2 mb-4 flex-shrink-0 w-full">
          {actualSelectedCount > 0 && (
            <div className="flex items-center gap-2 flex-shrink-0">
              <Badge variant="secondary">
                {actualSelectedCount} {actualSelectedCount === 1 ? 'lead' : 'leads'} selected
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => bulkSelection.deselectAll()}
              >
                Clear selection
              </Button>
            </div>
          )}
          <div className="flex gap-2 ml-auto flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('csv')}
              disabled={isExporting || leads.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('json')}
              disabled={isExporting || leads.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Export JSON
            </Button>
          </div>
        </div>
        <div className="w-full min-w-0 flex-1" style={{ minHeight: '400px', maxHeight: 'calc(100vh - 280px)' }}>
          <UnifiedTable
            data={leads}
            columns={columns}
            loading={isLoading}
            emptyMessage="No leads captured yet. Start by capturing your first business card!"
            scrollable
            stickyHeaders
          />
        </div>
      </div>
    </Page>
  );
}
