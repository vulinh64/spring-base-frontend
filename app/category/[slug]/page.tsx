import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchPostsByCategory } from "@/api/server/posts";
import { PostList } from "@/components/post/PostList";
import { PaginationNav } from "@/components/common/PaginationNav";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const data = await fetchPostsByCategory(slug, { page: 0, size: 1 });
    const name = data.content[0]?.category?.displayName ?? slug;
    return {
      title: `Category: ${name}`,
      description: `Posts in the "${name}" category`,
    };
  } catch {
    return { title: "Category not found" };
  }
}

export default async function CategoryPostsPage({
  params,
  searchParams,
}: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const page = Number(sp.page || "0");

  let data;
  try {
    data = await fetchPostsByCategory(slug, {
      page,
      size: 10,
      sort: ["createdDateTime,desc", "updatedDateTime,desc"],
    });
  } catch {
    notFound();
  }

  const totalElements = data.page.totalElements;
  const categoryName = data.content[0]?.category?.displayName ?? slug;

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/categories"
          className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
        >
          &larr; Back to categories
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-gray-100 mb-2">
        Category: {categoryName}
      </h1>

      <p className="text-sm text-gray-400 mb-6">
        Found {totalElements} {totalElements === 1 ? "post" : "posts"} for
        category &ldquo;{categoryName}&rdquo;
      </p>

      <PostList posts={data.content} />
      <PaginationNav totalPages={data.page.totalPages} />
    </div>
  );
}
