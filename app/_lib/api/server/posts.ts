import { serverFetch } from "../server-client";
import type {
  Page,
  Pageable,
  PrefetchPostProjection,
  SinglePostResponse,
} from "@/types";

function toQuery(pageable?: Pageable): string {
  if (!pageable) return "";
  const p = new URLSearchParams();
  if (pageable.page !== undefined) p.set("page", String(pageable.page));
  if (pageable.size !== undefined) p.set("size", String(pageable.size));
  if (pageable.sort) {
    const sorts = Array.isArray(pageable.sort) ? pageable.sort : [pageable.sort];
    sorts.forEach((s) => p.append("sort", s));
  }
  const q = p.toString();
  return q ? `?${q}` : "";
}

export async function fetchPost(slug: string): Promise<SinglePostResponse> {
  return serverFetch<SinglePostResponse>(`/api/post/${slug}`, {
    cache: "no-store",
  });
}

export async function fetchPosts(
  pageable?: Pageable
): Promise<Page<PrefetchPostProjection>> {
  return serverFetch<Page<PrefetchPostProjection>>(
    `/api/post${toQuery(pageable)}`,
    { cache: "no-store" }
  );
}

export async function fetchPostsByCategory(
  categorySlug: string,
  pageable?: Pageable
): Promise<Page<PrefetchPostProjection>> {
  return serverFetch<Page<PrefetchPostProjection>>(
    `/api/post/category/${categorySlug}${toQuery(pageable)}`,
    { cache: "no-store" }
  );
}
