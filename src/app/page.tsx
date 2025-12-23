import { Suspense } from "react";
import { getPosts, getCategories, getCategoryTree } from "@/lib/posts";
import HomeClient from "@/components/HomeClient";
import { Category, CategoryTree } from "@/types";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hobbyist's Hideaway | Homelab, DIY & Tech Blog",
  description: "Explore in-depth guides on Homelab setups, DIY electronics projects, automobile repairs, and technology tutorials. Perfect for makers and hobbyists.",
  openGraph: {
    title: "Hobbyist's Hideaway | Homelab, DIY & Tech Blog",
    description: "In-depth guides on Homelab, DIY electronics, and technology for makers and hobbyists.",
    images: ['/og-image.png'],
  },
};

// This is a Server Component
export default async function Home() {
  const posts = await getPosts();
  // We only pass simple data (strings), not objects with functions (icons)
  // getCategories returns string[], so we need to cast it to Category[]
  const categories = getCategories() as Category[];
  const categoryTree = await getCategoryTree();

  return (
    <HomeClient 
      initialPosts={posts} 
      categoriesList={categories} 
      categoryTree={categoryTree}
    />
  );
}
