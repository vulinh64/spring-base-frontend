import type { Metadata } from "next";
import Link from "next/link";
import { fetchCategories } from "@/api/server/categories";
import { PaginationNav } from "@/components/common/PaginationNav";
import { CreateCategoryForm, DeleteCategoryButton } from "./categories-admin";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse all categories",
};

interface Props {
  searchParams: Promise<{ page?: string; size?: string }>;
}

export default async function CategoriesPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Number(params.page || "0");
  const size = Number(params.size || "10");

  const data = await fetchCategories({ page, size });

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
        showSizeChanger
        sizeLabel="Categories per page:"
      />
    </div>
  );
}
