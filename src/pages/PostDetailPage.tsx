import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { usePost } from "@/hooks/usePosts";
import { useAuth } from "@/auth/AuthProvider";
import { postApi, subscriptionApi } from "@/api";
import { CommentList } from "@/components/comment/CommentList";
import { CategoryBadge } from "@/components/category/CategoryBadge";
import { MarkdownRenderer } from "@/components/common/MarkdownRenderer";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorBanner } from "@/components/common/ErrorBanner";
import { useToast } from "@/components/common/Toast";
import { formatDateTime } from "@/utils/date";

export function PostDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: post, isLoading, error } = usePost(slug!);
  const { authenticated, userId } = useAuth();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const toast = useToast();

  const deleteMutation = useMutation({
    mutationFn: () => postApi.delete(post!.id),
    onSuccess: () => {
      toast.success("Post deleted.");
      navigate("/");
    },
    onError: () => toast.error("Failed to delete post."),
  });

  const subscribePostMutation = useMutation({
    mutationFn: () => subscriptionApi.subscribeToPost(post!.id),
    onSuccess: () => toast.success("Subscribed to post."),
    onError: () => toast.error("Failed to subscribe."),
  });

  const subscribeUserMutation = useMutation({
    mutationFn: (authorId: string) => subscriptionApi.subscribeToUser(authorId),
    onSuccess: () => toast.success("Following author."),
    onError: () => toast.error("Failed to follow author."),
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorBanner message="Failed to load post." />;
  if (!post) return <ErrorBanner message="Post not found." />;

  const isAuthor = authenticated && userId === post.authorId;

  return (
    <article>
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
          {post.category && <CategoryBadge category={post.category} />}
          <time>{formatDateTime(post.createdDateTime)}</time>
          {post.updatedDateTime !== post.createdDateTime && (
            <span className="italic">updated {formatDateTime(post.updatedDateTime)}</span>
          )}
        </div>

        <h1 className="text-3xl font-bold text-gray-100 mb-3">{post.title}</h1>

        {post.author && (
          <p className="text-sm text-gray-400 mb-2">
            by{" "}
            <span title={post.author.email} className="text-gray-300 font-medium cursor-default">
              {post.author.username}
            </span>
          </p>
        )}

        {post.excerpt && (
          <p className="text-gray-400 text-lg">{post.excerpt}</p>
        )}

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {post.tags.map((tag) => (
              <span
                key={tag.id}
                className="rounded bg-gray-800 px-2 py-0.5 text-xs text-gray-400"
              >
                {tag.displayName}
              </span>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-3 mt-4">
          {isAuthor && (
            <>
              <Link
                to={`/post/${post.slug}/edit`}
                className="rounded border border-gray-700 px-3 py-1 text-sm text-gray-300 hover:bg-gray-800"
              >
                Edit
              </Link>
              <Link
                to={`/post/${post.slug}/revisions`}
                className="rounded border border-gray-700 px-3 py-1 text-sm text-gray-300 hover:bg-gray-800"
              >
                Revisions
              </Link>
              <button
                onClick={() => setShowDeleteDialog(true)}
                className="rounded border border-red-800 px-3 py-1 text-sm text-red-400 hover:bg-red-900/30"
              >
                Delete
              </button>
            </>
          )}

          {authenticated && !isAuthor && (
            <>
              <button
                onClick={() => subscribePostMutation.mutate()}
                disabled={subscribePostMutation.isPending || subscribePostMutation.isSuccess}
                className="rounded border border-gray-700 px-3 py-1 text-sm text-gray-300 hover:bg-gray-800 disabled:opacity-50"
              >
                {subscribePostMutation.isSuccess ? "Subscribed to Post" : "Subscribe to Post"}
              </button>
              <button
                onClick={() => subscribeUserMutation.mutate(post.authorId)}
                disabled={subscribeUserMutation.isPending || subscribeUserMutation.isSuccess}
                className="rounded border border-gray-700 px-3 py-1 text-sm text-gray-300 hover:bg-gray-800 disabled:opacity-50"
              >
                {subscribeUserMutation.isSuccess ? "Following Author" : "Follow Author"}
              </button>
            </>
          )}
        </div>
      </header>

      {/* Content */}
      <div className="mb-12">
        <MarkdownRenderer content={post.postContent} />
      </div>

      {/* Comments */}
      <section className="border-t border-gray-800 pt-8">
        <CommentList postId={post.id} commentCount={post.commentCount} />
      </section>

      {/* Delete confirmation */}
      {showDeleteDialog && (
        <ConfirmDialog
          title="Delete Post"
          message="Are you sure you want to delete this post? This action cannot be undone."
          confirmLabel="Delete"
          onConfirm={() => deleteMutation.mutate()}
          onCancel={() => setShowDeleteDialog(false)}
        />
      )}
    </article>
  );
}
