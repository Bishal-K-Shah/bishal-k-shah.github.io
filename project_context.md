# Hobbyist's Hideaway - Project Documentation

> **AI Context Document** - Optimized for quick understanding and implementation reference

---

## Quick Reference

### Project Type
- **Type**: Static Blog Platform
- **Framework**: Next.js 14 (App Router)
- **Deployment**: GitHub Pages (static export)
- **Language**: TypeScript 5
- **Content Format**: MDX files with frontmatter

### Key Concepts
- **Static Site Generation (SSG)**: All pages pre-rendered at build time
- **Dynamic Taxonomy**: Categories/tags auto-generated from post frontmatter
- **Server/Client Split**: Server Components fetch data, Client Components handle interactivity
- **URL State**: Filter state persisted in URL params for shareability
- **MDX Processing**: Build-time parsing with `gray-matter`, runtime rendering with `next-mdx-remote/rsc`

### Critical Files
| File | Purpose | Type |
|------|---------|------|
| `src/lib/posts.tsx` | Post loading, parsing, category tree generation | Server Utility |
| `src/components/HomeClient.tsx` | Main home page orchestrator, filtering logic | Client Component |
| `src/app/page.tsx` | Home page server component, data fetching | Server Component |
| `src/app/blog/[slug]/page.tsx` | Blog post page, MDX rendering | Server Component |
| `src/app/layout.tsx` | Root layout, metadata, Header/Footer | Server Component |
| `src/hooks/use-scroll-reveal.tsx` | Animation hooks (GSAP, Intersection Observer) | Custom Hook |

### Core Data Types
```typescript
type Post = {
  slug: string;
  title: string;
  date: string;
  category: Category;
  tags?: string[];
  featuredImage: string;
  excerpt: string;
  content: string;
};

type Category = string; // Dynamic categories allowed
type CategoryTree = Record<string, string[]>; // Category → Tags[]
```

### Main Functions & Their Locations
- `getPosts()` → `src/lib/posts.tsx` - Loads all posts, parses MDX, sorts by date
- `getPostBySlug(slug)` → `src/lib/posts.tsx` - Loads single post by slug
- `getCategoryTree()` → `src/lib/posts.tsx` - Builds category → tags mapping
- `updateFilters()` → `src/components/HomeClient.tsx` - Updates URL params and filter state
- `generateStaticParams()` → `src/app/blog/[slug]/page.tsx` - Pre-generates all post routes

---

## Project Overview

**Hobbyist's Hideaway** is a modern, static blog platform built with Next.js 14, designed specifically for deployment on GitHub Pages. The blog focuses on documenting projects, guides, and stories related to Homelab setups, DIY electronics, Technology, and Automobile topics.

### Tech Stack
- **Framework**: Next.js 14.2.5 (App Router)
- **Language**: TypeScript 5
- **UI Library**: React 18.3.1
- **Styling**: Tailwind CSS 3.4.1 with custom theme
- **Content**: MDX (via `next-mdx-remote`)
- **Animations**: GSAP 3.14.2 with ScrollTrigger
- **UI Components**: Radix UI (via shadcn/ui)
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Content Parsing**: gray-matter

### Deployment
- **Target**: GitHub Pages (static hosting)
- **Build Output**: Static HTML/CSS/JS files in `out/` directory
- **Configuration**: `output: 'export'` in `next.config.mjs`

---

## Features

1. **Static Site Generation (SSG)** - Fully static, pre-rendered at build time
2. **MDX-Based Blog Posts** - Rich content with React components, frontmatter metadata
3. **Dynamic Taxonomy System** - Categories/tags auto-generated, no hardcoded lists
4. **Advanced Filtering & Search** - Client-side filtering by category/tag/search, URL persistence
5. **Responsive Design** - Mobile-first, adaptive layouts, mobile drawer navigation
6. **Scroll Animations** - GSAP ScrollTrigger + Intersection Observer, respects reduced motion
7. **Progressive Web App (PWA)** - Service Worker, offline capability, web manifest
8. **SEO Optimization** - Dynamic sitemap/robots.txt, structured data, Open Graph
9. **Social Features** - Sharing buttons, related posts, newsletter UI
10. **Performance Optimizations** - Static generation, incremental loading, code splitting

---

## System Setup

### Prerequisites
- Node.js 20+
- npm

