
import { Post } from '@/types';

interface StructuredDataProps {
  post: Post;
}

export function StructuredData({ post }: StructuredDataProps) {
  const baseUrl = 'https://bishalkshah.com.np';
  const url = `${baseUrl}/blog/${post.slug}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    headline: post.title,
    description: post.excerpt,
    image: post.featuredImage,
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
        url: `${baseUrl}/favicon.ico`,
      },
    },
    datePublished: post.date,
    dateModified: post.date,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
