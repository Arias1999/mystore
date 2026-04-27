import { OrdersManager } from "@/components/admin/orders-manager";

export default function OrdersPage() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-[var(--text)]">Orders</h2>
        <p className="text-sm text-[var(--text-muted)]">Track purchases and update status (Pending, Delivered, Cancelled).</p>
      </div>
      <OrdersManager />
    </div>
  );
}
