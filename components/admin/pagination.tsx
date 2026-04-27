type PaginationProps = {
  page: number;
  totalPages: number;
  onChange: (nextPage: number) => void;
};

export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-3 flex items-center justify-between gap-2">
      <p className="text-xs text-[var(--text-muted)]">
        Page {page} of {totalPages}
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
          className="rounded-md border border-[var(--line)] px-3 py-1.5 text-xs text-[var(--text)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onChange(page + 1)}
          className="rounded-md border border-[var(--line)] px-3 py-1.5 text-xs text-[var(--text)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