### Installation & Commands
```bash
npm install              # Install dependencies
npm run dev             # Development server (localhost:3000)
npm run build           # Production build (outputs to out/)
npm run typecheck       # TypeScript type checking
npm test                # Run tests (Vitest)
```

### Configuration Files

**`next.config.mjs`**
- `output: 'export'` - Enables static site generation
- `images.unoptimized: true` - Required for GitHub Pages
- Remote image patterns: Unsplash, Placehold.co, Picsum

**`tailwind.config.mjs`**
- Dark mode: Class-based (`darkMode: ['class']`)
- Custom theme: CSS variables for colors/fonts
- Font families: Inter (body/headline), monospace (code)

**`tsconfig.json`**
- Path aliases: `@/*` → `./src/*`
- Strict mode: Enabled
- Target: ES2017

**`package.json` Scripts**
- `dev` - Development server
- `build` - Production build with type checking
- `typecheck` - TypeScript checking
- `test` - Vitest test runner

---

## Code Structure

### Directory Structure
```
src/
├── app/                    # Next.js App Router (Server Components)
│   ├── layout.tsx          # Root layout, Header/Footer, metadata
│   ├── page.tsx            # Home page (Server Component)
│   ├── globals.css         # Global styles, CSS variables
│   ├── about/page.tsx      # About page
│   ├── blog/[slug]/page.tsx # Dynamic blog post pages
│   ├── robots.ts           # Robots.txt generation
│   └── sitemap.ts          # Sitemap.xml generation
├── components/             # React components (mostly Client Components)
│   ├── home/               # Home page components
│   │   ├── HeroSection.tsx
│   │   ├── PostGrid.tsx
│   │   ├── CategoryTabs.tsx
│   │   ├── RecentPosts.tsx
│   │   ├── MobileSearchHeader.tsx
│   │   ├── NewsletterCTA.tsx
│   │   └── index.ts        # Barrel exports
│   ├── ui/                 # shadcn/ui component library
│   ├── Header.tsx          # Site header with navigation
│   ├── Footer.tsx          # Site footer
│   ├── HomeClient.tsx      # Main home page orchestrator
│   ├── PostCard.tsx        # Post card component
│   ├── CodeBlock.tsx       # Code block styling
│   ├── Newsletter.tsx      # Newsletter signup
│   ├── SocialShare.tsx     # Social sharing buttons
│   ├── ArticleStickyHeader.tsx
│   ├── Breadcrumb.tsx
│   ├── StructuredData.tsx  # JSON-LD structured data
│   ├── ServiceWorkerRegistration.tsx
│   ├── DotGrid.tsx         # Animated background
│   └── icons.tsx           # Category icon mappings
├── lib/                    # Utility functions
│   ├── posts.tsx           # Post loading/processing (CORE)
│   ├── utils.ts            # Helpers (cn, capitalize)
│   └── posts.test.ts       # Tests
├── hooks/                  # Custom React hooks
│   ├── use-scroll-reveal.tsx # Animation hooks
│   ├── use-mobile.tsx
│   └── use-toast.ts
├── posts/                  # MDX blog post files
│   └── *.mdx               # Post files with frontmatter
└── types/                  # TypeScript definitions
    └── index.ts            # Post, Category, CategoryTree types
```

### Key Files Explained

#### `src/lib/posts.tsx` (CORE LOGIC)
**Purpose**: Post loading, parsing, and category tree generation

**Functions**:
- `getPosts()`: Reads all `.mdx` files, parses frontmatter with `gray-matter`, returns `Post[]` sorted by date
- `getPostBySlug(slug)`: Reads single MDX file, returns `Post | undefined`
- `getCategoryTree()`: Builds `CategoryTree` (Record<Category, string[]>), maps categories to unique tags, sorts tags
- `getCategories()`: Returns main categories array (backwards compatibility)
- `getCategoriesWithIcons()`: Returns categories with icons

**Key Implementation Details**:
- Uses `fs.readdirSync()` to read MDX files at build time
- `gray-matter` parses YAML frontmatter and MDX content
- Handles missing directory gracefully (returns empty array)
- Tags sorted alphabetically within each category

#### `src/components/HomeClient.tsx` (MAIN CLIENT COMPONENT)
**Purpose**: Orchestrates home page, manages filtering/search state

**State Management**:
- `selectedCategory`: 'All' | Category string
- `selectedTag`: string | null
- `searchQuery`: string
- `isMobile`: boolean (responsive detection)
- `visiblePostsCount`: number (8 mobile, 15 desktop)

