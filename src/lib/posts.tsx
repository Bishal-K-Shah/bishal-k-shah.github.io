import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Post, CATEGORIES, CategoryInfo, Category } from '@/types';
import { categoryInfo } from '@/components/icons';

const postsDirectory = path.join(process.cwd(), 'src/posts');

export const getPosts = (): Post[] => {
  if (!fs.existsSync(postsDirectory)) {
      return [];
  }
  
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    // Remove ".mdx" from file name to get slug
    const slug = fileName.replace(/\.mdx$/, '');

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const { data, content } = matter(fileContents);

    // Validate and cast data to Post type
    const post: Post = {
      slug,
      title: data.title,
      date: data.date,
      category: data.category as Category,
      featuredImageId: data.featuredImageId,
      excerpt: data.excerpt,
      content: content,
    };

    return post;
  });

  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
};

export const getPostBySlug = (slug: string): Post | undefined => {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`);
  
  if (!fs.existsSync(fullPath)) {
      return undefined;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: data.title,
    date: data.date,
    category: data.category as Category,
    featuredImageId: data.featuredImageId,
    excerpt: data.excerpt,
    content: content,
  };
};

export const getCategories = (): string[] => {
  return CATEGORIES;
};

export const getCategoriesWithIcons = (): CategoryInfo[] => {
  return CATEGORIES.map(name => categoryInfo[name]);
}
