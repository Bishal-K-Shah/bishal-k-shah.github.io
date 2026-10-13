import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Post, PostSummary, MAIN_CATEGORIES, CategoryInfo, Category, CategoryTree } from '@/types';
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
      featured: data.featured === true,
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
    featured: data.featured === true,
  };
};

/** Strip the MDX body so lists don't ship every post's full text to the browser. */
export const toPostSummary = ({ content: _content, ...summary }: Post): PostSummary => summary;

const POPULAR_POSTS_LIMIT = 10;

export const getPopularPosts = async (): Promise<Post[]> => {
  const posts = await getPosts();
  return posts.filter((post) => post.featured === true).slice(0, POPULAR_POSTS_LIMIT);
};

const RELATED_TAG_WEIGHT = 3;
const RELATED_CATEGORY_WEIGHT = 2;

/**
 * Picks the posts most related to `post`: each shared tag (case-insensitive) scores
 * RELATED_TAG_WEIGHT and a shared category RELATED_CATEGORY_WEIGHT; ties go to the newer
 * post. If fewer than `limit` posts are related at all, the newest remaining posts fill the gap.
 */
export const getRelatedPosts = <T extends PostSummary>(post: PostSummary, allPosts: T[], limit = 3): T[] => {
  const tags = new Set((post.tags ?? []).map((tag) => tag.toLowerCase()));
  const byNewest = (a: T, b: T) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0);

  const candidates = allPosts.filter((p) => p.slug !== post.slug);
  const scored = candidates
    .map((candidate) => {
      const sharedTags = (candidate.tags ?? []).filter((tag) => tags.has(tag.toLowerCase())).length;
      const sameCategory = candidate.category === post.category ? 1 : 0;
      return { candidate, score: sharedTags * RELATED_TAG_WEIGHT + sameCategory * RELATED_CATEGORY_WEIGHT };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || byNewest(a.candidate, b.candidate))
    .map(({ candidate }) => candidate);

  const related = scored.slice(0, limit);
  if (related.length < limit) {
    const chosen = new Set(related.map((p) => p.slug));
    related.push(...candidates.filter((p) => !chosen.has(p.slug)).sort(byNewest).slice(0, limit - related.length));
  }
  return related;
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