**Key Logic**:
- `filteredPosts` (useMemo): Filters by category + tag + search query
- `displayedPosts` (useMemo): Paginated subset of filteredPosts
- Filter state synced with URL search params via `useRouter.push()`

**Event Handlers**:
- `updateFilters(category, tag)`: Updates URL params and state, closes mobile browse
- `handleSearchChange`: Updates search query, clears URL params
- `handleLoadMore`: Increments visiblePostsCount (9 desktop, 8 mobile)
- `handleClearAllFilters`: Resets all filters

**Animation Hooks**:
- `useHeroFade`: Hero fade-out on scroll (GSAP)
- `useStaggerReveal`: Staggered reveal for RecentPosts and PostGrid
- `useScrollReveal`: CTA section reveal

#### `src/app/blog/[slug]/page.tsx` (BLOG POST PAGE)
**Purpose**: Dynamic blog post page with MDX rendering

**Static Generation**:
- `generateStaticParams()`: Pre-generates all post routes at build time
- `generateMetadata()`: Generates SEO metadata per post

**MDX Rendering**:
- Uses `next-mdx-remote/rsc` for server-side rendering
- Custom component mapping: h2/h3 (responsive), p (spacing), img (figure with caption), code (CodeBlock), lists/blockquotes/links (styled)

**Related Posts**:
- Filters by same category, excludes current post, shows top 3

**SEO Features**:
- Structured data (JSON-LD) via `StructuredData` component
- Breadcrumb navigation
- Social sharing buttons
- Read time estimation

#### `src/app/layout.tsx` (ROOT LAYOUT)
**Purpose**: Root layout, metadata, Header/Footer

**Metadata**: Site-wide SEO, Open Graph, Twitter Cards, theme color

**Layout Structure**:
- Header (receives categoryTree from server)
- Main content area
- Footer
- Toaster (toast notifications)
- ServiceWorkerRegistration

**Server-Side Data**: Fetches `categoryTree` at build time, passes to Header

#### `src/components/Header.tsx` (NAVIGATION)
**Purpose**: Site header with dynamic navigation

**Desktop**: Logo, Home link, Categories dropdown (nested tags), About link

**Mobile**: Hamburger menu (Sheet), full drawer, categories with expandable tag lists

**Dynamic Categories**: Renders all categories from `categoryTree`, shows tags as submenu items

#### `src/hooks/use-scroll-reveal.tsx` (ANIMATION HOOKS)
**Purpose**: Custom hooks for scroll animations

**`useScrollReveal()`**: Intersection Observer, triggers on viewport entry, respects `prefers-reduced-motion`, handles mobile detection

**`useStaggerReveal()`**: Wraps `useScrollReveal`, provides `getItemDelay()` for staggered animations

**`useHeroFade()`**: GSAP ScrollTrigger, fades out hero on scroll, scales down slightly

**`useParallax()`**: GSAP ScrollTrigger parallax (currently unused)

---

## Data Flow & Interactions

### Post Loading Flow
```
MDX Files → getPosts() → gray-matter Parser → Post Objects → 
Sort by Date → Server Component (page.tsx) → 
Pass to HomeClient.tsx → Filter Logic (useMemo) → PostGrid
```

**Steps**:
1. Build time: Next.js reads `.mdx` files from `src/posts/`
2. Parsing: `gray-matter` extracts frontmatter (YAML) and content (MDX)
3. Type conversion: Frontmatter → `Post` type
4. Sorting: Posts sorted by date (newest first)
5. Server rendering: `page.tsx` calls `getPosts()`
6. Client hydration: Data passed to `HomeClient.tsx`
7. Filtering: `useMemo` filters posts based on user selections
8. Rendering: Filtered posts rendered in `PostGrid`

### Filtering & Search Flow
```
User Action → State Update → URL Params Update → 
useMemo filteredPosts → Display Results → Scroll to Results
```

**Filter Logic** (in `HomeClient.tsx`):
```typescript
const filteredPosts = useMemo(() => {
  return initialPosts.filter((post) => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesTag = selectedTag ? post.tags?.includes(selectedTag) : true;
    const query = searchQuery.toLowerCase();
    const matchesSearch = post.title.toLowerCase().includes(query) || 
                         post.excerpt.toLowerCase().includes(query);
    return matchesCategory && matchesTag && matchesSearch;
  });
}, [initialPosts, selectedCategory, selectedTag, searchQuery]);
```

