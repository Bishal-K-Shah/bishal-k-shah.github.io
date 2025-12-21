import type { LucideIcon } from 'lucide-react';

// We allow any string for Category now to support dynamic categories from MDX
export type Category = string;

// The "Main" categories that get special UI treatment (icons, main tabs)
export const MAIN_CATEGORIES: string[] = ['Automobile', 'Technology', 'Electronics', 'HomeLab'];

// A map of Category -> List of Tags
export type CategoryTree = Record<string, string[]>;

export type Post = {
  slug: string;
  title: string;
  date: string;
  category: Category;
  tags?: string[];
  featuredImage: string;
  excerpt: string;
  content: string;
};

export type CategoryInfo = {
  name: Category;
  icon?: LucideIcon; // Icon is now optional since dynamic categories might not have one
};
