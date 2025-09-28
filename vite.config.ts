import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: '/', // Ensure correct base path for Vercel
  server: {
    host: "::",
    port: 8081,
    strictPort: true, // Always use port 8081
    open: true, // Automatically open browser
  },
  plugins: [react()],
  optimizeDeps: {
    include: ['react', 'react-dom']
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      react: path.resolve(__dirname, "./node_modules/react"),
      'react-dom': path.resolve(__dirname, "./node_modules/react-dom")
    },
  },
  build: {
    rollupOptions: {
      external: (id) => {
        // Prevent React from being bundled multiple times
        if (id === 'react' || id === 'react-dom') {
          return false; // Bundle React to avoid version conflicts
        }
        return false;
      },
      output: {
        manualChunks: (id) => {
          // Core React libraries
          if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
            return 'react-vendor';
          }
          
          // UI libraries
          if (id.includes('@radix-ui')) {
            return 'ui-vendor';
          }
          
          // Supabase
          if (id.includes('@supabase')) {
            return 'supabase-vendor';
          }
          
          // React Query
          if (id.includes('@tanstack')) {
            return 'query-vendor';
          }
          
          // Charts (lazy load)
          if (id.includes('recharts')) {
            return 'charts-vendor';
          }
          
          // Icons (lazy load)
          if (id.includes('lucide-react')) {
            return 'icons-vendor';
          }
          
          // Utils
          if (id.includes('date-fns') || id.includes('clsx') || id.includes('tailwind-merge')) {
            return 'utils-vendor';
          }
          
          // Admin pages (lazy load)
          if (id.includes('/pages/Admin')) {
            return 'pages-admin';
          }
          
          // Main pages
          if (id.includes('/pages/') && !id.includes('/pages/Admin')) {
            return 'pages-main';
          }
          
          // Modal components (lazy load)
          if (id.includes('/components/modals/') || id.includes('UnifiedPopup')) {
            return 'components-modals';
          }
          
          // Default chunk
          return 'vendor';
        }
      }
    },
    chunkSizeWarningLimit: 500, // Reduce to 500KB for better performance
    target: 'esnext',
    minify: 'esbuild',
    esbuild: {
      drop: mode === 'production' ? ['debugger'] : [], // Keep console logs for debugging
      treeShaking: true, // Enable tree shaking
    },
    // Enable source maps for debugging in production
    sourcemap: mode === 'development',
  },
}));
