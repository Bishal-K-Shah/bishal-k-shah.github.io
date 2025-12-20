"use client";

import { useState, useMemo } from "react";
import { PostCard } from "@/components/PostCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getPosts, getCategoriesWithIcons } from "@/lib/posts";
import type { Category } from "@/types";
import { Search } from "lucide-react";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<Category | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");

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

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight text-primary">
          Explore a World of Hobbies
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/80">
          From classic cars to modern tech, dive into a collection of projects, guides, and musings.
        </p>
        
        {/* Search Bar */}
        <div className="max-w-md mx-auto mt-8 relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              type="text" 
              placeholder="Search articles..." 
              className="pl-10 h-12 rounded-full shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      <nav className="flex items-center justify-center flex-wrap gap-2 mb-12" aria-label="Filter blog posts by category">
        <Button
          variant={selectedCategory === "All" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedCategory("All")}
          className="rounded-full"
        >
          All
        </Button>
        {categories.map(({ name, icon: Icon }) => (
          <Button
            key={name}
            variant={selectedCategory === name ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(name)}
            className="rounded-full"
          >
            <Icon className="mr-2 h-4 w-4" />
            {name}
          </Button>
        ))}
      </nav>

      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-xl text-muted-foreground">No articles found matching your criteria.</p>
          <Button 
            variant="link" 
            onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
            className="mt-2"
          >
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  );
}
