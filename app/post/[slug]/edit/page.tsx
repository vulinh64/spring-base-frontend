"use client";

import { useParams } from "next/navigation";
import { usePost } from "@/hooks/usePosts";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorBanner } from "@/components/common/ErrorBanner";
import { AuthGuard } from "@/components/layout/AuthGuard";
import { PostEditSession } from "@/components/post/PostEditSession";

function PostEditPageInner() {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading, error } = usePost(slug);
  if (isLoading) return <LoadingSpinner />;
  if (!post) return <ErrorBanner message={error ? "Failed to load post." : "Post not found."} />;
  return <PostEditSession key={post.id} post={post} draftKey={`post-edit:${slug}`} />;
}
export default function PostEditPage() {
  return <AuthGuard><PostEditPageInner /></AuthGuard>;
}
