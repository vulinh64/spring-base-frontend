"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postApi } from "@/api";
import { usePost } from "@/hooks/usePosts";
import { useSessionDraft } from "@/hooks/useSessionDraft";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorBanner } from "@/components/common/ErrorBanner";
import { useToast } from "@/components/common/Toast";
import { AuthGuard } from "@/components/layout/AuthGuard";
import { PostEditorForm } from "@/components/post/PostEditorForm";
import type { PostCreationRequest } from "@/types";

function PostEditPageInner() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const toast = useToast();

  const draftKey = `post-edit:${slug}`;
  const { discardDraft } = useSessionDraft(draftKey);
  const [error, setError] = useState<string | null>(null);

  const { data: post, isLoading, error: postError } = usePost(slug);

  const editMutation = useMutation({
    mutationFn: (request: PostCreationRequest) => postApi.edit(post!.id, request),
    onSuccess: (_response, request) => {
      const destinationSlug = request.slug || slug;
      discardDraft();
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", slug] });
      if (destinationSlug !== slug) {
        queryClient.invalidateQueries({ queryKey: ["post", destinationSlug] });
      }
      toast.success("Post updated.");
      router.push(`/post/${destinationSlug}`);
    },
    onError: () => setError("Failed to update post."),
  });

  if (isLoading) return <LoadingSpinner />;
  if (postError || !post) return <ErrorBanner message="Failed to load post." />;

  return (
    <PostEditorForm
      draftKey={draftKey}
      pageTitle="Edit Post"
      submitLabel="Save Changes"
      pendingLabel="Saving..."
      initialValues={{
        title: post.title,
        excerpt: post.excerpt ?? "",
        slug: post.slug ?? "",
        postContent: post.postContent ?? "",
        categoryId: post.category?.id ?? "00000000-0000-0000-0000-000000000000",
        tagsInput: post.tags?.map((t) => t.displayName).join(", ") ?? "",
      }}
      onSubmit={editMutation.mutate}
      isPending={editMutation.isPending}
      error={error}
    />
  );
}

export default function PostEditPage() {
  return (
    <AuthGuard>
      <PostEditPageInner />
    </AuthGuard>
  );
}
