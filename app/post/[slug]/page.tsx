import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { fetchPost } from "@/api/server/posts";
import { CategoryBadge } from "@/components/category/CategoryBadge";
import { MarkdownRenderer } from "@/components/common/MarkdownRenderer";
import { formatDateTime } from "@/utils/date";
import { TableOfContents } from "@/components/common/TableOfContents";
import { PostDetailClient } from "./post-detail-client";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = await fetchPost(slug);
    return {
      title: post.title,
      description: post.excerpt,
      openGraph: {
        title: post.title,
        description: post.excerpt,
        type: "article",
        publishedTime: post.createdDateTime,
        modifiedTime: post.updatedDateTime,
        authors: post.author ? [post.author.username] : [],
        tags: post.tags.map((t) => t.displayName),
      },
    };
  } catch {
    return { title: "Post not found" };
  }
}

export default async function PostDetailPage({ params }: Props) {
  const { slug } = await params;

  let post;
  try {
    post = await fetchPost(slug);
  } catch {
    notFound();
  }

  const headings = [...post.postContent.matchAll(/^## (.+)$/gm)].map((m) =>
    m[1].trim()
  );
  const hasToC = headings.length > 1;

  return (
    <div className={!hasToC ? "max-w-3xl mx-auto" : ""}>
      {/* Article + TOC row */}
      <div className="flex gap-10">
        <article className="min-w-0 flex-1">
          {/* Header */}
          <header className="mb-8 rounded-lg border border-gray-800 bg-gray-900 p-6 flex flex-col gap-4">
            {/* Author row */}
            <div className="text-sm text-gray-400">
              {post.author && (
                <>
                  by{" "}
                  <span
                    title={post.author.email}
                    className="text-gray-300 font-medium cursor-default"
                  >
                    {post.author.username}
                  </span>
                </>
              )}
            </div>

            {/* Category + title */}
            <div className="flex flex-col items-start gap-2">
              {post.category && <CategoryBadge category={post.category} />}
              <h1 className="text-3xl font-bold text-gray-100">{post.title}</h1>
            </div>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-gray-500">Tags:</span>
                {post.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="rounded-full border border-gray-700 px-3 py-0.5 text-xs text-gray-400"
                  >
                    {tag.displayName}
                  </span>
                ))}
              </div>
            )}

            {/* Dates */}
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <time>{formatDateTime(post.createdDateTime)}</time>
              {post.updatedDateTime !== post.createdDateTime && (
                <span className="italic">
                  updated {formatDateTime(post.updatedDateTime)}
                </span>
              )}
            </div>
          </header>

          {/* Content */}
          <div className="mb-12">
            <MarkdownRenderer content={post.postContent} />
          </div>
        </article>

        <TableOfContents headings={headings} />
      </div>

      {/* Comments + interactive elements — outside article, aligned to article width */}
      <div className={hasToC ? "lg:mr-[calc(256px+2.5rem)]" : ""}>
      <PostDetailClient
        postId={post.id}
        postSlug={post.slug}
        authorId={post.authorId}
        commentCount={post.commentCount}
      />
      </div>
    </div>
  );
}
