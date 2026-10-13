import { getPostBySlug } from '@/lib/posts';
import { StructuredData } from '@/components/StructuredData';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';

type PostLayoutProps = {
  children: ReactNode;
  params: Promise<{
    slug: string;
  }>;
};

export default async function PostLayout({ children, params }: PostLayoutProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="w-full bg-background">
      <StructuredData post={post} />
      {children}
    </div>
  );
}
