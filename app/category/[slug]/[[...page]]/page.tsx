import { redirect } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchPostsByCategory } from "@/api/server/posts";
import { PostList } from "@/components/post/PostList";
import { PaginationNav } from "@/components/common/PaginationNav";

interface Props {
  params: Promise<{ slug: string; page?: string[] }>;
  searchParams: Promise<Record<string, never>>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, page: segments } = await params;
  const frontendPage = segments ? Number(segments[0]) : 1;
  try {
    const data = await fetchPostsByCategory(slug, { page: 0, size: 1 });
    const name = data.content[0]?.category?.displayName ?? slug;
    return {
      title: frontendPage > 1 ? `Category: ${name} — Page ${frontendPage}` : `Category: ${name}`,
      description: `Posts in the "${name}" category`,
    };
  } catch {
    return { title: "Category not found" };
  }
}

export default async function CategoryPostsPage({ params }: Props) {
  const { slug, page: segments } = await params;

  const frontendPage = segments ? Number(segments[0]) : 1;

  if (isNaN(frontendPage) || frontendPage < 1) redirect(`/category/${slug}`);
  // /category/slug/1 → canonical /category/slug
  if (segments && frontendPage === 1) redirect(`/category/${slug}`);

  const backendPage = frontendPage - 1;
  const size = 10;

  let data;
  try {
    data = await fetchPostsByCategory(slug, {
      page: backendPage,
      size,
      sort: ["createdDateTime,desc", "updatedDateTime,desc"],
    });
  } catch {
    notFound();
  }

  // Out-of-range page → redirect to last page
  if (data.page.totalPages > 0 && backendPage >= data.page.totalPages) {
    const lastFrontend = data.page.totalPages;
    const pathPart = lastFrontend === 1 ? "" : `/${lastFrontend}`;
    redirect(`/category/${slug}${pathPart}`);
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
      <PaginationNav
        totalPages={data.page.totalPages}
        page={backendPage}
        size={size}
        basePath={`/category/${slug}`}
      />
    </div>
  );
}
