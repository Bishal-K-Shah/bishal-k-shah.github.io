/**
 * Normalises a tag for comparison, so spelling variants such as "Self-Hosting",
 * "self-hosting" and "self hosting" are treated as the same tag.
 */
export const tagKey = (tag: string): string => tag.trim().toLowerCase().replace(/[\s_]+/g, '-');

export const sameTag = (a: string, b: string): boolean => tagKey(a) === tagKey(b);

/**
 * Picks the spelling to display for a tag from the spellings posts use (with their counts):
 * one the author capitalised (e.g. "DIY" over "diy"), then the most used, then alphabetical.
 */
export const pickTagLabel = (spellings: Map<string, number>): string =>
  [...spellings.entries()].sort(
    ([a, countA], [b, countB]) =>
      Number(b !== b.toLowerCase()) - Number(a !== a.toLowerCase()) || countB - countA || a.localeCompare(b)
  )[0][0];
