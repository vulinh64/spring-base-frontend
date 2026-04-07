import { redirect } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { fetchCategories } from "@/api/server/categories";
import { PaginationNav } from "@/components/common/PaginationNav";
import { CreateCategoryForm, DeleteCategoryButton } from "../categories-admin";

interface Props {
  params: Promise<{ page?: string[] }>;
  searchParams: Promise<{ size?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { page: segments } = await params;
  const frontendPage = segments ? Number(segments[0]) : 1;
  return {
    title: frontendPage > 1 ? `Categories — Page ${frontendPage}` : "Categories",
    description: "Browse all categories",
  };
}

export default async function CategoriesPage({ params, searchParams }: Props) {
  const { page: segments } = await params;
  const { size: sizeParam } = await searchParams;

  const frontendPage = segments ? Number(segments[0]) : 1;
  const size = Number(sizeParam || "10");

  if (isNaN(frontendPage) || frontendPage < 1) redirect("/categories");
  // /categories/1 → canonical /categories
  if (segments && frontendPage === 1) redirect("/categories");

  const backendPage = frontendPage - 1;

  const data = await fetchCategories({ page: backendPage, size });

  // Out-of-range page → redirect to last page
  if (data.page.totalPages > 0 && backendPage >= data.page.totalPages) {
    const lastFrontend = data.page.totalPages;
    const pathPart = lastFrontend === 1 ? "" : `/${lastFrontend}`;
    const sizePart = size !== 10 ? `?size=${size}` : "";
    redirect(`/categories${pathPart}${sizePart}`);
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
            <Link
              key={category.id}
              href={`/category/${category.categorySlug}`}
              className="rounded-lg border border-gray-800 bg-gray-900 p-4 flex items-start justify-between hover:border-gray-700 transition-colors"
            >
              <div>
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
              </div>
              <DeleteCategoryButton categoryId={category.id} />
            </Link>
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
