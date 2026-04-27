export function ErrorState({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-[var(--danger)]/40 bg-[var(--surface)] p-6 text-sm text-[var(--danger)]">
      {message}
    </div>
  );
}
