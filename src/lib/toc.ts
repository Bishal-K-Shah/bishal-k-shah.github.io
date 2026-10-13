export type TocItem = {
  id: string;
  text: string;
};

type HastNode = {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

const nodeText = (node: HastNode): string =>
  node.type === 'text' ? node.value ?? '' : (node.children ?? []).map(nodeText).join('');

/**
 * Rehype plugin that records every h2 (after rehype-slug has assigned ids) into `items`,
 * so the table of contents always matches the ids rendered on the page.
 */
export function rehypeCollectHeadings(items: TocItem[]) {
  return () => (tree: HastNode) => {
    const walk = (node: HastNode) => {
      if (node.type === 'element' && node.tagName === 'h2' && typeof node.properties?.id === 'string') {
        const text = nodeText(node).trim();
        if (text) items.push({ id: node.properties.id, text });
      }
      node.children?.forEach(walk);
    };
    walk(tree);
  };
}
