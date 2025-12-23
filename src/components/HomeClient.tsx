'use client';

import { useState, useMemo, useEffect, Suspense, useRef, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Category, Post, CategoryTree } from '@/types';
import { useHeroFade, useScrollReveal, useStaggerReveal } from '@/hooks/use-scroll-reveal';
import { Button } from '@/components/ui/button';

// Import extracted components
import {
  HeroSection,
  MobileSearchHeader,
  RecentPosts,
  CategoryTabs,
  PostGrid,
  NewsletterCTA,
} from '@/components/home';

interface HomeContentProps {
  initialPosts: Post[];
  categoriesList: Category[];
  categoryTree: CategoryTree;
}

function HomeContent({ initialPosts, categoriesList, categoryTree }: HomeContentProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const postsSectionRef = useRef<HTMLDivElement>(null);

  // State
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileBrowseOpen, setIsMobileBrowseOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isSearchClosing, setIsSearchClosing] = useState(false);
  const [visiblePostsCount, setVisiblePostsCount] = useState(15);

  const isInitialRender = useRef(true);
  const wasSearchFocusedRef = useRef(false);

  // Scroll animation hooks
  const heroContentRef = useHeroFade<HTMLDivElement>();
  const { ref: recentPostsRef, isVisible: recentPostsVisible, getItemDelay: getRecentDelay } =
    useStaggerReveal<HTMLDivElement>(isMobile ? 3 : 6, { threshold: 0.1, staggerDelay: 80 });
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollReveal<HTMLDivElement>({
    threshold: 0.2,
  });

  // Sync state with URL param on load
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const tagParam = searchParams.get('tag');

    if (categoryParam) {
      if (Object.keys(categoryTree).includes(categoryParam)) {
        setSelectedCategory(categoryParam);
      }
    } else {
      setSelectedCategory('All');
    }

    if (tagParam) {
      setSelectedTag(tagParam);
    } else {
      setSelectedTag(null);
    }
  }, [searchParams, categoryTree]);

  // Scroll to posts when filter is applied
  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    if (selectedCategory !== 'All' || selectedTag) {
      // Calculate scroll delay based on context:
      // - If coming from search focused state on mobile, wait for hero expansion (350ms)
      // - If selecting a tag on mobile, wait for sheet close + badge animation (300ms)
      // - If selecting a tag on desktop, wait for badge animation (150ms)
      // - Otherwise, scroll immediately
      let scrollDelay = 0;
      
      if (isMobile && wasSearchFocusedRef.current) {
        // Coming from search: wait for hero expansion (300ms) + buffer
        scrollDelay = 400;
        wasSearchFocusedRef.current = false;
      } else if (selectedTag) {
        scrollDelay = isMobile ? 300 : 150;
      }

      const timeoutId = setTimeout(() => {
        postsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, scrollDelay);

      return () => clearTimeout(timeoutId);
    }
  }, [selectedCategory, selectedTag, isMobile]);

  // Track mobile screen size
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 640;
      setIsMobile(mobile);
      // Reset visible posts count when switching between mobile/desktop
      setVisiblePostsCount(mobile ? 8 : 15);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filtered posts
  const filteredPosts = useMemo(() => {
    return initialPosts.filter((post) => {
      const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
      const matchesTag = selectedTag ? post.tags?.includes(selectedTag) : true;
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        post.title.toLowerCase().includes(query) || post.excerpt.toLowerCase().includes(query);

      return matchesCategory && matchesTag && matchesSearch;
    });
  }, [initialPosts, selectedCategory, selectedTag, searchQuery]);

  // Reset visible posts count when filters change
  useEffect(() => {
    setVisiblePostsCount(isMobile ? 8 : 15);
  }, [selectedCategory, selectedTag, searchQuery, isMobile]);

  // Posts to display (limited on both mobile and desktop)
  const displayedPosts = useMemo(() => {
    return filteredPosts.slice(0, visiblePostsCount);
  }, [filteredPosts, visiblePostsCount]);

  const hasMorePosts = filteredPosts.length > visiblePostsCount;

  const handleLoadMore = useCallback(() => {
    setVisiblePostsCount((prev) => prev + (isMobile ? 8 : 9));
  }, [isMobile]);

  // Post grid scroll animation hook (depends on displayedPosts)
  // Use less restrictive rootMargin to ensure posts are visible on initial mobile load
  const { ref: postGridRef, isVisible: postGridVisible, getItemDelay: getGridDelay } =
    useStaggerReveal<HTMLDivElement>(displayedPosts.length, {
      threshold: 0.01,
      rootMargin: '50px 0px 0px 0px',
      staggerDelay: 60,
    });

  // Handlers
  const updateFilters = useCallback(
    (category: string | 'All', tag: string | null) => {
      const params = new URLSearchParams(window.location.search);
      if (category !== 'All') {
        params.set('category', category);
      } else {
        params.delete('category');
      }

      if (tag) {
        params.set('tag', tag);
      } else {
        params.delete('tag');
      }

      setSearchQuery('');
      const newUrl = `/?${params.toString()}`;
      router.push(newUrl, { scroll: false });
      setIsMobileBrowseOpen(false);

      if (isMobile) {
        // Track if we're coming from search focused state for scroll delay calculation
        if (isSearchFocused) {
          wasSearchFocusedRef.current = true;
        }
        setIsSearchFocused(false);
      }
    },
    [router, isMobile, isSearchFocused]
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value;
      setSearchQuery(query);
      if (query) {
        router.push(`/`, { scroll: false });
      }
    },
    [router]
  );

  const handleCategoryClick = useCallback(
    (category: Category | 'All') => {
      updateFilters(category, null);
    },
    [updateFilters]
  );

  const handleClearTag = useCallback(() => {
    updateFilters(selectedCategory, null);
  }, [updateFilters, selectedCategory]);

  const handleClearAllFilters = useCallback(() => {
    router.push('/');
    setSearchQuery('');
  }, [router]);

  const handleSearchFocus = useCallback(() => {
    setIsSearchFocused(true);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  const handleCloseSearch = useCallback(() => {
    setIsSearchClosing(true);
    setTimeout(() => {
      setSearchQuery('');
      setIsSearchFocused(false);
      setIsSearchClosing(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 200);
  }, []);

  const handleViewAllPosts = useCallback(() => {
    updateFilters('All', null);
    setTimeout(() => {
      postsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }, [updateFilters]);

  return (
    <div className="min-h-screen">
      {/* Mobile Search Header */}
      {isMobile && (
        <MobileSearchHeader
          isVisible={isSearchFocused}
          isClosing={isSearchClosing}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onClose={handleCloseSearch}
        />
      )}

      {/* Hero Section */}
      <HeroSection
        heroContentRef={heroContentRef}
        isMobile={isMobile}
        isSearchFocused={isSearchFocused}
        isSearchClosing={isSearchClosing}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onSearchFocus={handleSearchFocus}
        onClearSearch={handleClearSearch}
      />

      {/* Recent Posts Section */}
      {!searchQuery && (
        <RecentPosts
          posts={initialPosts}
          isMobile={isMobile}
          sectionRef={recentPostsRef}
          isVisible={recentPostsVisible}
          getItemDelay={getRecentDelay}
          onViewAll={handleViewAllPosts}
        />
      )}

      {/* Main Content */}
      <div
        ref={postsSectionRef}
        className={`container mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-10 ${
          isSearchFocused && isMobile ? 'pt-10 pb-16' : 'py-16'
        }`}
      >
        {/* Category Filter Tabs */}
        <CategoryTabs
          selectedCategory={selectedCategory}
          selectedTag={selectedTag}
          categoryTree={categoryTree}
          isMobileBrowseOpen={isMobileBrowseOpen}
          onMobileBrowseOpenChange={setIsMobileBrowseOpen}
          onCategoryClick={handleCategoryClick}
          onFilterUpdate={updateFilters}
          onClearTag={handleClearTag}
          onClearAll={handleClearAllFilters}
        />

        {/* Results Grid */}
        <PostGrid
          posts={displayedPosts}
          gridRef={postGridRef}
          isVisible={postGridVisible}
          getItemDelay={getGridDelay}
          onClearFilters={handleClearAllFilters}
        />

        {/* Load More Button */}
        {hasMorePosts ? (
          <div className="flex justify-center mt-8 pb-16">
            <Button
              onClick={handleLoadMore}
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
            >
              View More
            </Button>
          </div>
        ) : (
          <div className="mt-8 pb-16" />
        )}

        {/* Newsletter CTA */}
        <NewsletterCTA ctaRef={ctaRef} isVisible={ctaVisible} />
      </div>
    </div>
  );
}

export default function Home({ initialPosts, categoriesList, categoryTree }: HomeContentProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">Loading...</div>
      }
    >
      <HomeContent
        initialPosts={initialPosts}
        categoriesList={categoriesList}
        categoryTree={categoryTree}
      />
    </Suspense>
  );
}
