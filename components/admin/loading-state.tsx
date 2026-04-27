export function LoadingState({
  label = "Loading...",
  rows = 5,
}: {
  label?: string;
  rows?: number;
}) {
  return (
    <div className="space-y-3 rounded-lg border border-[var(--line)] bg-[var(--surface)] p-5">
      <p className="text-sm text-[var(--text-muted)]">{label}</p>
      <div className="space-y-2">
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            className="h-10 animate-pulse rounded-md bg-[color:color-mix(in_srgb,var(--surface-soft)_85%,transparent)]"
          />
        ))}
      </div>
    </div>
  );
}
