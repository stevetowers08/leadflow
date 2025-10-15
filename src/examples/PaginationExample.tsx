import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  EnhancedTable,
  EnhancedTableBody,
  EnhancedTableCell,
  EnhancedTableHead,
  EnhancedTableHeader,
  EnhancedTableRow,
} from '@/components/ui/enhanced-table';
import { ResponsiveTable } from '@/components/ui/responsive-table';
import {
  CompactPaginationControls,
  PaginationControls,
} from '@/components/utils/PaginationControls';
import { usePagination } from '@/hooks/usePagination';
import { useUrlPagination } from '@/hooks/useUrlPagination';
import React, { useMemo, useState } from 'react';

// Example data type
interface ExampleData {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  lastLogin: string;
  department: string;
}

// Example data
const generateExampleData = (count: number): ExampleData[] => {
  const roles = ['Admin', 'User', 'Manager', 'Developer'];
  const statuses: ExampleData['status'][] = ['active', 'inactive', 'pending'];
  const departments = ['Engineering', 'Marketing', 'Sales', 'HR'];

  return Array.from({ length: count }, (_, i) => ({
    id: `user-${i + 1}`,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    role: roles[i % roles.length],
    status: statuses[i % statuses.length],
    lastLogin: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    department: departments[i % departments.length],
  }));
};

