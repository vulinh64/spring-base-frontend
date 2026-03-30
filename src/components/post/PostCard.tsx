import { Link, useNavigate } from "react-router-dom";
import type { PrefetchPostProjection } from "@/types";
import { formatDateTime } from "@/utils/date";

interface PostCardProps {
  post: PrefetchPostProjection;
}

export function PostCard({ post }: PostCardProps) {
  const navigate = useNavigate();

  return (
    <article
      onClick={() => navigate(`/post/${post.slug}`)}
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
            to={`/category/${post.category.categorySlug}`}
            onClick={(e) => e.stopPropagation()}
            className="rounded bg-blue-900/40 px-2 py-0.5 text-xs text-blue-400 hover:bg-blue-900/60 transition-colors"
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
        <hr className="border-gray-800" />
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
