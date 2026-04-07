"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useCategories } from "@/hooks/useCategories";
import { useSessionDraft } from "@/hooks/useSessionDraft";
import { MarkdownEditor } from "@/components/common/MarkdownEditor";
import { MarkdownRenderer } from "@/components/common/MarkdownRenderer";
import { ErrorBanner } from "@/components/common/ErrorBanner";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import type { PostCreationRequest } from "@/types";

interface InitialValues {
  title: string;
  excerpt: string;
  slug: string;
  postContent: string;
  categoryId: string;
  tagsInput: string;
}

interface PostEditorFormProps {
  draftKey: string;
  pageTitle: string;
  submitLabel: string;
  pendingLabel: string;
  initialValues?: InitialValues;
  defaultDirty?: boolean;
  onSubmit: (request: PostCreationRequest) => void;
  isPending: boolean;
  error: string | null;
}

export function PostEditorForm({
  draftKey,
  pageTitle,
  submitLabel,
  pendingLabel,
  initialValues,
  defaultDirty = false,
  onSubmit,
  isPending,
  error,
}: PostEditorFormProps) {
  const router = useRouter();
  const { data: categories } = useCategories({ size: 100 });
  const { updateDraft, restoreDraft } = useSessionDraft(draftKey);

  const draft = restoreDraft();
  const [title, setTitle] = useState((draft?.title as string) ?? initialValues?.title ?? "");
  const [excerpt, setExcerpt] = useState((draft?.excerpt as string) ?? initialValues?.excerpt ?? "");
  const [slug, setSlug] = useState((draft?.slug as string) ?? initialValues?.slug ?? "");
  const [postContent, setPostContent] = useState((draft?.postContent as string) ?? initialValues?.postContent ?? "");
  const [categoryId, setCategoryId] = useState((draft?.categoryId as string) ?? initialValues?.categoryId ?? "00000000-0000-0000-0000-000000000000");
  const [tagsInput, setTagsInput] = useState((draft?.tagsInput as string) ?? initialValues?.tagsInput ?? "");
  const [previewing, setPreviewing] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);

  // Snapshot of field values at mount — used to determine if anything has changed
  const [baseline] = useState({ title, excerpt, slug, postContent, categoryId, tagsInput });

  const isDirty =
    defaultDirty ||
    title !== baseline.title ||
    excerpt !== baseline.excerpt ||
    slug !== baseline.slug ||
    postContent !== baseline.postContent ||
    categoryId !== baseline.categoryId ||
    tagsInput !== baseline.tagsInput;

  // Warn before browser close / refresh / hard navigation
  useEffect(() => {
    if (!isDirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = ""; // Required for Chrome < 119 and Firefox
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  // Intercept browser back/forward button (soft navigation via History API)
  useEffect(() => {
    if (!isDirty) return;

    // Push a guard entry so the back button hits us before actually leaving
    history.pushState(null, "", window.location.href);

    const handlePopState = () => {
      // Re-push so the URL stays correct while the dialog is open
      history.pushState(null, "", window.location.href);
      setShowLeaveConfirm(true);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [isDirty]);

  useEffect(() => {
    updateDraft({ title, excerpt, slug, postContent, categoryId, tagsInput });
  }, [title, excerpt, slug, postContent, categoryId, tagsInput, updateDraft]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const tags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
    onSubmit({
      title,
      excerpt,
      slug,
      postContent,
      categoryId,
      tags: tags.length > 0 ? tags : undefined,
    });
  }

  function handleCancel() {
    if (isDirty) {
      setShowLeaveConfirm(true);
    } else {
      router.back();
    }
  }

  const selectedCategory = categories?.content.find((c) => c.id === categoryId);
  const parsedTags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);

  const inputCls =
    "w-full rounded border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";

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
                  <span key={tag} className="rounded bg-gray-800 px-2 py-0.5 text-xs text-gray-400">
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
      {showLeaveConfirm && (
        <ConfirmDialog
          title="Discard changes?"
          message="You have unsaved changes. If you leave, they will be lost."
          confirmLabel="Leave"
          onConfirm={() => {
            setShowLeaveConfirm(false);
            // Go back twice: once past the guard entry we pushed, once to the actual previous page
            history.go(-2);
          }}
          onCancel={() => setShowLeaveConfirm(false)}
        />
      )}

      <h1 className="text-2xl font-bold text-gray-100 mb-6">{pageTitle}</h1>
      {error && (
        <div className="mb-4">
          <ErrorBanner message={error} />
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Slug</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="auto-generated-if-empty"
            className={`${inputCls} placeholder-gray-500`}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Excerpt</label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={2}
            className={inputCls}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className={inputCls}
          >
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
            className={`${inputCls} placeholder-gray-500`}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Content</label>
          <MarkdownEditor content={postContent} onChange={setPostContent} />
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isPending}
            className="rounded bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isPending ? pendingLabel : submitLabel}
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
            onClick={handleCancel}
            className="rounded border border-gray-700 px-5 py-2 text-sm text-gray-300 hover:bg-gray-800"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
