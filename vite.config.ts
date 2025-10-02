import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: '/', // Ensure correct base path for Vercel
  server: {
    host: "localhost",
    port: 5173,
    strictPort: false, // Allow fallback to other ports if 5173 is busy
    open: true, // Automatically open browser
  },
  plugins: [react()],
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      '@radix-ui/react-popover',
      '@tanstack/react-query',
      '@supabase/supabase-js',
      'sonner'
    ],
    exclude: ['@vite/client', '@vite/env'],
    force: true
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ['react', 'react-dom']
  },
  build: {
    target: 'es2020',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Core React libraries
          if (id.includes('react') || id.includes('react-dom')) {
            return 'react-vendor';
          }
          
          // Router
          if (id.includes('react-router-dom')) {
            return 'router-vendor';
          }
          
          // Radix UI components
          if (id.includes('@radix-ui')) {
            return 'radix-ui';
          }
          
          // Data and API libraries
          if (id.includes('@supabase') || id.includes('@tanstack')) {
            return 'data-vendor';
          }
          
          // Drag and drop
          if (id.includes('@dnd-kit')) {
            return 'dnd-vendor';
          }
          
          // Charts
          if (id.includes('recharts')) {
            return 'charts-vendor';
          }
          
          // Utility libraries
          if (id.includes('date-fns') || id.includes('clsx') || id.includes('tailwind-merge') || id.includes('cmdk') || id.includes('sonner')) {
            return 'utils-vendor';
          }
          
          // Icons and themes
          if (id.includes('lucide-react') || id.includes('next-themes') || id.includes('react-window')) {
            return 'ui-vendor';
          }
          
          // Large pages - split by route
          if (id.includes('/pages/Settings')) {
            return 'settings-page';
          }
          if (id.includes('/pages/Pipeline')) {
            return 'pipeline-page';
          }
          if (id.includes('/pages/Reporting')) {
            return 'reporting-page';
          }
          if (id.includes('/pages/Conversations')) {
            return 'conversations-page';
          }
          if (id.includes('/pages/Campaigns')) {
            return 'campaigns-page';
          }
          if (id.includes('/pages/Companies')) {
            return 'companies-page';
          }
          if (id.includes('/pages/Jobs')) {
            return 'jobs-page';
          }
          
          // Large components
          if (id.includes('/components/tables/DataTable')) {
            return 'datatable-component';
          }
          if (id.includes('/components/ai/FloatingChatWidget')) {
            return 'chat-component';
          }
          if (id.includes('/components/mobile/EnhancedMobileNav')) {
            return 'mobile-nav-component';
          }
          
          // Contexts and hooks
          if (id.includes('/contexts/') || id.includes('/hooks/')) {
            return 'app-logic';
          }
          
          // Services
          if (id.includes('/services/')) {
            return 'services';
          }
          
          // Utils
          if (id.includes('/utils/')) {
            return 'utils';
          }
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    chunkSizeWarningLimit: 500, // Target 500KB chunks
    minify: 'esbuild', // Re-enable minification with esbuild
    esbuild: {
      drop: mode === 'production' ? ['console', 'debugger'] : [],
      legalComments: 'none',
    },
  },
}));
