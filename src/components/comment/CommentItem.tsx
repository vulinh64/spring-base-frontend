import { useState, type FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { SingleCommentResponse } from "@/types";
import { commentApi } from "@/api";
import { MarkdownRenderer } from "@/components/common/MarkdownRenderer";
import { formatDateTime } from "@/utils/date";

interface CommentItemProps {
  comment: SingleCommentResponse;
  postId: string;
}

export function CommentItem({ comment, postId }: CommentItemProps) {
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(comment.content);
  const [previewing, setPreviewing] = useState(false);
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () => commentApi.edit(comment.id, { content }),
    onSuccess: () => {
      setEditing(false);
      setPreviewing(false);
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    mutate();
  }

  return (
    <div className="rounded-lg border border-gray-700 p-4 mb-3 transition-[border-color,box-shadow] duration-200 hover:border-blue-500 hover:shadow-[0_0_8px_rgba(59,130,246,0.3)]">
      {editing ? (
        <form onSubmit={handleSubmit}>
          <div className="flex gap-2 mb-2 text-xs">
            <button
              type="button"
              onClick={() => setPreviewing(false)}
              className={`px-2 py-0.5 rounded ${!previewing ? "bg-gray-700 text-gray-100" : "text-gray-400 hover:text-gray-200"}`}
            >
              Write
            </button>
            <button
              type="button"
              onClick={() => setPreviewing(true)}
              className={`px-2 py-0.5 rounded ${previewing ? "bg-gray-700 text-gray-100" : "text-gray-400 hover:text-gray-200"}`}
            >
              Preview
            </button>
          </div>
          {previewing ? (
            <div className="min-h-[4.5rem] rounded border border-gray-700 bg-gray-800 px-3 py-2 text-sm prose prose-sm prose-invert max-w-none">
              <MarkdownRenderer content={content} />
            </div>
          ) : (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={3}
              className="w-full rounded border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          )}
          <div className="mt-2 flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                setPreviewing(false);
                setContent(comment.content);
              }}
              className="rounded border border-gray-700 px-3 py-1 text-xs text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending || !content.trim()}
              className="rounded bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isPending ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="text-sm text-gray-300 prose prose-sm prose-invert max-w-none">
            <MarkdownRenderer content={comment.content} />
          </div>
          <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
            {comment.author && (
              <span title={comment.author.email} className="font-medium text-gray-400">
                {comment.author.username}
              </span>
            )}
            <time>{formatDateTime(comment.createdDateTime)}</time>
            {comment.isEdited && <span className="italic">(edited)</span>}
            <button
              onClick={() => setEditing(true)}
              className="text-gray-500 hover:text-gray-300"
            >
              Edit
            </button>
          </div>
        </>
      )}
    </div>
  );
}
