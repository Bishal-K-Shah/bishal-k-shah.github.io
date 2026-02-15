'use client';

import Link from 'next/link';
import Image from 'next/image';
import { format, parseISO } from 'date-fns';
import { Post } from '@/types';
import { RefObject } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';

interface PopularPostsProps {
  posts: Post[];
  isMobile: boolean;
  sectionRef: RefObject<HTMLDivElement>;
  isVisible: boolean;
  getItemDelay: (index: number) => number;
}

export function PopularPosts({
  posts,
  isMobile,
  sectionRef,
  isVisible,
  getItemDelay,
}: PopularPostsProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      className="border-t bg-gradient-to-b from-muted/40 to-background py-8"
      aria-label="Popular articles"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold font-headline mb-6">Popular</h2>
        <div className="relative">
          <Carousel
            opts={{
              loop: true,
              align: 'start',
              containScroll: 'trimSnaps',
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {posts.map((post, index) => (
                <CarouselItem
                  key={post.slug}
                  className={cn(
                    'pl-4 basis-[85%] sm:basis-1/2 md:basis-1/3'
                  )}
                >
                  <Link
                    href={`/blog/${post.slug}`}
                    className={cn(
                      'block scroll-reveal',
                      isVisible ? 'scroll-reveal--visible' : ''
                    )}
                    style={{ transitionDelay: `${getItemDelay(index)}ms` }}
                  >
                    <div className="group flex flex-col rounded-lg border border-border/40 bg-card shadow-sm hover:shadow-md hover:border-primary/60 transition-all duration-200 cursor-pointer overflow-hidden h-full">
                      {post.featuredImage && (
                        <div className="aspect-video w-full overflow-hidden bg-muted relative">
                          <Image
                            src={post.featuredImage}
                            alt={post.title}
                            width={400}
                            height={225}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="flex flex-col flex-1 p-4">
                        <h3 className="text-sm font-semibold line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                          {post.title}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1 flex-1">
                          {post.excerpt}
                        </p>
                        <p className="text-xs text-muted-foreground/70 font-medium mt-2">
                          {format(parseISO(post.date), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious
              className={cn(
                'absolute top-1/2 -translate-y-1/2 h-8 w-8 rounded-full',
                isMobile ? '-left-2' : '-left-12'
              )}
              aria-label="Previous slide"
            />
            <CarouselNext
              className={cn(
                'absolute top-1/2 -translate-y-1/2 h-8 w-8 rounded-full',
                isMobile ? '-right-2' : '-right-12'
              )}
              aria-label="Next slide"
            />
          </Carousel>
        </div>
      </div>
    </section>
  );
}
