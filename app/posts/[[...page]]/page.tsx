import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { fetchPosts } from "@/api/server/posts";
import { PostList } from "@/components/post/PostList";
import { PaginationNav } from "@/components/common/PaginationNav";
import { NewPostLink } from "../new-post-link";

interface Props {
  params: Promise<{ page?: string[] }>;
  searchParams: Promise<{ size?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { page: segments } = await params;
  const frontendPage = segments ? Number(segments[0]) : 1;
  return {
    title: frontendPage > 1 ? `Posts — Page ${frontendPage}` : "Posts",
    description: "Browse all blog posts",
  };
}

export default async function PostsPage({ params, searchParams }: Props) {
  const { page: segments } = await params;
  const { size: sizeParam } = await searchParams;

  const frontendPage = segments ? Number(segments[0]) : 1;
  const size = Number(sizeParam || "10");

  if (isNaN(frontendPage) || frontendPage < 1) redirect("/posts");
  // /posts/1 → canonical /posts
  if (segments && frontendPage === 1) redirect("/posts");

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
    const sizePart = size !== 10 ? `?size=${size}` : "";
    redirect(`/posts${pathPart}${sizePart}`);
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
