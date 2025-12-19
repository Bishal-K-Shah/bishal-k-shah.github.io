import type { LucideIcon } from 'lucide-react';

export type Category = 'Automobile' | 'Technology' | 'Electronics' | 'HomeLab';

export const CATEGORIES: Category[] = ['Automobile', 'Technology', 'Electronics', 'HomeLab'];

export type Post = {
  slug: string;
  title: string;
  date: string;
  category: Category;
  featuredImageId: string;
  excerpt: string;
  content: React.ReactNode;
};

export type CategoryInfo = {
  name: Category;
  icon: LucideIcon;
};
