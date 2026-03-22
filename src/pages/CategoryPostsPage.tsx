import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { usePostsByCategory } from "@/hooks/usePosts";
import { PostList } from "@/components/post/PostList";
import { Pagination } from "@/components/common/Pagination";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorBanner } from "@/components/common/ErrorBanner";

export function CategoryPostsPage() {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState(0);
  const { data, isLoading, error } = usePostsByCategory(slug!, { page, size: 10 });

  const totalElements = data?.page.totalElements ?? 0;
  const categoryName = data?.content[0]?.category?.displayName ?? slug;

  return (
    <div>
      <div className="mb-6">
        <Link
          to="/categories"
          className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
        >
          &larr; Back to categories
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-gray-100 mb-2">
        Category: {categoryName}
      </h1>

      {data && (
        <p className="text-sm text-gray-400 mb-6">
          Found {totalElements} {totalElements === 1 ? "post" : "posts"} for category
          &ldquo;{categoryName}&rdquo;
        </p>
      )}

      {isLoading && <LoadingSpinner />}
      {error && <ErrorBanner message="Failed to load posts for this category." />}

      {data && (
        <>
          <PostList posts={data.content} />
          <Pagination page={page} totalPages={data.page.totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