**URL Parameter Structure**:
- `/?category=HomeLab` - Filter by category
- `/?category=HomeLab&tag=docker` - Filter by category and tag
- `/?` - No filters (all posts)

### Category Tree Generation
```
getPosts() → All Posts → getCategoryTree() → 
Iterate Posts → Collect Unique Tags per Category → 
Sort Tags → Return CategoryTree → Pass to Header → Render Navigation
```

**Example Output**:
```typescript
{
  "HomeLab": ["docker", "proxmox", "self-hosting"],
  "Automobile": ["maintenance", "diy", "repair"],
  "Technology": ["linux", "coding", "tools"],
  "Electronics": ["soldering", "arduino", "raspberry-pi"]
}
```

### Component Hierarchy
```
RootLayout
├── Header (categoryTree from server)
├── Main
│   ├── Home Page → HomeClient
│   │   ├── MobileSearchHeader
│   │   ├── HeroSection
│   │   ├── RecentPosts
│   │   ├── CategoryTabs
│   │   ├── PostGrid → PostCard[]
│   │   └── NewsletterCTA
│   ├── Blog Post Page
│   │   ├── ArticleStickyHeader
│   │   ├── Breadcrumb
│   │   ├── MDXRemote Content
│   │   ├── SocialShare
│   │   ├── RelatedPosts → PostCard[]
│   │   └── Newsletter
│   └── About Page
├── Footer
├── Toaster
└── ServiceWorkerRegistration
```

---

## Architecture Patterns

### Server/Client Component Split

**Server Components** (`src/app/*.tsx`, default):
- **Responsibilities**: Data fetching, metadata generation, static generation, initial HTML rendering
- **Examples**: `page.tsx`, `layout.tsx`, `blog/[slug]/page.tsx`
- **Cannot use**: useState, useEffect, browser APIs, event handlers

**Client Components** (`src/components/*.tsx`, marked with `'use client'`):
- **Responsibilities**: User interactions, state management, browser APIs, animations
- **Examples**: `HomeClient.tsx`, `Header.tsx`
- **Can use**: All React hooks, browser APIs, event handlers

**Pattern**: Server Components fetch data → Pass to Client Components → Client Components handle interactivity

### State Management

**No Global State Library**: Uses React built-ins + URL params

**State Patterns**:
1. **Local State** (`useState`): Component-specific state (isMobile, isSearchFocused)
2. **Derived State** (`useMemo`): Computed values (filteredPosts, displayedPosts)
3. **URL State** (`useSearchParams`, `useRouter`): Filter state in URL, shareable views
4. **Ref State** (`useRef`): Mutable values without re-renders, DOM refs

### Animation System

**GSAP ScrollTrigger**:
- Usage: Hero fade-out, parallax effects
- Registration: Once in `use-scroll-reveal.tsx`
- Cleanup: GSAP context cleanup on unmount
- Accessibility: Respects `prefers-reduced-motion`

**Intersection Observer**:
- Usage: Scroll reveal animations
- Implementation: Custom hooks (`useScrollReveal`, `useStaggerReveal`)
- Features: Configurable threshold/rootMargin, trigger once/multiple, mobile detection, reduced motion support

**Animation Flow**:
1. Component mounts → Hook attaches Intersection Observer
2. Element enters viewport → Observer triggers
3. State updates (`isVisible = true`)
4. CSS classes applied (`scroll-reveal--visible`)
5. Stagger delay calculated for multiple items
6. Animation completes → Observer optionally disconnects

### MDX Processing

**Build-Time**:
- MDX files read from filesystem
- Frontmatter parsed with `gray-matter`
- Content stored as string in `Post.content`

**Runtime Rendering**:
- `next-mdx-remote/rsc` renders MDX server-side
- Custom component mapping for styled elements

**Frontmatter Schema**:
```yaml
---
title: 'Post Title'
date: 'YYYY-MM-DD'
category: 'CategoryName'
tags: ['tag1', 'tag2']
featuredImage: 'https://...'
excerpt: 'Post excerpt...'
---
```

### Type Safety

**TypeScript Configuration**:
- Strict mode enabled
- Path aliases: `@/*` → `./src/*`
- Type definitions: `src/types/index.ts`

