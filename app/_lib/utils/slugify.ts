import { fromMarkdown } from "mdast-util-from-markdown";
import { toString } from "mdast-util-to-string";

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
}

export interface HeadingAnchor {
  text: string;
  id: string;
  sourceOffset?: number;
}

export function createHeadingIdGenerator(
  reservedIds: Iterable<string> = []
): (text: string) => string {
  const usedIds = new Set(reservedIds);

  return (text: string) => {
    const baseId = slugify(text) || "section";
    let id = baseId;
    let suffix = 2;

    while (usedIds.has(id)) {
      id = `${baseId}-${suffix++}`;
    }

    usedIds.add(id);
    return id;
  };
}

export function createHeadingAnchors(headings: string[]): HeadingAnchor[] {
  const createId = createHeadingIdGenerator();
  return headings.map((text) => ({ text, id: createId(text) }));
}

export function extractHeadingAnchors(markdown: string): HeadingAnchor[] {
  const tree = fromMarkdown(markdown);
  const createId = createHeadingIdGenerator();

  return tree.children
    .filter((node) => node.type === "heading" && node.depth === 2)
    .map((node) => {
      const text = toString(node);
      return {
        text,
        id: createId(text),
        sourceOffset: node.position?.start.offset,
      };
    });
}

export function findDuplicateHeadingAnchorIds(markdown: string): string[] {
  const seenIds = new Set<string>();
  const duplicateIds = new Set<string>();

  for (const { text } of extractHeadingAnchors(markdown)) {
    const id = slugify(text) || "section";

    if (seenIds.has(id)) {
      duplicateIds.add(id);
    } else {
      seenIds.add(id);
    }
  }

  return [...duplicateIds];
}
