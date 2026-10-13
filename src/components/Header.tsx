"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn, capitalize } from "@/lib/utils";
import { Menu, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CategoryTags } from "@/types";

// Menus show only each category's most used tags; the full list lives on the category page
const DESKTOP_MENU_TAG_LIMIT = 8;
const MOBILE_MENU_TAG_LIMIT = 5;

const categoryHref = (category: string) => `/?category=${encodeURIComponent(category)}`;
const tagHref = (category: string, tag: string) =>
  `/?category=${encodeURIComponent(category)}&tag=${encodeURIComponent(tag)}`;

interface HeaderProps {
  categoryTags: CategoryTags;
}

export function Header({ categoryTags }: HeaderProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);
  const categories = Object.keys(categoryTags).sort();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 relative">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group md:flex-row">
          <Image
            src="/logo.png"
            alt="Hobbyist's Hideaway Logo"
            width={50}
            height={50}
            className="h-10 w-10 md:h-12 md:w-12 object-contain"
            priority
          />
          <span className="hidden md:inline text-xl font-bold font-headline tracking-tight">
            Hobbyist's Hideaway
          </span>
        </Link>
        
        {/* Centered text for mobile */}
        <Link href="/" className="md:hidden absolute left-1/2 transform -translate-x-1/2 z-10">
          <span className="text-lg sm:text-xl font-bold font-headline tracking-tight whitespace-nowrap">
            Hobbyist's Hideaway
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
           <Link 
              href="/" 
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === "/" ? "text-primary" : "text-muted-foreground"
              )}
            >
              Home
            </Link>

            {/* Categories Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className={cn(
                    "text-sm font-medium h-auto p-0 hover:bg-transparent hover:text-primary data-[state=open]:text-primary focus-visible:ring-0",
                    pathname.startsWith("/category") ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  Categories <ChevronDown className="ml-1 h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-56 p-2">
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground uppercase tracking-wider">Browse by Topic</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {categories.map((category) => {
                  const allTags = categoryTags[category] ?? [];
                  const tags = allTags.slice(0, DESKTOP_MENU_TAG_LIMIT);
                  const hasTags = tags.length > 0;

                  if (hasTags) {
                    return (
                      <DropdownMenuSub key={category}>
                        <DropdownMenuSubTrigger className="cursor-pointer group">
                          <span className="group-focus:text-accent-foreground group-hover:text-accent-foreground group-data-[state=open]:text-accent-foreground">{capitalize(category)}</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent className="p-1">
                          {/* Main Category Link - acts as "All" */}
                          <DropdownMenuItem asChild className="cursor-pointer font-bold">
                            <Link href={categoryHref(category)} className="w-full">
                              {capitalize(category)}
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {tags.map(({ tag }) => (
                            <DropdownMenuItem key={tag} asChild className="cursor-pointer">
                              <Link href={tagHref(category, tag)} className="w-full">
                                {capitalize(tag)}
                              </Link>
                            </DropdownMenuItem>
                          ))}
                          {allTags.length > tags.length && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem asChild className="cursor-pointer text-primary">
                                <Link href={categoryHref(category)} className="flex w-full items-center gap-1">
                                  More in {capitalize(category)} <ChevronRight className="h-3.5 w-3.5" />
                                </Link>
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
                    );
                  }

                  return (
                    <DropdownMenuItem key={category} asChild className="cursor-pointer group">
                      <Link href={categoryHref(category)} className="flex items-center gap-2 py-2 w-full">
                        <span className="group-focus:text-accent-foreground group-hover:text-accent-foreground">{capitalize(category)}</span>
                      </Link>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link 
              href="/about" 
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === "/about" ? "text-primary" : "text-muted-foreground"
              )}
            >
              About
            </Link>
        </nav>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden absolute right-4 md:relative md:right-0">
            <Button variant="ghost" size="icon" aria-label="Menu">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px] pr-0 overflow-y-auto" aria-describedby={undefined}>
             <SheetHeader className="px-1 text-left">
                <SheetTitle className="flex items-center gap-2 pb-4 border-b text-xl font-bold tracking-tight">
                  <Image
                    src="/logo.png"
                    alt="Hobbyist's Hideaway Logo"
                    width={24}
                    height={24}
                    className="h-6 w-6 object-contain"
                  />
                  Hobbyist's Hideaway
                </SheetTitle>
             </SheetHeader>
            <nav className="flex flex-col gap-4 mt-8 px-1">
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 text-lg font-medium hover:text-primary transition-colors"
              >
                Home
              </Link>
              
              <div className="py-2">
                <h4 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Categories</h4>
                <Accordion type="single" collapsible className="flex flex-col pl-4 pr-4 border-l-2 border-primary ml-1">
                  {categories.map((category) => {
                    const tags = (categoryTags[category] ?? []).slice(0, MOBILE_MENU_TAG_LIMIT);

                    if (tags.length === 0) {
                      return (
                        <Link
                          key={category}
                          href={categoryHref(category)}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center text-base font-medium text-foreground/80 hover:text-foreground transition-colors py-2"
                        >
                          {capitalize(category)}
                        </Link>
                      );
                    }

                    return (
                      <AccordionItem key={category} value={category} className="border-b-0">
                        <AccordionTrigger className="py-2 text-base font-medium text-foreground/80 hover:text-foreground hover:no-underline">
                          {capitalize(category)}
                        </AccordionTrigger>
                        <AccordionContent className="pb-2">
                          <div className="flex flex-col gap-1 pl-3 border-l border-border">
                            {tags.map(({ tag }) => (
                              <Link
                                key={tag}
                                href={tagHref(category, tag)}
                                onClick={() => setIsOpen(false)}
                                className="text-sm text-muted-foreground hover:text-primary transition-colors py-1.5"
                              >
                                {capitalize(tag)}
                              </Link>
                            ))}
                            <Link
                              href={categoryHref(category)}
                              onClick={() => setIsOpen(false)}
                              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors py-1.5"
                            >
                              View all {capitalize(category)} <ChevronRight className="h-3.5 w-3.5" />
                            </Link>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </div>

              <Link
                href="/about"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 text-lg font-medium hover:text-primary transition-colors"
              >
                About
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
