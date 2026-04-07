"use client";

import { useRouter } from "next/navigation";
import { Pagination } from "./Pagination";

const DEFAULT_SIZE = 10;

interface PaginationNavProps {
  totalPages: number;
  page: number;
  size: number;
  basePath: string;
  showSizeChanger?: boolean;
  sizeLabel?: string;
}

export function PaginationNav({
  totalPages,
  page,
  size,
  basePath,
  showSizeChanger,
  sizeLabel,
}: PaginationNavProps) {
  const router = useRouter();

  function navigate(newBackendPage: number, newSize: number) {
    const frontendPage = newBackendPage + 1;
    const pathPart = frontendPage === 1 ? "" : `/${frontendPage}`;
    const sizePart = newSize !== DEFAULT_SIZE ? `?size=${newSize}` : "";
    router.push(`${basePath}${pathPart}${sizePart}`);
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
