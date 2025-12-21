import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Post, MAIN_CATEGORIES, CategoryInfo, Category, CategoryTree } from '@/types';
import { categoryInfo } from '@/components/icons';

const postsDirectory = path.join(process.cwd(), 'src/posts');

export const getPosts = async (): Promise<Post[]> => {
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
      tags: data.tags || [],
      featuredImage: data.featuredImage, 
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

export const getPostBySlug = async (slug: string): Promise<Post | undefined> => {
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
    tags: data.tags || [],
    featuredImage: data.featuredImage,
    excerpt: data.excerpt,
    content: content,
  };
};

// Returns a Map of Category -> Unique Tags
export const getCategoryTree = async (): Promise<CategoryTree> => {
  const posts = await getPosts();
  const tree: CategoryTree = {};

  posts.forEach(post => {
    if (!tree[post.category]) {
      tree[post.category] = [];
    }
    
    if (post.tags) {
      post.tags.forEach(tag => {
        if (!tree[post.category].includes(tag)) {
          tree[post.category].push(tag);
        }
      });
    }
  });

  // Sort tags alphabetically
  Object.keys(tree).forEach(category => {
    tree[category].sort();
  });

  return tree;
};

// Backwards compatibility for now, returns just the MAIN categories
export const getCategories = (): string[] => {
  return MAIN_CATEGORIES;
};

// Returns MAIN categories with their icons
export const getCategoriesWithIcons = (): CategoryInfo[] => {
  return MAIN_CATEGORIES.map(name => categoryInfo[name]);
}
