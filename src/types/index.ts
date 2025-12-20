import type { LucideIcon } from 'lucide-react';

export type Category = 'Automobile' | 'Technology' | 'Electronics' | 'HomeLab';

export const CATEGORIES: Category[] = ['Automobile', 'Technology', 'Electronics', 'HomeLab'];

export type Post = {
  slug: string;
  title: string;
  date: string;
  category: Category;
  featuredImage: string;
  excerpt: string;
  content: string;
};

export type CategoryInfo = {
  name: Category;
  icon: LucideIcon;
};
