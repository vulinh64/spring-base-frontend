"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/auth/AuthProvider";
import { postApi, subscriptionApi } from "@/api";
import { CommentList } from "@/components/comment/CommentList";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { useToast } from "@/components/common/Toast";

interface PostDetailClientProps {
  postId: string;
  postSlug: string;
  authorId: string;
  commentCount: number;
}

export function PostDetailClient({
  postId,
  postSlug,
  authorId,
  commentCount,
}: PostDetailClientProps) {
  const router = useRouter();
  const { authenticated, userId } = useAuth();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLDivElement>(null);
  const toast = useToast();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setBellOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const deleteMutation = useMutation({
    mutationFn: () => postApi.delete(postId),
    onSuccess: () => {
      toast.success("Post deleted.");
      router.push("/");
    },
    onError: () => toast.error("Failed to delete post."),
  });

  const subscribePostMutation = useMutation({
    mutationFn: () => subscriptionApi.subscribeToPost(postId),
    onSuccess: () => toast.success("Subscribed to post."),
    onError: () => toast.error("Failed to subscribe."),
  });

  const subscribeUserMutation = useMutation({
    mutationFn: () => subscriptionApi.subscribeToUser(authorId),
    onSuccess: () => toast.success("Following author."),
    onError: () => toast.error("Failed to follow author."),
  });

  const isAuthor = authenticated && userId === authorId;

  return (
    <>
      {/* Comments */}
      <section className="border-t border-gray-800 pt-8">
        <h2 className="text-xl font-semibold text-gray-100 mb-6">
          Discussion
        </h2>
        <CommentList postId={postId} commentCount={commentCount} />
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

      {/* Floating subscribe actions */}
      {authenticated && !isAuthor && (
        <>
          {/* Desktop: square bell FAB with dropdown */}
          <div
            className="hidden lg:block fixed bottom-8 right-8 z-50"
            ref={bellRef}
          >
            {bellOpen && (
              <div className="absolute bottom-full right-0 mb-2 w-44 rounded border border-gray-700 bg-gray-900 py-1 shadow-lg">
                <button
                  onClick={() => {
                    setBellOpen(false);
                    subscribePostMutation.mutate();
                  }}
                  disabled={
                    subscribePostMutation.isPending ||
                    subscribePostMutation.isSuccess
                  }
                  className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 disabled:opacity-50"
                >
                  {subscribePostMutation.isSuccess
                    ? "Subscribed to Post"
                    : "Subscribe to Post"}
                </button>
                <button
                  onClick={() => {
                    setBellOpen(false);
                    subscribeUserMutation.mutate();
                  }}
                  disabled={
                    subscribeUserMutation.isPending ||
                    subscribeUserMutation.isSuccess
                  }
                  className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 disabled:opacity-50"
                >
                  {subscribeUserMutation.isSuccess
                    ? "Following the Author"
                    : "Follow the Author"}
                </button>
              </div>
            )}
            <button
              onClick={() => setBellOpen((o) => !o)}
              className="flex items-center justify-center w-12 h-12 rounded-lg bg-gray-800 border border-gray-700 text-gray-400 shadow-lg hover:bg-gray-700 hover:text-gray-100 transition-colors"
              aria-label="Subscribe actions"
            >
              <BellIcon />
            </button>
          </div>

          {/* Mobile: stacked below TOC hamburger */}
          <div
            className="lg:hidden fixed z-50 flex flex-col"
            style={{ top: "calc(5rem + 42px)", right: 0 }}
          >
            <button
              onClick={() => subscribePostMutation.mutate()}
              disabled={
                subscribePostMutation.isPending ||
                subscribePostMutation.isSuccess
              }
              className="bg-gray-800 border border-r-0 border-b-0 border-gray-700 rounded-tl-md px-2 py-2.5 text-gray-400 hover:bg-gray-700 hover:text-gray-200 transition-colors shadow-lg flex items-center justify-center disabled:opacity-50"
              aria-label="Subscribe to post"
            >
              <BellIcon />
            </button>
            <button
              onClick={() => subscribeUserMutation.mutate()}
              disabled={
                subscribeUserMutation.isPending ||
                subscribeUserMutation.isSuccess
              }
              className="bg-gray-800 border border-r-0 border-gray-700 rounded-bl-md px-2 py-2.5 text-gray-400 hover:bg-gray-700 hover:text-gray-200 transition-colors shadow-lg flex items-center justify-center text-xs disabled:opacity-50"
              aria-label="Follow author"
            >
              ★
            </button>
          </div>
        </>
      )}

      {/* Floating author actions */}
      {isAuthor && (
        <>
          {/* Desktop: square pencil FAB with dropdown */}
          <div
            className="hidden lg:block fixed bottom-8 right-8 z-50"
            ref={menuRef}
          >
            {menuOpen && (
              <div className="absolute bottom-full right-0 mb-2 w-36 rounded border border-gray-700 bg-gray-900 py-1 shadow-lg">
                <Link
                  href={`/post/${postSlug}/edit`}
                  className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800"
                  onClick={() => setMenuOpen(false)}
                >
                  Edit
                </Link>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    setShowDeleteDialog(true);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-900/30"
                >
                  Delete
                </button>
                <hr className="border-gray-700 my-1" />
                <Link
                  href={`/post/${postSlug}/revisions`}
                  className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800"
                  onClick={() => setMenuOpen(false)}
                >
                  Revisions
                </Link>
              </div>
            )}
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="flex items-center justify-center w-12 h-12 rounded-lg bg-gray-800 border border-gray-700 text-gray-400 shadow-lg hover:bg-gray-700 hover:text-gray-100 transition-colors"
              aria-label="Post actions"
            >
              <PencilIcon />
            </button>
          </div>

          {/* Mobile: stacked below TOC hamburger */}
          <div
            className="lg:hidden fixed z-50 flex flex-col"
            style={{ top: "calc(5rem + 42px)", right: 0 }}
          >
            <Link
              href={`/post/${postSlug}/edit`}
              className="bg-gray-800 border border-r-0 border-b-0 border-gray-700 rounded-tl-md px-2 py-2.5 text-gray-400 hover:bg-gray-700 hover:text-gray-200 transition-colors shadow-lg flex items-center justify-center"
              aria-label="Edit post"
            >
              <PencilIcon />
            </Link>
            <Link
              href={`/post/${postSlug}/revisions`}
              className="bg-gray-800 border border-r-0 border-b-0 border-gray-700 px-2 py-2.5 text-gray-400 hover:bg-gray-700 hover:text-gray-200 transition-colors shadow-lg flex items-center justify-center text-xs"
              aria-label="Revisions"
            >
              ↺
            </Link>
            <button
              onClick={() => setShowDeleteDialog(true)}
              className="bg-gray-800 border border-r-0 border-gray-700 rounded-bl-md px-2 py-2.5 text-red-400 hover:bg-red-900/30 transition-colors shadow-lg flex items-center justify-center text-xs"
              aria-label="Delete post"
            >
              ✕
            </button>
          </div>
        </>
      )}

    </>
  );
}

function PencilIcon() {
  return (
    <svg
      className="w-6 h-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H8v-2.414a2 2 0 01.586-1.414z"
      />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg
      className="w-6 h-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
      />
    </svg>
  );
}
