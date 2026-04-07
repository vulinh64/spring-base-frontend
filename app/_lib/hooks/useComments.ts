import { useQuery } from "@tanstack/react-query";
import { commentApi } from "@/api";
import type { Pageable } from "@/types";

export function useComments(postId: string, pageable?: Pageable, enabled = true) {
  return useQuery({
    queryKey: ["comments", postId, pageable],
    queryFn: () => commentApi.list(postId, pageable).then((r) => r.data),
    enabled: !!postId && enabled,
  });
}
