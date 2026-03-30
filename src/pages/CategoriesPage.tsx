import { useState, type SubmitEvent } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCategories } from "@/hooks/useCategories";
import { useAuth } from "@/auth/AuthProvider";
import { categoryApi } from "@/api";
import { isAdmin } from "@/utils/roles";
import { Pagination } from "@/components/common/Pagination";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorBanner } from "@/components/common/ErrorBanner";
import { useToast } from "@/components/common/Toast";

export function CategoriesPage() {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [newName, setNewName] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { roles } = useAuth();
  const admin = isAdmin(roles);
  const queryClient = useQueryClient();
  const toast = useToast();

  const { data, isLoading, error } = useCategories({ page, size });

  const createMutation = useMutation({
    mutationFn: () => categoryApi.create({ displayName: newName }),
    onSuccess: () => {
      setNewName("");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category created.");
    },
    onError: () => toast.error("Failed to create category."),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => categoryApi.delete(id),
    onSuccess: () => {
      setDeleteId(null);
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category deleted.");
    },
    onError: () => toast.error("Failed to delete category."),
  });

  function handleCreate(e: SubmitEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    createMutation.mutate();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-100 mb-6">Categories</h1>

      {admin && (
        <form onSubmit={handleCreate} className="mb-6 flex gap-2">
          <input
            type="text"
            placeholder="New category name..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="flex-1 rounded border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={createMutation.isPending || !newName.trim()}
            className="rounded bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
          >
            {createMutation.isPending ? "Creating..." : "Create"}
          </button>
        </form>
      )}

      {isLoading && <LoadingSpinner />}
      {error && <ErrorBanner message="Failed to load categories." />}

      {data && (
        <>
          {data.content.length === 0 ? (
            <p className="text-gray-500 py-8 text-center">No categories found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {data.content.map((category) => (
                <Link
                  key={category.id}
                  to={`/category/${category.categorySlug}`}
                  className="rounded-lg border border-gray-800 bg-gray-900 p-4 flex items-start justify-between hover:border-gray-700 transition-colors"
                >
                  <div>
                    <h3 className="font-medium text-gray-100">
                      {category.displayName}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">{category.categorySlug}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {category.postCount} {category.postCount === 1 ? "post" : "posts"}
                    </p>
                  </div>
                  {admin && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setDeleteId(category.id);
                      }}
                      className="text-xs text-red-400 hover:text-red-300 shrink-0 ml-2"
                    >
                      Delete
                    </button>
                  )}
                </Link>
              ))}
            </div>
          )}
          <Pagination page={page} totalPages={data.page.totalPages} onPageChange={setPage} size={size} onSizeChange={setSize} sizeLabel="Categories per page:" />
        </>
      )}

      {deleteId && (
        <ConfirmDialog
          title="Delete Category"
          message="Are you sure you want to delete this category?"
          confirmLabel="Delete"
          onConfirm={() => deleteMutation.mutate(deleteId)}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}
