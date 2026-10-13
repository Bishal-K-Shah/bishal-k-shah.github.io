export const SITE_URL = 'https://bishalkshah.com.np';

/** Site-wide share image, used when a post has no featured image. */
export const DEFAULT_OG_IMAGE = '/og-image.png';

/** Returns `url` unchanged if it is already absolute, otherwise prefixes it with the site URL. */
export function absoluteUrl(url: string): string {
  if (/^https?:\/\//i.test(url)) return url;
  return `${SITE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
}
