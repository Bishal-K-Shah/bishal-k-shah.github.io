'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RefObject } from 'react';

interface NewsletterCTAProps {
  ctaRef: RefObject<HTMLDivElement>;
  isVisible: boolean;
}

export function NewsletterCTA({ ctaRef, isVisible }: NewsletterCTAProps) {
  return (
    <div
      ref={ctaRef}
      className={`rounded-3xl bg-primary text-primary-foreground p-8 md:p-12 text-center relative overflow-hidden scroll-reveal-scale ${
        isVisible ? 'scroll-reveal-scale--visible' : ''
      }`}
    >
      <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>
      <div className="relative z-10 max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-4 font-headline">Never Miss a Project</h2>
        <p className="text-primary-foreground/80 mb-8 text-lg">
          Join our community of makers. Get the latest guides on Homelab, Electronics, and Coding
          delivered to your inbox.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
          <Input
            placeholder="Enter your email"
            className="bg-primary-foreground text-primary placeholder:text-primary/50 border-0 h-12"
          />
          <Button variant="secondary" className="h-12 px-8 font-bold">
            Subscribe
          </Button>
        </div>
      </div>
    </div>
  );
}

