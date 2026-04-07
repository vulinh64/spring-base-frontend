import { useState, useEffect, type SubmitEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { commentApi } from "@/api";
import { useSessionDraft } from "@/hooks/useSessionDraft";
import { MarkdownRenderer } from "@/components/common/MarkdownRenderer";
import { useToast } from "@/components/common/Toast";

interface CommentFormProps {
  postId: string;
}

export function CommentForm({ postId }: CommentFormProps) {
  const draftKey = `comment:${postId}`;
  const { updateDraft, restoreDraft, discardDraft } = useSessionDraft(draftKey);

  const draft = restoreDraft();
  const [content, setContent] = useState((draft?.content as string) ?? "");
  const [previewing, setPreviewing] = useState(false);
  const queryClient = useQueryClient();
  const toast = useToast();

  useEffect(() => {
    updateDraft({ content });
  }, [content, updateDraft]);

  const { mutate, isPending } = useMutation({
    mutationFn: () => commentApi.add(postId, { content }),
    onSuccess: () => {
      discardDraft();
      setContent("");
      setPreviewing(false);
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      toast.success("Comment posted.");
    },
    onError: () => toast.error("Failed to post comment."),
  });

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    mutate();
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6">
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
          {content.trim() ? (
            <MarkdownRenderer content={content} />
          ) : (
            <p className="text-gray-500 italic">Nothing to preview</p>
          )}
        </div>
      ) : (
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a comment... (Markdown supported)"
          rows={3}
          className="w-full rounded border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 font-['JetBrains_Mono']"
        />
      )}
      <div className="mt-2 flex justify-end">
        <button
          type="submit"
          disabled={isPending || !content.trim()}
          className="rounded bg-blue-600 px-4 py-1.5 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isPending ? "Posting..." : "Post Comment"}
        </button>
      </div>
    </form>
  );
}
