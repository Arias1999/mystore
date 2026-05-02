"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

type Product = { id: string; name: string; category: string; price: number; stock: number; image_url: string | null };

export function InventoryManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const supabase = createClient();

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, category, price, stock, image_url")
        .order("name");
      if (error) {
        toast.error(`Failed to load products: ${error.message}`);
      } else {
        setProducts(data ?? []);
      }
      setLoading(false);
    }
    fetchProducts();
  }, []);

  async function handleSaveStock(product: Product) {
    const newStock = editing[product.id];
    if (newStock === undefined || newStock < 0) return;
    setSaving(product.id);
    const { error } = await supabase
      .from("products")
      .update({ stock: newStock, updated_at: new Date().toISOString() })
      .eq("id", product.id);
    if (error) {
      toast.error("Failed to update stock.");
    } else {
      toast.success(`${product.name} stock updated to ${newStock}.`);
      setProducts((prev) => prev.map((p) => p.id === product.id ? { ...p, stock: newStock } : p));
      setEditing((prev) => { const n = { ...prev }; delete n[product.id]; return n; });
    }
    setSaving(null);
  }

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const lowStock = products.filter((p) => p.stock <= 5).length;

  if (loading) return <p className="text-sm text-[var(--text-muted)]">Loading inventory...</p>;

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4">
          <p className="text-xs text-[var(--text-muted)]">Total Products</p>
          <p className="text-2xl font-bold text-[var(--text)]">{products.length}</p>
        </div>
        <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4">
          <p className="text-xs text-[var(--text-muted)]">Total Stock</p>
          <p className="text-2xl font-bold text-[var(--text)]">{products.reduce((s, p) => s + p.stock, 0)}</p>
        </div>
        <div className={`rounded-xl border p-4 ${lowStock > 0 ? "border-red-200 bg-red-50" : "border-[var(--line)] bg-[var(--surface)]"}`}>
          <p className="text-xs text-[var(--text-muted)]">Low Stock (≤5)</p>
          <p className={`text-2xl font-bold ${lowStock > 0 ? "text-red-600" : "text-[var(--text)]"}`}>{lowStock}</p>
        </div>
      </div>

      {/* Search */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search products..."
        className="h-10 w-full max-w-sm rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]"
      />

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-[var(--line)] bg-[var(--surface)]">
        <table className="min-w-full text-sm">
          <thead className="border-b border-[var(--line)] bg-[var(--surface-soft)] text-[var(--text-muted)]">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Product</th>
              <th className="px-4 py-3 text-left font-medium">Category</th>
              <th className="px-4 py-3 text-left font-medium">Price</th>
              <th className="px-4 py-3 text-left font-medium">Stock</th>
              <th className="px-4 py-3 text-left font-medium">Update Stock</th>
              <th className="px-4 py-3 text-left font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-[var(--text-muted)]">No products found.</td></tr>
            )}
            {filtered.map((p) => (
              <tr key={p.id} className="border-b border-[var(--line)] last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {p.image_url && <img src={p.image_url} alt={p.name} className="h-9 w-9 rounded-lg object-cover" />}
                    <span className="font-medium text-[var(--text)]">{p.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-[var(--text-muted)]">{p.category}</td>
                <td className="px-4 py-3 text-[var(--text)]">₱{p.price}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${p.stock <= 5 ? "bg-red-50 text-red-600" : p.stock <= 20 ? "bg-yellow-50 text-yellow-700" : "bg-green-50 text-green-700"}`}>
                    {p.stock} {p.stock <= 5 ? "⚠️" : ""}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    min={0}
                    value={editing[p.id] ?? p.stock}
                    onChange={(e) => setEditing((prev) => ({ ...prev, [p.id]: parseInt(e.target.value) || 0 }))}
                    className="h-9 w-24 rounded-lg border border-[var(--line)] bg-[var(--surface-soft)] px-3 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]"
                  />
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleSaveStock(p)}
                    disabled={saving === p.id || editing[p.id] === undefined || editing[p.id] === p.stock}
                    className="rounded-md bg-[var(--accent)] px-3 py-1 text-xs font-bold text-white disabled:opacity-40"
                  >
                    {saving === p.id ? "Saving..." : "Save"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
