import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { getCategoryTree } from '@/lib/posts';

export const metadata: Metadata = {
  title: "Hobbyist's Hideaway",
  description: 'A personal blog about automobile, technology, electronics, and homelab projects.',
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
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col">
        <Header categoryTree={categoryTree} />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
