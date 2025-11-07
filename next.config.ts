import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // Removed pageExtensions - it conflicts with App Router page detection
  // Next.js App Router automatically detects page.tsx files

  // Disable Turbopack for build stability (can enable later)
  // Turbopack is enabled by default in Next.js 16, but can cause issues
  // experimental: {
  //   turbo: {},
  // },

  // TypeScript path aliases (configured in tsconfig.json)
  // Next.js automatically uses tsconfig.json paths

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'logo.clearbit.com',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },

  // Environment variables
  env: {
    // Public variables (client-side accessible) use NEXT_PUBLIC_ prefix
    // Server-only variables (no prefix) are automatically server-only
  },

  // Experimental features for Next.js 16
  experimental: {
    // Enable if needed for specific features
  },

  // TypeScript configuration
  typescript: {
    // Run type checking separately (npm run type-check)
    // Don't block builds - faster CI/CD
    ignoreBuildErrors: false, // Changed to see actual errors
    tsconfigPath: './tsconfig.next.json',
  },

  // Compiler options for better performance
  compiler: {
    removeConsole:
      process.env.NODE_ENV === 'production'
        ? {
            exclude: ['error', 'warn'], // Keep errors and warnings
          }
        : false,
  },

  // Turbopack configuration (Next.js 16 default)
  // Webpack config removed - using Turbopack for better performance
  // Unmigrated files excluded via tsconfig.json instead
  turbopack: {
    // Turbopack config if needed
  },
};

export default nextConfig;
