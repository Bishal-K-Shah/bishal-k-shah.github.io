'use client';

import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface MobileSearchHeaderProps {
  isVisible: boolean;
  isClosing: boolean;
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClose: () => void;
}

export function MobileSearchHeader({
  isVisible,
  isClosing,
  searchQuery,
  onSearchChange,
  onClose,
}: MobileSearchHeaderProps) {
  if (!isVisible && !isClosing) return null;

  return (
    <div
      className={`fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-b z-50 p-4 transition-all duration-200 ease-out ${
        isClosing
          ? 'opacity-0 -translate-y-full'
          : 'opacity-100 translate-y-0 animate-in fade-in slide-in-from-top-4'
      }`}
    >
      <div className="relative w-full max-w-lg mx-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search for tutorials..."
          className="pl-10 h-12 rounded-full shadow-lg border-muted-foreground/20 bg-muted/50 focus-visible:ring-primary pr-10"
          value={searchQuery}
          onChange={onSearchChange}
          autoFocus
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full text-muted-foreground"
          onMouseDown={(e) => e.preventDefault()}
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}




