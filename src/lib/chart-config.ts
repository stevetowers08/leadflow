/**
 * Chart.js Configuration
 * Centralized configuration to prevent import/registration mismatches
 */

import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';

// Register all Chart.js components in one place
export const registerChartJS = () => {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
  );
};

// Call registration immediately
registerChartJS();

// Export individual components for use in other files
export {
  CategoryScale,
  ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
};
