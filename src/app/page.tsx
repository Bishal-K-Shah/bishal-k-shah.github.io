import { Suspense } from "react";
import { getPosts, getCategories, getCategoryTree } from "@/lib/posts";
import HomeClient from "@/components/HomeClient";
import { Category, CategoryTree } from "@/types";

// This is a Server Component
export default function Home() {
  const posts = getPosts();
  // We only pass simple data (strings), not objects with functions (icons)
  // getCategories returns string[], so we need to cast it to Category[]
  const categories = getCategories() as Category[];
  const categoryTree = getCategoryTree();

  return (
    <HomeClient 
      initialPosts={posts} 
      categoriesList={categories} 
      categoryTree={categoryTree}
    />
  );
}