**Key Types**:
```typescript
type Post = {
  slug: string;
  title: string;
  date: string;
  category: Category;
  tags?: string[];
  featuredImage: string;
  excerpt: string;
  content: string;
};

type Category = string; // Dynamic categories allowed
type CategoryTree = Record<string, string[]>; // Category → Tags[]
```

---

## Key Interactions

### Home Page Interactions

#### 1. Search Functionality
- **Desktop**: Search input in hero, real-time filtering, clear button
- **Mobile**: Search button expands to full-screen header, hero collapses, smooth transitions (300ms)
- **Filter Logic**: Searches post title and excerpt (case-insensitive)

#### 2. Category Filtering
- **Main Categories**: "All Posts" + 4 main categories with icons (Automobile, Technology, Electronics, HomeLab)
- **Browse Dropdown**: Shows all categories (including dynamic), nested submenu for tags
- **Flow**: Category click → `handleCategoryClick()` → `updateFilters(category, null)` → URL updated → Posts filtered → Scroll to results

#### 3. Tag Filtering
- **Selection**: Tags in category dropdown submenus, can select with/without category filter
- **Badge**: Active tag shown as badge above posts, removable via X button
- **Flow**: Tag click → `updateFilters(category, tag)` → URL: `/?category=X&tag=Y` → Filter logic: `post.tags?.includes(selectedTag)`

#### 4. Load More Pagination
- **Initial**: 15 posts (desktop) or 8 posts (mobile)
- **Load More**: Adds 9 (desktop) or 8 (mobile) posts
- **State**: `visiblePostsCount` state, `displayedPosts` slices filteredPosts

#### 5. Mobile-Specific Interactions
- **Hero Collapse**: Search focus collapses hero (max-height: 0), MobileSearchHeader slides in
- **Browse Sheet**: Bottom sheet with accordion, scrollable content, closes on selection
- **Scroll Behavior**: Filter selection triggers smooth scroll with delay (150-400ms) for animations

### Blog Post Page Interactions

#### 1. Sticky Header
- Shows post title when scrolling down, hides at top, smooth transition, fixed at viewport top
- Implementation: Scroll event listener, toggles visibility based on scroll position

#### 2. Social Sharing
- Share buttons (Twitter, Facebook, LinkedIn), generates share URLs, appears in header/footer
- Implementation: Uses `navigator.share()` API when available, falls back to manual URL construction

#### 3. Related Posts
- Filters by same category, excludes current post, shows top 3, rendered as PostCard components

#### 4. MDX Content Rendering
- Custom components: Headers (responsive), Images (figure with captions), Code blocks (CodeBlock component), Links (styled), Lists (custom spacing)
- Image handling: Prevents hydration errors (no `<p>` wrapping), captions from `title` attribute, responsive sizing

---

## Build & Deployment

### Build Process
1. Run `npm run build`
2. Next.js generates static HTML/CSS/JS files
3. Output written to `out/` directory
4. All routes pre-rendered at build time

**Build Output Structure**:
```
out/
├── index.html           # Home page
├── about.html           # About page
├── blog/[slug]/index.html # Blog posts
├── _next/               # Next.js assets
├── robots.txt           # Generated
├── sitemap.xml          # Generated
└── ...                  # Other static assets
```

### GitHub Pages Deployment
1. Build: `npm run build`
2. Commit `out/` to `gh-pages` branch (or use GitHub Actions)
3. Configure GitHub Pages to serve from `gh-pages` branch
4. Site available at `https://username.github.io/repo-name/`

**GitHub Actions** (if configured): Auto-builds on push to main, deploys `out/` to `gh-pages`

### Service Worker
- Registered client-side in `ServiceWorkerRegistration` component
- Registered on page load
- File: `public/sw.js`
- Caches static assets for offline access
- PWA features: Installable (manifest.json), offline access, fast loading from cache

### Performance Considerations
- **Static Generation**: Instant loads, CDN cacheable, SEO-friendly
- **Image Optimization**: Unoptimized (required for GitHub Pages), external sources (Unsplash), lazy loading
- **Code Splitting**: Automatic by Next.js, route-based, component-level
- **Bundle Size**: Tree-shaking, dynamic imports, optimized production builds

---

## Additional Technical Details

### Styling System
- **Tailwind CSS**: Utility-first, custom theme via `tailwind.config.mjs`
- **CSS Variables**: Defined in `globals.css` for theming (light/dark mode)
- **Dark Mode**: Class-based (`dark:` prefix), prepared but not implemented
- **Responsive Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)

