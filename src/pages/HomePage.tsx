import { useState } from "react";
import { Link } from "react-router-dom";
import { usePosts } from "@/hooks/usePosts";
import { useAuth } from "@/auth/AuthProvider";
import { PostList } from "@/components/post/PostList";
import { Pagination } from "@/components/common/Pagination";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorBanner } from "@/components/common/ErrorBanner";

export function HomePage() {
  const [page, setPage] = useState(0);
  const { authenticated } = useAuth();
  const { data, isLoading, error } = usePosts({ page, size: 10, sort: ["createdDateTime,desc", "updatedDateTime,desc"] });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-100">Posts</h1>
        {authenticated && (
          <Link
            to="/post/new"
            className="flex items-center gap-3 rounded bg-blue-600 pl-3 pr-4 py-1.5 text-sm text-white hover:bg-blue-700"
          >
            <span>+</span>
            <span>New Post</span>
          </Link>
        )}
      </div>

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
