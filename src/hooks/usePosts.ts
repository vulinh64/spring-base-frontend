import { useQuery } from "@tanstack/react-query";
import { postApi } from "@/api";
import type { Pageable } from "@/types";

export function usePosts(pageable?: Pageable) {
  return useQuery({
    queryKey: ["posts", pageable],
    queryFn: () => postApi.list(pageable).then((r) => r.data),
  });
}

export function useSearchPosts(query: string, pageable?: Pageable) {
  return useQuery({
    queryKey: ["posts", "search", query, pageable],
    queryFn: () => postApi.search(query, pageable).then((r) => r.data),
    enabled: query.trim().length > 0,
  });
}

export function usePostsByCategory(categorySlug: string, pageable?: Pageable) {
  return useQuery({
    queryKey: ["posts", "category", categorySlug, pageable],
    queryFn: () => postApi.listByCategory(categorySlug, pageable).then((r) => r.data),
    enabled: !!categorySlug,
  });
}

export function usePost(identity: string) {
  return useQuery({
    queryKey: ["post", identity],
    queryFn: () => postApi.getByIdentity(identity).then((r) => r.data),
    enabled: !!identity,
  });
}

export function usePostRevisions(id: string, pageable?: Pageable) {
  return useQuery({
    queryKey: ["postRevisions", id, pageable],
    queryFn: () => postApi.getRevisions(id, pageable).then((r) => r.data),
    enabled: !!id,
  });
}
