"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { PrefetchPostProjection } from "@/types";
import { formatDateTime } from "@/utils/date";
import { Hr } from "@/components/common/Hr";

interface PostCardProps {
  post: PrefetchPostProjection;
}

export function PostCard({ post }: PostCardProps) {
  const router = useRouter();

  return (
    <article
      onClick={() => router.push(`/post/${post.slug}`)}
      className="rounded-lg border border-gray-800 bg-gray-900 p-5 hover:border-gray-700 transition-colors cursor-pointer flex flex-col gap-4"
    >
      {/* Top row: author + category */}
      <div className="flex items-center gap-2">
        {post.author && (
          <span title={post.author.email} className="text-xs text-gray-400">
            {post.author.username}
          </span>
        )}
        {post.category && (
          <Link
            href={`/category/${post.category.categorySlug}`}
            onClick={(e) => e.stopPropagation()}
            className={`rounded px-2 py-0.5 text-xs transition-colors ${
              post.category.id === "00000000-0000-0000-0000-000000000000"
                ? "bg-red-900/40 text-red-400 hover:bg-red-900/60"
                : "bg-blue-900/40 text-blue-400 hover:bg-blue-900/60"
            }`}
          >
            {post.category.displayName}
          </Link>
        )}
      </div>

      {/* Title + excerpt */}
      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-gray-100">
          {post.title}
        </h2>
        {post.excerpt && (
          <p className="text-sm text-gray-400 line-clamp-2">{post.excerpt}</p>
        )}
      </div>

      {/* Footer */}
      <div className="flex flex-col gap-2 mt-auto">
        <Hr />
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <time>{formatDateTime(post.createdDateTime)}</time>
          {post.updatedDateTime !== post.createdDateTime && (
            <span className="italic">updated {formatDateTime(post.updatedDateTime)}</span>
          )}
        </div>
      </div>
    </article>
  );
}
