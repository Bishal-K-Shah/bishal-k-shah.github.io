"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PostCard } from "@/components/PostCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getPosts, getCategoriesWithIcons } from "@/lib/posts";
import { getPlaceholderImageById } from "@/lib/placeholder-images";
import { categoryInfo } from "@/components/icons";
import type { Category } from "@/types";
import { Search, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { format, parseISO } from "date-fns";
import DotGrid from "@/components/DotGrid";

function HomeContent() {
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<Category | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  // Sync state with URL param on load
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      // Validate if it's a real category
      const isValid = getCategoriesWithIcons().some(c => c.name === categoryParam);
      if (isValid) {
        setSelectedCategory(categoryParam as Category);
      }
    }
  }, [searchParams]);

  // Track mobile screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640); // sm breakpoint is 640px
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const posts = getPosts();
  const categories = getCategoriesWithIcons();
  
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      // 1. Filter by Category
      const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
      
      // 2. Filter by Search Query (Title or Excerpt)
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        post.title.toLowerCase().includes(query) || 
        post.excerpt.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [posts, selectedCategory, searchQuery]);

  // Handle category click to update both state and potentially URL (optional, keeping it simple state for now)
  const handleCategoryClick = (category: Category | "All") => {
    setSelectedCategory(category);
    // Optionally clear search when switching categories for clarity
    if (category === "All") setSearchQuery("");
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with Dot Grid Background */}
      <section className="relative overflow-hidden border-b bg-muted/20 pb-16 pt-24 md:pt-32 lg:pb-24">
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
        <div className="container relative mx-auto px-4 text-center z-10 pointer-events-none"> 
          {/* pointer-events-none on container so clicks pass through to DotGrid, 
              but we need pointer-events-auto on interactive elements inside */}
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
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  type="text" 
                  placeholder="Search for tutorials..." 
                  className="pl-10 h-12 rounded-full shadow-lg border-muted-foreground/20 bg-background/80 backdrop-blur-sm focus-visible:ring-primary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
           </div>
        </div>
      </section>

      {/* Recent Posts Section - Hidden when searching */}
      {!searchQuery && (
      <section className="border-t bg-gradient-to-b from-muted/40 to-background py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold font-headline">Recent Posts</h2>
            <Link href="#all-posts" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {posts.slice(0, isMobile ? 3 : 6).map((post) => {
              return (
                <Link key={post.slug} href={`/blog/${post.slug}`}>
                  <div className="group flex gap-3 p-3 rounded-lg border border-border/40 bg-card shadow-sm hover:shadow-md hover:border-primary/60 transition-all duration-200 cursor-pointer overflow-hidden">
                    {/* Thumbnail */}
                    {post.featuredImageId && (
                      <div className="w-20 h-20 flex-shrink-0 rounded-md overflow-hidden bg-muted relative">
                        <Image
                          src={getPlaceholderImageById(post.featuredImageId)?.imageUrl || ''}
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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Category Filter Tabs */}
        <div id="all-posts" className="flex flex-col items-center mb-12">
           <div className="inline-flex flex-wrap justify-center gap-2 p-1 bg-muted/50 backdrop-blur-sm rounded-xl border border-border/50">
            <Button
              variant={selectedCategory === "All" ? "default" : "ghost"}
              size="sm"
              onClick={() => handleCategoryClick("All")}
              className="rounded-lg h-9"
            >
              All Posts
            </Button>
            {categories.map(({ name, icon: Icon }) => (
              <Button
                key={name}
                variant={selectedCategory === name ? "default" : "ghost"}
                size="sm"
                onClick={() => handleCategoryClick(name)}
                className="rounded-lg h-9"
              >
                <Icon className="mr-2 h-4 w-4" />
                {name}
              </Button>
            ))}
          </div>
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
              We couldn't find any articles matching "{searchQuery}" in {selectedCategory}.
            </p>
            <Button 
              variant="outline" 
              onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
            >
              Clear filters
            </Button>
          </div>
        )}

        {/* Newsletter / CTA Section (Visual only for now) */}
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

// Main page component wrapped in Suspense for useSearchParams
export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
