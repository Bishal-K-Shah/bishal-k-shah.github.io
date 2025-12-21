import { getPostBySlug } from '@/lib/posts';
import { StructuredData } from '@/components/StructuredData';
import { notFound } from 'next/navigation';

export default async function PostLayout({ 
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
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
