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
      className="rounded-lg border border-gray-800 bg-gray-900 p-5 hover:border-gray-700 transition-colors cursor-pointer"
    >
      <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
        {post.category && (
          <Link
            to={`/category/${post.category.categorySlug}`}
            onClick={(e) => e.stopPropagation()}
            className="rounded bg-blue-900/40 px-2 py-0.5 text-blue-400 hover:bg-blue-900/60 transition-colors"
          >
            {post.category.displayName}
          </Link>
        )}
          {post.author && (
            <span title={post.author.email} className="text-gray-400">
              {post.author.username}
            </span>
          )}
          <time>{formatDateTime(post.createdDateTime)}</time>
          {post.updatedDateTime !== post.createdDateTime && (
            <span className="italic">updated {formatDateTime(post.updatedDateTime)}</span>
          )}
        </div>

        <h2 className="text-lg font-semibold text-gray-100 group-hover:text-blue-400 transition-colors">
          {post.title}
        </h2>

        {post.excerpt && (
          <p className="mt-2 text-sm text-gray-400 line-clamp-2">{post.excerpt}</p>
        )}
    </article>
  );
}
