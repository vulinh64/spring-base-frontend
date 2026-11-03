"use client";

import { useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { postApi } from "@/api";
import { useToast } from "@/components/common/Toast";
import { ApiError } from "@/api/client";
import { useSessionDraft } from "@/hooks/useSessionDraft";
import { useCategories } from "@/hooks/useCategories";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { PostEditorForm, type InitialValues } from "./PostEditorForm";
import type { PostCreationRequest, SinglePostResponse } from "@/types";

const values = (post: SinglePostResponse): InitialValues => ({
  title: post.title, slug: post.slug ?? "", excerpt: post.excerpt ?? "",
  postContent: post.postContent ?? "", categoryId: post.category?.id ?? "00000000-0000-0000-0000-000000000000",
  tagsInput: post.tags?.map(tag => tag.displayName).join(", ") ?? "",
});
const validVersion = (version: unknown): version is number => Number.isSafeInteger(version) && Number(version) >= 0;
const normalized = (key: string, value: string) => key === "tagsInput"
  ? JSON.stringify([...new Set(value.split(",").map(tag => tag.trim().toLowerCase()).filter(Boolean))].sort()) : value;

export function PostEditSession({ post, draftKey }: { post: SinglePostResponse; draftKey: string }) {
  const { restoreDraft, discardDraft } = useSessionDraft(draftKey);
  const [baseline, setBaseline] = useState<SinglePostResponse>(() => {
    const restored = restoreDraft()?.baseline as SinglePostResponse | undefined;
    return restored?.id === post.id ? restored : structuredClone(post);
  });
  const [initial, setInitial] = useState(() => values(post));
  const [generation, setGeneration] = useState(0);
  const [latest, setLatest] = useState<SinglePostResponse | null>(null);
  const [blocked, setBlocked] = useState(() => !!restoreDraft() && !restoreDraft()?.baseline);
  const [continuing, setContinuing] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirm, setConfirm] = useState(false);
  const busy = useRef(false);
  const fetching = useRef(false);
  const toast = useToast();
  const queryClient = useQueryClient();
  const { data: categories } = useCategories({ size: 100 });
  async function fetchLatest() {
    if (fetching.current) return;
    fetching.current = true;
    setPending(true);
    setError(null);
    try {
      const response = await postApi.getByIdentity(baseline.id, true);
      if (!validVersion(response.data.version)) throw new Error("Missing version");
      const snapshot = structuredClone(response.data);
      setLatest(snapshot);
      return snapshot;
    } catch (reason) {
      setError(reason instanceof ApiError && reason.status === 404 ? "This post was deleted. Your draft is preserved."
        : reason instanceof ApiError && [401, 403].includes(reason.status) ? "You no longer have permission to load this post. Your draft is preserved."
        : "Could not load the latest post and version. Your draft is preserved. Retry below.");
    } finally { fetching.current = false; setPending(false); }
  }
  async function save(request: PostCreationRequest) {
    if (busy.current || blocked || !validVersion(baseline.version)) return;
    busy.current = true;
    setPending(true);
    setError(null);
    try {
      await postApi.edit(baseline.id, { ...request, version: baseline.version });
      // Empty PATCH response: never permit a second save until a fresh snapshot is reviewed.
      setBlocked(true);
      setContinuing(false);
      setLatest(null);
      const saved = await fetchLatest();
      if (saved) {
        discardDraft(); setBaseline(saved); setInitial(values(saved));
        setGeneration(value => value + 1); setBlocked(false); setLatest(null);
        setError(null); toast.success("Post updated.");
      }
      void queryClient.invalidateQueries({ queryKey: ["posts"] });
      void queryClient.invalidateQueries({ queryKey: ["post"] });
    } catch (reason) {
      if (reason instanceof ApiError && reason.status === 409 && reason.errorCode === "M1005") {
        setBlocked(true); setLatest(null); setContinuing(false);
        await fetchLatest();
      } else {
        setError(reason instanceof ApiError && reason.status === 404 ? "This post was deleted. Your draft is preserved."
          : reason instanceof ApiError && reason.status === 403 ? "You no longer have permission to save this post. Your draft is preserved."
          : "Failed to update post. Your draft is preserved.");
      }
    } finally { busy.current = false; setPending(false); }
  }
  const button = "rounded border border-gray-600 px-3 py-2 text-sm hover:bg-gray-800 disabled:opacity-50";
  return <>
    {confirm && latest && <ConfirmDialog title="Discard changes?" message="Discard your entire draft and load the latest saved post?" confirmLabel="Discard and load latest" onCancel={() => setConfirm(false)} onConfirm={() => {
      discardDraft(); setBaseline(latest); setInitial(values(latest)); setGeneration(value => value + 1);
      setBlocked(false); setLatest(null); setConfirm(false); setError(null);
    }} />}
    <PostEditorForm key={generation} draftKey={draftKey} pageTitle="Edit Post" submitLabel="Save Changes" pendingLabel="Saving..." initialValues={initial}
      onSubmit={save} isPending={pending} saveBlocked={blocked || !validVersion(baseline.version)}
      draftMetadata={{ baseline }} error={error ?? (!validVersion(baseline.version) ? "The server did not provide a valid version. Saving is disabled." : null)}
      comparison={draft => blocked ? <section className="mb-6 space-y-3" aria-label="Post comparison">
        <p role="status">Saving is paused because the server snapshot changed or needs refreshing. Review the latest saved post. Your draft has been preserved.</p>
        {!latest ? <button type="button" className={button} disabled={pending} onClick={() => void fetchLatest()}>Retry loading latest</button> : <>
          <details open className="rounded border border-gray-700 p-3">
            <summary className="cursor-pointer font-semibold">Compare your changes with the latest saved post</summary>
            <p className="my-3 text-sm text-gray-400">- Your draft · + Latest saved. Copy text from the latest column into the editor to resolve changes.</p>
            {(Object.keys(draft) as (keyof InitialValues)[]).map(key => {
              const remote = values(latest), original = values(baseline);
              const localChanged = normalized(key, draft[key]) !== normalized(key, original[key]);
              const remoteChanged = normalized(key, remote[key]) !== normalized(key, original[key]);
              const differs = normalized(key, draft[key]) !== normalized(key, remote[key]);
              const display = (value: string) => key === "categoryId" ? categories?.content.find(category => category.id === value)?.displayName ?? [latest.category, baseline.category].find(category => category?.id === value)?.displayName ?? value : value;
              return <div key={key} className="my-4">
                <h3 className="font-semibold">{({ title: "Title", slug: "Slug", excerpt: "Excerpt", postContent: "Content", categoryId: "Category", tagsInput: "Tags" })[key]} — {localChanged && remoteChanged && differs ? "Overlapping changes" : localChanged && remoteChanged ? "Same changes" : localChanged ? "Local change" : remoteChanged ? "Remote change" : "Unchanged"}</h3>
                <div className="grid min-w-0 gap-2 md:grid-cols-2">
                  <div className="min-w-0 rounded bg-red-950/30 p-2"><h4>Your draft</h4><pre tabIndex={0} className="max-h-80 overflow-auto whitespace-pre-wrap break-words text-sm">{draft[key].split("\n").map(line => `- ${display(line)}`).join("\n")}</pre></div>
                  <div className="min-w-0 rounded bg-green-950/30 p-2"><h4>Latest saved</h4><pre tabIndex={0} className="max-h-80 overflow-auto whitespace-pre-wrap break-words text-sm">{remote[key].split("\n").map(line => `+ ${display(line)}`).join("\n")}</pre></div>
                </div>
              </div>;
            })}
          </details>
          <div className="flex flex-wrap gap-2">
            <button type="button" className={button} onClick={() => setConfirm(true)}>Cancel my edits and load latest</button>
            <button type="button" className={button} onClick={() => setContinuing(true)}>Compare and continue editing</button>
            {continuing && <button type="button" className={button} onClick={() => { setBaseline(latest); setBlocked(false); setLatest(null); setError(null); }}>Use this comparison as the new baseline</button>}
          </div>
        </>}
      </section> : null} />
  </>;
}
