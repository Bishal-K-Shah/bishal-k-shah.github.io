import Link from 'next/link';
import type { Metadata } from 'next';
import { Home, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PostCard } from '@/components/PostCard';
import { categoryInfo } from '@/components/icons';
import { getCategories, getPosts, toPostSummary } from '@/lib/posts';

export const metadata: Metadata = {
  title: 'Page Not Found',
  robots: { index: false, follow: true },
};

const RECENT_POSTS_COUNT = 3;

export default async function NotFound() {
  const recentPosts = (await getPosts()).slice(0, RECENT_POSTS_COUNT).map(toPostSummary);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-5xl">
      <section className="text-center max-w-xl mx-auto">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">404</p>
        <h1 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight text-foreground font-headline">
          This page took a wrong turn
        </h1>
        <p className="mt-4 text-base sm:text-lg text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has moved. Try one of the categories below or
          head back home.
        </p>

        <div className="mt-8">
          <Button asChild size="lg">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        <nav aria-label="Categories" className="mt-8 flex flex-wrap justify-center gap-2">
          {getCategories().map((category) => {
            const Icon = categoryInfo[category]?.icon || Hash;
            return (
              <Link
                key={category}
                href={`/?category=${category}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
              >
                <Icon className="h-4 w-4" />
                {category}
              </Link>
            );
          })}
        </nav>
      </section>

      {recentPosts.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-semibold text-foreground mb-6">Latest posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentPosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
