"use client";
import { RidersManager } from "@/components/admin/riders-manager";

export default function RidersPage() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-[var(--text)]">Riders</h2>
        <p className="text-sm text-[var(--text-muted)]">Manage delivery riders and assign orders for delivery.</p>
      </div>
      <RidersManager />
    </div>
  );
}