### SEO Implementation
- **Metadata API**: Next.js Metadata API, dynamic metadata per page, Open Graph, Twitter Cards
- **Structured Data**: JSON-LD format, Article schema for posts, Breadcrumb schema
- **Sitemap**: Generated at build time (`sitemap.ts`), includes all posts, priority/change frequency set
- **Robots.txt**: Generated at build time (`robots.ts`), allows all crawlers, points to sitemap

### Accessibility
- **Semantic HTML**: Proper heading hierarchy, semantic elements (`<article>`, `<nav>`, etc.), ARIA labels
- **Keyboard Navigation**: All interactive elements accessible, focus indicators, logical tab order
- **Screen Readers**: Alt text, ARIA labels, descriptive link text, form labels
- **Reduced Motion**: Animations respect `prefers-reduced-motion`, disabled for users who prefer it

### Testing
- **Test Setup**: Vitest test runner, React Testing Library
- **Test Coverage**: Post loading logic, category tree generation
- **Tests Location**: `src/lib/posts.test.ts`

### Development Workflow

**Adding a New Post**:
1. Create `.mdx` file in `src/posts/`
2. Add frontmatter with required fields
3. Write content in Markdown/MDX
4. Build and deploy

**Adding a New Category**:
1. Add category to post frontmatter
2. Category automatically appears in navigation
3. Add icon to `src/components/icons.tsx` (optional)

**Modifying Styles**:
1. Update Tailwind classes in components
2. Add custom CSS in `globals.css` if needed
3. Update theme in `tailwind.config.mjs` for global changes

**Adding Components**:
1. Create component in `src/components/`
2. Export from appropriate index file
3. Import and use in pages/components

---

## Component Dependencies

### Data Flow Dependencies
```
layout.tsx (Server)
  └── getCategoryTree() → Header
  └── getPosts() → page.tsx → HomeClient

page.tsx (Server)
  └── getPosts() → HomeClient
  └── getCategories() → HomeClient
  └── getCategoryTree() → HomeClient

HomeClient.tsx (Client)
  └── HeroSection, RecentPosts, CategoryTabs, PostGrid, NewsletterCTA
  └── Uses: useScrollReveal, useStaggerReveal, useHeroFade hooks

blog/[slug]/page.tsx (Server)
  └── getPostBySlug() → Post data
  └── getPosts() → Related posts
  └── MDXRemote → Renders content
```

### Import Patterns
- **Server Components**: Import from `@/lib/posts`, `@/types`
- **Client Components**: Import from `@/components`, `@/hooks`, `@/lib/utils`
- **Path Aliases**: `@/*` maps to `./src/*`

---

## Quick Implementation Guide

### To Add a New Feature

1. **Identify Component Type**: Server (data fetching) or Client (interactivity)
2. **Check Data Flow**: Does it need post data? Use `getPosts()` or `getPostBySlug()`
3. **State Management**: Use `useState` for local, `useMemo` for derived, URL params for shareable
4. **Styling**: Use Tailwind classes, add to `globals.css` if custom CSS needed
5. **Animations**: Use `useScrollReveal` or `useStaggerReveal` hooks if needed
6. **Type Safety**: Add types to `src/types/index.ts` if new data structures

### Common Patterns

**Filtering Posts**:
```typescript
const filtered = useMemo(() => {
  return posts.filter(post => /* filter logic */);
}, [posts, filterCriteria]);
```

**URL State Sync**:
```typescript
const router = useRouter();
const updateFilters = (category, tag) => {
  const params = new URLSearchParams();
  if (category !== 'All') params.set('category', category);
  if (tag) params.set('tag', tag);
  router.push(`/?${params.toString()}`, { scroll: false });
};
```

**Animation Hook Usage**:
```typescript
const { ref, isVisible, getItemDelay } = useStaggerReveal(posts.length, {
  threshold: 0.1,
  staggerDelay: 80
});
```

---

## Conclusion

Hobbyist's Hideaway is a well-structured, modern static blog built with Next.js 14. The architecture emphasizes:

- **Simplicity**: No complex state management, uses React built-ins
- **Performance**: Static generation for instant loads
- **Flexibility**: Dynamic categories, easy content addition
- **User Experience**: Smooth animations, responsive design, intuitive navigation
- **Developer Experience**: TypeScript, clear structure, well-organized code

The codebase is maintainable, scalable, and follows Next.js best practices for static site generation.
