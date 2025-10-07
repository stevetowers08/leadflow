/**
 * Modern Chart Components
 * Professional chart components using Chart.js
 */

import { CategoryScale, Chart as ChartJS, Legend, LineElement, LinearScale, PointElement, Title, Tooltip } from 'chart.js';
import React from 'react';
import { Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Modern chart color palette
export const modernChartColors = {
  primary: '#0077B5',      // LinkedIn Blue
  secondary: '#00A0DC',    // Rich Electric Blue
  success: '#10B981',      // Emerald Green
  warning: '#F59E0B',      // Amber
  error: '#EF4444',        // Red
  info: '#3B82F6',         // Blue
  muted: '#6B7280',        // Gray
  accent: '#8B5CF6',       // Purple
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
  options = {}
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-2 text-gray-500">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
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
            family: 'Inter, system-ui, sans-serif'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        intersect: false,
        mode: 'index' as const,
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
            family: 'Inter, system-ui, sans-serif'
          },
          color: '#6B7280'
        }
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false,
        },
        ticks: {
          font: {
            size: 11,
            family: 'Inter, system-ui, sans-serif'
          },
          color: '#6B7280'
        }
      }
    },
    elements: {
      point: {
        radius: 4,
        hoverRadius: 6,
        borderWidth: 2,
        backgroundColor: 'white'
      },
      line: {
        borderWidth: 2,
        tension: 0.4
      }
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
    ...options
  };

  return (
    <div style={{ height: `${height}px` }}>
      <Line data={data} options={defaultOptions} />
    </div>
  );
};

// Additional chart components can be added here
export const ModernBarChart: React.FC<ModernLineChartProps> = ({ data, height = 300, loading = false, options = {} }) => {
  // Implementation for bar chart
  return <div>Bar Chart Component (to be implemented)</div>;
};

export const ModernPieChart: React.FC<ModernLineChartProps> = ({ data, height = 300, loading = false, options = {} }) => {
  // Implementation for pie chart
  return <div>Pie Chart Component (to be implemented)</div>;
};
