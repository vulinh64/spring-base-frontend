import { redirect } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { fetchCategories } from "@/api/server/categories";
import { PaginationNav } from "@/components/common/PaginationNav";
import { CreateCategoryForm, DeleteCategoryButton } from "../categories-admin";
import { parsePageSegments, parsePageSize, sizeQuery } from "@/utils/pagination";

interface Props {
  params: Promise<{ page?: string[] }>;
  searchParams: Promise<{ size?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { page: segments } = await params;
  const frontendPage = parsePageSegments(segments) ?? 1;
  return {
    title: frontendPage > 1 ? `Categories — Page ${frontendPage}` : "Categories",
    description: "Browse all categories",
  };
}

export default async function CategoriesPage({ params, searchParams }: Props) {
  const { page: segments } = await params;
  const { size: sizeParam } = await searchParams;

  const frontendPage = parsePageSegments(segments);
  const size = parsePageSize(sizeParam);

  if (frontendPage === null || size === null) redirect("/categories");
  // /categories/1 → canonical /categories
  if (segments && frontendPage === 1) redirect(`/categories${sizeQuery(size)}`);

  const backendPage = frontendPage - 1;

  const data = await fetchCategories({ page: backendPage, size });

  // Out-of-range page → redirect to last page
  if (data.page.totalPages > 0 && backendPage >= data.page.totalPages) {
    const lastFrontend = data.page.totalPages;
    const pathPart = lastFrontend === 1 ? "" : `/${lastFrontend}`;
    redirect(`/categories${pathPart}${sizeQuery(size)}`);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-100 mb-6">Categories</h1>

      <CreateCategoryForm />

      {data.content.length === 0 ? (
        <p className="text-gray-500 py-8 text-center">No categories found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {data.content.map((category) => (
            <div
              key={category.id}
              className="rounded-lg border border-gray-800 bg-gray-900 p-4 flex items-start justify-between hover:border-gray-700 transition-colors"
            >
              <Link
                href={`/category/${category.categorySlug}`}
                className="min-w-0 flex-1"
              >
                <h3 className="font-medium text-gray-100">
                  {category.displayName}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {category.categorySlug}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {category.postCount}{" "}
                  {category.postCount === 1 ? "post" : "posts"}
                </p>
              </Link>
              <DeleteCategoryButton categoryId={category.id} />
            </div>
          ))}
        </div>
      )}

      <PaginationNav
        totalPages={data.page.totalPages}
        page={backendPage}
        size={size}
        basePath="/categories"
        showSizeChanger
        sizeLabel="Categories per page:"
      />
    </div>
  );
}
