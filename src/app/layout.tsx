import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { LayoutWrapper } from './LayoutWrapper';

// TODO: Update to Geist Sans per PDR Section 3
// For now keeping Inter, can be updated to Geist when available
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LeadFlow™ - Stand-to-Deal Pipeline Automation',
  description: 'Convert physical business cards into digital revenue via AI enrichment and multi-channel automation',
  icons: {
    icon: '/favicon.svg',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='en'
      className='h-full overflow-hidden'
      style={{ height: '100vh' }}
    >
      <body
        className={`${inter.className} h-full overflow-hidden`}
        style={{ height: '100%', margin: 0, padding: 0 }}
      >
        <Providers>
          <LayoutWrapper>{children}</LayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
