import { serverFetch } from "../server-client";
import type { Page, Pageable, CategoryResponse } from "@/types";

export async function fetchCategories(
  pageable?: Pageable
): Promise<Page<CategoryResponse>> {
  const p = new URLSearchParams();
  if (pageable?.page !== undefined) p.set("page", String(pageable.page));
  if (pageable?.size !== undefined) p.set("size", String(pageable.size));
  const q = p.toString();
  const url = q ? `/category/search?${q}` : "/category/search";
  return serverFetch<Page<CategoryResponse>>(url, { cache: "no-store" });
}
