import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  label: string;
  value: string;
  icon: LucideIcon;
  hint?: string;
};

export function StatCard({ label, value, icon: Icon, hint }: StatCardProps) {
  return (
    <div className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm text-[var(--text-muted)]">{label}</p>
        <div className="rounded-md bg-[var(--surface-soft)] p-2 text-[var(--accent)]">
          <Icon size={16} />
        </div>
      </div>
      <p className="text-2xl font-semibold text-[var(--text)]">{value}</p>
      {hint ? <p className="mt-2 text-xs text-[var(--text-muted)]">{hint}</p> : null}
    </div>
  );
}
