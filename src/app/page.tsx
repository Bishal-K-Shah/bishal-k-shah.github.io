import { Suspense } from "react";
import { getPosts, getCategories } from "@/lib/posts";
import HomeClient from "@/components/HomeClient";
import { CATEGORIES, Category } from "@/types";

// This is a Server Component
export default function Home() {
  const posts = getPosts();
  // We only pass simple data (strings), not objects with functions (icons)
  const categories: Category[] = getCategories();

  return (
    <HomeClient initialPosts={posts} categoriesList={categories} />
  );
}
