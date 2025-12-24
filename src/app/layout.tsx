import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ServiceWorkerRegistration } from '@/components/ServiceWorkerRegistration';
import { getCategoryTree } from '@/lib/posts';

const baseUrl = 'https://bishalkshah.com.np';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Hobbyist's Hideaway | Homelab, Auto Repair, DIY, Electronics & Tech Blog ",
    template: "%s | Hobbyist's Hideaway"
  },
  description: "Hobbyist's Hideaway is your go-to resource for Homelab setups, DIY electronics, Car repairs, and coding tutorials. Practical guides for hobbyists and makers.",
  keywords: ["Homelab", "DIY Electronics", "Automobile", "Coding", "Self-hosting", "Linux", "Makers"],
  authors: [{ name: "Bishal" }],
  creator: "Bishal",
  publisher: "Hobbyist's Hideaway",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: baseUrl,
    siteName: "Hobbyist's Hideaway",
    title: "Hobbyist's Hideaway | Homelab, Auto Repair, DIY, Electronics & Tech Blog ",
    description: "Your go-to resource for Homelab, DIY electronics, Automobile articles, and coding tutorials.",
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: "Hobbyist's Hideaway - Homelab, Auto Repair, DIY, Electronics & Tech Blog ",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Hobbyist's Hideaway | Homelab, Auto Repair, DIY, Electronics & Tech Blog ",
    description: "Your go-to resource for Homelab, DIY electronics, Automobile articles, and coding tutorials.",
    images: ['/og-image.png'],
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
  alternates: {
    canonical: '/',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categoryTree = await getCategoryTree();

  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#8b5cf6" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Hobbyist's Hideaway" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col" suppressHydrationWarning>
        <Header categoryTree={categoryTree} />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <Toaster />
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
