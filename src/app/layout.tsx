import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'RECRUITEDGE Intelligence Platform - 4Twenty',
  description: 'AI-powered recruitment platform for managing jobs and people',
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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
