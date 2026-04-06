"use client";

import Link from "next/link";
import { useAuth } from "@/auth/AuthProvider";

export function NewPostLink() {
  const { authenticated } = useAuth();
  if (!authenticated) return null;

  return (
    <Link
      href="/post/new"
      className="flex items-center gap-3 rounded bg-blue-600 pl-3 pr-4 py-1.5 text-sm text-white hover:bg-blue-700"
    >
      <span>+</span>
      <span>New Post</span>
    </Link>
  );
}
