"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ArticleStickyHeaderProps {
  title: string;
}

export function ArticleStickyHeader({ title }: ArticleStickyHeaderProps) {
  const [isVisible, setIsVisible] = React.useState(true);
  const [lastScrollY, setLastScrollY] = React.useState(0);

  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < 50) {
        setIsVisible(true);
      } else {
        if (currentScrollY < lastScrollY) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div
      className={cn(
        "hidden md:block sticky top-16 z-30 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40 py-2 transition-all duration-300 transform",
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
      )}
    >
      <div className="container mx-auto px-4 max-w-5xl flex items-center justify-between">
        <Button 
          variant="ghost" 
          size="sm" 
          asChild 
          className="-ml-2 text-muted-foreground hover:bg-accent hover:text-white dark:hover:text-white transition-colors"
        >
          <Link href="/">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
        <span className="text-xs font-medium text-muted-foreground hidden sm:block truncate max-w-[200px]">
          {title}
        </span>
      </div>
    </div>
  );
}
