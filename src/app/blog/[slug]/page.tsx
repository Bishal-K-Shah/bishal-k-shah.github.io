import { notFound } from 'next/navigation';
import { format, parseISO } from 'date-fns';
import { getPostBySlug, getPosts } from '@/lib/posts';
import { Badge } from '@/components/ui/badge';
import { categoryInfo } from '@/components/icons';
import { Clock, Calendar, Hash } from 'lucide-react';
import { MDXRemote } from 'next-mdx-remote/rsc';
import CodeBlock from '@/components/CodeBlock';
import { use } from 'react';
import { SocialShare } from '@/components/SocialShare';
import { PostCard } from '@/components/PostCard';
import { Newsletter } from '@/components/Newsletter';
import { ArticleStickyHeader } from '@/components/ArticleStickyHeader';
import { Metadata } from 'next';
import { Breadcrumb } from '@/components/Breadcrumb';

type BlogPostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const baseUrl = 'https://bishalkshah.com.np';
  const url = `${baseUrl}/blog/${post.slug}`;
  
  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: url,
      siteName: "Hobbyist's Hideaway",
      locale: 'en_US',
      type: 'article',
      publishedTime: post.date,
      authors: ["Hobbyist's Hideaway"],
      images: [
        {
          url: post.featuredImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.featuredImage],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const categoryData = categoryInfo[post.category];
  const Icon = categoryData?.icon || Hash;

  // Logic for Related Posts
  const allPosts = await getPosts();
  const relatedPosts = allPosts
    .filter((p) => p.category === post.category && p.slug !== post.slug)
    .slice(0, 3);

  const baseUrl = 'https://bishalkshah.com.np'; 
  const shareUrl = `${baseUrl}/blog/${post.slug}`;

  return (
    <div className="min-h-screen bg-background">
      {/* Scroll-aware Sticky Header */}
      <ArticleStickyHeader title={post.title} />

      <article className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-5xl">
        {/* Header Section */}
        <Breadcrumb category={post.category} slug={post.slug} title={post.title} />
        <header className="mb-8 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-4">
            <Badge variant="secondary" className="px-2.5 py-0.5 text-xs font-medium border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 transition-colors">
              <Icon className="mr-1.5 h-3.5 w-3.5" />
              {post.category}
            </Badge>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                <time dateTime={post.date}>
                  {format(parseISO(post.date), 'MMMM d, yyyy')}
                </time>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {/* Simple read time estimation */}
                {Math.ceil(post.content.split(' ').length / 200)} min read
              </span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground mb-6 leading-tight font-headline">
            {post.title}
          </h1>
          
          <div className="flex justify-center sm:justify-between items-center border-b border-border/50 pb-6 mb-8">
             <div className="hidden sm:block">
               <span className="text-sm font-medium text-muted-foreground">By <span className="text-foreground">Hobbyist's Hideaway</span></span>
             </div>
             <SocialShare url={shareUrl} title={post.title} />
          </div>
        </header>
        
        {/* Featured Image */}
        {post.featuredImage && (
          <div className="mb-10 relative group rounded-xl overflow-hidden shadow-sm border border-border/50 aspect-video bg-muted">
             {/* eslint-disable-next-line @next/next/no-img-element */}
             <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        {/* Content */}
        <div className="prose prose-base sm:prose-lg dark:prose-invert max-w-none">
          <MDXRemote
            source={post.content}
            components={{
              // Headers with responsive text sizes
              h2: ({node, ...props}) => <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mt-10 sm:mt-12 mb-4 sm:mb-6 font-headline tracking-tight text-foreground scroll-m-20 border-b pb-2" {...props} />,
              h3: ({node, ...props}) => <h3 className="text-lg sm:text-xl md:text-2xl font-medium mt-6 sm:mt-8 mb-3 sm:mb-4 font-headline tracking-tight text-foreground scroll-m-20" {...props} />,
              
              // Paragraphs
              p: ({node, ...props}) => <p className="leading-7 [&:not(:first-child)]:mt-6 text-muted-foreground text-base sm:text-lg" {...props} />,
              
              // Lists
              ul: ({node, ...props}) => <ul className="my-6 ml-6 list-disc [&>li]:mt-2 text-muted-foreground" {...props} />,
              ol: ({node, ...props}) => <ol className="my-6 ml-6 list-decimal [&>li]:mt-2 text-muted-foreground" {...props} />,
              
              // Blockquotes
              blockquote: ({node, ...props}) => <blockquote className="mt-6 border-l-4 border-primary pl-6 italic bg-muted/40 py-2 pr-4 rounded-r-lg" {...props} />,
              
              // Links
              a: ({node, ...props}) => <a className="font-medium text-primary underline underline-offset-4 hover:text-primary/80 transition-colors" {...props} />,
              
              // Standard Images from Markdown (e.g., ![alt](src))
              img: ({node, alt, src, title, ...props}) => (
                <figure className="my-8">
                  <div className="rounded-xl overflow-hidden border border-border/50 bg-muted shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={src} 
                      alt={alt || "Blog post image"}
                      className="w-full h-auto object-cover"
                      {...props} 
                    />
                  </div>
                  {title && (
                    <figcaption className="mt-2 text-center text-sm text-muted-foreground italic">
                      {title}
                    </figcaption>
                  )}
                </figure>
              ),

              // Code Blocks
              code: ({ className, children, ...props }) => {
                const match = /language-(\w+)/.exec(className || '');
                return match ? (
                  <div className="my-8 rounded-lg overflow-hidden shadow-md border border-border/50">
                    <CodeBlock>{String(children).replace(/\\n$/, '')}</CodeBlock>
                  </div>
                ) : (
                  <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold text-foreground" {...props}>
                    {children}
                  </code>
                );
              },
            }}
          />
        </div>
        
        {/* Footer Share */}
        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-base font-bold text-foreground">Share this article</span>
          <SocialShare url={shareUrl} title={post.title} />
        </div>
      </article>

      {/* Related Posts Section */}
      {relatedPosts.length > 0 && (
        <section className="bg-muted/30 py-12 border-t border-border">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-6 w-1 bg-primary rounded-full" />
              <h2 className="text-xl font-bold">Read Next</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <PostCard key={relatedPost.slug} post={relatedPost} />
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* Newsletter */}
      <div className="container mx-auto px-4 max-w-5xl py-12">
        <Newsletter />
      </div>
    </div>
  );
}
