"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/auth/AuthProvider";
import { categoryApi } from "@/api";
import { isAdmin } from "@/utils/roles";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { useToast } from "@/components/common/Toast";

export function CreateCategoryForm() {
  const { roles } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const [newName, setNewName] = useState("");

  const createMutation = useMutation({
    mutationFn: () => categoryApi.create({ displayName: newName }),
    onSuccess: () => {
      setNewName("");
      router.refresh();
      toast.success("Category created.");
    },
    onError: () => toast.error("Failed to create category."),
  });

  if (!isAdmin(roles)) return null;

  function handleCreate(e: FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    createMutation.mutate();
  }

  return (
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
  );
}

export function DeleteCategoryButton({
  categoryId,
}: {
  categoryId: string;
}) {
  const { roles } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const [showConfirm, setShowConfirm] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: () => categoryApi.delete(categoryId),
    onSuccess: () => {
      setShowConfirm(false);
      router.refresh();
      toast.success("Category deleted.");
    },
    onError: () => toast.error("Failed to delete category."),
  });

  if (!isAdmin(roles)) return null;

  return (
    <>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setShowConfirm(true);
        }}
        className="text-xs text-red-400 hover:text-red-300 shrink-0 ml-2"
      >
        Delete
      </button>
      {showConfirm && (
        <ConfirmDialog
          title="Delete Category"
          message="Are you sure you want to delete this category?"
          confirmLabel="Delete"
          onConfirm={() => deleteMutation.mutate()}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}
