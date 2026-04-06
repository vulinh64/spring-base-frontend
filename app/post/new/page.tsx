"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postApi } from "@/api";
import { useCategories } from "@/hooks/useCategories";
import { useSessionDraft } from "@/hooks/useSessionDraft";
import { MarkdownEditor } from "@/components/common/MarkdownEditor";
import { MarkdownRenderer } from "@/components/common/MarkdownRenderer";
import { ErrorBanner } from "@/components/common/ErrorBanner";
import { useToast } from "@/components/common/Toast";
import { AuthGuard } from "@/components/layout/AuthGuard";
import type { PostCreationRequest } from "@/types";

function PostNewPageInner() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const toast = useToast();
  const { data: categories } = useCategories({ size: 100 });

  const draftKey = "post-new";
  const { updateDraft, restoreDraft, discardDraft } =
    useSessionDraft(draftKey);

  const draft = restoreDraft();
  const [title, setTitle] = useState((draft?.title as string) ?? "");
  const [excerpt, setExcerpt] = useState((draft?.excerpt as string) ?? "");
  const [slug, setSlug] = useState((draft?.slug as string) ?? "");
  const [postContent, setPostContent] = useState(
    (draft?.postContent as string) ?? ""
  );
  const [categoryId, setCategoryId] = useState(
    (draft?.categoryId as string) ?? ""
  );
  const [tagsInput, setTagsInput] = useState(
    (draft?.tagsInput as string) ?? ""
  );
  const [error, setError] = useState<string | null>(null);
  const [previewing, setPreviewing] = useState(false);

  useEffect(() => {
    updateDraft({ title, excerpt, slug, postContent, categoryId, tagsInput });
  }, [title, excerpt, slug, postContent, categoryId, tagsInput, updateDraft]);

  const createMutation = useMutation({
    mutationFn: (request: PostCreationRequest) => postApi.create(request),
    onSuccess: (response) => {
      discardDraft();
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post created.");
      router.push(`/post/${response.data.slug}`);
    },
    onError: () => setError("Failed to create post."),
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const request: PostCreationRequest = {
      title,
      excerpt,
      slug,
      postContent,
      categoryId: categoryId || undefined,
      tags: tags.length > 0 ? tags : undefined,
    };
    createMutation.mutate(request);
  }

  const selectedCategory = categories?.content.find(
    (c) => c.id === categoryId
  );
  const parsedTags = tagsInput
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  if (previewing) {
    return (
      <div>
        <button
          onClick={() => setPreviewing(false)}
          className="mb-6 rounded border border-gray-700 px-4 py-1.5 text-sm text-gray-300 hover:bg-gray-800"
        >
          &larr; Back to Editor
        </button>
        <article>
          <header className="mb-8">
            <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
              {selectedCategory && (
                <span className="rounded bg-blue-900/40 px-2 py-0.5 text-blue-400">
                  {selectedCategory.displayName}
                </span>
              )}
            </div>
            <h1 className="text-3xl font-bold text-gray-100 mb-3">
              {title || "Untitled"}
            </h1>
            {excerpt && <p className="text-gray-400 text-lg">{excerpt}</p>}
            {parsedTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {parsedTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded bg-gray-800 px-2 py-0.5 text-xs text-gray-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>
          <div className="mb-12">
            {postContent.trim() ? (
              <MarkdownRenderer content={postContent} />
            ) : (
              <p className="text-gray-500 italic">No content to preview</p>
            )}
          </div>
        </article>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-100 mb-6">New Post</h1>
      {error && (
        <div className="mb-4">
          <ErrorBanner message={error} />
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Title
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Slug
          </label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="auto-generated-if-empty"
            className="w-full rounded border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Excerpt
          </label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={2}
            className="w-full rounded border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Category
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full rounded border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">None</option>
            {categories?.content.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.displayName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="java, spring, tutorial"
            className="w-full rounded border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Content
          </label>
          <MarkdownEditor content={postContent} onChange={setPostContent} />
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="rounded bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {createMutation.isPending ? "Creating..." : "Create Post"}
          </button>
          <button
            type="button"
            onClick={() => setPreviewing(true)}
            className="rounded border border-gray-700 px-5 py-2 text-sm text-gray-300 hover:bg-gray-800"
          >
            Preview
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded border border-gray-700 px-5 py-2 text-sm text-gray-300 hover:bg-gray-800"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default function PostNewPage() {
  return (
    <AuthGuard>
      <PostNewPageInner />
    </AuthGuard>
  );
}
