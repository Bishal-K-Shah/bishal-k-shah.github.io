"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn, capitalize } from "@/lib/utils";
import { Menu, ChevronDown } from "lucide-react";
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
import { CategoryTree } from "@/types";

interface HeaderProps {
  categoryTree: CategoryTree;
}

export function Header({ categoryTree }: HeaderProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);
  const categories = Object.keys(categoryTree).sort();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-xl font-bold font-headline tracking-tight">
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
                  const tags = categoryTree[category];
                  const hasTags = tags && tags.length > 0;

                  if (hasTags) {
                    return (
                      <DropdownMenuSub key={category}>
                        <DropdownMenuSubTrigger className="cursor-pointer group">
                          <span className="group-focus:text-accent-foreground group-hover:text-accent-foreground group-data-[state=open]:text-accent-foreground">{capitalize(category)}</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent className="p-1">
                          {/* Main Category Link - acts as "All" */}
                          <DropdownMenuItem asChild className="cursor-pointer font-bold">
                            <Link href={`/?category=${category}`} className="w-full">
                              {capitalize(category)}
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {tags.map(tag => (
                            <DropdownMenuItem key={tag} asChild className="cursor-pointer">
                              <Link href={`/?category=${category}&tag=${tag}`} className="w-full">
                                {capitalize(tag)}
                              </Link>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
                    );
                  }

                  return (
                    <DropdownMenuItem key={category} asChild className="cursor-pointer group">
                      <Link href={`/?category=${category}`} className="flex items-center gap-2 py-2 w-full">
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
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" aria-label="Menu">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px] pr-0 overflow-y-auto">
             <SheetHeader className="px-1 text-left">
                <SheetTitle className="flex items-center gap-2 pb-4 border-b text-xl font-bold tracking-tight">
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
                <div className="flex flex-col gap-2 pl-4 border-l-2 border-muted ml-1">
                   {categories.map((category) => (
                      <div key={category} className="flex flex-col gap-1">
                        <Link
                          href={`/?category=${category}`}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 text-base font-medium text-foreground/80 hover:text-foreground transition-colors py-1"
                        >
                          {capitalize(category)}
                        </Link>
                        {/* Render tags as indented links in mobile menu too */}
                        {categoryTree[category]?.map(tag => (
                           <Link
                            key={tag}
                            href={`/?category=${category}&tag=${tag}`}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors pl-4 py-1"
                          >
                            - {capitalize(tag)}
                          </Link>
                        ))}
                      </div>
                   ))}
                </div>
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
