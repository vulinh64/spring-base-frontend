import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePost, usePostRevisions } from "@/hooks/usePosts";
import { postApi } from "@/api";
import { Pagination } from "@/components/common/Pagination";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorBanner } from "@/components/common/ErrorBanner";
import { useToast } from "@/components/common/Toast";
import { formatDateTime } from "@/utils/date";

export function PostRevisionsPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading: loadingPost } = usePost(slug!);
  const [page, setPage] = useState(0);
  const { data, isLoading, error } = usePostRevisions(post?.id ?? "", { page, size: 10 });
  const queryClient = useQueryClient();
  const toast = useToast();
  const [confirmRevision, setConfirmRevision] = useState<number | null>(null);

  const applyMutation = useMutation({
    mutationFn: (revisionNumber: number) => postApi.applyRevision(post!.id, revisionNumber),
    onSuccess: () => {
      toast.success("Revision applied successfully.");
      queryClient.invalidateQueries({ queryKey: ["post", slug] });
      queryClient.invalidateQueries({ queryKey: ["postRevisions", post?.id] });
      setConfirmRevision(null);
    },
    onError: () => toast.error("Failed to apply revision."),
  });

  if (loadingPost || isLoading) return <LoadingSpinner />;
  if (error) return <ErrorBanner message="Failed to load revisions." />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-100">Post Revisions</h1>
        <Link
          to={`/post/${slug}`}
          className="text-sm text-gray-400 hover:text-gray-100"
        >
          Back to Post
        </Link>
      </div>

      {!data || data.content.length === 0 ? (
        <p className="text-gray-500 py-8 text-center">No revisions found.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700 text-left text-gray-400">
                  <th className="px-3 py-2 font-medium">#</th>
                  <th className="px-3 py-2 font-medium">Type</th>
                  <th className="px-3 py-2 font-medium">Title</th>
                  <th className="px-3 py-2 font-medium">Created</th>
                  <th className="px-3 py-2 font-medium" />
                </tr>
              </thead>
              <tbody>
                {data.content.map((rev) => (
                  <tr
                    key={rev.revisionNumber}
                    className="border-b border-gray-800 hover:bg-gray-900/50"
                  >
                    <td className="px-3 py-3 text-gray-300">{rev.revisionNumber}</td>
                    <td className="px-3 py-3">
                      <span className="rounded bg-gray-800 px-2 py-0.5 text-xs text-gray-400">
                        {rev.revisionType}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-gray-100">{rev.title}</td>
                    <td className="px-3 py-3 text-gray-400">
                      {formatDateTime(rev.revisionCreatedDateTime)}
                    </td>
                    <td className="px-3 py-3 text-right">
                      <button
                        onClick={() => setConfirmRevision(rev.revisionNumber)}
                        className="rounded border border-gray-700 px-3 py-1 text-xs text-gray-300 hover:bg-gray-800"
                      >
                        Apply
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={page} totalPages={data.page.totalPages} onPageChange={setPage} />
        </>
      )}

      {confirmRevision !== null && (
        <ConfirmDialog
          title="Apply Revision"
          message={`Apply revision #${confirmRevision} to this post? The current content will be replaced.`}
          confirmLabel="Apply"
          onConfirm={() => applyMutation.mutate(confirmRevision)}
          onCancel={() => setConfirmRevision(null)}
        />
      )}
    </div>
  );
}
