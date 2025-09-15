import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '5GLabX Protocol Simulator - Professional 3GPP Network Analysis Platform',
  description: 'Advanced 5G/4G network analysis platform with 1000+ test cases, real-time protocol simulation, and professional analyzer interface for 3GPP compliance testing.',
  keywords: [
    '5G',
    '4G',
    '3GPP',
    'Protocol Simulator',
    'Network Analysis',
    'srsRAN',
    'Open5GS',
    'Kamailio',
    'O-RAN',
    'NB-IoT',
    'V2X',
    'NTN',
    'LTE',
    'NR',
    'IMS',
    'SIP'
  ],
  authors: [{ name: '5GLabX Team' }],
  creator: '5GLabX',
  publisher: '5GLabX',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    title: '5GLabX Protocol Simulator - Professional 3GPP Network Analysis',
    description: 'Advanced 5G/4G network analysis platform with 1000+ test cases and real-time protocol simulation.',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    siteName: '5GLabX Protocol Simulator',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: '5GLabX Protocol Simulator',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '5GLabX Protocol Simulator - Professional 3GPP Network Analysis',
    description: 'Advanced 5G/4G network analysis platform with 1000+ test cases and real-time protocol simulation.',
    images: ['/og-image.png'],
    creator: '@5glabx',
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
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <meta name="theme-color" content="#3b82f6" />
      </head>
      <body className={inter.className}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#22c55e',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}