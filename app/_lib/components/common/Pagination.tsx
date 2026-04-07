import { Hr } from "./Hr";

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  size?: number;
  onSizeChange?: (size: number) => void;
  sizeLabel?: string;
}

export function Pagination({ page, totalPages, onPageChange, size, onSizeChange, sizeLabel = "Per page:" }: PaginationProps) {
  if (totalPages <= 1 && !onSizeChange) return null;

  return (
    <div className="flex flex-col gap-3 py-4">
    <Hr />
    <div className="flex items-center justify-end gap-4">
      <div className="flex items-center gap-2">
        <button
          className="rounded border border-gray-700 px-3 py-1 text-sm text-gray-300 hover:bg-gray-800 disabled:opacity-40"
          disabled={page === 0}
          onClick={() => onPageChange(page - 1)}
        >
          <span className="hidden sm:inline">&laquo; Previous</span>
          <span className="sm:hidden">&laquo;</span>
        </button>
        <span className="text-sm text-gray-400">
          {page + 1} / {totalPages}
        </span>
        <button
          className="rounded border border-gray-700 px-3 py-1 text-sm text-gray-300 hover:bg-gray-800 disabled:opacity-40"
          disabled={page >= totalPages - 1}
          onClick={() => onPageChange(page + 1)}
        >
          <span className="hidden sm:inline">Next &raquo;</span>
          <span className="sm:hidden">&raquo;</span>
        </button>
      </div>

      {onSizeChange && size !== undefined && (
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="hidden sm:inline">{sizeLabel}</span>
          {PAGE_SIZE_OPTIONS.map((s) => (
            <button
              key={s}
              className={`rounded border px-2 py-1 text-sm transition-colors ${
                size === s
                  ? "border-blue-500 bg-blue-600 text-white"
                  : "border-gray-700 text-gray-300 hover:bg-gray-800"
              }`}
              onClick={() => onSizeChange(s)}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
    </div>
  );
}
