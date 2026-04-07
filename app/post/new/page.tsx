"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postApi } from "@/api";
import { useSessionDraft } from "@/hooks/useSessionDraft";
import { useToast } from "@/components/common/Toast";
import { AuthGuard } from "@/components/layout/AuthGuard";
import { PostEditorForm } from "@/components/post/PostEditorForm";
import type { PostCreationRequest } from "@/types";

const DRAFT_KEY = "post-new";

function PostNewPageInner() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const toast = useToast();
  const { discardDraft } = useSessionDraft(DRAFT_KEY);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <PostEditorForm
      draftKey={DRAFT_KEY}
      pageTitle="New Post"
      submitLabel="Create Post"
      pendingLabel="Creating..."
      onSubmit={createMutation.mutate}
      isPending={createMutation.isPending}
      error={error}
    />
  );
}

export default function PostNewPage() {
  return (
    <AuthGuard>
      <PostNewPageInner />
    </AuthGuard>
  );
}
