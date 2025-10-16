import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: '/', // Ensure correct base path for Vercel
  server: {
    host: 'localhost',
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
      'chart.js',
      'react-chartjs-2',
    ],
    exclude: ['@vite/client', '@vite/env'],
    force: true,
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
