import Link from "next/link";
import type { CategoryResponse } from "@/types";

interface CategoryBadgeProps {
  category: CategoryResponse;
}

export function CategoryBadge({ category }: CategoryBadgeProps) {
  const isUncategorized = category.id === "00000000-0000-0000-0000-000000000000";

  return (
    <Link
      href={`/category/${category.categorySlug}`}
      className={`inline-block rounded px-2.5 py-1 text-xs font-medium transition-colors ${
        isUncategorized
          ? "bg-red-900/40 text-red-400 hover:bg-red-900/60"
          : "bg-blue-900/40 text-blue-400 hover:bg-blue-900/60"
      }`}
    >
      {category.displayName}
    </Link>
  );
}
