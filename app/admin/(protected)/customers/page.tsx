import { CustomersManager } from "@/components/admin/customers-manager";

export default function CustomersPage() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-[var(--text)]">Customers</h2>
        <p className="text-sm text-[var(--text-muted)]">Review customer contacts, phone numbers, and total orders.</p>
      </div>
      <CustomersManager />
    </div>
  );
}
