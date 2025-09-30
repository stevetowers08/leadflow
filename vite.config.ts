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
    include: ['react', 'react-dom', '@radix-ui/react-popover']
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      react: path.resolve(__dirname, "./node_modules/react"),
      'react-dom': path.resolve(__dirname, "./node_modules/react-dom")
    },
  },
  build: {
    target: 'es2020',
    sourcemap: true,
  },
}));
