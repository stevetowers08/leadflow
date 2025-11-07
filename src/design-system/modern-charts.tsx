/**
 * Modern Chart Components
 * Professional chart components using Chart.js
 */

import React from 'react';
import { Line } from 'react-chartjs-2';
// Import centralized Chart.js configuration
import '../lib/chart-config';

// Modern chart color palette - Fixed for Tailwind CSS v4
export const modernChartColors = {
  primary: '#0077B5', // LinkedIn Blue
  secondary: '#00A0DC', // Rich Electric Blue
  success: '#10B981', // Emerald Green
  warning: '#F59E0B', // Amber
  error: '#EF4444', // Red
  info: '#3B82F6', // Blue
  muted: '#6B7280', // Gray
  accent: '#8B5CF6', // Purple
  // Additional colors for better chart visibility
  blue: '#3B82F6',
  green: '#10B981',
  purple: '#8B5CF6',
  orange: '#F59E0B',
  red: '#EF4444',
  teal: '#14B8A6',
  indigo: '#6366F1',
};

interface ModernLineChartProps {
  data: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      fill?: boolean;
      tension?: number;
    }>;
  };
  height?: number;
  loading?: boolean;
  options?: Record<string, unknown>;
}

export const ModernLineChart: React.FC<ModernLineChartProps> = ({
  data,
  height = 300,
  loading = false,
  options = {},
}) => {
  if (loading) {
    return (
      <div className='flex items-center justify-center h-64 bg-muted rounded-lg'>
        <div className='flex items-center space-x-2 text-muted-foreground'>
          <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-primary'></div>
          <span>Loading chart...</span>
        </div>
      </div>
    );
  }

  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            family: 'Inter, system-ui, sans-serif',
          },
          color: '#374151', // Ensure legend text is not black
        },
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#374151',
        bodyColor: '#6B7280',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        intersect: false,
        mode: 'index' as const,
        titleFont: {
          family: 'Inter, system-ui, sans-serif',
          size: 13,
          weight: '600',
        },
        bodyFont: {
          family: 'Inter, system-ui, sans-serif',
          size: 12,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
            family: 'Inter, system-ui, sans-serif',
          },
          color: '#6B7280', // Ensure axis text is not black
        },
      },
      y: {
        grid: {
          color: '#E5E7EB', // Light gray instead of black
          drawBorder: false,
        },
        ticks: {
          font: {
            size: 11,
            family: 'Inter, system-ui, sans-serif',
          },
          color: '#6B7280', // Ensure axis text is not black
        },
      },
    },
    elements: {
      point: {
        radius: 4,
        hoverRadius: 6,
        borderWidth: 2,
        backgroundColor: 'white',
      },
      line: {
        borderWidth: 2,
        tension: 0.4,
      },
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
    ...options,
  };

  return (
    <div style={{ height: `${height}px` }}>
      <Line data={data} options={defaultOptions} />
    </div>
  );
};

// Additional chart components can be added here
export const ModernBarChart: React.FC<ModernLineChartProps> = ({
  data,
  height = 300,
  loading = false,
  options = {},
}) => {
  // Implementation for bar chart
  return <div>Bar Chart Component (to be implemented)</div>;
};

export const ModernPieChart: React.FC<ModernLineChartProps> = ({
  data,
  height = 300,
  loading = false,
  options = {},
}) => {
  // Implementation for pie chart
  return <div>Pie Chart Component (to be implemented)</div>;
};
