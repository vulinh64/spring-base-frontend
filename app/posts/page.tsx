import type { Metadata } from "next";
import { fetchPosts } from "@/api/server/posts";
import { PostList } from "@/components/post/PostList";
import { PaginationNav } from "@/components/common/PaginationNav";
import { NewPostLink } from "./new-post-link";

export const metadata: Metadata = {
  title: "Posts",
  description: "Browse all blog posts",
};

interface Props {
  searchParams: Promise<{ page?: string; size?: string }>;
}

export default async function PostsPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Number(params.page || "0");
  const size = Number(params.size || "10");

  const data = await fetchPosts({
    page,
    size,
    sort: ["createdDateTime,desc", "updatedDateTime,desc"],
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-100">Posts</h1>
        <NewPostLink />
      </div>

      <PostList posts={data.content} />
      <PaginationNav
        totalPages={data.page.totalPages}
        showSizeChanger
        sizeLabel="Posts per page:"
      />
    </div>
  );
}
