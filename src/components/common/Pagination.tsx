interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 py-4">
      <button
        className="rounded border border-gray-700 px-3 py-1 text-sm text-gray-300 hover:bg-gray-800 disabled:opacity-40"
        disabled={page === 0}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </button>
      <span className="text-sm text-gray-400">
        {page + 1} / {totalPages}
      </span>
      <button
        className="rounded border border-gray-700 px-3 py-1 text-sm text-gray-300 hover:bg-gray-800 disabled:opacity-40"
        disabled={page >= totalPages - 1}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </button>
    </div>
  );
}
