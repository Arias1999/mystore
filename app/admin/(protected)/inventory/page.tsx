"use client";
import { InventoryManager } from "@/components/admin/inventory-manager";

export default function InventoryPage() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-[var(--text)]">Inventory</h2>
        <p className="text-sm text-[var(--text-muted)]">Monitor and update stock levels for all products.</p>
      </div>
      <InventoryManager />
    </div>
  );
}
