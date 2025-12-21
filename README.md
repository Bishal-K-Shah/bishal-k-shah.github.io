# Blog Static System - Hobbyist's Hideaway

Hobbyist's Hideaway is a static blog built with Next.js, tailored for deployment on GitHub Pages. It features a curated collection of guides and stories about Homelab setups, DIY electronics, technology, and automobiles.

## Features

*   **Static Generation:** Fully static site generation using Next.js (`output: 'export'`), perfect for GitHub Pages.
*   **MDX Support:** Blog posts are written in MDX, allowing for rich content with embedded React components.
*   **Dynamic Taxonomy:** Categories and tags are automatically generated from your content. Adding a new category in a post's frontmatter instantly creates a new menu item.
*   **Responsive Design:** A beautiful, responsive UI with a dedicated mobile drawer and desktop dropdowns.
*   **Search & Filtering:** Real-time client-side filtering by category, tag, and search query.

## Adding New Blog Posts

Adding a new post is simple and requires no code changes to the application logic.

1.  **Create a File:** Create a new `.mdx` file in the `src/posts/` directory. The filename will become the URL slug (e.g., `my-new-post.mdx` becomes `/blog/my-new-post`).

2.  **Add Frontmatter:** At the top of the file, add the required metadata between triple dashes (`---`):

    ```yaml
    ---
    title: 'Your Post Title'
    date: 'YYYY-MM-DD'
    category: 'Home Improvement' # Can be any string. If it's new, it will appear in the "Browse" menu automatically.
    tags: ['painting', 'diy', 'tools'] # An array of strings. These create sub-menus and filter chips.
    featuredImage: 'https://images.unsplash.com/photo-123...' # Full URL to an image
    excerpt: 'A short description of your post that appears on the card.'
    ---
    ```

    *   **Category:** You are not limited to the main 4 categories. Feel free to invent new ones like "Woodworking" or "Gardening". They will automatically be grouped in the UI.
    *   **Tags:** Use these for specific topics within a category.

3.  **Write Content:** Write your post content using standard Markdown syntax below the frontmatter.
    *   **Images:** Use standard Markdown image syntax: `![Alt Text](url "Caption")`. The title attribute ("Caption") will be rendered as a caption below the image.
    *   **Code Blocks:** Use triple backticks with a language identifier for syntax highlighting.

    **Example:**

    ```markdown
    ## Introduction

    This is a subheading. You can write **bold** text or *italics*.

    ![My Project](https://images.unsplash.com/photo-123 "My Project Setup")

    Here is some code:

    \`\`\`python
    print("Hello, World!")
    \`\`\`
    ```

4.  **Deploy:** Push your changes to the repository. The site will automatically rebuild (via GitHub Actions) and publish the new content.

## Development

To run the project locally:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
