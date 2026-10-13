
import { Post } from '@/types';
import { absoluteUrl, DEFAULT_OG_IMAGE } from '@/lib/site';

interface StructuredDataProps {
  post: Post;
}

export function StructuredData({ post }: StructuredDataProps) {
  const baseUrl = 'https://bishalkshah.com.np';
  const url = `${baseUrl}/blog/${post.slug}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    headline: post.title,
    description: post.excerpt,
    image: absoluteUrl(post.featuredImage || DEFAULT_OG_IMAGE),
    author: {
      '@type': 'Organization',
      name: "Hobbyist's Hideaway",
      url: baseUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: "Hobbyist's Hideaway",
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/favicon.svg`,
      },
    },
    datePublished: post.date,
    dateModified: post.date,
    keywords: post.tags?.join(', '),
    articleSection: post.category,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
