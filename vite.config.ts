import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
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
      output: {
        manualChunks: undefined, // Disable manual chunking to prevent React scheduler issues
      }
    },
    chunkSizeWarningLimit: 1000, // Increase limit
    target: 'esnext',
    minify: 'esbuild',
    esbuild: {
      drop: mode === 'production' ? ['debugger'] : [], // Keep console logs for debugging
      treeShaking: false, // Disable tree shaking to prevent React scheduler issues
    },
    // Enable source maps for debugging in production
    sourcemap: mode === 'development',
  },
}));
