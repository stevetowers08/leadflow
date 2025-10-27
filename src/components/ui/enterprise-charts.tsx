/**
 * Enterprise CRM Chart Components - 2025 Edition
 *
 * Features:
 * - Modern chart designs with interactive elements
 * - Responsive layouts optimized for enterprise dashboards
 * - Accessibility-compliant data visualization
 * - Consistent styling with card components
 * - Support for various chart types commonly used in CRM
 */

import { cn } from '@/lib/utils';
import { LucideIcon, Minus, TrendingDown, TrendingUp } from 'lucide-react';

// Simple Line Chart Component
export interface LineChartProps {
  data: Array<{
    label: string;
    value: number;
    color?: string;
  }>;
  height?: number;
  showGrid?: boolean;
  showValues?: boolean;
}

const LineChart = ({
  data,
  height = 200,
  showGrid = true,
  showValues = true,
}: LineChartProps) => {
  if (!data || data.length === 0) {
    return (
      <div
        className='relative flex items-center justify-center'
        style={{ height }}
      >
        <p className='text-muted-foreground'>No data available</p>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue;

  // Add padding to prevent extreme scaling
  const padding = range * 0.1;
  const adjustedMax = maxValue + padding;
  const adjustedMin = Math.max(0, minValue - padding);
  const adjustedRange = adjustedMax - adjustedMin;

  const points = data.map((point, index) => {
    const x = 40 + (index / (data.length - 1)) * 320; // Leave space for labels
    const y =
      adjustedRange > 0
        ? 160 - ((point.value - adjustedMin) / adjustedRange) * 120
        : 100;
    return { x, y, ...point };
  });

  const pathData = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ');

  return (
    <div className='relative w-full' style={{ height }}>
      <svg
        width='100%'
        height='100%'
        viewBox='0 0 400 200'
        className='overflow-visible'
      >
        {/* Grid lines */}
        {showGrid && (
          <>
            <defs>
              <pattern
                id='grid'
                width='40'
                height='40'
                patternUnits='userSpaceOnUse'
              >
                <path
                  d='M 40 0 L 0 0 0 40'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='0.5'
                  opacity='0.1'
                />
              </pattern>
            </defs>
            <rect x='40' y='20' width='320' height='160' fill='url(#grid)' />
          </>
        )}

        {/* Y-axis labels */}
        {showGrid && (
          <>
            <text
              x='35'
              y='25'
              textAnchor='end'
              className='text-xs fill-current text-muted-foreground'
            >
              {adjustedMax.toLocaleString()}
            </text>
            <text
              x='35'
              y='100'
              textAnchor='end'
              className='text-xs fill-current text-muted-foreground'
            >
              {Math.round((adjustedMax + adjustedMin) / 2).toLocaleString()}
            </text>
            <text
              x='35'
              y='175'
              textAnchor='end'
              className='text-xs fill-current text-muted-foreground'
            >
              {adjustedMin.toLocaleString()}
            </text>
          </>
        )}

        {/* Line */}
        <path
          d={pathData}
          fill='none'
          stroke='#3b82f6'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />

        {/* Points */}
        {points.map((point, index) => (
          <g key={index}>
            <circle
              cx={point.x}
              cy={point.y}
              r='3'
              fill='#3b82f6'
              stroke='white'
              strokeWidth='2'
            />
            {showValues && index % Math.ceil(data.length / 5) === 0 && (
              <text
                x={point.x}
                y={point.y - 8}
                textAnchor='middle'
                className='text-xs font-medium fill-current text-foreground'
              >
                {point.value}
              </text>
            )}
          </g>
        ))}

        {/* X-axis labels */}
        {points.map((point, index) => {
          if (index % Math.ceil(data.length / 4) === 0) {
            return (
              <text
                key={`label-${index}`}
                x={point.x}
                y='195'
                textAnchor='middle'
                className='text-xs fill-current text-muted-foreground'
              >
                {point.label}
              </text>
            );
          }
          return null;
        })}
      </svg>
    </div>
  );
};

// Simple Bar Chart Component
export interface BarChartProps {
  data: Array<{
    label: string;
    value: number;
    color?: string;
  }>;
  height?: number;
  showValues?: boolean;
  orientation?: 'vertical' | 'horizontal';
}

const BarChart = ({
  data,
  height = 200,
  showValues = true,
  orientation = 'vertical',
}: BarChartProps) => {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className='relative w-full' style={{ height }}>
      <svg
        width='100%'
        height='100%'
        viewBox='0 0 400 200'
        className='overflow-visible'
      >
        {data.map((item, index) => {
          const barHeight = maxValue > 0 ? (item.value / maxValue) * 120 : 0;
          const barWidth = orientation === 'horizontal' ? 30 : 60;
          const spacing = orientation === 'horizontal' ? 40 : 80;
          const x = orientation === 'horizontal' ? 80 : 20 + index * spacing;
          const y =
            orientation === 'horizontal'
              ? 20 + index * spacing
              : 180 - barHeight;

          return (
            <g key={index}>
              <rect
                x={x}
                y={y}
                width={orientation === 'horizontal' ? barHeight : barWidth}
                height={orientation === 'horizontal' ? barWidth : barHeight}
                fill={item.color || '#3b82f6'}
                rx='4'
              />
              {showValues && (
                <text
                  x={
                    orientation === 'horizontal'
                      ? x + barHeight + 8
                      : x + barWidth / 2
                  }
                  y={
                    orientation === 'horizontal' ? y + barWidth / 2 + 4 : y - 8
                  }
                  textAnchor={orientation === 'horizontal' ? 'start' : 'middle'}
                  className='text-xs font-medium fill-current text-foreground'
                >
                  {item.value}
                </text>
              )}
              <text
                x={orientation === 'horizontal' ? x - 8 : x + barWidth / 2}
                y={orientation === 'horizontal' ? y + barWidth / 2 + 4 : 195}
                textAnchor={orientation === 'horizontal' ? 'end' : 'middle'}
                className='text-xs fill-current text-muted-foreground'
              >
                {item.label.length > 12
                  ? item.label.substring(0, 12) + '...'
                  : item.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// Simple Donut Chart Component
export interface DonutChartProps {
  data: Array<{
    label: string;
    value: number;
    color?: string;
  }>;
  size?: number;
  showLegend?: boolean;
  showValues?: boolean;
}

const DonutChart = ({
  data,
  size = 200,
  showLegend = true,
  showValues = true,
}: DonutChartProps) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = size / 2 - 20;
  const strokeWidth = 20;

  // Define consistent colors for different stage types
  const stageColors: Record<string, string> = {
    new: '#ef4444', // red
    connection_requested: '#22c55e', // green
    connected: '#22c55e', // green (same as connection_requested)
    replied: '#22c55e', // green (same as connection_requested)
    messaged: '#8b5cf6', // purple
    'in queue': '#eab308', // yellow
    lead_lost: '#06b6d4', // cyan
    scheduled: '#f97316', // orange
    completed: '#10b981', // emerald
  };

  // Calculate cumulative percentages without mutation
  const segments = data.map((item, index) => {
    const percentage = (item.value / total) * 100;

    // Calculate cumulative percentage by summing previous items
    const cumulativePercentage = data
      .slice(0, index)
      .reduce((sum, prevItem) => sum + (prevItem.value / total) * 100, 0);

    const startAngle = (cumulativePercentage / 100) * 360;
    const endAngle = ((cumulativePercentage + percentage) / 100) * 360;

    const startAngleRad = (startAngle - 90) * (Math.PI / 180);
    const endAngleRad = (endAngle - 90) * (Math.PI / 180);

    const x1 = radius + radius * Math.cos(startAngleRad);
    const y1 = radius + radius * Math.sin(startAngleRad);
    const x2 = radius + radius * Math.cos(endAngleRad);
    const y2 = radius + radius * Math.sin(endAngleRad);

    const largeArcFlag = percentage > 50 ? 1 : 0;

    const pathData = [
      `M ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
    ].join(' ');

    // Use predefined color or fallback to generated color
    const color =
      item.color ||
      stageColors[item.label.toLowerCase()] ||
      `hsl(${(index * 137.5) % 360}, 70%, 50%)`;

    return {
      ...item,
      pathData,
      percentage,
      startAngle,
      endAngle,
      color,
    };
  });

  return (
    <div className='flex items-center gap-6'>
      <div className='relative' style={{ width: size, height: size }}>
        <svg width={size} height={size} className='overflow-visible'>
          {segments.map((segment, index) => (
            <g key={index}>
              <path
                d={segment.pathData}
                fill='none'
                stroke={segment.color}
                strokeWidth={strokeWidth}
                strokeLinecap='round'
              />
              {showValues && (
                <text
                  x={size / 2}
                  y={size / 2}
                  textAnchor='middle'
                  dominantBaseline='middle'
                  className='text-sm font-semibold fill-current text-foreground'
                >
                  {total}
                </text>
              )}
            </g>
          ))}
        </svg>
      </div>

      {showLegend && (
        <div className='space-y-2'>
          {segments.map((segment, index) => (
            <div key={index} className='flex items-center gap-2'>
              <div
                className='w-3 h-3 rounded-full'
                style={{ backgroundColor: segment.color }}
              />
              <span className='text-sm text-muted-foreground'>
                {segment.label}
              </span>
              <span className='text-sm font-medium text-foreground'>
                {segment.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Trend Indicator Component
export interface TrendIndicatorProps {
  value: number;
  previousValue?: number;
  label?: string;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const TrendIndicator = ({
  value,
  previousValue,
  label,
  showIcon = true,
  size = 'md',
}: TrendIndicatorProps) => {
  const change = previousValue ? value - previousValue : 0;
  const changePercent = previousValue ? (change / previousValue) * 100 : 0;

  const isPositive = change > 0;
  const isNegative = change < 0;
  const isNeutral = change === 0;

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className='flex items-center gap-1'>
      {showIcon && (
        <>
          {isPositive && <TrendingUp className='h-4 w-4 text-success' />}
          {isNegative && <TrendingDown className='h-4 w-4 text-destructive' />}
          {isNeutral && <Minus className='h-4 w-4 text-muted-foreground' />}
        </>
      )}
      <span
        className={cn(
          sizeClasses[size],
          'font-medium',
          isPositive && 'text-success',
          isNegative && 'text-destructive',
          isNeutral && 'text-muted-foreground'
        )}
      >
        {isPositive && '+'}
        {changePercent.toFixed(1)}%
      </span>
      {label && (
        <span className={cn(sizeClasses[size], 'text-muted-foreground')}>
          {label}
        </span>
      )}
    </div>
  );
};

// KPI Card Component
export interface KPICardProps {
  title: string;
  value: string | number;
  previousValue?: number;
  icon?: LucideIcon;
  trend?: 'up' | 'down' | 'stable';
  color?: 'primary' | 'success' | 'warning' | 'info';
  loading?: boolean;
  className?: string;
}

const KPICard = ({
  title,
  value,
  previousValue,
  icon: Icon,
  trend,
  color = 'primary',
  loading = false,
  className,
}: KPICardProps) => {
  if (loading) {
    return (
      <div
        className={cn(
          'p-6 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10',
          className
        )}
      >
        <div className='animate-pulse'>
          <div className='h-4 bg-gray-200 rounded w-3/4 mb-2'></div>
          <div className='h-8 bg-gray-200 rounded w-1/2 mb-2'></div>
          <div className='h-3 bg-gray-200 rounded w-1/3'></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'p-6 rounded-lg transition-all duration-300',
        'bg-white/5 backdrop-blur-sm border border-white/10',
        'hover:bg-white/10 hover:border-white/20',
        className
      )}
    >
      <div className='flex items-start justify-between'>
        <div className='flex-1 min-w-0'>
          <p className='text-sm font-medium text-muted-foreground mb-1'>
            {title}
          </p>
          <p className='text-2xl font-bold text-foreground mb-2'>{value}</p>
          {previousValue !== undefined && (
            <TrendIndicator
              value={typeof value === 'number' ? value : 0}
              previousValue={previousValue}
              label='vs last period'
            />
          )}
        </div>
        {Icon && (
          <div
            className={cn(
              'p-3 rounded-full',
              color === 'primary' && 'bg-primary/10',
              color === 'success' && 'bg-success/10',
              color === 'warning' && 'bg-warning/10',
              color === 'info' && 'bg-blue-100'
            )}
          >
            <Icon
              className={cn(
                'h-6 w-6',
                color === 'primary' && 'text-primary',
                color === 'success' && 'text-success',
                color === 'warning' && 'text-warning',
                color === 'info' && 'text-blue-600'
              )}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// Mini Chart Component for small spaces
export interface MiniChartProps {
  data: number[];
  type?: 'line' | 'bar';
  color?: string;
  height?: number;
  showTrend?: boolean;
}

const MiniChart = ({
  data,
  type = 'line',
  color = 'currentColor',
  height = 40,
  showTrend = true,
}: MiniChartProps) => {
  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  const range = maxValue - minValue;

  const trend =
    data[data.length - 1] > data[0]
      ? 'up'
      : data[data.length - 1] < data[0]
        ? 'down'
        : 'stable';

  return (
    <div className='flex items-center gap-2'>
      <div className='relative' style={{ height, width: 60 }}>
        <svg width='100%' height='100%' className='overflow-visible'>
          {type === 'line' ? (
            <path
              d={data
                .map((value, index) => {
                  const x = (index / (data.length - 1)) * 100;
                  const y = range > 0 ? ((maxValue - value) / range) * 100 : 50;
                  return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
                })
                .join(' ')}
              fill='none'
              stroke={color}
              strokeWidth='2'
              className='text-primary'
            />
          ) : (
            data.map((value, index) => {
              const barHeight = (value / maxValue) * 100;
              const barWidth = 100 / data.length;
              return (
                <rect
                  key={index}
                  x={(index * 100) / data.length}
                  y={100 - barHeight}
                  width={barWidth * 0.8}
                  height={barHeight}
                  fill={color}
                  className='text-primary'
                />
              );
            })
          )}
        </svg>
      </div>
      {showTrend && (
        <TrendIndicator
          value={data[data.length - 1]}
          previousValue={data[0]}
          size='sm'
        />
      )}
    </div>
  );
};

export { BarChart, DonutChart, KPICard, LineChart, MiniChart, TrendIndicator };
