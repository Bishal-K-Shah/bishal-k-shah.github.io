import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as postsLib from './posts';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Mock dependencies
vi.mock('fs');
vi.mock('path');
vi.mock('gray-matter');

describe('getCategoryTree', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    
    // Default mocks
    vi.mocked(path.join).mockReturnValue('/mock/posts/dir');
    vi.mocked(fs.existsSync).mockReturnValue(true);
  });

  it('should correctly build a category tree from posts', async () => {
    // 1. Mock the file list
    vi.mocked(fs.readdirSync).mockReturnValue(['post1.mdx', 'post2.mdx', 'post3.mdx'] as any);

    // 2. Mock file reading logic
    // We iterate over the file names and return different content based on the "file name"
    // Since fs.readFileSync is called with the full path, we can just return dummy string 
    // because we will mock what 'gray-matter' returns for it anyway.
    vi.mocked(fs.readFileSync).mockReturnValue('dummy content');

    // 3. Mock gray-matter to return specific metadata for each call
    // The parser calls getPosts, which loops 3 times.
    vi.mocked(matter)
      .mockReturnValueOnce({ 
        data: { 
          title: 'Post 1', 
          date: '2023-01-01', 
          category: 'Electronics', 
          tags: ['Arduino', 'Sensors'] 
        }, 
        content: '' 
      } as any)
      .mockReturnValueOnce({ 
        data: { 
          title: 'Post 2', 
          date: '2023-01-02', 
          category: 'Electronics', 
          tags: ['Soldering'] 
        }, 
        content: '' 
      } as any)
      .mockReturnValueOnce({ 
        data: { 
          title: 'Post 3', 
          date: '2023-01-03', 
          category: 'Automobile', 
          tags: ['Maintenance'] 
        }, 
        content: '' 
      } as any);

    // 4. Run the function
    const tree = await postsLib.getCategoryTree();

    // 5. Assertions
    expect(tree).toEqual({
      Electronics: ['Arduino', 'Sensors', 'Soldering'],
      Automobile: ['Maintenance'],
    });
    
    // Verify sorting of tags if applicable (our implementation sorts them)
    expect(tree.Electronics).toEqual(['Arduino', 'Sensors', 'Soldering'].sort());
  });

  it('should handle posts without tags', async () => {
    vi.mocked(fs.readdirSync).mockReturnValue(['post1.mdx'] as any);
    vi.mocked(fs.readFileSync).mockReturnValue('');
    vi.mocked(matter).mockReturnValue({ 
      data: { category: 'HomeLab', title: 'A', date: '2023' }, 
      content: '' 
    } as any);

    const tree = await postsLib.getCategoryTree();

    expect(tree).toEqual({
      HomeLab: [],
    });
  });

  it('should handle new/dynamic categories', async () => {
    vi.mocked(fs.readdirSync).mockReturnValue(['post1.mdx'] as any);
    vi.mocked(fs.readFileSync).mockReturnValue('');
    vi.mocked(matter).mockReturnValue({ 
      data: { category: 'My New Hobby', title: 'A', date: '2023', tags: ['Fun'] }, 
      content: '' 
    } as any);

    const tree = await postsLib.getCategoryTree();

    expect(tree).toHaveProperty('My New Hobby');
    expect(tree['My New Hobby']).toContain('Fun');
  });
});

describe('getRelatedPosts', () => {
  const post = (slug: string, category: string, tags: string[], date: string) =>
    ({ slug, title: slug, category, tags, date, excerpt: '', featuredImage: '' });

  const current = post('current', 'HomeLab', ['jellyfin', 'docker'], '2026-01-01');

  it('ranks shared tags above a shared category, newest first on ties', () => {
    const all = [
      current,
      post('same-category-only', 'HomeLab', ['proxmox'], '2026-05-01'),
      post('one-tag-other-category', 'Technology', ['Docker'], '2026-02-01'),
      post('two-tags', 'HomeLab', ['jellyfin', 'docker'], '2025-01-01'),
      post('one-tag-same-category-old', 'HomeLab', ['jellyfin'], '2024-01-01'),
      post('one-tag-same-category-new', 'HomeLab', ['jellyfin'], '2025-06-01'),
    ];

    expect(postsLib.getRelatedPosts(current, all).map((p) => p.slug)).toEqual([
      'two-tags',
      'one-tag-same-category-new',
      'one-tag-same-category-old',
    ]);
  });

  it('never includes the post itself', () => {
    const all = [current, post('other', 'HomeLab', ['jellyfin'], '2026-01-02')];
    expect(postsLib.getRelatedPosts(current, all).map((p) => p.slug)).toEqual(['other']);
  });

  it('fills remaining slots with the newest unrelated posts', () => {
    const all = [
      current,
      post('related', 'HomeLab', [], '2020-01-01'),
      post('unrelated-old', 'Automobile', ['oil'], '2021-01-01'),
      post('unrelated-new', 'Automobile', ['brakes'], '2026-03-01'),
    ];
    expect(postsLib.getRelatedPosts(current, all).map((p) => p.slug)).toEqual([
      'related',
      'unrelated-new',
      'unrelated-old',
    ]);
  });
});
