"use client";

import { useState } from "react";
import { PostCard } from "@/components/PostCard";
import { Button } from "@/components/ui/button";
import { getPosts, getCategoriesWithIcons } from "@/lib/posts";
import type { Category } from "@/types";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<Category | "All">("All");

  const posts = getPosts();
  const categories = getCategoriesWithIcons();
  
  const filteredPosts =
    selectedCategory === "All"
      ? posts
      : posts.filter((post) => post.category === selectedCategory);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight text-primary">
          Explore a World of Hobbies
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/80">
          From classic cars to modern tech, dive into a collection of projects, guides, and musings.
        </p>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
