import { ReportsManager } from "@/components/admin/reports-manager";

export default function AnalyticsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-[var(--text)]">Analytics</h2>
        <p className="text-sm text-[var(--text-muted)]">Sales chart, best-selling products, and revenue overview.</p>
      </div>
      <ReportsManager />
    </div>
  );
}
