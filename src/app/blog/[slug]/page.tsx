import { notFound } from 'next/navigation';
import Image from 'next/image';
import { format, parseISO } from 'date-fns';
import { getPostBySlug, getPosts } from '@/lib/posts';
import { getPlaceholderImageById } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';
import { categoryInfo } from '@/components/icons';
import { Clock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import CodeBlock from '@/components/CodeBlock';
import { use } from 'react';

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

  return (
    <article className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <header className="mb-8">
        <div className="mb-4">
          <Badge variant="secondary" className="flex items-center gap-2 w-fit">
            <Icon className="h-4 w-4" />
            <span>{post.category}</span>
          </Badge>
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold font-headline tracking-tight text-primary mb-4">
          {post.title}
        </h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <time dateTime={post.date}>
              {format(parseISO(post.date), 'MMMM d, yyyy')}
            </time>
          </div>
        </div>
      </header>
      
      {featuredImage && (
        <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
          <Image
            src={featuredImage.imageUrl}
            alt={featuredImage.description}
            width={1200}
            height={675}
            className="w-full h-auto object-cover"
            priority
            data-ai-hint={featuredImage.imageHint}
          />
        </div>
      )}
      
      <div className="prose prose-lg dark:prose-invert max-w-none prose-p:text-foreground/80 prose-headings:text-foreground prose-h2:font-bold prose-h2:text-2xl">
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
    </article>
  );
}
