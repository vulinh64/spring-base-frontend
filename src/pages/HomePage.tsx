import { useState } from "react";
import { usePosts } from "@/hooks/usePosts";
import { PostList } from "@/components/post/PostList";
import { Pagination } from "@/components/common/Pagination";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorBanner } from "@/components/common/ErrorBanner";

export function HomePage() {
  const [page, setPage] = useState(0);
  const { data, isLoading, error } = usePosts({ page, size: 10 });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-100 mb-6">Posts</h1>

      {isLoading && <LoadingSpinner />}
      {error && <ErrorBanner message="Failed to load posts." />}

      {data && (
        <>
          <PostList posts={data.content} />
          <Pagination page={page} totalPages={data.page.totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
