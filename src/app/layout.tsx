import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import AnalyticsTracker from '@/components/analytics/AnalyticsTracker';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'ARMEL Group — Global Solutions in Logistics, IT, Construction & More',
    template: '%s | ARMEL Group',
  },
  description:
    'ARMEL Group is a diversified international company delivering world-class solutions in logistics, IT services, government contracting, lifestyle support, and construction development.',
  keywords: [
    'ARMEL Group',
    'logistics company',
    'IT services',
    'government contracting',
    'construction development',
    'corporate services',
    'supply chain management',
  ],
  authors: [{ name: 'ARMEL Group' }],
  creator: 'ARMEL Group',
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://armelgroup.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://armelgroup.com',
    siteName: 'ARMEL Group',
    title: 'ARMEL Group — Global Solutions in Logistics, IT, Construction & More',
    description:
      'Diversified international company delivering world-class solutions across logistics, IT, government, lifestyle, and construction industries.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ARMEL Group — Building the future with reliability and innovation',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ARMEL Group — Global Solutions',
    description:
      'Diversified international company delivering world-class solutions across multiple industries.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: '#1e3a8a',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen font-sans antialiased">
        <AnalyticsTracker />
        {children}
      </body>
    </html>
  );
}
