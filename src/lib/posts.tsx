import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Post, PostSummary, MAIN_CATEGORIES, CategoryInfo, Category, CategoryTags } from '@/types';
import { pickTagLabel, tagKey } from '@/lib/tags';
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
 * Picks the posts most related to `post`: each shared tag (spelling variants merged) scores
 * RELATED_TAG_WEIGHT and a shared category RELATED_CATEGORY_WEIGHT; ties go to the newer
 * post. If fewer than `limit` posts are related at all, the newest remaining posts fill the gap.
 */
export const getRelatedPosts = <T extends PostSummary>(post: PostSummary, allPosts: T[], limit = 3): T[] => {
  const tags = new Set((post.tags ?? []).map(tagKey));
  const byNewest = (a: T, b: T) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0);

  const candidates = allPosts.filter((p) => p.slug !== post.slug);
  const scored = candidates
    .map((candidate) => {
      const sharedTags = new Set((candidate.tags ?? []).map(tagKey).filter((key) => tags.has(key))).size;
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

/** Tags used by fewer posts than this are left out of navigation menus. */
export const MIN_POSTS_PER_MENU_TAG = 2;

/**
 * Returns every category with its tags, most used first. Spelling variants of a tag
 * ("Self-Hosting" / "self-hosting") are merged and counted once per post; tags used by
 * fewer than `minPosts` posts in the category are left out (the category itself stays).
 */
export const getCategoryTags = async (minPosts = 1): Promise<CategoryTags> => {
  const posts = await getPosts();
  // category -> tag key -> spelling -> number of posts using that spelling
  const byCategory = new Map<string, Map<string, Map<string, number>>>();

  for (const post of posts) {
    if (!byCategory.has(post.category)) byCategory.set(post.category, new Map());
    const tags = byCategory.get(post.category)!;
    const seen = new Set<string>();

    for (const spelling of post.tags ?? []) {
      const key = tagKey(spelling);
      if (seen.has(key)) continue;
      seen.add(key);
      const spellings = tags.get(key) ?? new Map<string, number>();
      spellings.set(spelling, (spellings.get(spelling) ?? 0) + 1);
      tags.set(key, spellings);
    }
  }

  const result: CategoryTags = {};
  for (const [category, tags] of byCategory) {
    result[category] = [...tags.values()]
      .map((spellings) => ({
        tag: pickTagLabel(spellings),
        count: [...spellings.values()].reduce((sum, n) => sum + n, 0),
      }))
      .filter(({ count }) => count >= minPosts)
      .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, undefined, { sensitivity: 'base' }));
  }
  return result;
};

// Backwards compatibility for now, returns just the MAIN categories
export const getCategories = (): string[] => {
  return MAIN_CATEGORIES;
};

// Returns MAIN categories with their icons
export const getCategoriesWithIcons = (): CategoryInfo[] => {
  return MAIN_CATEGORIES.map(name => categoryInfo[name]);
}
