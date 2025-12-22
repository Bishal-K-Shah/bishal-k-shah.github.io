"use client";

import { useState, useMemo, useEffect, Suspense, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PostCard } from "@/components/PostCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { categoryInfo } from "@/components/icons"; 
import { Category, Post, CategoryTree, MAIN_CATEGORIES } from "@/types";
import { Search, Sparkles, ArrowRight, X, Tag as TagIcon, LayoutGrid, ChevronRight, Hash } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { format, parseISO } from "date-fns";
import DotGrid from "@/components/DotGrid";
import { Badge } from "@/components/ui/badge";
import { capitalize } from "@/lib/utils";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";

interface HomeContentProps {
  initialPosts: Post[];
  categoriesList: Category[]; 
  categoryTree: CategoryTree;
}

function HomeContent({ initialPosts, categoriesList, categoryTree }: HomeContentProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const postsSectionRef = useRef<HTMLDivElement>(null);
  
  const [selectedCategory, setSelectedCategory] = useState<Category | "All">("All");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileBrowseOpen, setIsMobileBrowseOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const isInitialRender = useRef(true);

  // Sync state with URL param on load
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    const tagParam = searchParams.get("tag");
    
    if (categoryParam) {
      // Check if it exists in our tree keys
      if (Object.keys(categoryTree).includes(categoryParam)) {
        setSelectedCategory(categoryParam);
      }
    } else {
      setSelectedCategory("All");
    }

    if (tagParam) {
      setSelectedTag(tagParam);
    } else {
      setSelectedTag(null);
    }
  }, [searchParams, categoryTree]);

  // Scroll to posts when filter is applied
  useEffect(() => {
    // Skip scrolling on the initial page load
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    // Scroll when a category or tag is selected
    if (selectedCategory !== "All" || selectedTag) {
      postsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedCategory, selectedTag]);
  
  // Track mobile screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640); // sm breakpoint is 640px
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filteredPosts = useMemo(() => {
    return initialPosts.filter((post) => {
      // 1. Filter by Category
      const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
      
      // 2. Filter by Tag
      const matchesTag = selectedTag ? post.tags?.includes(selectedTag) : true;

      // 3. Filter by Search Query (Title or Excerpt)
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        post.title.toLowerCase().includes(query) || 
        post.excerpt.toLowerCase().includes(query);

      return matchesCategory && matchesTag && matchesSearch;
    });
  }, [initialPosts, selectedCategory, selectedTag, searchQuery]);

  // Update URL helper
  const updateFilters = (category: string | "All", tag: string | null) => {
    const params = new URLSearchParams(window.location.search);
    if (category !== "All") {
      params.set("category", category);
    } else {
      params.delete("category");
    }

    if (tag) {
      params.set("tag", tag);
    } else {
      params.delete("tag");
    }
    
    // Clear search when filters are applied
    setSearchQuery(""); 

    const newUrl = `/?${params.toString()}`;
    router.push(newUrl, { scroll: false });
    setIsMobileBrowseOpen(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    // If there's a query, clear the filters in the URL
    if (query) {
      router.push(`/`, { scroll: false }); 
    }
  };

  const handleCategoryClick = (category: Category | "All") => {
    // When clicking a main tab, we reset the tag
    updateFilters(category, null);
  };

  const clearTag = () => {
    updateFilters(selectedCategory, null);
  };

  const clearAllFilters = () => {
    router.push("/");
    setSearchQuery("");
  };

  // Determine if the selected category is one of the MAIN ones
  const isMainCategorySelected = selectedCategory !== "All" && MAIN_CATEGORIES.includes(selectedCategory);
  
  // Determine if we are in a "Niche" category (not in main list)
  const isNicheCategorySelected = selectedCategory !== "All" && !MAIN_CATEGORIES.includes(selectedCategory);

  const getHeroSectionClasses = () => {
    const baseClasses = "relative overflow-hidden border-b bg-muted/20 transition-all duration-300";

    if (isMobile) {
      return `${baseClasses} ${isSearchFocused ? 'hidden' : 'pt-24 pb-16'}`;
    }

    if (searchQuery) {
      return `${baseClasses} pt-16 pb-20`;
    }

    return `${baseClasses} pt-24 md:pt-32 pb-16 lg:pb-24`;
  };

  return (
    <div className={`min-h-screen ${isSearchFocused && isMobile ? 'pt-20' : ''}`}>
      {/* Mobile-only fixed search header */}
      {isMobile && isSearchFocused && (
        <div className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-b z-50 p-4 animate-in fade-in slide-in-from-top-4">
          <div className="relative w-full max-w-lg mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              type="text" 
              placeholder="Search for tutorials..." 
              className="pl-10 h-12 rounded-full shadow-lg border-muted-foreground/20 bg-muted/50 focus-visible:ring-primary pr-10"
              value={searchQuery}
              onChange={handleSearchChange}
              onBlur={() => setIsSearchFocused(false)}
              autoFocus // Focus on this input when it appears
            />
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full text-muted-foreground"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                setSearchQuery("");
                setIsSearchFocused(false);
              }}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}
      
      {/* Hero Section with Dot Grid Background */}
      <section className={getHeroSectionClasses()}>
        <DotGrid
          dotSize={3}
          gap={24}
          baseColor="#9ca3af" // Gray-400 for better visibility as small dots
          activeColor="#8b5cf6"
          proximity={100}
          shockRadius={200}
          shockStrength={3}
          resistance={500}
          returnDuration={1}
          className="absolute inset-0 pointer-events-auto"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/60 to-background pointer-events-none" />
        <div className={`container relative mx-auto px-4 text-center z-10 pointer-events-none ${isMobile && isSearchFocused ? 'hidden' : ''}`}> 
           <div className="inline-flex items-center rounded-full border bg-background/50 px-3 py-1 text-sm font-medium text-muted-foreground backdrop-blur-md mb-6 shadow-sm pointer-events-auto">
              <Sparkles className="mr-2 h-4 w-4 text-primary" />
              <span className="hidden sm:inline">Discover projects, guides, and stories.</span>
              <span className="sm:hidden">Discover projects & guides.</span>
           </div>
           
           <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-foreground md:text-6xl lg:text-7xl font-headline pointer-events-auto">
             Fuel Your <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Curiosity</span>.
           </h1>
           
           <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl leading-relaxed pointer-events-auto">
             Hobbyist's Hideaway is your go-to resource for Homelab setups, DIY electronics, coding tutorials, and mechanical adventures.
           </p>

           <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto pointer-events-auto">
              {isMobile ? (
                <div className="relative w-full">
                  <Button 
                    variant="outline" 
                    className={`w-full h-12 rounded-full shadow-lg border-muted-foreground/20 bg-background/80 backdrop-blur-sm flex items-center justify-start pl-4 pr-10 ${searchQuery ? 'text-foreground' : 'text-muted-foreground'}`}
                    onClick={() => setIsSearchFocused(true)}
                  >
                    <Search className="h-5 w-5 mr-3 flex-shrink-0" />
                    <span className="truncate">
                      {searchQuery || 'Search for tutorials...'}
                    </span>
                  </Button>
                  {searchQuery && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full text-muted-foreground"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent the search bar from focusing
                        setSearchQuery("");
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
                    onChange={handleSearchChange}
                    onFocus={() => setIsSearchFocused(true)}
                  />
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full text-muted-foreground"
                      onClick={() => setSearchQuery("")}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  )}
                </div>
              )}
           </div>
        </div>
      </section>

      {/* Recent Posts Section - Hidden when searching or filtering by tag */}
      {!searchQuery && !selectedTag && (
      <section className="border-t bg-gradient-to-b from-muted/40 to-background py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold font-headline">Recent Posts</h2>
            <Link href="#all-posts" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {initialPosts.slice(0, isMobile ? 3 : 6).map((post) => {
              return (
                <Link key={post.slug} href={`/blog/${post.slug}`}>
                  <div className="group flex gap-3 p-3 rounded-lg border border-border/40 bg-card shadow-sm hover:shadow-md hover:border-primary/60 transition-all duration-200 cursor-pointer overflow-hidden">
                    {/* Thumbnail */}
                    {post.featuredImage && (
                      <div className="w-20 h-20 flex-shrink-0 rounded-md overflow-hidden bg-muted relative">
                        <Image
                          src={post.featuredImage}
                          alt={post.title}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    )}
                    {/* Content */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <h3 className="text-sm font-semibold line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                          {post.title}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                          {post.excerpt}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground/70 font-medium mt-2">
                        {format(parseISO(post.date), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
      )}

      {/* Main Content */}
      <div ref={postsSectionRef} className={`container mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-6 ${isSearchFocused && isMobile ? 'pt-0 pb-16' : 'py-16'}`}>
        
        {/* Category Filter Tabs */}
        <div id="all-posts" className="flex flex-col items-center mb-8">
           <div className="inline-flex flex-wrap justify-center gap-2 p-1 bg-muted/50 backdrop-blur-sm rounded-xl border border-border/50">
            <Button
              variant={selectedCategory === "All" ? "default" : "ghost"}
              size="sm"
              onClick={() => handleCategoryClick("All")}
              className="rounded-lg h-9"
            >
              All Posts
            </Button>
            
            {/* Main Categories */}
            {MAIN_CATEGORIES.map((name) => {
               // Resolve Icon on Client Side
               const Icon = categoryInfo[name].icon;
               return (
                <Button
                  key={name}
                  variant={selectedCategory === name ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleCategoryClick(name)}
                  className="rounded-lg h-9"
                >
                  {Icon && <Icon className="mr-2 h-4 w-4" />}
                  {capitalize(name)}
                </Button>
              )
            })}

            {/* Desktop Browse (Dropdown) */}
            <div className="hidden md:flex">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className={isNicheCategorySelected ? "bg-accent text-accent-foreground rounded-lg h-9" : "rounded-lg h-9"}>
                    <LayoutGrid className="mr-2 h-4 w-4" />
                    Browse
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="text-xs font-normal text-muted-foreground uppercase tracking-wider">Browse by Topic</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {Object.keys(categoryTree).sort().map(cat => {
                     const tags = categoryTree[cat];
                     const hasTags = tags && tags.length > 0;
                     
                     if (hasTags) {
                       return (
                         <DropdownMenuSub key={cat}>
                           <DropdownMenuSubTrigger className="cursor-pointer group">
                             <span className="group-focus:text-accent-foreground group-hover:text-accent-foreground group-data-[state=open]:text-accent-foreground">{capitalize(cat)}</span>
                           </DropdownMenuSubTrigger>
                           <DropdownMenuSubContent className="p-1">
                              {/* Main Category Link - acts as "View All" */}
                              <DropdownMenuItem onClick={() => updateFilters(cat, null)} className="font-bold cursor-pointer">
                                 {capitalize(cat)}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {tags.map(tag => (
                                <DropdownMenuItem key={tag} onClick={() => updateFilters(cat, tag)} className="cursor-pointer">
                                  {capitalize(tag)}
                                </DropdownMenuItem>
                              ))}
                           </DropdownMenuSubContent>
                         </DropdownMenuSub>
                       )
                     }
                     return (
                       <DropdownMenuItem key={cat} onClick={() => updateFilters(cat, null)} className="cursor-pointer group">
                         <span className="group-focus:text-accent-foreground group-hover:text-accent-foreground">{capitalize(cat)}</span>
                       </DropdownMenuItem>
                     )
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile Browse (Sheet/Drawer) */}
            <div className="md:hidden">
              <Sheet open={isMobileBrowseOpen} onOpenChange={setIsMobileBrowseOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className={isNicheCategorySelected ? "bg-accent text-accent-foreground rounded-lg h-9" : "rounded-lg h-9"}>
                    <LayoutGrid className="mr-2 h-4 w-4" />
                    Browse
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[80vh] rounded-t-xl p-0">
                   <SheetHeader className="px-6 py-4 border-b">
                      <SheetTitle className="text-left flex items-center gap-2">
                        <LayoutGrid className="h-5 w-5" /> Browse Topics
                      </SheetTitle>
                   </SheetHeader>
                   <ScrollArea className="h-full p-4 pb-20">
                      <Accordion type="single" collapsible className="w-full">
                         {Object.keys(categoryTree).sort().map(cat => {
                            const tags = categoryTree[cat];
                            const hasTags = tags && tags.length > 0;
                            const Icon = categoryInfo[cat]?.icon || Hash;
                            
                            if (hasTags) {
                              return (
                                <AccordionItem key={cat} value={cat} className="border-b-0 mb-2">
                                   <AccordionTrigger className="hover:no-underline py-3 px-2 rounded-lg hover:bg-muted">
                                      <div className="flex items-center gap-3">
                                        <Icon className="h-5 w-5 text-muted-foreground" />
                                        <span className="font-semibold text-lg">{capitalize(cat)}</span>
                                      </div>
                                   </AccordionTrigger>
                                   <AccordionContent className="pb-2 pt-1 pl-4">
                                      <div className="flex flex-col gap-2 border-l-2 border-muted pl-4">
                                        <button 
                                          onClick={() => updateFilters(cat, null)}
                                          className="text-base font-bold text-left py-2 hover:text-primary transition-colors flex items-center gap-2"
                                        >
                                          View All {capitalize(cat)} <ChevronRight className="h-3 w-3" />
                                        </button>
                                        {tags.map(tag => (
                                          <button 
                                            key={tag} 
                                            onClick={() => updateFilters(cat, tag)}
                                            className="text-base text-muted-foreground text-left py-2 hover:text-primary transition-colors"
                                          >
                                            {capitalize(tag)}
                                          </button>
                                        ))}
                                      </div>
                                   </AccordionContent>
                                </AccordionItem>
                              )
                            }

                            // If no tags, render as a direct button masquerading as a row
                            return (
                              <div key={cat} className="border-b-0 mb-2">
                                <button 
                                  onClick={() => updateFilters(cat, null)}
                                  className="flex w-full items-center justify-between py-3 px-2 rounded-lg hover:bg-muted transition-colors"
                                >
                                   <div className="flex items-center gap-3">
                                      <Icon className="h-5 w-5 text-muted-foreground" />
                                      <span className="font-semibold text-lg">{capitalize(cat)}</span>
                                   </div>
                                </button>
                              </div>
                            )
                         })}
                      </Accordion>
                   </ScrollArea>
                </SheetContent>
              </Sheet>
            </div>

          </div>

          {/* Active Filters Feedback */}
          {(selectedTag || isNicheCategorySelected) && (
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4 animate-in fade-in slide-in-from-top-2">
               {isNicheCategorySelected && (
                 <Badge variant="secondary" className="pl-3 pr-1 py-1 text-sm bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary transition-colors">
                   Category: {selectedCategory} 
                   <Button variant="ghost" size="icon" className="h-4 w-4 ml-2 hover:bg-transparent hover:text-primary" onClick={() => updateFilters("All", null)}>
                      <X className="h-3 w-3" />
                   </Button>
                 </Badge>
               )}
               {selectedTag && (
                 <Badge variant="secondary" className="pl-3 pr-1 py-1 text-sm bg-accent text-accent-foreground hover:bg-accent/80 hover:text-accent-foreground transition-colors">
                   <TagIcon className="h-3 w-3 mr-1" />
                   {selectedTag}
                   <Button variant="ghost" size="icon" className="h-4 w-4 ml-2 hover:bg-transparent hover:text-accent-foreground" onClick={clearTag}>
                      <X className="h-3 w-3" />
                   </Button>
                 </Badge>
               )}
               <Button variant="link" size="sm" className="text-xs text-muted-foreground h-auto p-0 ml-2" onClick={clearAllFilters}>
                 Clear all
               </Button>
            </div>
          )}
        </div>

        {/* Results Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-16">
            {filteredPosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-muted/30 rounded-3xl border border-dashed border-muted-foreground/20">
            <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
               <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">No results found</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              We couldn't find any articles matching your filters.
            </p>
            <Button 
              variant="outline" 
              onClick={clearAllFilters}
            >
              Clear filters
            </Button>
          </div>
        )}

        {/* Newsletter / CTA Section */}
        <div className="rounded-3xl bg-primary text-primary-foreground p-8 md:p-12 text-center relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>
           <div className="relative z-10 max-w-2xl mx-auto">
             <h2 className="text-3xl font-bold mb-4 font-headline">Never Miss a Project</h2>
             <p className="text-primary-foreground/80 mb-8 text-lg">
               Join our community of makers. Get the latest guides on Homelab, Electronics, and Coding delivered to your inbox.
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

      </div>
    </div>
  );
}

export default function Home({
  initialPosts,
  categoriesList,
  categoryTree
}: HomeContentProps) {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <HomeContent 
        initialPosts={initialPosts} 
        categoriesList={categoriesList} 
        categoryTree={categoryTree} 
      />
    </Suspense>
  );
}
