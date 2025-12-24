'use client';

import Link from 'next/link';
import Image from 'next/image';
import { format, parseISO } from 'date-fns';
import { ArrowRight } from 'lucide-react';
import { Post } from '@/types';
import { RefObject } from 'react';

interface RecentPostsProps {
  posts: Post[];
  isMobile: boolean;
  sectionRef: RefObject<HTMLDivElement>;
  isVisible: boolean;
  getItemDelay: (index: number) => number;
  onViewAll: () => void;
}

export function RecentPosts({
  posts,
  isMobile,
  sectionRef,
  isVisible,
  getItemDelay,
  onViewAll,
}: RecentPostsProps) {
  const displayPosts = posts.slice(0, isMobile ? 3 : 6);

  return (
    <section ref={sectionRef} className="border-t bg-gradient-to-b from-muted/40 to-background py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold font-headline">Recent Posts</h2>
          <button
            onClick={onViewAll}
            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
          >
            View all <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {displayPosts.map((post, index) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className={`scroll-reveal ${isVisible ? 'scroll-reveal--visible' : ''}`}
              style={{ transitionDelay: `${getItemDelay(index)}ms` }}
            >
              <div className="group flex gap-3 p-3 rounded-lg border border-border/40 bg-card shadow-sm hover:shadow-md hover:border-primary/60 transition-all duration-200 cursor-pointer overflow-hidden">
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
          ))}
        </div>
      </div>
    </section>
  );
}




