'use client';

import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PostCard } from '@/components/PostCard';
import { Post } from '@/types';
import { RefObject } from 'react';

interface PostGridProps {
  posts: Post[];
  gridRef: RefObject<HTMLDivElement>;
  isVisible: boolean;
  getItemDelay: (index: number) => number;
  onClearFilters: () => void;
}

export function PostGrid({
  posts,
  gridRef,
  isVisible,
  getItemDelay,
  onClearFilters,
}: PostGridProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-24 bg-muted/30 rounded-3xl border border-dashed border-muted-foreground/20">
        <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Search className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">No results found</h3>
        <p className="text-muted-foreground max-w-md mx-auto mb-6">
          We couldn't find any articles matching your filters.
        </p>
        <Button variant="outline" onClick={onClearFilters}>
          Clear filters
        </Button>
      </div>
    );
  }

  return (
    <div
      ref={gridRef}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-16"
    >
      {posts.map((post, index) => (
        <div
          key={post.slug}
          className={`scroll-reveal ${isVisible ? 'scroll-reveal--visible' : ''}`}
          style={{ transitionDelay: `${getItemDelay(index)}ms` }}
        >
          <PostCard post={post} />
        </div>
      ))}
    </div>
  );
}


