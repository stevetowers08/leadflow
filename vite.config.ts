import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: '/', // Ensure correct base path for Vercel
  // Expose NEXT_PUBLIC_* environment variables for legacy compatibility
  envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
  server: {
    host: true, // Listen on all interfaces to allow Cloudflare tunnel access
    port: 8086,
    strictPort: true, // Force exact port, fail if busy
    open: false, // Controlled via npm script
    hmr: {
      clientPort: 8086, // Cloudflare tunnel will forward to this
      protocol: 'ws', // WebSocket protocol for HMR
    },
    watch: {
      usePolling: true, // Required for network drives/mapped drives (Windows)
      interval: 1000, // Polling interval in milliseconds
    },
  },
  plugins: [react()],
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@radix-ui/react-popover',
      '@tanstack/react-query',
      '@supabase/supabase-js',
      'chart.js',
      'react-chartjs-2',
      'recharts',
    ],
    exclude: ['@vite/client', '@vite/env'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'es2020',
    sourcemap: mode === 'development' ? 'inline' : false, // Only enable sourcemaps in development
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: [
            '@radix-ui/react-dialog',
            '@radix-ui/react-popover',
            '@radix-ui/react-dropdown-menu',
          ],
          charts: ['chart.js', 'react-chartjs-2', 'recharts'],
          supabase: ['@supabase/supabase-js'],
          tanstack: ['@tanstack/react-query', '@tanstack/react-table'],
          dnd: ['@dnd-kit/core', '@dnd-kit/utilities'],
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    chunkSizeWarningLimit: 500, // Target 500KB chunks
    minify: 'terser', // Enable minification for better performance
  },
}));
