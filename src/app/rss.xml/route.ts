import { getPosts } from '@/lib/posts';
import { absoluteUrl, SITE_URL } from '@/lib/site';

export const dynamic = 'force-static';

const escapeXml = (value: string) =>
  value.replace(/[<>&'"]/g, (char) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[char]!);

const toRfc822 = (date: string) => new Date(`${date}T00:00:00Z`).toUTCString();

export async function GET() {
  const posts = await getPosts();

  const items = posts
    .map((post) => {
      const url = `${SITE_URL}/blog/${post.slug}`;
      const categories = [post.category, ...(post.tags ?? [])]
        .map((category) => `      <category>${escapeXml(category)}</category>`)
        .join('\n');
      const image = post.featuredImage
        ? `\n      <media:content url="${escapeXml(absoluteUrl(post.featuredImage))}" medium="image" />`
        : '';
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${toRfc822(post.date)}</pubDate>
      <description>${escapeXml(post.excerpt ?? '')}</description>
${categories}${image}
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>Hobbyist's Hideaway</title>
    <link>${SITE_URL}</link>
    <description>Guides on Homelab setups, DIY electronics, automobiles and technology for makers and hobbyists.</description>
    <language>en-us</language>
    <lastBuildDate>${posts.length ? toRfc822(posts[0].date) : new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
