"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { CATEGORIES, CategoryInfo } from "@/types";
import { categoryInfo } from "@/components/icons";

export function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);
  const categories: CategoryInfo[] = CATEGORIES.map(name => categoryInfo[name]);

  const routes = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
  ];

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
                {categories.map(({ name, icon: Icon }) => (
                  <DropdownMenuItem key={name} asChild className="cursor-pointer group">
                    {/* Since we don't have separate category pages yet, we link to Home with a query param or anchor. 
                        For now, linking to home is the safest client-side filtering approach unless we refactor. 
                        Ideally, this would go to /category/[slug]. 
                        I will assume the filter logic on Home handles this or we just link to Home for now.
                    */}
                    <Link href={`/?category=${name}`} className="flex items-center gap-2 py-2">
                      <Icon className="h-4 w-4 text-muted-foreground group-focus:text-white group-hover:text-white transition-colors" />
                      <span>{name}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
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
          <SheetContent side="right" className="w-[300px] sm:w-[400px] pr-0">
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
                <div className="flex flex-col gap-3 pl-4 border-l-2 border-muted ml-1">
                   {categories.map(({ name, icon: Icon }) => (
                      <Link
                        key={name}
                        href={`/?category=${name}`}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 text-base text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Icon className="h-4 w-4" />
                        {name}
                      </Link>
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
