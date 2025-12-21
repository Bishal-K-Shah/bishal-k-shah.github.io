import Link from 'next/link';
import Image from 'next/image';
import { format, parseISO } from 'date-fns';
import { Post } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { categoryInfo } from '@/components/icons';
import { ArrowUpRight, Hash } from 'lucide-react';

type PostCardProps = {
  post: Post;
};

export function PostCard({ post }: PostCardProps) {
  // Handle dynamic categories that might not be in our icon map
  const categoryData = categoryInfo[post.category];
  const Icon = categoryData?.icon || Hash; // Fallback to Hash icon

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <Link href={`/blog/${post.slug}`} className="group" aria-label={`Read more about ${post.title}`}>
        {post.featuredImage && (
          <div className="overflow-hidden aspect-video relative">
            <Image
              src={post.featuredImage}
              alt={post.title}
              width={600}
              height={400}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}
        <CardHeader>
          <div className="flex justify-between items-center mb-2">
            <Badge variant="secondary" className="flex items-center gap-2">
              <Icon className="h-4 w-4" />
              <span>{post.category}</span>
            </Badge>
            <time dateTime={post.date} className="text-sm text-muted-foreground">
              {format(parseISO(post.date), 'LLL d, yyyy')}
            </time>
          </div>
          <CardTitle className="text-xl font-bold leading-snug group-hover:text-primary transition-colors">
            {post.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
        </CardContent>
        {post.tags && post.tags.length > 0 && (
          <CardFooter className="px-6 pb-4 pt-0 gap-2 flex-wrap">
            {post.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs font-normal">
                #{tag}
              </Badge>
            ))}
            {post.tags.length > 2 && (
              <span className="text-xs text-muted-foreground">+{post.tags.length - 2}</span>
            )}
          </CardFooter>
        )}
      </Link>
    </Card>
  );
}
