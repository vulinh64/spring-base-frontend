import { Link } from "react-router-dom";
import type { CategoryResponse } from "@/types";

interface CategoryBadgeProps {
  category: CategoryResponse;
}

export function CategoryBadge({ category }: CategoryBadgeProps) {
  return (
    <Link
      to={`/category/${category.categorySlug}`}
      className="inline-block rounded bg-blue-900/40 px-2.5 py-1 text-xs font-medium text-blue-400 hover:bg-blue-900/60 transition-colors"
    >
      {category.displayName}
    </Link>
  );
}
