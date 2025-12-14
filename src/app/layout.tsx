import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { LayoutWrapper } from './LayoutWrapper';

// Using Inter font - can be updated to Geist Sans per design system requirements
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LeadFlow™ - Stand-to-Deal Pipeline Automation',
  description:
    'Convert physical business cards into digital revenue via AI enrichment and multi-channel automation',
  icons: {
    icon: '/favicon.svg',
    apple: '/apple-touch-icon.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'LeadFlow',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0A1628' },
  ],
  viewportFit: 'cover', // Support for notched devices
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className='h-dvh overflow-hidden' suppressHydrationWarning>
      <head>
        <meta name='mobile-web-app-capable' content='yes' />
        <meta name='apple-mobile-web-app-capable' content='yes' />
        <meta name='apple-mobile-web-app-status-bar-style' content='default' />
        <meta name='format-detection' content='telephone=no' />
        <link rel='manifest' href='/manifest.json' />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Immediate OAuth hash fragment detection (runs before React)
              (function() {
                if (typeof window === 'undefined') return;
                const hash = window.location.hash.substring(1);
                if (!hash) return;
                
                const hashParams = new URLSearchParams(hash);
                const accessToken = hashParams.get('access_token');
                const refreshToken = hashParams.get('refresh_token');
                const error = hashParams.get('error');
                
                // If we have OAuth tokens and we're not on /auth/callback, redirect immediately
                if ((accessToken || refreshToken || error) && !window.location.pathname.includes('/auth/callback')) {
                  window.location.replace('/auth/callback' + window.location.hash);
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${inter.className} h-full overflow-hidden m-0 p-0 antialiased`}
      >
        <Providers>
          <LayoutWrapper>{children}</LayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
