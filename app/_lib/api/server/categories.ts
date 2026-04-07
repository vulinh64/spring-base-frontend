import { serverFetch } from "../server-client";
import type { Page, Pageable, CategoryResponse } from "@/types";

export async function fetchCategories(
  pageable?: Pageable
): Promise<Page<CategoryResponse>> {
  const p = new URLSearchParams();
  if (pageable?.page !== undefined) p.set("page", String(pageable.page));
  if (pageable?.size !== undefined) p.set("size", String(pageable.size));
  const q = p.toString();
  return serverFetch<Page<CategoryResponse>>(
    `/api/category/search${q ? `?${q}` : ""}`,
    { cache: "no-store" }
  );
}
