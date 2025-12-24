'use client';

import { Search, Sparkles, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import DotGrid from '@/components/DotGrid';
import { RefObject } from 'react';

interface HeroSectionProps {
  heroContentRef: RefObject<HTMLDivElement>;
  isMobile: boolean;
  isSearchFocused: boolean;
  isSearchClosing: boolean;
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchFocus: () => void;
  onClearSearch: () => void;
}

export function HeroSection({
  heroContentRef,
  isMobile,
  isSearchFocused,
  isSearchClosing,
  searchQuery,
  onSearchChange,
  onSearchFocus,
  onClearSearch,
}: HeroSectionProps) {
  const getHeroSectionClasses = () => {
    const baseClasses = 'relative overflow-hidden border-b bg-muted/20';

    if (isMobile) {
      // Smooth transition for mobile hero collapse/expand
      if (isSearchFocused || isSearchClosing) {
        return `${baseClasses} transition-all duration-300 ease-out max-h-0 opacity-0 py-0 border-b-0 overflow-hidden`;
      }
      return `${baseClasses} transition-all duration-300 ease-out max-h-[600px] opacity-100 pt-24 pb-16`;
    }

    if (searchQuery) {
      return `${baseClasses} transition-all duration-300 pt-16 pb-20`;
    }

    return `${baseClasses} transition-all duration-300 pt-24 md:pt-32 pb-16 lg:pb-24`;
  };

  return (
    <section className={getHeroSectionClasses()}>
      <DotGrid
        dotSize={3}
        gap={24}
        baseColor="#9ca3af"
        activeColor="#8b5cf6"
        proximity={100}
        shockRadius={200}
        shockStrength={3}
        resistance={500}
        returnDuration={1}
        className="absolute inset-0 pointer-events-auto"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/60 to-background pointer-events-none" />
      <div
        ref={heroContentRef}
        className="container relative mx-auto px-4 text-center z-10 pointer-events-none will-change-transform"
      >
        <div className="inline-flex items-center rounded-full border bg-background/50 px-3 py-1 text-sm font-medium text-muted-foreground backdrop-blur-md mb-6 shadow-sm pointer-events-auto">
          <Sparkles className="mr-2 h-4 w-4 text-primary" />
          <span className="hidden sm:inline">Discover projects, guides, and stories.</span>
          <span className="sm:hidden">Discover projects & guides.</span>
        </div>

        <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-foreground md:text-6xl lg:text-7xl font-headline pointer-events-auto">
          Fuel Your{' '}
          <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Curiosity
          </span>
          .
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl leading-relaxed pointer-events-auto">
          Hobbyist's Hideaway is your go-to resource for Homelab setups, DIY electronics, coding
          tutorials, and mechanical adventures.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto pointer-events-auto">
          {isMobile ? (
            <div className="relative w-full">
              <Button
                variant="outline"
                className={`w-full h-12 rounded-full shadow-lg border-muted-foreground/20 bg-background/80 backdrop-blur-sm flex items-center justify-start pl-4 pr-10 ${
                  searchQuery ? 'text-foreground' : 'text-muted-foreground'
                }`}
                onClick={onSearchFocus}
              >
                <Search className="h-5 w-5 mr-3 flex-shrink-0" />
                <span className="truncate">{searchQuery || 'Search for tutorials...'}</span>
              </Button>
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full text-muted-foreground"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClearSearch();
                  }}
                >
                  <X className="h-5 w-5" />
                </Button>
              )}
            </div>
          ) : (
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for tutorials..."
                className="pl-10 pr-10 h-12 rounded-full shadow-lg border-muted-foreground/20 bg-background/80 backdrop-blur-sm focus-visible:ring-primary"
                value={searchQuery}
                onChange={onSearchChange}
                onFocus={onSearchFocus}
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full text-muted-foreground"
                  onClick={onClearSearch}
                >
                  <X className="h-5 w-5" />
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}




