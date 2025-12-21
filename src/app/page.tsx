import { Suspense } from "react";
import { getPosts, getCategories, getCategoryTree } from "@/lib/posts";
import HomeClient from "@/components/HomeClient";
import { Category, CategoryTree } from "@/types";

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
