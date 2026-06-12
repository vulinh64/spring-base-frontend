import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { fetchPosts } from "@/api/server/posts";
import { PostList } from "@/components/post/PostList";
import { PaginationNav } from "@/components/common/PaginationNav";
import { NewPostLink } from "../new-post-link";
import { parsePageSegments, parsePageSize, sizeQuery } from "@/utils/pagination";

interface Props {
  params: Promise<{ page?: string[] }>;
  searchParams: Promise<{ size?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { page: segments } = await params;
  const frontendPage = parsePageSegments(segments) ?? 1;
  return {
    title: frontendPage > 1 ? `Posts — Page ${frontendPage}` : "Posts",
    description: "Browse all blog posts",
  };
}

export default async function PostsPage({ params, searchParams }: Props) {
  const { page: segments } = await params;
  const { size: sizeParam } = await searchParams;

  const frontendPage = parsePageSegments(segments);
  const size = parsePageSize(sizeParam);

  if (frontendPage === null || size === null) redirect("/posts");
  // /posts/1 → canonical /posts
  if (segments && frontendPage === 1) redirect(`/posts${sizeQuery(size)}`);

  const backendPage = frontendPage - 1;

  const data = await fetchPosts({
    page: backendPage,
    size,
    sort: ["createdDateTime,desc", "updatedDateTime,desc"],
  });

  // Out-of-range page → redirect to last page
  if (data.page.totalPages > 0 && backendPage >= data.page.totalPages) {
    const lastFrontend = data.page.totalPages;
    const pathPart = lastFrontend === 1 ? "" : `/${lastFrontend}`;
    redirect(`/posts${pathPart}${sizeQuery(size)}`);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-100">Posts</h1>
        <NewPostLink />
      </div>

      <PostList posts={data.content} />
      <PaginationNav
        totalPages={data.page.totalPages}
        page={backendPage}
        size={size}
        basePath="/posts"
        showSizeChanger
        sizeLabel="Posts per page:"
      />
    </div>
  );
}
