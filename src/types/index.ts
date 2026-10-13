import type { LucideIcon } from 'lucide-react';

// We allow any string for Category now to support dynamic categories from MDX
export type Category = string;

// The "Main" categories that get special UI treatment (icons, main tabs)
export const MAIN_CATEGORIES: string[] = ['Automobile', 'Technology', 'Electronics', 'HomeLab'];

// A tag and the number of posts in its category that use it
export type TagInfo = { tag: string; count: number };

// A map of Category -> its tags, most used first
export type CategoryTags = Record<string, TagInfo[]>;

export type Post = {
  slug: string;
  title: string;
  date: string;
  category: Category;
  tags?: string[];
  featuredImage: string;
  excerpt: string;
  content: string;
  featured?: boolean;
};

/** Post metadata without the MDX body, for lists and cards that never render content. */
export type PostSummary = Omit<Post, 'content'>;

export type CategoryInfo = {
  name: Category;
  icon?: LucideIcon; // Icon is now optional since dynamic categories might not have one
};
