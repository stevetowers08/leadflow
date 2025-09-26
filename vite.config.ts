import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    strictPort: false, // Try another port if 8080 is in use
    open: true, // Automatically open browser
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-select'],
          'supabase-vendor': ['@supabase/supabase-js'],
          'query-vendor': ['@tanstack/react-query'],
          'utils-vendor': ['date-fns', 'clsx', 'tailwind-merge'],
          'charts-vendor': ['recharts'],
          'icons-vendor': ['lucide-react'],
          
          // Feature chunks
          'pages-admin': [
            './src/pages/Admin.tsx',
            './src/pages/AdminUsers.tsx', 
            './src/pages/AdminSettings.tsx'
          ],
          'pages-main': [
            './src/pages/Jobs.tsx',
            './src/pages/Leads.tsx',
            './src/pages/Companies.tsx',
            './src/pages/Pipeline.tsx'
          ],
          'components-modals': [
            './src/components/UnifiedPopup.tsx',
            './src/components/PopupErrorBoundary.tsx',
            './src/components/VirtualizedList.tsx',
            './src/components/OptimizedRelatedList.tsx'
          ]
        }
      }
    },
    chunkSizeWarningLimit: 1000, // Increase limit to 1MB for better chunking
    target: 'esnext',
    minify: 'esbuild', // Use esbuild instead of terser
    esbuild: {
      drop: mode === 'production' ? ['console', 'debugger'] : [],
    },
  },
}));
