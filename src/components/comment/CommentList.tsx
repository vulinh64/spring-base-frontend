import { useState } from "react";
import { useComments } from "@/hooks/useComments";
import { useAuth } from "@/auth/AuthProvider";
import { CommentItem } from "./CommentItem";
import { CommentForm } from "./CommentForm";
import { Pagination } from "@/components/common/Pagination";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorBanner } from "@/components/common/ErrorBanner";

interface CommentListProps {
  postId: string;
  commentCount: number;
}

export function CommentList({ postId, commentCount }: CommentListProps) {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const { data, isLoading, error } = useComments(postId, { page, size: 10 }, open);
  const { authenticated } = useAuth();

  const displayCount = data?.page.totalElements ?? commentCount;

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-sm text-gray-400 hover:text-gray-200 transition-colors"
      >
        Comments ({displayCount})
      </button>
    );
  }

  return (
    <div>
      <button
        onClick={() => setOpen(false)}
        className="text-sm text-gray-400 hover:text-gray-200 transition-colors mb-4"
      >
        Hide Comments ({displayCount})
      </button>

      {isLoading && <LoadingSpinner />}
      {error && <ErrorBanner message="Failed to load comments." />}

      {data && (
        <>
          {data.content.length === 0 ? (
            <p className="text-gray-500 text-sm py-4">No comments yet.</p>
          ) : (
            data.content.map((comment) => (
              <CommentItem key={comment.id} comment={comment} postId={postId} />
            ))
          )}
          <Pagination page={page} totalPages={data.page.totalPages} onPageChange={setPage} />
        </>
      )}

      {authenticated && (
        <>
          <hr className="border-gray-800 my-6" />
          <CommentForm postId={postId} />
        </>
      )}
    </div>
  );
}
