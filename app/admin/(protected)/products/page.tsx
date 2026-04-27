import { ProductsManager } from "@/components/admin/products-manager";

export default function ProductsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-[var(--text)]">Products</h2>
        <p className="text-sm text-[var(--text-muted)]">Create, update, and manage your inventory.</p>
      </div>
      <ProductsManager />
    </div>
  );
}
