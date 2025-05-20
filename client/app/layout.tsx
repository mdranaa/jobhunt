import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { AuthProvider } from '@/context/auth-context';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'JobHunt - Find Your Next Career Opportunity',
  description:
    'Discover the perfect job opportunities across various industries with JobHunt, the premier job board for professionals.',
  keywords: 'jobs, career, employment, hiring, job search, job board',
  authors: [{ name: 'JobHunt Team' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://jobhunt.example.com',
    title: 'JobHunt - Find Your Next Career Opportunity',
    description:
      'Discover the perfect job opportunities across various industries with JobHunt.',
    siteName: 'JobHunt'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JobHunt - Find Your Next Career Opportunity',
    description:
      'Discover the perfect job opportunities across various industries with JobHunt.'
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="canonical" href="https://jobhunt.example.com" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="theme-color" content="#2563EB" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <div className="flex flex-col min-h-screen items-center justify-center">
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
