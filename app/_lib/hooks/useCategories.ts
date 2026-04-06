import { useQuery } from "@tanstack/react-query";
import { categoryApi } from "@/api";
import type { Pageable, CategorySearchRequest } from "@/types";

export function useCategories(params?: CategorySearchRequest & Pageable) {
  return useQuery({
    queryKey: ["categories", params],
    queryFn: () => categoryApi.search(params).then((r) => r.data),
  });
}
