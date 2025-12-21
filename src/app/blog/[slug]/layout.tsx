import { getPostBySlug } from '@/lib/posts';
import { StructuredData } from '@/components/StructuredData';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';

type PostLayoutProps = {
  children: ReactNode;
  params: {
    slug: string;
  };
};

export default async function PostLayout({ children, params }: PostLayoutProps) {
  const post = await getPostBySlug(params.slug);

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
