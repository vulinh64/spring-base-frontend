export const PAGE_SIZE_OPTIONS = [5, 10, 20, 50] as const;
export const DEFAULT_PAGE_SIZE = 10;

export function parsePageSegments(segments?: string[]): number | null {
  if (!segments) return 1;
  if (segments.length !== 1) return null;
  if (!/^[1-9]\d*$/.test(segments[0])) return null;

  const page = Number(segments[0]);
  return Number.isSafeInteger(page) ? page : null;
}

export function parsePageSize(value?: string): number | null {
  if (!value) return DEFAULT_PAGE_SIZE;
  if (!/^[1-9]\d*$/.test(value)) return null;

  const size = Number(value);
  return Number.isSafeInteger(size) &&
    PAGE_SIZE_OPTIONS.includes(size as (typeof PAGE_SIZE_OPTIONS)[number])
    ? size
    : null;
}

export function sizeQuery(size: number): string {
  return size === DEFAULT_PAGE_SIZE ? "" : `?size=${size}`;
}
