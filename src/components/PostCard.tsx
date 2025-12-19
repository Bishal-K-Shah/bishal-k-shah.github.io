import Link from 'next/link';
import Image from 'next/image';
import { format, parseISO } from 'date-fns';
import { Post } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getPlaceholderImageById } from '@/lib/placeholder-images';
import { categoryInfo } from '@/components/icons';
import { ArrowUpRight } from 'lucide-react';

type PostCardProps = {
  post: Post;
};

export function PostCard({ post }: PostCardProps) {
  const featuredImage = getPlaceholderImageById(post.featuredImageId);
  const Icon = categoryInfo[post.category].icon;

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <Link href={`/blog/${post.slug}`} className="group" aria-label={`Read more about ${post.title}`}>
        {featuredImage && (
          <div className="overflow-hidden aspect-video relative">
            <Image
              src={featuredImage.imageUrl}
              alt={featuredImage.description}
              width={600}
              height={400}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              data-ai-hint={featuredImage.imageHint}
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
        <CardFooter>
          <div className="flex items-center text-sm font-semibold text-primary">
            Read more
            <ArrowUpRight className="h-4 w-4 ml-1 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
}
