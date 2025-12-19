import Link from 'next/link';
import { PenSquare } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-foreground/90 hover:text-foreground transition-colors">
          <PenSquare className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold font-headline">
            Hobbyist's Hideaway
          </span>
        </Link>
      </div>
    </header>
  );
}
