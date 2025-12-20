import { notFound } from 'next/navigation';
import { format, parseISO } from 'date-fns';
import { getPostBySlug, getPosts } from '@/lib/posts';
import { getPlaceholderImageById } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';
import { categoryInfo } from '@/components/icons';
import { Clock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import CodeBlock from '@/components/CodeBlock';
import { use } from 'react';
import { SocialShare } from '@/components/SocialShare';
import { PostCard } from '@/components/PostCard';

type BlogPostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const posts = getPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = use(params);
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const featuredImage = getPlaceholderImageById(post.featuredImageId);
  const Icon = categoryInfo[post.category].icon;

  // Logic for Related Posts
  const allPosts = getPosts();
  const relatedPosts = allPosts
    .filter((p) => p.category === post.category && p.slug !== post.slug)
    .slice(0, 3); // Limit to 3 related posts

  // Construct the full URL for sharing (assuming the site is deployed to GitHub Pages at /blog)
  // In a real scenario, you might want to pull the base URL from an env variable.
  const baseUrl = 'https://bishal-k-shah.github.io/blog'; 
  const shareUrl = `${baseUrl}/blog/${post.slug}`;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <article className="max-w-4xl mx-auto mb-16">
        <header className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
             <div className="flex items-center gap-2">
                <Badge variant="secondary" className="flex items-center gap-2 w-fit">
                  <Icon className="h-4 w-4" />
                  <span>{post.category}</span>
                </Badge>
                <div className="flex items-center gap-2 text-sm text-muted-foreground ml-2">
                  <Clock className="h-4 w-4" />
                  <time dateTime={post.date}>
                    {format(parseISO(post.date), 'MMMM d, yyyy')}
                  </time>
                </div>
             </div>
             <SocialShare url={shareUrl} title={post.title} />
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold font-headline tracking-tight text-primary mb-4">
            {post.title}
          </h1>
        </header>
        
        {featuredImage && (
          <div className="mb-10 rounded-xl overflow-hidden shadow-lg border border-border/50">
             {/* eslint-disable-next-line @next/next/no-img-element */}
             <img
              src={featuredImage.imageUrl}
              alt={featuredImage.description}
              className="w-full h-auto object-cover max-h-[600px]"
            />
          </div>
        )}
        
        <div className="prose prose-lg dark:prose-invert max-w-none prose-p:text-foreground/80 prose-headings:text-foreground prose-h2:font-bold prose-h2:text-2xl prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl">
          <ReactMarkdown
            components={{
              code({ node, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                return match ? (
                  <CodeBlock>{String(children).replace(/\\n$/, '')}</CodeBlock>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border">
          <SocialShare url={shareUrl} title={post.title} />
        </div>
      </article>

      {relatedPosts.length > 0 && (
        <section className="max-w-6xl mx-auto pt-8 border-t border-border">
          <h2 className="text-2xl font-bold font-headline mb-8">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedPosts.map((relatedPost) => (
              <PostCard key={relatedPost.slug} post={relatedPost} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