// Status badge component
const StatusBadge = ({ status }: { status: ExampleData['status'] }) => {
  const variants = {
    active: 'bg-green-100 text-green-800 border-green-200',
    inactive: 'bg-gray-100 text-gray-800 border-gray-200',
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${variants[status]}`}
    >
      {status}
    </span>
  );
};

// Example component showing improved pagination and scrolling
export const PaginationExample = () => {
  const [data] = useState(() => generateExampleData(150));
  const [loading, setLoading] = useState(false);

  // Use URL-based pagination
  const { currentPage, pageSize, updatePage, updatePageSize } =
    useUrlPagination({
      defaultPageSize: 25,
      defaultPage: 1,
    });

  // Use improved pagination hook
  const pagination = usePagination(data.length, {
    pageSize: pageSize,
    initialPage: currentPage,
    maxVisiblePages: 7,
  });

  // Sync URL state with pagination
  React.useEffect(() => {
    if (pagination.currentPage !== currentPage) {
      updatePage(pagination.currentPage);
    }
  }, [pagination.currentPage, currentPage, updatePage]);

  React.useEffect(() => {
    if (pagination.pageSize !== pageSize) {
      updatePageSize(pagination.pageSize);
    }
  }, [pagination.pageSize, pageSize, updatePageSize]);

  // Get paginated data
  const paginatedData = useMemo(() => {
    return data.slice(pagination.startIndex, pagination.endIndex + 1);
  }, [data, pagination.startIndex, pagination.endIndex]);

  // Column definitions with priority for mobile
  const columns = [
    {
      key: 'name',
      label: 'Name',
      priority: 'high' as const,
      render: (value: string, row: ExampleData) => (
        <div className='font-medium text-gray-900'>{value}</div>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      priority: 'high' as const,
      render: (value: string) => <div className='text-gray-600'>{value}</div>,
    },
    {
      key: 'role',
      label: 'Role',
      priority: 'medium' as const,
      render: (value: string) => (
        <span className='inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800'>
          {value}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      priority: 'medium' as const,
      render: (value: ExampleData['status']) => <StatusBadge status={value} />,
    },
    {
      key: 'department',
      label: 'Department',
      priority: 'low' as const,
      render: (value: string) => <span className='text-gray-500'>{value}</span>,
    },
    {
      key: 'lastLogin',
      label: 'Last Login',
      priority: 'low' as const,
      render: (value: string) => (
        <span className='text-gray-500'>
          {new Date(value).toLocaleDateString()}
        </span>
      ),
    },
  ];

  const handleRowClick = (row: ExampleData) => {
    console.log('Row clicked:', row);
  };

  const simulateLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <div className='space-y-6 p-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold'>
          Improved Pagination & Scrolling Example
        </h1>
        <Button onClick={simulateLoading} disabled={loading}>
          {loading ? 'Loading...' : 'Simulate Loading'}
        </Button>
      </div>

      {/* Responsive Table */}
      <Card className='p-6'>
        <h2 className='text-lg font-semibold mb-4'>
          Responsive Table (Mobile-Friendly)
        </h2>
        <ResponsiveTable
          data={paginatedData}
          columns={columns}
          loading={loading}
          onRowClick={handleRowClick}
          mobileBreakpoint='md'
        />

        {/* Full Pagination Controls */}
        <div className='mt-6'>
          <PaginationControls
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            pageSize={pagination.pageSize}
            totalItems={pagination.totalItems}
            onPageChange={pagination.goToPage}
            onPageSizeChange={pagination.setPageSize}
            visiblePages={pagination.visiblePages}
            showFirstEllipsis={pagination.showFirstEllipsis}
            showLastEllipsis={pagination.showLastEllipsis}
            hasNextPage={pagination.hasNextPage}
            hasPreviousPage={pagination.hasPreviousPage}
            pageSizeOptions={[10, 25, 50, 100]}
            showGoToPage={true}
            loading={loading}
          />
        </div>
      </Card>

      {/* Enhanced Table with Improved Scrolling */}
      <Card className='p-6'>
        <h2 className='text-lg font-semibold mb-4'>
          Enhanced Table (Improved Scrolling)
        </h2>
        <div className='border rounded-lg overflow-hidden'>
          <EnhancedTable
            dualScrollbars={false}
            stickyHeader={true}
            maxHeight='400px'
          >
            <EnhancedTableHeader>
              <EnhancedTableRow>
                {columns.map(column => (
                  <EnhancedTableHead
                    key={column.key}
                    style={{ minWidth: '120px' }}
                  >
                    {column.label}
                  </EnhancedTableHead>
                ))}
              </EnhancedTableRow>
            </EnhancedTableHeader>
            <EnhancedTableBody>
              {paginatedData.map(row => (
                <EnhancedTableRow
                  key={row.id}
                  className='hover:bg-gray-50 cursor-pointer'
                  onClick={() => handleRowClick(row)}
                >
                  {columns.map(column => (
                    <EnhancedTableCell key={column.key}>
                      {column.render
                        ? column.render(row[column.key], row)
                        : row[column.key]}
                    </EnhancedTableCell>
                  ))}
                </EnhancedTableRow>
              ))}
            </EnhancedTableBody>
          </EnhancedTable>
        </div>

        {/* Compact Pagination Controls */}
        <div className='mt-4 flex justify-center'>
          <CompactPaginationControls
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={pagination.goToPage}
            hasNextPage={pagination.hasNextPage}
            hasPreviousPage={pagination.hasPreviousPage}
            loading={loading}
          />
        </div>
      </Card>

      {/* Performance Info */}
      <Card className='p-6'>
        <h2 className='text-lg font-semibold mb-4'>Performance Information</h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-sm'>
          <div>
            <span className='font-medium'>Total Items:</span>{' '}
            {pagination.totalItems}
          </div>
          <div>
            <span className='font-medium'>Current Page:</span>{' '}
            {pagination.currentPage} of {pagination.totalPages}
          </div>
          <div>
            <span className='font-medium'>Page Size:</span>{' '}
            {pagination.pageSize}
          </div>
          <div>
            <span className='font-medium'>Showing:</span>{' '}
            {pagination.startIndex + 1} - {pagination.endIndex + 1}
          </div>
          <div>
            <span className='font-medium'>Visible Pages:</span>{' '}
            {pagination.visiblePages.join(', ')}
          </div>
          <div>
            <span className='font-medium'>URL State:</span> Persisted ✓
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PaginationExample;
