"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Pagination } from "./Pagination";

interface PaginationNavProps {
  totalPages: number;
  showSizeChanger?: boolean;
  sizeLabel?: string;
}

export function PaginationNav({
  totalPages,
  showSizeChanger,
  sizeLabel,
}: PaginationNavProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") || "0");
  const size = Number(searchParams.get("size") || "10");

  function navigate(newPage: number, newSize: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    params.set("size", String(newSize));
    router.push(`?${params.toString()}`);
  }

  return (
    <Pagination
      page={page}
      totalPages={totalPages}
      onPageChange={(p) => navigate(p, size)}
      size={showSizeChanger ? size : undefined}
      onSizeChange={showSizeChanger ? (s) => navigate(0, s) : undefined}
      sizeLabel={sizeLabel}
    />
  );
}
