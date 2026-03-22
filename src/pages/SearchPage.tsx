import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useSearchPosts } from "@/hooks/usePosts";
import { PostList } from "@/components/post/PostList";
import { Pagination } from "@/components/common/Pagination";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorBanner } from "@/components/common/ErrorBanner";

export function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const [page, setPage] = useState(0);
  const { data, isLoading, error } = useSearchPosts(query, { page, size: 10 });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-100 mb-6">Search</h1>

      {query && (
        <p className="text-sm text-gray-400 mb-4">
          {data
            ? `${data.page.totalElements} result${data.page.totalElements !== 1 ? "s" : ""} for "${query}"`
            : `Searching for "${query}"...`}
        </p>
      )}

      {isLoading && <LoadingSpinner />}
      {error && <ErrorBanner message="Search failed." />}

      {data && (
        <>
          {data.content.length === 0 ? (
            <p className="text-gray-500 py-4">No posts found.</p>
          ) : (
            <>
              <PostList posts={data.content} />
              <Pagination page={page} totalPages={data.page.totalPages} onPageChange={setPage} />
            </>
          )}
        </>
      )}
    </div>
  );
}
